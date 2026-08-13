import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// GET - Obtener todos los docentes
export async function GET() {
  try {
    await Database.connect()
    const teachers = await Database.getAllTeachers()
    return NextResponse.json({ success: true, teachers })
  } catch (error) {
    console.error("Error getting teachers:", error)
    return NextResponse.json({ error: "Error al obtener docentes" }, { status: 500 })
  }
}

// POST - Crear nuevo docente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, cedula, password, email, institution, subject, gradesTeaching, enrollmentDate } = body

    if (!firstName || !lastName || !cedula || !password || !email || !institution || !subject || !gradesTeaching?.length) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const validGrades = (gradesTeaching as number[]).every((g) => [10, 11].includes(Number(g)))
    if (!validGrades) {
      return NextResponse.json({ error: "Los grados deben ser 10 y/o 11" }, { status: 400 })
    }

    await Database.connect()

    const teacher = await Database.createTeacherByAdmin({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      cedula: cedula.trim(),
      password,
      email: email.trim().toLowerCase(),
      institution: institution.trim(),
      subject: subject.trim(),
      gradesTeaching: gradesTeaching.map(Number),
      enrollmentDate: enrollmentDate || undefined,
    })

    return NextResponse.json({ success: true, teacher }, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes("ya está registrada")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Error al crear docente" }, { status: 500 })
  }
}
