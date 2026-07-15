# Estado del Proyecto - LectoRuta Saber v3.1

## Información General
**Última actualización:** Marzo 2026  
**Nivel de completitud:** 100% (funcionalidades core)  
**Versión:** 3.1  
**Desarrollador:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre - UAJS

---

## Funcionalidades Implementadas

### Sistema de Autenticación
- Autenticación por cédula + contraseña para docentes
- Autenticación por tarjeta de identidad para estudiantes
- Sesiones con JWT firmado (HS256, librería `jose`) en cookies httpOnly — el token se verifica criptográficamente en el middleware (`proxy.ts`), una cookie manipulada se rechaza
- Contraseñas con hash bcrypt
- Separación completa de roles (Estudiante/Docente/Admin)
- Registro de intentos de login

### Seguridad de Calificaciones
- Las preguntas enviadas al estudiante NO incluyen la respuesta correcta ni la explicación (se eliminan en el servidor)
- La calificación se calcula 100% en el servidor (`/api/workshops/complete`): el cliente solo envía qué opción eligió
- La identidad del estudiante se toma de la sesión firmada, no del cuerpo de la petición (un estudiante no puede enviar resultados a nombre de otro)
- La respuesta correcta y su explicación se revelan al estudiante solo DESPUÉS de finalizar el taller (retroalimentación pedagógica)

### Asistente de Estudio "Sofía UAJS"
- Asistente flotante en el dashboard del estudiante
- Consejo del día (rotación diaria determinista)
- Banco de estrategias curadas por las 3 competencias ICFES de Lectura Crítica + consejos para el día de la prueba

### Dashboard de Estudiantes
- Estadísticas en tiempo real desde MongoDB (puntos, nivel, talleres completados)
- Sistema de insignias dinámicas (se desbloquean según progreso real)
- Niveles de lectura crítica (Literal, Inferencial, Crítica) con barras de progreso
- Sección de talleres asignados por el docente
- Actividad reciente con historial de talleres completados
- Biblioteca ICFES 2026 (tips, videos, guías de docentes)
- Simulacro ICFES rápido
- Tema claro/oscuro consistente

### Dashboard de Docentes
- Panel de estadísticas generales (estudiantes, promedios, talleres)
- Gestión de estudiantes por grado (10° y 11°)
- Creación y asignación de talleres personalizados con banco de preguntas
- Publicación de recursos ICFES (tips, videos YouTube, guías, imágenes)
- Exportación de reportes PDF (individual y grupal)
- Visualización de progreso por estudiante

### Sistema de Talleres
- Creación de talleres con preguntas de selección múltiple y abiertas
- Asignación a estudiantes específicos por grado
- Resolución interactiva con retroalimentación inmediata
- Pantalla de recompensas tipo Duolingo (confetti, animaciones, puntos)
- Guardado de resultados en MongoDB (respuestas, puntaje, tiempo)
- Acumulación de puntos y subida de nivel automática

### Biblioteca ICFES 2026
- Feed de recursos publicados por docentes
- Tipos: Tips/artículos, Videos YouTube embebidos, Guías, Imágenes
- Filtros por tipo de contenido
- Sistema de likes y favoritos para estudiantes
- Categorías: Lectura Crítica, Estrategias ICFES, Comprensión Lectora, etc.

### Gamificación
- Sistema de puntos acumulativos
- Niveles calculados automáticamente
- 6 insignias desbloqueables por logros
- Tabla de clasificación (leaderboard)
- Pantalla de celebración al completar talleres

### Interfaz de Usuario
- Diseño responsivo (desktop + mobile)
- Tema claro/oscuro con paleta púrpura institucional
- Animaciones profesionales (slide-up, float, shimmer loading)
- Navbar integrada con navegación por pill animada
- Audio de bienvenida local (Speech Synthesis)
- Toasts de notificación para feedback al usuario

### Páginas Institucionales
- Página principal con carrusel de imágenes
- Quiénes Somos
- Misión y Visión
- Principios y Valores

---

## Arquitectura Técnica

### Stack Tecnológico
- **Frontend:** Next.js 16.1.6, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes (REST)
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT + bcryptjs
- **UI Components:** shadcn/ui + Radix UI
- **Animaciones:** Framer Motion + CSS Animations
- **Gráficos:** Recharts
- **Exportación:** docx (Word), PDF

### Estructura de Base de Datos (MongoDB)
- `students` - Datos de estudiantes
- `teachers` - Datos de docentes
- `workshops` - Talleres creados
- `questions` - Preguntas de talleres
- `student_progress` - Respuestas individuales
- `workshop_completions` - Talleres completados
- `resources` - Publicaciones de la Biblioteca ICFES
- `sessions` - Sesiones activas
- `login_attempts` - Registro de accesos

---

## Mejoras Futuras Sugeridas

### Prioridad Alta
- Protección de rutas con middleware (actualmente todas las rutas son públicas)
- Separación de localStorage entre roles (docente y estudiante)
- Reportes PDF con datos reales de MongoDB
- Validación de sesión en APIs protegidas

### Prioridad Media
- Asistente virtual Sofía con IA (chatbot)
- Notificaciones en tiempo real al asignar talleres
- Editor de talleres existentes
- Banco de preguntas reutilizable entre talleres
- Exportación de resultados a Excel

### Prioridad Baja
- App móvil nativa (iOS/Android)
- Módulo de colaboración entre estudiantes
- Integración con Google Classroom
- Análisis predictivo con Machine Learning
