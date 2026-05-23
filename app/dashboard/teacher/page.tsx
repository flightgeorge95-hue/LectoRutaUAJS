"use client"

import { useState, useEffect } from "react"
import { ModernTeacherDashboard } from "@/components/dashboard/modern-teacher-dashboard"
import { TeacherLogin } from "@/components/auth/teacher-login"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg skeleton" />
              <div className="space-y-2">
                <div className="h-5 w-40 skeleton" />
                <div className="h-3 w-56 skeleton" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1.5 text-right">
                <div className="h-4 w-36 skeleton ml-auto" />
                <div className="h-3 w-24 skeleton ml-auto" />
              </div>
              <div className="h-10 w-10 rounded-full skeleton" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg skeleton" />
                <div className="space-y-2 flex-1">
                  <div className="h-7 w-14 skeleton" />
                  <div className="h-3 w-20 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6 space-y-4">
            <div className="h-5 w-44 skeleton" />
            <div className="h-3 w-full skeleton" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full skeleton" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-3 w-24 skeleton" />
                  </div>
                  <div className="h-6 w-16 rounded-full skeleton" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-6 space-y-4">
            <div className="h-5 w-36 skeleton" />
            <div className="h-48 w-full skeleton rounded-lg" />
          </div>
        </div>
      </div>

      {/* Centered branding */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg"
          >
            <BookOpen className="h-6 w-6 text-white" />
          </motion.div>
          <p className="text-sm font-medium text-muted-foreground">Cargando Panel Docente...</p>
        </motion.div>
      </div>
    </div>
  )
}

export default function TeacherDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const auth = localStorage.getItem("teacherAuth")
    const storedUserData = localStorage.getItem("teacherData") || localStorage.getItem("userData")
    if (auth && storedUserData) {
      setIsAuthenticated(true)
      setUserData(JSON.parse(storedUserData))
    }
    setIsChecking(false)
  }, [])

  const handleLoginSuccess = (data: any) => {
    setUserData(data)
    setIsAuthenticated(true)
  }

  if (isChecking) {
    return <LoadingSkeleton />
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <TeacherLogin onLoginSuccess={handleLoginSuccess} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ModernTeacherDashboard userData={userData} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
