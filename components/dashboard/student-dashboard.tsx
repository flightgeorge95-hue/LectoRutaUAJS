"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy, Zap, Flame, CheckCircle2, BookOpen, LogOut,
  Clock, Star, Target, TrendingUp, Newspaper, Play, Lock, Award,
} from "lucide-react"
import Link from "next/link"

interface StudentDashboardProps {
  studentData: any
}

const COMPETENCY_META = [
  {
    key: "literal",
    label: "Lectura Literal",
    description: "Identificar y entender contenidos",
    color: "from-emerald-400 to-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: "📖",
  },
  {
    key: "inferential",
    label: "Lectura Inferencial",
    description: "Comprender articulación del texto",
    color: "from-blue-400 to-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    icon: "🔍",
  },
  {
    key: "critical",
    label: "Lectura Crítica",
    description: "Reflexionar y evaluar críticamente",
    color: "from-purple-400 to-violet-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    icon: "💡",
  },
]

const BADGES = [
  { id: 1, emoji: "📚", label: "Primer Paso", desc: "Completa tu primer taller", unlockAt: 1, field: "completedWorkshops" },
  { id: 2, emoji: "⚡", label: "Lector Ágil", desc: "Completa 5 talleres", unlockAt: 5, field: "completedWorkshops" },
  { id: 3, emoji: "🎯", label: "Analista ICFES", desc: "Alcanza 200 puntos", unlockAt: 200, field: "points" },
  { id: 4, emoji: "🏆", label: "Experto Crítico", desc: "Alcanza 500 puntos", unlockAt: 500, field: "points" },
  { id: 5, emoji: "🔥", label: "Racha Lectora", desc: "Mantén racha de 3 días", unlockAt: 3, field: "streak" },
  { id: 6, emoji: "🌟", label: "Nivel 5", desc: "Alcanza el nivel 5", unlockAt: 5, field: "level" },
]

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

const DIFF_STYLE: Record<string, string> = {
  Básico: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Intermedio: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Avanzado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}

