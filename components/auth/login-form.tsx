"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, User, GraduationCap, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("student")
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const grade = formData.get("grade") as string
    const institution = formData.get("institution") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType: activeTab,
          grade: activeTab === "student" ? grade : undefined,
          institution: activeTab === "teacher" ? institution : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTimeout(() => {
          window.location.href = data.redirectUrl
        }, 100)
      } else {
        setError(data.error || "Error al iniciar sesión")
        setIsLoading(false)
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Bienvenido</CardTitle>
        <CardDescription>Ingresa a tu cuenta para continuar aprendiendo</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Estudiante
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Docente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Correo electrónico</Label>
                <Input
                  id="student-email"
                  name="email"
                  type="email"
                  placeholder="maria.garcia@colegio.edu.co"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Contraseña</Label>
                <Input id="student-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grado</Label>
                <Select name="grade">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6° Grado</SelectItem>
                    <SelectItem value="7">7° Grado</SelectItem>
                    <SelectItem value="8">8° Grado</SelectItem>
                    <SelectItem value="9">9° Grado</SelectItem>
                    <SelectItem value="10">10° Grado</SelectItem>
                    <SelectItem value="11">11° Grado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar como Estudiante"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="teacher" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-email">Correo electrónico</Label>
                <Input id="teacher-email" name="email" type="email" placeholder="prof.lopez@colegio.edu.co" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-password">Contraseña</Label>
                <Input id="teacher-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institución</Label>
                <Input id="institution" name="institution" placeholder="Colegio San José" required />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar como Docente"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta? <button className="text-primary hover:underline">Contacta a tu institución</button>
          </p>
          <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">Credenciales de prueba:</p>
            <p>Estudiante: maria.garcia@colegio.edu.co / password123</p>
            <p>Docente: prof.lopez@colegio.edu.co / password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
