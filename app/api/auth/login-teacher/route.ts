import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

function generateSessionToken(): string {
  return randomUUID()
}

export async function POST(request: NextRequest) {
  try {
    const { cedula, password } = await request.json()

    if (!cedula || !password) {
      return NextResponse.json({ error: "Cédula y contraseña requeridas" }, { status: 400 })
    }

    await Database.connect()

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const teacher = await Database.findTeacherByCedula(cedula)

    if (!teacher) {
      await Database.logLoginAttempt(cedula, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Cédula no encontrada" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, teacher.password)

    if (!isValidPassword) {
      await Database.logLoginAttempt(cedula, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const sessionToken = generateSessionToken()

    const sessionData = {
      userId: teacher._id.toString(),
      userType: "teacher",
      teacherId: teacher._id.toString(),
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      cedula: teacher.cedula,
      institution: teacher.institution,
      subject: teacher.subject,
      gradesTeaching: teacher.gradesTeaching || [10, 11],
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await Database.createSession(teacher._id.toString(), sessionToken, expiresAt, ipAddress, userAgent)
    await Database.logLoginAttempt(cedula, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/teacher",
    })

    const encodedSession = btoa(JSON.stringify(sessionData))
    response.cookies.set("auth-session", encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Teacher login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
