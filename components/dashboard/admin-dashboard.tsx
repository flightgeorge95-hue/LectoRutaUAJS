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

  // Forms
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT_FORM)
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

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
    setFormLoading(true)
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studentForm,
          grade: Number(studentForm.grade),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Error al crear estudiante")
        return
      }
      toast.success(`Estudiante ${studentForm.firstName} ${studentForm.lastName} registrado exitosamente`)
      setShowCreateStudent(false)
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
    setFormLoading(true)

    const gradesTeaching: number[] = []
    if (teacherForm.grade10) gradesTeaching.push(10)
    if (teacherForm.grade11) gradesTeaching.push(11)

    if (gradesTeaching.length === 0) {
      setFormError("Selecciona al menos un grado a enseñar")
      setFormLoading(false)
      return
    }

    try {
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: teacherForm.firstName,
          lastName: teacherForm.lastName,
          cedula: teacherForm.cedula,
          password: teacherForm.password,
          email: teacherForm.email,
          institution: teacherForm.institution,
          subject: teacherForm.subject,
          gradesTeaching,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Error al crear docente")
        return
      }
      toast.success(`Docente ${teacherForm.firstName} ${teacherForm.lastName} registrado exitosamente`)
      setShowCreateTeacher(false)
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
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">LectoRuta</p>
              <p className="text-xs text-muted-foreground">Panel de Administrador</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">
                {adminData.firstName} {adminData.lastName}
              </p>
              <p className="text-xs text-muted-foreground">Administrador del sistema</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{loading ? "—" : stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-0 pt-5 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-white dark:bg-card shadow text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
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
                onClick={() => {
                  setFormError("")
                  if (activeTab === "teachers") {
                    setTeacherForm(EMPTY_TEACHER_FORM)
                    setShowCreateTeacher(true)
                  } else {
                    setStudentForm({ ...EMPTY_STUDENT_FORM, grade: activeTab === "grade10" ? "10" : "11" })
                    setShowCreateStudent(true)
                  }
                }}
                className={`flex items-center gap-2 bg-gradient-to-r ${
                  activeTab === "teachers"
                    ? "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    : activeTab === "grade10"
                    ? "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                } text-white shadow hover:shadow-md transition-all`}
              >
                <Plus className="w-4 h-4" />
                {activeTab === "teachers" ? "Registrar Docente" : "Registrar Estudiante"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-4">
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
              <div className="overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.table
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full text-sm"
                  >
                    <thead>
                      <tr className="border-b border-border">
                        {activeTab !== "teachers" ? (
                          <>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Nombre completo</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Grado</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Tarjeta de identidad</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                            <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Acción</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Nombre completo</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Cédula</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground hidden sm:table-cell">Materia</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Grados</th>
                            <th className="text-left py-3 px-2 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                            <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Acción</th>
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
                              <td className="py-3 px-2 font-medium">
                                {item.firstName} {item.lastName}
                              </td>
                              <td className="py-3 px-2">
                                <Badge
                                  variant="secondary"
                                  className={
                                    item.grade === 10
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                  }
                                >
                                  Grado {item.grade}°
                                </Badge>
                              </td>
                              <td className="py-3 px-2 font-mono text-muted-foreground">{item.tarjetaIdentidad}</td>
                              <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{item.email}</td>
                              <td className="py-3 px-2 text-right">
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
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-3 px-2 font-medium">
                                {item.firstName} {item.lastName}
                              </td>
                              <td className="py-3 px-2 font-mono text-muted-foreground">{item.cedula}</td>
                              <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">{item.subject}</td>
                              <td className="py-3 px-2">
                                <div className="flex gap-1 flex-wrap">
                                  {(item.gradesTeaching || []).map((g: number) => (
                                    <Badge
                                      key={g}
                                      variant="secondary"
                                      className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs"
                                    >
                                      {g}°
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{item.email}</td>
                              <td className="py-3 px-2 text-right">
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
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </>
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </motion.table>
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Crear Estudiante */}
      <Dialog
        open={showCreateStudent}
        onOpenChange={(open) => {
          if (!open) {
            setFormError("")
            setStudentForm(EMPTY_STUDENT_FORM)
          }
          setShowCreateStudent(open)
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              Registrar Nuevo Estudiante
            </DialogTitle>
            <DialogDescription>
              Complete los datos del estudiante. La contraseña se guardará de forma segura.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-firstName">Nombre *</Label>
                <Input
                  id="s-firstName"
                  placeholder="Nombre"
                  value={studentForm.firstName}
                  onChange={(e) => setStudentForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-lastName">Apellido *</Label>
                <Input
                  id="s-lastName"
                  placeholder="Apellido"
                  value={studentForm.lastName}
                  onChange={(e) => setStudentForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-grade">Grado *</Label>
              <select
                id="s-grade"
                value={studentForm.grade}
                onChange={(e) => setStudentForm((f) => ({ ...f, grade: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="10">Grado 10°</option>
                <option value="11">Grado 11°</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-tarjeta">Tarjeta de Identidad *</Label>
              <Input
                id="s-tarjeta"
                placeholder="Ej: 1098765432"
                value={studentForm.tarjetaIdentidad}
                onChange={(e) => setStudentForm((f) => ({ ...f, tarjetaIdentidad: e.target.value }))}
                required
                maxLength={15}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-password">Contraseña *</Label>
              <Input
                id="s-password"
                type="text"
                placeholder="Se recomienda usar la tarjeta de identidad"
                value={studentForm.password}
                onChange={(e) => setStudentForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: usar el número de tarjeta de identidad como contraseña inicial
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-email">Email *</Label>
              <Input
                id="s-email"
                type="email"
                placeholder="estudiante@correo.com"
                value={studentForm.email}
                onChange={(e) => setStudentForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-phone">Teléfono *</Label>
                <Input
                  id="s-phone"
                  placeholder="3001234567"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  required
                  maxLength={10}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-birth">Fecha de nacimiento *</Label>
                <Input
                  id="s-birth"
                  type="date"
                  value={studentForm.birthDate}
                  onChange={(e) => setStudentForm((f) => ({ ...f, birthDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateStudent(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span className="ml-2">Registrar Estudiante</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Crear Docente */}
      <Dialog
        open={showCreateTeacher}
        onOpenChange={(open) => {
          if (!open) {
            setFormError("")
            setTeacherForm(EMPTY_TEACHER_FORM)
          }
          setShowCreateTeacher(open)
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-emerald-600" />
              Registrar Nuevo Docente
            </DialogTitle>
            <DialogDescription>Complete los datos del docente y los grados que enseñará.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeacher} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-firstName">Nombre *</Label>
                <Input
                  id="t-firstName"
                  placeholder="Nombre"
                  value={teacherForm.firstName}
                  onChange={(e) => setTeacherForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-lastName">Apellido *</Label>
                <Input
                  id="t-lastName"
                  placeholder="Apellido"
                  value={teacherForm.lastName}
                  onChange={(e) => setTeacherForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-cedula">Cédula *</Label>
              <Input
                id="t-cedula"
                placeholder="Ej: 52651850"
                value={teacherForm.cedula}
                onChange={(e) => setTeacherForm((f) => ({ ...f, cedula: e.target.value }))}
                required
                maxLength={10}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-password">Contraseña *</Label>
              <Input
                id="t-password"
                type="text"
                placeholder="Contraseña inicial para el docente"
                value={teacherForm.password}
                onChange={(e) => setTeacherForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-email">Email *</Label>
              <Input
                id="t-email"
                type="email"
                placeholder="docente@institucion.edu.co"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-institution">Institución *</Label>
              <Input
                id="t-institution"
                placeholder="Nombre de la institución"
                value={teacherForm.institution}
                onChange={(e) => setTeacherForm((f) => ({ ...f, institution: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="t-subject">Materia *</Label>
              <select
                id="t-subject"
                value={teacherForm.subject}
                onChange={(e) => setTeacherForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Lectura Crítica">Lectura Crítica</option>
                <option value="Lengua Castellana">Lengua Castellana</option>
                <option value="Literatura">Literatura</option>
                <option value="Comunicación y Lenguaje">Comunicación y Lenguaje</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Grados a enseñar *</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teacherForm.grade10}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, grade10: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="text-sm font-medium">Grado 10°</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teacherForm.grade11}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, grade11: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 accent-emerald-600"
                  />
                  <span className="text-sm font-medium">Grado 11°</span>
                </label>
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateTeacher(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span className="ml-2">Registrar Docente</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar Eliminación */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="pt-2">
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
