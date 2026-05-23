"use client"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Student {
  id: string
  name: string
  class: string
  grade: number
  averageScore: number
  completedWorkshops: number
  totalWorkshops: number
  lastActivity: string
  weakCompetencies: string[]
  strongCompetencies: string[]
  status: string
}

interface PDFGroupExportProps {
  students: Student[]
  grade: number
  teacherName: string
  institution: string
}

export function PDFGroupExport({ students, grade, teacherName, institution }: PDFGroupExportProps) {
  const generateGroupPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const currentDate = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const totalStudents = students.length
    const averageScore = Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents)
    const totalCompleted = students.reduce((sum, s) => sum + s.completedWorkshops, 0)
    const totalWorkshops = students.reduce((sum, s) => sum + s.totalWorkshops, 0)
    const progressPercentage = Math.round((totalCompleted / totalWorkshops) * 100)
    const excellentStudents = students.filter((s) => s.status === "excellent").length
    const needsAttention = students.filter((s) => s.status === "needs-attention").length

    const allWeakCompetencies: { [key: string]: number } = {}
    const allStrongCompetencies: { [key: string]: number } = {}

    students.forEach((student) => {
      student.weakCompetencies.forEach((comp) => {
        allWeakCompetencies[comp] = (allWeakCompetencies[comp] || 0) + 1
      })
      student.strongCompetencies.forEach((comp) => {
        allStrongCompetencies[comp] = (allStrongCompetencies[comp] || 0) + 1
      })
    })

    const topWeaknesses = Object.entries(allWeakCompetencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    const topStrengths = Object.entries(allStrongCompetencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const getGroupRecommendations = () => {
      const recommendations = []

      if (averageScore < 70) {
        recommendations.push(
          "• Implementar sesiones de refuerzo grupal en lectura crítica para mejorar el promedio general del curso",
        )
        recommendations.push(
          "• Considerar talleres adicionales enfocados en las competencias más débiles identificadas",
        )
      } else if (averageScore >= 80) {
        recommendations.push("• El grupo muestra un excelente desempeño general, continuar con la metodología actual")
        recommendations.push("• Considerar actividades de mayor complejidad para mantener el nivel de excelencia")
      }

      if (needsAttention > totalStudents * 0.2) {
        recommendations.push(
          `• Atención prioritaria: ${needsAttention} estudiantes requieren apoyo adicional individualizado`,
        )
      }

      if (topWeaknesses.length > 0) {
        recommendations.push(`• Reforzar competencias críticas del grupo: ${topWeaknesses.map((w) => w[0]).join(", ")}`)
      }

      if (progressPercentage < 70) {
        recommendations.push("• Motivar la finalización de talleres pendientes para mejorar el progreso grupal")
      }

      return recommendations
    }

    const getGroupAnalysis = () => {
      let analysis = ""

      if (averageScore >= 85) {
        analysis =
          "El grupo demuestra un rendimiento sobresaliente en lectura crítica, con la mayoría de estudiantes alcanzando niveles de excelencia. "
      } else if (averageScore >= 75) {
        analysis =
          "El grupo presenta un desempeño satisfactorio en lectura crítica, con oportunidades de mejora en competencias específicas. "
      } else {
        analysis =
          "El grupo requiere refuerzo significativo en lectura crítica para alcanzar los estándares esperados. "
      }

      if (topStrengths.length > 0) {
        analysis += `Las fortalezas principales del grupo se encuentran en: ${topStrengths.map((s) => s[0]).join(", ")}. `
      }

      if (topWeaknesses.length > 0) {
        analysis += `Las áreas que requieren mayor atención son: ${topWeaknesses.map((w) => w[0]).join(", ")}. `
      }

      return analysis
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Grupal - Grado ${grade}°</title>
        <style>
          @page {
            margin: 2cm;
            size: A4;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            position: relative;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            color: rgba(124, 58, 237, 0.1);
            font-weight: bold;
            z-index: -1;
            white-space: nowrap;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .institution-name {
            color: #7c3aed;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .platform-name {
            color: #666;
            font-size: 18px;
            margin: 5px 0;
          }
          
          .report-title {
            color: #333;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0 10px 0;
          }
          
          .report-subtitle {
            color: #666;
            font-size: 16px;
            margin: 0;
          }
          
          .group-info {
            background: linear-gradient(135deg, #f8f7ff 0%, #e5e7eb 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
            border-left: 5px solid #7c3aed;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          
          .info-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .info-value {
            font-size: 32px;
            font-weight: bold;
            color: #7c3aed;
            margin: 10px 0;
          }
          
          .info-label {
            font-size: 14px;
            color: #666;
          }
          
          .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          
          .section-title {
            color: #7c3aed;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 5px;
          }
          
          .student-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          .student-table th {
            background: #7c3aed;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          
          .student-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .student-table tr:hover {
            background: #f8f7ff;
          }
          
          .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          }
          
          .status-excellent {
            background: #dcfce7;
            color: #166534;
          }
          
          .status-active {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .status-attention {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .competency-analysis {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          
          .competency-box {
            padding: 15px;
            border-radius: 8px;
          }
          
          .strengths-box {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
          }
          
          .weaknesses-box {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
          }
          
          .competency-item {
            padding: 8px 0;
            border-bottom: 1px dashed #ccc;
          }
          
          .competency-item:last-child {
            border-bottom: none;
          }
          
          .analysis-text {
            background: #faf7ff;
            border: 1px solid #7c3aed;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            line-height: 1.8;
          }
          
          .recommendations {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .recommendation-item {
            margin: 10px 0;
            padding-left: 10px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #7c3aed;
            text-align: center;
            color: #666;
          }
          
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin: 40px 0;
            text-align: center;
          }
          
          .signature-line {
            border-top: 1px solid #333;
            padding-top: 10px;
            margin-top: 50px;
          }
          
          @media print {
            body { print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="watermark">CORPORACIÓN UNIVERSITARIA ANTONIO JOSÉ DE SUCRE</div>
        
        <div class="header">
          <h1 class="institution-name">Corporación Universitaria Antonio José de Sucre</h1>
          <p class="platform-name">LectoRuta Saber - Plataforma Educativa</p>
          <h2 class="report-title">REPORTE ACADÉMICO GRUPAL</h2>
          <p class="report-subtitle">Grado ${grade}° - Análisis de Competencias en Lectura Crítica</p>
        </div>

        <div class="group-info">
          <h3 style="color: #7c3aed; margin-top: 0;">Información General del Grupo</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-value">${totalStudents}</div>
              <div class="info-label">Total Estudiantes</div>
            </div>
            <div class="info-item">
              <div class="info-value">${averageScore}%</div>
              <div class="info-label">Promedio General</div>
            </div>
            <div class="info-item">
              <div class="info-value">${progressPercentage}%</div>
              <div class="info-label">Progreso Talleres</div>
            </div>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div><strong>Docente:</strong> ${teacherName}</div>
              <div><strong>Fecha:</strong> ${currentDate}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">📊 Distribución de Rendimiento</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="text-align: center; padding: 15px; background: #dcfce7; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: bold; color: #166534;">${excellentStudents}</div>
              <div style="font-size: 14px; color: #166534;">Estudiantes Excelentes</div>
              <div style="font-size: 12px; color: #666;">${Math.round((excellentStudents / totalStudents) * 100)}% del grupo</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #dbeafe; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: bold; color: #1e40af;">${totalStudents - excellentStudents - needsAttention}</div>
              <div style="font-size: 14px; color: #1e40af;">Estudiantes Activos</div>
              <div style="font-size: 12px; color: #666;">${Math.round(((totalStudents - excellentStudents - needsAttention) / totalStudents) * 100)}% del grupo</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #fee2e2; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: bold; color: #991b1b;">${needsAttention}</div>
              <div style="font-size: 14px; color: #991b1b;">Requieren Atención</div>
              <div style="font-size: 12px; color: #666;">${Math.round((needsAttention / totalStudents) * 100)}% del grupo</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">👥 Lista de Estudiantes</h3>
          <table class="student-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Promedio</th>
                <th>Talleres</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .sort((a, b) => b.averageScore - a.averageScore)
                .map(
                  (student) => `
                <tr>
                  <td><strong>${student.name}</strong></td>
                  <td>${student.averageScore}%</td>
                  <td>${student.completedWorkshops}/${student.totalWorkshops}</td>
                  <td>
                    <span class="status-badge ${
                      student.status === "excellent"
                        ? "status-excellent"
                        : student.status === "needs-attention"
                          ? "status-attention"
                          : "status-active"
                    }">
                      ${
                        student.status === "excellent"
                          ? "Excelente"
                          : student.status === "needs-attention"
                            ? "Requiere Atención"
                            : "Activo"
                      }
                    </span>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3 class="section-title">🎯 Análisis de Competencias del Grupo</h3>
          <div class="competency-analysis">
            <div class="competency-box strengths-box">
              <h4 style="color: #22c55e; margin-top: 0;">✅ Fortalezas del Grupo</h4>
              ${
                topStrengths.length > 0
                  ? topStrengths
                      .map(
                        ([comp, count]) => `
                <div class="competency-item">
                  <strong>${comp}</strong>
                  <div style="font-size: 12px; color: #666;">${count} estudiantes (${Math.round((count / totalStudents) * 100)}%)</div>
                </div>
              `,
                      )
                      .join("")
                  : '<div class="competency-item">No se identificaron fortalezas comunes</div>'
              }
            </div>
            <div class="competency-box weaknesses-box">
              <h4 style="color: #ef4444; margin-top: 0;">🎯 Áreas de Mejora del Grupo</h4>
              ${
                topWeaknesses.length > 0
                  ? topWeaknesses
                      .map(
                        ([comp, count]) => `
                <div class="competency-item">
                  <strong>${comp}</strong>
                  <div style="font-size: 12px; color: #666;">${count} estudiantes (${Math.round((count / totalStudents) * 100)}%)</div>
                </div>
              `,
                      )
                      .join("")
                  : '<div class="competency-item">No se identificaron debilidades comunes</div>'
              }
            </div>
          </div>
        </div>

        <div class="analysis-text">
          <h3 style="color: #7c3aed; margin-top: 0;">📈 Análisis General del Curso</h3>
          <p>${getGroupAnalysis()}</p>
          <p style="margin-top: 15px;">
            El progreso general del grupo en la finalización de talleres es del <strong>${progressPercentage}%</strong>, 
            lo que indica ${progressPercentage >= 80 ? "un excelente compromiso" : progressPercentage >= 60 ? "un compromiso satisfactorio" : "la necesidad de mayor motivación"} 
            con las actividades asignadas.
          </p>
        </div>

        <div class="recommendations">
          <h3 style="color: #f59e0b; margin-top: 0;">💡 Recomendaciones Pedagógicas para el Grupo</h3>
          ${getGroupRecommendations()
            .map((rec) => `<div class="recommendation-item">${rec}</div>`)
            .join("")}
        </div>

        <div class="signature-section">
          <div>
            <div class="signature-line">
              <strong>${teacherName}</strong><br>
              Docente - Lectura Crítica<br>
              ${institution}
            </div>
          </div>
          <div>
            <div class="signature-line">
              <strong>Coordinación Académica</strong><br>
              LectoRuta Saber<br>
              UAJS
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Corporación Universitaria Antonio José de Sucre (UAJS)</strong></p>
          <p>Plataforma LectoRuta Saber - Sistema de Gestión Académica</p>
          <p>Sincelejo, Sucre - Colombia | www.uajs.edu.co</p>
          <p style="font-size: 12px; color: #999;">
            Este reporte grupal fue generado automáticamente el ${currentDate} - Documento oficial UAJS
          </p>
        </div>
      </body>
      </html>
    `

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
    <Button onClick={generateGroupPDF} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Exportar Grupo
    </Button>
  )
}
