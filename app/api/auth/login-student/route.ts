import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions, type SessionPayload } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    // JSON inválido se trata como petición vacía (400) en lugar de error interno
    const { tarjetaIdentidad, password } = await request.json().catch(() => ({}))

    // Solo se aceptan cadenas de texto: impide que operadores de MongoDB ({"$ne": null}) lleguen a la consulta
    if (typeof tarjetaIdentidad !== "string" || typeof password !== "string" || !tarjetaIdentidad || !password) {
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
    // El identificador de sesión (sid) se guarda en la base de datos y se firma dentro del JWT;
    // al cerrar sesión se elimina y el token deja de ser aceptado por el proxy.
    const sid = randomUUID()
    const sessionCreated = await Database.createSession(student._id.toString(), sid, expiresAt, ipAddress, userAgent)
    if (!sessionCreated) {
      return NextResponse.json({ error: "No fue posible iniciar la sesión. Intenta de nuevo." }, { status: 503 })
    }
    await Database.logLoginAttempt(tarjetaIdentidad, true, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: "/dashboard/student",
    })

    const signedToken = await createSessionToken({ ...sessionData, sid })
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, sessionCookieOptions)

    return response
  } catch (error) {
    console.error("Student login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
