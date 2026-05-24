"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, User, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react"

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
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
      const response = await fetch("/api/auth/login-admin", {
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

      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminData", JSON.stringify(data.user))

      setShowSuccess(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onLoginSuccess(data.user)
    } catch {
      setError("Error de conexión. Por favor intenta nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 safe-area-bottom">
      {/* Partículas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000)],
              x: [null, Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000)],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/90">
          <CardHeader className="space-y-2 sm:space-y-4 text-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Panel Administrador
              </CardTitle>
              <CardDescription className="text-xs sm:text-base mt-1 sm:mt-2">
                Acceso exclusivo para administradores
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="cedula" className="text-xs sm:text-base font-medium flex items-center gap-1.5 sm:gap-2">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  Cédula de Administrador
                </Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ej: 00000001"
                  value={cedula}
                  onChange={(e) => {
                    setCedula(e.target.value)
                    setError("")
                  }}
                  disabled={isLoading}
                  className="h-10 sm:h-12 text-sm sm:text-lg border-2 focus:border-emerald-500 transition-colors touch-friendly-text"
                  maxLength={15}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-base font-medium flex items-center gap-1.5 sm:gap-2">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    disabled={isLoading}
                    className="h-10 sm:h-12 text-sm sm:text-lg border-2 focus:border-emerald-500 transition-colors pr-10 sm:pr-12 touch-friendly-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-muted-foreground dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}

                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Acceso autorizado</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isLoading || !cedula || !password}
                className="w-full h-10 sm:h-12 text-sm sm:text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    Ingresar al Sistema
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      →
                    </motion.div>
                  </span>
                )}
              </Button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
            >
              <p className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 text-center">
                Acceso restringido — Solo personal autorizado del sistema
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
