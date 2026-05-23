"use client"

import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force reset corrupted theme on first load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (!storedTheme || (storedTheme !== "light" && storedTheme !== "dark")) {
      localStorage.setItem("theme", "light")
    }
  }, [])

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
