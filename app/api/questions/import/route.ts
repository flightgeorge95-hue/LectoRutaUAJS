import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { workshopId, questions } = await request.json()
    
    if (!workshopId || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const createdQuestions = await Database.createQuestionsFromJSON(workshopId, questions)
    
    return NextResponse.json({ 
      success: true, 
      count: createdQuestions.length,
      message: `${createdQuestions.length} preguntas importadas exitosamente` 
    })
  } catch (error) {
    console.error("Error importing questions:", error)
    return NextResponse.json({ error: "Error al importar preguntas" }, { status: 500 })
  }
}
