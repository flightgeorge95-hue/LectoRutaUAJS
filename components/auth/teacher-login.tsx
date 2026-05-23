"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  BookOpen, Lock, User, AlertCircle, CheckCircle2,
  Eye, EyeOff, GraduationCap, BarChart3, Users, Sparkles,
  BookMarked, Lightbulb, PenLine, Target, ArrowLeft,
} from "lucide-react"

interface TeacherLoginProps {
  onLoginSuccess: (teacherData: any) => void
}

const FLOATING_ICONS = [
  { Icon: BookOpen, delay: 0, x: "10%", y: "15%" },
  { Icon: GraduationCap, delay: 0.4, x: "80%", y: "10%" },
  { Icon: PenLine, delay: 0.8, x: "20%", y: "70%" },
  { Icon: Lightbulb, delay: 1.2, x: "75%", y: "65%" },
  { Icon: Target, delay: 0.6, x: "50%", y: "80%" },
  { Icon: BookMarked, delay: 1.6, x: "5%", y: "45%" },
  { Icon: BarChart3, delay: 2.0, x: "88%", y: "38%" },
  { Icon: Users, delay: 1.0, x: "42%", y: "5%" },
]

const FEATURES = [
  { icon: BarChart3, label: "Métricas en tiempo real", desc: "Progreso de cada estudiante" },
  { icon: Users, label: "Gestión de grupos", desc: "Grados 10° y 11°" },
  { icon: Target, label: "Competencias ICFES", desc: "Lectura crítica focalizada" },
]

export function TeacherLogin({ onLoginSuccess }: TeacherLoginProps) {
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      localStorage.setItem("teacherAuth", "true")
      localStorage.setItem("teacherData", JSON.stringify(data.user))

      setShowSuccess(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      onLoginSuccess(data.user)
    } catch {
      setError("Error de conexión. Por favor intenta nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 flex-col items-center justify-center p-12 overflow-hidden">

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 bg-blue-500/20 rounded-full -top-20 -left-20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 bg-violet-500/20 rounded-full -bottom-10 -right-10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute w-64 h-64 bg-indigo-400/15 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating icons */}
        {FLOATING_ICONS.map(({ Icon, delay, x, y }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15"
            style={{ left: x, top: y }}
            animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="w-8 h-8" />
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-4xl font-extrabold tracking-tight"
            >
              LectoRuta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-blue-200 mt-2 text-lg font-medium"
            >
              Saber 11 · UAJS
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-blue-100/70 mt-3 text-sm leading-relaxed"
            >
              Plataforma educativa para fortalecer competencias de lectura crítica en estudiantes de educación media.
            </motion.p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-blue-200">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">

        {/* Subtle background pattern for small screens */}
        <div className="absolute inset-0 pointer-events-none lg:hidden overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 13) % 90}%`,
                top: `${(i * 17) % 85}%`,
              }}
              animate={{ y: [0, -10, 0], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            >
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mb-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LectoRuta
            </h1>
          </div>

          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Portal Docente</h2>
              <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cédula */}
              <div className="space-y-2">
                <Label htmlFor="cedula" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-blue-600" />
                  Cédula
                </Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ej: 80123456"
                  value={cedula}
                  onChange={(e) => { setCedula(e.target.value); setError("") }}
                  disabled={isLoading}
                  className="h-11 border-2 focus:border-blue-500 transition-colors rounded-xl"
                  maxLength={10}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Lock className="w-4 h-4 text-blue-600" />
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
                    className="h-11 border-2 focus:border-blue-500 transition-colors rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}
                {showSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">¡Bienvenido de vuelta!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || !cedula || !password}
                className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
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
                    Acceder al Panel
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>LectoRuta Saber 11 · UAJS · 2025</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
