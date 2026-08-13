import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions, type SessionPayload } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { tarjetaIdentidad, password } = await request.json()

    if (!tarjetaIdentidad || !password) {
      return NextResponse.json({ error: "Tarjeta de identidad y contraseña requeridas" }, { status: 400 })
    }

    await Database.connect()

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const student = (await Database.findStudentByTarjeta(tarjetaIdentidad)) as any

    if (!student) {
      await Database.logLoginAttempt(tarjetaIdentidad, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Tarjeta de identidad no encontrada" }, { status: 401 })
    }

    if (student.status && student.status !== "activo") {
      await Database.logLoginAttempt(tarjetaIdentidad, false, ipAddress, userAgent)
      const message =
        student.status === "retirado"
          ? "Este estudiante fue retirado de la institución. Contacta al administrador."
          : "Esta cuenta está inactiva. Contacta al administrador."
      return NextResponse.json({ error: message }, { status: 403 })
    }

    const isValidPassword = await bcrypt.compare(password, student.password)
    if (!isValidPassword) {
      await Database.logLoginAttempt(tarjetaIdentidad, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const sessionData: SessionPayload = {
      userId: student._id.toString(),
      userType: "student",
      studentId: student._id.toString(),
      firstName: student.firstName,
      lastName: student.lastName,
      grade: student.grade,
      tarjetaIdentidad: student.tarjetaIdentidad,
      points: student.points || 0,
      level: student.level || 1,
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await Database.createSession(student._id.toString(), randomUUID(), expiresAt, ipAddress, userAgent)
    await Database.logLoginAttempt(tarjetaIdentidad, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/student",
    })

    const signedToken = await createSessionToken(sessionData)
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, sessionCookieOptions)

    return response
  } catch (error) {
    console.error("Student login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
