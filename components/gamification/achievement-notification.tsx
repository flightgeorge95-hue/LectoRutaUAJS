"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
}

interface AchievementNotificationProps {
  achievement: Achievement
  isVisible: boolean
  onClose: () => void
  isYoungerStudent?: boolean
}

export function AchievementNotification({
  achievement,
  isVisible,
  onClose,
  isYoungerStudent = true,
}: AchievementNotificationProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <Card
        className={`w-80 border-2 shadow-lg ${
          isYoungerStudent
            ? "border-primary/30 bg-primary/5 shadow-primary/20"
            : "border-secondary/30 bg-secondary/5 shadow-secondary/20"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                isYoungerStudent ? "bg-primary" : "bg-secondary"
              } text-white text-2xl animate-bounce`}
            >
              {achievement.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                <h3 className="font-bold text-foreground">¡Nuevo Logro!</h3>
              </div>
              <h4 className="font-semibold text-foreground">{achievement.name}</h4>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="secondary"
                  className={`${isYoungerStudent ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}
                >
                  <Star className="h-3 w-3 mr-1" />+{achievement.points} puntos
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
