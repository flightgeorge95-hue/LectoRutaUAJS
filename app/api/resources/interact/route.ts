import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { resourceId, studentId, action } = await request.json()

    if (!resourceId || !studentId || !action) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    if (action === "like") {
      const result = await Database.toggleLikeResource(resourceId, studentId)
      return NextResponse.json({ success: true, ...result })
    }

    if (action === "save") {
      const result = await Database.toggleSaveResource(resourceId, studentId)
      return NextResponse.json({ success: true, ...result })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: "Error en la interacción" }, { status: 500 })
  }
}
