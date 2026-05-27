"use client"

import dynamic from "next/dynamic"
import { LazySection } from "@/components/lazy-section"

const ElegantMap = dynamic(
  () => import("@/components/elegant-map").then((m) => ({ default: m.ElegantMap })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="h-[220px] sm:h-[280px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-transparent animate-spin" />
            <span className="text-xs font-medium">Cargando mapa...</span>
          </div>
        </div>
        <div className="h-[45px] bg-gray-200 dark:bg-gray-700" />
      </div>
    ),
  },
)

export function LazyMap() {
  return (
    <LazySection rootMargin="300px 0px" threshold={0.05}>
      <ElegantMap />
    </LazySection>
  )
}
