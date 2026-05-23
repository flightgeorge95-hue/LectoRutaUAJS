"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedNavbar } from "@/components/animated-navbar"
import { WelcomeAudio } from "@/components/welcome-audio"
import {
  Users,
  Trophy,
  Target,
  GraduationCap,
  UserCheck,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselImages = [
    {
      src: "/images/carousel-1.png",
      alt: "Aprende leyendo con tus docentes - Corporación Universitaria Antonio José de Sucre",
    },
    {
      src: "/images/carousel-2.png",
      alt: "Fortalece tu lectura crítica con talleres web - UAJS",
    },
    {
      src: "/images/carousel-3.png",
      alt: "Lectura crítica: simulacros SABER - Antonio José de Sucre",
    },
    {
      src: "/images/carousel-4.png",
      alt: "Realiza pruebas de lectura crítica de manera dinámica y práctica - UAJS",
    },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="min-h-screen bg-background dark:from-background dark:via-background dark:to-background transition-colors duration-300">
      <WelcomeAudio />
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Image
                src="/images/logo-uajs-vertical.jpg"
                alt="UAJS Logo"
                width={50}
                height={50}
                className="rounded-lg shadow-sm sm:w-[60px] sm:h-[60px]"
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground transition-colors duration-300">
                  LectoRuta Saber
                </h1>
                <p className="text-xs sm:text-sm text-primary font-medium transition-colors duration-300">
                  Corporación Universitaria Antonio José de Sucre
                </p>
              </div>
            </div>
            <AnimatedNavbar />
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="py-10 sm:py-16 lg:py-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className={`space-y-6 sm:space-y-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 shadow-sm">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    Plataforma Educativa Oficial UAJS
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight transition-colors duration-300">
                    Fortalece tu <span className="text-primary">lectura crítica</span> con{" "}
                    <span className="text-primary/80">LectoRuta Saber</span>
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed text-justify transition-colors duration-300">
                    Plataforma educativa innovadora de la Corporación Universitaria Antonio José de Sucre. Desarrolla
                    tus competencias en lectura crítica y prepárate exitosamente para las pruebas Saber 11 con
                    metodología especializada y asistente virtual inteligente.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => (window.location.href = "/dashboard/student")}
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Acceder como Estudiante
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/dashboard/teacher")}
                    variant="outline"
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-purple-600 dark:border-purple-400 text-primary hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent transition-colors duration-300 w-full sm:w-auto"
                  >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Acceder como Docente
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2 sm:pt-4">
                  <div className="flex flex-col items-start">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
                      <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground/80 transition-colors duration-300">
                      IA Avanzada
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
                      <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground/80 transition-colors duration-300">
                      Talleres Interactivos
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
                      <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground/80 transition-colors duration-300">
                      Gamificación
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative order-first lg:order-last">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-card">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={carouselImages[currentSlide].src || "/placeholder.svg"}
                      alt={carouselImages[currentSlide].alt}
                      fill
                      className="object-cover transition-all duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
                  </div>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-purple-600 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-purple-600 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide ? "bg-white w-6 sm:w-8" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <Card className="animate-float border-border bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-xl sm:text-2xl">+1,200</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Estudiantes Activos</p>
                    </CardContent>
                  </Card>
                  <Card className="animate-float border-border bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-xl sm:text-2xl">98%</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Mejora en Resultados</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre-nosotros" className="py-20 bg-card transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/logo-uajs-horizontal.png"
                  alt="UAJS Logo Horizontal"
                  width={400}
                  height={120}
                  className="h-20 w-auto"
                />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6 transition-colors duration-300">
                Corporación Universitaria Antonio José de Sucre
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto transition-colors duration-300">
                Institución de educación superior comprometida con la formación integral de profesionales competentes,
                éticos y con responsabilidad social, que contribuyan al desarrollo sostenible de la región Caribe y del
                país.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary transition-colors duration-300">
                    Excelencia Académica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground transition-colors duration-300">
                    Programas académicos de alta calidad con metodologías innovadoras y docentes altamente calificados
                    para garantizar una formación integral y competitiva.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary transition-colors duration-300">
                    Innovación Educativa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground transition-colors duration-300">
                    Implementación de tecnologías educativas avanzadas y metodologías pedagógicas innovadoras que
                    facilitan el aprendizaje significativo y el desarrollo de competencias.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary transition-colors duration-300">
                    Compromiso Social
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground transition-colors duration-300">
                    Formación de profesionales con sentido ético y responsabilidad social, comprometidos con el
                    desarrollo sostenible y el bienestar de la comunidad.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="talleres"
          className="py-20 bg-secondary dark:from-background dark:to-background transition-colors duration-300"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6 transition-colors duration-300">
                Plataforma LectoRuta Saber
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto transition-colors duration-300">
                Accede a nuestra plataforma educativa especializada en lectura crítica con tecnología de vanguardia y
                asistente virtual inteligente "Sofía UAJS".
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border bg-card shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary transition-colors duration-300">
                      Dashboard Estudiante
                    </CardTitle>
                    <CardDescription className="text-muted-foreground transition-colors duration-300">
                      Plataforma especializada para estudiantes de grado 11 con preparación integral para pruebas Saber
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      onClick={() => (window.location.href = "/dashboard/student")}
                      className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-lg py-6 mb-4 transition-colors duration-300"
                    >
                      <UserCheck className="h-5 w-5 mr-2" />
                      Acceder como Estudiante
                    </Button>
                    <div className="text-sm text-muted-foreground space-y-2 transition-colors duration-300">
                      <p>• Talleres interactivos de lectura crítica</p>
                      <p>• Asistente virtual "Sofía UAJS"</p>
                      <p>• Sistema de gamificación avanzado</p>
                      <p>• Preparación específica para ICFES</p>
                      <p>• Seguimiento personalizado de progreso</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary transition-colors duration-300">
                      Dashboard Docente
                    </CardTitle>
                    <CardDescription className="text-muted-foreground transition-colors duration-300">
                      Herramientas avanzadas para docentes con gestión integral del proceso educativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      onClick={() => (window.location.href = "/dashboard/teacher")}
                      className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-lg py-6 mb-4 transition-colors duration-300"
                    >
                      <UserCheck className="h-5 w-5 mr-2" />
                      Acceder como Docente
                    </Button>
                    <div className="text-sm text-muted-foreground space-y-2 transition-colors duration-300">
                      <p>• Gestión avanzada por grados</p>
                      <p>• Seguimiento detallado de progreso</p>
                      <p>• Exportación de informes PDF</p>
                      <p>• Análisis de competencias ICFES</p>
                      <p>• Reportes institucionales</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contacto" className="bg-purple-700 dark:bg-purple-950 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/logo-uajs-vertical.jpg"
                  alt="UAJS Logo"
                  width={48}
                  height={48}
                  className="rounded-lg bg-white/10 p-1"
                />
                <div>
                  <h3 className="text-xl font-bold transition-colors duration-300">LectoRuta Saber</h3>
                  <p className="text-purple-200 text-muted-foreground transition-colors duration-300">
                    UAJS - Plataforma Educativa
                  </p>
                </div>
              </div>
              <p className="text-purple-100 text-purple-100 leading-relaxed transition-colors duration-300">
                Corporación Universitaria Antonio José de Sucre, institución comprometida con la excelencia educativa y
                el desarrollo de competencias en lectura crítica para el éxito en las pruebas Saber 11.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 transition-colors duration-300">Información Institucional</h4>
              <div className="space-y-3 text-purple-100 text-muted-foreground transition-colors duration-300">
                <p className="text-sm transition-colors duration-300">Vigilada Mineducación</p>
                <p className="text-sm transition-colors duration-300">
                  Resolución Personería Jurídica No. 2302 de 2003
                </p>
                <p className="text-sm transition-colors duration-300">Código SNIES 2850</p>
                <p className="text-sm transition-colors duration-300">Registro Calificado Vigente</p>
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2 transition-colors duration-300">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm transition-colors duration-300">www.uajs.edu.co</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 transition-colors duration-300">Contacto</h4>
              <div className="space-y-4 text-purple-100 text-muted-foreground transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm transition-colors duration-300">
                    <p className="font-medium transition-colors duration-300">Sede Principal</p>
                    <p className="transition-colors duration-300">Sincelejo, Calle 27 No 21-50</p>
                    <p className="transition-colors duration-300">Barrio La María, Sucre</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm transition-colors duration-300">
                    <p className="font-medium transition-colors duration-300">Sede E</p>
                    <p className="transition-colors duration-300">Carrera 19 A # 28A - 109</p>
                    <p className="transition-colors duration-300">Avenida Alfonso López</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 transition-colors duration-300">
                  <Phone className="h-5 w-5" />
                  <div className="text-sm transition-colors duration-300">
                    <p>(5) 276 13 48 - 281 22 82</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 transition-colors duration-300">
                  <Mail className="h-5 w-5" />
                  <div className="text-sm transition-colors duration-300">
                    <p>info@uajs.edu.co</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-6 text-center transition-colors duration-300">Nuestra Ubicación</h4>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15749.949177007684!2d-75.41123433261723!3d9.29001745404082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59144c3bce079d%3A0x1dc8c9ee1d05562b!2sCorporaci%C3%B3n%20Universitaria%20Antonio%20Jos%C3%A9%20de%20Sucre%20-%20Sede%20C%20CORPOSUCRE!5e0!3m2!1ses-419!2sco!4v1759004337431!5m2!1ses-419!2sco"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación UAJS - Sincelejo, Sucre"
              ></iframe>
            </div>
          </div>

          <div className="border-t border-purple-600 dark:border-border mt-12 pt-8 text-center transition-colors duration-300">
            <p className="text-purple-200 text-purple-200 text-sm transition-colors duration-300">
              © 2026 Corporación Universitaria Antonio José de Sucre (UAJS). Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
