"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ExcelExportButtonProps {
  grade: number
}

export function ExcelExportButton({ grade }: ExcelExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/teacher/export-excel?grade=${grade}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Error al generar el reporte")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Reporte_Grado_${grade}_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Reporte Excel descargado")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al exportar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
      Exportar Excel
    </Button>
  )
}
