"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Users, Target, BookOpen, Phone, Sun, Moon,
  Menu, X, GraduationCap, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio", href: "#inicio", icon: Home },
  { id: "quienes-somos", label: "Quiénes Somos", href: "/quienes-somos", icon: Users },
  { id: "mision-vision", label: "Misión y Visión", href: "/mision-vision", icon: Target },
  { id: "plataforma", label: "Plataforma", href: "#talleres", icon: BookOpen },
  { id: "contacto", label: "Contacto", href: "#contacto", icon: Phone },
]

export function AnimatedNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("inicio")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    setActiveItem(item.id)
    setMobileOpen(false)

    if (item.href.startsWith("#")) {
      const el = document.querySelector(item.href)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(item.href)
    }
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <>
      {/* Desktop Nav - Positioned at the right side of the header */}
      <div className="hidden lg:flex items-center gap-1 bg-card/80 backdrop-blur-md rounded-full border border-border/60 px-1.5 py-1 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{item.label}</span>
              </span>
            </button>
          )
        })}

        {/* Theme toggle */}
        <div className="ml-0.5 pl-1.5 border-l border-border">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-muted-foreground hover:bg-accent transition-all"
          >
            {mounted && (
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-2">
        {/* Mobile theme toggle */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 rounded-xl flex items-center justify-center bg-card border border-border text-muted-foreground hover:bg-accent touch-friendly"
          aria-label="Cambiar tema"
        >
          {mounted && (
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          )}
        </button>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 touch-friendly ${
            mobileOpen
              ? "bg-red-500 text-white"
              : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-card z-[60] lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">LectoRuta Saber</h3>
                        <p className="text-xs text-muted-foreground">UAJS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-1">
                  {NAV_ITEMS.map((item, i) => {
                    const Icon = item.icon
                    const isActive = activeItem === item.id
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleNavClick(item)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                            : "text-foreground/80 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium flex-1">{item.label}</span>
                        <ChevronRight className={`h-4 w-4 ${isActive ? "text-white/70" : "text-gray-400"}`} />
                      </motion.button>
                    )
                  })}
                </div>

                <div className="p-4 border-t border-border">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-accent transition-all"
                  >
                    {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
                    <span className="font-medium">{mounted && (theme === "dark" ? "Modo Claro" : "Modo Oscuro")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
