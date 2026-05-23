const ExcelJS = require('exceljs');

// ===================== COLOR PALETTE =====================
const C = {
  purple: '6D28D9',
  purple2: '7C3AED',
  purpleLight: 'DDD6FE',
  purpleVL: 'EDE9FE',
  white: 'FFFFFF',
  dark: '1F1F1F',
  gray: '6B7280',
  grayLight: 'F3F4F6',
  border: 'C8C8C8',
  
  // Risk level colors
  critical: 'DC2626',    // red
  criticalBg: 'FEE2E2',
  high: 'EA580C',        // orange
  highBg: 'FFEDD5',
  medium: 'CA8A04',      // yellow/amber
  mediumBg: 'FEF9C3',
  low: '16A34A',         // green
  lowBg: 'DCFCE7',
  
  probHigh: 'DC2626',
  probMed: 'CA8A04',
  probLow: '16A34A',
};

const wb = new ExcelJS.Workbook();
wb.creator = 'Alejandro Montes Pimienta - UAJS';
wb.created = new Date();

function border(style = 'thin', color = C.border) {
  return {
    top: { style, color: { argb: color } },
    left: { style, color: { argb: color } },
    bottom: { style, color: { argb: color } },
    right: { style, color: { argb: color } }
  };
}

function fill(color) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
}

function center() {
  return { horizontal: 'center', vertical: 'middle' };
}

function centerWrap() {
  return { horizontal: 'center', vertical: 'middle', wrapText: true };
}

// ======================== SHEET 1: MATRIZ DE RIESGOS ========================
const ws1 = wb.addWorksheet('Matriz de Riesgos', {
  pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
});

// ---- TITLE ----
ws1.mergeCells('A1:I1');
ws1.getCell('A1').value = 'MATRIZ DE RIESGOS - LECTORUTA SABER';
ws1.getCell('A1').font = { bold: true, size: 18, color: { argb: C.purple } };
ws1.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
ws1.getRow(1).height = 36;

ws1.mergeCells('A2:I2');
ws1.getCell('A2').value = 'Plataforma Educativa LectoRuta Saber | Gestión de Proyectos TI | Corporación Universitaria Antonio José de Sucre (UAJS)';
ws1.getCell('A2').font = { size: 10, italic: true, color: { argb: C.gray } };
ws1.getCell('A2').alignment = { horizontal: 'center' };

ws1.mergeCells('A3:I3');
ws1.getCell('A3').value = 'Responsable: Alejandro Montes Pimienta | Fecha: Mayo 2026 | Versión: 1.0';
ws1.getCell('A3').font = { size: 10, italic: true, color: { argb: C.gray } };
ws1.getCell('A3').alignment = { horizontal: 'center' };

ws1.getRow(4).height = 6;

// ---- RISK MATRIX TABLE ----
const headerRow = 5;
const riskHeaders = [
  { key: '#', w: 4 },
  { key: 'Riesgo', w: 24 },
  { key: 'Descripción', w: 36 },
  { key: 'Causa', w: 32 },
  { key: 'Probabilidad', w: 14 },
  { key: 'Impacto', w: 14 },
  { key: 'Nivel Riesgo\n(P × I)', w: 14 },
  { key: 'Estrategia de Mitigación', w: 40 },
  { key: 'Responsable', w: 20 }
];

riskHeaders.forEach((h, i) => {
  const cell = ws1.getCell(headerRow, i + 1);
  cell.value = h.key;
  cell.font = { bold: true, size: 9, color: { argb: C.white } };
  cell.fill = fill(C.purple);
  cell.alignment = centerWrap();
  cell.border = border();
});
ws1.getRow(headerRow).height = 32;

