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
  colombianGrade?: number
  needsAttentionReasons?: string[]
}

interface PDFExportProps {
  student: Student
  teacherName: string
  institution: string
}

export function PDFExport({ student, teacherName, institution }: PDFExportProps) {
  const generatePDF = () => {
    // Create a new window for the PDF content
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const currentDate = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const progressPercentage = Math.round((student.completedWorkshops / student.totalWorkshops) * 100)

    const colombianGrade = student.colombianGrade ?? parseFloat((1.0 + (student.averageScore / 100) * 4.0).toFixed(1))
    const colombianGradeColor = colombianGrade >= 4.0 ? "#16a34a" : colombianGrade >= 3.0 ? "#1d4ed8" : "#dc2626"
    const needsAttention = student.status === "needs_attention" || student.status === "inactive"

    const getStatusText = (status: string) => {
      switch (status) {
        case "excellent":
          return "Excelente"
        case "active":
          return "Activo"
        case "needs_attention":
        case "needs-attention":
          return "Requiere Atención"
        default:
          return "Sin Actividad"
      }
    }

    const getRecommendations = (student: Student) => {
      const recommendations = []

      if (student.averageScore < 70) {
        recommendations.push("• Reforzar conceptos básicos de lectura crítica")
        recommendations.push("• Aumentar la frecuencia de práctica con talleres interactivos")
      }

      if (student.weakCompetencies.length > 0) {
        recommendations.push(`• Enfocarse en mejorar: ${student.weakCompetencies.join(", ")}`)
      }

      if (student.completedWorkshops < student.totalWorkshops * 0.8) {
        recommendations.push("• Completar los talleres pendientes para mejorar el rendimiento")
      }

      if (student.status === "excellent") {
        recommendations.push("• Continuar con el excelente desempeño")
        recommendations.push("• Considerar talleres de nivel avanzado")
      }

      return recommendations.length > 0 ? recommendations : ["• Mantener el ritmo actual de estudio"]
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Académico - ${student.name}</title>
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
          
          /* Marca de agua */
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
          
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
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
          
          .student-info {
            background: linear-gradient(135deg, #f8f7ff 0%, #e5e7eb 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
            border-left: 5px solid #7c3aed;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .info-label {
            font-weight: bold;
            color: #7c3aed;
          }
          
          .info-value {
            color: #333;
          }
          
          .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          
          .section-title {
            color: #7c3aed;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 5px;
          }
          
          .progress-bar {
            background: #e5e7eb;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%);
            border-radius: 10px;
            transition: width 0.3s ease;
          }
          
          .competencies {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          
          .competency-list {
            padding: 15px;
            border-radius: 8px;
          }
          
          .strengths {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
          }
          
          .weaknesses {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
          }
          
          .competency-item {
            padding: 5px 0;
            color: #333;
          }
          
          .recommendations {
            background: #faf7ff;
            border: 1px solid #7c3aed;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .recommendation-item {
            margin: 8px 0;
            color: #333;
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
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="watermark">CORPORACIÓN UNIVERSITARIA ANTONIO JOSÉ DE SUCRE</div>
        
        <div class="header">
          <div class="logo-section">
            <div>
              <h1 class="institution-name">Corporación Universitaria Antonio José de Sucre</h1>
              <p class="platform-name">LectoRuta Saber - Plataforma Educativa</p>
            </div>
          </div>
          <h2 class="report-title">REPORTE ACADÉMICO INDIVIDUAL</h2>
          <p class="report-subtitle">Competencias en Lectura Crítica - Preparación Pruebas Saber</p>
        </div>

        ${needsAttention ? `
        <div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:10px;padding:14px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:24px;">⚠️</span>
          <div>
            <p style="margin:0;font-size:16px;font-weight:bold;color:#92400e;">REQUIERE ATENCIÓN ACADÉMICA</p>
            ${(student.needsAttentionReasons || []).map((r) => `<p style="margin:3px 0 0;font-size:13px;color:#b45309;">• ${r}</p>`).join("")}
          </div>
        </div>` : ""}

        <div class="student-info">
          <h3 style="color: #7c3aed; margin-top: 0;">Información del Estudiante</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nombre Completo:</span>
              <span class="info-value">${student.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Grado:</span>
              <span class="info-value">${student.grade}° - ${student.class}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Docente:</span>
              <span class="info-value">${teacherName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha del Reporte:</span>
              <span class="info-value">${currentDate}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado Académico:</span>
              <span class="info-value">${getStatusText(student.status)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Última Actividad:</span>
              <span class="info-value">${new Date(student.lastActivity).toLocaleDateString("es-CO")}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">📊 Rendimiento Académico</h3>

          <div style="display:flex;align-items:center;gap:20px;background:#f8f7ff;border:1px solid #ddd8ff;border-radius:10px;padding:16px;margin-bottom:16px;">
            <div style="text-align:center;flex:1;">
              <p style="margin:0;font-size:36px;font-weight:bold;color:${colombianGradeColor};">${colombianGrade}/5.0</p>
              <p style="margin:4px 0 0;font-size:12px;color:#666;">Nota Colombiana (1.0–5.0)</p>
            </div>
            <div style="flex:2;">
              <p style="margin:0 0 4px;font-size:12px;color:#666;">Referencia: Aprobado ≥ 3.0 | Excelente ≥ 4.0</p>
              <p style="margin:0;font-size:13px;font-weight:600;color:${colombianGradeColor};">
                ${colombianGrade >= 4.0 ? "🏆 Desempeño Superior" : colombianGrade >= 3.0 ? "✅ Desempeño Aprobado" : "⚠️ Desempeño Insuficiente — Por debajo del mínimo"}
              </p>
            </div>
          </div>

          <div style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span><strong>Promedio General:</strong></span>
              <span><strong>${student.averageScore}%</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${student.averageScore}%;"></div>
            </div>
          </div>

          <div style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span><strong>Progreso de Talleres:</strong></span>
              <span><strong>${student.completedWorkshops}/${student.totalWorkshops} (${progressPercentage}%)</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">🎯 Análisis de Competencias</h3>
          <div class="competencies">
            <div class="competency-list strengths">
              <h4 style="color: #22c55e; margin-top: 0;">✅ Fortalezas Identificadas</h4>
              ${
                student.strongCompetencies.length > 0
                  ? student.strongCompetencies.map((comp) => `<div class="competency-item">• ${comp}</div>`).join("")
                  : '<div class="competency-item">• Continuar desarrollando competencias</div>'
              }
            </div>
            <div class="competency-list weaknesses">
              <h4 style="color: #ef4444; margin-top: 0;">🎯 Áreas de Mejora</h4>
              ${
                student.weakCompetencies.length > 0
                  ? student.weakCompetencies.map((comp) => `<div class="competency-item">• ${comp}</div>`).join("")
                  : '<div class="competency-item">• No se identificaron áreas críticas de mejora</div>'
              }
            </div>
          </div>
        </div>

        <div class="recommendations">
          <h3 style="color: #7c3aed; margin-top: 0;">💡 Recomendaciones Pedagógicas</h3>
          ${getRecommendations(student)
            .map((rec) => `<div class="recommendation-item">${rec}</div>`)
            .join("")}
        </div>

        <div class="section">
          <h3 class="section-title">📈 Observaciones del Docente</h3>
          <div style="min-height: 100px; border: 1px dashed #ccc; padding: 15px; border-radius: 5px; background: #fafafa;">
            <p style="color: #666; font-style: italic;">
              El estudiante ${student.name} ha obtenido una nota de <strong style="color:${colombianGradeColor}">${colombianGrade}/5.0</strong>
              en la escala colombiana, correspondiente a un ${student.averageScore}% de desempeño en las actividades de lectura crítica.
              ${
                student.averageScore >= 75
                  ? " Se recomienda continuar con el excelente nivel actual y considerar actividades de mayor complejidad."
                  : student.averageScore >= 50
                    ? " Se sugiere reforzar las áreas identificadas como oportunidades de mejora para alcanzar un desempeño superior."
                    : " Es necesario implementar estrategias de apoyo adicional para superar el umbral mínimo de aprobación (3.0/5.0)."
              }
            </p>
            ${needsAttention && student.needsAttentionReasons && student.needsAttentionReasons.length > 0 ? `
            <div style="margin-top:10px;padding:10px;background:#fffbeb;border-left:4px solid #f59e0b;border-radius:4px;">
              <p style="margin:0 0 6px;font-weight:bold;color:#92400e;font-size:12px;">Factores de atención identificados:</p>
              ${student.needsAttentionReasons.map((r) => `<p style="margin:2px 0;color:#b45309;font-size:12px;">• ${r}</p>`).join("")}
            </div>` : ""}
          </div>
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
            Este reporte fue generado automáticamente el ${currentDate} - Documento oficial UAJS
          </p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then print
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
      className="bg-purple-50 hover:bg-purple-100 border-purple-200"
    >
      <Download className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  )
}
