import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// GET - Obtener todos los estudiantes
export async function GET() {
  try {
    await Database.connect()
    const students = await Database.getAllStudents()
    return NextResponse.json({ success: true, students })
  } catch (error) {
    console.error("Error getting students:", error)
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 })
  }
}

// POST - Crear nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, grade, tarjetaIdentidad, password, email, phoneNumber, birthDate, enrollmentDate } = body

    if (!firstName || !lastName || !grade || !tarjetaIdentidad || !password || !email || !phoneNumber || !birthDate) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (![10, 11].includes(Number(grade))) {
      return NextResponse.json({ error: "El grado debe ser 10 o 11" }, { status: 400 })
    }

    await Database.connect()

    const student = await Database.createStudentByAdmin({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade: Number(grade),
      tarjetaIdentidad: tarjetaIdentidad.trim(),
      password,
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      birthDate,
      enrollmentDate: enrollmentDate || undefined,
    })

    return NextResponse.json({ success: true, student }, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes("ya está registrada")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Error al crear estudiante" }, { status: 500 })
  }
}
