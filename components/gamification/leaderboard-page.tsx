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
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Tabla de Clasificación</h1>
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

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Current User Stats */}
          <Card
            className={`border-2 ${isYoungerStudent ? "border-primary/30 bg-primary/5" : "border-secondary/30 bg-secondary/5"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Tu Posición Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">3°</div>
                  <p className="text-sm text-muted-foreground">En tu clase</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">5°</div>
                  <p className="text-sm text-muted-foreground">En tu grado</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">12°</div>
                  <p className="text-sm text-muted-foreground">En el colegio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Tabs */}
          <Tabs defaultValue="class" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="class" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mi Clase
              </TabsTrigger>
              <TabsTrigger value="grade" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Mi Grado
              </TabsTrigger>
              <TabsTrigger value="school" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Colegio
              </TabsTrigger>
            </TabsList>

            {Object.entries(mockLeaderboards).map(([key, leaderboard]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="space-y-3">
                  {leaderboard.map((student) => (
                    <Card
                      key={student.id}
                      className={`transition-all hover:shadow-sm ${getPositionColor(student.position, student.isCurrentUser)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12">
                            {getPositionIcon(student.position)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/student-${student.id}.png`} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{student.name}</h3>
                              {student.isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  Tú
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Nivel {student.level}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-accent" />
                              <span className="font-bold text-foreground">{student.points}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-chart-2" />
                              <span className="text-xs text-muted-foreground">{student.streak} días</span>
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