const risks = [
  {
    id: 1,
    name: 'Fuga de información académica',
    desc: 'Acceso no autorizado a datos sensibles: calificaciones, tarjetas de identidad de estudiantes y cédulas de docentes',
    cause: 'Autenticación solo por TI sin PIN; rutas API sin middleware; JWT sin renovación periódica',
    prob: { val: 4, label: 'Alta' },
    impact: { val: 5, label: 'Catastrófico' },
    level: { val: 20, label: 'Crítico' },
    mitigation: 'Implementar middleware de protección de rutas en Next.js; autenticación de dos factores; cifrar datos sensibles en BD; renovación periódica de JWT',
    resp: 'Líder Técnico'
  },
  {
    id: 2,
    name: 'Pérdida de datos por falta de backups',
    desc: 'Pérdida total/parcial de BD (talleres, progreso estudiantes, recursos ICFES) por fallo de hardware o corrupción',
    cause: 'Sin sistema automatizado de respaldos; backup solo manual vía MongoDB Compass; sin redundancia',
    prob: { val: 3, label: 'Media' },
    impact: { val: 5, label: 'Catastrófico' },
    level: { val: 15, label: 'Alto' },
    mitigation: 'Configurar backups automáticos diarios con mongodump; implementar MongoDB Atlas con backups automáticos; probar restauración periódicamente',
    resp: 'Administrador BD'
  },
  {
    id: 3,
    name: 'Caída del servidor en periodo crítico',
    desc: 'Plataforma no disponible durante simulacros ICFES, talleres con fecha límite o periodos de evaluación',
    cause: 'Servidor local sin monitoreo; sin balanceo de carga; dependencia de un solo servidor; sin plan de contingencia',
    prob: { val: 3, label: 'Media' },
    impact: { val: 4, label: 'Grave' },
    level: { val: 12, label: 'Alto' },
    mitigation: 'Implementar monitoreo con alertas (Uptime Robot); migrar a hosting cloud escalable (Vercel/Railway); plan de contingencia con servidor secundario',
    resp: 'DevOps / Administrador'
  },
  {
    id: 4,
    name: 'Baja adopción por parte de docentes',
    desc: 'Docentes no usan la plataforma para crear talleres ni publicar recursos ICFES, reduciendo el valor del sistema',
    cause: 'Falta de capacitación; interfaz poco intuitiva; resistencia al cambio tecnológico',
    prob: { val: 4, label: 'Alta' },
    impact: { val: 4, label: 'Grave' },
    level: { val: 16, label: 'Alto' },
    mitigation: 'Crear manuales y video-tutoriales; capacitaciones presenciales con docentes; onboarding guiado en plataforma; recoger feedback para mejorar UX',
    resp: 'Líder del Proyecto'
  },
  {
    id: 5,
    name: 'Problemas de escalabilidad y rendimiento',
    desc: 'Plataforma lenta o no responde al aumentar estudiantes (consultas lentas a MongoDB)',
    cause: 'Falta de índices en BD; consultas no optimizadas; arquitectura sin caché; almacenamiento local de multimedia',
    prob: { val: 3, label: 'Media' },
    impact: { val: 4, label: 'Grave' },
    level: { val: 12, label: 'Alto' },
    mitigation: 'Crear índices compuestos en MongoDB; implementar caché con Redis; optimizar consultas; migrar archivos a CDN/cloud storage',
    resp: 'Desarrollador Backend'
  },
  {
    id: 6,
    name: 'Vulnerabilidades de seguridad en sesiones',
    desc: 'Sesiones de usuarios secuestradas o expuestas permitiendo suplantación de identidad',
    cause: 'Cookies sin flags Secure/HttpOnly; sesiones sin expiración; localStorage expuesto a XSS',
    prob: { val: 4, label: 'Alta' },
    impact: { val: 4, label: 'Grave' },
    level: { val: 16, label: 'Alto' },
    mitigation: 'Configurar cookies con Secure, HttpOnly y SameSite; expiración automática de sesiones; sanitizar inputs; helmet.js para headers de seguridad',
    resp: 'Desarrollador Full Stack'
  },
  {
    id: 7,
    name: 'Dependencia crítica del desarrollador original',
    desc: 'Proyecto sin soporte si el desarrollador original se ausenta, sin documentación ni transferencia de conocimiento',
    cause: 'Código sin documentar; sin control de versiones (Git); arquitectura no diagramada; sin pruebas automatizadas',
    prob: { val: 4, label: 'Alta' },
    impact: { val: 5, label: 'Catastrófico' },
    level: { val: 20, label: 'Crítico' },
    mitigation: 'Documentar API y arquitectura en MANUAL_USUARIO.md; iniciar repositorio Git; escribir pruebas unitarias; asignar desarrollador secundario para transferencia',
    resp: 'Líder del Proyecto'
  }
];

function getLevelColor(val) {
  if (val >= 19) return { bg: C.criticalBg, fg: C.critical };
  if (val >= 13) return { bg: C.highBg, fg: C.high };
  if (val >= 7) return { bg: C.mediumBg, fg: C.medium };
  return { bg: C.lowBg, fg: C.low };
}

