import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME, type SessionPayload } from "@/lib/session"
import { Database } from "@/lib/database"

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

// Rutas de API protegidas y los roles permitidos.
// Se evalúan en orden y gana la primera que coincide, por eso las reglas
// específicas (crear, asignar, escribir) van antes que las generales.
// `methods` limita la regla a esos métodos HTTP; `exact` exige la ruta exacta.
type ApiRule = { path: string; roles: string[]; methods?: string[]; exact?: boolean }
const STAFF = ["teacher", "admin"]
const ALL = ["student", "teacher", "admin"]
const API_ROUTES: ApiRule[] = [
  { path: "/api/admin", roles: ["admin"] },
  // Solo docentes y administradores crean o asignan talleres
  { path: "/api/workshops/create", roles: STAFF },
  { path: "/api/workshops/assign", roles: STAFF },
  { path: "/api/workshops", exact: true, methods: ["POST"], roles: STAFF },
  { path: "/api/workshops", roles: ALL },
  // El banco de preguntas incluye respuestas correctas: nunca accesible para estudiantes
  { path: "/api/questions", roles: STAFF },
  // Los estudiantes leen recursos e interactúan (me gusta, guardar); publicar o borrar es del docente
  { path: "/api/resources/interact", roles: ALL },
  { path: "/api/resources", methods: ["POST", "PUT", "PATCH", "DELETE"], roles: STAFF },
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
  // 1) Verifica firma HMAC y expiración del JWT — una cookie manipulada se rechaza aquí
  const payload = await verifySessionToken(cookie)
  if (!payload?.sid) return null
  // 2) Verifica que la sesión siga activa en el servidor (se elimina al cerrar sesión).
  //    El proxy de Next.js 16 se ejecuta en Node.js, por lo que puede consultar MongoDB.
  const active = await Database.isSessionActive(payload.sid)
  return active ? payload : null
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
    const pathMatches = route.exact ? pathname === route.path : pathname.startsWith(route.path)
    const methodMatches = !route.methods || route.methods.includes(request.method)
    if (pathMatches && methodMatches) {
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
