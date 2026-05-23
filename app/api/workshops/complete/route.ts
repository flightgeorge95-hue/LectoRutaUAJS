import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, workshopId, answers, timeSpent } = body

    if (!studentId || !workshopId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    let correctCount = 0
    let openQuestionsCount = 0

    for (const answer of answers) {
      try {
        const isOpen = answer.questionType === "open_ended"
        if (isOpen) openQuestionsCount++

        await Database.recordStudentAnswer({
          studentId,
          workshopId,
          questionId: answer.questionId,
          selectedAnswer: isOpen ? "open" : (answer.selectedAnswer || ""),
          openAnswer: isOpen ? (answer.openAnswer || "") : undefined,
          isCorrect: isOpen ? false : (answer.isCorrect || false), // abiertas inician como false
          timeSpent: answer.timeSpent || 0,
        })

        if (!isOpen && answer.isCorrect) correctCount++
      } catch (err: any) {
        console.error(`[workshops/complete] Error guardando respuesta:`, err.message)
      }
    }

    const mcCount = answers.length - openQuestionsCount
    const autoScore = mcCount > 0 ? Math.round((correctCount / mcCount) * 100) : 0

    const completion = await Database.completeWorkshop({
      studentId,
      workshopId,
      score: autoScore,
      questionsAnswered: answers.length,
      totalQuestions: answers.length,
      openQuestionsCount,
      timeSpent: timeSpent || 0,
    })

    const hasOpen = openQuestionsCount > 0

    return NextResponse.json({
      success: true,
      completion,
      hasOpenQuestions: hasOpen,
      status: hasOpen ? "pending_review" : "auto_graded",
      results: {
        score: autoScore,
        correctAnswers: correctCount,
        totalQuestions: answers.length,
        openQuestionsCount,
        pointsEarned: hasOpen ? 0 : Math.floor(autoScore * 10),
        finalGrade: hasOpen ? null : parseFloat((1.0 + (autoScore / 100) * 4.0).toFixed(1)),
        message: hasOpen
          ? `Taller enviado. Las ${openQuestionsCount} pregunta(s) abierta(s) serán revisadas por tu docente.`
          : "¡Taller completado! Nota calculada automáticamente.",
      },
    })
  } catch (error: any) {
    console.error("Error interno:", error?.message || error)
    return NextResponse.json({ error: "Error al completar el taller" }, { status: 500 })
  }
}