function getProbColor(val) {
  if (val >= 4) return C.probHigh;
  if (val >= 3) return C.probMed;
  return C.probLow;
}

risks.forEach((r, i) => {
  const row = headerRow + 1 + i;
  const lc = getLevelColor(r.level.val);
  const pc = getProbColor(r.prob.val);
  const ic = getProbColor(r.impact.val); // reuse color logic

  const data = [
    { v: r.id, align: center() },
    { v: r.name, font: { bold: true, size: 9, color: { argb: C.dark } } },
    { v: r.desc, font: { size: 8, color: { argb: C.dark } } },
    { v: r.cause, font: { size: 8, color: { argb: C.dark } } },
    { 
      v: `${r.prob.label} (${r.prob.val})`, 
      align: center(), 
      font: { bold: true, size: 10, color: { argb: C.white } },
      fill: fill(pc)
    },
    { 
      v: `${r.impact.label} (${r.impact.val})`, 
      align: center(), 
      font: { bold: true, size: 10, color: { argb: C.white } },
      fill: fill(ic)
    },
    { 
      v: `${r.level.val} - ${r.level.label}`, 
      align: center(), 
      font: { bold: true, size: 10, color: { argb: lc.fg } },
      fill: fill(lc.bg)
    },
    { v: r.mitigation, font: { size: 8, color: { argb: C.dark } } },
    { v: r.resp, align: center(), font: { bold: true, size: 9, color: { argb: C.purple } } }
  ];

  data.forEach((d, j) => {
    const cell = ws1.getCell(row, j + 1);
    cell.value = d.v;
    cell.font = d.font || { size: 9, color: { argb: C.dark } };
    cell.alignment = d.align || { vertical: 'middle', wrapText: true };
    cell.border = border();
    if (d.fill) cell.fill = d.fill;
  });

  // Alternating row background for non-colored columns
  if (i % 2 === 0) {
    [0, 1, 2, 3, 7, 8].forEach(j => {
      const cell = ws1.getCell(row, j + 1);
      if (!cell.fill || cell.fill.fgColor.argb === C.white) {
        cell.fill = fill(C.purpleVL);
      }
    });
  }

  ws1.getRow(row).height = 52;
});

// Column widths
riskHeaders.forEach((h, i) => {
  ws1.getColumn(i + 1).width = h.w;
});

// ---- LEGEND SECTION ----
const legendStart = headerRow + risks.length + 2;

// Section title
ws1.mergeCells(`A${legendStart}:I${legendStart}`);
ws1.getCell(`A${legendStart}`).value = 'ESCALAS DE VALORACIÓN';
ws1.getCell(`A${legendStart}`).font = { bold: true, size: 13, color: { argb: C.purple } };
ws1.getCell(`A${legendStart}`).fill = fill(C.purpleVL);
ws1.getCell(`A${legendStart}`).alignment = { horizontal: 'center', vertical: 'middle' };
ws1.getRow(legendStart).height = 26;

// ---- Probability Scale ----
const probHeader = legendStart + 1;
ws1.mergeCells(`A${probHeader}:C${probHeader}`);
ws1.getCell(`A${probHeader}`).value = 'PROBABILIDAD';
ws1.getCell(`A${probHeader}`).font = { bold: true, size: 10, color: { argb: C.white } };
ws1.getCell(`A${probHeader}`).fill = fill(C.purple2);
ws1.getCell(`A${probHeader}`).alignment = center();

['Valor', 'Nivel', 'Descripción'].forEach((h, i) => {
  const cell = ws1.getCell(probHeader + 1, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 9, color: { argb: C.dark } };
  cell.fill = fill(C.grayLight);
  cell.alignment = center();
  cell.border = border();
});

const probData = [
  [1, 'Muy Baja', 'Improbable (menos del 10%)'],
  [2, 'Baja', 'Poco probable (10%-30%)'],
  [3, 'Media', 'Posible (30%-60%)'],
  [4, 'Alta', 'Probable (60%-80%)'],
  [5, 'Muy Alta', 'Casi seguro (más del 80%)']
];

probData.forEach((p, i) => {
  const row = probHeader + 2 + i;
  p.forEach((v, j) => {
    const cell = ws1.getCell(row, j + 1);
    cell.value = v;
    cell.font = { size: 9, color: { argb: C.dark } };
    cell.alignment = j === 2 ? { vertical: 'middle' } : center();
    cell.border = border();
    if (i % 2 === 0) cell.fill = fill(C.purpleVL);
  });
  // Color the probability value
  ws1.getCell(row, 1).font = { bold: true, size: 10, color: { argb: getProbColor(p[0]) } };
});

