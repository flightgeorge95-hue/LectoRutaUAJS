import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// DELETE - Eliminar estudiante
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "ID de estudiante requerido" }, { status: 400 })
    }

    await Database.connect()
    await Database.deleteStudentById(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Error al eliminar estudiante" }, { status: 500 })
  }
}

// PATCH - Actualizar estudiante
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID de estudiante requerido" }, { status: 400 })
    }

    await Database.connect()
    const updated = await Database.updateStudentById(id, body)
    return NextResponse.json({ success: true, student: updated })
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Error al actualizar estudiante" }, { status: 500 })
  }
}
