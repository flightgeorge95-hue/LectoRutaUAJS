"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Heart, Shield, Users, Lightbulb, Award, Globe, BookOpen, Handshake } from "lucide-react"
import Image from "next/image"

export default function PrincipiosValoresPage() {
  const principios = [
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Excelencia Académica",
      description:
        "Compromiso permanente con la calidad en todos los procesos educativos, buscando siempre los más altos estándares en la formación profesional.",
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-600" />,
      title: "Formación Integral",
      description:
        "Desarrollo armónico de todas las dimensiones del ser humano: intelectual, ética, estética, física y espiritual.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />,
      title: "Innovación Educativa",
      description:
        "Implementación de metodologías pedagógicas innovadoras y tecnologías de vanguardia para facilitar el aprendizaje significativo.",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Pertinencia Social",
      description:
        "Programas académicos y proyectos de investigación que respondan a las necesidades del entorno y contribuyan al desarrollo regional.",
    },
  ]

  const valores = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Integridad",
      description:
        "Actuamos con honestidad, transparencia y coherencia entre nuestros principios y acciones en todos los ámbitos institucionales.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Respeto",
      description:
        "Valoramos la dignidad humana, la diversidad cultural y las diferencias individuales, promoviendo un ambiente de convivencia armónica.",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Responsabilidad",
      description:
        "Asumimos con compromiso nuestras obligaciones académicas, sociales y ambientales, siendo conscientes del impacto de nuestras acciones.",
    },
    {
      icon: <Handshake className="h-8 w-8 text-purple-600" />,
      title: "Solidaridad",
      description:
        "Promovemos el trabajo colaborativo, la ayuda mutua y el compromiso con el bienestar colectivo y el desarrollo social.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />,
      title: "Creatividad",
      description:
        "Fomentamos el pensamiento crítico, la innovación y la capacidad de generar soluciones originales a los desafíos contemporáneos.",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Compromiso Social",
      description:
        "Contribuimos activamente al desarrollo sostenible de la región y del país a través de la educación, la investigación y la extensión.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />

      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-primary hover:text-purple-700 dark:hover:text-purple-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-uajs-emblema.png"
                alt="UAJS Logo"
                width={50}
                height={50}
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Principios y Valores</h1>
                <p className="text-sm text-primary">
                  Corporación Universitaria Antonio José de Sucre
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Image
                src="/images/logo-uajs-horizontal.png"
                alt="UAJS Logo"
                width={400}
                height={120}
                className="h-20 w-auto mx-auto mb-6"
              />
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Principios y Valores Institucionales
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Los principios y valores que guían nuestro quehacer educativo y definen nuestra identidad institucional,
                orientando todas nuestras acciones hacia la excelencia y el servicio a la sociedad.
              </p>
            </div>

            {/* Principios Section */}
            <section className="mb-16">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4">
                  Principios Institucionales
                </h3>
                <p className="text-lg text-muted-foreground">
                  Los fundamentos que orientan nuestra labor educativa y definen nuestro compromiso con la sociedad
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {principios.map((principio, index) => (
                  <Card
                    key={index}
                    className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-card/50"
                  >
                    <CardHeader>
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        {principio.icon}
                      </div>
                      <CardTitle className="text-xl text-purple-700 dark:text-purple-400">{principio.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{principio.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Valores Section */}
            <section className="mb-12">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4">
                  Valores Institucionales
                </h3>
                <p className="text-lg text-muted-foreground">
                  Los valores que caracterizan nuestra comunidad universitaria y guían nuestro comportamiento ético
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valores.map((valor, index) => (
                  <Card
                    key={index}
                    className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-card/50"
                  >
                    <CardHeader className="text-center">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {valor.icon}
                      </div>
                      <CardTitle className="text-lg text-purple-700 dark:text-purple-400">{valor.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed text-center">
                        {valor.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Compromiso Section */}
            <Card className="border-border shadow-xl mb-8 dark:bg-card/50">
              <CardHeader className="text-center">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-purple-700 dark:text-purple-400">Nuestro Compromiso</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-foreground leading-relaxed max-w-3xl mx-auto">
                  En la Corporación Universitaria Antonio José de Sucre, nos comprometemos a vivir estos principios y
                  valores en cada una de nuestras acciones, creando un ambiente educativo que promueva el desarrollo
                  integral de nuestros estudiantes, el crecimiento profesional de nuestros docentes y colaboradores, y
                  el progreso sostenible de nuestra región y país.
                </p>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-purple-600 dark:bg-purple-400 hover:bg-purple-700 dark:hover:bg-purple-500 text-lg px-8 py-3"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
