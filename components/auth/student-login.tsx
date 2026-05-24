"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  GraduationCap, CreditCard, Lock, Sparkles, AlertCircle,
  CheckCircle2, Eye, EyeOff, Trophy, Zap, Flame, Star,
  Target, BookOpen, ArrowLeft, Rocket, Lightbulb, Brain, ChevronRight,
} from "lucide-react"

interface StudentLoginProps {
  onLoginSuccess: (studentData: any) => void
}

const ORBS = [
  { size: "w-72 h-72", pos: "-top-20 -left-20", color: "bg-violet-500/20", dur: 7 },
  { size: "w-64 h-64", pos: "-bottom-16 -right-16", color: "bg-pink-500/20", dur: 9 },
  { size: "w-48 h-48", pos: "top-1/3 left-1/2 -translate-x-1/2", color: "bg-fuchsia-400/15", dur: 11 },
]

const FLOATERS = [
  { Icon: Trophy,      x: "8%",  y: "12%", delay: 0,    color: "text-yellow-300/30" },
  { Icon: Star,        x: "82%", y: "8%",  delay: 0.5,  color: "text-pink-300/30" },
  { Icon: Flame,       x: "15%", y: "72%", delay: 1.0,  color: "text-orange-300/30" },
  { Icon: Zap,         x: "78%", y: "68%", delay: 1.5,  color: "text-violet-300/30" },
  { Icon: Target,      x: "50%", y: "85%", delay: 0.8,  color: "text-fuchsia-300/30" },
  { Icon: BookOpen,    x: "4%",  y: "42%", delay: 1.8,  color: "text-blue-300/30" },
  { Icon: Rocket,      x: "88%", y: "35%", delay: 2.2,  color: "text-pink-300/30" },
  { Icon: GraduationCap, x: "45%", y: "4%", delay: 1.2, color: "text-yellow-300/30" },
]

const TIPS = [
  {
    tag: "📖 Lectura Literal",
    color: "from-emerald-400/20 to-emerald-600/10",
    border: "border-emerald-400/30",
    tagColor: "text-emerald-300",
    title: "¿Qué dice el texto?",
    body: "La lectura literal identifica información explícita: datos, nombres, fechas y hechos que aparecen directamente en el texto. Es el nivel base de comprensión.",
    tip: "Subraya palabras clave al leer.",
  },
  {
    tag: "🔍 Lectura Inferencial",
    color: "from-blue-400/20 to-blue-600/10",
    border: "border-blue-400/30",
    tagColor: "text-blue-300",
    title: "¿Qué quiere decir el autor?",
    body: "La inferencia conecta pistas del texto con tu conocimiento previo. El ICFES evalúa si puedes deducir información que NO está escrita explícitamente.",
    tip: "Pregúntate: ¿por qué el autor dice esto?",
  },
  {
    tag: "💡 Lectura Crítica",
    color: "from-violet-400/20 to-violet-600/10",
    border: "border-violet-400/30",
    tagColor: "text-violet-300",
    title: "¿Estás de acuerdo?",
    body: "El nivel crítico evalúa el texto desde afuera: reconoces intenciones, sesgos, estrategias argumentativas y el propósito comunicativo del autor.",
    tip: "Identifica a quién va dirigido el texto.",
  },
  {
    tag: "🎯 Tip ICFES",
    color: "from-pink-400/20 to-pink-600/10",
    border: "border-pink-400/30",
    tagColor: "text-pink-300",
    title: "Tipos de texto en Saber 11",
    body: "Encontrarás textos continuos (artículos, cuentos, ensayos) y discontinuos (gráficas, tablas, caricaturas). Cada uno requiere estrategias distintas de lectura.",
    tip: "Analiza el formato antes de leer.",
  },
  {
    tag: "⚡ Estrategia rápida",
    color: "from-amber-400/20 to-amber-600/10",
    border: "border-amber-400/30",
    tagColor: "text-amber-300",
    title: "El método de los 3 pasos",
    body: "1) Lee el título y las preguntas primero. 2) Lee el texto buscando respuestas. 3) Descarta opciones imposibles antes de elegir. Ahorra tiempo en el examen.",
    tip: "Nunca respondas sin leer todas las opciones.",
  },
  {
    tag: "🧠 Sabías que...",
    color: "from-fuchsia-400/20 to-fuchsia-600/10",
    border: "border-fuchsia-400/30",
    tagColor: "text-fuchsia-300",
    title: "Lectura crítica vale 100 puntos",
    body: "En las Pruebas Saber 11, Lectura Crítica tiene un peso de 100 puntos sobre 500. Practicar con textos variados aumenta significativamente tu puntaje global.",
    tip: "Lee 15 minutos diarios de textos diversos.",
  },
]

