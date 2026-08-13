"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PDFExport } from "@/components/pdf-export"
import { PDFCourseReport } from "@/components/pdf-course-report"
import { WorkshopAssignmentDialog } from "@/components/teacher/workshop-assignment-dialog"
import { ResourcePublishDialog } from "@/components/teacher/resource-publish-dialog"
import { QuickAssignDialog } from "@/components/teacher/quick-assign-dialog"
import { ExcelExportButton } from "@/components/teacher/excel-export-button"
import {
  Users, BookOpen, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Target, BarChart3, ArrowLeft, LogOut, Loader2, RefreshCw,
  ClipboardList, Star, Send, ChevronDown, ChevronUp,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { TeacherOnboardingTutorial } from "@/components/teacher-onboarding-tutorial"

interface ModernTeacherDashboardProps {
  userData: {
    _id?: string
    id?: string
    teacherId?: string
    userId?: string
    firstName: string
    lastName: string
    cedula: string
    institution: string
    subject: string
    gradesTeaching: number[]
  }
}

interface StudentMetric {
  id: string
  _id: string
  firstName: string
  lastName: string
  name: string
  grade: number
  tarjetaIdentidad: string
  email: string
  points: number
  level: number
  completedWorkshops: number
  assignedWorkshops: number
  totalWorkshops: number
  averageScore: number
  lastActivity: string | null
  competencyStats: { literal: number; inferential: number; critical: number }
  strongCompetencies: string[]
  weakCompetencies: string[]
  status: "excellent" | "active" | "needs_attention" | "inactive"
  colombianGrade?: number
  needsAttentionReasons?: string[]
}

interface GradeStats {
  totalStudents: number
  averageScore: number
  completionRate: number
  needsAttention: number
  excellentCount: number
  totalCompletedWorkshops: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  excellent: { label: "Excelente", color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" },
  active: { label: "Activo", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
  needs_attention: { label: "Requiere atención", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" },
  inactive: { label: "Sin actividad", color: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
}

export function ModernTeacherDashboard({ userData }: ModernTeacherDashboardProps) {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState<number>(10)
  const [selectedStudent, setSelectedStudent] = useState<StudentMetric | null>(null)
  const [students, setStudents] = useState<StudentMetric[]>([])
  const [gradeStats, setGradeStats] = useState<GradeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Global stats across both grades
  const [allStudents, setAllStudents] = useState<StudentMetric[]>([])
  const [globalLoaded, setGlobalLoaded] = useState(false)

  // Revisión de preguntas abiertas
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [pendingLoaded, setPendingLoaded] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewDetail, setReviewDetail] = useState<any>(null)
  const [reviewGrades, setReviewGrades] = useState<Record<string, { grade: string; feedback: string }>>({})
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState("")

  const teacherId = userData._id || userData.id || userData.teacherId || userData.userId || ""
  const teacherName = `${userData.firstName} ${userData.lastName}`

  const fetchGrade = useCallback(async (grade: number, silent = false) => {
    if (![10, 11].includes(grade)) return
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await fetch(`/api/teacher/metrics?grade=${grade}`)
      const data = await res.json()
      if (data.success) {
        setStudents(data.students)
        setGradeStats(data.gradeStats)
        setSelectedStudent(null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Load global stats (both grades) for header cards
  const fetchGlobal = useCallback(async () => {
    try {
      const [r10, r11] = await Promise.all([
        fetch("/api/teacher/metrics?grade=10"),
        fetch("/api/teacher/metrics?grade=11"),
      ])
      const [d10, d11] = await Promise.all([r10.json(), r11.json()])
      const combined = [...(d10.students || []), ...(d11.students || [])]
      setAllStudents(combined)
    } catch {}
    setGlobalLoaded(true)
  }, [])

  const fetchPendingReviews = useCallback(async () => {
    if (!teacherId) return
    try {
      const res = await fetch(`/api/teacher/review?teacherId=${teacherId}`)
      const data = await res.json()
      if (data.success) setPendingReviews(data.pending || [])
    } catch (e) {
      console.error(e)
    } finally {
      setPendingLoaded(true)
    }
  }, [teacherId])

  const openReviewModal = async (completionId: string) => {
    try {
      const res = await fetch(`/api/teacher/review/${completionId}`)
      const data = await res.json()
      if (data.success) {
        setReviewDetail(data)
        // Pre-fill grade inputs for open questions
        const initial: Record<string, { grade: string; feedback: string }> = {}
        for (const ans of data.answers || []) {
          if (ans.questionId?.questionType === "open_ended") {
            initial[ans._id] = { grade: "", feedback: "" }
          }
        }
        setReviewGrades(initial)
        setReviewSuccess("")
        setReviewModalOpen(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const submitReview = async () => {
    if (!reviewDetail) return
    const completionId = reviewDetail.completion._id
    const grades = Object.entries(reviewGrades).map(([progressId, val]) => ({
      progressId,
      grade: parseFloat(val.grade),
      feedback: val.feedback,
    }))

    if (grades.some((g) => isNaN(g.grade) || g.grade < 0 || g.grade > 10)) {
      alert("Todas las notas deben ser un número entre 0 y 10")
      return
    }

    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/teacher/review/${completionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, grades }),
      })
      const data = await res.json()
      if (data.success) {
        setReviewSuccess(`Nota final enviada: ${data.finalGrade}/5.0 — El estudiante ya puede ver su calificación.`)
        setPendingReviews((prev) => prev.filter((r) => r._id !== completionId))
        setTimeout(() => { setReviewModalOpen(false); setReviewSuccess("") }, 3000)
      } else {
        alert(data.error || "Error al calificar")
      }
    } catch (e) {
      alert("Error de conexión")
    } finally {
      setSubmittingReview(false)
    }
  }

  useEffect(() => {
    fetchGlobal()
    fetchGrade(selectedGrade)
    fetchPendingReviews()
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchGrade(selectedGrade)
  }, [selectedGrade, fetchGrade])

  // Global aggregate
  const totalStudents = globalLoaded ? allStudents.length : "…"
  const globalAverage = globalLoaded && allStudents.length > 0
    ? Math.round(allStudents.filter(s => s.completedWorkshops > 0).reduce((sum, s) => sum + s.averageScore, 0) / Math.max(1, allStudents.filter(s => s.completedWorkshops > 0).length))
    : 0
  const totalCompleted = globalLoaded ? allStudents.reduce((sum, s) => sum + s.completedWorkshops, 0) : 0
  const needsAttentionGlobal = globalLoaded ? allStudents.filter(s => s.status === "needs_attention" || s.status === "inactive").length : 0

  return (
    <div className="min-h-screen bg-background">
      <TeacherOnboardingTutorial teacherName={userData.firstName} />
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-40 safe-area-top">
        <div className="container mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="shrink-0 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold truncate">Panel Docente</h1>
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{userData.institution}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs sm:text-sm font-medium">Prof. {userData.firstName} {userData.lastName}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{userData.subject}</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">
                  {userData.firstName[0]}{userData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" })
                  localStorage.removeItem("teacherData")
                  localStorage.removeItem("teacherAuth")
                  localStorage.removeItem("userData")
                  window.location.href = "/"
                }}
                className="gap-1 text-muted-foreground hover:text-red-600 h-8 sm:h-9 px-2 sm:px-3"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {[
            { icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, value: totalStudents, label: "Total estudiantes", bg: "bg-blue-600" },
            { icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />, value: `${globalAverage}%`, label: "Promedio general", bg: "bg-purple-600" },
            { icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, value: totalCompleted, label: "Talleres completados", bg: "bg-emerald-600" },
            { icon: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />, value: needsAttentionGlobal, label: "Requieren atención", bg: "bg-amber-500" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${stat.bg} text-white shadow`}>
                      {stat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Grade Selector + Actions */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg">Gestión por Grado</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Selecciona un grado para ver métricas</CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <WorkshopAssignmentDialog teacherId={teacherId} />
                <ResourcePublishDialog teacherId={teacherId} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-3 sm:pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <Select value={selectedGrade.toString()} onValueChange={(v) => setSelectedGrade(Number(v))}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Grado 10°</SelectItem>
                  <SelectItem value="11">Grado 11°</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchGrade(selectedGrade, true)}
                  disabled={refreshing}
                  className="gap-1.5 text-muted-foreground h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
                {gradeStats && students.length > 0 && (
                  <PDFCourseReport
                    grade={selectedGrade}
                    students={students}
                    gradeStats={gradeStats}
                    teacherName={teacherName}
                    institution={userData.institution}
                  />
                )}
                {gradeStats && students.length > 0 && <ExcelExportButton grade={selectedGrade} />}
              </div>
            </div>

            {/* Grade Mini-Stats */}
            {gradeStats && !loading && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-4 rounded-xl bg-muted/40">
                  <p className="text-base sm:text-2xl font-bold">{gradeStats.averageScore > 0 ? `${gradeStats.averageScore}%` : "—"}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Promedio Grado {selectedGrade}°</p>
                </div>
                <div className="text-center p-2 sm:p-4 rounded-xl bg-muted/40">
                  <p className="text-base sm:text-2xl font-bold">{gradeStats.completionRate > 0 ? `${gradeStats.completionRate}%` : "—"}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Tasa completación</p>
                </div>
                <div className="text-center p-2 sm:p-4 rounded-xl bg-muted/40">
                  <p className="text-base sm:text-2xl font-bold text-emerald-600">{gradeStats.excellentCount}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Destacados</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Students List + Details */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* List */}
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
              <CardTitle className="flex items-center justify-between text-sm sm:text-lg">
                <span>Estudiantes — Grado {selectedGrade}°</span>
                {!loading && <span className="text-[10px] sm:text-sm font-normal text-muted-foreground">{students.length} alumnos</span>}
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-sm">Haz clic para ver métricas detalladas</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3">
              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 sm:py-10 text-muted-foreground">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 opacity-30" />
                  <p className="text-xs sm:text-sm">No hay estudiantes en grado {selectedGrade}°</p>
                </div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {students.map((student) => {
                    const statusCfg = STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive
                    const isSelected = selectedStudent?.id === student.id
                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                          isSelected ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-700" : "border-border hover:border-muted-foreground/30"
                        }`}
                        onClick={() => setSelectedStudent(isSelected ? null : student)}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                            <AvatarFallback className="text-[10px] sm:text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-semibold text-xs sm:text-sm truncate">{student.firstName} {student.lastName}</p>
                              {(student.status === "needs_attention" || student.status === "inactive") && (
                                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
                              <Badge variant="outline" className={`text-[9px] sm:text-xs px-1 sm:px-1.5 py-0 ${statusCfg.color}`}>
                                {statusCfg.label}
                              </Badge>
                              <span className="text-[9px] sm:text-xs text-muted-foreground whitespace-nowrap">
                                {student.colombianGrade
                                  ? `${student.colombianGrade}/5.0`
                                  : student.averageScore > 0
                                    ? `${student.averageScore}%`
                                    : "Sin datos"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-semibold">{student.completedWorkshops}/{student.assignedWorkshops}</p>
                            <p className="text-[9px] sm:text-xs text-muted-foreground">Talleres</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
              <CardTitle className="text-sm sm:text-lg">Detalles del Estudiante</CardTitle>
              <CardDescription className="text-[10px] sm:text-sm">
                {selectedStudent
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName} — Grado ${selectedStudent.grade}°`
                  : "Selecciona un estudiante para ver sus métricas"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3">
              {!selectedStudent ? (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                  <p className="text-xs sm:text-sm">Selecciona un estudiante de la lista</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {/* Basic info */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                    <div className="rounded-xl bg-muted/40 p-2 sm:p-3">
                      <p className="text-base sm:text-xl font-bold">{selectedStudent.points}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground">Puntos</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-2 sm:p-3">
                      <p className="text-base sm:text-xl font-bold">Nv. {selectedStudent.level}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground">Nivel</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-2 sm:p-3">
                      <p className="text-base sm:text-xl font-bold">{selectedStudent.averageScore > 0 ? `${selectedStudent.averageScore}%` : "—"}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground">Promedio</p>
                    </div>
                  </div>

                  {/* Workshop progress */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Progreso de talleres</span>
                      <span className="font-medium">{selectedStudent.completedWorkshops}/{selectedStudent.assignedWorkshops}</span>
                    </div>
                    <Progress
                      value={selectedStudent.assignedWorkshops > 0 ? (selectedStudent.completedWorkshops / selectedStudent.assignedWorkshops) * 100 : 0}
                      className="h-2 sm:h-2.5"
                    />
                  </div>

                  {/* Competency bars */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-xs sm:text-sm font-semibold">Métricas por Competencia</h4>
                    {[
                      { key: "literal", label: "Literal", icon: "📖", color: "bg-emerald-500" },
                      { key: "inferential", label: "Inferencial", icon: "🔍", color: "bg-blue-500" },
                      { key: "critical", label: "Crítica", icon: "💡", color: "bg-purple-500" },
                    ].map((comp) => {
                      const val = (selectedStudent.competencyStats as any)[comp.key] || 0
                      return (
                        <div key={comp.key}>
                          <div className="flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                            <span className="flex items-center gap-1">{comp.icon} {comp.label}</span>
                            <span className="font-medium">{val > 0 ? `${val}%` : "Sin datos"}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full ${comp.color} rounded-full`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Strengths / Weaknesses */}
                  <div className="space-y-2 sm:space-y-3">
                    {selectedStudent.strongCompetencies.length > 0 && (
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-emerald-600 mb-1 sm:mb-2">Fortalezas</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {selectedStudent.strongCompetencies.map((c) => (
                            <Badge key={c} variant="outline" className="text-[9px] sm:text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
                              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" /> {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedStudent.weakCompetencies.length > 0 && (
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-amber-600 mb-1 sm:mb-2">Áreas de mejora</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {selectedStudent.weakCompetencies.map((c) => (
                            <Badge key={c} variant="outline" className="text-[9px] sm:text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                              <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" /> {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(selectedStudent.status === "needs_attention" || selectedStudent.status === "inactive") &&
                      selectedStudent.needsAttentionReasons &&
                      selectedStudent.needsAttentionReasons.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-2 sm:p-3 space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1">
                            <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Requiere atención
                          </div>
                          {selectedStudent.needsAttentionReasons.map((reason, i) => (
                            <p key={i} className="text-[9px] sm:text-xs text-amber-700 dark:text-amber-300">• {reason}</p>
                          ))}
                        </div>
                      )}
                    {selectedStudent.completedWorkshops === 0 && selectedStudent.status !== "needs_attention" && selectedStudent.status !== "inactive" && (
                      <p className="text-[9px] sm:text-xs text-muted-foreground bg-muted/40 rounded-lg p-2 sm:p-3">
                        Este estudiante aún no ha completado talleres. Considera asignar un taller sencillo para empezar.
                      </p>
                    )}
                  </div>

                  {/* Last activity */}
                  {selectedStudent.lastActivity && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs p-2 sm:p-3 rounded-lg bg-muted/40">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Última actividad:</span>
                      <span className="font-medium">
                        {new Date(selectedStudent.lastActivity).toLocaleDateString("es-CO", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                    <PDFExport
                      student={{
                        ...selectedStudent,
                        class: `${selectedStudent.grade}°`,
                        totalWorkshops: selectedStudent.assignedWorkshops,
                        lastActivity: selectedStudent.lastActivity || "",
                        colombianGrade: selectedStudent.colombianGrade,
                        needsAttentionReasons: selectedStudent.needsAttentionReasons,
                      }}
                      teacherName={teacherName}
                      institution={userData.institution}
                    />
                    <QuickAssignDialog
                      studentId={selectedStudent.id}
                      studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                      studentGrade={selectedStudent.grade}
                      teacherId={teacherId}
                      weakCompetencies={selectedStudent.weakCompetencies}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============ SECCIÓN: REVISIÓN DE PREGUNTAS ABIERTAS ============ */}
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-violet-600 text-white shrink-0">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm sm:text-base">Revisión de Preguntas Abiertas</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm hidden sm:block">Talleres que requieren calificación manual</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {pendingReviews.length > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6">
                    {pendingReviews.length}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={fetchPendingReviews} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3">
            {!pendingLoaded ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center gap-2 sm:gap-3">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-emerald-400" />
                <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm sm:text-base">¡Al día!</p>
                <p className="text-xs sm:text-sm text-muted-foreground">No hay talleres pendientes de calificación.</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {pendingReviews.map((review: any) => {
                  const student = review.studentId
                  const workshop = review.workshopId
                  const submittedAt = review.completedAt
                    ? new Date(review.completedAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "—"
                  return (
                    <div
                      key={review._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border bg-violet-50/50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-800 hover:border-violet-300 transition-colors gap-2 sm:gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm">{student?.firstName} {student?.lastName}</span>
                          <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium">
                            Grado {student?.grade}°
                          </span>
                          <span className="text-[9px] sm:text-xs text-muted-foreground hidden xs:inline">·</span>
                          <span className="text-[9px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">{workshop?.title}</span>
                        </div>
                        <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5">Enviado: {submittedAt}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => router.push(`/teacher/review/${review._id}`)}
                      >
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                        Calificar
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ============ MODAL DE CALIFICACIÓN ============ */}
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
          <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                Calificar Preguntas Abiertas
              </DialogTitle>
            </DialogHeader>

            {reviewDetail && (
              <div className="space-y-4 sm:space-y-5">
                {/* Info del estudiante y taller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Estudiante</p>
                    <p className="font-semibold text-xs sm:text-sm">
                      {reviewDetail.completion?.studentId?.firstName} {reviewDetail.completion?.studentId?.lastName}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground">
                      Grado {reviewDetail.completion?.studentId?.grade}° · TI {reviewDetail.completion?.studentId?.tarjetaIdentidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Taller</p>
                    <p className="font-semibold text-xs sm:text-sm">{reviewDetail.completion?.workshopId?.title}</p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground">{reviewDetail.completion?.workshopId?.subject}</p>
                  </div>
                </div>

                {reviewSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8 gap-2 sm:gap-3 text-center">
                    <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-emerald-500" />
                    <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm sm:text-lg">{reviewSuccess}</p>
                  </div>
                ) : (
                  <>
                    {/* Preguntas a calificar */}
                    <div className="space-y-4 sm:space-y-6">
                      {(reviewDetail.answers || [])
                        .filter((ans: any) => ans.questionId?.questionType === "open_ended")
                        .map((ans: any, idx: number) => (
                          <div key={ans._id} className="border rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[9px] sm:text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-[9px] sm:text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wide">
                                Pregunta Abierta
                              </span>
                              <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {ans.questionId?.competence?.split(" ").slice(0, 2).join(" ") || "Lectura Crítica"}
                              </span>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                              <p className="text-[9px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1">ENUNCIADO</p>
                              <p className="text-xs sm:text-sm">{ans.questionId?.questionText}</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 sm:p-3 border border-blue-100 dark:border-blue-900">
                              <p className="text-[9px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1">RESPUESTA DEL ESTUDIANTE</p>
                              <p className="text-xs sm:text-sm whitespace-pre-wrap">
                                {ans.openAnswer || <span className="italic text-muted-foreground">Sin respuesta</span>}
                              </p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              <div>
                                <Label htmlFor={`grade-${ans._id}`} className="text-[9px] sm:text-xs font-semibold">
                                  Nota (0 – 10) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id={`grade-${ans._id}`}
                                  type="number"
                                  min={0}
                                  max={10}
                                  step={0.5}
                                  placeholder="Ej: 7.5"
                                  value={reviewGrades[ans._id]?.grade || ""}
                                  onChange={(e) =>
                                    setReviewGrades((prev) => ({
                                      ...prev,
                                      [ans._id]: { ...prev[ans._id], grade: e.target.value },
                                    }))
                                  }
                                  className="mt-1 h-9 sm:h-10 text-sm"
                                />
                                <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5">
                                  {reviewGrades[ans._id]?.grade
                                    ? `= ${(parseFloat(reviewGrades[ans._id].grade) / 2).toFixed(1)}/5.0`
                                    : ""}
                                </p>
                              </div>
                              <div>
                                <Label htmlFor={`feedback-${ans._id}`} className="text-[9px] sm:text-xs font-semibold">
                                  Retroalimentación (opcional)
                                </Label>
                                <Textarea
                                  id={`feedback-${ans._id}`}
                                  placeholder="Comentario..."
                                  value={reviewGrades[ans._id]?.feedback || ""}
                                  onChange={(e) =>
                                    setReviewGrades((prev) => ({
                                      ...prev,
                                      [ans._id]: { ...prev[ans._id], feedback: e.target.value },
                                    }))
                                  }
                                  rows={2}
                                  className="mt-1 text-xs sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">Sistema de calificación</p>
                      <p className="text-amber-700 dark:text-amber-300 text-[9px] sm:text-xs mt-0.5 sm:mt-1">
                        La nota final se calcula como promedio ponderado entre las preguntas de opción múltiple (auto-calificadas) y las preguntas abiertas que estás calificando, convertido a escala colombiana 0.0–5.0. Los puntos XP del estudiante se otorgan al enviar esta calificación.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!reviewSuccess && (
              <DialogFooter className="gap-2 flex-col sm:flex-row">
                <Button variant="outline" onClick={() => setReviewModalOpen(false)} disabled={submittingReview} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                  Cancelar
                </Button>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-2 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
                  onClick={submitReview}
                  disabled={submittingReview || Object.values(reviewGrades).some((v) => !v.grade)}
                >
                  {submittingReview ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  Enviar Nota
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
