# TABLERO TRELLO - Lectoruta Saber

**Proyecto:** Implementación de Gestión de Proyectos TI en LectoRuta Saber  
**Enlace Público del Tablero:** [Crear tablero en https://trello.com y compartir enlace]
**Fecha de Creación:** Mayo 2026

---

## Estructura del Tablero

### Lista 1: 📋 PENDIENTES (Backlog)

| # | Tarjeta | Responsable | Fecha Límite | Etiqueta |
|---|---------|-------------|-------------|----------|
| 1 | Analizar requisitos del módulo de gestión de proyectos | Alejandro Montes | 23/05/2026 | 📝 Análisis |
| 2 | Identificar riesgos del proyecto (mín 5) | Alejandro Montes | 28/05/2026 | ⚠️ Riesgos |
| 3 | Elaborar matriz de riesgos formal | Alejandro Montes | 31/05/2026 | ⚠️ Riesgos |
| 4 | Diseñar diagrama de Gantt con dependencias | Analista Proyectos | 02/06/2026 | 📊 Planificación |
| 5 | Configurar tablero Trello con listas y tarjetas | Analista Proyectos | 04/06/2026 | 🎯 Seguimiento |
| 6 | Implementar middleware de protección de rutas Next.js | Desarrollador Backend | 14/06/2026 | 🔒 Seguridad |
| 7 | Configurar cookies con Secure, HttpOnly y SameSite | Desarrollador Full Stack | 15/06/2026 | 🔒 Seguridad |
| 8 | Implementar backups automatizados con mongodump | Administrador BD | 18/06/2026 | 🗄️ BD |
| 9 | Crear índices compuestos en MongoDB para optimizar consultas | Desarrollador Backend | 22/06/2026 | 🗄️ BD |
| 10 | Migrar plataforma a hosting cloud (Vercel/Railway) | DevOps | 28/06/2026 | ☁️ Infraestructura |
| 11 | Documentar API endpoints y arquitectura del sistema | Alejandro Montes | 30/06/2026 | 📖 Documentación |
| 12 | Realizar pruebas de seguridad y penetración | Desarrollador Full Stack | 03/07/2026 | 🧪 Testing |
| 13 | Capacitar a docentes en uso de la plataforma | Alejandro Montes | 08/07/2026 | 📚 Capacitación |
| 14 | Despliegue final y cierre del proyecto | Todo el equipo | 12/07/2026 | 🚀 Despliegue |

---

### Lista 2: 🔄 EN PROCESO (In Progress)

| # | Tarjeta | Responsable | Fecha Límite | Descripción |
|---|---------|-------------|-------------|-------------|
| 1 | *(Aquí se mueven las tarjetas cuando se empiezan a trabajar)* | - | - | - |

---

### Lista 3: ✅ FINALIZADAS (Done)

| # | Tarjeta | Responsable | Fecha Completada | Evidencia |
|---|---------|-------------|-----------------|-----------|
| 1 | *(Aquí se mueven las tarjetas completadas)* | - | - | - |

---

## Instrucciones para Configurar el Tablero en Trello

### Paso 1: Crear el tablero
1. Ir a [https://trello.com](https://trello.com) e iniciar sesión
2. Click en **"Crear tablero"**
3. Nombre: **"Lectoruta - Gestión de Proyectos TI"**
4. Seleccionar fondo de color (recomendado: púrpura institucional)
5. Click en **"Crear"**

### Paso 2: Crear las listas
1. Click en **"Añadir otra lista"** y crear:
   - `📋 Pendientes (Backlog)`
   - `🔄 En Proceso (In Progress)`
   - `✅ Finalizadas (Done)`

### Paso 3: Crear las tarjetas
Para cada tarjeta de la lista **Pendientes**:
1. Click en **"Añadir una tarjeta"**
2. Escribir el título de la tarjeta
3. Click en la tarjeta para abrirla y añadir:
   - **Descripción**: Detalle de la tarea a realizar
   - **Miembros**: Asignar responsable
   - **Fecha de vencimiento**: Fecha límite
   - **Etiquetas**: Crear etiquetas de colores por categoría
   - **Lista de verificación**: Subtareas

### Paso 4: Crear etiquetas por categoría

| Etiqueta | Color | Descripción |
|----------|-------|-------------|
| 📝 Análisis | Azul | Tareas de análisis y requisitos |
| ⚠️ Riesgos | Rojo | Gestión de riesgos |
| 📊 Planificación | Verde | Cronograma y planificación |
| 🎯 Seguimiento | Amarillo | Herramientas de seguimiento |
| 🔒 Seguridad | Naranja | Seguridad del sistema |
| 🗄️ BD | Púrpura | Base de datos |
| ☁️ Infraestructura | Cian | Cloud y servidores |
| 📖 Documentación | Gris | Documentación técnica |
| 🧪 Testing | Verde lima | Pruebas |
| 📚 Capacitación | Rosa | Capacitación usuarios |
| 🚀 Despliegue | Azul oscuro | Despliegue y cierre |

### Paso 5: Compartir el tablero
1. Click en el botón **"Compartir"** en la parte superior del tablero
2. Activar **"Poner el tablero visible para" → "Cualquier persona con el enlace"**
3. Copiar el enlace generado
4. Pegar el enlace en la sección superior de este documento y en el PDF final

---

## Capturas de Pantalla Recomendadas para el Entregable

Para el informe PDF, incluir las siguientes capturas:

1. **Vista general del tablero** - Mostrando las 3 listas (Pendientes, En Proceso, Finalizadas) con al menos 5 tarjetas visibles
2. **Detalle de una tarjeta** - Mostrando: descripción, responsable asignado, fecha límite, etiqueta y lista de verificación
3. **Vista de calendario** - Trello Power-Up de calendario mostrando las fechas de vencimiento
4. **Vista de miembros** - Mostrando la asignación de responsables

---

## Ejemplo de Tarjeta Completa

### Tarjeta: "Implementar middleware de protección de rutas Next.js"

**Descripción:**
```
Implementar middleware en Next.js para proteger las rutas del dashboard 
(estudiante, docente, admin) y las API routes.

Requisitos:
- Crear archivo middleware.ts en la raíz
- Verificar token JWT en cada request
- Redirigir a login si no hay sesión válida
- Separar permisos por rol (student/teacher/admin)
- Proteger rutas API sensibles
```

**Lista de verificación:**
- [x] Analizar rutas actuales no protegidas
- [x] Crear middleware.ts con lógica de autenticación
- [ ] Probar redirección para usuarios no autenticados
- [ ] Probar separación de roles
- [ ] Documentar en MANUAL_USUARIO.md

**Miembros:** Desarrollador Backend  
**Fecha de vencimiento:** 14/06/2026  
**Etiquetas:** 🔒 Seguridad

---

## Seguimiento Semanal

| Semana | Fecha | Tareas Completadas | Tareas en Proceso | Observaciones |
|--------|-------|-------------------|-------------------|---------------|
| 1 | 18-23 May | - | A. Análisis requisitos | Inicio del proyecto |
| 2 | 24-31 May | - | B, C, D | Riesgos y planificación |
| 3 | 01-04 Jun | A, B, C, D | E. Tablero Trello | Hitos H1, H2, H3 |
| ... | ... | ... | ... | *(Actualizar semanalmente)* |
| 8 | 06-12 Jul | L, M | N. Despliegue final | Cierre del proyecto |

---

*Documento generado para la actividad de Gestión de Proyectos TI - Mayo 2026*
