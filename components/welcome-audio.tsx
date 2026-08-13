"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const hasHeardAudio = localStorage.getItem("welcomeAudioPlayed")
    if (!hasHeardAudio) {
      const timer = setTimeout(() => setShowPrompt(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const playAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setHasInteracted(true)
        setShowPrompt(false)
        localStorage.setItem("welcomeAudioPlayed", "true")
      } catch (error) {
        // Browser blocked autoplay
      }
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    localStorage.setItem("welcomeAudioPlayed", "true")
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/welcome-audio.mp3"
        onEnded={handleAudioEnd}
        preload="none"
      />

      {/* Welcome Prompt */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center space-y-6">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20" />
                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                  <Volume2 className="h-10 w-10 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  ¡Bienvenido a LectoRuta Saber!
                </h3>
                <p className="text-muted-foreground">
                  Tenemos un mensaje de bienvenida especial para ti. ¿Te gustaría escucharlo?
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={playAudio}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Reproducir Audio
                </Button>
                <Button
                  onClick={dismissPrompt}
                  variant="outline"
                  className="border-border bg-transparent"
                  size="lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Control */}
      {hasInteracted && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
          <div className="bg-card rounded-full shadow-2xl border border-border p-2 flex items-center gap-2">
            {isPlaying && (
              <div className="flex items-center gap-2 px-3">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm font-medium text-foreground">Reproduciendo...</span>
              </div>
            )}

            <Button
              onClick={isPlaying ? pauseAudio : playAudio}
              size="icon"
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
            >
              {isPlaying ? <VolumeX className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            {isPlaying && (
              <Button
                onClick={toggleMute}
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-accent"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
