import { type NextRequest, NextResponse } from "next/server"
import { Database, Student, WorkshopCompletion, StudentProgress, Workshop } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const gradeParam = request.nextUrl.searchParams.get("grade")
    const grade = parseInt(gradeParam ?? "", 10)
    if (isNaN(grade) || ![10, 11].includes(grade)) {
      return NextResponse.json({
        success: true,
        students: [],
        gradeStats: { totalStudents: 0, averageScore: 0, completionRate: 0, needsAttention: 0, excellentCount: 0, totalCompletedWorkshops: 0 },
      })
    }

    await Database.connect()

    // Fetch students, their completions, progress records and workshops in parallel
    const students = await Student.find({ grade }).sort({ lastName: 1 }).lean() as any[]

    if (students.length === 0) {
      return NextResponse.json({ success: true, students: [], gradeStats: { totalStudents: 0, averageScore: 0, completionRate: 0, needsAttention: 0 } })
    }

    const studentIds = students.map((s: any) => s._id)

    const [allCompletions, allProgress, allWorkshops] = await Promise.all([
      WorkshopCompletion.find({ studentId: { $in: studentIds } }).lean() as Promise<any[]>,
      StudentProgress.find({ studentId: { $in: studentIds } })
        .populate("questionId", "competence")
        .lean() as Promise<any[]>,
      Workshop.find({ grade, isActive: true }).lean() as Promise<any[]>,
    ])

    // Build lookup maps
    const completionsByStudent: Record<string, any[]> = {}
    for (const c of allCompletions) {
      const sid = c.studentId.toString()
      if (!completionsByStudent[sid]) completionsByStudent[sid] = []
      completionsByStudent[sid].push(c)
    }

    const progressByStudent: Record<string, any[]> = {}
    for (const p of allProgress) {
      const sid = p.studentId.toString()
      if (!progressByStudent[sid]) progressByStudent[sid] = []
      progressByStudent[sid].push(p)
    }

    // Assigned workshops per student
    const assignedCountByStudent: Record<string, number> = {}
    for (const w of allWorkshops) {
      for (const assignedId of (w.assignedTo || [])) {
        const sid = assignedId.toString()
        assignedCountByStudent[sid] = (assignedCountByStudent[sid] || 0) + 1
      }
    }

    const pct = (buckets: Record<string, { correct: number; total: number }>, key: string) => {
      const b = buckets[key]
      return b && b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    const studentsWithStats = students.map((student: any) => {
      const sid = student._id.toString()
      const myCompletions = completionsByStudent[sid] || []
      const myProgress = progressByStudent[sid] || []

      const completedWorkshops = myCompletions.length
      const assignedWorkshops = assignedCountByStudent[sid] || 0
      const averageScore =
        completedWorkshops > 0
          ? Math.round(myCompletions.reduce((sum: number, c: any) => sum + (c.score || 0), 0) / completedWorkshops)
          : 0

      const lastActivity =
        myCompletions.length > 0
          ? new Date(Math.max(...myCompletions.map((c: any) => new Date(c.completedAt).getTime()))).toISOString()
          : null

      // Competency buckets
      const buckets: Record<string, { correct: number; total: number }> = {}
      for (const p of myProgress) {
        const comp: string = (p.questionId as any)?.competence || ""
        if (!comp) continue
        if (!buckets[comp]) buckets[comp] = { correct: 0, total: 0 }
        buckets[comp].total++
        if (p.isCorrect) buckets[comp].correct++
      }

      const literal = pct(buckets, "Identificar y entender contenidos locales")
      const inferential = pct(buckets, "Comprender articulación del texto")
      const critical = pct(buckets, "Reflexionar y evaluar críticamente")

      // Determine strengths and weaknesses
      const compValues = [
        { name: "Literal", value: literal },
        { name: "Inferencial", value: inferential },
        { name: "Crítica", value: critical },
      ]
      const withData = compValues.filter((c) => c.value > 0)
      const strongCompetencies = withData.filter((c) => c.value >= 70).map((c) => c.name)
      const weakCompetencies = withData.filter((c) => c.value < 60).map((c) => c.name)

      // Colombian grade: 1.0 + (score/100)*4.0
      const colombianGrade = parseFloat((1.0 + (averageScore / 100) * 4.0).toFixed(1))

      // Status — Colombian scale thresholds
      let status = "inactive"
      if (completedWorkshops > 0 && averageScore >= 75) {
        status = "excellent"
      } else if (completedWorkshops > 0 && averageScore >= 50) {
        status = "active"
      } else if ((completedWorkshops > 0 && averageScore < 50) || (completedWorkshops === 0 && assignedWorkshops > 0)) {
        status = "needs_attention"
      }
      // else inactive (completedWorkshops === 0 && assignedWorkshops === 0)

      // Reasons for needs_attention
      const needsAttentionReasons: string[] = []
      if (averageScore < 50 && completedWorkshops > 0) {
        needsAttentionReasons.push(`Nota promedio ${colombianGrade}/5.0 por debajo de 3.0 (reprobando)`)
      }
      if (completedWorkshops === 0 && assignedWorkshops > 0) {
        needsAttentionReasons.push("No ha completado ningún taller asignado")
      }
      if (completedWorkshops > 0 && assignedWorkshops >= 2 && completedWorkshops / assignedWorkshops < 0.5) {
        needsAttentionReasons.push(`Solo completó ${completedWorkshops} de ${assignedWorkshops} talleres`)
      }
      if (weakCompetencies.length >= 2) {
        needsAttentionReasons.push(`Competencias débiles: ${weakCompetencies.join(", ")}`)
      }

      return {
        id: sid,
        _id: sid,
        firstName: student.firstName,
        lastName: student.lastName,
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
        tarjetaIdentidad: student.tarjetaIdentidad,
        email: student.email,
        points: student.points || 0,
        level: Math.max(1, Math.floor((student.points || 0) / 100) + 1),
        completedWorkshops,
        assignedWorkshops,
        totalWorkshops: assignedWorkshops,
        averageScore,
        lastActivity,
        competencyStats: { literal, inferential, critical },
        strongCompetencies,
        weakCompetencies,
        status,
        colombianGrade,
        needsAttentionReasons,
      }
    })

    // Grade-level aggregate stats
    const gradeStudentsWithActivity = studentsWithStats.filter((s) => s.completedWorkshops > 0)
    const gradeAverageScore =
      gradeStudentsWithActivity.length > 0
        ? Math.round(gradeStudentsWithActivity.reduce((sum, s) => sum + s.averageScore, 0) / gradeStudentsWithActivity.length)
        : 0
    const totalAssigned = studentsWithStats.reduce((sum, s) => sum + s.assignedWorkshops, 0)
    const totalCompleted = studentsWithStats.reduce((sum, s) => sum + s.completedWorkshops, 0)
    const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0
    const needsAttention = studentsWithStats.filter((s) => s.status === "needs_attention" || s.status === "inactive").length

    return NextResponse.json({
      success: true,
      students: studentsWithStats,
      gradeStats: {
        totalStudents: students.length,
        averageScore: gradeAverageScore,
        completionRate,
        needsAttention,
        excellentCount: studentsWithStats.filter((s) => s.status === "excellent").length,
        totalCompletedWorkshops: totalCompleted,
      },
    })
  } catch (error: any) {
    console.error("Error teacher metrics:", error?.message || error)
    return NextResponse.json({ error: "Error al obtener métricas" }, { status: 500 })
  }
}
