# DIAGRAMA DE GANTT - Lectoruta Saber

**Proyecto:** Implementación de Gestión de Proyectos TI en LectoRuta Saber  
**Duración Total:** 8 semanas (18 mayo - 12 julio 2026)  
**Responsable:** Alejandro Montes Pimienta

---

## Cronograma de Actividades

| ID | Actividad | Inicio | Fin | Duración | Dependencias | Responsable |
|----|-----------|--------|-----|----------|-------------|-------------|
| A | Análisis de requisitos del módulo de gestión de proyectos | 18/05/2026 | 23/05/2026 | 5 días | - | Líder del Proyecto |
| B | Identificación y evaluación de riesgos del proyecto | 24/05/2026 | 28/05/2026 | 5 días | A | Líder del Proyecto |
| C | Elaboración de la Matriz de Riesgos | 29/05/2026 | 31/05/2026 | 3 días | B | Líder del Proyecto |
| D | Diseño del cronograma y diagrama de Gantt | 29/05/2026 | 02/06/2026 | 4 días | B | Analista de Proyectos |
| E | Creación y configuración del tablero Trello | 01/06/2026 | 04/06/2026 | 4 días | A, D | Analista de Proyectos |
| F | Implementación de middleware de protección de rutas | 05/06/2026 | 14/06/2026 | 8 días | C, E | Desarrollador Backend |
| G | Implementación de seguridad en sesiones y cookies | 07/06/2026 | 15/06/2026 | 7 días | F | Desarrollador Full Stack |
| H | Configuración de backups automatizados en MongoDB | 12/06/2026 | 18/06/2026 | 5 días | F | Administrador BD |
| I | Optimización de consultas e índices en MongoDB | 15/06/2026 | 22/06/2026 | 6 días | H | Desarrollador Backend |
| J | Migración a hosting cloud escalable (Vercel/Railway) | 19/06/2026 | 28/06/2026 | 8 días | H, I | DevOps |
| K | Elaboración de documentación técnica y manuales | 22/06/2026 | 30/06/2026 | 7 días | I, J | Líder del Proyecto |
| L | Pruebas de seguridad y rendimiento | 25/06/2026 | 03/07/2026 | 7 días | J, K | Desarrollador Full Stack |
| M | Capacitación a docentes y usuarios | 01/07/2026 | 08/07/2026 | 6 días | K, L | Líder del Proyecto |
| N | Despliegue final y cierre del proyecto | 06/07/2026 | 12/07/2026 | 5 días | L, M | Todo el equipo |

---

## Diagrama de Gantt (Formato Visual)

```
Semanas:       May 18    May 25    Jun 1     Jun 8     Jun 15    Jun 22    Jun 29    Jul 6
               |---------|---------|---------|---------|---------|---------|---------|---------|
A. Análisis    [█████████]
B. Ident. Ries    [█████████]
C. Matriz Ries        [█████]
D. Gantt              [████████]
E. Trello                      [████████]
F. Middleware                   [████████████████]
G. Seguridad                     [███████████████]
H. Backups                             [██████████]
I. Índices BD                              [████████████]
J. Migración Cloud                             [████████████████]
K. Documentación                                  [███████████████]
L. Pruebas                                             [███████████████]
M. Capacitación                                             [████████████]
N. Despliegue                                                     [██████████]

Leyenda:
█████ = Duración de la actividad
────> = Dependencia entre actividades
```

---

## Dependencias entre Actividades

| Actividad | Depende de | Tipo de Dependencia |
|-----------|-----------|-------------------|
| B | A | Final-Comienzo (B no puede empezar hasta que A termine) |
| C | B | Final-Comienzo |
| D | B | Final-Comienzo |
| E | A, D | Final-Comienzo (E necesita A y D terminados) |
| F | C, E | Final-Comienzo |
| G | F | Final-Comienzo |
| H | F | Final-Comienzo |
| I | H | Final-Comienzo |
| J | H, I | Final-Comienzo |
| K | I, J | Final-Comienzo |
| L | J, K | Final-Comienzo |
| M | K, L | Final-Comienzo |
| N | L, M | Final-Comienzo |

---

## Hitos del Proyecto

| Hito | Fecha | Descripción |
|------|-------|-------------|
| H1 | 23/05/2026 | Aprobación de requisitos |
| H2 | 31/05/2026 | Matriz de Riesgos finalizada |
| H3 | 04/06/2026 | Tablero Trello operativo |
| H4 | 14/06/2026 | Middleware de seguridad implementado |
| H5 | 22/06/2026 | Base de datos optimizada |
| H6 | 28/06/2026 | Plataforma migrada a cloud |
| H7 | 03/07/2026 | Pruebas de seguridad superadas |
| H8 | 12/07/2026 | Proyecto completado y desplegado |

---

## Distribución de Carga por Recurso

| Recurso | Actividades Asignadas | Días Totales |
|---------|----------------------|--------------|
| Líder del Proyecto | A, B, C, K, M | 26 días |
| Analista de Proyectos | D, E | 8 días |
| Desarrollador Backend | F, H, I | 19 días |
| Desarrollador Full Stack | G, L | 14 días |
| Administrador BD | H, I | 11 días |
| DevOps | J | 8 días |

---

*Documento generado para la actividad de Gestión de Proyectos TI - Mayo 2026*  
*Se recomienda elaborar el diagrama de Gantt visual en Microsoft Excel, Project o GanttProject utilizando los datos de esta tabla.*
