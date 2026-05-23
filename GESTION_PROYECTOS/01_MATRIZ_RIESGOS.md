# MATRIZ DE RIESGOS - Lectoruta Saber

**Proyecto:** Plataforma Educativa LectoRuta Saber  
**Módulo:** Gestión de Proyectos TI  
**Fecha:** Mayo 2026  
**Responsable:** Alejandro Montes Pimienta  
**Institución:** Corporación Universitaria Antonio José de Sucre (UAJS)

---

## Formato de la Matriz de Riesgos

| # | Riesgo | Descripción | Causa | Probabilidad | Impacto | Nivel Riesgo | Estrategia Mitigación | Responsable |
|---|--------|-------------|-------|-------------|---------|-------------|----------------------|-------------|
| 1 | **Fuga de información académica** | Acceso no autorizado a datos sensibles: calificaciones, datos personales de estudiantes (tarjeta identidad) y docentes (cédula) | Autenticación solo por tarjeta de identidad sin PIN; rutas API sin middleware de protección; JWT sin renovación periódica | Alta (4) | Catastrófico (5) | **20 - Crítico** | Implementar middleware de protección de rutas en Next.js; agregar autenticación de dos factores; cifrar datos sensibles en BD; implementar expiración y renovación de JWT | Líder Técnico |
| 2 | **Pérdida de datos por falta de backups automatizados** | Pérdida total o parcial de la base de datos (talleres creados, progreso estudiantes, recursos ICFES) por fallo de hardware o corrupción de datos | No hay sistema automatizado de respaldos; backup solo manual vía MongoDB Compass; sin redundancia de datos | Media (3) | Catastrófico (5) | **15 - Alto** | Configurar backups automáticos diarios con mongodump; implementar MongoDB Atlas con backups automáticos; probar restauración de datos periódicamente | Administrador BD |
| 3 | **Caída del servidor en periodo crítico** | Plataforma no disponible durante simulacros ICFES, talleres con fecha límite o periodos de evaluación | Servidor local sin monitoreo; sin balanceo de carga; dependencia de un solo servidor; sin plan de contingencia | Media (3) | Grave (4) | **12 - Alto** | Implementar monitoreo con alertas (uptime robot); migrar a hosting cloud escalable (Vercel/Railway); tener plan de contingencia con servidor secundario | DevOps / Administrador |
| 4 | **Baja adopción por parte de docentes** | Docentes no utilizan la plataforma para crear talleres ni publicar recursos ICFES, reduciendo el valor del sistema | Falta de capacitación; interfaz poco intuitiva para creación de talleres; resistencia al cambio tecnológico | Alta (4) | Grave (4) | **16 - Alto** | Crear manuales y video-tutoriales de uso; realizar capacitaciones presenciales con docentes; implementar onboarding guiado en la plataforma; recoger feedback para mejorar UX | Líder del Proyecto |
| 5 | **Problemas de escalabilidad y rendimiento** | La plataforma se vuelve lenta o no responde al aumentar la cantidad de estudiantes (consultas lentas a MongoDB) | Falta de índices en BD; consultas no optimizadas; arquitectura sin caché; almacenamiento local de archivos multimedia | Media (3) | Grave (4) | **12 - Alto** | Crear índices compuestos en MongoDB; implementar caché con Redis; optimizar consultas con agregaciones; migrar archivos a CDN/cloud storage | Desarrollador Backend |
| 6 | **Vulnerabilidades de seguridad en sesiones** | Sesiones de usuarios secuestradas o expuestas permitiendo suplantación de identidad | Cookies sin flags Secure/HttpOnly; sesiones sin expiración configurada; localStorage expuesto a XSS | Alta (4) | Grave (4) | **16 - Alto** | Configurar cookies con Secure, HttpOnly y SameSite; implementar expiración automática de sesiones; sanitizar inputs para evitar XSS; usar helmet.js para headers de seguridad | Desarrollador Full Stack |
| 7 | **Dependencia crítica del desarrollador original** | El proyecto queda sin soporte si el desarrollador original se ausenta, al no haber documentación técnica ni transferencia de conocimiento | Código sin documentar; sin control de versiones (Git); arquitectura no diagramada; sin pruebas automatizadas | Alta (4) | Catastrófico (5) | **20 - Crítico** | Documentar API endpoints y arquitectura en MANUAL_USUARIO.md; iniciar repositorio Git con commits descriptivos; escribir pruebas unitarias básicas; asignar desarrollador secundario para transferencia de conocimiento | Líder del Proyecto |

---

## Escala de Valoración

### Probabilidad
| Valor | Nivel | Descripción |
|-------|-------|-------------|
| 1 | Muy Baja | Improbable (menos del 10%) |
| 2 | Baja | Poco probable (10%-30%) |
| 3 | Media | Posible (30%-60%) |
| 4 | Alta | Probable (60%-80%) |
| 5 | Muy Alta | Casi seguro (más del 80%) |

### Impacto
| Valor | Nivel | Descripción |
|-------|-------|-------------|
| 1 | Insignificante | Sin efecto en el proyecto |
| 2 | Menor | Efecto mínimo, fácil de resolver |
| 3 | Moderado | Afecta cronograma/recursos |
| 4 | Grave | Pérdida significativa de funcionalidad |
| 5 | Catastrófico | Falla total del sistema o pérdida de datos |

### Nivel de Riesgo (Probabilidad × Impacto)
| Rango | Nivel | Acción Requerida |
|-------|-------|------------------|
| 1-6 | Bajo | Monitoreo periódico |
| 7-12 | Medio | Acción preventiva planificada |
| 13-18 | Alto | Acción correctiva prioritaria |
| 19-25 | Crítico | Acción inmediata, requiere atención urgente |

---

## Seguimiento de Riesgos

| # | Riesgo | Fecha Identificación | Estado | Última Revisión | Acciones Tomadas |
|---|--------|---------------------|--------|-----------------|------------------|
| 1 | Fuga de información | 16/05/2026 | Activo | 16/05/2026 | Pendiente de implementar middleware |
| 2 | Pérdida de datos | 16/05/2026 | Activo | 16/05/2026 | Backup manual en curso, automatización pendiente |
| 3 | Caída del servidor | 16/05/2026 | Activo | 16/05/2026 | Evaluando opciones de hosting cloud |
| 4 | Baja adopción docentes | 16/05/2026 | Activo | 16/05/2026 | Manual de usuario completado, capacitaciones pendientes |
| 5 | Escalabilidad | 16/05/2026 | Activo | 16/05/2026 | Índices de BD por implementar |
| 6 | Seguridad sesiones | 16/05/2026 | Activo | 16/05/2026 | Revisión de configuración de cookies pendiente |
| 7 | Dependencia desarrollador | 16/05/2026 | Activo | 16/05/2026 | Repositorio Git por inicializar |

---

*Documento generado para la actividad de Gestión de Proyectos TI - Mayo 2026*
