# DOCUMENTO DE SOPORTE - REGISTRO DE DERECHOS DE AUTOR

## LectoRuta Saber - Plataforma Educativa UAJS
**Desarrollado por:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre (UAJS)  
**Versión:** 2.8  
**URL:** https://lecto-ruta.vercel.app  

---

## 1. DESCRIPCIÓN DE LA OBRA

LectoRuta Saber es una **plataforma educativa web interactiva** diseñada para fortalecer las competencias de lectura crítica en estudiantes de grados 10° y 11°, preparándolos para las pruebas Saber 11. El software fue desarrollado usando **Next.js 16**, **React 19**, **TypeScript**, **TailwindCSS 4**, **MongoDB** y **Mongoose**.

---

## 2. PROCESO CREATIVO Y RECURSOS UTILIZADOS

### 2.1 Edición de Imágenes PNG (Carrusel de Bienvenida)

Para la página principal se crearon 4 imágenes promocionales en formato PNG que se muestran en un carrusel automático. Estas imágenes fueron diseñadas mediante **edición fotográfica digital** combinando:

- **Fotografías de estudiantes y docentes** en entornos educativos (obtenidas de bancos de imágenes libres y adaptadas al contexto institucional)
- **Logotipo institucional** de la Corporación Universitaria Antonio José de Sucre
- **Elementos gráficos personalizados** como fondos degradados, íconos educativos, y tipografía institucional
- **Paleta de colores institucional** de la UAJS

**Herramienta utilizada:** Adobe Photoshop / GIMP (editor de imágenes de código abierto)

**Proceso de edición:**
1. Selección de fotografías base de estudiantes en ambientes académicos
2. Recorte y aislamiento de figuras principales (técnica de máscara de capa)
3. Ajuste de iluminación, contraste y saturación para uniformidad visual
4. Inserción de elementos gráficos (íconos de libros, estrellas, rutas)
5. Composición con tipografía institucional y mensajes educativos
6. Exportación en formato PNG con transparencia para integración web

**Archivos generados:**
| Archivo | Descripción |
|---------|-------------|
| `/public/images/carousel-1.png` | "Aprende leyendo con tus docentes" |
| `/public/images/carousel-2.png` | "Fortalece tu lectura crítica" |
| `/public/images/carousel-3.png` | "Lectura crítica: simulacros SABER" |
| `/public/images/carousel-4.png` | "Realiza pruebas de lectura crítica" |
| `/public/images/logo-uajs-horizontal.png` | Logotipo UAJS horizontal |
| `/public/images/logo-uajs-vertical.jpg` | Logotipo UAJS vertical |
| `/public/images/lectura-critica-info.png` | Infografía de lectura crítica |
| `/public/images/reading-levels.png` | Niveles de lectura |
| `/public/images/uajs-footer.png` | Pie de página institucional |

### 2.2 Audio de Bienvenida con ElevenLabs

Para la experiencia de primer ingreso, se implementó un **audio de bienvenida personalizado** generado mediante **inteligencia artificial de voz** a través de la plataforma **ElevenLabs**.

**Proceso de creación:**
1. Redacción del guion de bienvenida institucional (texto personalizado)
2. Uso de **ElevenLabs** (https://elevenlabs.io) para generación de voz sintética
3. Selección de una voz femenina profesional con tono cálido y educativo
4. Ajuste de parámetros de entonación, velocidad y estabilidad
5. Exportación del audio en formato MP3

**Texto del guion de bienvenida:**
> "Bienvenido a LectoRuta Saber, la plataforma educativa oficial de la Corporación Universitaria Antonio José de Sucre. Aquí fortalecerás tus habilidades de lectura crítica para las pruebas Saber 11. ¡Comienza tu viaje de aprendizaje ahora!"

**Archivo generado:**
| Archivo | Descripción |
|---------|-------------|
| `/public/audio/welcome-audio.mp3` | Mensaje de bienvenida con voz AI de ElevenLabs |

**Implementación técnica en el código:**
El audio se reproduce mediante el componente `WelcomeAudio` (`components/welcome-audio.tsx`), que:
- Muestra un modal animado al cargar la página por primera vez
- Pregunta al usuario si desea reproducir el audio de bienvenida
- Usa localStorage para recordar si ya se reprodujo
- Incluye controles flotantes de reproducción, pausa y silencio

### 2.3 Stack Tecnológico Utilizado

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.1.6 | Framework web React |
| React | 19 | Librería de interfaz de usuario |
| TypeScript | 5 | Lenguaje de programación |
| TailwindCSS | 4 | Estilos y diseño responsive |
| MongoDB Atlas | 6+ | Base de datos en la nube |
| Mongoose | 8.9.3 | ODM para MongoDB |
| Framer Motion | 12 | Animaciones UI |
| shadcn/ui | - | Componentes de interfaz |
| bcryptjs | 2.4.3 | Encriptación de contraseñas |
| ElevenLabs | - | Generación de voz AI |
| Adobe Photoshop | - | Edición de imágenes |

---

## 3. ESTRUCTURA DEL SOFTWARE

```
LectoRutaSaber/
├── app/                    # Rutas y páginas Next.js
│   ├── api/               # API REST (login, CRUD, talleres)
│   ├── dashboard/         # Paneles: admin, estudiante, docente
│   └── page.tsx           # Página principal con carrusel y audio
├── components/            # Componentes React
│   ├── auth/             # Inicio de sesión
│   ├── dashboard/        # Paneles de control
│   └── ui/              # Componentes shadcn/ui
├── lib/                  # Lógica de negocio y BD
└── public/              # Archivos estáticos
    ├── audio/           # Audio de bienvenida (ElevenLabs)
    └── images/          # Imágenes editadas (PNG)
```

---

## 4. DECLARACIÓN DE ORIGINALIDAD

Declaro que todos los elementos descritos en este documento:
1. Las **imágenes PNG editadas** son composiciones originales realizadas mediante técnicas de edición fotográfica digital
2. El **audio de bienvenida** fue generado específicamente para esta plataforma usando ElevenLabs
3. El **código fuente** del software fue desarrollado íntegramente por el autor
4. Los **logotipos institucionales** pertenecen a la Corporación Universitaria Antonio José de Sucre (UAJS) y se usan con fines educativos

---

**Firma:** ___________________________

**Nombre:** Alejandro Montes Pimienta  
**Fecha:** Mayo 2026  
**Ciudad:** Sincelejo, Sucre, Colombia  

---

*Documento generado como soporte para el registro de derechos de autor ante la Dirección Nacional de Derecho de Autor (DNDA) de Colombia.*
