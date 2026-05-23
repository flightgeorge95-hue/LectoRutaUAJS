"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Users, Award, Globe, BookOpen, Target, Heart } from "lucide-react"
import Image from "next/image"

export default function QuienesSomosPage() {
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
                src="/images/logo-uajs-vertical.jpg"
                alt="UAJS Logo"
                width={50}
                height={50}
                className="rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Quiénes Somos</h1>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Image
                src="/images/logo-uajs-horizontal.png"
                alt="UAJS Logo"
                width={400}
                height={120}
                className="h-20 w-auto mx-auto mb-6"
              />
              <h2 className="text-4xl font-bold text-foreground mb-6">¿Quiénes Somos?</h2>
            </div>

            <Card className="mb-8 border-border shadow-lg dark:bg-card/50">
              <CardContent className="p-8">
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  La <strong>Corporación Universitaria Antonio José de Sucre (UAJS)</strong> es una institución de
                  educación superior privada, sin ánimo de lucro, fundada en 2003 con el propósito de contribuir al
                  desarrollo educativo, científico, tecnológico, cultural y social de la región Caribe colombiana.
                </p>

                <p className="text-lg text-foreground leading-relaxed mb-6">
                  Nuestra institución lleva el nombre del ilustre prócer de la independencia{" "}
                  <strong>Antonio José de Sucre</strong>, conocido como el "Gran Mariscal de Ayacucho", quien representa
                  los valores de liderazgo, integridad y compromiso con la libertad y el progreso que caracterizan
                  nuestra labor educativa.
                </p>

                <p className="text-lg text-foreground leading-relaxed">
                  Con sede principal en Sincelejo, capital del departamento de Sucre, la UAJS se ha consolidado como una
                  institución líder en la formación de profesionales competentes, éticos y comprometidos con el
                  desarrollo sostenible de la región y del país.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-border hover:shadow-lg transition-all duration-300 dark:bg-card/50">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-purple-700 dark:text-purple-400">Nuestra Comunidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Más de 3,000 estudiantes activos en programas de pregrado y posgrado, acompañados por un equipo de
                    más de 200 docentes altamente calificados.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Estudiantes de pregrado y posgrado</li>
                    <li>• Docentes con formación avanzada</li>
                    <li>• Personal administrativo especializado</li>
                    <li>• Egresados exitosos en el mercado laboral</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-all duration-300 dark:bg-card/50">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-purple-700 dark:text-purple-400">Reconocimientos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Institución vigilada por el Ministerio de Educación Nacional con programas acreditados y
                    reconocimiento por su calidad académica.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Registro calificado vigente</li>
                    <li>• Programas con acreditación de calidad</li>
                    <li>• Reconocimiento institucional</li>
                    <li>• Certificaciones internacionales</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border shadow-lg mb-8 dark:bg-card/50">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-purple-700 dark:text-purple-400 text-2xl">Nuestro Compromiso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Excelencia Académica</h4>
                    <p className="text-sm text-muted-foreground">
                      Programas académicos de alta calidad con metodologías innovadoras y tecnología de vanguardia.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Proyección Regional</h4>
                    <p className="text-sm text-muted-foreground">
                      Contribución al desarrollo sostenible de la región Caribe y del país a través de la educación.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Responsabilidad Social</h4>
                    <p className="text-sm text-muted-foreground">
                      Formación integral de profesionales comprometidos con el bienestar de la sociedad.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-purple-600 dark:bg-purple-400 hover:bg-purple-700 dark:hover:bg-purple-300 text-lg px-8 py-3"
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
