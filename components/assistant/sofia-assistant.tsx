"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Lightbulb, RefreshCw, BookOpen, Search, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Banco de consejos por competencia ICFES de Lectura Crítica ──────────────
// Sofía es un asistente de estudio basado en reglas: entrega estrategias
// curadas por competencia, sin depender de servicios externos.

type Category = "literal" | "inferencial" | "critica" | "prueba"

const CATEGORIES: { key: Category; label: string; icon: typeof BookOpen; color: string }[] = [
  { key: "literal", label: "Contenido local", icon: BookOpen, color: "text-blue-400" },
  { key: "inferencial", label: "Articulación", icon: Search, color: "text-violet-400" },
  { key: "critica", label: "Evaluación crítica", icon: Scale, color: "text-emerald-400" },
  { key: "prueba", label: "Día de la prueba", icon: Lightbulb, color: "text-amber-400" },
]

const TIPS: Record<Category, string[]> = {
  literal: [
    "Subraya las palabras clave de la pregunta ANTES de volver al texto: así sabes exactamente qué buscar.",
    "Cuando te pregunten por el significado de una palabra, reemplázala por cada opción dentro de la oración original. La que conserve el sentido es la correcta.",
    "Los datos explícitos (fechas, nombres, cifras) siempre están escritos en el texto. Si no lo encuentras literal, no lo inventes.",
    "Lee primero las preguntas y luego el texto: tu cerebro filtrará la información relevante mientras lees.",
    "Fíjate en los conectores (sin embargo, por lo tanto, aunque): cambian por completo el sentido de una oración.",
    "En textos discontinuos (gráficas, caricaturas, infografías) lee TODO: títulos, ejes, notas al pie y fuente.",
  ],
  inferencial: [
    "La idea principal casi nunca está en una sola oración: pregúntate '¿de qué trata TODO el párrafo?' y no solo la primera línea.",
    "Para identificar la función de un párrafo, pregúntate qué pasaría si lo quitaras: ¿qué perdería el texto?",
    "Si te preguntan por la intención del autor, revisa el tipo de texto: informar (noticia), persuadir (columna de opinión), narrar (cuento).",
    "Las preguntas de 'el texto anterior sugiere...' piden inferencia: la respuesta NO está escrita, pero debe apoyarse en pistas del texto.",
    "Cuidado con las opciones que son ciertas en la vida real pero que el texto NO dice: la respuesta debe salir del texto, no de tu opinión.",
    "Identifica la estructura: ¿problema-solución? ¿causa-efecto? ¿comparación? Saberlo te ayuda a ubicar cada idea.",
  ],
  critica: [
    "Distingue hecho de opinión: los hechos se pueden verificar; las opiniones llevan valoraciones ('lamentablemente', 'lo mejor').",
    "Para evaluar un argumento pregúntate: ¿la evidencia que da el autor realmente apoya su conclusión?",
    "Detecta la voz del autor: ¿usa ironía? ¿exagera? El tono es clave en caricaturas y columnas de opinión.",
    "Cuando te pidan la estrategia argumentativa, busca: ¿cita expertos? ¿da ejemplos? ¿usa cifras? ¿apela a emociones?",
    "Un buen contraargumento ataca la premisa del autor, no un detalle menor. Búscalo en las opciones.",
    "Pregúntate siempre quién escribe y para quién: el contexto del autor revela sus intereses y posibles sesgos.",
  ],
  prueba: [
    "Administra el tiempo: en Lectura Crítica tienes unos 90 segundos por pregunta. Si te atascas, marca tu mejor opción y sigue.",
    "Nunca dejes preguntas en blanco: en Saber 11 no hay penalización por error.",
    "Descarta primero las 2 opciones claramente incorrectas: tus probabilidades suben de 25% a 50%.",
    "Duerme bien la noche anterior: la comprensión lectora es lo primero que se afecta con el cansancio.",
    "Responde primero los textos que te parezcan fáciles: ganar confianza al inicio mejora tu rendimiento total.",
    "Lleva tu documento de identidad y llega con anticipación: el estrés logístico roba concentración.",
  ],
}

// Consejo del día: determinista según la fecha (mismo consejo todo el día)
function tipOfTheDay(): { tip: string; category: Category } {
  const all: { tip: string; category: Category }[] = []
  ;(Object.keys(TIPS) as Category[]).forEach((cat) => TIPS[cat].forEach((tip) => all.push({ tip, category: cat })))
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % all.length
  return all[dayIndex]
}

export function SofiaAssistant({ studentName }: { studentName?: string }) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<Category>("literal")
  const [tipIndex, setTipIndex] = useState(0)
  const [pulse, setPulse] = useState(true)

  const daily = tipOfTheDay()

  useEffect(() => {
    // Deja de pulsar tras la primera apertura
    if (open) setPulse(false)
  }, [open])

  const nextTip = () => setTipIndex((i) => (i + 1) % TIPS[category].length)
  const selectCategory = (c: Category) => { setCategory(c); setTipIndex(0) }
  const activeCat = CATEGORIES.find((c) => c.key === category)!

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Abrir asistente Sofía"
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-xl",
          "bg-gradient-to-br from-violet-600 to-purple-700 text-white",
          "flex items-center justify-center border-2 border-violet-400/40",
          pulse && !open && "animate-pulse"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
          >
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-violet-700 to-purple-700 px-4 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center text-xl shrink-0">🦉</div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Sofía UAJS</p>
                <p className="text-violet-200 text-[11px] leading-tight">Asistente de estudio · Lectura Crítica</p>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Consejo del día */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2.5">
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" /> Consejo del día
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {studentName ? `${studentName}, ` : ""}{daily.tip}
                </p>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => selectCategory(c.key)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors",
                      category === c.key
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-muted border-border text-muted-foreground hover:border-violet-500/50"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Consejo por competencia */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${category}-${tipIndex}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl bg-muted/60 border border-border px-3 py-3 min-h-[88px]"
                >
                  <p className={cn("text-[11px] font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1", activeCat.color)}>
                    <activeCat.icon className="h-3 w-3" /> {activeCat.label} · {tipIndex + 1}/{TIPS[category].length}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{TIPS[category][tipIndex]}</p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={nextTip}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Otro consejo
              </button>

              <p className="text-[10px] text-muted-foreground text-center leading-snug">
                Estrategias basadas en las 3 competencias de Lectura Crítica evaluadas en Saber 11 (ICFES).
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
