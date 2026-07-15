import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const workshopData = await request.json()


    // Validate required fields with specific error messages
    const missingFields = []
    if (!workshopData.title) missingFields.push("title")
    if (!workshopData.description) missingFields.push("description")
    if (!workshopData.subject) missingFields.push("subject")
    if (!workshopData.grade && workshopData.grade !== 0) missingFields.push("grade")
    if (!workshopData.createdBy) missingFields.push("createdBy")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos requeridos: ${missingFields.join(", ")}` },
        { status: 400 }
      )
    }

    // Ensure grade is a number and valid
    const grade = Number(workshopData.grade)
    if (![10, 11].includes(grade)) {
      return NextResponse.json({ error: "El grado debe ser 10 u 11" }, { status: 400 })
    }

    // Fecha límite opcional: validar formato si viene
    let dueDate: Date | null = null
    if (workshopData.dueDate) {
      dueDate = new Date(workshopData.dueDate)
      if (isNaN(dueDate.getTime())) {
        return NextResponse.json({ error: "Fecha límite inválida" }, { status: 400 })
      }
    }

    // Build clean workshop object
    const cleanWorkshopData = {
      title: workshopData.title.trim(),
      description: workshopData.description.trim(),
      subject: workshopData.subject,
      grade: grade,
      difficulty: workshopData.difficulty || "Intermedio",
      createdBy: workshopData.createdBy,
      dueDate,
    }


    const workshop = await Database.createWorkshop(cleanWorkshopData)


    return NextResponse.json({
      success: true,
      workshop,
      message: "Taller creado exitosamente"
    })
  } catch (error: any) {
    console.error("Error interno:", error?.message || error)

    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json(
        { error: `Error de validación: ${messages.join(", ")}` },
        { status: 400 }
      )
    }

    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: `Error en formato de datos: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Error al crear el taller" }, { status: 500 })
  }
}
