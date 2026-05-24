"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  BarChart3,
  PieChartIcon,
  Download,
  Calendar,
  Target,
  Award,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import { useState } from "react"

interface User {
  id: string
  name: string
  grade: number
  type: "student" | "teacher"
}

interface ProgressAnalyticsProps {
  user: User
}

// Mock analytics data
const performanceData = [
  { month: "Ago", score: 65, classAverage: 70, workshops: 3 },
  { month: "Sep", score: 72, classAverage: 72, workshops: 5 },
  { month: "Oct", score: 78, classAverage: 74, workshops: 4 },
  { month: "Nov", score: 82, classAverage: 76, workshops: 6 },
  { month: "Dic", score: 85, classAverage: 78, workshops: 4 },
  { month: "Ene", score: 88, classAverage: 80, workshops: 5 },
]

const competencyData = [
  { competency: "Interpretación", score: 85, maxScore: 100 },
  { competency: "Argumentación", score: 78, maxScore: 100 },
  { competency: "Síntesis", score: 82, maxScore: 100 },
  { competency: "Análisis", score: 80, maxScore: 100 },
  { competency: "Evaluación", score: 75, maxScore: 100 },
]

const subjectData = [
  { name: "Lectura Crítica", value: 85, color: "#be123c" },
  { name: "Matemáticas", value: 78, color: "#ec4899" },
  { name: "Ciencias Sociales", value: 82, color: "#059669" },
  { name: "Ciencias Naturales", value: 88, color: "#10b981" },
  { name: "Inglés", value: 75, color: "#f59e0b" },
]

const weeklyActivityData = [
  { day: "Lun", workshops: 2, timeSpent: 45 },
  { day: "Mar", workshops: 1, timeSpent: 30 },
  { day: "Mié", workshops: 3, timeSpent: 60 },
  { day: "Jue", workshops: 2, timeSpent: 40 },
  { day: "Vie", workshops: 1, timeSpent: 25 },
  { day: "Sáb", workshops: 2, timeSpent: 50 },
  { day: "Dom", workshops: 1, timeSpent: 20 },
]

export function ProgressAnalytics({ user }: ProgressAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const isYoungerStudent = user.grade <= 9

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <Button variant="ghost" size="sm" className="h-8 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm">
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="h-4 w-px sm:h-6 bg-border hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">Análisis de Progreso</h1>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Estadísticas detalladas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 sm:w-40 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Último mes</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="1year">Último año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className={isYoungerStudent ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${isYoungerStudent ? "bg-primary" : "bg-secondary"} text-white`}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">88%</p>
                    <p className="text-sm text-muted-foreground">Promedio actual</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-1" />
                  <span className="text-chart-1">+6% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chart-1/20 bg-chart-1/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1 text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">27</p>
                    <p className="text-sm text-muted-foreground">Talleres completados</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-1" />
                  <span className="text-chart-1">+4 este mes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2 text-white">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">82%</p>
                    <p className="text-sm text-muted-foreground">Precisión promedio</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-1" />
                  <span className="text-chart-1">+3% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chart-3/20 bg-chart-3/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3 text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Logros obtenidos</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-1" />
                  <span className="text-chart-1">+2 este mes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Rendimiento
              </TabsTrigger>
              <TabsTrigger value="competencies" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Competencias
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Materias
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Actividad
              </TabsTrigger>
            </TabsList>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del Rendimiento</CardTitle>
                  <CardDescription>Comparación con el promedio de la clase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke={isYoungerStudent ? "#be123c" : "#059669"}
                          strokeWidth={3}
                          name="Tu puntaje"
                        />
                        <Line
                          type="monotone"
                          dataKey="classAverage"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Promedio de clase"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Talleres por Mes</CardTitle>
                    <CardDescription>Cantidad de talleres completados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="workshops" fill={isYoungerStudent ? "#be123c" : "#059669"} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas Clave</CardTitle>
                    <CardDescription>Resumen de tu progreso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Mejor puntaje</span>
                      <Badge variant="secondary">88%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Mejora total</span>
                      <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                        +23%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Posición en clase</span>
                      <Badge variant="secondary">3° de 28</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Racha actual</span>
                      <Badge variant="secondary">7 días</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Competencies Tab */}
            <TabsContent value="competencies" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Competencias</CardTitle>
                    <CardDescription>Tu rendimiento por competencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={competencyData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="competency" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar
                            name="Puntaje"
                            dataKey="score"
                            stroke={isYoungerStudent ? "#be123c" : "#059669"}
                            fill={isYoungerStudent ? "#be123c" : "#059669"}
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalle por Competencia</CardTitle>
                    <CardDescription>Puntajes específicos y recomendaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competencyData.map((comp) => (
                      <div key={comp.competency} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{comp.competency}</span>
                          <span className="text-sm font-bold">{comp.score}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              comp.score >= 80 ? "bg-chart-1" : comp.score >= 70 ? "bg-chart-5" : "bg-destructive"
                            }`}
                            style={{ width: `${comp.score}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {comp.score >= 80
                            ? "Excelente dominio"
                            : comp.score >= 70
                              ? "Buen nivel, puede mejorar"
                              : "Requiere práctica adicional"}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento por Materia</CardTitle>
                    <CardDescription>Distribución de puntajes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subjectData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {subjectData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ranking de Materias</CardTitle>
                    <CardDescription>Ordenadas por rendimiento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subjectData
                      .sort((a, b) => b.value - a.value)
                      .map((subject, index) => (
                        <div key={subject.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{subject.name}</h4>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div
                                className="h-2 rounded-full"
                                style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                              />
                            </div>
                          </div>
                          <Badge variant="secondary">{subject.value}%</Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Semanal</CardTitle>
                  <CardDescription>Talleres completados y tiempo dedicado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="workshops" fill={isYoungerStudent ? "#be123c" : "#059669"} name="Talleres" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">4.2h</div>
                    <p className="text-sm text-muted-foreground">Tiempo promedio semanal</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">12</div>
                    <p className="text-sm text-muted-foreground">Talleres esta semana</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">21min</div>
                    <p className="text-sm text-muted-foreground">Tiempo promedio por taller</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
