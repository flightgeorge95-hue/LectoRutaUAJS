# Pruebas con Apache JMeter — LectoRuta Saber

Pruebas de la API REST y de las páginas de LectoRuta Saber con **Apache JMeter 5.6.3** (Java 21). Cubren funcionalidad, seguridad, validación, carga, estrés y picos de concurrencia.

## Estructura

```
jmeter/
├── planes/
│   ├── 01_funcionales_api.jmx      48 casos funcionales, de seguridad y de validación
│   ├── 02_carga.jmx                carga esperada (estudiantes + docentes concurrentes)
│   ├── 03_estres_escalonado.jmx    concurrencia creciente por escalones
│   └── 04_pico.jmx                 pico súbito (inicio de un simulacro)
├── config/credenciales.example.properties   plantilla de cuentas de prueba
├── data/*.example.csv                       plantillas de usuarios para carga
├── ejecutar-pruebas.ps1                     ejecutor en modo no gráfico + reporte HTML
└── resultados/                              salidas (ignorado por git)
```

Las credenciales reales (`config/credenciales.properties`, `data/estudiantes.csv`, `data/docentes.csv`) están excluidas del repositorio.

## Preparación

1. Instalar JDK 17 o superior (se usó Eclipse Temurin 21).
2. Descargar Apache JMeter 5.6.3.
3. Copiar `config/credenciales.example.properties` a `config/credenciales.properties` y completar las cuentas de prueba (estudiante, docente y administrador).
4. Copiar `data/estudiantes.example.csv` a `data/estudiantes.csv` y `data/docentes.example.csv` a `data/docentes.csv` con cuentas válidas.

## Ejecución

```powershell
# Pruebas funcionales (por defecto contra https://lecto-ruta.vercel.app)
.\jmeter\ejecutar-pruebas.ps1 -Prueba funcional

# Carga con parámetros personalizados
.\jmeter\ejecutar-pruebas.ps1 -Prueba carga -Parametros "-Jhilos=15","-Jduracion=300"

# Todas las pruebas en secuencia
.\jmeter\ejecutar-pruebas.ps1 -Prueba todas

# Contra un servidor local
.\jmeter\ejecutar-pruebas.ps1 -Prueba funcional -Servidor localhost -Protocolo http -Puerto 3000
```

Cada ejecución genera `resultados/<prueba>_<fecha>/reporte/index.html` (Dashboard HTML de JMeter con APDEX, percentiles, throughput y errores).

Para abrir un plan en la interfaz gráfica: `jmeter.bat -t planes\01_funcionales_api.jmx -q config\credenciales.properties`.

> **Nota sobre producción:** todas las pruebas son de solo lectura. Los inicios de sesión registran intentos de acceso y sesiones en MongoDB Atlas. Las cargas por defecto son moderadas para no superar los límites del plan gratuito de Vercel y del cluster M0 de Atlas.

## 1. Pruebas funcionales (`01_funcionales_api.jmx`)

Un usuario virtual, una iteración, grupos ejecutados en serie. Cada caso valida código HTTP, contenido JSON y un tiempo de respuesta máximo (SLA, por defecto 5000 ms, configurable con `-Jsla_ms`).

### A · Sin sesión: disponibilidad, control de acceso y validación

| ID | Caso | Esperado |
|---|---|---|
| TC-01 | Página de inicio carga | 200, contiene "LectoRuta" |
| TC-02 | Portal estudiante muestra login | 200 |
| TC-03 | Portal docente muestra login | 200 |
| TC-04 | Portal administrador muestra login | 200 |
| TC-05 | Talleres sin sesión | 401 "No autorizado" |
| TC-06 | Listado admin de estudiantes sin sesión | 401, sin datos |
| TC-07 | Métricas docentes sin sesión | 401 |
| TC-08 | Estadísticas de estudiante sin sesión | 401 |
| TC-09 | Exportar Excel sin sesión | 401 |
| TC-10 | JWT con rol admin firmado con clave falsa | 401 |
| TC-11 | JWT sin firma (`alg=none`) con rol admin | 401 |
| TC-12 | Cookie de sesión con texto basura | 401 |
| TC-13 | Login estudiante sin campos | 400 |
| TC-14 | Login docente sin contraseña | 400 |
| TC-15 | Login admin sin campos | 400 |

### B · Autenticación con credenciales inválidas

| ID | Caso | Esperado |
|---|---|---|
| TC-16 | Estudiante con tarjeta inexistente | 401 |
| TC-17 | Estudiante con contraseña incorrecta | 401 |
| TC-18 | Docente con contraseña incorrecta | 401 |
| TC-19 | Administrador con contraseña incorrecta | 401 |
| TC-20 | Inyección NoSQL (`{"$ne": null}`) en login | Rechazada, sin sesión |

### C · Flujo del estudiante

| ID | Caso | Esperado |
|---|---|---|
| TC-21 | Login válido | 200, cookie `auth-session` HttpOnly, sin contraseña en la respuesta |
| TC-22 | Talleres asignados | 200, `workshops` y `stats` |
| TC-23 | Estadísticas y competencias | 200, `stats.competencyStats` |
| TC-24 | Catálogo de talleres del grado | 200 |
| TC-25 | Detalle de taller | 200/403, **sin** `correctAnswer` ni `explanation` |
| TC-26 | Estudiante → listado admin | 401 (escalamiento de privilegios) |
| TC-27 | Estudiante → métricas docentes | 401 |
| TC-28 | Estudiante → estudiantes por grado | 401 |
| TC-29 | Estudiante abre `/dashboard/admin` | Redirección 307 a `/dashboard/student` |
| TC-30 | Cerrar sesión | 200, cookie eliminada |
| TC-31 | API tras cerrar sesión | 401 |
| TC-32 | Reutilizar el token anterior tras cerrar sesión | 401 (ver hallazgos) |

