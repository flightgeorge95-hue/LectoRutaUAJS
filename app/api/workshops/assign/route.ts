import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { workshopId, studentIds } = await request.json()
    
    if (!workshopId || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    await Database.assignWorkshopToStudents(workshopId, studentIds)
    
    return NextResponse.json({ 
      success: true,
      message: "Taller asignado exitosamente" 
    })
  } catch (error) {
    console.error("Error assigning workshop:", error)
    return NextResponse.json({ error: "Error al asignar taller" }, { status: 500 })
  }
}
