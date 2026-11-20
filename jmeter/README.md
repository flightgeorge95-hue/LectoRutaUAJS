# Pruebas con Apache JMeter — LectoRuta Saber

Batería de pruebas de la API REST y de las páginas de LectoRuta Saber con **Apache JMeter 5.6.3** (Java 21). Cubre funcionalidad, seguridad, validación, carga, estrés y picos de concurrencia.

## Estructura

```
jmeter/
├── planes/
│   ├── 01_funcionales_api.jmx      51 casos funcionales, de seguridad y de validación
│   ├── 02_carga.jmx                carga esperada (estudiantes y docentes concurrentes)
│   ├── 03_estres_escalonado.jmx    concurrencia creciente por escalones
│   └── 04_pico.jmx                 pico súbito (inicio de un simulacro)
├── catalogo-funcional.json         catálogo de casos (ID, nombre y resultado esperado)
├── config/credenciales.example.properties   plantilla de cuentas de prueba
├── data/*.example.csv                       plantillas de usuarios para las pruebas de carga
├── ejecutar-pruebas.ps1                     ejecutor en modo no gráfico con reporte HTML
└── resultados/                              salidas de cada ejecución (ignorado por git)
```

Las credenciales reales (`config/credenciales.properties`, `data/estudiantes.csv` y `data/docentes.csv`) están excluidas del repositorio.

## Preparación

1. Instalar un JDK 17 o superior (se usó Eclipse Temurin 21).
2. Descargar Apache JMeter 5.6.3.
3. Copiar `config/credenciales.example.properties` a `config/credenciales.properties` y escribir una cuenta de estudiante, una de docente y una de administrador.
4. Copiar `data/estudiantes.example.csv` a `data/estudiantes.csv` y `data/docentes.example.csv` a `data/docentes.csv`, con cuentas válidas.

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

Cada ejecución genera `resultados/<prueba>_<fecha>/reporte/index.html`: el reporte HTML de JMeter con APDEX, percentiles, rendimiento y errores. Para abrir un plan en la interfaz gráfica: `jmeter.bat -t planes\01_funcionales_api.jmx -q config\credenciales.properties`.

> **Producción:** todas las pruebas son de solo lectura; los inicios de sesión registran intentos de acceso y sesiones en MongoDB Atlas. Las cargas por defecto son moderadas para no superar los límites del plan gratuito de Vercel ni del cluster M0 de Atlas.

## Resultados de la última ejecución

| Prueba | Usuarios | Peticiones | Error | Promedio | P90 | APDEX |
|---|---|---|---|---|---|---|
| Funcional y de seguridad | 1 | 51 casos | **51/51 aprobados** | — | — | — |
| Carga | 12 | 1.112 | 0,00 % | 177 ms | 239 ms | 1,00 |
| Estrés escalonado | hasta 30 | 2.815 | 0,00 % | 173 ms | 240 ms | 1,00 |
| Pico | hasta 28 | 1.082 | 0,00 % | 171 ms | 240 ms | 1,00 |

## 1. Pruebas funcionales (`01_funcionales_api.jmx`)

Un usuario virtual, una iteración, grupos ejecutados en serie. Cada caso valida el código HTTP, el contenido de la respuesta y un tiempo máximo (SLA, por defecto 5000 ms; se cambia con `-Jsla_ms`). Los ID se asignan automáticamente en el orden de ejecución.

### A · Sin sesión: disponibilidad, control de acceso y validación

| ID | Caso | Esperado |
|---|---|---|
| TC-01 | Página de inicio carga | 200 |
| TC-02 | Portal estudiante muestra login | 200 |
| TC-03 | Portal docente muestra login | 200 |
| TC-04 | Portal administrador muestra login | 200 |
| TC-05 | Talleres sin sesión | 401 |
| TC-06 | Listado admin de estudiantes sin sesión | 401 |
| TC-07 | Métricas docentes sin sesión | 401 |
| TC-08 | Estadísticas de estudiante sin sesión | 401 |
| TC-09 | Exportar Excel sin sesión | 401 |
| TC-10 | JWT con rol admin firmado con clave falsa | 401 |
| TC-11 | JWT sin firma (alg=none) con rol admin | 401 |
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
| TC-20 | Inyección NoSQL en login ({$ne:null}) | 400/401/500 |

### C · Flujo del estudiante

