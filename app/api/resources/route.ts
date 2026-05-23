import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const type = searchParams.get("type")
    const category = searchParams.get("category")

    const filters: any = {}
    if (grade) filters.grade = parseInt(grade)
    if (type) filters.type = type
    if (category) filters.category = category

    const resources = await Database.getResources(filters)

    return NextResponse.json({ success: true, resources })
  } catch (error: any) {
    return NextResponse.json({ error: "Error al obtener recursos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title || !data.content || !data.type || !data.createdBy) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const resource = await Database.createResource(data)

    return NextResponse.json({ success: true, resource })
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear recurso" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get("id")

    if (!resourceId) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    await Database.deleteResource(resourceId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar recurso" }, { status: 500 })
  }
}
