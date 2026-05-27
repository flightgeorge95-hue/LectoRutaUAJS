"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { MapPin, Phone, Mail, Globe, Navigation } from "lucide-react"

const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15749.949177007684!2d-75.41123433261723!3d9.29001745404082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59144c3bce079d%3A0x1dc8c9ee1d05562b!2sCorporaci%C3%B3n%20Universitaria%20Antonio%20Jos%C3%A9%20de%20Sucre%20-%20Sede%20C%20CORPOSUCRE!5e0!3m2!1ses-419!2sco!4v1759004337431!5m2!1ses-419!2sco"

export function ElegantMap() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark")

  useEffect(() => { setMounted(true) }, [])

  const src = MAP_URL

  return (
    <div className="relative">
      {/* Card container */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">

        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 z-10" />

        {/* Map area */}
        <div className="relative h-[220px] sm:h-[280px]">
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0, filter: isDark ? "grayscale(15%) invert(92%) hue-rotate(180deg) brightness(85%) contrast(80%)" : "none" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación UAJS - Sincelejo, Sucre"
            className="absolute inset-0"
          />

          {/* Gradient overlay at bottom for readability */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Address badge on map */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-lg border border-white/10">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Sede Principal — Sincelejo</p>
              <p className="text-[10px] text-white/70 truncate">Calle 27 No 21-50, Barrio La María</p>
            </div>
            <a
              href="https://maps.google.com/?q=Corporación+Universitaria+Antonio+José+de+Sucre+Sincelejo"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
              aria-label="Abrir en Google Maps"
            >
              <Navigation className="h-4 w-4 text-white" />
            </a>
          </div>

          {/* Theme indicator dot */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 shadow border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-white/80">En vivo</span>
          </div>
        </div>

        {/* Info footer — always dark with white text */}
        <div className="px-4 py-3 flex items-center justify-between gap-4 bg-purple-900 dark:bg-gray-950">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex items-center gap-2 text-white/80">
              <Phone className="h-3.5 w-3.5" />
              <span className="text-[11px]">(5) 276 13 48</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-white/80">
              <Mail className="h-3.5 w-3.5" />
              <span className="text-[11px]">info@uajs.edu.co</span>
            </div>
          </div>
          <a
            href="https://www.uajs.edu.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 hover:text-white transition-colors shrink-0"
          >
            <Globe className="h-3.5 w-3.5" />
            www.uajs.edu.co
          </a>
        </div>
      </div>
    </div>
  )
}
