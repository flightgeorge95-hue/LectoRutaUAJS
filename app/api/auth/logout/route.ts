import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    // Revoca la sesión en el servidor: aunque alguien haya copiado el token,
    // el proxy lo rechazará porque su sid ya no existe en la colección `sessions`.
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      const session = await verifySessionToken(token)
      if (session?.sid) {
        await Database.revokeSession(session.sid)
      }
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
