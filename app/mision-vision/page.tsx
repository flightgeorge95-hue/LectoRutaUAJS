"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Target, Eye, Lightbulb, Users, Award, Globe } from "lucide-react"
import Image from "next/image"

export default function MisionVisionPage() {
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
                <h1 className="text-xl font-bold text-foreground">Misión y Visión</h1>
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
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Misión y Visión Institucional
              </h2>
              <p className="text-lg text-muted-foreground">
                Nuestro compromiso con la excelencia educativa y el desarrollo regional
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="border-border shadow-xl hover:shadow-2xl transition-all duration-300 dark:bg-card/50">
                <CardHeader className="text-center pb-6">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl text-purple-700 dark:text-purple-400">Misión</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-lg text-foreground leading-relaxed text-center mb-6">
                    Formar profesionales íntegros y competentes mediante programas académicos de alta calidad, con
                    metodologías innovadoras y tecnología de vanguardia, que contribuyan al desarrollo sostenible de la
                    región Caribe y del país, promoviendo la investigación, la extensión y la responsabilidad social.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Formación Integral</h4>
                        <p className="text-sm text-muted-foreground">
                          Desarrollo de competencias profesionales y humanas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Alta Calidad</h4>
                        <p className="text-sm text-muted-foreground">
                          Programas académicos con estándares de excelencia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Desarrollo Regional</h4>
                        <p className="text-sm text-muted-foreground">
                          Compromiso con el progreso de la región Caribe
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xl hover:shadow-2xl transition-all duration-300 dark:bg-card/50">
                <CardHeader className="text-center pb-6">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl text-purple-700 dark:text-purple-400">Visión</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-lg text-foreground leading-relaxed text-center mb-6">
                    Ser reconocida en el año 2030 como una institución líder en educación superior en la región Caribe,
                    por su excelencia académica, innovación educativa, investigación aplicada y compromiso con la
                    responsabilidad social, formando profesionales competitivos a nivel nacional e internacional.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Liderazgo Regional</h4>
                        <p className="text-sm text-muted-foreground">
                          Institución de referencia en la región Caribe
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Lightbulb className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Innovación</h4>
                        <p className="text-sm text-muted-foreground">
                          Metodologías educativas de vanguardia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Proyección Internacional</h4>
                        <p className="text-sm text-muted-foreground">
                          Profesionales competitivos globalmente
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border shadow-lg mb-8 dark:bg-card/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-purple-700 dark:text-purple-400">Objetivos Estratégicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground text-lg">Académicos</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Ofrecer programas académicos de alta calidad y pertinencia social</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Implementar metodologías pedagógicas innovadoras</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Fortalecer la formación integral de los estudiantes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground text-lg">Institucionales</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Promover la investigación aplicada y la innovación</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Desarrollar proyectos de extensión y responsabilidad social</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Consolidar alianzas estratégicas nacionales e internacionales</span>
                      </li>
                    </ul>
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
