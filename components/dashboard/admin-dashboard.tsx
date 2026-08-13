"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  UserPlus,
  BookMarked,
} from "lucide-react"
import { toast } from "sonner"

interface AdminDashboardProps {
  adminData: any
}

const EMPTY_STUDENT_FORM = {
  firstName: "",
  lastName: "",
  grade: "10",
  tarjetaIdentidad: "",
  password: "",
  email: "",
  phoneNumber: "",
  birthDate: "",
  enrollmentDate: "",
  status: "activo",
}

const EMPTY_TEACHER_FORM = {
  firstName: "",
  lastName: "",
  cedula: "",
  password: "",
  email: "",
  institution: "Corporación Universitaria Antonio José de Sucre",
  subject: "Lectura Crítica",
  grade10: true,
  grade11: true,
  enrollmentDate: "",
}

const STATUS_LABEL: Record<string, string> = { activo: "Activo", inactivo: "Inactivo", retirado: "Retirado" }
const STATUS_COLOR: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  inactivo: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  retirado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}

type TabKey = "grade10" | "grade11" | "teachers"

export function AdminDashboard({ adminData }: AdminDashboardProps) {
  const [students, setStudents] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>("grade10")

  // Dialogs
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  const [showCreateTeacher, setShowCreateTeacher] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "student" | "teacher"; id: string; name: string } | null>(null)
  const [editStudentId, setEditStudentId] = useState<string | null>(null)
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  // Forms
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT_FORM)
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const toDateInput = (value: any) => (value ? new Date(value).toISOString().slice(0, 10) : "")

  const openCreateStudent = () => {
    setFormError("")
    setEditStudentId(null)
    setStudentForm({ ...EMPTY_STUDENT_FORM, grade: activeTab === "grade11" ? "11" : "10" })
    setShowCreateStudent(true)
  }

  const openEditStudent = (item: any) => {
    setFormError("")
    setEditStudentId(item._id)
    setStudentForm({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      grade: String(item.grade || "10"),
      tarjetaIdentidad: item.tarjetaIdentidad || "",
      password: "",
      email: item.email || "",
      phoneNumber: item.phoneNumber || "",
      birthDate: toDateInput(item.birthDate),
      enrollmentDate: toDateInput(item.enrollmentDate),
      status: item.status || "activo",
    })
    setShowCreateStudent(true)
  }

  const openCreateTeacher = () => {
    setFormError("")
    setEditTeacherId(null)
    setTeacherForm(EMPTY_TEACHER_FORM)
    setShowCreateTeacher(true)
  }

  const openEditTeacher = (item: any) => {
    setFormError("")
    setEditTeacherId(item._id)
    setTeacherForm({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      cedula: item.cedula || "",
      password: "",
      email: item.email || "",
      institution: item.institution || "Corporación Universitaria Antonio José de Sucre",
      subject: item.subject || "Lectura Crítica",
      grade10: (item.gradesTeaching || []).includes(10),
      grade11: (item.gradesTeaching || []).includes(11),
      enrollmentDate: toDateInput(item.enrollmentDate),
    })
    setShowCreateTeacher(true)
  }

  const handleQuickStatusChange = async (studentId: string, status: string) => {
    setStatusUpdating(studentId)
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Estado actualizado a "${STATUS_LABEL[status]}"`)
      loadData()
    } catch {
      toast.error("Error al actualizar el estado")
    } finally {
      setStatusUpdating(null)
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/teachers"),
      ])
      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      if (studentsData.success) setStudents(studentsData.students)
      if (teachersData.success) setTeachers(teachersData.teachers)
    } catch {
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminData")
    window.location.href = "/"
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!editStudentId && !studentForm.password) {
      setFormError("La contraseña es obligatoria para un estudiante nuevo")
      return
    }

    setFormLoading(true)
    try {
      const isEdit = !!editStudentId
      const endpoint = isEdit ? `/api/admin/students/${editStudentId}` : "/api/admin/students"
      const payload: Record<string, any> = {
        ...studentForm,
        grade: Number(studentForm.grade),
      }
      if (isEdit && !payload.password) delete payload.password

      const res = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || `Error al ${isEdit ? "actualizar" : "crear"} estudiante`)
        return
      }
      toast.success(
        isEdit
          ? `Estudiante ${studentForm.firstName} ${studentForm.lastName} actualizado`
          : `Estudiante ${studentForm.firstName} ${studentForm.lastName} registrado exitosamente`,
      )
      setShowCreateStudent(false)
      setEditStudentId(null)
      setStudentForm(EMPTY_STUDENT_FORM)
      loadData()
    } catch {
      setFormError("Error de conexión")
    } finally {
      setFormLoading(false)
    }
  }

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    const isEdit = !!editTeacherId
    const gradesTeaching: number[] = []
    if (teacherForm.grade10) gradesTeaching.push(10)
    if (teacherForm.grade11) gradesTeaching.push(11)

    if (gradesTeaching.length === 0) {
      setFormError("Selecciona al menos un grado a enseñar")
      return
    }
    if (!isEdit && !teacherForm.password) {
      setFormError("La contraseña es obligatoria para un docente nuevo")
      return
    }

    setFormLoading(true)
    try {
      const endpoint = isEdit ? `/api/admin/teachers/${editTeacherId}` : "/api/admin/teachers"
      const payload: Record<string, any> = {
        firstName: teacherForm.firstName,
        lastName: teacherForm.lastName,
        cedula: teacherForm.cedula,
        password: teacherForm.password,
        email: teacherForm.email,
        institution: teacherForm.institution,
        subject: teacherForm.subject,
        gradesTeaching,
        enrollmentDate: teacherForm.enrollmentDate,
      }
      if (isEdit && !payload.password) delete payload.password

      const res = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || `Error al ${isEdit ? "actualizar" : "crear"} docente`)
        return
      }
      toast.success(
        isEdit
          ? `Docente ${teacherForm.firstName} ${teacherForm.lastName} actualizado`
          : `Docente ${teacherForm.firstName} ${teacherForm.lastName} registrado exitosamente`,
      )
      setShowCreateTeacher(false)
      setEditTeacherId(null)
      setTeacherForm(EMPTY_TEACHER_FORM)
      loadData()
    } catch {
      setFormError("Error de conexión")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const endpoint =
        deleteTarget.type === "student"
          ? `/api/admin/students/${deleteTarget.id}`
          : `/api/admin/teachers/${deleteTarget.id}`
      const res = await fetch(endpoint, { method: "DELETE" })
      if (res.ok) {
        toast.success(`${deleteTarget.type === "student" ? "Estudiante" : "Docente"} eliminado`)
        loadData()
      } else {
        toast.error("Error al eliminar")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setDeleteTarget(null)
    }
  }

  const grade10Students = students.filter((s) => s.grade === 10)
  const grade11Students = students.filter((s) => s.grade === 11)

  const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    {
      key: "grade10",
      label: "Grado 10°",
      count: grade10Students.length,
      icon: <GraduationCap className="w-4 h-4" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      key: "grade11",
      label: "Grado 11°",
      count: grade11Students.length,
      icon: <GraduationCap className="w-4 h-4" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "teachers",
      label: "Docentes",
      count: teachers.length,
      icon: <BookMarked className="w-4 h-4" />,
      color: "from-emerald-500 to-teal-600",
    },
  ]

  const currentList = activeTab === "grade10" ? grade10Students : activeTab === "grade11" ? grade11Students : teachers

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base leading-tight">LectoRuta</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground">Panel de Administrador</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs sm:text-sm font-semibold">
                {adminData.firstName} {adminData.lastName}
              </p>
              <p className="text-[9px] sm:text-xs text-muted-foreground">Administrador del sistema</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 h-8 sm:h-9 px-2 sm:px-3"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              label: "Estudiantes Grado 10°",
              value: grade10Students.length,
              icon: <GraduationCap className="w-6 h-6 text-white" />,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "Estudiantes Grado 11°",
              value: grade11Students.length,
              icon: <Users className="w-6 h-6 text-white" />,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Total Docentes",
              value: teachers.length,
              icon: <BookOpen className="w-6 h-6 text-white" />,
              gradient: "from-emerald-500 to-teal-600",
            },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow shrink-0`}>
                      {stat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl sm:text-3xl font-bold">{loading ? "—" : stat.value}</p>
                      <p className="text-[11px] sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-0 pt-4 sm:pt-5 px-4 sm:px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.key
                        ? "bg-white dark:bg-card shadow text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-semibold ${
                        activeTab === tab.key
                          ? `bg-gradient-to-r ${tab.color} text-white`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {loading ? "…" : tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => (activeTab === "teachers" ? openCreateTeacher() : openCreateStudent())}
                className={`flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 ${
                  activeTab === "teachers"
                    ? "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    : activeTab === "grade10"
                    ? "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                } text-white shadow hover:shadow-md transition-all`}
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {activeTab === "teachers" ? "Registrar" : "Registrar"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-5 pt-3 sm:pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <UserPlus className="w-12 h-12 opacity-30" />
                <p className="text-sm">
                  No hay{" "}
                  {activeTab === "teachers"
                    ? "docentes"
                    : `estudiantes en grado ${activeTab === "grade10" ? "10°" : "11°"}`}{" "}
                  registrados
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="w-full text-xs sm:text-sm min-w-[500px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-border">
                      {activeTab !== "teachers" ? (
                        <>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Nombre</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Grado</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm hidden xs:table-cell">T.I.</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm hidden md:table-cell">Email</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Estado</th>
                          <th className="text-right py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Acción</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Nombre</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm hidden xs:table-cell">Cédula</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm hidden sm:table-cell">Materia</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Grados</th>
                          <th className="text-left py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm hidden md:table-cell">Email</th>
                          <th className="text-right py-2 sm:py-3 px-1.5 sm:px-2 font-semibold text-muted-foreground text-[10px] sm:text-sm">Acción</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        {activeTab !== "teachers" ? (
                          <>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 font-medium text-[10px] sm:text-sm whitespace-nowrap">
                              {item.firstName} {item.lastName}
                            </td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2">
                              <Badge
                                variant="secondary"
                                className={`text-[9px] sm:text-xs px-1.5 sm:px-2 py-0 ${
                                  item.grade === 10
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                }`}
                              >
                                {item.grade}°
                              </Badge>
                            </td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 font-mono text-muted-foreground text-[9px] sm:text-sm hidden xs:table-cell">{item.tarjetaIdentidad}</td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 text-muted-foreground text-[9px] sm:text-sm hidden md:table-cell truncate max-w-[120px]">{item.email}</td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2">
                              <select
                                value={item.status || "activo"}
                                disabled={statusUpdating === item._id}
                                onChange={(e) => handleQuickStatusChange(item._id, e.target.value)}
                                className={`text-[9px] sm:text-xs font-semibold rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 border-0 focus:outline-none focus:ring-2 focus:ring-ring ${STATUS_COLOR[item.status || "activo"]}`}
                              >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="retirado">Retirado</option>
                              </select>
                            </td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 text-right whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditStudent(item)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "student",
                                    id: item._id,
                                    name: `${item.firstName} ${item.lastName}`,
                                  })
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 font-medium text-[10px] sm:text-sm whitespace-nowrap">
                              {item.firstName} {item.lastName}
                            </td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 font-mono text-muted-foreground text-[9px] sm:text-sm hidden xs:table-cell">{item.cedula}</td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 hidden sm:table-cell text-muted-foreground text-[9px] sm:text-sm truncate max-w-[100px]">{item.subject}</td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2">
                              <div className="flex gap-1 flex-wrap">
                                {(item.gradesTeaching || []).map((g: number) => (
                                  <Badge
                                    key={g}
                                    variant="secondary"
                                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-[9px] sm:text-xs px-1.5 sm:px-2"
                                  >
                                    {g}°
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 text-muted-foreground text-[9px] sm:text-sm hidden md:table-cell truncate max-w-[120px]">{item.email}</td>
                            <td className="py-2 sm:py-3 px-1.5 sm:px-2 text-right whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditTeacher(item)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "teacher",
                                    id: item._id,
                                    name: `${item.firstName} ${item.lastName}`,
                                  })
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Crear/Editar Estudiante */}
      <Dialog
        open={showCreateStudent}
        onOpenChange={(open) => {
          if (!open) {
            setFormError("")
            setEditStudentId(null)
            setStudentForm(EMPTY_STUDENT_FORM)
          }
          setShowCreateStudent(open)
        }}
      >
        <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm sm:text-lg">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              {editStudentId ? "Editar Estudiante" : "Registrar Nuevo Estudiante"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editStudentId ? "Modifique los datos del estudiante." : "Complete los datos del estudiante."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-3 sm:space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="s-firstName" className="text-xs sm:text-sm">Nombre *</Label>
                <Input
                  id="s-firstName"
                  placeholder="Nombre"
                  value={studentForm.firstName}
                  onChange={(e) => setStudentForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="s-lastName" className="text-xs sm:text-sm">Apellido *</Label>
                <Input
                  id="s-lastName"
                  placeholder="Apellido"
                  value={studentForm.lastName}
                  onChange={(e) => setStudentForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="s-grade" className="text-xs sm:text-sm">Grado *</Label>
              <select
                id="s-grade"
                value={studentForm.grade}
                onChange={(e) => setStudentForm((f) => ({ ...f, grade: e.target.value }))}
                className="w-full h-9 sm:h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="10">Grado 10°</option>
                <option value="11">Grado 11°</option>
              </select>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="s-tarjeta" className="text-xs sm:text-sm">Tarjeta de Identidad *</Label>
              <Input
                id="s-tarjeta"
                placeholder="Ej: 1098765432"
                value={studentForm.tarjetaIdentidad}
                onChange={(e) => setStudentForm((f) => ({ ...f, tarjetaIdentidad: e.target.value }))}
                required
                maxLength={15}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="s-password" className="text-xs sm:text-sm">
                {editStudentId ? "Nueva contraseña" : "Contraseña *"}
              </Label>
              <Input
                id="s-password"
                type="text"
                placeholder={editStudentId ? "Dejar vacío para no cambiarla" : "Ej: número de tarjeta de identidad"}
                value={studentForm.password}
                onChange={(e) => setStudentForm((f) => ({ ...f, password: e.target.value }))}
                required={!editStudentId}
                className="h-9 sm:h-10 text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {editStudentId
                  ? "La contraseña actual del estudiante se mantiene si dejas esto vacío."
                  : "Recomendado: usar el número de tarjeta de identidad como contraseña inicial"}
              </p>
            </div>

            {editStudentId && (
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="s-status" className="text-xs sm:text-sm">Estado</Label>
                <select
                  id="s-status"
                  value={studentForm.status}
                  onChange={(e) => setStudentForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full h-9 sm:h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="retirado">Retirado</option>
                </select>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Inactivo/Retirado bloquea el inicio de sesión del estudiante.
                </p>
              </div>
            )}

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="s-email" className="text-xs sm:text-sm">Email *</Label>
              <Input
                id="s-email"
                type="email"
                placeholder="estudiante@correo.com"
                value={studentForm.email}
                onChange={(e) => setStudentForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="s-phone" className="text-xs sm:text-sm">Teléfono *</Label>
                <Input
                  id="s-phone"
                  placeholder="3001234567"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  required
                  maxLength={10}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="s-birth" className="text-xs sm:text-sm">Fecha de nacimiento *</Label>
                <Input
                  id="s-birth"
                  type="date"
                  value={studentForm.birthDate}
                  onChange={(e) => setStudentForm((f) => ({ ...f, birthDate: e.target.value }))}
                  required
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="s-enrollment" className="text-xs sm:text-sm">Fecha de ingreso</Label>
              <Input
                id="s-enrollment"
                type="date"
                value={studentForm.enrollmentDate}
                onChange={(e) => setStudentForm((f) => ({ ...f, enrollmentDate: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Opcional. Si se deja vacío, se usa la fecha de hoy al registrar.
              </p>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{formError}</p>
              </div>
            )}

            <DialogFooter className="gap-1.5 sm:gap-2 pt-1 sm:pt-2 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setShowCreateStudent(false)} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
              >
                {formLoading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span className="ml-1.5 sm:ml-2">{editStudentId ? "Guardar Cambios" : "Registrar Estudiante"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Crear/Editar Docente */}
      <Dialog
        open={showCreateTeacher}
        onOpenChange={(open) => {
          if (!open) {
            setFormError("")
            setEditTeacherId(null)
            setTeacherForm(EMPTY_TEACHER_FORM)
          }
          setShowCreateTeacher(open)
        }}
      >
        <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm sm:text-lg">
              <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              {editTeacherId ? "Editar Docente" : "Registrar Nuevo Docente"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editTeacherId ? "Modifique los datos del docente." : "Complete los datos del docente."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeacher} className="space-y-3 sm:space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="t-firstName" className="text-xs sm:text-sm">Nombre *</Label>
                <Input
                  id="t-firstName"
                  placeholder="Nombre"
                  value={teacherForm.firstName}
                  onChange={(e) => setTeacherForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <Label htmlFor="t-lastName" className="text-xs sm:text-sm">Apellido *</Label>
                <Input
                  id="t-lastName"
                  placeholder="Apellido"
                  value={teacherForm.lastName}
                  onChange={(e) => setTeacherForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-cedula" className="text-xs sm:text-sm">Cédula *</Label>
              <Input
                id="t-cedula"
                placeholder="Ej: 52651850"
                value={teacherForm.cedula}
                onChange={(e) => setTeacherForm((f) => ({ ...f, cedula: e.target.value }))}
                required
                maxLength={10}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-password" className="text-xs sm:text-sm">
                {editTeacherId ? "Nueva contraseña" : "Contraseña *"}
              </Label>
              <Input
                id="t-password"
                type="text"
                placeholder={editTeacherId ? "Dejar vacío para no cambiarla" : "Contraseña inicial"}
                value={teacherForm.password}
                onChange={(e) => setTeacherForm((f) => ({ ...f, password: e.target.value }))}
                required={!editTeacherId}
                className="h-9 sm:h-10 text-sm"
              />
              {editTeacherId && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  La contraseña actual del docente se mantiene si dejas esto vacío.
                </p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-email" className="text-xs sm:text-sm">Email *</Label>
              <Input
                id="t-email"
                type="email"
                placeholder="docente@institucion.edu.co"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-institution" className="text-xs sm:text-sm">Institución *</Label>
              <Input
                id="t-institution"
                placeholder="Nombre de la institución"
                value={teacherForm.institution}
                onChange={(e) => setTeacherForm((f) => ({ ...f, institution: e.target.value }))}
                required
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-subject" className="text-xs sm:text-sm">Materia *</Label>
              <select
                id="t-subject"
                value={teacherForm.subject}
                onChange={(e) => setTeacherForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full h-9 sm:h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Lectura Crítica">Lectura Crítica</option>
                <option value="Lengua Castellana">Lengua Castellana</option>
                <option value="Literatura">Literatura</option>
                <option value="Comunicación y Lenguaje">Comunicación y Lenguaje</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Grados a enseñar *</Label>
              <div className="flex gap-3 sm:gap-4">
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teacherForm.grade10}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, grade10: e.target.checked }))}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="text-xs sm:text-sm font-medium">Grado 10°</span>
                </label>
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teacherForm.grade11}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, grade11: e.target.checked }))}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="text-xs sm:text-sm font-medium">Grado 11°</span>
                </label>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="t-enrollment" className="text-xs sm:text-sm">Fecha de ingreso</Label>
              <Input
                id="t-enrollment"
                type="date"
                value={teacherForm.enrollmentDate}
                onChange={(e) => setTeacherForm((f) => ({ ...f, enrollmentDate: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Opcional. Si se deja vacío, se usa la fecha de hoy al registrar.
              </p>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{formError}</p>
              </div>
            )}

            <DialogFooter className="gap-1.5 sm:gap-2 pt-1 sm:pt-2 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setShowCreateTeacher(false)} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
              >
                {formLoading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span className="ml-1.5 sm:ml-2">{editTeacherId ? "Guardar Cambios" : "Registrar Docente"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar Eliminación */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm w-[90vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-sm sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="pt-1 sm:pt-2 text-xs sm:text-sm">
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
