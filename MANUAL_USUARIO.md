# Manual de Usuario - LectoRuta Saber
## Plataforma Educativa UAJS

**Desarrollado por:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre - UAJS  
**Versión:** 3.1  
**Fecha:** Marzo 2026

---

## Tabla de Contenidos

1. [Descripción del Sistema](#descripción-del-sistema)
2. [Requerimientos del Sistema](#requerimientos-del-sistema)
3. [Instalación](#instalación)
4. [Configuración de MongoDB](#configuración-de-mongodb)
5. [Primer Uso](#primer-uso)
6. [Manual de Usuario - Estudiantes](#manual-de-usuario-estudiantes)
7. [Manual de Usuario - Docentes](#manual-de-usuario-docentes)
8. [Manual de Usuario - Administrador](#manual-de-usuario-administrador)
9. [Solución de Problemas](#solución-de-problemas)
10. [Soporte y Contacto](#soporte-y-contacto)

---

## Descripción del Sistema

**LectoRuta Saber** es una plataforma educativa interactiva diseñada para mejorar las competencias de lectura crítica y comprensión lectora en estudiantes de grados 10° y 11°. La plataforma ofrece:

### Características Principales

- **Sistema de Autenticación Seguro**: Acceso diferenciado para estudiantes y docentes
- **Talleres Interactivos**: Ejercicios de lectura crítica con diferentes niveles de dificultad
- **Gamificación**: Sistema de logros, insignias y tabla de clasificación
- **Gestión Académica**: Panel administrativo para docentes con seguimiento de progreso
- **Banco de Preguntas Dinámico**: Base de datos de preguntas actualizable
- **Reportes Académicos**: Generación de informes en formato PDF con estándares APA
- **Análisis de Competencias**: Identificación de fortalezas y áreas de mejora

---

## Requerimientos del Sistema

### Requisitos de Hardware

- **Procesador:** Intel Core i3 o superior (recomendado: i5 o superior)
- **Memoria RAM:** Mínimo 4 GB (recomendado: 8 GB o más)
- **Almacenamiento:** 500 MB de espacio disponible
- **Conexión a Internet:** Banda ancha para uso óptimo

### Requisitos de Software

#### Para Instalación Local:

- **Sistema Operativo:** Windows 10/11, macOS 10.15+, o Linux (Ubuntu 20.04+)
- **Node.js:** Versión 18.17 o superior
- **npm:** Versión 9.0 o superior (incluido con Node.js)
- **MongoDB:** Versión 6.0 o superior
- **Navegador Web:** 
  - Google Chrome 90+ (recomendado)
  - Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+

#### Herramientas Adicionales (Opcionales):

- **MongoDB Compass:** Para administración visual de la base de datos
- **Git:** Para control de versiones (si se trabaja desde repositorio)

---

## Instalación

### Paso 1: Instalar Node.js

1. Visita [https://nodejs.org](https://nodejs.org)
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo una terminal y ejecutando:

\`\`\`bash
node --version
npm --version
\`\`\`

Deberías ver las versiones instaladas (ejemplo: v18.17.0 y 9.6.7)

### Paso 2: Instalar MongoDB

#### En Windows:

1. Visita [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Descarga MongoDB Community Server
3. Ejecuta el instalador
4. Durante la instalación:
   - Selecciona "Complete" installation
   - Marca "Install MongoDB as a Service"
   - Deja el puerto por defecto (27017)
5. Verifica la instalación:

\`\`\`bash
mongo --version
\`\`\`

#### En macOS:

\`\`\`bash
# Usando Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
\`\`\`

#### En Linux (Ubuntu):

\`\`\`bash
# Importar la clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Crear archivo de lista
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar el servicio
sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

### Paso 3: Instalar MongoDB Compass (Opcional pero Recomendado)

1. Visita [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Descarga la versión para tu sistema operativo
3. Instala siguiendo las instrucciones del instalador
4. Abre MongoDB Compass y conecta a `mongodb://localhost:27017`

### Paso 4: Descargar el Proyecto

Extrae el archivo ZIP del proyecto en la ubicación deseada, por ejemplo:
- Windows: `C:\Proyectos\LectoRutaSaber`
- macOS/Linux: `~/Proyectos/LectoRutaSaber`

### Paso 5: Instalar Dependencias del Proyecto

Abre una terminal en la carpeta del proyecto y ejecuta:

\`\`\`bash
# Navegar a la carpeta del proyecto
cd ruta/a/LectoRutaSaber

# Instalar todas las dependencias
npm install
\`\`\`

Este proceso puede tardar varios minutos. Espera hasta ver el mensaje "added X packages".

### Paso 6: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

\`\`\`env
# Conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/lectosaber

# Configuración de Sesión
SESSION_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion

# Entorno de desarrollo
NODE_ENV=development
\`\`\`

**Nota:** Cambia `tu_clave_secreta_aqui_cambiar_en_produccion` por una cadena segura y única.

### Paso 7: Iniciar el Servidor de Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Deberías ver un mensaje similar a:

\`\`\`
✓ Ready in 2.5s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.x:3000
\`\`\`

---

## Configuración de MongoDB

### Opción 1: MongoDB Local (Recomendado para Desarrollo)

#### Paso 1: Verificar Instalación de MongoDB

Abre una terminal y ejecuta:

\`\`\`bash
mongod --version
\`\`\`

Deberías ver la versión instalada (ejemplo: `db version v6.0.x`)

#### Paso 2: Iniciar Servicio de MongoDB

**En Windows:**
\`\`\`bash
net start MongoDB
\`\`\`

**En macOS:**
\`\`\`bash
brew services start mongodb-community@6.0
\`\`\`

**En Linux:**
\`\`\`bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Para que inicie automáticamente
\`\`\`

#### Paso 3: Conectar con MongoDB Compass

MongoDB Compass es la herramienta visual oficial para administrar bases de datos MongoDB.

1. **Descargar MongoDB Compass:**
   - Visita: https://www.mongodb.com/try/download/compass
   - Descarga la versión para tu sistema operativo
   - Instala siguiendo el asistente

2. **Conectar a MongoDB Local:**
   - Abre MongoDB Compass
   - En "New Connection", ingresa la URI:
     \`\`\`
     mongodb://localhost:27017
     \`\`\`
   - Haz clic en **"Connect"**
   - Verás la lista de bases de datos disponibles

#### Paso 4: Inicializar Base de Datos

Con el servidor de desarrollo ejecutándose (`npm run dev`), abre tu navegador y visita:

\`\`\`
http://localhost:3000/api/init-db
\`\`\`

Verás una respuesta JSON confirmando la creación:

\`\`\`json
{
  "success": true,
  "message": "Base de datos inicializada correctamente",
  "studentsCreated": 10,
  "teachersCreated": 3
}
\`\`\`

#### Paso 5: Verificar Datos en MongoDB Compass

1. En MongoDB Compass, actualiza la conexión (botón de refrescar)
2. Haz clic en la base de datos **`lectosaber`**
3. Verás las siguientes colecciones:
   - **`students`** (10 documentos)
   - **`teachers`** (3 documentos)
   - **`workshops`** (vacío inicialmente)
   - **`questions`** (vacío inicialmente)
   - **`studentprogresses`** (vacío inicialmente)
   - **`workshopcompletions`** (vacío inicialmente)

4. **Explorar colección de estudiantes:**
   - Haz clic en `students`
   - Verás documentos como:
     \`\`\`json
     {
       "_id": "ObjectId('...')",
       "firstName": "Luis Enrique",
       "lastName": "Pérez González",
       "grade": 11,
       "tarjetaIdentidad": "1098765432",
       "password": "$2a$10$...",  // Encriptada con bcrypt
       "email": "luis.perez@estudiante.uajs.edu.co",
       "phoneNumber": "3001234567",
       "points": 0,
       "level": 1
     }
     \`\`\`

5. **Explorar colección de docentes:**
   - Haz clic en `teachers`
   - Verás documentos como:
     \`\`\`json
     {
       "_id": "ObjectId('...')",
       "firstName": "Patricia",
       "lastName": "Díaz Mendoza",
       "cedula": "48234567",
       "password": "$2a$10$...",  // Encriptada con bcrypt
       "email": "patricia.diaz@docente.uajs.edu.co",
       "institution": "Corporación Universitaria Antonio José de Sucre",
       "subject": "Lengua Castellana",
       "gradesTeaching": [10, 11]
     }
     \`\`\`

### Opción 2: MongoDB Atlas (Nube - Para Producción)

MongoDB Atlas es el servicio de base de datos en la nube oficial de MongoDB.

#### Ventajas:
- Respaldos automáticos
- Escalabilidad
- Acceso desde cualquier lugar
- Plan gratuito disponible (512 MB)

#### Paso 1: Crear Cuenta en MongoDB Atlas

1. Visita: https://www.mongodb.com/cloud/atlas/register
2. Regístrate con correo electrónico o cuenta de Google
3. Verifica tu correo electrónico

#### Paso 2: Crear un Cluster

1. Haz clic en **"Build a Database"**
2. Selecciona **"Free"** (M0 Sandbox)
3. Elige el proveedor de nube y región:
   - **AWS** o **Google Cloud**
   - **Región:** Elige la más cercana (ejemplo: `São Paulo` para Latinoamérica)
4. Nombra tu cluster: `LectoSaber-Cluster`
5. Haz clic en **"Create"**

#### Paso 3: Configurar Acceso

1. **Crear Usuario de Base de Datos:**
   - Usuario: `lectosaber_admin`
   - Contraseña: `[Genera una contraseña segura]` (guárdala)
   - Haz clic en **"Create User"**

2. **Configurar IP Whitelist:**
   - Opción 1 (Desarrollo): Haz clic en **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Opción 2 (Producción): Agrega solo las IPs específicas de tu servidor
   - Haz clic en **"Add Entry"**

3. Haz clic en **"Finish and Close"**

#### Paso 4: Obtener URI de Conexión

1. En el dashboard, haz clic en **"Connect"** en tu cluster
2. Selecciona **"Connect your application"**
3. Copia la URI de conexión:
   \`\`\`
   mongodb+srv://lectosaber_admin:<password>@lectosaber-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   \`\`\`
4. Reemplaza `<password>` con la contraseña que creaste
5. Agrega el nombre de la base de datos después del `/`:
   \`\`\`
   mongodb+srv://lectosaber_admin:TuContraseña@lectosaber-cluster.xxxxx.mongodb.net/lectosaber?retryWrites=true&w=majority
   \`\`\`

#### Paso 5: Configurar en el Proyecto

Edita el archivo `.env.local` en la raíz del proyecto:

\`\`\`env
# Comentar la URI local
# MONGODB_URI=mongodb://localhost:27017/lectosaber

# Agregar URI de Atlas
MONGODB_URI=mongodb+srv://lectosaber_admin:TuContraseña@lectosaber-cluster.xxxxx.mongodb.net/lectosaber?retryWrites=true&w=majority

SESSION_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion
\`\`\`

#### Paso 6: Reiniciar Servidor e Inicializar

\`\`\`bash
# Detener el servidor (Ctrl + C)
# Iniciar nuevamente
npm run dev

# Inicializar base de datos en Atlas
# Visita: http://localhost:3000/api/init-db
\`\`\`

#### Paso 7: Verificar en MongoDB Compass

1. Abre MongoDB Compass
2. Conecta usando la misma URI de Atlas:
   \`\`\`
   mongodb+srv://lectosaber_admin:TuContraseña@lectosaber-cluster.xxxxx.mongodb.net/lectosaber
   \`\`\`
3. Verás la base de datos `lectosaber` con todas las colecciones

---

## Primer Uso

### Acceso al Sistema

1. Abre tu navegador web
2. Visita `http://localhost:3000`
3. Verás la página principal de LectoRuta Saber

### Navegación Inicial

La página principal incluye:
- **Bienvenida con audio**: Se reproduce automáticamente al cargar
- **Menú de navegación**: Acceso a Inicio, Quiénes Somos, Misión y Visión, Principios y Valores
- **Botón de Ingreso**: Para acceder al sistema de autenticación

---

## Manual de Usuario - Estudiantes

### Inicio de Sesión

1. Haz clic en el botón **"Ingresar"** en la página principal
2. Selecciona la pestaña **"Estudiante"**
3. Ingresa tu **Tarjeta de Identidad** (ejemplo: 1098765432)
4. Haz clic en **"Iniciar Sesión"**
5. Verás un mensaje de bienvenida con tu nombre

### Dashboard del Estudiante

Al ingresar, verás tu panel personalizado con:

#### 1. Información Personal
- Nombre completo
- Grado
- Progreso general

#### 2. Estadísticas Principales
- **Talleres Completados**: Cantidad de talleres finalizados
- **Promedio General**: Tu calificación promedio
- **Racha Actual**: Días consecutivos de actividad
- **Logros Desbloqueados**: Insignias obtenidas

#### 3. Sección de Talleres Disponibles

##### Tipos de Talleres:
- **Lectura Crítica**: Análisis y comprensión de textos
- **Argumentación**: Construcción de argumentos
- **Inferencias**: Identificación de ideas implícitas

##### Estados de Talleres:
- **No Iniciado**: Talleres disponibles para empezar
- **En Progreso**: Talleres comenzados pero no terminados
- **Completado**: Talleres finalizados con calificación

#### 4. Tabla de Clasificación

Compite con tus compañeros viendo:
- Posición en el ranking
- Puntos totales
- Talleres completados
- Promedio de calificación

#### 5. Logros y Gamificación

##### Categorías de Logros:
- **Novato**: Primeros pasos (completar primer taller)
- **Principiante**: Completar 5 talleres
- **Intermedio**: Completar 10 talleres
- **Avanzado**: Completar 20 talleres
- **Experto**: Completar 50 talleres
- **Maestro**: Perfección en múltiples talleres

##### Insignias Especiales:
- **Racha de Fuego**: Mantener actividad por 7 días consecutivos
- **Perfeccionista**: Obtener 100% en un taller
- **Constante**: Practicar 30 días seguidos

### Realizar un Taller

1. En el dashboard, busca la sección **"Talleres Disponibles"**
2. Selecciona un taller haciendo clic en **"Comenzar"** o **"Continuar"**
3. Lee cuidadamente el texto presentado
4. Responde las preguntas:
   - **Selección Múltiple**: Elige la opción correcta
   - **Preguntas Abiertas**: Escribe tu respuesta con argumentos

5. **Navegación durante el taller**:
   - **Anterior**: Volver a la pregunta previa
   - **Siguiente**: Avanzar a la siguiente pregunta
   - **Finalizar**: Enviar respuestas y obtener calificación

6. **Recibir retroalimentación**:
   - Calificación obtenida
   - Respuestas correctas e incorrectas
   - Explicaciones detalladas
   - Áreas de mejora

### Ver Progreso Individual

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona **"Mi Progreso"**
3. Visualiza:
   - Gráfica de progreso temporal
   - Talleres completados por categoría
   - Fortalezas identificadas
   - Áreas de mejora
   - Historial de calificaciones

### Descargar Certificados

1. Completa un taller con calificación superior a 80%
2. En el dashboard, busca el taller completado
3. Haz clic en **"Descargar Certificado"**
4. Se generará un PDF con:
   - Tu nombre y datos
   - Nombre del taller
   - Calificación obtenida
   - Fecha de completación
   - Firma digital de UAJS

### Cerrar Sesión

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**
3. Confirma la acción

---

## Manual de Usuario - Docentes

### Inicio de Sesión

1. Desde la página principal, haz clic en **"Acceder como Docente"**
2. Ingresa tu **Cédula** (ejemplo: 48234567)
3. Ingresa tu **Contraseña** (ejemplo: LectoSaber2025!)
4. Haz clic en **"Acceder al Panel"**

> **Credenciales de prueba disponibles:**
> - Patricia Díaz: Cédula `48234567` / Contraseña `LectoSaber2025!`
> - Carlos Ramírez: Cédula `52651850` / Contraseña `LectoSaber2025!`
> - Ana Torres: Cédula `40123456` / Contraseña `LectoSaber2025!`

### Dashboard del Docente

Al ingresar, verás tu panel administrativo con las siguientes secciones:

#### 1. Estadísticas Generales
Cuatro tarjetas superiores con métricas en tiempo real:
- **Estudiantes**: Total de estudiantes registrados
- **Promedio general**: Promedio de calificaciones del grupo
- **Talleres completados**: Total de talleres resueltos
- **Requieren atención**: Estudiantes con bajo rendimiento

#### 2. Gestión de Clases por Grado

**Seleccionar Grado:** Usa el selector desplegable para elegir entre Grado 10° y Grado 11°.

Para cada estudiante verás:
- Nombre completo
- Promedio actual con badge de estado (Excelente, Activo, Requiere Atención)
- Talleres completados
- Opción de ver detalles individuales

#### 3. Crear y Asignar Talleres

Haz clic en el botón **"+ Crear y Asignar Taller"** para abrir el diálogo de creación en 3 pasos:

**Paso 1 — Información del Taller:**
- Título descriptivo (ej: "Simulacro ICFES - Textos Argumentativos")
- Descripción del objetivo del taller
- Grado al que va dirigido (10° o 11°)
- Nivel de dificultad (Básico, Intermedio, Avanzado)

**Paso 2 — Agregar Preguntas:**
- Haz clic en "Agregar Pregunta" para añadir preguntas
- Para cada pregunta selecciona:
  - Tipo: Selección múltiple o Pregunta abierta
  - Competencia evaluada (Identificar contenidos, Comprender articulación, Reflexionar críticamente)
  - Texto de referencia (el pasaje que el estudiante debe leer)
  - Enunciado de la pregunta
  - Opciones A, B, C, D (para selección múltiple)
  - Respuesta correcta
  - Explicación de la respuesta (se muestra como retroalimentación)
- Puedes agregar tantas preguntas como necesites

**Paso 3 — Asignar Estudiantes:**
- Se cargan automáticamente los estudiantes del grado seleccionado
- Marca individualmente o usa "Seleccionar todos"
- Haz clic en **"Crear y Asignar Taller"**
- El taller aparecerá inmediatamente en el dashboard de los estudiantes seleccionados

#### 4. Publicar Recursos ICFES (Biblioteca ICFES 2026)

Haz clic en el botón **"Publicar Recurso ICFES"** para compartir contenido educativo con los estudiantes:

**Tipos de contenido:**
- **Tip / Artículo**: Consejos escritos sobre estrategias ICFES, técnicas de lectura, etc.
- **Video YouTube**: Pega la URL del video y se embebe automáticamente en el feed del estudiante
- **Guía**: Documentos o instrucciones detalladas para preparación
- **Imagen informativa**: Infografías, diagramas, resúmenes visuales

**Campos del formulario:**
- Selecciona el tipo de contenido (tip, video, guía, imagen)
- Escribe un título llamativo
- Escribe el contenido/descripción
- Para videos: pega la URL de YouTube (muestra preview en tiempo real)
- Para imágenes: pega la URL de la imagen
- Selecciona categoría (Lectura Crítica, Estrategias ICFES, Comprensión Lectora, Tips de Estudio, Motivación, General)
- Selecciona los grados a los que va dirigido (10°, 11° o ambos)

Los recursos publicados aparecen en la sección **"Biblioteca ICFES 2026"** del dashboard de cada estudiante, donde pueden darle like y guardar en favoritos.

#### 5. Exportar Reportes

**Reporte Individual (PDF):**
1. Selecciona un estudiante de la lista
2. Haz clic en "Generar Reporte PDF"
3. El reporte incluye datos del estudiante, progreso, talleres completados y análisis de competencias

**Reporte Grupal (PDF):**
1. Selecciona un grado
2. Haz clic en "Exportar Grupo"
3. Incluye estadísticas del grupo, comparativa de desempeño y estudiantes destacados

Los reportes siguen el formato APA 7ª edición.

---

## Manual de Usuario - Administrador

### Acceso al Panel Administrativo

Solo usuarios con rol de administrador pueden acceder.

### Gestión de Usuarios

#### Registrar Nuevo Estudiante

1. Ve a **"Administración"** → **"Registrar Usuario"**
2. Selecciona **"Estudiante"**
3. Completa el formulario:

\`\`\`
Nombres: [Nombre(s) del estudiante]
Apellidos: [Apellidos del estudiante]
Tarjeta de Identidad: [Número único de 10 dígitos]
Grado: [Selecciona 10° u 11°]
Correo Electrónico: [Opcional, para notificaciones]
\`\`\`

4. Haz clic en **"Registrar Estudiante"**
5. El estudiante podrá ingresar inmediatamente con su tarjeta de identidad

#### Registrar Nuevo Docente

1. Ve a **"Administración"** → **"Registrar Usuario"**
2. Selecciona **"Docente"**
3. Completa el formulario:

\`\`\`
Nombres: [Nombre(s) del docente]
Apellidos: [Apellidos del docente]
Cédula: [Número de cédula]
Especialidad: [Área de enseñanza]
Correo Electrónico: [Correo institucional]
Contraseña Inicial: [Contraseña temporal]
\`\`\`

4. Haz clic en **"Registrar Docente"**
5. Se recomienda que el docente cambie su contraseña al primer inicio de sesión

#### Editar Usuarios

1. Ve a **"Administración"** → **"Gestionar Usuarios"**
2. Busca el usuario por nombre o documento
3. Haz clic en **"Editar"**
4. Modifica la información necesaria
5. Guarda los cambios

#### Eliminar Usuarios

1. Ve a **"Administración"** → **"Gestionar Usuarios"**
2. Busca el usuario
3. Haz clic en **"Eliminar"**
4. **Confirma la acción** (esta acción es irreversible)

**Nota:** Al eliminar un estudiante, se eliminan también sus progresos y talleres completados.

### Respaldo de Base de Datos

#### Crear Respaldo Manual

1. Abre MongoDB Compass
2. Conéctate a `mongodb://localhost:27017`
3. Selecciona la base de datos `lectosaber`
4. Haz clic en **"…"** (tres puntos) → **"Export Collection"**
5. Selecciona formato JSON
6. Guarda el archivo con la fecha: `lectosaber_backup_2025-11-14.json`

#### Restaurar desde Respaldo

1. Abre MongoDB Compass
2. Conéctate a `mongodb://localhost:27017`
3. Selecciona la base de datos `lectosaber`
4. Haz clic en **"…"** → **"Import Data"**
5. Selecciona el archivo de respaldo
6. Confirma la importación

### Configuración del Sistema

#### Cambiar Puerto del Servidor

Edita el archivo `.env.local`:

\`\`\`env
PORT=3001
\`\`\`

Reinicia el servidor.

#### Actualizar Conexión de MongoDB

Si MongoDB está en un servidor remoto:

\`\`\`env
MONGODB_URI=mongodb://usuario:contraseña@servidor:27017/lectosaber
\`\`\`

---

## Solución de Problemas

### Problema: No se inicia el servidor (npm run dev)

**Síntomas:**
\`\`\`
Error: Cannot find module...
\`\`\`

**Solución:**
\`\`\`bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

---

### Problema: Error de conexión a MongoDB

**Síntomas:**
\`\`\`
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
\`\`\`

**Solución:**

**En Windows:**
\`\`\`bash
# Verificar si MongoDB está corriendo
net start MongoDB

# Si no está iniciado
net start MongoDB
\`\`\`

**En macOS:**
\`\`\`bash
brew services start mongodb-community@6.0
\`\`\`

**En Linux:**
\`\`\`bash
sudo systemctl start mongod
sudo systemctl status mongod
\`\`\`

---

### Problema: Error 401 Unauthorized al iniciar sesión

**Causas posibles:**
1. La base de datos no está inicializada
2. Las credenciales no coinciden

**Solución:**

1. Verifica que MongoDB esté corriendo
2. Reinicializa la base de datos:
   \`\`\`
   http://localhost:3000/api/init-db
   \`\`\`
3. Verifica en MongoDB Compass que existan documentos en `students` y `teachers`
4. Usa las credenciales exactas proporcionadas en este manual

---

### Problema: El audio de bienvenida no se reproduce

**Causa:** El archivo de audio no está en la ubicación correcta.

**Solución:**

1. Verifica que exista el archivo `public/audio/bienvenida.mp3`
2. Si no existe, añade un archivo de audio con ese nombre
3. Alternativamente, el sistema usa Web Speech API como respaldo

---

### Problema: Los talleres no se cargan

**Solución:**

1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica la conexión a MongoDB
4. Asegúrate de que existan talleres en la colección `workshops`

---

### Problema: No se generan los PDFs

**Síntomas:** Error al descargar reportes.

**Solución:**

\`\`\`bash
# Reinstalar dependencias de PDF
npm install jspdf jspdf-autotable
npm run dev
\`\`\`

---

### Problema: Lentitud en el sistema

**Causas:**
- Muchos datos en la base de datos
- Conexión lenta a internet
- Recursos del sistema limitados

**Solución:**

1. **Optimizar MongoDB:**
   - Crear índices en campos frecuentes:
   
\`\`\`javascript
// En MongoDB shell o Compass
db.students.createIndex({ "tarjetaIdentidad": 1 })
db.teachers.createIndex({ "cedula": 1 })
db.workshops.createIndex({ "grado": 1 })
\`\`\`

2. **Limpiar caché del navegador:**
   - Chrome: Ctrl+Shift+Delete → Limpiar datos de navegación

3. **Aumentar recursos:**
   - Cerrar aplicaciones innecesarias
   - Aumentar RAM asignada a MongoDB si está en un contenedor

---

### Problema: Cambios en el código no se reflejan

**Solución:**

\`\`\`bash
# Detener el servidor (Ctrl+C)
# Limpiar caché de Next.js
rm -rf .next
npm run dev
\`\`\`

---

## Soporte y Contacto

### Desarrollador

**Nombre:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre - UAJS  
**Correo:** [Tu correo electrónico]  
**Teléfono:** [Tu teléfono de contacto]

### Repositorio del Proyecto

[Añadir URL del repositorio si aplica]

### Documentación Técnica Adicional

Para desarrolladores que deseen contribuir o modificar el código:

- **Arquitectura del Sistema:** Ver `ARQUITECTURA.md`
- **API Endpoints:** Ver `API_DOCUMENTATION.md`
- **Guía de Contribución:** Ver `CONTRIBUTING.md`

### Registro de Versiones

- **v1.0.0** (Noviembre 2025): Lanzamiento inicial
  - Sistema de autenticación
  - Dashboards para estudiantes y docentes
  - Talleres interactivos
  - Sistema de gamificación
  - Generación de reportes PDF

---

## Glosario de Términos

- **Dashboard:** Panel de control personalizado para cada tipo de usuario
- **Taller:** Conjunto de ejercicios o preguntas sobre un tema específico
- **Competencia:** Habilidad específica evaluada (ej: argumentación, inferencia)
- **Logro:** Reconocimiento obtenido al cumplir ciertos objetivos
- **Racha:** Días consecutivos de actividad en la plataforma
- **MongoDB:** Sistema de base de datos NoSQL utilizado
- **API:** Interfaz de programación de aplicaciones para comunicación entre componentes
- **Gamificación:** Uso de elementos de juego para motivar el aprendizaje

---

## Anexos

### Anexo A: Estructura de Carpetas del Proyecto

\`\`\`
LectoRutaSaber/
├── app/                          # Aplicación Next.js
│   ├── api/                      # Endpoints de API
│   │   ├── auth/                 # Autenticación
│   │   ├── workshops/            # Gestión de talleres
│   │   ├── questions/            # Gestión de preguntas
│   │   └── init-db/              # Inicialización de BD
│   ├── dashboard/                # Dashboards
│   │   ├── student/              # Panel estudiante
│   │   └── teacher/              # Panel docente
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes de dashboard
│   ├── gamification/             # Sistema de logros
│   └── ui/                       # Componentes UI (shadcn)
├── lib/                          # Librerías y utilidades
│   ├── database.ts               # Conexión MongoDB
│   └── auth.ts                   # Funciones de autenticación
├── public/                       # Archivos estáticos
│   ├── audio/                    # Archivos de audio
│   └── images/                   # Imágenes
├── scripts/                      # Scripts auxiliares
├── .env.local                    # Variables de entorno
├── package.json                  # Dependencias
├── tsconfig.json                 # Configuración TypeScript
└── MANUAL_USUARIO.md             # Este archivo
\`\`\`

### Anexo B: Credenciales de Prueba Completas

Ver sección "Credenciales Demo Creadas" en [Configuración de MongoDB](#configuración-de-mongodb)

### Anexo C: Formato de Importación de Preguntas

Ver sección "Importar Banco de Preguntas" en [Manual de Usuario - Docentes](#4-importar-banco-de-preguntas)

---

**© 2025 Alejandro Montes Pimienta - Corporación Universitaria Antonio José de Sucre (UAJS)**  
**Todos los derechos reservados.**