// ---- Impact Scale ----
const impStart = probHeader + 2 + probData.length + 1;
ws1.mergeCells(`E${impStart}:G${impStart}`);
ws1.getCell(`E${impStart}`).value = 'IMPACTO';
ws1.getCell(`E${impStart}`).font = { bold: true, size: 10, color: { argb: C.white } };
ws1.getCell(`E${impStart}`).fill = fill(C.purple2);
ws1.getCell(`E${impStart}`).alignment = center();

['Valor', 'Nivel', 'Descripción'].forEach((h, i) => {
  const cell = ws1.getCell(impStart + 1, 5 + i);
  cell.value = h;
  cell.font = { bold: true, size: 9, color: { argb: C.dark } };
  cell.fill = fill(C.grayLight);
  cell.alignment = center();
  cell.border = border();
});

const impData = [
  [1, 'Insignificante', 'Sin efecto en el proyecto'],
  [2, 'Menor', 'Efecto mínimo, fácil de resolver'],
  [3, 'Moderado', 'Afecta cronograma/recursos'],
  [4, 'Grave', 'Pérdida significativa de funcionalidad'],
  [5, 'Catastrófico', 'Falla total del sistema o pérdida de datos']
];

impData.forEach((p, i) => {
  const row = impStart + 2 + i;
  p.forEach((v, j) => {
    const cell = ws1.getCell(row, 5 + j);
    cell.value = v;
    cell.font = { size: 9, color: { argb: C.dark } };
    cell.alignment = j === 2 ? { vertical: 'middle' } : center();
    cell.border = border();
    if (i % 2 === 0) cell.fill = fill(C.purpleVL);
  });
  ws1.getCell(row, 5).font = { bold: true, size: 10, color: { argb: getProbColor(p[0]) } };
});

// ---- Risk Level Scale ----
const riskScaleRow = impStart + 2 + impData.length + 1;
ws1.mergeCells(`A${riskScaleRow}:D${riskScaleRow}`);
ws1.getCell(`A${riskScaleRow}`).value = 'NIVEL DE RIESGO (Probabilidad × Impacto)';
ws1.getCell(`A${riskScaleRow}`).font = { bold: true, size: 10, color: { argb: C.white } };
ws1.getCell(`A${riskScaleRow}`).fill = fill(C.purple2);
ws1.getCell(`A${riskScaleRow}`).alignment = center();

['Rango', 'Nivel', 'Acción Requerida'].forEach((h, i) => {
  const cell = ws1.getCell(riskScaleRow + 1, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 9, color: { argb: C.dark } };
  cell.fill = fill(C.grayLight);
  cell.alignment = center();
  cell.border = border();
});

const scaleData = [
  { range: '1 - 6', level: 'Bajo', action: 'Monitoreo periódico', color: C.low, bg: C.lowBg },
  { range: '7 - 12', level: 'Medio', action: 'Acción preventiva planificada', color: C.medium, bg: C.mediumBg },
  { range: '13 - 18', level: 'Alto', action: 'Acción correctiva prioritaria', color: C.high, bg: C.highBg },
  { range: '19 - 25', level: 'Crítico', action: 'Acción inmediata, requiere atención urgente', color: C.critical, bg: C.criticalBg }
];

scaleData.forEach((s, i) => {
  const row = riskScaleRow + 2 + i;
  [[1, s.range], [2, s.level], [3, s.action]].forEach(([col, val]) => {
    const cell = ws1.getCell(row, col);
    cell.value = val;
    cell.font = { bold: true, size: 9, color: { argb: s.color } };
    cell.alignment = col === 3 ? { vertical: 'middle' } : center();
    cell.border = border();
    cell.fill = fill(s.bg);
  });
});

// ---- TRACKING TABLE ----
const trackStart = riskScaleRow + 2 + scaleData.length + 2;
ws1.mergeCells(`A${trackStart}:I${trackStart}`);
ws1.getCell(`A${trackStart}`).value = 'SEGUIMIENTO DE RIESGOS';
ws1.getCell(`A${trackStart}`).font = { bold: true, size: 13, color: { argb: C.purple } };
ws1.getCell(`A${trackStart}`).fill = fill(C.purpleVL);
ws1.getCell(`A${trackStart}`).alignment = { horizontal: 'center', vertical: 'middle' };
ws1.getRow(trackStart).height = 26;

