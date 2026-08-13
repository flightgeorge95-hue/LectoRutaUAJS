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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Loader2, Plus, Trash2, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface QuickAssignDialogProps {
  studentId: string
  studentName: string
  studentGrade: number
  teacherId: string
  weakCompetencies?: string[]
}

interface WorkshopItem {
  _id: string
  title: string
  subject: string
  difficulty: string
  grade: number
  type?: "taller" | "examen" | "simulacro"
}

interface CustomQuestion {
  questionType: "multiple_choice" | "open_ended"
  competence: string
  textType: string
  referenceText: string
  questionText: string
  options?: { letter: string; text: string }[]
  correctAnswer: string
  explanation: string
  hint?: string
  difficulty: string
}

const TYPE_LABEL: Record<string, string> = { taller: "Taller", examen: "Examen", simulacro: "Simulacro" }
const TYPE_COLOR: Record<string, string> = {
  taller: "bg-slate-100 text-slate-700 border-slate-200",
  examen: "bg-red-100 text-red-700 border-red-200",
  simulacro: "bg-violet-100 text-violet-700 border-violet-200",
}

// Traduce las etiquetas cortas de /api/teacher/metrics a las competencias completas del formulario
const WEAK_COMPETENCE_MAP: Record<string, string> = {
  Literal: "Identificar y entender contenidos locales",
  Inferencial: "Comprender articulación del texto",
  Crítica: "Reflexionar y evaluar críticamente",
}

function emptyQuestion(defaultCompetence: string): CustomQuestion {
  return {
    questionType: "multiple_choice",
    competence: defaultCompetence,
    textType: "Continuo informativo",
    referenceText: "",
    questionText: "",
    options: [
      { letter: "A", text: "" },
      { letter: "B", text: "" },
      { letter: "C", text: "" },
      { letter: "D", text: "" },
    ],
    correctAnswer: "A",
    explanation: "",
    hint: "",
    difficulty: "Media",
  }
}

