"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, Target, Award, Crown, Flame, TrendingUp, Calendar, Users, ArrowLeft } from "lucide-react"

interface Student {
  id: string
  name: string
  grade: number
  points: number
  level: number
  streak: number
  totalWorkshops: number
}

interface AchievementsPageProps {
  student: Student
}

const achievementCategories = {
  reading: {
    name: "Lectura",
    icon: BookOpen,
    color: "bg-primary",
    achievements: [
      {
        id: "first-read",
        name: "Primer Lector",
        description: "Completa tu primer taller de lectura",
        icon: "📚",
        earned: true,
        progress: 100,
        maxProgress: 1,
        points: 50,
      },
      {
        id: "reading-streak",
        name: "Lector Constante",
        description: "Lee durante 7 días consecutivos",
        icon: "🔥",
        earned: true,
        progress: 7,
        maxProgress: 7,
        points: 100,
      },
      {
        id: "speed-reader",
        name: "Lector Veloz",
        description: "Completa un taller en menos de 15 minutos",
        icon: "⚡",
        earned: false,
        progress: 0,
        maxProgress: 1,
        points: 75,
      },
      {
        id: "master-reader",
        name: "Maestro Lector",
        description: "Completa 50 talleres de lectura",
        icon: "👑",
        earned: false,
        progress: 23,
        maxProgress: 50,
        points: 500,
      },
    ],
  },
  performance: {
    name: "Rendimiento",
    icon: Target,
    color: "bg-accent",
    achievements: [
      {
        id: "perfect-score",
        name: "Puntuación Perfecta",
        description: "Obtén 100% en un taller",
        icon: "🎯",
        earned: false,
        progress: 0,
        maxProgress: 1,
        points: 200,
      },
      {
        id: "high-performer",
        name: "Alto Rendimiento",
        description: "Mantén un promedio superior al 85%",
        icon: "📈",
        earned: true,
        progress: 100,
        maxProgress: 100,
        points: 150,
      },
      {
        id: "improvement",
        name: "En Mejora",
        description: "Mejora tu puntaje en 3 talleres consecutivos",
        icon: "📊",
        earned: false,
        progress: 2,
        maxProgress: 3,
        points: 100,
      },
    ],
  },
  social: {
    name: "Social",
    icon: Users,
    color: "bg-secondary",
    achievements: [
      {
        id: "top-class",
        name: "Líder de Clase",
        description: "Mantente en el top 3 de tu clase por una semana",
        icon: "🏆",
        earned: false,
        progress: 3,
        maxProgress: 7,
        points: 300,
      },
      {
        id: "helpful",
        name: "Compañero Útil",
        description: "Ayuda a 5 compañeros con sus dudas",
        icon: "🤝",
        earned: false,
        progress: 0,
        maxProgress: 5,
        points: 150,
      },
    ],
  },
  dedication: {
    name: "Dedicación",
    icon: Calendar,
    color: "bg-chart-1",
    achievements: [
      {
        id: "daily-learner",
        name: "Aprendiz Diario",
        description: "Estudia todos los días durante un mes",
        icon: "📅",
        earned: false,
        progress: 7,
        maxProgress: 30,
        points: 400,
      },
      {
        id: "weekend-warrior",
        name: "Guerrero de Fin de Semana",
        description: "Completa talleres durante 4 fines de semana seguidos",
        icon: "⚔️",
        earned: false,
        progress: 1,
        maxProgress: 4,
        points: 200,
      },
    ],
  },
}

export function AchievementsPage({ student }: AchievementsPageProps) {
  const isYoungerStudent = student.grade <= 9
  const totalAchievements = Object.values(achievementCategories).reduce(
    (total, category) => total + category.achievements.length,
    0,
  )
  const earnedAchievements = Object.values(achievementCategories).reduce(
    (total, category) => total + category.achievements.filter((a) => a.earned).length,
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <Button variant="ghost" size="sm" className="h-8 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm">
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="h-4 w-px sm:h-6 bg-border hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">Logros y Insignias</h1>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Tus logros académicos</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[100px] sm:max-w-none">{student.name}</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground">Nivel {student.level}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <Card
              className={isYoungerStudent ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${isYoungerStudent ? "bg-primary" : "bg-secondary"} text-white`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{earnedAchievements}</p>
                    <p className="text-sm text-muted-foreground">Logros obtenidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{student.points}</p>
                    <p className="text-sm text-muted-foreground">Puntos totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chart-1/20 bg-chart-1/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1 text-white">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{student.streak}</p>
                    <p className="text-sm text-muted-foreground">Días seguidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{student.level}</p>
                    <p className="text-sm text-muted-foreground">Nivel actual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso General de Logros</CardTitle>
              <CardDescription>
                Has desbloqueado {earnedAchievements} de {totalAchievements} logros disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso de logros</span>
                  <span>{Math.round((earnedAchievements / totalAchievements) * 100)}%</span>
                </div>
                <Progress value={(earnedAchievements / totalAchievements) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Achievement Categories */}
            <Tabs defaultValue="reading" className="w-full">
            <TabsList className="grid w-full grid-cols-4 overflow-x-auto">
              {Object.entries(achievementCategories).map(([key, category]) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm px-1 sm:px-3">
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">{category.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(achievementCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {category.achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`transition-all ${
                        achievement.earned
                          ? "border-chart-1/30 bg-chart-1/5 shadow-md"
                          : "border-border hover:shadow-sm"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${
                              achievement.earned ? "bg-chart-1/20" : "bg-muted/50"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {achievement.name}
                              {achievement.earned && <Crown className="h-4 w-4 text-chart-1" />}
                            </CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {!achievement.earned && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progreso</span>
                              <span>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={achievement.earned ? "default" : "secondary"}
                            className={achievement.earned ? "bg-chart-1 hover:bg-chart-1/90" : ""}
                          >
                            {achievement.earned ? "Desbloqueado" : "En progreso"}
                          </Badge>
                          <span className="text-sm font-medium text-accent">+{achievement.points} puntos</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
