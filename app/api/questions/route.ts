import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// GET questions by workshop
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = searchParams.get("workshopId")

    if (!workshopId) {
      return NextResponse.json({ error: "workshopId requerido" }, { status: 400 })
    }

    const questions = await Database.getQuestionsByWorkshop(workshopId)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error getting questions:", error)
    return NextResponse.json({ error: "Error al obtener preguntas" }, { status: 500 })
  }
}

// POST create new question
export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json()

    // Validate required fields
    if (!questionData.workshopId || !questionData.questionText || !questionData.correctAnswer) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const question = await Database.createQuestion(questionData)

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Error al crear pregunta" }, { status: 500 })
  }
}

// PUT update question
export async function PUT(request: NextRequest) {
  try {
    const { questionId, ...updateData } = await request.json()

    if (!questionId) {
      return NextResponse.json({ error: "questionId requerido" }, { status: 400 })
    }

    const question = await Database.updateQuestion(questionId, updateData)

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Error al actualizar pregunta" }, { status: 500 })
  }
}

// DELETE question
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get("questionId")

    if (!questionId) {
      return NextResponse.json({ error: "questionId requerido" }, { status: 400 })
    }

    await Database.deleteQuestion(questionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Error al eliminar pregunta" }, { status: 500 })
  }
}