export function StudentDashboard({ studentData }: StudentDashboardProps) {
  const [workshops, setWorkshops] = useState<any[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [completionByWorkshop, setCompletionByWorkshop] = useState<Record<string, any>>({})
  const [stats, setStats] = useState<any>(null)
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const studentId = studentData?.studentId || studentData?.userId || studentData?._id

  const load = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const [wRes, rRes] = await Promise.all([
        fetch(`/api/student/workshops?studentId=${studentId}`),
        fetch(`/api/resources?grade=${studentData?.grade || ""}`),
      ])
      const wData = await wRes.json()
      const rData = await rRes.json()
      if (wData.success) {
        setWorkshops(wData.workshops || [])
        setCompletedIds(new Set(wData.completedWorkshopIds || []))
        setCompletionByWorkshop(wData.completionByWorkshop || {})
        setStats(wData.stats)
      }
      const resList = rData.resources || (Array.isArray(rData) ? rData : [])
      setResources(resList.slice(0, 6))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [studentId, studentData?.grade])

  useEffect(() => { load() }, [load])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("studentAuth")
    localStorage.removeItem("studentData")
    localStorage.removeItem("userData")
    window.location.href = "/"
  }

  const points = stats?.points ?? studentData?.points ?? 0
  const level = stats?.level ?? studentData?.level ?? 1
  const streak = stats?.streak ?? 0
  const completedWorkshops = stats?.completedWorkshops ?? 0
  const averageScore = stats?.averageScore ?? 0
  const competencyStats = stats?.competencyStats ?? { literal: 0, inferential: 0, critical: 0 }

  const pointsForNextLevel = level * 100
  const pointsForCurrentLevel = (level - 1) * 100
  const xpProgress = Math.min(100, Math.round(((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100))
  const pointsToNext = Math.max(0, pointsForNextLevel - points)

  const pendingWorkshops = workshops.filter((w) => !completedIds.has(w._id?.toString()))

  const isBadgeUnlocked = (badge: (typeof BADGES)[0]) => {
    const val =
      badge.field === "completedWorkshops" ? completedWorkshops
      : badge.field === "points" ? points
      : badge.field === "streak" ? streak
      : badge.field === "level" ? level : 0
    return val >= badge.unlockAt
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg"
        >
          <BookOpen className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base hidden sm:block">LectoRuta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {studentData?.firstName} {studentData?.lastName}
            </span>
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              Grado {studentData?.grade}°
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-xl"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-purple-200 text-sm font-medium">Grado {studentData?.grade}°</span>
                {streak > 0 && (
                  <span className="flex items-center gap-1 bg-orange-400/30 text-orange-200 text-xs px-2 py-0.5 rounded-full border border-orange-300/30">
                    <Flame className="w-3 h-3" /> {streak} día{streak !== 1 ? "s" : ""} de racha
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                ¡Hola, {studentData?.firstName}! 👋
              </h1>
              <p className="text-purple-200 text-sm">
                {pendingWorkshops.length > 0
                  ? `Tienes ${pendingWorkshops.length} taller${pendingWorkshops.length > 1 ? "es" : ""} pendiente${pendingWorkshops.length > 1 ? "s" : ""} — ¡tú puedes!`
                  : completedWorkshops > 0
                  ? "¡Increíble! Completaste todos tus talleres 🎉"
                  : "Prepárate para conquistar las Pruebas ICFES"}
              </p>
            </div>
            {/* Level circle */}
            <div className="text-center flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold leading-none">{level}</span>
                <span className="text-purple-200 text-[10px] uppercase tracking-wide">Nivel</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="relative mt-5">
            <div className="flex justify-between text-xs text-purple-200 mb-1.5">
              <span>{points} pts</span>
              <span>
                {pointsToNext > 0 ? `Faltan ${pointsToNext} pts para Nivel ${level + 1}` : `¡Nivel ${level}!`}
              </span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { icon: <Trophy className="w-5 h-5" />, value: points, label: "Puntos totales", gradient: "from-amber-400 to-yellow-500" },
            { icon: <Zap className="w-5 h-5" />, value: level, label: "Nivel actual", gradient: "from-violet-500 to-purple-600" },
            { icon: <Flame className="w-5 h-5" />, value: streak, label: "Días de racha", gradient: "from-orange-400 to-red-500" },
            { icon: <CheckCircle2 className="w-5 h-5" />, value: completedWorkshops, label: "Talleres listos", gradient: "from-emerald-400 to-green-500" },
          ] as const).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Mis Misiones (Talleres) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" /> Mis Misiones
            </h2>
            {averageScore > 0 && (
              <span className="text-sm text-muted-foreground">
                Promedio: <strong className="text-foreground">{averageScore}%</strong>
              </span>
            )}
          </div>

          {workshops.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Sin talleres asignados aún</p>
              <p className="text-sm mt-1">Tu docente te asignará talleres próximamente</p>
            </div>
          ) : (() => {
            const pendingWs  = workshops.filter((w) => !completedIds.has(w._id?.toString()))
            const doneWs     = workshops.filter((w) =>  completedIds.has(w._id?.toString()))

            const WorkshopCard = ({ w, i }: { w: any; i: number }) => {
              const wId        = w._id?.toString()
              const isDone     = completedIds.has(wId)
              const completion = completionByWorkshop[wId]
              const diffStyle  = DIFF_STYLE[w.difficulty] || DIFF_STYLE.Intermedio
              const status     = completion?.status
              const finalGrade = completion?.finalGrade
              const isPending  = status === "pending_review"
              const isReviewed = status === "reviewed"

              const cardClass = isPending
                ? "border-violet-200 bg-violet-50/60 dark:bg-violet-900/10 dark:border-violet-800/40"
                : isReviewed || isDone
                ? "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-900/10 dark:border-emerald-800/40"
                : "border-border bg-card hover:shadow-md"

              return (
                <motion.div
                  key={wId}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border p-5 flex flex-col gap-3 transition-shadow ${cardClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffStyle}`}>
                      {w.difficulty || "Intermedio"}
                    </span>
                    {isPending ? (
                      <span className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium">
                        <Clock className="w-3 h-3" /> En Revisión
                      </span>
                    ) : isReviewed ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Calificado
                      </span>
                    ) : isDone ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">{w.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{w.subject || "Lectura Crítica"}</p>
                  </div>

                  {w.questionCount != null && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="w-3 h-3" />
                      <span>{w.questionCount} preguntas</span>
                    </div>
                  )}

                  {isDone && completion && (
                    <div className={`rounded-xl px-3 py-2 text-center ${
                      isPending ? "bg-violet-100 dark:bg-violet-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                    }`}>
                      {isPending ? (
                        <p className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                          ⏳ Tu docente está calificando
                        </p>
                      ) : (
                        <>
                          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                            {finalGrade != null ? `${finalGrade.toFixed(1)} / 5.0` : `${completion.score}%`}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {isReviewed ? "Nota final" : "Puntaje"}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-auto">
                    {!isDone ? (
                      <Link href={`/exercise/${wId}`}>
                        <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white shadow gap-2">
                          <Play className="w-3.5 h-3.5" /> Iniciar Misión
                        </Button>
                      </Link>
                    ) : isPending ? (
                      <div className="w-full text-center py-2 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10">
                        <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                          ⏳ Esperando calificación del docente
                        </p>
                      </div>
                    ) : (
                      <Link href={
                        completion?.completionId
                          ? `/exercise/${wId}?completionId=${completion.completionId}`
                          : `/exercise/${wId}`
                      }>
                        <Button size="sm" variant="outline" className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" /> Ver resultado
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )
            }

            return (
              <div className="space-y-6">
                {/* Pending workshops */}
                {pendingWs.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {pendingWs.map((w, i) => <WorkshopCard key={w._id?.toString()} w={w} i={i} />)}
                    </AnimatePresence>
                  </div>
                )}

                {/* Completed workshops */}
                {doneWs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Completados ({doneWs.length})
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {doneWs.map((w, i) => <WorkshopCard key={w._id?.toString()} w={w} i={i} />)}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </section>

        {/* ── Progreso por Competencia ── */}
        <section>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Mi Progreso ICFES
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {COMPETENCY_META.map((comp) => {
              const value = (competencyStats as any)[comp.key] || 0
              const hasData = value > 0
              return (
                <motion.div
                  key={comp.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-2xl border p-5 ${comp.bg}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl">{comp.icon}</span>
                      <p className={`text-sm font-semibold mt-1 ${comp.text}`}>{comp.label}</p>
                      <p className="text-xs text-muted-foreground">{comp.description}</p>
                    </div>
                    <span className={`text-2xl font-extrabold ${comp.text}`}>
                      {hasData ? `${value}%` : "—"}
                    </span>
                  </div>
                  <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hasData ? `${value}%` : "0%" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${comp.color} rounded-full`}
                    />
                  </div>
                  {!hasData && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Completa talleres para ver tu progreso
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── Logros ── */}
        <section>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" /> Mis Logros
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {BADGES.map((badge) => {
              const unlocked = isBadgeUnlocked(badge)
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: unlocked ? 1.06 : 1 }}
                  className={`rounded-2xl border p-3 text-center flex flex-col items-center gap-2 transition-all ${
                    unlocked
                      ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/50 shadow-sm"
                      : "border-border bg-muted/30 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{badge.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.desc}</p>
                  </div>
                  {unlocked
                    ? <Star className="w-3 h-3 text-amber-500" />
                    : <Lock className="w-3 h-3 text-muted-foreground" />}
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── Noticias y Recursos ── */}
        <section>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-indigo-600" /> Noticias y Recursos ICFES
          </h2>
          {resources.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">
              <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tu docente publicará recursos aquí pronto</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource: any, i: number) => {
                const isVideo = resource.type === "video"
                const ytId = isVideo ? getYouTubeId(resource.videoUrl || "") : null
                const typeEmoji =
                  isVideo ? "🎬"
                  : resource.type === "guide" ? "📋"
                  : resource.type === "image" ? "🖼️"
                  : "💡"
                const typeLabel =
                  isVideo ? "Video"
                  : resource.type === "guide" ? "Guía"
                  : resource.type === "image" ? "Imagen"
                  : "Consejo"
                return (
                  <motion.div
                    key={resource._id || i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border border-border bg-card hover:shadow-md transition-shadow flex flex-col overflow-hidden"
                  >
                    {/* YouTube thumbnail */}
                    {ytId && (
                      <a
                        href={resource.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full aspect-video bg-black overflow-hidden group"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      </a>
                    )}

                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeEmoji}</span>
                        <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
                        {resource.category && (
                          <Badge variant="outline" className="text-xs ml-auto truncate max-w-[100px]">
                            {resource.category}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{resource.content}</p>

                      {/* Video sin thumbnail (URL no es YouTube) */}
                      {isVideo && !ytId && resource.videoUrl && (
                        <a href={resource.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="w-full gap-2 mt-1">
                            <Play className="w-3 h-3" /> Ver video
                          </Button>
                        </a>
                      )}

                      {resource.createdBy && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Por {resource.createdBy.firstName} {resource.createdBy.lastName}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
