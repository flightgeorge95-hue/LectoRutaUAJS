"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight,
  Trophy, Flame, Home, PenLine, SendHorizontal, Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Question {
  id: number; dbId?: string; text: string; options: string[]
  correctAnswer: number; correctAnswerLetter?: string
  explanation: string; competency: string; questionType?: string
}
interface Exercise {
  id: string; title: string; subject: string; competency: string
  grade: number; timeLimit: number
  passage: { title: string; content: string; type: string }
  questions: Question[]; _workshopId?: string; _isFromDB?: boolean
}
interface PreloadedCompletion {
  answers: Record<number, number>
  openAnswers: Record<number, string>
  score: number
  finalGrade: number | null
  status: string
  timeSpent: number
}

interface ReadingExerciseProps {
  exercise: Exercise; studentId?: string
  preloadedCompletion?: PreloadedCompletion | null
  onComplete?: (results: {
    answers: Record<number, number | string>
    openAnswers: Record<number, string>
    timeSpent: number; score: number; correctCount: number
  }) => void
}

// ─── Confetti ────────────────────────────────────────────────────────────────
function Confetti() {
  const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"]
  const particles = Array.from({ length: 55 }, (_, i) => ({
    id: i, color: COLORS[i % COLORS.length],
    left: `${(i * 1.85) % 100}%`,
    delay: `${(i * 0.04) % 2}s`, duration: `${2.5 + (i % 3)}s`,
    size: `${7 + (i % 5)}px`,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="absolute animate-confetti"
          style={{ left: p.left, top: "-16px", width: p.size, height: p.size,
            backgroundColor: p.color, borderRadius: p.id % 2 === 0 ? "50%" : "3px",
            animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
      <style jsx>{`
        @keyframes confetti { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
        .animate-confetti { animation: confetti linear forwards; }
      `}</style>
    </div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let cur = 0
    const step = Math.max(0.1, target / (duration / 30))
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setN(parseFloat(cur.toFixed(1)))
      if (cur >= target) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [target, duration])
  return <span>{n}{suffix}</span>
}

// ─── Grade color helper ───────────────────────────────────────────────────────
function gradeColor(g: number) {
  if (g >= 4.0) return { ring: "border-emerald-500", bg: "bg-emerald-900", text: "text-emerald-300", label: "¡Excelente!" }
  if (g >= 3.0) return { ring: "border-blue-500", bg: "bg-blue-900", text: "text-blue-300", label: "¡Aprobado!" }
  if (g >= 2.0) return { ring: "border-amber-500", bg: "bg-amber-900", text: "text-amber-300", label: "Regular" }
  return { ring: "border-red-600", bg: "bg-red-900", text: "text-red-300", label: "Insuficiente" }
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReadingExercise({ exercise, studentId, preloadedCompletion, onComplete }: ReadingExerciseProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>(preloadedCompletion?.answers ?? {})
  const [openAnswers, setOpenAnswers] = useState<Record<number, string>>(preloadedCompletion?.openAnswers ?? {})
  const [timeLeft, setTimeLeft] = useState(
    preloadedCompletion ? Math.max(0, exercise.timeLimit * 60 - preloadedCompletion.timeSpent) : exercise.timeLimit * 60
  )
  const [isCompleted, setIsCompleted] = useState(!!preloadedCompletion)
  const [resultsSaved, setResultsSaved] = useState(!!preloadedCompletion)
  const [showConfetti, setShowConfetti] = useState(false)
  const [phase, setPhase] = useState(preloadedCompletion ? 3 : 0) // skip animation in review mode

  const currentQ = exercise.questions[currentQuestion]
  const isMC = (q: Question) => q.questionType !== "open_ended" && (q.options?.length ?? 0) > 0
  const isOpenQ = (q: Question) => q.questionType === "open_ended"
  const hasAnswered = (q: Question) => isMC(q) ? answers[q.id] !== undefined : (openAnswers[q.id]?.trim().length ?? 0) > 0
  const isLast = currentQuestion === exercise.questions.length - 1
  const progress = Math.round(((currentQuestion + 1) / exercise.questions.length) * 100)

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
      return () => clearTimeout(t)
    }
    if (timeLeft === 0 && !isCompleted) handleFinish()
  }, [timeLeft, isCompleted])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  // Open questions NEVER count as auto-correct
  const calculateResults = () => {
    let correct = 0, mcCount = 0
    exercise.questions.forEach((q) => {
      if (isMC(q)) { mcCount++; if (answers[q.id] === q.correctAnswer) correct++ }
    })
    const pct = mcCount > 0 ? Math.round((correct / mcCount) * 100) : 0
    // In review mode use stored finalGrade if teacher already graded, else recalculate
    const colombianGrade = preloadedCompletion?.finalGrade != null
      ? preloadedCompletion.finalGrade
      : parseFloat((1.0 + (pct / 100) * 4.0).toFixed(1))
    return { correct, mcCount, total: exercise.questions.length, percentage: pct, colombianGrade }
  }

  const handleFinish = () => {
    setIsCompleted(true)
    const r = calculateResults()
    if (r.colombianGrade >= 3.0 && r.mcCount > 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
    setTimeout(() => setPhase(1), 400)
    setTimeout(() => setPhase(2), 1200)
    setTimeout(() => setPhase(3), 2000)
    const timeSpent = exercise.timeLimit * 60 - timeLeft
    if (onComplete && !resultsSaved) {
      setResultsSaved(true)
      onComplete({ answers, openAnswers, timeSpent, score: r.percentage, correctCount: r.correct })
    }
  }

  const handleNext = () => {
    if (!isLast) { setCurrentQuestion(q => q + 1) }
    else handleFinish()
  }
  const handlePrev = () => { if (currentQuestion > 0) setCurrentQuestion(q => q - 1) }

  // ─── RESULTS / REWARD SCREEN ─────────────────────────────────────────────
  if (isCompleted) {
    const r = calculateResults()
    const timeUsed = exercise.timeLimit * 60 - timeLeft
    const hasOpen = exercise.questions.some(isOpenQ)
    const openCount = exercise.questions.filter(isOpenQ).length
    const gc = gradeColor(hasOpen ? 1 : r.colombianGrade)

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {showConfetti && <Confetti />}
        <div className="w-full max-w-lg space-y-4">

          {/* ── Grade card ───────────────────────────────────────────────── */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Top banner */}
            <div className={cn(
              "px-6 pt-8 pb-6 text-center",
              hasOpen ? "bg-gradient-to-br from-violet-800 to-purple-900"
              : r.colombianGrade >= 4.0 ? "bg-gradient-to-br from-emerald-700 to-teal-900"
              : r.colombianGrade >= 3.0 ? "bg-gradient-to-br from-blue-700 to-indigo-900"
              : r.colombianGrade >= 2.0 ? "bg-gradient-to-br from-amber-700 to-orange-900"
              : "bg-gradient-to-br from-red-800 to-rose-900"
            )}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240, delay: 0.1 }}
                className="text-6xl mb-3">
                {hasOpen ? "📝" : r.colombianGrade >= 4.0 ? "🏆" : r.colombianGrade >= 3.0 ? "🌟" : r.colombianGrade >= 2.0 ? "💪" : "📚"}
              </motion.div>
              <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-3xl font-black text-white">
                {hasOpen ? "¡Enviado!" : r.colombianGrade >= 4.0 ? "¡Excelente!" : r.colombianGrade >= 3.0 ? "¡Aprobaste!" : r.colombianGrade >= 2.0 ? "¡Sigue adelante!" : "¡No te rindas!"}
              </motion.h1>
              <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-white/80 mt-1.5 text-sm font-medium">
                {hasOpen
                  ? `Tu docente revisará ${openCount} pregunta${openCount > 1 ? "s" : ""} abierta${openCount > 1 ? "s" : ""}`
                  : r.colombianGrade >= 3.0 ? "¡Cumpliste el objetivo de aprendizaje!" : "Repasa el material y vuelve a intentarlo"}
              </motion.p>
            </div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
              className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800"
            >
              {/* Grade */}
              <div className="px-4 py-5 text-center">
                <div className={cn(
                  "text-3xl font-black",
                  hasOpen ? "text-violet-300" : r.colombianGrade >= 3.0 ? "text-emerald-300" : "text-amber-300"
                )}>
                  {hasOpen ? "—" : <AnimatedCounter target={r.colombianGrade} suffix="" duration={1400} />}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Nota / 5.0</p>
              </div>
              {/* Correct */}
              <div className="px-4 py-5 text-center">
                <div className="text-3xl font-black text-slate-200">
                  {hasOpen ? <span className="text-violet-300">{r.mcCount > 0 ? `${r.correct}/${r.mcCount}` : "—"}</span> : `${r.correct}/${r.mcCount}`}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Correctas</p>
              </div>
              {/* Time */}
              <div className="px-4 py-5 text-center">
                <div className="text-3xl font-black text-blue-300">{fmt(timeUsed)}</div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Tiempo</p>
              </div>
            </motion.div>

            {/* Open pending notice */}
            {hasOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
                className="mx-5 mt-4 rounded-xl bg-violet-950/60 border border-violet-800 px-4 py-3 text-sm text-violet-300 text-center">
                📋 Tu docente revisará tus respuestas y publicará la nota en tu portal.
              </motion.div>
            )}
          </motion.div>

          {/* ── Question review list ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12 }}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-slate-800">
              <p className="text-sm font-bold text-white">Revisión de respuestas</p>
            </div>
            <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {exercise.questions.map((q, i) => {
                const isOpen = isOpenQ(q)
                const mc = isMC(q)
                const correct = mc && answers[q.id] === q.correctAnswer
                const answered = mc ? answers[q.id] !== undefined : (openAnswers[q.id]?.trim().length ?? 0) > 0

                return (
                  <div key={q.id} className="px-5 py-3.5 flex items-start gap-3">
                    {/* Status icon */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black border",
                      isOpen ? "bg-violet-900 border-violet-700 text-violet-300"
                      : correct ? "bg-emerald-900 border-emerald-700 text-emerald-300"
                      : !answered ? "bg-slate-800 border-slate-600 text-slate-400"
                      : "bg-red-900 border-red-700 text-red-300"
                    )}>
                      {isOpen ? "?" : correct ? "✓" : "✗"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium line-clamp-1">
                        <span className="text-slate-500 mr-1">P{i + 1}.</span>
                        {q.text.length > 68 ? q.text.slice(0, 68) + "…" : q.text}
                      </p>

                      {isOpen && (
                        <p className="text-xs text-violet-400 mt-0.5 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                          Pendiente de calificación por tu docente
                        </p>
                      )}
                      {mc && correct && (
                        <p className="text-xs text-emerald-400 mt-0.5">
                          ✓ {q.options[answers[q.id]]}
                        </p>
                      )}
                      {mc && !correct && answered && (
                        <p className="text-xs text-red-400 mt-0.5">
                          Tu resp: {q.options[answers[q.id]]} · Correcta: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      {mc && !answered && (
                        <p className="text-xs text-slate-500 mt-0.5">Sin respuesta</p>
                      )}
                    </div>

                    {/* Right badge */}
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                      isOpen ? "bg-violet-950/60 border-violet-800 text-violet-400"
                      : correct ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                      : "bg-red-950/60 border-red-900 text-red-400"
                    )}>
                      {isOpen ? "Abierta" : correct ? "+1" : "0"}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* ── Bottom action ────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 8 }}>
            <Button className="w-full h-13 py-3.5 text-base font-bold bg-violet-700 hover:bg-violet-600 text-white gap-2"
              onClick={() => router.push("/dashboard/student")}>
              <Home className="h-5 w-5" /> Volver al portal
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── EXERCISE SCREEN ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="h-1 bg-slate-800">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500" />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/student")}
            className="text-slate-400 hover:text-white shrink-0 -ml-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">{exercise.title}</h1>
            <p className="text-xs text-slate-400">{exercise.subject} · Grado {exercise.grade}°</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border",
              timeLeft < 60 ? "bg-red-950 border-red-700 text-red-300 animate-pulse"
              : timeLeft < 300 ? "bg-amber-950 border-amber-700 text-amber-300"
              : "bg-slate-800 border-slate-700 text-slate-300"
            )}>
              <Clock className="h-3.5 w-3.5" /> {fmt(timeLeft)}
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm font-bold bg-slate-800 border border-slate-700 text-slate-300">
              {currentQuestion + 1}/{exercise.questions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Question dots */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {exercise.questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentQuestion(i)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-bold transition-all border-2",
                i === currentQuestion
                  ? "bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-900/50"
                  : hasAnswered(q)
                  ? "bg-emerald-700 border-emerald-600 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
              )}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion}
            initial={{ x: 18, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -18, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
          >
            {/* Question header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-violet-900 border border-violet-700 text-violet-300 text-xs font-black shrink-0">
                  {currentQuestion + 1}
                </span>
                <div>
                  <span className="text-sm font-semibold text-white">Pregunta {currentQuestion + 1}</span>
                  {isOpenQ(currentQ) && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-violet-900/70 border border-violet-700 text-violet-300">
                      Abierta
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 shrink-0 hidden sm:block">
                {currentQ.competency?.split(" ").slice(0, 3).join(" ")}
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Question text */}
              <p className="text-[1.0rem] font-medium text-white leading-relaxed">{currentQ.text}</p>

              {/* MC options — no feedback shown during quiz */}
              {isMC(currentQ) && (currentQ.options?.length ?? 0) > 0 && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx)
                    const sel = answers[currentQ.id] === idx
                    return (
                      <button key={idx}
                        onClick={() => setAnswers({ ...answers, [currentQ.id]: idx })}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
                          sel
                            ? "border-violet-500 bg-violet-900/50 text-white"
                            : "border-slate-700 bg-slate-800/50 text-slate-200 hover:border-violet-600 hover:bg-violet-900/20"
                        )}
                      >
                        <span className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shrink-0 border transition-colors",
                          sel ? "bg-violet-600 border-violet-500 text-white" : "bg-slate-700 border-slate-600 text-slate-300"
                        )}>
                          {letter}
                        </span>
                        <span className="text-sm font-medium leading-snug flex-1">{opt}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Open question textarea */}
              {isOpenQ(currentQ) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-violet-300 border-b border-slate-800 pb-2">
                    <PenLine className="h-4 w-4" />
                    <span className="text-sm font-semibold">Escribe tu respuesta completa:</span>
                  </div>
                  <Textarea
                    placeholder="Desarrolla tu análisis con argumentos basados en el texto. Sé claro y preciso..."
                    value={openAnswers[currentQ.id] || ""}
                    onChange={(e) => setOpenAnswers({ ...openAnswers, [currentQ.id]: e.target.value })}
                    rows={9}
                    className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 resize-none text-[0.92rem] leading-[1.8]"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Tu docente calificará esta respuesta</span>
                    <span className={cn("font-medium",
                      (openAnswers[currentQ.id]?.length ?? 0) > 60 ? "text-emerald-400"
                      : (openAnswers[currentQ.id]?.length ?? 0) > 20 ? "text-amber-400"
                      : "text-slate-500"
                    )}>
                      {openAnswers[currentQ.id]?.length ?? 0} car.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between">
              <Button variant="ghost" onClick={handlePrev} disabled={currentQuestion === 0}
                className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
                <ArrowLeft className="h-4 w-4" /> Anterior
              </Button>

              <Button onClick={handleNext} disabled={!hasAnswered(currentQ)}
                className={cn(
                  "text-white px-6 gap-2 font-semibold",
                  isLast ? "bg-emerald-700 hover:bg-emerald-600" : "bg-violet-700 hover:bg-violet-600"
                )}>
                {isLast
                  ? <><SendHorizontal className="h-4 w-4" /> Finalizar</>
                  : <>Siguiente <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
