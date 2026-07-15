"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, ChevronLeft, ChevronRight, Play, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ─── Agenda del estudiante ────────────────────────────────────────────────────
// Mini calendario mensual + lista de próximas entregas. Solo usa los talleres
// que el docente creó con fecha límite (dueDate).

interface AgendaWorkshop {
  _id: string
  title: string
  difficulty?: string
  dueDate?: string | null
}

interface StudentAgendaProps {
  workshops: AgendaWorkshop[]
  completedIds: Set<string>
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]

// Medianoche local — todas las comparaciones de fechas se hacen por día calendario
function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((atMidnight(to).getTime() - atMidnight(from).getTime()) / 86400000)
}

type DueStatus = "overdue" | "today" | "soon" | "future" | "done"

function dueStatus(dueDate: Date, isDone: boolean): DueStatus {
  if (isDone) return "done"
  const diff = daysBetween(new Date(), dueDate)
  if (diff < 0) return "overdue"
  if (diff === 0) return "today"
  if (diff <= 3) return "soon"
  return "future"
}

const STATUS_STYLE: Record<DueStatus, { dot: string; chip: string; label: (diff: number) => string }> = {
  overdue: {
    dot: "bg-red-500",
    chip: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    label: (diff) => `Vencido hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`,
  },
  today: {
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    label: () => "¡Vence hoy!",
  },
  soon: {
    dot: "bg-orange-400",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    label: (diff) => (diff === 1 ? "Vence mañana" : `Vence en ${diff} días`),
  },
  future: {
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    label: (diff) => `En ${diff} días`,
  },
  done: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: () => "Entregado",
  },
}

export function StudentAgenda({ workshops, completedIds }: StudentAgendaProps) {
  const today = atMidnight(new Date())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Talleres con fecha límite válida
  const dated = workshops
    .filter((w) => w.dueDate)
    .map((w) => ({ ...w, due: atMidnight(new Date(w.dueDate!)), isDone: completedIds.has(w._id?.toString()) }))
    .filter((w) => !isNaN(w.due.getTime()))
    .sort((a, b) => a.due.getTime() - b.due.getTime())

  if (dated.length === 0) return null // Sin fechas límite: la agenda no ocupa espacio

  // Entregas por día (clave YYYY-MM-DD local) para pintar el calendario
  const byDay = new Map<string, typeof dated>()
  for (const w of dated) {
    const key = `${w.due.getFullYear()}-${w.due.getMonth()}-${w.due.getDate()}`
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(w)
  }

  // Grilla del mes en vista (semana inicia lunes)
  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7 // domingo(0) → 6

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const upcoming = dated.filter((w) => !w.isDone)
  const overdueCount = upcoming.filter((w) => daysBetween(today, w.due) < 0).length

  return (
    <section>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-1.5 sm:gap-2">
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" /> Mi Agenda
        </h2>
        {overdueCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-red-600 dark:text-red-400">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {overdueCount} vencido{overdueCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-3 sm:gap-4">
        {/* ── Mini calendario ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} aria-label="Mes anterior"
              className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-sm font-bold">{MONTHS[viewMonth]} {viewYear}</p>
            <button onClick={nextMonth} aria-label="Mes siguiente"
              className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-[10px] font-semibold text-muted-foreground py-1">{d}</span>
            ))}
            {Array.from({ length: leadingBlanks }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const key = `${viewYear}-${viewMonth}-${dayNum}`
              const dayWorkshops = byDay.get(key)
              const isToday =
                dayNum === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
              // Estado más urgente del día para el color del punto
              const worst: DueStatus | null = dayWorkshops
                ? (["overdue", "today", "soon", "future", "done"] as DueStatus[]).find((s) =>
                    dayWorkshops.some((w) => dueStatus(w.due, w.isDone) === s)
                  ) ?? null
                : null

              return (
                <div
                  key={key}
                  title={dayWorkshops?.map((w) => w.title).join(", ")}
                  className={cn(
                    "relative h-8 flex flex-col items-center justify-center rounded-lg text-xs",
                    isToday && "bg-violet-600 text-white font-bold",
                    !isToday && dayWorkshops && "bg-muted/60 font-semibold"
                  )}
                >
                  {dayNum}
                  {worst && (
                    <span className={cn("absolute bottom-0.5 w-1.5 h-1.5 rounded-full", STATUS_STYLE[worst].dot)} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-2 border-t border-border">
            {([["overdue", "Vencido"], ["today", "Hoy"], ["future", "Próximo"], ["done", "Entregado"]] as [DueStatus, string][]).map(([s, label]) => (
              <span key={s} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_STYLE[s].dot)} /> {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Próximas entregas ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="px-3 sm:px-4 py-2.5 border-b border-border">
            <p className="text-xs sm:text-sm font-bold">Próximas entregas</p>
          </div>

          {upcoming.length === 0 ? (
            <div className="p-5 sm:p-8 text-center text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/60" />
              <p className="text-xs sm:text-sm font-medium">¡Al día! No tienes entregas pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-64 overflow-y-auto">
              {upcoming.map((w) => {
                const diff = daysBetween(today, w.due)
                const status = dueStatus(w.due, false)
                const style = STATUS_STYLE[status]
                return (
                  <div key={w._id} className="px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{w.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {w.due.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                    <span className={cn("text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", style.chip)}>
                      {style.label(diff)}
                    </span>
                    <Link href={`/exercise/${w._id}`}>
                      <Button size="sm" className="h-7 px-2 sm:px-3 gap-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] sm:text-xs">
                        <Play className="w-3 h-3" /> <span className="hidden sm:inline">Iniciar</span>
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
