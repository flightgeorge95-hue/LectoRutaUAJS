"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart, Bookmark, BookmarkCheck, Play, FileText, Lightbulb, ImageIcon,
  Newspaper, GraduationCap, ChevronDown,
} from "lucide-react"

interface Resource {
  _id: string
  title: string
  content: string
  type: "tip" | "video" | "guide" | "image"
  category: string
  videoUrl?: string
  imageUrl?: string
  targetGrades: number[]
  createdBy?: { _id: string; firstName: string; lastName: string; subject: string } | null
  likes: string[]
  savedBy: string[]
  createdAt: string
}

function extractYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

const TYPE_CONFIG = {
  tip: { icon: Lightbulb, color: "from-blue-500 to-blue-600", label: "Tip", dot: "bg-blue-500" },
  video: { icon: Play, color: "from-red-500 to-rose-600", label: "Video", dot: "bg-red-500" },
  guide: { icon: FileText, color: "from-emerald-500 to-green-600", label: "Guía", dot: "bg-emerald-500" },
  image: { icon: ImageIcon, color: "from-purple-500 to-violet-600", label: "Imagen", dot: "bg-purple-500" },
}

const FILTER_TABS = [
  { value: "all", label: "Todos" },
  { value: "tip", label: "Tips" },
  { value: "video", label: "Videos" },
  { value: "guide", label: "Guías" },
  { value: "image", label: "Imágenes" },
]

function ResourceCard({ resource, studentId }: { resource: Resource; studentId: string }) {
  const [liked, setLiked] = useState(resource.likes?.includes(studentId))
  const [saved, setSaved] = useState(resource.savedBy?.includes(studentId))
  const [likeCount, setLikeCount] = useState(resource.likes?.length || 0)
  const [expanded, setExpanded] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)

  const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.tip
  const Icon = config.icon
  const videoId = resource.type === "video" && resource.videoUrl ? extractYouTubeId(resource.videoUrl) : null
  const isLongContent = resource.content.length > 180

  const handleAction = async (action: "like" | "save") => {
    if (loadingAction) return
    setLoadingAction(true)
    try {
      const response = await fetch("/api/resources/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource._id, studentId, action }),
      })
      if (response.ok) {
        const data = await response.json()
        if (action === "like") { setLiked(data.liked); setLikeCount(data.totalLikes) }
        else { setSaved(data.saved) }
      }
    } catch (error) { /* silent */ }
    finally { setLoadingAction(false) }
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `hace ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `hace ${days}d`
    return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })
  }

  const teacherName = resource.createdBy
    ? `Prof. ${resource.createdBy.firstName} ${resource.createdBy.lastName}`
    : "Docente LectoRuta"
  const teacherInitials = resource.createdBy
    ? `${resource.createdBy.firstName?.[0] || ""}${resource.createdBy.lastName?.[0] || ""}`
    : "LR"
  const teacherSubject = resource.createdBy?.subject || "Lectura Crítica"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border">
      {/* Teacher header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
            {teacherInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{teacherName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{teacherSubject}</span>
              <span>·</span>
              <span>{timeAgo(resource.createdAt)}</span>
            </div>
          </div>
          <Badge className="text-xs gap-1 bg-gray-100 dark:bg-card text-foreground border-0">
            <div className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <h3 className="font-bold text-foreground text-base leading-snug">{resource.title}</h3>
      </div>

      {/* Content text */}
      <div className="px-4 pb-3">
        <div className="text-sm text-muted-foreground leading-relaxed">
          {isLongContent && !expanded ? (
            <>
              {resource.content.substring(0, 180)}...
              <button onClick={() => setExpanded(true)} className="text-primary font-semibold ml-1 hover:underline">
                Ver más
              </button>
            </>
          ) : (
            resource.content.split("\n").map((p, i) => p.trim() ? <p key={i} className="mb-1.5 last:mb-0">{p}</p> : null)
          )}
          {isLongContent && expanded && (
            <button onClick={() => setExpanded(false)} className="text-primary font-semibold hover:underline flex items-center gap-1 mt-1">
              <ChevronDown className="h-3 w-3 rotate-180" /> Ver menos
            </button>
          )}
        </div>
      </div>

      {/* Video */}
      {videoId && (
        <div className="px-4 pb-3">
          <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md border border-border bg-black">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={resource.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      {resource.type === "image" && resource.imageUrl && (
        <div className="px-4 pb-3">
          <div className="rounded-xl overflow-hidden shadow-md border border-border max-w-md mx-auto">
            <img src={resource.imageUrl} alt={resource.title} className="w-full object-cover" />
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-xs h-6 border-purple-300 dark:border-purple-700 text-primary">{resource.category}</Badge>
          {resource.targetGrades?.map((g) => (
            <Badge key={g} className="text-xs h-6 bg-purple-100 dark:bg-purple-900/40 text-primary border-0">Grado {g}°</Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2.5 border-t border-border bg-gray-50/50 dark:bg-card/30 flex items-center gap-2">
        <button
          onClick={() => handleAction("like")}
          disabled={loadingAction}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            liked
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-muted-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 transition-all ${liked ? "fill-current scale-110" : ""}`} />
          <span>{likeCount > 0 ? likeCount : ""}</span>
          {!liked && <span className="hidden sm:inline">Me gusta</span>}
        </button>

        <button
          onClick={() => handleAction("save")}
          disabled={loadingAction}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            saved
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-muted-foreground"
          }`}
        >
          {saved ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
          <span className="hidden sm:inline">{saved ? "Guardado" : "Guardar"}</span>
        </button>
      </div>
    </Card>
  )
}

export function BibliotecaICFES({ studentId, studentGrade }: { studentId: string; studentGrade: number }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    loadResources()
  }, [studentGrade])

  const loadResources = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/resources?grade=${studentGrade}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) { /* silent */ }
    finally { setLoading(false) }
  }

  const filteredResources = resources.filter((r) => {
    if (showSaved) return r.savedBy?.includes(studentId)
    if (filter === "all") return true
    return r.type === filter
  })

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Biblioteca ICFES 2026</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-white/10 p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-white/20 rounded" />
                  <div className="h-3 w-20 bg-white/15 rounded" />
                </div>
              </div>
              <div className="h-4 w-3/4 bg-white/15 rounded" />
              <div className="h-32 w-full bg-white/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 shadow-xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Biblioteca ICFES 2026</h2>
          </div>
          <p className="text-purple-200 text-sm mt-1 ml-12">
            Tips, videos y guías de tus docentes para las pruebas Saber 11
          </p>
        </div>
        <Button
          onClick={() => setShowSaved(!showSaved)}
          size="sm"
          className={`gap-1.5 rounded-full ${
            showSaved
              ? "bg-white text-purple-700 hover:bg-purple-50"
              : "bg-white/20 text-white hover:bg-white/30 border-white/30"
          }`}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Guardados</span>
        </Button>
      </div>

      {/* Filter tabs */}
      {!showSaved && (
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === tab.value
                  ? "bg-white text-purple-700 shadow-md"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-16 w-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-white/50" />
          </div>
          <p className="font-semibold text-white text-base">
            {showSaved ? "No tienes recursos guardados" : "Aún no hay recursos publicados"}
          </p>
          <p className="text-purple-200 text-sm mt-1 text-center max-w-xs">
            {showSaved ? "Dale guardar a los recursos que te interesen" : "Tus docentes pronto compartirán tips y guías aquí"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              studentId={studentId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