| ID | Caso | Esperado |
|---|---|---|
| TC-21 | Login estudiante válido | 200 |
| TC-22 | Panel: talleres asignados del estudiante | 200 |
| TC-23 | Panel: estadísticas y competencias | 200 |
| TC-24 | Catálogo de talleres del grado | 200 |
| TC-25 | Detalle de taller NO expone respuestas correctas | 200/403 |
| TC-26 | Estudiante → listado admin | 401 |
| TC-27 | Estudiante → métricas docentes | 401 |
| TC-28 | Estudiante → listado de estudiantes por grado | 401 |
| TC-29 | Estudiante → banco de preguntas con respuestas | 401 |
| TC-30 | Estudiante → crear taller | 401 |
| TC-31 | Estudiante → publicar recurso | 401 |
| TC-32 | Estudiante abre panel admin | 307/308 |
| TC-33 | Cerrar sesión | 200 |
| TC-34 | API tras cerrar sesión | 401 |
| TC-35 | Token anterior reutilizado tras logout | 401 |

### D · Flujo del docente

| ID | Caso | Esperado |
|---|---|---|
| TC-36 | Login docente válido | 200 |
| TC-37 | Métricas del grado 11 | 200 |
| TC-38 | Métricas del grado 10 | 200 |
| TC-39 | Estudiantes del grado 11 | 200 |
| TC-40 | Grado fuera de rango (9) | 400 |
| TC-41 | Entregas pendientes de revisión | 200 |
| TC-42 | Exportar reporte Excel del grado 11 | 200 |
| TC-43 | Docente → gestión de docentes (admin) | 401 |
| TC-44 | Cerrar sesión docente | 200 |

### E · Flujo del administrador

| ID | Caso | Esperado |
|---|---|---|
| TC-45 | Login administrador válido | 200 |
| TC-46 | Listar estudiantes | 200 |
| TC-47 | Listar docentes | 200 |
| TC-48 | Crear estudiante con campos faltantes | 400 |
| TC-49 | Crear estudiante con grado 9 | 400 |
| TC-50 | Recursos educativos | 200 |
| TC-51 | Cerrar sesión administrador | 200 |

## 2. Prueba de carga (`02_carga.jmx`)

Uso normal: estudiantes practicando y docentes revisando métricas al mismo tiempo, con pausas aleatorias entre pasos.

| Parámetro | Por defecto | Descripción |
|---|---|---|
| `hilos` | 10 | estudiantes concurrentes |
| `hilos_docentes` | 2 | docentes concurrentes |
| `rampa` | 30 s | tiempo para alcanzar la concurrencia |
| `duracion` | 180 s | duración de la prueba |

Estudiante: T01 Página de inicio → T02 Login → T03 Panel → T04 Catálogo → T05 Abrir taller → T06 Cerrar sesión.
Docente: D01 Login → D02 Métricas por grado → D03 Estudiantes y revisiones → D04 Cerrar sesión.

## 3. Prueba de estrés escalonada (`03_estres_escalonado.jmx`)

Tres escalones de `hilos_escalon` usuarios (por defecto 10 → 20 → 30) de `paso` segundos cada uno (por defecto 90 s).

## 4. Prueba de pico (`04_pico.jmx`)

Carga base de `hilos_base` usuarios (3) durante `duracion` (180 s); en el segundo `inicio_pico` (60) entran `hilos_pico` estudiantes (25) en `rampa_pico` segundos (5), durante `duracion_pico` (60 s).

## Hallazgos y su tratamiento

| # | Severidad | Hallazgo | Tratamiento | Estado |
|---|---|---|---|---|
| H1 | Crítica | El cluster M0 de MongoDB Atlas se pausó por inactividad: cada petición con base de datos tardaba unos 20 s y el login respondía "no encontrado". | Cluster reanudado. Pendiente: responder 503 cuando falle la conexión. | Mitigado |
| H2 | Alta | Los listados de estudiantes y docentes, y los talleres (por medio del docente creador), devolvían el hash de la contraseña. | `select: false` en el esquema; solo el login lee el hash. | Corregido |
| H3 | Media | Al cerrar sesión el JWT seguía siendo válido hasta 24 h. | Sesión revocable: el token lleva un `sid` registrado en la colección `sessions`, que el proxy verifica. | Corregido |
| H4 | Baja | Si el login recibía objetos (`{"$ne": null}`) en lugar de texto, respondía 500. | Validación del tipo de los campos; respuesta 400. | Corregido |
| H5 | Baja | En la primera prueba de carga, 7 de 1035 peticiones tardaron unos 15 s, compatible con el arranque en frío de instancias nuevas; en la ejecución final no se repitió. | Ajustar los tiempos de conexión y la región del despliegue; vigilar en próximas pruebas. | En observación |
| H6 | Alta | Un estudiante podía leer el banco de preguntas con las respuestas correctas y llegar a los servicios de creación de talleres y recursos. | Reglas de autorización por rol y método en `proxy.ts`. | Corregido |

## Criterios de aceptación

| Métrica | Umbral |
|---|---|
| Casos funcionales aprobados | 100 % |
| Tasa de error en carga | < 1 % |
| Percentil 90 en carga | ≤ 3000 ms |
| APDEX (satisfactorio ≤ 1 s, tolerable ≤ 3 s) | ≥ 0,70 |
