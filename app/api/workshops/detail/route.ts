import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = searchParams.get("workshopId")

    if (!workshopId) {
      return NextResponse.json({ error: "workshopId requerido" }, { status: 400 })
    }


    await Database.connect()

    // Get workshop
    const { Workshop } = await import("@/lib/database")
    const workshop = await Workshop.findById(workshopId).populate("createdBy").lean()

    if (!workshop) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 })
    }

    // Get questions for this workshop
    const questions = await Database.getQuestionsByWorkshop(workshopId)


    return NextResponse.json({
      success: true,
      workshop,
      questions,
    })
  } catch (error: any) {
    console.error("Error interno:", error?.message || error)
    return NextResponse.json({ error: "Error al obtener el taller" }, { status: 500 })
  }
}
