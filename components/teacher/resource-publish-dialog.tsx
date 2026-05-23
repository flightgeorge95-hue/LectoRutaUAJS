"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Newspaper, Video, FileText, ImageIcon, Plus, Eye } from "lucide-react"

const CATEGORIES = [
  "Lectura Crítica",
  "Estrategias ICFES",
  "Comprensión Lectora",
  "Tips de Estudio",
  "Motivación",
  "General",
]

const TYPES = [
  { value: "tip", label: "Tip / Artículo", icon: Newspaper, color: "bg-blue-500" },
  { value: "video", label: "Video YouTube", icon: Video, color: "bg-red-500" },
  { value: "guide", label: "Guía / PDF", icon: FileText, color: "bg-emerald-500" },
  { value: "image", label: "Imagen informativa", icon: ImageIcon, color: "bg-purple-500" },
]

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function ResourcePublishDialog({ teacherId }: { teacherId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("tip")
  const [category, setCategory] = useState("General")
  const [videoUrl, setVideoUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [grade10, setGrade10] = useState(true)
  const [grade11, setGrade11] = useState(true)
  const [previewVideo, setPreviewVideo] = useState("")

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)
    const videoId = extractYouTubeId(url)
    setPreviewVideo(videoId ? `https://www.youtube.com/embed/${videoId}` : "")
  }

  const resetForm = () => {
    setTitle(""); setContent(""); setType("tip"); setCategory("General")
    setVideoUrl(""); setImageUrl(""); setGrade10(true); setGrade11(true); setPreviewVideo("")
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Título y contenido son obligatorios")
      return
    }
    if (type === "video" && !extractYouTubeId(videoUrl)) {
      toast.error("Ingresa una URL válida de YouTube")
      return
    }

    const targetGrades = []
    if (grade10) targetGrades.push(10)
    if (grade11) targetGrades.push(11)
    if (targetGrades.length === 0) {
      toast.error("Selecciona al menos un grado")
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        type,
        category,
        videoUrl: type === "video" ? videoUrl : undefined,
        imageUrl: type === "image" ? imageUrl : undefined,
        targetGrades,
        createdBy: teacherId,
      }

      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Error al publicar")

      toast.success("Recurso publicado exitosamente")
      resetForm()
      setOpen(false)
    } catch (error) {
      toast.error("Error al publicar el recurso")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Newspaper className="h-4 w-4" />
          Publicar Recurso ICFES
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Publicar en Biblioteca ICFES
          </DialogTitle>
          <DialogDescription>
            Comparte tips, videos, guías o imágenes para ayudar a tus estudiantes en su preparación ICFES 2026
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Type selector */}
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    type === t.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg ${t.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              placeholder="Ej: 5 claves para resolver textos argumentativos en el ICFES"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label>Contenido</Label>
            <Textarea
              placeholder={
                type === "tip" ? "Escribe tu tip o artículo aquí. Puedes usar párrafos para organizar el contenido..."
                  : type === "video" ? "Describe de qué trata el video y por qué es útil para los estudiantes..."
                  : type === "guide" ? "Describe el contenido de la guía y cómo usarla..."
                  : "Describe qué muestra la imagen y por qué es relevante..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          {/* Video URL */}
          {type === "video" && (
            <div className="space-y-1.5">
              <Label>URL de YouTube</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
              />
              {previewVideo && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <iframe
                    src={previewVideo}
                    className="w-full aspect-video"
                    allowFullScreen
                    title="Preview"
                  />
                </div>
              )}
            </div>
          )}

          {/* Image URL */}
          {type === "image" && (
            <div className="space-y-1.5">
              <Label>URL de la imagen</Label>
              <Input
                placeholder="https://ejemplo.com/imagen.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border p-2">
                  <img src={imageUrl} alt="Preview" className="max-h-48 mx-auto rounded" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target grades */}
          <div className="space-y-1.5">
            <Label>Dirigido a</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={grade10} onCheckedChange={(v) => setGrade10(!!v)} />
                <span className="text-sm font-medium">Grado 10°</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={grade11} onCheckedChange={(v) => setGrade11(!!v)} />
                <span className="text-sm font-medium">Grado 11°</span>
              </label>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Publicando..." : "Publicar Recurso"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
