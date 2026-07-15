import { NextResponse } from "next/server"
import { SESSION_COOKIE_NAME } from "@/lib/session"

export async function POST() {
  try {
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
