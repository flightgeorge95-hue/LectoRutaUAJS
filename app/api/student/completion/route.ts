import { type NextRequest, NextResponse } from "next/server"
import { Database, WorkshopCompletion, StudentProgress, Question } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const completionId = request.nextUrl.searchParams.get("completionId")
    if (!completionId) {
      return NextResponse.json({ error: "completionId requerido" }, { status: 400 })
    }

    await Database.connect()

    const completion = await WorkshopCompletion.findById(completionId).lean() as any
    if (!completion) {
      return NextResponse.json({ error: "Completion no encontrado" }, { status: 404 })
    }

    // Fetch all StudentProgress records for this student + workshop
    const progressRecords = await StudentProgress.find({
      studentId: completion.studentId,
      workshopId: completion.workshopId,
    })
      .populate("questionId")
      .lean() as any[]

    // Build answer maps keyed by questionId (MongoDB _id string)
    // selectedAnswer for MC is the letter (A/B/C/D), for open it's in openAnswer
    const answersByQuestionId: Record<string, {
      selectedAnswer: string
      openAnswer?: string
      isCorrect: boolean
      teacherGrade?: number
      teacherFeedback?: string
    }> = {}

    for (const p of progressRecords) {
      const qId = (p.questionId as any)?._id?.toString() || p.questionId?.toString() || ""
      if (qId) {
        answersByQuestionId[qId] = {
          selectedAnswer: p.selectedAnswer || "",
          openAnswer: p.openAnswer || "",
          isCorrect: !!p.isCorrect,
          teacherGrade: p.teacherGrade ?? undefined,
          teacherFeedback: p.teacherFeedback ?? undefined,
        }
      }
    }

    return NextResponse.json({
      success: true,
      completion: {
        id: completion._id?.toString(),
        score: completion.score,
        finalGrade: completion.finalGrade ?? null,
        status: completion.status,
        completedAt: completion.completedAt,
        timeSpent: completion.timeSpent ?? 0,
      },
      answersByQuestionId,
    })
  } catch (error: any) {
    console.error("[student/completion GET]", error?.message || error)
    return NextResponse.json({ error: "Error al obtener completion" }, { status: 500 })
  }
}
