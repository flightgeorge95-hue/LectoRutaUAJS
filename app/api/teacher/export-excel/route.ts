import { type NextRequest, NextResponse } from "next/server"
import { Database, Student, WorkshopCompletion, StudentProgress, Workshop } from "@/lib/database"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session"
import ExcelJS from "exceljs"
import fs from "fs"
import path from "path"

// Exporta un reporte académico de curso en Excel: un archivo profesional con
// el logo institucional, datos del docente que lo expide y, por estudiante,
// documento, edad, notas, progreso y fortalezas/falencias por competencia.
// Es un insumo de apoyo docente, no reemplaza el registro oficial de notas.

function calcAge(birthDate: any): number | null {
  if (!birthDate) return null
  const b = new Date(birthDate)
  if (isNaN(b.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
  return age
}

const STATUS_LABEL: Record<string, string> = {
  excellent: "Excelente",
  active: "Activo",
  needs_attention: "Requiere atención",
  inactive: "Sin actividad",
}

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const session = cookie ? await verifySessionToken(cookie) : null
    if (!session || (session.userType !== "teacher" && session.userType !== "admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const gradeParam = request.nextUrl.searchParams.get("grade")
    const grade = parseInt(gradeParam ?? "", 10)
    if (isNaN(grade) || ![10, 11].includes(grade)) {
      return NextResponse.json({ error: "Grado inválido" }, { status: 400 })
    }

    await Database.connect()

    const students = await Student.find({ grade }).sort({ lastName: 1 }).lean() as any[]
    const studentIds = students.map((s: any) => s._id)

    const [allCompletions, allProgress, allWorkshops] = await Promise.all([
      WorkshopCompletion.find({ studentId: { $in: studentIds } }).lean() as Promise<any[]>,
      StudentProgress.find({ studentId: { $in: studentIds } })
        .populate("questionId", "competence")
        .lean() as Promise<any[]>,
      Workshop.find({ grade, isActive: true }).lean() as Promise<any[]>,
    ])

    const completionsByStudent: Record<string, any[]> = {}
    for (const c of allCompletions) {
      const sid = c.studentId.toString()
      if (!completionsByStudent[sid]) completionsByStudent[sid] = []
      completionsByStudent[sid].push(c)
    }

    const progressByStudent: Record<string, any[]> = {}
    for (const p of allProgress) {
      const sid = p.studentId.toString()
      if (!progressByStudent[sid]) progressByStudent[sid] = []
      progressByStudent[sid].push(p)
    }

    const assignedCountByStudent: Record<string, number> = {}
    for (const w of allWorkshops) {
      for (const assignedId of (w.assignedTo || [])) {
        const sid = assignedId.toString()
        assignedCountByStudent[sid] = (assignedCountByStudent[sid] || 0) + 1
      }
    }

    const pct = (buckets: Record<string, { correct: number; total: number }>, key: string) => {
      const b = buckets[key]
      return b && b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    const rows = students.map((student: any) => {
      const sid = student._id.toString()
      const myCompletions = completionsByStudent[sid] || []
      const myProgress = progressByStudent[sid] || []

      const completedWorkshops = myCompletions.length
      const assignedWorkshops = assignedCountByStudent[sid] || 0
      const averageScore =
        completedWorkshops > 0
          ? Math.round(myCompletions.reduce((sum: number, c: any) => sum + (c.score || 0), 0) / completedWorkshops)
          : 0
      const colombianGrade = parseFloat((1.0 + (averageScore / 100) * 4.0).toFixed(1))
      const progreso = assignedWorkshops > 0 ? Math.round((completedWorkshops / assignedWorkshops) * 100) : 0

      const lastActivity =
        myCompletions.length > 0
          ? new Date(Math.max(...myCompletions.map((c: any) => new Date(c.completedAt).getTime())))
          : null

      const buckets: Record<string, { correct: number; total: number }> = {}
      for (const p of myProgress) {
        const comp: string = (p.questionId as any)?.competence || ""
        if (!comp) continue
        if (!buckets[comp]) buckets[comp] = { correct: 0, total: 0 }
        buckets[comp].total++
        if (p.isCorrect) buckets[comp].correct++
      }
      const literal = pct(buckets, "Identificar y entender contenidos locales")
      const inferential = pct(buckets, "Comprender articulación del texto")
      const critical = pct(buckets, "Reflexionar y evaluar críticamente")

      const compValues = [
        { name: "Lectura literal", value: literal },
        { name: "Lectura inferencial", value: inferential },
        { name: "Lectura crítica", value: critical },
      ]
      const withData = compValues.filter((c) => c.value > 0)
      const strengths = withData.filter((c) => c.value >= 70).map((c) => `${c.name} (${c.value}%)`)
      const weaknesses = withData.filter((c) => c.value < 60).map((c) => `${c.name} (${c.value}%)`)

      let status: keyof typeof STATUS_LABEL = "inactive"
      if (completedWorkshops > 0 && averageScore >= 75) status = "excellent"
      else if (completedWorkshops > 0 && averageScore >= 50) status = "active"
      else if ((completedWorkshops > 0 && averageScore < 50) || (completedWorkshops === 0 && assignedWorkshops > 0)) status = "needs_attention"

      return {
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
        age: calcAge(student.birthDate),
        document: student.tarjetaIdentidad,
        email: student.email,
        phone: student.phoneNumber,
        assignedWorkshops,
        completedWorkshops,
        progreso,
        averageScore,
        colombianGrade,
        strengths: strengths.length > 0 ? strengths.join(", ") : "Sin datos suficientes",
        weaknesses: weaknesses.length > 0 ? weaknesses.join(", ") : "Sin falencias marcadas",
        lastActivity,
        status,
      }
    })

    // ── Construcción del Excel ──────────────────────────────────────────
    const workbook = new ExcelJS.Workbook()
    workbook.creator = "LectoRuta Saber — UAJS"
    workbook.created = new Date()

    const sheet = workbook.addWorksheet(`Grado ${grade}°`, {
      views: [{ state: "frozen", ySplit: 7 }],
      pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
    })

    const columns = [
      { header: "N°", key: "n", width: 9 },
      { header: "Nombre completo", key: "name", width: 28 },
      { header: "Grado", key: "grade", width: 7 },
      { header: "Edad", key: "age", width: 7 },
      { header: "Documento (T.I.)", key: "document", width: 16 },
      { header: "Correo electrónico", key: "email", width: 26 },
      { header: "Teléfono", key: "phone", width: 13 },
      { header: "Talleres asignados", key: "assignedWorkshops", width: 12 },
      { header: "Talleres completados", key: "completedWorkshops", width: 13 },
      { header: "Progreso", key: "progreso", width: 10 },
      { header: "Promedio (%)", key: "averageScore", width: 12 },
      { header: "Nota (0.0–5.0)", key: "colombianGrade", width: 12 },
      { header: "Fortalezas", key: "strengths", width: 32 },
      { header: "Áreas de mejora", key: "weaknesses", width: 32 },
      { header: "Última actividad", key: "lastActivity", width: 16 },
      { header: "Estado", key: "status", width: 16 },
    ]
    sheet.columns = columns.map((c) => ({ key: c.key, width: c.width }))

    // Logo institucional
    try {
      const logoPath = path.join(process.cwd(), "public", "images", "logo-uajs-emblema.png")
      const logoBuffer = fs.readFileSync(logoPath)
      const imageId = workbook.addImage({ buffer: logoBuffer as any, extension: "png" })
      // Cabe dentro de la columna A (ancho 9 ≈ 68px) para no invadir el texto de B1.
      sheet.addImage(imageId, { tl: { col: 0.2, row: 0.25 }, ext: { width: 52, height: 52 } })
    } catch {
      // Si el logo no está disponible, el reporte se genera igual sin él.
    }
    for (let r = 1; r <= 4; r++) sheet.getRow(r).height = 18

    sheet.mergeCells("B1:F1")
    sheet.getCell("B1").value = "Corporación Universitaria Antonio José de Sucre (UAJS)"
    sheet.getCell("B1").font = { bold: true, size: 14, color: { argb: "FF4C1D95" } }

    sheet.mergeCells("B2:F2")
    sheet.getCell("B2").value = `Reporte académico de curso — Grado ${grade}°`
    sheet.getCell("B2").font = { bold: true, size: 12 }

    const teacherName = `${session.firstName || ""} ${session.lastName || ""}`.trim() || "Docente"
    const teacherDoc = session.cedula ? ` · C.C. ${session.cedula}` : ""
    sheet.mergeCells("B3:F3")
    sheet.getCell("B3").value =
      `Generado: ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })} · Docente: ${teacherName}${teacherDoc}`
    sheet.getCell("B3").font = { size: 10, color: { argb: "FF52525B" } }

    sheet.mergeCells("B4:F4")
    sheet.getCell("B4").value = "Plataforma LectoRuta Saber — Preparación Pruebas Saber 11, Lectura Crítica"
    sheet.getCell("B4").font = { italic: true, size: 9, color: { argb: "FF71717A" } }

    // Fila 6: encabezado real de la tabla
    const headerRow = sheet.getRow(6)
    columns.forEach((c, i) => {
      const cell = headerRow.getCell(i + 1)
      cell.value = c.header
    })
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D28D9" } }
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true }
      cell.border = {
        top: { style: "thin", color: { argb: "FF4C1D95" } },
        bottom: { style: "thin", color: { argb: "FF4C1D95" } },
        left: { style: "thin", color: { argb: "FF4C1D95" } },
        right: { style: "thin", color: { argb: "FF4C1D95" } },
      }
    })
    headerRow.height = 32
    sheet.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6, column: columns.length } }

    const STATUS_FILL: Record<string, string> = {
      excellent: "FFD1FAE5",
      active: "FFDBEAFE",
      needs_attention: "FFFEF3C7",
      inactive: "FFF3F4F6",
    }

    rows.forEach((r, idx) => {
      const row = sheet.getRow(7 + idx)
      row.values = [
        idx + 1,
        r.name,
        r.grade,
        r.age ?? "—",
        r.document,
        r.email,
        r.phone,
        r.assignedWorkshops,
        r.completedWorkshops,
        `${r.progreso}%`,
        `${r.averageScore}%`,
        r.colombianGrade.toFixed(1),
        r.strengths,
        r.weaknesses,
        r.lastActivity
          ? r.lastActivity.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
          : "Sin actividad",
        STATUS_LABEL[r.status],
      ]
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: "middle", wrapText: colNumber === 13 || colNumber === 14, horizontal: colNumber === 1 ? "center" : "left" }
        cell.border = {
          top: { style: "hair", color: { argb: "FFD4D4D8" } },
          bottom: { style: "hair", color: { argb: "FFD4D4D8" } },
          left: { style: "hair", color: { argb: "FFD4D4D8" } },
          right: { style: "hair", color: { argb: "FFD4D4D8" } },
        }
      })
      row.getCell(16).fill = { type: "pattern", pattern: "solid", fgColor: { argb: STATUS_FILL[r.status] } }
      if (idx % 2 === 1) {
        for (let c = 1; c <= 15; c++) {
          const cell = row.getCell(c)
          if (!cell.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFAFA" } }
        }
      }
    })

    const footerRowIndex = 8 + rows.length
    sheet.mergeCells(`A${footerRowIndex}:P${footerRowIndex}`)
    sheet.getCell(`A${footerRowIndex}`).value =
      `Documento generado automáticamente por la plataforma LectoRuta Saber — © ${new Date().getFullYear()} Corporación Universitaria Antonio José de Sucre (UAJS). ` +
      `Este reporte es un insumo de apoyo docente y no reemplaza el registro oficial de calificaciones de la institución.`
    sheet.getCell(`A${footerRowIndex}`).font = { italic: true, size: 8, color: { argb: "FF71717A" } }
    sheet.getCell(`A${footerRowIndex}`).alignment = { wrapText: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const fileName = `Reporte_Grado_${grade}_${new Date().toISOString().slice(0, 10)}.xlsx`

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error: any) {
    console.error("Error exportando Excel:", error?.message || error)
    return NextResponse.json({ error: "Error al generar el reporte Excel" }, { status: 500 })
  }
}
