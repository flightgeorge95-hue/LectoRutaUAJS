"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  GraduationCap, BookOpen, Target, Newspaper,
  ChevronRight, ChevronLeft, Sparkles, Zap, CheckCircle2,
} from "lucide-react"

const HIGHLIGHT_STYLES = [
  { bg: "bg-violet-100 dark:bg-violet-900/60", border: "border-violet-300 dark:border-violet-700", icon: "text-violet-700 dark:text-violet-300", text: "text-violet-800 dark:text-violet-200" },
  { bg: "bg-purple-100 dark:bg-purple-900/60", border: "border-purple-300 dark:border-purple-700", icon: "text-purple-700 dark:text-purple-300", text: "text-purple-800 dark:text-purple-200" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/60", border: "border-indigo-300 dark:border-indigo-700", icon: "text-indigo-700 dark:text-indigo-300", text: "text-indigo-800 dark:text-indigo-200" },
  { bg: "bg-blue-100 dark:bg-blue-900/60", border: "border-blue-300 dark:border-blue-700", icon: "text-blue-700 dark:text-blue-300", text: "text-blue-800 dark:text-blue-200" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/60", border: "border-cyan-300 dark:border-cyan-700", icon: "text-cyan-700 dark:text-cyan-300", text: "text-cyan-800 dark:text-cyan-200" },
]

const STEPS = [
  {
    icon: Sparkles,
    gradient: "from-violet-600 to-purple-700",
    emoji: "🚀",
    title: "¡Bienvenido a LectoRuta Saber!",
    description:
      "Tu plataforma educativa para fortalecer lectura crítica y prepararte para las Pruebas Saber 11. Aquí aprenderás de forma divertida y gamificada.",
    highlight: "Gana puntos y sube de nivel con cada taller que completes",
  },
  {
    icon: GraduationCap,
    gradient: "from-purple-600 to-indigo-700",
    emoji: "🎮",
    title: "Tu Portal Estudiante",
    description:
      "Esta es tu página principal. Aquí ves tu nivel, puntos, racha de estudio y todas las misiones que tus docentes te han asignado. Todo lo que necesitas está en un solo lugar.",
    highlight: "Tus estadísticas y progreso se actualizan en tiempo real",
  },
  {
    icon: BookOpen,
    gradient: "from-indigo-600 to-blue-700",
    emoji: "📖",
    title: "Tus Misiones (Talleres)",
    description:
      "Cada taller es una misión. Responde preguntas de opción múltiple y abiertas. Al completarlos ganarás puntos y experiencia para subir de nivel.",
    highlight: "Las preguntas abiertas las revisa tu docente",
  },
  {
    icon: Target,
    gradient: "from-blue-600 to-cyan-700",
    emoji: "🎯",
    title: "Tu Progreso ICFES",
    description:
      "Cada taller mide 3 competencias: Lectura Literal, Inferencial y Crítica. Revisa tus barras de progreso para saber en qué mejorar.",
    highlight: "Identifica tus fortalezas y áreas de mejora",
  },
  {
    icon: Newspaper,
    gradient: "from-cyan-600 to-teal-700",
    emoji: "📰",
    title: "Noticias y Recursos",
    description:
      "Tus docentes publicarán tips, videos y guías de estudio. Dale Me Gusta y Guarda los que te interesen para repasar después.",
    highlight: "Todo el contenido es preparatorio para el ICFES",
  },
]

interface OnboardingTutorialProps {
  studentName?: string
}

export function OnboardingTutorial({ studentName }: OnboardingTutorialProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("onboardingSeen")
    if (!seen) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem("onboardingSeen")) {
          setShowPrompt(true)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleStart = () => {
    setShowPrompt(false)
    setStep(0)
    setShowTutorial(true)
  }

  const handleSkip = () => {
    setShowPrompt(false)
    setShowTutorial(false)
    localStorage.setItem("onboardingSeen", "true")
    setDismissed(true)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setShowTutorial(false)
      localStorage.setItem("onboardingSeen", "true")
      setDismissed(true)
    }
  }

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1
  const isFirst = step === 0

  if (dismissed) return null

  return (
    <>
      {/* ── Prompt card ── */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">
                      {studentName ? `¡Hola, ${studentName}!` : "¡Bienvenido!"} 👋
                    </p>
                    <p className="text-purple-200 text-xs">¿Quieres aprender a usar la plataforma?</p>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 shrink-0"
                  >
                    <span className="text-sm font-bold">×</span>
                  </button>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <Button
                  onClick={handleStart}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white gap-2 text-sm h-10"
                >
                  <Zap className="h-4 w-4" /> ¡Claro, empecemos!
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="text-muted-foreground text-sm h-10 px-3"
                >
                  Ahora no
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tutorial overlay ── */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkip}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="relative w-full sm:max-w-lg bg-card sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Top gradient area */}
              <div className={`bg-gradient-to-br ${current.gradient} px-6 sm:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 text-center relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

                {/* Step counter */}
                <div className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white/90">
                  {step + 1} / {STEPS.length}
                </div>

                {/* Icon */}
                <motion.div
                  key={step}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto border-2 border-white/30 shadow-xl mb-4"
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>

                {/* Emoji */}
                <div className="text-4xl sm:text-5xl mb-3">{current.emoji}</div>

                {/* Title */}
                <motion.h2
                  key={`title-${step}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl sm:text-2xl font-bold text-white"
                >
                  {current.title}
                </motion.h2>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-5 sm:py-6 flex-1 overflow-y-auto">
                <motion.p
                  key={`desc-${step}`}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                >
                  {current.description}
                </motion.p>

                {current.highlight && (
                  <motion.div
                    key={`hl-${step}`}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border ${HIGHLIGHT_STYLES[step].bg} ${HIGHLIGHT_STYLES[step].border}`}
                  >
                    <Sparkles className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 ${HIGHLIGHT_STYLES[step].icon}`} />
                    <p className={`text-xs sm:text-sm font-medium ${HIGHLIGHT_STYLES[step].text}`}>
                      {current.highlight}
                    </p>
                  </motion.div>
                )}

                {/* Dots */}
                <div className="flex justify-center gap-1.5 mt-6">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === step ? "w-7 bg-violet-600" : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-border flex items-center justify-between gap-3">
                {!isFirst ? (
                  <Button
                    variant="ghost"
                    onClick={handlePrev}
                    className="gap-1.5 text-muted-foreground hover:text-foreground text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Saltar
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className={`gap-2 text-sm ${
                    isLast
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isLast ? (
                    <><CheckCircle2 className="h-4 w-4" /> ¡Listo, comencemos!</>
                  ) : (
                    <>Siguiente <ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
