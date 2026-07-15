import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME, type SessionPayload } from "@/lib/session"

// Rutas de página protegidas y el rol requerido
const PAGE_ROUTES: { path: string; role: string }[] = [
  { path: "/dashboard/student", role: "student" },
  { path: "/dashboard/teacher", role: "teacher" },
  { path: "/dashboard/admin", role: "admin" },
  { path: "/exercise", role: "student" },
  { path: "/achievements", role: "student" },
  { path: "/analytics", role: "student" },
  { path: "/leaderboard", role: "student" },
  { path: "/teacher/review", role: "teacher" },
]

// Rutas de API protegidas y los roles permitidos
const API_ROUTES: { path: string; roles: string[] }[] = [
  { path: "/api/admin", roles: ["admin"] },
  { path: "/api/workshops", roles: ["student", "teacher", "admin"] },
  { path: "/api/questions", roles: ["student", "teacher", "admin"] },
  { path: "/api/students", roles: ["teacher", "admin"] },
  { path: "/api/teacher", roles: ["teacher", "admin"] },
  { path: "/api/teacher/review", roles: ["teacher", "admin"] },
  { path: "/api/student", roles: ["student", "teacher", "admin"] },
  { path: "/api/resources", roles: ["student", "teacher", "admin"] },
  { path: "/api/user", roles: ["student", "teacher", "admin"] },
]

async function getSession(request: NextRequest): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!cookie) return null
  // Verifica firma HMAC y expiración del JWT — una cookie manipulada se rechaza aquí
  return verifySessionToken(cookie)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession(request)

  // Verificar rutas de página
  for (const route of PAGE_ROUTES) {
    if (pathname.startsWith(route.path)) {
      // Sin sesión: dejar cargar la página para que muestre su formulario de login
      if (!session) {
        return NextResponse.next()
      }
      // Con sesión pero rol incorrecto: redirigir al dashboard correcto
      if (session.userType !== route.role) {
        return NextResponse.redirect(new URL(`/dashboard/${session.userType}`, request.url))
      }
      return NextResponse.next()
    }
  }

  // Verificar rutas de API
  for (const route of API_ROUTES) {
    if (pathname.startsWith(route.path)) {
      if (!session || !route.roles.includes(session.userType)) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      }
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exercise/:path*",
    "/teacher/:path*",
    "/achievements",
    "/analytics",
    "/leaderboard",
    "/api/admin/:path*",
    "/api/workshops/:path*",
    "/api/questions/:path*",
    "/api/teacher/:path*",
    "/api/students/:path*",
    "/api/student/:path*",
    "/api/resources/:path*",
    "/api/user/:path*",
  ],
}
