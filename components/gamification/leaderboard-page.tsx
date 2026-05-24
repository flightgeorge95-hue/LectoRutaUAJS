"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users, ArrowLeft, Zap } from "lucide-react"

interface Student {
  id: string
  name: string
  grade: number
  points: number
  level: number
}

interface LeaderboardPageProps {
  currentStudent: Student
}

// Mock leaderboard data
const mockLeaderboards = {
  class: [
    { id: "1", name: "María González", points: 1250, level: 5, streak: 7, position: 3, isCurrentUser: true },
    { id: "2", name: "Carlos Rodríguez", points: 1450, level: 6, streak: 12, position: 1, isCurrentUser: false },
    { id: "3", name: "Ana Martínez", points: 1380, level: 5, streak: 9, position: 2, isCurrentUser: false },
    { id: "4", name: "Luis Pérez", points: 1180, level: 4, streak: 5, position: 4, isCurrentUser: false },
    { id: "5", name: "Sofia López", points: 1120, level: 4, streak: 8, position: 5, isCurrentUser: false },
    { id: "6", name: "Diego Morales", points: 1050, level: 4, streak: 3, position: 6, isCurrentUser: false },
    { id: "7", name: "Isabella Cruz", points: 980, level: 3, streak: 6, position: 7, isCurrentUser: false },
    { id: "8", name: "Andrés Silva", points: 920, level: 3, streak: 4, position: 8, isCurrentUser: false },
  ],
  grade: [
    { id: "2", name: "Carlos Rodríguez", points: 1450, level: 6, streak: 12, position: 1, isCurrentUser: false },
    { id: "9", name: "Valentina Ruiz", points: 1420, level: 6, streak: 10, position: 2, isCurrentUser: false },
    { id: "3", name: "Ana Martínez", points: 1380, level: 5, streak: 9, position: 3, isCurrentUser: false },
    { id: "10", name: "Sebastián Torres", points: 1320, level: 5, streak: 11, position: 4, isCurrentUser: false },
    { id: "1", name: "María González", points: 1250, level: 5, streak: 7, position: 5, isCurrentUser: true },
    { id: "11", name: "Camila Vargas", points: 1200, level: 4, streak: 8, position: 6, isCurrentUser: false },
    { id: "4", name: "Luis Pérez", points: 1180, level: 4, streak: 5, position: 7, isCurrentUser: false },
    { id: "12", name: "Mateo Jiménez", points: 1150, level: 4, streak: 6, position: 8, isCurrentUser: false },
  ],
  school: [
    { id: "13", name: "Alejandra Gómez", points: 1680, level: 7, streak: 15, position: 1, isCurrentUser: false },
    { id: "14", name: "Ricardo Herrera", points: 1620, level: 7, streak: 13, position: 2, isCurrentUser: false },
    { id: "15", name: "Natalia Ramírez", points: 1580, level: 6, streak: 14, position: 3, isCurrentUser: false },
    { id: "2", name: "Carlos Rodríguez", points: 1450, level: 6, streak: 12, position: 4, isCurrentUser: false },
    { id: "9", name: "Valentina Ruiz", points: 1420, level: 6, streak: 10, position: 5, isCurrentUser: false },
    { id: "1", name: "María González", points: 1250, level: 5, streak: 7, position: 12, isCurrentUser: true },
  ],
}

export function LeaderboardPage({ currentStudent }: LeaderboardPageProps) {
  const isYoungerStudent = currentStudent.grade <= 9

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{position}</span>
    }
  }

  const getPositionColor = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return isYoungerStudent ? "border-primary/30 bg-primary/5" : "border-secondary/30 bg-secondary/5"
    }
    switch (position) {
      case 1:
        return "border-yellow-200 bg-yellow-50"
      case 2:
        return "border-gray-200 bg-gray-50"
      case 3:
        return "border-amber-200 bg-amber-50"
      default:
        return "border-border bg-background"
    }
  }

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
                <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">Tabla de Clasificación</h1>
                <p className="text-sm text-muted-foreground">Compite con tus compañeros</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{currentStudent.name}</p>
              <p className="text-xs text-muted-foreground">Nivel {currentStudent.level}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Current User Stats */}
          <Card
            className={`border-2 ${isYoungerStudent ? "border-primary/30 bg-primary/5" : "border-secondary/30 bg-secondary/5"}`}
          >
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                Tu Posición Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">3°</div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">En tu clase</p>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">5°</div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">En tu grado</p>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">12°</div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">En el colegio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Tabs */}
          <Tabs defaultValue="class" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="class" className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm px-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Mi</span> Clase
              </TabsTrigger>
              <TabsTrigger value="grade" className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm px-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Mi</span> Grado
              </TabsTrigger>
              <TabsTrigger value="school" className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm px-1">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                Colegio
              </TabsTrigger>
            </TabsList>

            {Object.entries(mockLeaderboards).map(([key, leaderboard]) => (
              <TabsContent key={key} value={key} className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  {leaderboard.map((student) => (
                    <Card
                      key={student.id}
                      className={`transition-all hover:shadow-sm ${getPositionColor(student.position, student.isCurrentUser)}`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="flex items-center justify-center w-8 sm:w-12 shrink-0">
                            {getPositionIcon(student.position)}
                          </div>
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                            <AvatarImage src={`/student-${student.id}.png`} />
                            <AvatarFallback className="text-[9px] sm:text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <h3 className="font-semibold text-xs sm:text-base text-foreground truncate">{student.name}</h3>
                              {student.isCurrentUser && (
                                <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-1.5 py-0">
                                  Tú
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] sm:text-sm text-muted-foreground">Nivel {student.level}</p>
                          </div>
                          <div className="text-right space-y-0.5 sm:space-y-1 shrink-0">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                              <span className="font-bold text-xs sm:text-base text-foreground">{student.points}</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-chart-2" />
                              <span className="text-[9px] sm:text-xs text-muted-foreground">{student.streak}d</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Motivational Section */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                ¡Sigue Mejorando!
              </CardTitle>
              <CardDescription>Consejos para subir en la clasificación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Para subir en tu clase:</h4>
                  <p className="text-sm text-muted-foreground">
                    Necesitas {1380 - currentStudent.points} puntos más para alcanzar el 2° lugar
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Mantén tu racha:</h4>
                  <p className="text-sm text-muted-foreground">
                    Estudia todos los días para ganar puntos de bonificación
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
