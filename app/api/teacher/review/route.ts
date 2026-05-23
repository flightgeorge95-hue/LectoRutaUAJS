import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// GET /api/teacher/review?teacherId=xxx
// Retorna todas las entregas con preguntas abiertas pendientes de calificación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId requerido" }, { status: 400 })
    }

    const pending = await Database.getPendingReviews(teacherId)

    return NextResponse.json({ success: true, pending })
  } catch (error: any) {
    console.error("[teacher/review] Error:", error?.message)
    return NextResponse.json({ error: "Error al obtener revisiones pendientes" }, { status: 500 })
  }
}
