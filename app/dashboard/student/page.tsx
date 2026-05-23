"use client"

import { useState, useEffect } from "react"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { StudentLogin } from "@/components/auth/student-login"
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
                <div className="h-5 w-36 skeleton" />
                <div className="h-3 w-48 skeleton" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1.5 text-right">
                <div className="h-4 w-28 skeleton ml-auto" />
                <div className="h-3 w-16 skeleton ml-auto" />
              </div>
              <div className="h-10 w-10 rounded-full skeleton" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg skeleton" />
                <div className="space-y-2">
                  <div className="h-6 w-12 skeleton" />
                  <div className="h-3 w-16 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="rounded-xl border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 skeleton rounded" />
            <div className="h-5 w-52 skeleton" />
          </div>
          <div className="h-3 w-72 skeleton" />
          <div className="h-3 w-full skeleton" />
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-4 stagger-children">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg skeleton" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 skeleton" />
                  <div className="h-3 w-full skeleton" />
                </div>
              </div>
              <div className="h-2 w-full skeleton" />
              <div className="space-y-1.5">
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-4/5 skeleton" />
                <div className="h-3 w-3/5 skeleton" />
              </div>
            </div>
          ))}
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
            className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg"
          >
            <BookOpen className="h-6 w-6 text-white" />
          </motion.div>
          <p className="text-sm font-medium text-muted-foreground">Cargando LectoRuta...</p>
        </motion.div>
      </div>
    </div>
  )
}

export default function StudentDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const auth = localStorage.getItem("studentAuth")
    const storedUserData = localStorage.getItem("studentData") || localStorage.getItem("userData")
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
          <StudentLogin onLoginSuccess={handleLoginSuccess} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <StudentDashboard studentData={userData} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
