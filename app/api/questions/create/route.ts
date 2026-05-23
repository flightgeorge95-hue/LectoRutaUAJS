import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json()

    // Validate required fields
    const missingFields = []
    if (!questionData.workshopId) missingFields.push("workshopId")
    if (!questionData.questionText) missingFields.push("questionText")
    if (!questionData.competence) missingFields.push("competence")
    if (!questionData.referenceText) missingFields.push("referenceText")
    if (!questionData.explanation) missingFields.push("explanation")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos requeridos: ${missingFields.join(", ")}` },
        { status: 400 }
      )
    }

    // Build clean question data
    const cleanQuestionData = {
      workshopId: questionData.workshopId,
      questionNumber: questionData.questionNumber || 1,
      questionType: questionData.questionType || "multiple_choice",
      competence: questionData.competence,
      textType: questionData.textType || "Continuo informativo",
      referenceText: questionData.referenceText,
      questionText: questionData.questionText,
      options: questionData.options || [],
      correctAnswer: questionData.correctAnswer || "",
      explanation: questionData.explanation,
      hint: questionData.hint || "",
      difficulty: questionData.difficulty || "Media",
      category: questionData.category || "",
    }

    const question = await Database.createQuestion(cleanQuestionData)

    return NextResponse.json({
      success: true,
      question,
      message: "Pregunta creada exitosamente",
    })
  } catch (error: any) {
    console.error("Error creating question:", error?.message || error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json(
        { error: `Error de validación: ${messages.join(", ")}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Error al crear la pregunta" }, { status: 500 })
  }
}
