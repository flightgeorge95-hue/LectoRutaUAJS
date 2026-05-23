import { type NextRequest, NextResponse } from "next/server"
import { Database, Student, WorkshopCompletion, StudentProgress } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId")
    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    await Database.connect()

    const [workshops, student, completions] = await Promise.all([
      Database.getStudentAssignedWorkshops(studentId),
      Student.findById(studentId).lean() as Promise<any>,
      WorkshopCompletion.find({ studentId })
        .populate("workshopId", "title subject difficulty")
        .sort({ completedAt: -1 })
        .lean() as Promise<any[]>,
    ])

    if (!student) {
      return NextResponse.json({ success: false, error: "Estudiante no encontrado", workshops: [], stats: null }, { status: 404 })
    }

    const totalPoints = student.points || 0
    const completedCount = completions.length
    const averageScore =
      completedCount > 0
        ? Math.round(completions.reduce((sum: number, c: any) => sum + (c.score || 0), 0) / completedCount)
        : 0
    const level = Math.max(1, Math.floor(totalPoints / 100) + 1)

    // Streak
    const uniqueDays = new Set(completions.map((c: any) => new Date(c.completedAt).toDateString()))
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      if (uniqueDays.has(d.toDateString())) streak++
      else break
    }

    // Competency breakdown
    const progressRecords = await StudentProgress.find({ studentId })
      .populate("questionId", "competence")
      .lean() as any[]

    const buckets: Record<string, { correct: number; total: number }> = {}
    for (const p of progressRecords) {
      const comp: string = (p.questionId as any)?.competence || ""
      if (!comp) continue
      if (!buckets[comp]) buckets[comp] = { correct: 0, total: 0 }
      buckets[comp].total++
      if (p.isCorrect) buckets[comp].correct++
    }
    const pct = (key: string) => {
      const b = buckets[key]
      return b && b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    // Mapa workshopId → datos de completación (estado + nota)
    const completionByWorkshop: Record<string, { status: string; finalGrade: number | null; score: number; completionId: string }> = {}
    for (const c of completions) {
      const wId = c.workshopId?._id?.toString() || c.workshopId?.toString() || ""
      if (wId && !completionByWorkshop[wId]) {
        completionByWorkshop[wId] = {
          completionId: c._id?.toString() || "",
          status: (c as any).status || "auto_graded",
          finalGrade: (c as any).finalGrade ?? null,
          score: c.score || 0,
        }
      }
    }

    const completedWorkshopIds = Object.keys(completionByWorkshop)

    const recentActivity = completions.slice(0, 5).map((c: any) => ({
      id: c._id?.toString() || "",
      type: "workshop",
      title: c.workshopId?.title || "Taller completado",
      score: c.score || 0,
      date: c.completedAt?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      workshops: workshops || [],
      completedWorkshopIds,
      completionByWorkshop,
      stats: {
        points: totalPoints,
        level,
        streak,
        completedWorkshops: completedCount,
        averageScore,
        recentActivity,
        competencyStats: {
          literal: pct("Identificar y entender contenidos locales"),
          inferential: pct("Comprender articulación del texto"),
          critical: pct("Reflexionar y evaluar críticamente"),
        },
      },
    })
  } catch (error: any) {
    console.error("Error workshops:", error?.message || error)
    return NextResponse.json({ success: false, error: "Error al obtener talleres", workshops: [], stats: null }, { status: 500 })
  }
}