export function QuickAssignDialog({
  studentId,
  studentName,
  studentGrade,
  teacherId,
  weakCompetencies = [],
}: QuickAssignDialogProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"existing" | "custom">("existing")
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)
  // Fecha+hora límite opcional (input datetime-local). Vacío = no caduca.
  const [dueDateTime, setDueDateTime] = useState("")

  const defaultCompetence =
    WEAK_COMPETENCE_MAP[weakCompetencies[0]] || "Identificar y entender contenidos locales"

  // Taller/examen personalizado para este estudiante
  const [customTitle, setCustomTitle] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [customDifficulty, setCustomDifficulty] = useState("Intermedio")
  const [customType, setCustomType] = useState<"taller" | "examen" | "simulacro">("taller")
  const [customTimeLimitMinutes, setCustomTimeLimitMinutes] = useState("")
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([])
  const [creatingCustom, setCreatingCustom] = useState(false)

  const resetCustomForm = () => {
    setCustomTitle("")
    setCustomDescription("")
    setCustomDifficulty("Intermedio")
    setCustomType("taller")
    setCustomTimeLimitMinutes("")
    setCustomQuestions([])
  }

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
    } else {
      setMode("existing")
      resetCustomForm()
    }
  }

  const handleAssign = async (workshopId: string) => {
    setAssigning(workshopId)
    try {
      const res = await fetch("/api/workshops/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId,
          studentIds: [studentId],
          dueDate: dueDateTime ? new Date(dueDateTime).toISOString() : null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Taller asignado/reactivado exitosamente")
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

  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [...prev, emptyQuestion(defaultCompetence)])
  }

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCustomQuestion = (index: number, field: string, value: any) => {
    setCustomQuestions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const updateCustomOption = (questionIndex: number, optionIndex: number, text: string) => {
    setCustomQuestions((prev) => {
      const updated = [...prev]
      const options = updated[questionIndex].options
      if (options) options[optionIndex] = { ...options[optionIndex], text }
      return updated
    })
  }

  const handleCreateCustom = async () => {
    if (!customTitle || !customDescription) {
      toast.error("Completa el título y la descripción del taller")
      return
    }
    if (customQuestions.length === 0) {
      toast.error("Agrega al menos una pregunta")
      return
    }
    if ((customType === "examen" || customType === "simulacro") && !customTimeLimitMinutes) {
      toast.error("Los exámenes y simulacros requieren un tiempo límite en minutos")
      return
    }
    for (let i = 0; i < customQuestions.length; i++) {
      const q = customQuestions[i]
      if (!q.referenceText || !q.questionText || !q.explanation) {
        toast.error(`La pregunta ${i + 1} está incompleta`)
        return
      }
      if (q.questionType === "multiple_choice" && (!q.options || q.options.some((opt) => !opt.text))) {
        toast.error(`Las opciones de la pregunta ${i + 1} están incompletas`)
        return
      }
    }

    setCreatingCustom(true)
    try {
      const dueDateIso = dueDateTime ? new Date(dueDateTime).toISOString() : null

      const workshopResponse = await fetch("/api/workshops/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customTitle,
          description: customDescription,
          subject: "Lectura Crítica",
          grade: studentGrade,
          difficulty: customDifficulty,
          createdBy: teacherId,
          dueDate: dueDateIso,
          type: customType,
          timeLimitMinutes: customTimeLimitMinutes ? Number(customTimeLimitMinutes) : null,
        }),
      })
      if (!workshopResponse.ok) {
        const errorData = await workshopResponse.json()
        throw new Error(errorData.error || "Error al crear el taller personalizado")
      }
      const workshopData = await workshopResponse.json()
      const workshopId = workshopData.workshop._id

      for (let i = 0; i < customQuestions.length; i++) {
        const q = customQuestions[i]
        const qResponse = await fetch("/api/questions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workshopId,
            questionNumber: i + 1,
            questionType: q.questionType,
            competence: q.competence,
            textType: q.textType,
            referenceText: q.referenceText,
            questionText: q.questionText,
            options: q.questionType === "multiple_choice" ? q.options : [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            hint: q.hint || "",
            difficulty: q.difficulty,
          }),
        })
        if (!qResponse.ok) {
          const qError = await qResponse.json()
          toast.error(`Error al crear la pregunta ${i + 1}: ${qError.error}`)
        }
      }

      const assignResponse = await fetch("/api/workshops/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, studentIds: [studentId], dueDate: dueDateIso }),
      })
      if (!assignResponse.ok) {
        toast.error("El taller se creó pero hubo un error al asignarlo al estudiante")
      }

      toast.success(`Taller personalizado "${customTitle}" creado y asignado a ${studentName}`)
      resetCustomForm()
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el taller personalizado")
    } finally {
      setCreatingCustom(false)
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Asignar Taller a {studentName}</DialogTitle>
          <DialogDescription>
            Asigna uno ya creado, o crea un taller/examen nuevo hecho a la medida de este estudiante
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Taller existente</TabsTrigger>
            <TabsTrigger value="custom" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Nuevo personalizado
            </TabsTrigger>
          </TabsList>

          {/* Asignar taller ya creado */}
          <TabsContent value="existing" className="flex-1 min-h-0 flex flex-col space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label htmlFor="quickDueDate">Fecha y hora límite (opcional)</Label>
              <Input
                id="quickDueDate"
                type="datetime-local"
                value={dueDateTime}
                onChange={(e) => setDueDateTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Déjala vacía para que no caduque. Si el estudiante ya lo había completado, esto lo reactiva.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : workshops.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No tienes talleres creados. Usa la pestaña &quot;Nuevo personalizado&quot; para crear uno.
              </div>
            ) : (
              <ScrollArea className="flex-1 min-h-0 max-h-80 pr-1">
                <div className="space-y-2">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop._id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{workshop.title}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0 ${TYPE_COLOR[workshop.type || "taller"]}`}
                          >
                            {TYPE_LABEL[workshop.type || "taller"]}
                          </Badge>
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
          </TabsContent>

          {/* Crear taller/examen nuevo solo para este estudiante */}
          <TabsContent value="custom" className="flex-1 min-h-0 flex flex-col mt-3">
            <ScrollArea className="flex-1 min-h-0 pr-3">
              <div className="space-y-4 pb-1">
                {weakCompetencies.length > 0 && (
                  <p className="text-xs rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 p-2.5">
                    Competencias débiles de {studentName}: <strong>{weakCompetencies.join(", ")}</strong>. Usa esto
                    como guía para el refuerzo.
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customTitle">Título</Label>
                  <Input
                    id="customTitle"
                    placeholder="Ej: Refuerzo de lectura crítica para Pedro"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDescription">Descripción</Label>
                  <Textarea
                    id="customDescription"
                    placeholder="Objetivo del taller y falencia que busca reforzar"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="customType">Tipo</Label>
                    <Select value={customType} onValueChange={(v) => setCustomType(v as typeof customType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taller">Taller (práctica, sin cronómetro)</SelectItem>
                        <SelectItem value="examen">Examen (cronometrado)</SelectItem>
                        <SelectItem value="simulacro">Simulacro Saber 11 (cronometrado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customDifficulty">Dificultad</Label>
                    <Select value={customDifficulty} onValueChange={setCustomDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customTimeLimitMinutes">Tiempo límite (min)</Label>
                  <Input
                    id="customTimeLimitMinutes"
                    type="number"
                    min={1}
                    placeholder={customType === "taller" ? "Sin límite" : "Ej: 60"}
                    value={customTimeLimitMinutes}
                    onChange={(e) => setCustomTimeLimitMinutes(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {customType === "taller"
                      ? "Opcional: déjalo vacío para que el taller no tenga cronómetro."
                      : `Obligatorio: el ${customType} se enviará automáticamente al agotarse el tiempo.`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Fecha y hora límite (opcional)</Label>
                  <Input
                    type="datetime-local"
                    value={dueDateTime}
                    onChange={(e) => setDueDateTime(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Se asigna directamente a {studentName}.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Preguntas ({customQuestions.length})</h4>
                    <Button onClick={addCustomQuestion} variant="outline" size="sm">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Agregar pregunta
                    </Button>
                  </div>

                  {customQuestions.map((q, qIndex) => (
                    <Card key={qIndex}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Pregunta {qIndex + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeCustomQuestion(qIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Tipo de pregunta</Label>
                            <Select
                              value={q.questionType}
                              onValueChange={(v) => updateCustomQuestion(qIndex, "questionType", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple_choice">Selección múltiple</SelectItem>
                                <SelectItem value="open_ended">Abierta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Competencia</Label>
                            <Select
                              value={q.competence}
                              onValueChange={(v) => updateCustomQuestion(qIndex, "competence", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Identificar y entender contenidos locales">
                                  Identificar contenidos
                                </SelectItem>
                                <SelectItem value="Comprender articulación del texto">
                                  Comprender articulación
                                </SelectItem>
                                <SelectItem value="Reflexionar y evaluar críticamente">
                                  Reflexionar críticamente
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Texto de referencia</Label>
                          <Textarea
                            placeholder="Texto que el estudiante debe leer"
                            value={q.referenceText}
                            onChange={(e) => updateCustomQuestion(qIndex, "referenceText", e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Pregunta</Label>
                          <Textarea
                            placeholder="¿Cuál es la pregunta?"
                            value={q.questionText}
                            onChange={(e) => updateCustomQuestion(qIndex, "questionText", e.target.value)}
                            rows={2}
                          />
                        </div>

                        {q.questionType === "multiple_choice" && q.options && (
                          <div className="space-y-1.5">
                            <Label className="text-xs">Opciones</Label>
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <Badge variant="outline">{opt.letter}</Badge>
                                <Input
                                  placeholder={`Opción ${opt.letter}`}
                                  value={opt.text}
                                  onChange={(e) => updateCustomOption(qIndex, optIndex, e.target.value)}
                                />
                              </div>
                            ))}
                            <div className="space-y-1.5">
                              <Label className="text-xs">Respuesta correcta</Label>
                              <Select
                                value={q.correctAnswer}
                                onValueChange={(v) => updateCustomQuestion(qIndex, "correctAnswer", v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs">Explicación de la respuesta</Label>
                          <Textarea
                            placeholder="Explica por qué esta es la respuesta correcta"
                            value={q.explanation}
                            onChange={(e) => updateCustomQuestion(qIndex, "explanation", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <Button onClick={handleCreateCustom} className="w-full mt-3" disabled={creatingCustom}>
              {creatingCustom ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Crear y asignar a {studentName}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
