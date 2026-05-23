import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// GET /api/teacher/review/[completionId]
// Retorna detalle completo de una entrega para calificar
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ completionId: string }> }
) {
  try {
    const { completionId } = await params
    const detail = await Database.getCompletionDetail(completionId)

    if (!detail) {
      return NextResponse.json({ error: "Entrega no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...detail })
  } catch (error: any) {
    console.error("[teacher/review/[id]] GET Error:", error?.message)
    return NextResponse.json({ error: "Error al obtener detalle" }, { status: 500 })
  }
}

// POST /api/teacher/review/[completionId]
// Body: { teacherId, grades: [{ progressId, percentage (0-100), feedback? }] }
// Califica las preguntas abiertas y cierra la entrega con nota final
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ completionId: string }> }
) {
  try {
    const { completionId } = await params
    const body = await request.json()
    const { teacherId, grades } = body

    if (!teacherId || !grades || !Array.isArray(grades) || grades.length === 0) {
      return NextResponse.json({ error: "teacherId y grades requeridos" }, { status: 400 })
    }

    // Validar que cada porcentaje esté en rango 0-100
    for (const g of grades) {
      if (typeof g.percentage !== "number" || g.percentage < 0 || g.percentage > 100) {
        return NextResponse.json(
          { error: `Porcentaje inválido para pregunta ${g.progressId}: debe ser 0-100` },
          { status: 400 }
        )
      }
    }

    const result = await Database.gradeOpenAnswers(completionId, teacherId, grades)

    return NextResponse.json({
      success: true,
      message: "Calificación enviada exitosamente",
      finalGrade: result.finalGrade,
      percentageScore: result.percentageScore,
      pointsEarned: result.pointsEarned,
    })
  } catch (error: any) {
    console.error("[teacher/review/[id]] POST Error:", error?.message)
    return NextResponse.json({ error: "Error al calificar" }, { status: 500 })
  }
}
