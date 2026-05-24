# LectoRuta Saber - Plataforma Educativa UAJS

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.17.0-green.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

## 📋 Descripción

**LectoRuta Saber** es una plataforma educativa interactiva desarrollada para la Corporación Universitaria Antonio José de Sucre (UAJS) con el objetivo de mejorar las competencias de lectura crítica y comprensión lectora en estudiantes de grados 10° y 11°.

**Desarrollado por:** Alejandro Montes Pimienta  y Andres Lara
**Institución:** Corporación Universitaria Antonio José de Sucre - UAJS  
**Año:** 2025

---

## ✨ Características Principales

- 🔐 **Sistema de autenticación seguro** para estudiantes y docentes
- 📚 **Talleres interactivos** de lectura crítica con múltiples niveles
- 🎮 **Gamificación completa**: logros, insignias, tabla de clasificación
- 👨‍🏫 **Panel administrativo** para docentes con seguimiento detallado
- 📊 **Reportes académicos en PDF** con estándares APA
- 🗄️ **Base de datos MongoDB** con gestión dinámica de contenido
- 📈 **Análisis de competencias** y áreas de mejora
- 🎯 **Asignación de talleres personalizada** por grado y estudiante

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18.17 o superior
- MongoDB 6.0 o superior
- npm 9.0 o superior

### Instalación

\`\`\`bash
# 1. Extraer el proyecto
cd LectoRutaSaber

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local con:
MONGODB_URI=mongodb://localhost:27017/lectosaber
SESSION_SECRET=tu_clave_secreta_aqui

# 4. Iniciar el servidor de desarrollo
npm run dev

# 5. Inicializar la base de datos
# Visita: http://localhost:3000/api/init-db
\`\`\`

### Acceder a la Aplicación

Abre tu navegador y visita: `http://localhost:3000`

---

## 📖 Documentación Completa

Para instrucciones detalladas de instalación, configuración y uso, consulta el **[Manual de Usuario](MANUAL_USUARIO.md)**.

El manual incluye:
- Requerimientos del sistema completos
- Instalación paso a paso de todas las dependencias
- Configuración detallada de MongoDB
- Guías de uso para estudiantes, docentes y administradores
- Solución de problemas comunes
- Información de contacto y soporte

---

## 🔑 Credenciales Demo

### Estudiantes (solo requieren Tarjeta de Identidad):
- `1098765432` - Luis Pérez (Grado 11°)
- `1098765433` - Sofía López (Grado 11°)
- `1098765434` - Carlos Ramírez (Grado 10°)
- `1098765435` - Ana Martínez (Grado 10°)

### Docentes (requieren Cédula y Contraseña):
- Cédula: `48234567` | Contraseña: `LectoSaber2025!` - Patricia Díaz Mendoza
- Cédula: `52651850` | Contraseña: `LectoSaber2025!` - Carlos Ramírez López
- Cédula: `40123456` | Contraseña: `LectoSaber2025!` - Ana María Torres

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes, Node.js
- **Base de Datos:** MongoDB 6.0
- **Autenticación:** Cookies HTTP-only con bcrypt
- **UI Components:** shadcn/ui (Radix UI)
- **Generación PDF:** jsPDF con jsPDF-AutoTable
- **Audio:** Web Speech API + archivos locales

---

## 📁 Estructura del Proyecto

\`\`\`
LectoRutaSaber/
├── app/                    # Aplicación Next.js
│   ├── api/               # Endpoints de API
│   ├── dashboard/         # Dashboards (estudiantes y docentes)
│   └── ...
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y configuración
├── public/               # Archivos estáticos
├── scripts/              # Scripts auxiliares
└── MANUAL_USUARIO.md     # Documentación completa
\`\`\`

---

## 🔧 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Verifica código con ESLint
\`\`\`

---

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
\`\`\`bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community@6.0

# Linux
sudo systemctl start mongod
\`\`\`

### Error 401 en login
1. Verifica que MongoDB esté corriendo
2. Reinicializa la base de datos: `http://localhost:3000/api/init-db`
3. Verifica las credenciales en MongoDB Compass

### El servidor no inicia
\`\`\`bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
\`\`\`

Consulta el [Manual de Usuario](MANUAL_USUARIO.md) para más soluciones.

---

## 📞 Soporte

**Desarrollador:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre - UAJS  
**Email:** [Tu correo electrónico]

---

## 📄 Licencia

© 2025 Alejandro Montes Pimienta - Corporación Universitaria Antonio José de Sucre (UAJS)  
Todos los derechos reservados.

Este software es propiedad exclusiva de su autor y la institución UAJS. No está permitida su distribución, modificación o uso comercial sin autorización expresa.

---

## 🙏 Agradecimientos

- Corporación Universitaria Antonio José de Sucre (UAJS)
- Estudiantes y docentes que participaron en las pruebas
- Comunidad de código abierto por las herramientas utilizadas

---

**Desarrollado con ❤️ para mejorar la educación en Colombia**
