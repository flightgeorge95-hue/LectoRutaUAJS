import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { workshopId, studentIds, dueDate } = await request.json()

    if (!workshopId || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // Fecha+hora límite opcional. Si no se envía, el taller no caduca.
    let parsedDueDate: Date | null = null
    if (dueDate) {
      parsedDueDate = new Date(dueDate)
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json({ error: "Fecha límite inválida" }, { status: 400 })
      }
    }

    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const session = cookie ? await verifySessionToken(cookie) : null
    const assignedBy = session?.teacherId

    await Database.assignWorkshopToStudents(workshopId, studentIds, { dueDate: parsedDueDate, assignedBy })

    return NextResponse.json({
      success: true,
      message: "Taller asignado exitosamente"
    })
  } catch (error) {
    console.error("Error assigning workshop:", error)
    return NextResponse.json({ error: "Error al asignar taller" }, { status: 500 })
  }
}
