import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions, type SessionPayload } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    // JSON inválido se trata como petición vacía (400) en lugar de error interno
    const { cedula, password } = await request.json().catch(() => ({}))

    // Solo se aceptan cadenas de texto: impide que operadores de MongoDB ({"$ne": null}) lleguen a la consulta
    if (typeof cedula !== "string" || typeof password !== "string" || !cedula || !password) {
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
    // El identificador de sesión (sid) se guarda en la base de datos y se firma dentro del JWT;
    // al cerrar sesión se elimina y el token deja de ser aceptado por el proxy.
    const sid = randomUUID()
    const sessionCreated = await Database.createSession(teacher._id.toString(), sid, expiresAt, ipAddress, userAgent)
    if (!sessionCreated) {
      return NextResponse.json({ error: "No fue posible iniciar la sesión. Intenta de nuevo." }, { status: 503 })
    }
    await Database.logLoginAttempt(cedula, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/teacher",
    })

    const signedToken = await createSessionToken({ ...sessionData, sid })
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, sessionCookieOptions)

    return response
  } catch (error) {
    console.error("Teacher login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
