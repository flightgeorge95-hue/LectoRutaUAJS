"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Users, BookOpen, Target, ClipboardList, FileText, BarChart3,
  ChevronRight, ChevronLeft, Sparkles, Zap, CheckCircle2, GraduationCap,
  TrendingUp, Star,
} from "lucide-react"

const HIGHLIGHT_STYLES = [
  { bg: "bg-blue-100 dark:bg-blue-900/60", border: "border-blue-300 dark:border-blue-700", icon: "text-blue-700 dark:text-blue-300", text: "text-blue-800 dark:text-blue-200" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/60", border: "border-indigo-300 dark:border-indigo-700", icon: "text-indigo-700 dark:text-indigo-300", text: "text-indigo-800 dark:text-indigo-200" },
  { bg: "bg-violet-100 dark:bg-violet-900/60", border: "border-violet-300 dark:border-violet-700", icon: "text-violet-700 dark:text-violet-300", text: "text-violet-800 dark:text-violet-200" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/60", border: "border-emerald-300 dark:border-emerald-700", icon: "text-emerald-700 dark:text-emerald-300", text: "text-emerald-800 dark:text-emerald-200" },
  { bg: "bg-amber-100 dark:bg-amber-900/60", border: "border-amber-300 dark:border-amber-700", icon: "text-amber-700 dark:text-amber-300", text: "text-amber-800 dark:text-amber-200" },
]

const STEPS = [
  {
    icon: Sparkles,
    gradient: "from-blue-600 to-indigo-700",
    emoji: "📊",
    title: "Panel Docente — Vista General",
    description:
      "Bienvenido a tu panel de control. Aquí gestionas estudiantes, talleres, calificaciones y recursos. Todo lo que necesitas para dar seguimiento a tus grados 10° y 11°.",
    highlight: "Métricas globales en tiempo real de todos tus estudiantes",
  },
  {
    icon: Users,
    gradient: "from-indigo-600 to-violet-700",
    emoji: "👥",
    title: "Gestión por Grados",
    description:
      "Alterna entre Grado 10° y 11° con el selector. Cada grado tiene su propia lista de estudiantes con métricas individuales: puntaje, nivel, progreso de talleres y promedio.",
    highlight: "Selecciona un estudiante para ver sus métricas detalladas al instante",
  },
  {
    icon: BookOpen,
    gradient: "from-violet-600 to-purple-700",
    emoji: "📝",
    title: "Talleres y Exámenes",
    description:
      "Crea y asigna talleres de lectura crítica con preguntas de opción múltiple y abiertas. Los estudiantes reciben las misiones automáticamente y tú ves su progreso en vivo.",
    highlight: "Resultados visibles al instante con auto-calificación de opción múltiple",
  },
  {
    icon: ClipboardList,
    gradient: "from-purple-600 to-pink-700",
    emoji: "✅",
    title: "Calificación de Preguntas Abiertas",
    description:
      "Cuando un estudiante completa un taller con preguntas abiertas, aparece en tu sección de revisión. Asignas una nota de 0 a 10 y se convierte automáticamente a escala colombiana (0.0 – 5.0). Incluye retroalimentación para el estudiante.",
    highlight: "El sistema calcula el promedio ponderado entre opción múltiple y abiertas",
  },
  {
    icon: BarChart3,
    gradient: "from-emerald-600 to-teal-700",
    emoji: "📈",
    title: "Métricas y Reportes",
    description:
      "Revisa el progreso individual: puntos, nivel, promedio, barras por competencia (literal, inferencial, crítica), fortalezas y áreas de mejora. También puedes exportar reportes PDF del curso completo o de un estudiante en específico.",
    highlight: "Porcentaje de completación del curso calculado en tiempo real",
  },
  {
    icon: Star,
    gradient: "from-amber-600 to-orange-700",
    emoji: "📰",
    title: "Publicar Noticias y Recursos",
    description:
      "Comparte tips, videos educativos, guías de estudio e imágenes con tus estudiantes. Los recursos aparecen en la sección Biblioteca ICFES del dashboard del estudiante con opción de Me Gusta y Guardar.",
    highlight: "Contenido preparatorio enfocado en las Pruebas Saber 11",
  },
]

interface TeacherOnboardingTutorialProps {
  teacherName?: string
}

export function TeacherOnboardingTutorial({ teacherName }: TeacherOnboardingTutorialProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("teacherOnboardingSeen")
    if (!seen) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem("teacherOnboardingSeen")) {
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
    localStorage.setItem("teacherOnboardingSeen", "true")
    setDismissed(true)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setShowTutorial(false)
      localStorage.setItem("teacherOnboardingSeen", "true")
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
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">
                      {teacherName ? `¡Hola, Prof. ${teacherName}!` : "¡Bienvenido!"} 👋
                    </p>
                    <p className="text-blue-200 text-xs">¿Quieres ver cómo funciona tu panel?</p>
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 text-sm h-10"
                >
                  <Zap className="h-4 w-4" /> Sí, mostrar
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkip}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="relative w-full sm:max-w-lg bg-card sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Top gradient */}
              <div className={`bg-gradient-to-br ${current.gradient} px-6 sm:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 text-center relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

                <div className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white/90">
                  {step + 1} / {STEPS.length}
                </div>

                <motion.div
                  key={step}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto border-2 border-white/30 shadow-xl mb-4"
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>

                <div className="text-4xl sm:text-5xl mb-3">{current.emoji}</div>

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
                    <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 ${HIGHLIGHT_STYLES[step].icon}`} />
                    <p className={`text-xs sm:text-sm font-medium ${HIGHLIGHT_STYLES[step].text}`}>
                      {current.highlight}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-center gap-1.5 mt-6">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === step ? "w-7 bg-blue-600" : "w-2 bg-muted-foreground/30"
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
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isLast ? (
                    <><CheckCircle2 className="h-4 w-4" /> ¡Listo, al panel!</>
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
