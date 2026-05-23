import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

// DELETE - Eliminar docente
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "ID de docente requerido" }, { status: 400 })
    }

    await Database.connect()
    await Database.deleteTeacherById(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Error al eliminar docente" }, { status: 500 })
  }
}

// PATCH - Actualizar docente
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID de docente requerido" }, { status: 400 })
    }

    await Database.connect()
    const updated = await Database.updateTeacherById(id, body)
    return NextResponse.json({ success: true, teacher: updated })
  } catch (error) {
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: "Error al actualizar docente" }, { status: 500 })
  }
}
