"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, ClipboardList, CheckCircle, Loader2, Send,
  User, BookOpen, Calendar, Star, PenLine, MessageSquare,
  TrendingUp, Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Opciones de crédito que puede asignar el docente a cada pregunta abierta
const CREDIT_OPTIONS = [
  { pct: 0,   label: "Incorrecta",  color: "border-red-700 bg-red-950/60 text-red-300",     activeColor: "border-red-500 bg-red-800 text-white" },
  { pct: 25,  label: "Insuficiente",color: "border-orange-700 bg-orange-950/60 text-orange-300", activeColor: "border-orange-500 bg-orange-700 text-white" },
  { pct: 50,  label: "Parcial",     color: "border-amber-700 bg-amber-950/60 text-amber-300",   activeColor: "border-amber-500 bg-amber-700 text-white" },
  { pct: 75,  label: "Buena",       color: "border-blue-700 bg-blue-950/60 text-blue-300",     activeColor: "border-blue-500 bg-blue-700 text-white" },
  { pct: 100, label: "Excelente",   color: "border-emerald-700 bg-emerald-950/60 text-emerald-300", activeColor: "border-emerald-500 bg-emerald-700 text-white" },
]

function gradeColor(g: number) {
  if (g >= 4.0) return "text-emerald-400"
  if (g >= 3.0) return "text-blue-400"
  return "text-red-400"
}

function gradeLabel(g: number) {
  if (g >= 4.5) return "Superior"
  if (g >= 4.0) return "Alto"
  if (g >= 3.0) return "Básico"
  return "Bajo"
}

