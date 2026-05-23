"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReadingExercise } from "@/components/exercises/reading-exercise"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react"

// Fallback mock exercise for demo/testing (when workshopId is "1" or not found in DB)
const mockExercise = {
  id: "lectura-critica-1",
  title: "Taller de Lectura Crítica #1 (Demo)",
  subject: "Lectura Crítica",
  competency: "Interpretación y representación",
  grade: 11,
  timeLimit: 45,
  passage: {
    title: "El impacto de la tecnología en la educación",
    content: `La revolución tecnológica ha transformado radicalmente el panorama educativo en las últimas décadas. Las aulas tradicionales, caracterizadas por pizarrones y libros de texto, han dado paso a espacios dinámicos equipados con computadores, tabletas y acceso a internet.

Esta transformación no solo ha cambiado los métodos de enseñanza, sino también la forma en que los estudiantes aprenden y procesan la información. Los recursos digitales permiten un aprendizaje más interactivo y personalizado, adaptándose a diferentes estilos de aprendizaje y ritmos individuales.

Sin embargo, la integración de la tecnología en la educación también presenta desafíos significativos. La brecha digital, que separa a quienes tienen acceso a la tecnología de quienes no lo tienen, puede amplificar las desigualdades educativas existentes. Además, el uso excesivo de dispositivos digitales puede afectar la capacidad de concentración y el desarrollo de habilidades de pensamiento crítico.

Los educadores enfrentan el reto de encontrar un equilibrio entre aprovechar las ventajas de la tecnología y mantener los aspectos fundamentales de la educación tradicional. La clave está en utilizar la tecnología como una herramienta que complemente, no que reemplace, la interacción humana y el pensamiento reflexivo que son esenciales para un aprendizaje significativo.`,
    type: "informativo-argumentativo",
  },
  questions: [
    {
      id: 1,
      text: "Según el texto, ¿cuál es el principal cambio que ha experimentado la educación con la tecnología?",
      options: [
        "La eliminación completa de los métodos tradicionales",
        "La transformación de espacios y métodos de enseñanza",
        "El reemplazo de los profesores por computadores",
        "La reducción del tiempo de estudio",
      ],
      correctAnswer: 1,
      explanation:
        "El texto menciona que las aulas tradicionales han dado paso a espacios dinámicos y que han cambiado tanto los métodos de enseñanza como la forma de aprender.",
      competency: "Interpretación",
    },
    {
      id: 2,
      text: "¿Qué problema identifica el autor respecto a la integración tecnológica?",
      options: [
        "La falta de interés de los estudiantes",
        "El alto costo de los dispositivos",
        "La brecha digital y sus efectos en la desigualdad",
        "La resistencia de los profesores al cambio",
      ],
      correctAnswer: 2,
      explanation:
        "El texto específicamente menciona que la brecha digital puede amplificar las desigualdades educativas existentes.",
      competency: "Interpretación",
    },
    {
      id: 3,
      text: "La posición del autor frente al uso de tecnología en educación es:",
      options: [
        "Completamente favorable sin restricciones",
        "Totalmente en contra de su implementación",
        "A favor de un uso equilibrado y complementario",
        "Indiferente ante los cambios tecnológicos",
      ],
      correctAnswer: 2,
      explanation:
        "El autor concluye que la clave está en utilizar la tecnología como herramienta complementaria, no de reemplazo.",
      competency: "Argumentación",
    },
    {
      id: 4,
      text: "¿Cuál de las siguientes afirmaciones resume mejor la idea central del texto?",
      options: [
        "La tecnología ha mejorado completamente la educación",
        "Los métodos tradicionales son superiores a los digitales",
        "La tecnología en educación tiene beneficios y desafíos que requieren equilibrio",
        "Los estudiantes prefieren siempre los métodos digitales",
      ],
      correctAnswer: 2,
      explanation:
        "El texto presenta tanto beneficios como desafíos de la tecnología educativa, enfatizando la necesidad de equilibrio.",
      competency: "Síntesis",
    },
  ],
}

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const workshopId = params.id as string
  const completionId = searchParams.get("completionId")

  const [exercise, setExercise] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [studentId, setStudentId] = useState<string>("")
  // Pre-loaded completion data for review mode
  const [preloadedCompletion, setPreloadedCompletion] = useState<any>(null)

  useEffect(() => {
    // Get student ID from localStorage
    const storedData = localStorage.getItem("studentData") || localStorage.getItem("userData")
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        setStudentId(parsed.studentId || parsed.id || parsed._id || parsed.userId || "")
      } catch (e) {
        console.error("Error parsing student data:", e)
      }
    }

    loadWorkshop()
  }, [workshopId, completionId])

  const loadWorkshop = async () => {
    setLoading(true)
    setError("")

    // If the ID is "1" or a simple number, use mock data
    if (workshopId === "1" || /^\d+$/.test(workshopId)) {
      setExercise(mockExercise)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/workshops/detail?workshopId=${workshopId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar el taller")
      }

      const data = await response.json()
      const { workshop, questions } = data

      if (!questions || questions.length === 0) {
        throw new Error("Este taller no tiene preguntas asignadas")
      }

      // Transform DB data to the format ReadingExercise expects
      const transformedExercise = {
        id: workshop._id,
        title: workshop.title,
        subject: workshop.subject || "Lectura Crítica",
        competency: questions[0]?.competence || "Lectura Crítica",
        grade: workshop.grade || 11,
        timeLimit: Math.max(questions.length * 5, 15),
        passage: {
          title: workshop.title,
          content: questions.map((q: any) => q.referenceText).filter((text: string, index: number, arr: string[]) => arr.indexOf(text) === index).join("\n\n"),
          type: questions[0]?.textType || "Continuo informativo",
        },
        questions: questions.map((q: any, index: number) => ({
          id: index + 1,
          dbId: q._id,
          text: q.questionText,
          options: q.questionType === "multiple_choice" && q.options
            ? q.options.map((opt: any) => opt.text)
            : [],
          correctAnswer: q.questionType === "multiple_choice" && q.options
            ? q.options.findIndex((opt: any) => opt.letter === q.correctAnswer)
            : -1,
          correctAnswerLetter: q.correctAnswer,
          explanation: q.explanation || "Sin explicación disponible.",
          competency: q.competence || "Lectura Crítica",
          questionType: q.questionType,
        })),
        _workshopId: workshop._id,
        _isFromDB: true,
      }

      setExercise(transformedExercise)

      // ── Review mode: load previous answers ──
      if (completionId) {
        const compRes = await fetch(`/api/student/completion?completionId=${completionId}`)
        if (compRes.ok) {
          const compData = await compRes.json()
          if (compData.success) {
            // Map DB answers (letter) back to index for each question
            const answers: Record<number, number> = {}
            const openAnswers: Record<number, string> = {}

            transformedExercise.questions.forEach((q: any) => {
              const dbId = q.dbId?.toString()
              const prev = compData.answersByQuestionId[dbId]
              if (!prev) return
              if (q.questionType === "open_ended") {
                openAnswers[q.id] = prev.openAnswer || ""
              } else {
                // selectedAnswer is a letter (A/B/C/D), convert to index
                const letterToIdx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
                const idx = letterToIdx[prev.selectedAnswer?.toUpperCase()]
                if (idx !== undefined) answers[q.id] = idx
              }
            })

            setPreloadedCompletion({
              answers,
              openAnswers,
              score: compData.completion.score,
              finalGrade: compData.completion.finalGrade,
              status: compData.completion.status,
              timeSpent: compData.completion.timeSpent,
            })
          }
        }
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error al cargar el taller")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Cargando taller...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-xl">Error al cargar el taller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button className="flex-1" onClick={loadWorkshop}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ReadingExercise
      exercise={exercise}
      studentId={studentId}
      preloadedCompletion={preloadedCompletion}
      onComplete={async (results) => {
        if (exercise._isFromDB && studentId) {
          try {
            const answersPayload = exercise.questions.map((q: any) => {
              const isOpen = q.questionType === "open_ended"
              return {
                questionId: q.dbId,
                questionType: q.questionType || "multiple_choice",
                selectedAnswer: isOpen ? "open" : (results.answers[q.id]?.toString() || ""),
                openAnswer: isOpen ? (results.openAnswers?.[q.id] || "") : undefined,
                isCorrect: isOpen ? false : results.answers[q.id] === q.correctAnswer,
                timeSpent: 0,
              }
            })

            const response = await fetch("/api/workshops/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId,
                workshopId: exercise._workshopId,
                answers: answersPayload,
                timeSpent: results.timeSpent || 0,
              }),
            })

            if (!response.ok) {
              console.error("[exercise/complete] Error al guardar resultados")
            }
          } catch (err) {
            console.error("[exercise/complete] Error:", err)
          }
        }
      }}
    />
  )
}