export function StudentLogin({ onLoginSuccess }: StudentLoginProps) {
  const [tarjetaIdentidad, setTarjetaIdentidad] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarjetaIdentidad, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      localStorage.setItem("studentAuth", "true")
      localStorage.setItem("studentData", JSON.stringify(data.user))

      setShowSuccess(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onLoginSuccess(data.user)
    } catch {
      setError("Error de conexión. Por favor intenta nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-violet-700 via-fuchsia-700 to-pink-700">

        {/* Blobs */}
        {ORBS.map((o, i) => (
          <motion.div
            key={i}
            className={`absolute ${o.size} ${o.pos} ${o.color} rounded-full blur-3xl`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}

        {/* Floating icons */}
        {FLOATERS.map(({ Icon, x, y, delay, color }, i) => (
          <motion.div
            key={i}
            className={`absolute ${color}`}
            style={{ left: x, top: y }}
            animate={{ y: [0, -16, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="w-9 h-9" />
          </motion.div>
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white text-center space-y-8 max-w-sm"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl"
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-3"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" /> ¡Sube de nivel!
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-extrabold tracking-tight"
            >
              LectoRuta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-pink-200 mt-2 text-lg font-semibold"
            >
              Tu aventura ICFES empieza aquí
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/60 mt-2 text-sm leading-relaxed"
            >
              Completa misiones, gana puntos y domina la lectura crítica para las Pruebas Saber 11.
            </motion.p>
          </div>

          {/* Tips carousel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest">
                <Brain className="w-3.5 h-3.5" />
                Tips de Lectura Crítica
              </div>
              <div className="flex gap-1">
                {TIPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTipIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === tipIndex ? "bg-white w-4" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card */}
            <div className="relative h-44 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className={`absolute inset-0 bg-gradient-to-br ${TIPS[tipIndex].color} backdrop-blur-sm border ${TIPS[tipIndex].border} rounded-2xl p-4 flex flex-col gap-2`}
                >
                  <span className={`text-xs font-bold ${TIPS[tipIndex].tagColor}`}>
                    {TIPS[tipIndex].tag}
                  </span>
                  <p className="text-white font-bold text-sm leading-tight">
                    {TIPS[tipIndex].title}
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
                    {TIPS[tipIndex].body}
                  </p>
                  <div className="mt-auto flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1.5">
                    <Lightbulb className="w-3 h-3 text-yellow-300 flex-shrink-0" />
                    <p className="text-xs text-white/80 italic">{TIPS[tipIndex].tip}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav arrows */}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setTipIndex((i) => (i - 1 + TIPS.length) % TIPS.length)}
                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white rotate-180" />
              </button>
              <button
                onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-start sm:items-center justify-center p-4 sm:p-6 relative overflow-y-auto">

        {/* Mobile background */}
        <div className="absolute inset-0 pointer-events-none lg:hidden overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${(i * 19) % 88}%`, top: `${(i * 23) % 82}%` }}
              animate={{ y: [0, -12, 0], opacity: [0.06, 0.15, 0.06] }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.35 }}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10 py-4 sm:py-0"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-4 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-2 sm:mb-3">
              <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              LectoRuta
            </h1>
          </div>

          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Volver al inicio
          </Link>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-5 sm:p-8 space-y-4 sm:space-y-6">

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <span className="text-xl sm:text-2xl">🎮</span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Portal Estudiante</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Ingresa y continúa tu aventura</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Tarjeta Identidad */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="tarjetaIdentidad" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600" />
                  Tarjeta de Identidad
                </Label>
                <Input
                  id="tarjetaIdentidad"
                  type="text"
                  placeholder="Ej: 1005663835"
                  value={tarjetaIdentidad}
                  onChange={(e) => { setTarjetaIdentidad(e.target.value); setError("") }}
                  disabled={isLoading}
                  className="h-11 border-2 focus:border-violet-500 transition-colors rounded-xl text-base touch-friendly-text"
                  maxLength={15}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError("") }}
                    disabled={isLoading}
                    className="h-11 border-2 focus:border-violet-500 transition-colors rounded-xl pr-11 text-base touch-friendly-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Alerts */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}
                {showSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">¡Acceso autorizado! 🚀</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || !tarjetaIdentidad || !password}
                className="w-full h-11 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 shadow-md hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Verificando...
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-2">
                    ¡Entrar a la Aventura!
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      🚀
                    </motion.span>
                  </span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-1.5 sm:pt-2 border-t border-border text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                ¿Olvidaste tu contraseña? Habla con tu docente 🎓
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
