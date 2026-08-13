"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Question {
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

interface Student {
  _id: string
  firstName: string
  lastName: string
  grade: number
  tarjetaIdentidad: string
}

export function WorkshopAssignmentDialog({ teacherId }: { teacherId: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Workshop basic info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("Lectura Crítica")
  const [grade, setGrade] = useState<number>(10)
  const [difficulty, setDifficulty] = useState("Intermedio")
  const [dueDate, setDueDate] = useState("") // formato YYYY-MM-DD del input date
  const [type, setType] = useState<"taller" | "examen" | "simulacro">("taller")
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("")

  // Questions
  const [questions, setQuestions] = useState<Question[]>([])

  // Students
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Load students when grade changes
  useEffect(() => {
    if (open && step === 3) {
      loadStudents()
    }
  }, [grade, open, step])

  const loadStudents = async () => {
    setLoadingStudents(true)
    try {
      const response = await fetch(`/api/students/${grade}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error("Error loading students:", error)
      toast.error("Error al cargar estudiantes")
    } finally {
      setLoadingStudents(false)
    }
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: "multiple_choice",
        competence: "Identificar y entender contenidos locales",
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
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions]
    if (updated[questionIndex].options) {
      updated[questionIndex].options![optionIndex].text = text
    }
    setQuestions(updated)
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map((s) => s._id))
    }
  }

  const handleSubmit = async () => {

    if (!teacherId) {
      toast.error("Error: ID de docente no válido. Cierra sesión y vuelve a ingresar.")
      return
    }

    // Validation
    if (!title || !description) {
      toast.error("Por favor completa el título y descripción")
      return
    }

    if (questions.length === 0) {
      toast.error("Debes agregar al menos una pregunta")
      return
    }

    if (selectedStudents.length === 0) {
      toast.error("Debes seleccionar al menos un estudiante")
      return
    }

    if ((type === "examen" || type === "simulacro") && !timeLimitMinutes) {
      toast.error("Los exámenes y simulacros requieren un tiempo límite en minutos")
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.referenceText || !q.questionText || !q.explanation) {
        toast.error(`La pregunta ${i + 1} está incompleta`)
        return
      }
      if (q.questionType === "multiple_choice") {
        if (!q.options || q.options.some((opt) => !opt.text)) {
          toast.error(`Las opciones de la pregunta ${i + 1} están incompletas`)
          return
        }
      }
    }

    setLoading(true)
    try {
      // Mediodía local para evitar que la zona horaria corra la fecha un día
      const dueDateIso = dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null
      const workshopPayload = {
        title,
        description,
        subject,
        grade: Number(grade),
        difficulty,
        createdBy: teacherId,
        dueDate: dueDateIso,
        type,
        timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
      }


      // Step 1: Create workshop
      const workshopResponse = await fetch("/api/workshops/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workshopPayload),
      })

      if (!workshopResponse.ok) {
        const errorData = await workshopResponse.json()
        throw new Error(errorData.error || "Error al crear el taller")
      }

      const workshopData = await workshopResponse.json()
      const workshopId = workshopData.workshop._id

      // Step 2: Create questions (with error handling per question)
      let questionsCreated = 0
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        const questionPayload = {
          workshopId: workshopId,
          questionNumber: i + 1,
          questionType: question.questionType,
          competence: question.competence,
          textType: question.textType,
          referenceText: question.referenceText,
          questionText: question.questionText,
          options: question.questionType === "multiple_choice" ? question.options : [],
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          hint: question.hint || "",
          difficulty: question.difficulty,
        }


        const qResponse = await fetch("/api/questions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questionPayload),
        })

        if (!qResponse.ok) {
          const qError = await qResponse.json()
          toast.error(`Error al crear la pregunta ${i + 1}: ${qError.error}`)
        } else {
          questionsCreated++
        }
      }


      // Step 3: Assign to students
      const assignResponse = await fetch("/api/workshops/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: workshopId,
          studentIds: selectedStudents,
          dueDate: dueDateIso,
        }),
      })

      if (!assignResponse.ok) {
        const assignError = await assignResponse.json()
        toast.error("El taller se creó pero hubo un error al asignar estudiantes")
      } else {
      }

      toast.success(`Taller "${title}" creado y asignado exitosamente a ${selectedStudents.length} estudiante(s)`)

      // Reset form
      setOpen(false)
      setStep(1)
      setTitle("")
      setDescription("")
      setDueDate("")
      setType("taller")
      setTimeLimitMinutes("")
      setQuestions([])
      setSelectedStudents([])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el taller")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Crear y Asignar Taller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Crear y Asignar Taller de Lectura Crítica</DialogTitle>
          <DialogDescription>
            Paso {step} de 3:{" "}
            {step === 1 ? "Información del taller" : step === 2 ? "Agregar preguntas" : "Asignar estudiantes"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <Tabs value={step.toString()} onValueChange={(v) => setStep(Number(v))}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1">Información</TabsTrigger>
              <TabsTrigger value="2">Preguntas</TabsTrigger>
              <TabsTrigger value="3">Estudiantes</TabsTrigger>
            </TabsList>

            {/* Step 1: Basic Info */}
            <TabsContent value="1" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Taller</Label>
                <Input
                  id="title"
                  placeholder="Ej: Simulacro ICFES - Textos Argumentativos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el objetivo y contenido del taller"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grado</Label>
                  <Select value={grade.toString()} onValueChange={(v) => setGrade(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Grado 10</SelectItem>
                      <SelectItem value="11">Grado 11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
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
                  <Label htmlFor="timeLimitMinutes">Tiempo límite (min)</Label>
                  <Input
                    id="timeLimitMinutes"
                    type="number"
                    min={1}
                    placeholder={type === "taller" ? "Sin límite" : "Ej: 60"}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                {type === "taller"
                  ? "Opcional: déjalo vacío para que el taller no tenga cronómetro."
                  : `El cronómetro será obligatorio: el ${type} se enviará automáticamente al agotarse el tiempo.`}
              </p>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha límite de entrega (opcional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Los estudiantes la verán en su agenda. Déjala vacía si el taller no tiene fecha de vencimiento.
                </p>
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Siguiente: Agregar Preguntas
              </Button>
            </TabsContent>

            {/* Step 2: Questions */}
            <TabsContent value="2" className="space-y-4">
              <ScrollArea className="h-[500px] pr-4 custom-scrollbar">
                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <Card key={qIndex}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Pregunta {qIndex + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Tipo de pregunta</Label>
                            <Select
                              value={q.questionType}
                              onValueChange={(v) => updateQuestion(qIndex, "questionType", v)}
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

                          <div className="space-y-2">
                            <Label>Competencia</Label>
                            <Select value={q.competence} onValueChange={(v) => updateQuestion(qIndex, "competence", v)}>
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

                        <div className="space-y-2">
                          <Label>Texto de referencia</Label>
                          <Textarea
                            placeholder="Ingresa el texto que los estudiantes deben leer"
                            value={q.referenceText}
                            onChange={(e) => updateQuestion(qIndex, "referenceText", e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Pregunta</Label>
                          <Textarea
                            placeholder="¿Cuál es la pregunta?"
                            value={q.questionText}
                            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                            rows={2}
                          />
                        </div>

                        {q.questionType === "multiple_choice" && q.options && (
                          <div className="space-y-2">
                            <Label>Opciones</Label>
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <Badge variant="outline">{opt.letter}</Badge>
                                <Input
                                  placeholder={`Opción ${opt.letter}`}
                                  value={opt.text}
                                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                />
                              </div>
                            ))}
                            <div className="space-y-2">
                              <Label>Respuesta correcta</Label>
                              <Select
                                value={q.correctAnswer}
                                onValueChange={(v) => updateQuestion(qIndex, "correctAnswer", v)}
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

                        <div className="space-y-2">
                          <Label>Explicación de la respuesta</Label>
                          <Textarea
                            placeholder="Explica por qué esta es la respuesta correcta"
                            value={q.explanation}
                            onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Button onClick={addQuestion} variant="outline" className="flex-1 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Pregunta
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={questions.length === 0}>
                  Siguiente: Asignar Estudiantes
                </Button>
              </div>
            </TabsContent>

            {/* Step 3: Assign Students */}
            <TabsContent value="3" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Estudiantes de Grado {grade}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudents.length} de {students.length} seleccionados
                  </p>
                </div>
                <Button variant="outline" onClick={selectAllStudents}>
                  {selectedStudents.length === students.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </Button>
              </div>

              <ScrollArea className="h-[500px] pr-4 custom-scrollbar">
                {loadingStudents ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Cargando estudiantes...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">No hay estudiantes en este grado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleStudent(student._id)}
                      >
                        <Checkbox
                          checked={selectedStudents.includes(student._id)}
                          onCheckedChange={() => toggleStudent(student._id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {student.tarjetaIdentidad}</p>
                        </div>
                        <Badge variant="outline">Grado {student.grade}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Button onClick={handleSubmit} className="w-full" disabled={loading || selectedStudents.length === 0}>
                {loading ? "Creando taller..." : "Crear y Asignar Taller"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
