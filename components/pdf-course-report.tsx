"use client"
import { Button } from "@/components/ui/button"
import { FileBarChart } from "lucide-react"

interface StudentRow {
  id: string
  name: string
  tarjetaIdentidad?: string
  averageScore: number
  colombianGrade?: number
  completedWorkshops: number
  assignedWorkshops: number
  status: string
  competencyStats?: { literal: number; inferential: number; critical: number }
  weakCompetencies?: string[]
  needsAttentionReasons?: string[]
  lastActivity?: string | null
}

interface GradeStats {
  totalStudents: number
  averageScore: number
  completionRate: number
  needsAttention: number
  excellentCount: number
  totalCompletedWorkshops: number
}

interface PDFCourseReportProps {
  grade: number
  students: StudentRow[]
  gradeStats: GradeStats | null
  teacherName: string
  institution: string
}

export function PDFCourseReport({ grade, students, gradeStats, teacherName, institution }: PDFCourseReportProps) {
  const generatePDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const currentDate = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const gradeAvgColombian = gradeStats && gradeStats.averageScore > 0
      ? parseFloat((1.0 + (gradeStats.averageScore / 100) * 4.0).toFixed(1))
      : null

    const needsAttentionStudents = students.filter(
      (s) => s.status === "needs_attention" || s.status === "inactive"
    )
    const excellentStudents = students.filter((s) => s.status === "excellent")

    const getStatusLabel = (status: string) => {
      switch (status) {
        case "excellent": return "Excelente"
        case "active": return "Activo"
        case "needs_attention": return "Requiere Atención"
        case "inactive": return "Sin Actividad"
        default: return status
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "excellent": return "#16a34a"
        case "active": return "#2563eb"
        case "needs_attention": return "#d97706"
        case "inactive": return "#6b7280"
        default: return "#6b7280"
      }
    }

    const getGradeColor = (g: number | undefined) => {
      if (!g) return "#6b7280"
      if (g >= 4.0) return "#16a34a"
      if (g >= 3.0) return "#2563eb"
      return "#dc2626"
    }

    const colombianOf = (avg: number) =>
      avg > 0 ? parseFloat((1.0 + (avg / 100) * 4.0).toFixed(1)) : null

    const rows = students
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => {
        const cg = s.colombianGrade ?? colombianOf(s.averageScore)
        const cgColor = getGradeColor(cg ?? undefined)
        const statusColor = getStatusColor(s.status)
        const attentionBadge =
          s.status === "needs_attention" || s.status === "inactive"
            ? `<span style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;padding:2px 7px;border-radius:12px;font-size:11px;font-weight:600;">⚠ ATENCIÓN</span>`
            : ""
        return `
          <tr>
            <td>${s.name} ${attentionBadge}</td>
            <td style="text-align:center">${s.tarjetaIdentidad || "—"}</td>
            <td style="text-align:center;color:${cgColor};font-weight:700">${cg ?? "—"}</td>
            <td style="text-align:center">${s.completedWorkshops}/${s.assignedWorkshops}</td>
            <td style="text-align:center">${s.averageScore > 0 ? `${s.averageScore}%` : "—"}</td>
            <td style="text-align:center">${s.competencyStats ? `${s.competencyStats.literal}%` : "—"}</td>
            <td style="text-align:center">${s.competencyStats ? `${s.competencyStats.inferential}%` : "—"}</td>
            <td style="text-align:center">${s.competencyStats ? `${s.competencyStats.critical}%` : "—"}</td>
            <td style="text-align:center;color:${statusColor};font-weight:600">${getStatusLabel(s.status)}</td>
          </tr>`
      })
      .join("")

    const attentionRows = needsAttentionStudents
      .map((s) => {
        const cg = s.colombianGrade ?? colombianOf(s.averageScore)
        const reasons = s.needsAttentionReasons?.join("; ") || "Bajo rendimiento académico"
        return `
          <tr>
            <td style="font-weight:600">${s.name}</td>
            <td style="text-align:center;color:${getGradeColor(cg ?? undefined)};font-weight:700">${cg ?? "—"}</td>
            <td>${reasons}</td>
          </tr>`
      })
      .join("")

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Académico Grado ${grade}° — ${institution}</title>
        <style>
          @page { margin: 2cm; size: A4 landscape; }
          body { font-family: Arial, sans-serif; font-size: 12px; color: #333; background: white; }
          .watermark {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px; color: rgba(124,58,237,0.07);
            font-weight: bold; z-index: -1; white-space: nowrap;
          }
          .header { border-bottom: 3px solid #7c3aed; padding-bottom: 16px; margin-bottom: 24px; }
          .institution { color: #7c3aed; font-size: 20px; font-weight: bold; margin: 0; }
          .sub { color: #666; font-size: 13px; margin: 3px 0; }
          .report-title { color: #1e293b; font-size: 22px; font-weight: bold; margin: 12px 0 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 20px 0; }
          .stat-card { background: #f8f7ff; border: 1px solid #e0d9ff; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-val { font-size: 22px; font-weight: bold; color: #7c3aed; }
          .stat-lbl { font-size: 10px; color: #666; margin-top: 2px; }
          h2 { color: #7c3aed; font-size: 15px; border-bottom: 2px solid #7c3aed; padding-bottom: 4px; margin: 24px 0 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #7c3aed; color: white; padding: 7px 8px; font-size: 11px; text-align: center; }
          th:first-child { text-align: left; }
          td { border: 1px solid #e5e7eb; padding: 6px 8px; font-size: 11px; }
          tr:nth-child(even) td { background: #f9fafb; }
          .attention-section { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .attention-title { color: #92400e; font-size: 14px; font-weight: bold; margin: 0 0 10px; }
          .attention-table th { background: #f59e0b; }
          .footer { border-top: 2px solid #7c3aed; margin-top: 32px; padding-top: 12px; text-align: center; color: #666; font-size: 11px; }
          .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin: 32px 0; }
          .sig-line { border-top: 1px solid #333; padding-top: 8px; margin-top: 48px; text-align: center; }
          @media print { body { print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="watermark">CORPORACIÓN UNIVERSITARIA ANTONIO JOSÉ DE SUCRE</div>

        <div class="header">
          <h1 class="institution">Corporación Universitaria Antonio José de Sucre</h1>
          <p class="sub">LectoRuta Saber — Plataforma Educativa de Lectura Crítica</p>
          <h2 class="report-title" style="border:none;margin:12px 0 0">REPORTE ACADÉMICO DE GRADO ${grade}°</h2>
          <p class="sub">Competencias en Lectura Crítica — Preparación Pruebas Saber | ${currentDate}</p>
          <p class="sub">Docente: <strong>${teacherName}</strong> &nbsp;|&nbsp; Institución: <strong>${institution}</strong></p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-val">${gradeStats?.totalStudents ?? students.length}</div>
            <div class="stat-lbl">Total Estudiantes</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" style="color:${gradeAvgColombian && gradeAvgColombian >= 3.0 ? '#16a34a' : '#dc2626'}">${gradeAvgColombian ?? "—"}</div>
            <div class="stat-lbl">Promedio Grado (Escala 1-5)</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${gradeStats?.completionRate ?? 0}%</div>
            <div class="stat-lbl">Tasa de Completación</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" style="color:#16a34a">${gradeStats?.excellentCount ?? excellentStudents.length}</div>
            <div class="stat-lbl">Estudiantes Destacados</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" style="color:#d97706">${gradeStats?.needsAttention ?? needsAttentionStudents.length}</div>
            <div class="stat-lbl">Requieren Atención</div>
          </div>
        </div>

        ${needsAttentionStudents.length > 0 ? `
        <div class="attention-section">
          <p class="attention-title">⚠ ESTUDIANTES QUE REQUIEREN ATENCIÓN ACADÉMICA (${needsAttentionStudents.length})</p>
          <table class="attention-table">
            <thead>
              <tr>
                <th style="text-align:left">Estudiante</th>
                <th>Nota (1-5)</th>
                <th style="text-align:left">Razones identificadas</th>
              </tr>
            </thead>
            <tbody>${attentionRows}</tbody>
          </table>
        </div>` : ""}

        <h2>Listado Completo de Estudiantes — Grado ${grade}°</h2>
        <table>
          <thead>
            <tr>
              <th style="text-align:left">Estudiante</th>
              <th>T. Identidad</th>
              <th>Nota (1-5)</th>
              <th>Talleres</th>
              <th>Promedio %</th>
              <th>Literal</th>
              <th>Inferencial</th>
              <th>Crítica</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="sig-grid">
          <div>
            <div class="sig-line">
              <strong>${teacherName}</strong><br>
              Docente — Lectura Crítica<br>
              ${institution}
            </div>
          </div>
          <div>
            <div class="sig-line">
              <strong>Coordinación Académica</strong><br>
              LectoRuta Saber<br>
              UAJS
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Corporación Universitaria Antonio José de Sucre (UAJS)</strong></p>
          <p>Plataforma LectoRuta Saber — Sistema de Gestión Académica</p>
          <p>Sincelejo, Sucre — Colombia | www.uajs.edu.co</p>
          <p style="color:#aaa">Documento generado automáticamente el ${currentDate} — Reporte oficial UAJS</p>
        </div>
      </body>
      </html>`

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 gap-1.5"
    >
      <FileBarChart className="h-4 w-4" />
      Reporte Grado {grade}°
    </Button>
  )
}
