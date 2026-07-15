import { SignJWT, jwtVerify } from "jose"

// Sesión firmada con JWT (HS256). Compatible con Edge Runtime (middleware/proxy).
// El secreto DEBE definirse en producción vía variable de entorno SESSION_SECRET.

const SESSION_DURATION_SECONDS = 24 * 60 * 60 // 24 horas

export interface SessionPayload {
  userId: string
  userType: "student" | "teacher" | "admin"
  firstName: string
  lastName: string
  // Campos específicos por rol (opcionales)
  studentId?: string
  teacherId?: string
  adminId?: string
  grade?: number
  tarjetaIdentidad?: string
  cedula?: string
  email?: string
  institution?: string
  subject?: string
  gradesTeaching?: number[]
  points?: number
  level?: number
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET no está definida. Configúrala en las variables de entorno (Vercel → Settings → Environment Variables).")
    }
    // Solo para desarrollo local
    return new TextEncoder().encode("lectoruta-dev-secret-no-usar-en-produccion")
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export const SESSION_COOKIE_NAME = "auth-session"

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION_SECONDS,
}
