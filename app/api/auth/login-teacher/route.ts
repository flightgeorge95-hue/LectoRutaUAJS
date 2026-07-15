import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions, type SessionPayload } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { cedula, password } = await request.json()

    if (!cedula || !password) {
      return NextResponse.json({ error: "Cédula y contraseña requeridas" }, { status: 400 })
    }

    await Database.connect()

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const teacher = (await Database.findTeacherByCedula(cedula)) as any

    if (!teacher) {
      await Database.logLoginAttempt(cedula, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Cédula no encontrada" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, teacher.password)

    if (!isValidPassword) {
      await Database.logLoginAttempt(cedula, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const sessionData: SessionPayload = {
      userId: teacher._id.toString(),
      userType: "teacher",
      teacherId: teacher._id.toString(),
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      cedula: teacher.cedula,
      institution: teacher.institution,
      subject: teacher.subject,
      gradesTeaching: teacher.gradesTeaching || [10, 11],
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await Database.createSession(teacher._id.toString(), randomUUID(), expiresAt, ipAddress, userAgent)
    await Database.logLoginAttempt(cedula, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/teacher",
    })

    const signedToken = await createSessionToken(sessionData)
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, sessionCookieOptions)

    return response
  } catch (error) {
    console.error("Teacher login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
