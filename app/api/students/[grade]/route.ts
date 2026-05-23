import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ grade: string }> }) {
  try {
    const { grade: gradeParam } = await params
    const grade = Number.parseInt(gradeParam)

    if (![10, 11].includes(grade)) {
      return NextResponse.json({ error: "Grado inválido" }, { status: 400 })
    }

    const students = await Database.getStudentsByGrade(grade)

    return NextResponse.json({
      success: true,
      students,
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 })
  }
}