### D · Flujo del docente

| ID | Caso | Esperado |
|---|---|---|
| TC-33 | Login válido | 200, rol `teacher` |
| TC-34 | Métricas del grado 11 | 200, `gradeStats` |
| TC-35 | Métricas del grado 10 | 200 |
| TC-36 | Estudiantes del grado 11 | 200, sin contraseñas |
| TC-37 | Grado fuera de rango (9) | 400 "Grado inválido" |
| TC-38 | Entregas pendientes de revisión | 200 |
| TC-39 | Exportar reporte Excel | 200, archivo `.xlsx` |
| TC-40 | Docente → gestión de docentes | 401 |
| TC-41 | Cerrar sesión | 200 |

### E · Flujo del administrador

| ID | Caso | Esperado |
|---|---|---|
| TC-42 | Login válido | 200, rol `admin` |
| TC-43 | Listar estudiantes | 200 |
| TC-44 | Listar docentes | 200 |
| TC-45 | Crear estudiante con campos faltantes | 400 |
| TC-46 | Crear estudiante con grado 9 | 400 (no se crea ningún registro) |
| TC-47 | Recursos educativos | 200 |
| TC-48 | Cerrar sesión | 200 |

## 2. Prueba de carga (`02_carga.jmx`)

Simula el uso normal: estudiantes practicando y docentes revisando métricas al mismo tiempo, con tiempos de lectura aleatorios entre peticiones.

| Parámetro | Por defecto | Descripción |
|---|---|---|
| `hilos` | 10 | estudiantes concurrentes |
| `hilos_docentes` | 2 | docentes concurrentes |
| `rampa` | 30 s | tiempo para alcanzar la concurrencia |
| `duracion` | 180 s | duración de la prueba |

Transacciones del estudiante: T01 Página de inicio → T02 Login → T03 Panel (talleres + estadísticas) → T04 Catálogo → T05 Abrir taller → T06 Cerrar sesión.
Transacciones del docente: D01 Login → D02 Métricas por grado → D03 Estudiantes y revisiones → D04 Cerrar sesión.

## 3. Prueba de estrés escalonada (`03_estres_escalonado.jmx`)

Tres escalones de `hilos_escalon` usuarios (por defecto 10 → 20 → 30), cada uno de `paso` segundos (por defecto 90 s, 4,5 min en total). Sirve para identificar en qué nivel de concurrencia se degradan los tiempos o aparecen errores.

## 4. Prueba de pico (`04_pico.jmx`)

Carga base de `hilos_base` usuarios (3) durante `duracion` (180 s). En el segundo `inicio_pico` (60) entran de golpe `hilos_pico` estudiantes (25) en `rampa_pico` segundos (5), durante `duracion_pico` (60 s). Simula el inicio simultáneo de un simulacro en clase.

## Hallazgos detectados por las pruebas (19-nov-2026)

| # | Severidad | Hallazgo | Caso | Recomendación |
|---|---|---|---|---|
| H1 | Crítica (operación) | El cluster M0 de MongoDB Atlas se pausó por inactividad. Toda petición con base de datos tardaba unos 20 s y los logins respondían "no encontrado", porque `Database.connect()` oculta el error y Mongoose espera 10 s por consulta. | TC-16 a TC-48 | Reanudar el cluster. Registrar el error de conexión y responder 503 en lugar de "no encontrado". Configurar `serverSelectionTimeoutMS` bajo. |
| H2 | Alta | `/api/students/[grade]`, `/api/admin/students` y `/api/admin/teachers` devuelven el hash bcrypt de la contraseña. La contraseña de los estudiantes es su tarjeta de identidad, así que el hash se descifra de inmediato. | TC-36, TC-43, TC-44 | Excluir el campo en las consultas (`.select("-password")`). |
| H3 | Media | Al cerrar sesión solo se borra la cookie: el JWT sigue siendo válido hasta que expira (24 h) si alguien lo copió. | TC-32 | Lista de revocación (colección `sessions`) o un tiempo de expiración más corto. |
| H4 | Baja | Si se envían objetos en lugar de texto en el login (`{"$ne": null}`), la API responde 500. No permite saltarse la autenticación (bcrypt rechaza), pero el operador sí llega a la consulta de MongoDB. | TC-20 | Validar que `tarjetaIdentidad`/`cedula`/`password` sean texto (por ejemplo con zod) y responder 400. |
| H5 | Baja (rendimiento) | En la prueba de carga, 7 de 1035 peticiones (0,7 %) tardaron unos 15,5 s frente a 275 ms de promedio. El patrón coincide con el arranque en frío de instancias serverless nuevas y su conexión a Atlas. | Carga | Mantener la conexión en caché global, ajustar los tiempos de espera y revisar que la región de Vercel esté cerca de la de Atlas. |

## Criterios de aceptación

| Métrica | Umbral |
|---|---|
| Casos funcionales aprobados | 100 % |
| Tasa de error en carga | < 1 % |
| Percentil 90 en carga | ≤ 3000 ms |
| APDEX (satisfecho ≤ 1 s, tolerable ≤ 3 s) | ≥ 0,70 |