export default function TeacherReviewPage() {
  const params = useParams()
  const router = useRouter()
  const completionId = params.completionId as string

  const [teacherId, setTeacherId] = useState("")
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Map: progressId → { pct: number | null, feedback: string }
  const [credits, setCredits] = useState<Record<string, { pct: number | null; feedback: string }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ finalGrade: number; percentageScore: number; pointsEarned: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("teacherData") || localStorage.getItem("userData")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTeacherId(parsed.teacherId || parsed.id || parsed._id || parsed.userId || "")
      } catch {}
    }

    fetch(`/api/teacher/review/${completionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { setError(data.error || "No se pudo cargar la entrega"); return }
        setDetail(data)
        const init: Record<string, { pct: number | null; feedback: string }> = {}
        for (const ans of data.answers || []) {
          if (ans.questionId?.questionType === "open_ended") {
            init[ans._id] = { pct: null, feedback: "" }
          }
        }
        setCredits(init)
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [completionId])

  const allAnswers: any[] = detail?.answers ?? []
  const mcAnswers = allAnswers.filter((a) => a.questionId?.questionType !== "open_ended")
  const openAnswers = allAnswers.filter((a) => a.questionId?.questionType === "open_ended")

  const mcCorrect = mcAnswers.filter((a) => a.isCorrect).length
  const totalQuestions = allAnswers.length

  // Live grade preview
  const liveGrade = useMemo(() => {
    if (totalQuestions === 0) return null
    const qWeight = 100 / totalQuestions
    let score = mcCorrect * qWeight
    for (const ans of openAnswers) {
      const pct = credits[ans._id]?.pct
      if (pct !== null && pct !== undefined) {
        score += (pct / 100) * qWeight
      }
    }
    score = Math.min(100, Math.max(0, score))
    return {
      score: Math.round(score * 10) / 10,
      colombian: parseFloat((1.0 + (score / 100) * 4.0).toFixed(1)),
    }
  }, [credits, mcCorrect, totalQuestions, openAnswers])

  const allGraded = openAnswers.length > 0 && openAnswers.every((a) => credits[a._id]?.pct !== null)

  const handleSubmit = async () => {
    const gradeList = openAnswers.map((a) => ({
      progressId: a._id,
      percentage: credits[a._id]?.pct as number,
      feedback: credits[a._id]?.feedback || "",
    }))

    setSubmitting(true)
    try {
      const res = await fetch(`/api/teacher/review/${completionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, grades: gradeList }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess({ finalGrade: data.finalGrade, percentageScore: data.percentageScore, pointsEarned: data.pointsEarned })
      } else {
        alert(data.error || "Error al enviar calificación")
      }
    } catch {
      alert("Error de conexión")
    } finally {
      setSubmitting(false)
    }
  }

  const student = detail?.completion?.studentId
  const workshop = detail?.completion?.workshopId
  const submittedAt = detail?.completion?.completedAt
    ? new Date(detail.completion.completedAt).toLocaleDateString("es-CO", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "—"

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400 mx-auto" />
          <p className="text-slate-400">Cargando entrega...</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !detail) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <ClipboardList className="h-12 w-12 text-red-400 mx-auto" />
          <p className="text-white font-bold text-lg">No se pudo cargar</p>
          <p className="text-slate-400 text-sm">{error}</p>
          <Button onClick={() => router.push("/dashboard/teacher")} variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al panel
          </Button>
        </div>
      </div>
    )
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm w-full bg-slate-900 border border-emerald-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, delay: 0.2 }}
              className="text-6xl mb-4">✅</motion.div>
            <h1 className="text-3xl font-black text-white">¡Calificado!</h1>
            <p className="text-emerald-200 mt-2">La nota ya es visible para el estudiante</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 text-center">
                <Star className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                <p className={cn("text-2xl font-black", gradeColor(success.finalGrade))}>{success.finalGrade.toFixed(1)}/5.0</p>
                <p className="text-xs text-slate-400 mt-0.5">Nota final</p>
              </div>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 text-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-2xl font-black text-emerald-400">+{success.pointsEarned} XP</p>
                <p className="text-xs text-slate-400 mt-0.5">Al estudiante</p>
              </div>
            </div>
            <Button className="w-full h-12 bg-violet-700 hover:bg-violet-600 text-white font-bold" onClick={() => router.push("/dashboard/teacher")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver al panel docente
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main grading UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/teacher")}
            className="text-slate-400 hover:text-white -ml-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-white shrink-0">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">Calificar Preguntas Abiertas</h1>
              <p className="text-xs text-slate-400 truncate">{workshop?.title}</p>
            </div>
          </div>
          <Badge className="bg-violet-900 border-violet-700 text-violet-300 text-xs shrink-0">
            {openAnswers.length} abierta{openAnswers.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Student + Workshop info */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 border border-blue-700 text-blue-300 shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Estudiante</p>
                <p className="font-bold text-white">{student?.firstName} {student?.lastName}</p>
                <p className="text-xs text-slate-400 mt-0.5">Grado {student?.grade}° · TI {student?.tarjetaIdentidad}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-900 border border-violet-700 text-violet-300 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Taller / Examen</p>
                <p className="font-bold text-white leading-snug">{workshop?.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{workshop?.subject || "Lectura Crítica"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900 border border-emerald-700 text-emerald-300 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Enviado</p>
                <p className="font-bold text-white text-sm leading-snug">{submittedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota previa de selección múltiple + live preview */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* MC pre-score */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <p className="text-sm font-semibold text-slate-200">Nota previa — Selección Múltiple</p>
            </div>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-4xl font-black text-emerald-400">{mcCorrect}<span className="text-xl text-slate-500">/{mcAnswers.length}</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Respuestas correctas</p>
              </div>
              <div className="mb-1">
                <p className="text-2xl font-bold text-emerald-300">
                  {totalQuestions > 0
                    ? parseFloat((1.0 + ((mcCorrect / totalQuestions) * 4.0)).toFixed(1))
                    : "—"}
                  <span className="text-sm text-slate-500">/5.0</span>
                </p>
                <p className="text-xs text-slate-500">Sin preguntas abiertas</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Hash className="h-3.5 w-3.5" />
              {totalQuestions} preguntas totales · cada una vale {totalQuestions > 0 ? (100 / totalQuestions).toFixed(1) : 0}%
            </div>
          </div>

          {/* Live final grade */}
          <div className={cn(
            "rounded-2xl border p-5 transition-colors",
            liveGrade
              ? liveGrade.colombian >= 3.0
                ? "bg-emerald-950/30 border-emerald-800/60"
                : "bg-red-950/30 border-red-800/60"
              : "bg-slate-900 border-slate-800"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-slate-200">Nota final proyectada</p>
            </div>
            {liveGrade ? (
              <>
                <p className={cn("text-4xl font-black", gradeColor(liveGrade.colombian))}>
                  {liveGrade.colombian.toFixed(1)}<span className="text-xl text-slate-500">/5.0</span>
                </p>
                <p className={cn("text-sm font-semibold mt-1", gradeColor(liveGrade.colombian))}>
                  Desempeño {gradeLabel(liveGrade.colombian)}
                  {liveGrade.colombian >= 3.0 ? " ✅" : " — Por debajo del mínimo ⚠️"}
                </p>
                <p className="text-xs text-slate-500 mt-1">{liveGrade.score}% · Se actualiza en tiempo real</p>
              </>
            ) : (
              <p className="text-slate-500 text-sm mt-2">Califica las preguntas para ver la nota final</p>
            )}
          </div>
        </div>

        {/* Instrucción */}
        <div className="rounded-xl bg-violet-950/40 border border-violet-800/60 px-4 py-3 flex items-start gap-2.5">
          <ClipboardList className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
          <p className="text-sm text-violet-200">
            <strong>¿Cómo calificar?</strong> Para cada pregunta abierta selecciona el crédito correspondiente.
            El sistema ponderará automáticamente con la nota de selección múltiple para calcular la <strong>nota final en escala colombiana 1.0 – 5.0</strong>.
          </p>
        </div>

        {/* Open questions */}
        <div className="space-y-5">
          {openAnswers.map((ans: any, idx: number) => {
            const current = credits[ans._id]
            const questionWeight = totalQuestions > 0 ? 100 / totalQuestions : 0
            const contribution = current?.pct !== null && current?.pct !== undefined
              ? parseFloat(((current.pct / 100) * questionWeight).toFixed(1))
              : null

            return (
              <motion.div key={ans._id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                {/* Q header */}
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-900 border border-violet-700 text-violet-300 text-xs font-black">{idx + 1}</span>
                  <span className="text-sm font-semibold text-white">Pregunta Abierta {idx + 1}</span>
                  <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                    Vale {questionWeight.toFixed(1)}% de la nota
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Enunciado */}
                  <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Enunciado</p>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">{ans.questionId?.questionText}</p>
                  </div>

                  {/* Respuesta del estudiante */}
                  <div className="rounded-xl bg-blue-950/40 border border-blue-800/60 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PenLine className="h-3.5 w-3.5 text-blue-400" />
                      <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Respuesta del estudiante</p>
                    </div>
                    <p className="text-sm text-blue-100 leading-[1.8] whitespace-pre-wrap">
                      {ans.openAnswer?.trim()
                        ? ans.openAnswer
                        : <span className="italic text-slate-500">El estudiante no escribió respuesta.</span>
                      }
                    </p>
                  </div>

                  {/* Credit selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300">
                      ¿Cuánto crédito merece esta respuesta? <span className="text-red-400">*</span>
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {CREDIT_OPTIONS.map((opt) => (
                        <button
                          key={opt.pct}
                          onClick={() => setCredits((prev) => ({ ...prev, [ans._id]: { ...prev[ans._id], pct: opt.pct } }))}
                          className={cn(
                            "rounded-xl border px-2 py-3 text-center transition-all text-xs font-bold",
                            current?.pct === opt.pct ? opt.activeColor : opt.color,
                            "hover:opacity-90"
                          )}
                        >
                          <div className="text-lg mb-0.5">
                            {opt.pct === 0 ? "❌" : opt.pct === 25 ? "⚠️" : opt.pct === 50 ? "📝" : opt.pct === 75 ? "✅" : "⭐"}
                          </div>
                          <div>{opt.pct}%</div>
                          <div className="font-normal opacity-80 text-xs mt-0.5">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                    {contribution !== null && (
                      <p className="text-xs text-slate-400">
                        Esta pregunta aportará <strong className="text-white">{contribution}%</strong> a la nota final
                        {current?.pct === 0 ? " (sin crédito)" : current?.pct === 100 ? " (crédito completo)" : ""}
                      </p>
                    )}
                  </div>

                  {/* Feedback */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <MessageSquare className="h-3.5 w-3.5" /> Retroalimentación para el estudiante (opcional)
                    </label>
                    <Textarea
                      placeholder="Comentario constructivo para el estudiante..."
                      value={credits[ans._id]?.feedback || ""}
                      onChange={(e) => setCredits((prev) => ({ ...prev, [ans._id]: { ...prev[ans._id], feedback: e.target.value } }))}
                      rows={3}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 resize-none text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Submit */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">
              {allGraded ? "✅ Todas las preguntas calificadas" : `⚠️ Faltan ${openAnswers.filter((a: any) => credits[a._id]?.pct === null).length} pregunta(s) por calificar`}
            </p>
            {liveGrade && allGraded && (
              <p className="text-sm text-slate-400 mt-0.5">
                Nota final: <strong className={gradeColor(liveGrade.colombian)}>{liveGrade.colombian.toFixed(1)}/5.0</strong>
                {" "}({liveGrade.score}%)
              </p>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!allGraded || submitting}
            className="h-12 px-8 font-bold bg-violet-700 hover:bg-violet-600 text-white gap-2 w-full sm:w-auto"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Enviando..." : "Enviar Nota Final"}
          </Button>
        </div>

      </main>
    </div>
  )
}
