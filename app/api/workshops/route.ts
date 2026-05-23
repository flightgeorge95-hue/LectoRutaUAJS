import { type NextRequest, NextResponse } from "next/server"
import { Database, Workshop } from "@/lib/database"

// GET all workshops or by grade or by createdBy teacher
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const createdBy = searchParams.get("createdBy")

    let workshops
    if (createdBy) {
      await Database.connect()
      workshops = await Workshop.find({ createdBy, isActive: true }).lean()
    } else if (grade) {
      workshops = await Database.getWorkshopsByGrade(parseInt(grade))
    } else {
      workshops = await Database.getAllWorkshops()
    }

    return NextResponse.json({ workshops })
  } catch (error) {
    console.error("Error getting workshops:", error)
    return NextResponse.json({ error: "Error al obtener talleres" }, { status: 500 })
  }
}

// POST create new workshop
export async function POST(request: NextRequest) {
  try {
    const workshopData = await request.json()

    // Validate required fields
    if (!workshopData.title || !workshopData.grade || !workshopData.createdBy) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const workshop = await Database.createWorkshop(workshopData)

    return NextResponse.json({ success: true, workshop })
  } catch (error) {
    console.error("Error creating workshop:", error)
    return NextResponse.json({ error: "Error al crear taller" }, { status: 500 })
  }
}
