"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelUpAnimationProps {
  newLevel: number
  isVisible: boolean
  onClose: () => void
  isYoungerStudent?: boolean
}

export function LevelUpAnimation({ newLevel, isVisible, onClose, isYoungerStudent = true }: LevelUpAnimationProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <Card
        className={cn(
          "w-96 border-2 shadow-2xl transition-all duration-500",
          isVisible ? "scale-100" : "scale-75",
          isYoungerStudent
            ? "border-primary/30 bg-primary/5 shadow-primary/20"
            : "border-secondary/30 bg-secondary/5 shadow-secondary/20",
        )}
      >
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                isYoungerStudent ? "bg-primary" : "bg-secondary"
              } text-white animate-pulse`}
            >
              <Crown className="h-10 w-10" />
            </div>
            <div className="absolute -top-2 -right-2 animate-spin">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce">
              <Star className="h-6 w-6 text-chart-1" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground animate-pulse">¡NIVEL {newLevel}!</h2>
            <p className="text-lg text-muted-foreground">¡Has subido de nivel!</p>
            <p className="text-sm text-muted-foreground">Sigue así para desbloquear más contenido y recompensas</p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className={`${isYoungerStudent ? "" : "bg-secondary hover:bg-secondary/90"} animate-bounce`}
            >
              ¡Genial!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
