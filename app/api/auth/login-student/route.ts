import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

function generateSessionToken(): string {
  return randomUUID()
}

export async function POST(request: NextRequest) {
  try {
    const { tarjetaIdentidad, password } = await request.json()

    if (!tarjetaIdentidad || !password) {
      return NextResponse.json({ error: "Tarjeta de identidad y contraseña requeridas" }, { status: 400 })
    }

    await Database.connect()

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const student = await Database.findStudentByTarjeta(tarjetaIdentidad)

    if (!student) {
      await Database.logLoginAttempt(tarjetaIdentidad, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Tarjeta de identidad no encontrada" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, student.password)
    if (!isValidPassword) {
      await Database.logLoginAttempt(tarjetaIdentidad, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const sessionToken = generateSessionToken()

    const sessionData = {
      userId: student._id.toString(),
      userType: "student",
      studentId: student._id.toString(),
      firstName: student.firstName,
      lastName: student.lastName,
      grade: student.grade,
      tarjetaIdentidad: student.tarjetaIdentidad,
      points: student.points || 0,
      level: student.level || 1,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await Database.createSession(student._id.toString(), sessionToken, expiresAt, ipAddress, userAgent)
    await Database.logLoginAttempt(tarjetaIdentidad, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/student",
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
    console.error("Student login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
