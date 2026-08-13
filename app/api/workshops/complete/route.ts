import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session"

// La calificación ocurre 100% en el servidor: el cliente solo envía qué opción
// eligió (índice) o su respuesta abierta. Nunca se confía en un "isCorrect"
// calculado en el navegador.
export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const session = cookie ? await verifySessionToken(cookie) : null

    if (!session || session.userType !== "student" || !session.studentId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { workshopId, answers, timeSpent } = body
    // El studentId viene de la sesión firmada, no del body: un estudiante
    // no puede enviar resultados a nombre de otro.
    const studentId = session.studentId

    if (!workshopId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    await Database.connect()

    // Defensa en profundidad: aunque el estudiante ya haya cargado el taller,
    // si caducó mientras lo resolvía no se acepta el envío.
    const expired = await Database.isWorkshopExpiredForStudent(workshopId, studentId)
    if (expired) {
      return NextResponse.json(
        { error: "Este taller ha caducado. Pídele a tu docente que lo reactive." },
        { status: 403 }
      )
    }

    const questions = await Database.getQuestionsByWorkshop(workshopId)
    const questionById = new Map<string, any>(questions.map((q: any) => [q._id.toString(), q]))

    let correctCount = 0
    let openQuestionsCount = 0
    const perQuestion: Record<string, {
      isCorrect: boolean
      correctIndex: number
      explanation: string
      selectedIndex: number | null
    }> = {}

    for (const answer of answers) {
      try {
        const question = questionById.get(answer.questionId?.toString())
        if (!question) continue

        const isOpen = question.questionType === "open_ended"
        if (isOpen) openQuestionsCount++

        let isCorrect = false
        let selectedLetter = ""
        let correctIndex = -1

        if (!isOpen && Array.isArray(question.options)) {
          const idx = typeof answer.selectedIndex === "number" ? answer.selectedIndex : -1
          selectedLetter = question.options[idx]?.letter || ""
          correctIndex = question.options.findIndex((opt: any) => opt.letter === question.correctAnswer)
          isCorrect = selectedLetter !== "" && selectedLetter === question.correctAnswer
          if (isCorrect) correctCount++
        }

        await Database.recordStudentAnswer({
          studentId,
          workshopId,
          questionId: answer.questionId,
          selectedAnswer: isOpen ? "open" : selectedLetter,
          openAnswer: isOpen ? (answer.openAnswer || "") : undefined,
          isCorrect: isOpen ? false : isCorrect, // abiertas inician como false hasta que el docente califique
          timeSpent: answer.timeSpent || 0,
        })

        perQuestion[answer.questionId.toString()] = {
          isCorrect,
          correctIndex,
          explanation: question.explanation || "",
          selectedIndex: isOpen ? null : (typeof answer.selectedIndex === "number" ? answer.selectedIndex : null),
        }
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
      perQuestion,
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
