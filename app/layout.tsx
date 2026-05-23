import type React from "react"
import type { Metadata } from "next"
import { Inter, Fredoka } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "LectoRuta Saber - UAJS | Plataforma Educativa",
  description:
    "Plataforma educativa oficial de la Corporación Universitaria Antonio José de Sucre para reforzar habilidades de lectura crítica y preparación para las pruebas Saber 11. Desarrollado por Alejandro Montes Pimienta",
  authors: [{ name: "Alejandro Montes Pimienta" }],
  creator: "Alejandro Montes Pimienta",
  publisher: "Corporación Universitaria Antonio José de Sucre",
  icons: {
    icon: "/images/logo-uajs-vertical.jpg",
    shortcut: "/images/logo-uajs-vertical.jpg",
    apple: "/images/logo-uajs-vertical.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${fredoka.variable} antialiased`} suppressHydrationWarning>
      <head></head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
