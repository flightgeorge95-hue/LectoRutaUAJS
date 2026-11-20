# LectoRuta Saber — Plataforma Educativa UAJS

![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![Pruebas](https://img.shields.io/badge/JMeter-51%2F51%20casos-brightgreen.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

## 📋 Descripción

**LectoRuta Saber** es una plataforma web para fortalecer la lectura crítica de los estudiantes de los grados 10.° y 11.° de la Corporación Universitaria Antonio José de Sucre (UAJS) en su preparación para la prueba Saber 11.

**Desarrollado por:** Alejandro Montes Pimienta y Andrés Lara  
**Institución:** Corporación Universitaria Antonio José de Sucre — UAJS  
**Año:** 2026  
**Plataforma en producción:** https://lecto-ruta.vercel.app (Vercel + MongoDB Atlas)

---

## ✨ Características principales

- 🔐 **Acceso por rol** (estudiante, docente y administrador) con sesión JWT firmada y revocable.
- 📚 **Talleres, exámenes y simulacros** con preguntas clasificadas según las tres competencias de Lectura Crítica del ICFES.
- ✅ **Calificación en el servidor:** el estudiante nunca recibe las respuestas correctas; las preguntas abiertas las califica el docente (0,0 a 5,0).
- 👨‍🏫 **Seguimiento docente** por grado y competencia, con reasignación de talleres vencidos.
- 📊 **Reportes en Excel y PDF** por grado.
- 🎮 **Gamificación:** puntos, niveles, rachas, logros y tabla de clasificación.
- 📖 **Biblioteca ICFES** con recursos publicados por los docentes y asistente de estudio Sofía UAJS.
- 🛠️ **Panel de administración** para gestionar estudiantes y docentes.

---

## 🚀 Inicio rápido

### Requisitos

- Node.js 18.17 o superior
- Una base de datos MongoDB (se usa MongoDB Atlas)

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local a partir de .env.example
MONGODB_URI=mongodb+srv://<usuario>:<clave>@<cluster>/lectosaber
SESSION_SECRET=<clave_larga_y_aleatoria>

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abrir `http://localhost:3000`. Los estudiantes y docentes se registran desde el panel de administración.

Las credenciales de acceso las entrega el administrador de la plataforma; por seguridad no se publican en el repositorio.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Interfaz | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix UI) |
| API | Route Handlers de Next.js |
| Seguridad | JWT HS256 (`jose`) en cookie HttpOnly, sesiones revocables, bcrypt, autorización por rol y método en `proxy.ts` |
| Datos | MongoDB Atlas con Mongoose 8 |
| Reportes | ExcelJS y generación de PDF en el navegador |
| Despliegue | Vercel |
| Pruebas | Apache JMeter 5.6.3 |

---

## 📁 Estructura del proyecto

```
LectoRuta-main/
├── app/                    # Páginas (App Router) y API REST (app/api)
├── components/             # Componentes de interfaz por módulo
├── hooks/                  # Hooks de React
├── lib/                    # Acceso a datos (database.ts) y sesión (session.ts)
├── public/                 # Imágenes y archivos estáticos
├── proxy.ts                # Control de acceso por sesión, rol y método
├── jmeter/                 # Pruebas funcionales, de seguridad y de rendimiento
└── docs/                   # Documentación del proyecto (ver docs/README.md)
```

La documentación está organizada por etapas en [`docs/`](docs/README.md): requerimientos, gestión del proyecto, informe técnico, informe de prácticas, manuales y documentos legales.

---

## 🧪 Pruebas

La carpeta [`jmeter/`](jmeter/README.md) contiene la batería de pruebas con Apache JMeter 5.6.3: 51 casos funcionales y de seguridad, y pruebas de carga, estrés escalonado y pico.

```powershell
.\jmeter\ejecutar-pruebas.ps1 -Prueba todas
```

Última ejecución (19-nov-2026, en producción): 51/51 casos aprobados; carga, estrés (30 usuarios) y pico sin errores, con percentil 90 de unos 240 ms.

---

## 🔧 Scripts

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Compilación de producción
npm start        # Servidor de producción
npm run lint     # Revisión de código
```

---

## 🐛 Solución de problemas

- **El inicio de sesión tarda unos 20 s y responde "no encontrado":** el cluster gratuito de MongoDB Atlas se pausa por inactividad. Reanúdalo desde la consola de Atlas.
- **Error de configuración en producción:** verifica que `MONGODB_URI` y `SESSION_SECRET` estén definidas en Vercel → Settings → Environment Variables.
- **El servidor local no inicia:** borra `node_modules` y `.next`, ejecuta `npm install` y vuelve a intentarlo.

Consulta el [Manual de Usuario](docs/05-manuales/MANUAL_USUARIO.md) para más detalles.

---

## 📞 Soporte

**Desarrolladores:** Alejandro Montes Pimienta y Andrés Lara  
**Institución:** Corporación Universitaria Antonio José de Sucre — UAJS  
**Email:** alejandro.montes.pimienta@gmail.com

---

## 📄 Licencia

© 2026 Alejandro Montes Pimienta y Andrés Lara — Corporación Universitaria Antonio José de Sucre (UAJS).  
Todos los derechos reservados. No está permitida su distribución, modificación o uso comercial sin autorización expresa.
