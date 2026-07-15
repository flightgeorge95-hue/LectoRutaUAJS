import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
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

    const admin = (await Database.verifyAdminPassword(cedula, password)) as any

    if (!admin) {
      await Database.logLoginAttempt(cedula, false, ipAddress, userAgent)
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
    }

    const sessionData: SessionPayload = {
      userId: admin._id.toString(),
      userType: "admin",
      adminId: admin._id.toString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
      cedula: admin.cedula,
      email: admin.email,
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await Database.createSession(admin._id.toString(), randomUUID(), expiresAt, ipAddress, userAgent)
    await Database.logLoginAttempt(cedula, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/admin",
    })

    const signedToken = await createSessionToken(sessionData)
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, sessionCookieOptions)

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
