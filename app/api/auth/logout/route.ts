import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("auth-session")?.value

    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(atob(sessionCookie))
        // Session invalidation would happen here with database
      } catch (error) {
        // Invalid session data, continue with logout
      }
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set("auth-session", "", {
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
