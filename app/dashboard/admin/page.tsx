"use client"

import { useState, useEffect } from "react"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { AdminLogin } from "@/components/auth/admin-login"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-28 skeleton" />
                <div className="h-3 w-44 skeleton" />
              </div>
            </div>
            <div className="h-9 w-32 rounded-md skeleton" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl skeleton" />
                <div className="space-y-2">
                  <div className="h-7 w-10 skeleton" />
                  <div className="h-3 w-32 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-6 space-y-4">
          <div className="h-5 w-48 skeleton" />
          <div className="h-40 w-full skeleton rounded-lg" />
        </div>
      </div>

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
            className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg"
          >
            <ShieldCheck className="h-6 w-6 text-white" />
          </motion.div>
          <p className="text-sm font-medium text-muted-foreground">Cargando Panel Admin...</p>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    const stored = localStorage.getItem("adminData")
    if (auth && stored) {
      setIsAuthenticated(true)
      setAdminData(JSON.parse(stored))
    }
    setIsChecking(false)
  }, [])

  const handleLoginSuccess = (data: any) => {
    setAdminData(data)
    setIsAuthenticated(true)
  }

  if (isChecking) return <LoadingSkeleton />

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminDashboard adminData={adminData} />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
