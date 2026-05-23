import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { workshopId, questions } = await request.json()

    if (!workshopId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Datos incompletos o inválidos" }, { status: 400 })
    }

    // Validate each question has required fields
    for (const q of questions) {
      if (!q.questionText || !q.correctAnswer || !q.options || !q.referenceText) {
        return NextResponse.json({ error: "Preguntas con datos incompletos" }, { status: 400 })
      }
    }

    const created = await Database.createQuestionsFromJSON(workshopId, questions)

    return NextResponse.json({
      success: true,
      message: `${created.length} preguntas importadas exitosamente`,
      questions: created,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al importar preguntas" }, { status: 500 })
  }
}