const trackHeaders = ['#', 'Riesgo', 'Fecha Identificación', 'Estado', 'Última Revisión', 'Acciones Tomadas', '', '', ''];
const trackSpan = [1, 1, 1, 1, 1, 5]; // merge last 4 columns
const trackActualHeaders = ['#', 'Riesgo', 'Fecha Identificación', 'Estado', 'Última Revisión', 'Acciones Tomadas'];

trackActualHeaders.forEach((h, i) => {
  const cell = ws1.getCell(trackStart + 1, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 9, color: { argb: C.white } };
  cell.fill = fill(C.purple);
  cell.alignment = center();
  cell.border = border();
});
// Merge extra columns for "Acciones Tomadas"
ws1.mergeCells(`F${trackStart+1}:I${trackStart+1}`);

const tracking = [
  [1, 'Fuga de información', '16/05/2026', 'Activo', '16/05/2026', 'Pendiente de implementar middleware'],
  [2, 'Pérdida de datos', '16/05/2026', 'Activo', '16/05/2026', 'Backup manual en curso, automatización pendiente'],
  [3, 'Caída del servidor', '16/05/2026', 'Activo', '16/05/2026', 'Evaluando opciones de hosting cloud'],
  [4, 'Baja adopción docentes', '16/05/2026', 'Activo', '16/05/2026', 'Manual de usuario completado, capacitaciones pendientes'],
  [5, 'Escalabilidad', '16/05/2026', 'Activo', '16/05/2026', 'Índices de BD por implementar'],
  [6, 'Seguridad sesiones', '16/05/2026', 'Activo', '16/05/2026', 'Revisión de configuración de cookies pendiente'],
  [7, 'Dependencia desarrollador', '16/05/2026', 'Activo', '16/05/2026', 'Repositorio Git por inicializar']
];

tracking.forEach((t, i) => {
  const row = trackStart + 2 + i;
  t.forEach((v, j) => {
    const cell = ws1.getCell(row, j + 1);
    cell.value = v;
    cell.font = { size: 9, color: { argb: C.dark } };
    cell.alignment = j === 0 || j === 2 || j === 3 || j === 4 ? center() : { vertical: 'middle' };
    cell.border = border();
    if (i % 2 === 0) cell.fill = fill(C.purpleVL);
  });
  // Estado cell
  ws1.getCell(row, 4).font = { bold: true, size: 9, color: { argb: C.high } };
  ws1.getCell(row, 2).font = { bold: true, size: 9, color: { argb: C.dark } };
  ws1.getRow(row).height = 20;
});

// ---- FOOTER ----
const footerRow = trackStart + 2 + tracking.length + 1;
ws1.mergeCells(`A${footerRow}:I${footerRow}`);
ws1.getCell(`A${footerRow}`).value = 'Documento generado para la actividad de Gestión de Proyectos TI - Mayo 2026 | Corporación Universitaria Antonio José de Sucre (UAJS)';
ws1.getCell(`A${footerRow}`).font = { size: 8, italic: true, color: { argb: C.gray } };
ws1.getCell(`A${footerRow}`).alignment = { horizontal: 'center' };


// ======================== SHEET 2: DIAGRAMA GANTT (from existing gantt file logic) ========================
// Skip - user already has this in the other file


// ======================== SAVE ========================
const outputPath = 'C:\\Users\\WinterOS\\Downloads\\LECTORUTA V2.8 PARCHE SEGUIRIDAD BASIC\\GESTION_PROYECTOS\\Lectoruta_Matriz_Riesgos.xlsx';

wb.xlsx.writeFile(outputPath).then(() => {
  console.log('✅ Matriz de Riesgos en Excel creada exitosamente:');
  console.log('   ' + outputPath);
  console.log('\nHojas:');
  console.log('   1. Matriz de Riesgos - 7 riesgos con colores por nivel + escalas + seguimiento');
  console.log('\nFormato:');
  console.log('   - Encabezados morado oscuro (#6D28D9)');
  console.log('   - Probabilidad/Impacto: rojo (alta), amarillo (media), verde (baja)');
  console.log('   - Nivel de riesgo: rojo (crítico), naranja (alto), amarillo (medio), verde (bajo)');
  console.log('   - Filas alternadas en lavanda');
  console.log('   - Bordes finos, texto ajustado, celdas mergadas');
}).catch(err => {
  console.error('Error:', err);
});
