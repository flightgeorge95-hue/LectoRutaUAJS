"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface QuickAssignDialogProps {
  studentId: string
  studentName: string
  studentGrade: number
  teacherId: string
}

interface WorkshopItem {
  _id: string
  title: string
  subject: string
  difficulty: string
  grade: number
}

export function QuickAssignDialog({
  studentId,
  studentName,
  teacherId,
}: QuickAssignDialogProps) {
  const [open, setOpen] = useState(false)
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)

  const fetchWorkshops = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/workshops?createdBy=${teacherId}`)
      const data = await res.json()
      setWorkshops(data.workshops || [])
    } catch {
      toast.error("Error al cargar talleres")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      fetchWorkshops()
    }
  }

  const handleAssign = async (workshopId: string) => {
    setAssigning(workshopId)
    try {
      const res = await fetch("/api/workshops/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, studentIds: [studentId] }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Taller asignado exitosamente")
        setOpen(false)
      } else {
        toast.error(data.error || "Error al asignar el taller")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setAssigning(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "Intermedio":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Avanzado":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <BookOpen className="h-4 w-4" />
          Asignar Taller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Taller a {studentName}</DialogTitle>
          <DialogDescription>
            Selecciona un taller ya creado para asignarlo a este estudiante
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No tienes talleres creados. Usa &quot;Crear y Asignar Taller&quot; para crear uno.
          </div>
        ) : (
          <ScrollArea className="max-h-80 pr-1">
            <div className="space-y-2">
              {workshops.map((workshop) => (
                <div
                  key={workshop._id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{workshop.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {workshop.subject}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${getDifficultyColor(workshop.difficulty)}`}
                      >
                        {workshop.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={assigning === workshop._id}
                    onClick={() => handleAssign(workshop._id)}
                    className="shrink-0"
                  >
                    {assigning === workshop._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Asignar"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
