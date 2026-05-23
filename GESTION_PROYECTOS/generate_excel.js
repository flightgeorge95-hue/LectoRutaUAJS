const ExcelJS = require('exceljs');

const PURPLE = '6D28D9';
const PURPLE2 = '7C3AED';
const PURPLE_LIGHT = 'DDD6FE';
const PURPLE_VLIGHT = 'EDE9FE';
const WHITE = 'FFFFFF';
const DARK = '333333';
const GRAY = '888888';
const BORDER = 'B0B0B0';
const ROW_ALT = 'F5F5FF';
const GREEN = '10B981';
const ORANGE = 'F59E0B';
const RED = 'EF4444';

const wb = new ExcelJS.Workbook();
wb.creator = 'Alejandro Montes Pimienta - UAJS';
wb.created = new Date();

function borderStyle() {
  return {
    top: { style: 'thin', color: { argb: BORDER } },
    left: { style: 'thin', color: { argb: BORDER } },
    bottom: { style: 'thin', color: { argb: BORDER } },
    right: { style: 'thin', color: { argb: BORDER } }
  };
}

// ======================== SHEET 1: CRONOGRAMA ========================
const ws1 = wb.addWorksheet('Cronograma Actividades', {
  pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
});

// Title
ws1.mergeCells('A1:H1');
const titleCell = ws1.getCell('A1');
titleCell.value = 'LECTORUTA SABER - CRONOGRAMA DE ACTIVIDADES';
titleCell.font = { bold: true, size: 16, color: { argb: PURPLE } };
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
ws1.getRow(1).height = 30;

ws1.mergeCells('A2:H2');
ws1.getCell('A2').value = 'Proyecto: Implementación de Gestión de Proyectos TI en LectoRuta Saber';
ws1.getCell('A2').font = { size: 11, color: { argb: GRAY } };
ws1.getCell('A2').alignment = { horizontal: 'center' };
ws1.getRow(2).height = 20;

ws1.mergeCells('A3:H3');
ws1.getCell('A3').value = 'Duración: 18 Mayo - 12 Julio 2026 | Responsable: Alejandro Montes Pimienta | UAJS';
ws1.getCell('A3').font = { size: 10, italic: true, color: { argb: GRAY } };
ws1.getCell('A3').alignment = { horizontal: 'center' };

ws1.getRow(4).height = 8;

// Headers
const headers = ['ID', 'Actividad', 'Inicio', 'Fin', 'Duración (días)', 'Dependencias', 'Responsable', 'Estado'];
const headerRow = 5;
headers.forEach((h, i) => {
  const cell = ws1.getCell(headerRow, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 11, color: { argb: WHITE } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = borderStyle();
});
ws1.getRow(headerRow).height = 24;

// Data
const activities = [
  ['A', 'Análisis de requisitos del módulo de gestión de proyectos', '18/05/2026', '23/05/2026', 5, '-', 'Alejandro Montes', 'Pendiente'],
  ['B', 'Identificación y evaluación de riesgos del proyecto', '24/05/2026', '28/05/2026', 5, 'A', 'Alejandro Montes', 'Pendiente'],
  ['C', 'Elaboración de la Matriz de Riesgos', '29/05/2026', '31/05/2026', 3, 'B', 'Alejandro Montes', 'Pendiente'],
  ['D', 'Diseño del cronograma y diagrama de Gantt', '29/05/2026', '02/06/2026', 4, 'B', 'Analista Proyectos', 'Pendiente'],
  ['E', 'Creación y configuración del tablero Trello', '01/06/2026', '04/06/2026', 4, 'A, D', 'Analista Proyectos', 'Pendiente'],
  ['F', 'Implementación de middleware de protección de rutas', '05/06/2026', '14/06/2026', 8, 'C, E', 'Desarrollador Backend', 'Pendiente'],
  ['G', 'Implementación de seguridad en sesiones y cookies', '07/06/2026', '15/06/2026', 7, 'F', 'Desarrollador Full Stack', 'Pendiente'],
  ['H', 'Configuración de backups automatizados en MongoDB', '12/06/2026', '18/06/2026', 5, 'F', 'Administrador BD', 'Pendiente'],
  ['I', 'Optimización de consultas e índices en MongoDB', '15/06/2026', '22/06/2026', 6, 'H', 'Desarrollador Backend', 'Pendiente'],
  ['J', 'Migración a hosting cloud escalable (Vercel/Railway)', '19/06/2026', '28/06/2026', 8, 'H, I', 'DevOps', 'Pendiente'],
  ['K', 'Elaboración de documentación técnica y manuales', '22/06/2026', '30/06/2026', 7, 'I, J', 'Alejandro Montes', 'Pendiente'],
  ['L', 'Pruebas de seguridad y rendimiento', '25/06/2026', '03/07/2026', 7, 'J, K', 'Desarrollador Full Stack', 'Pendiente'],
  ['M', 'Capacitación a docentes y usuarios', '01/07/2026', '08/07/2026', 6, 'K, L', 'Alejandro Montes', 'Pendiente'],
  ['N', 'Despliegue final y cierre del proyecto', '06/07/2026', '12/07/2026', 5, 'L, M', 'Todo el equipo', 'Pendiente']
];

activities.forEach((act, i) => {
  const row = headerRow + 1 + i;
  act.forEach((val, j) => {
    const cell = ws1.getCell(row, j + 1);
    cell.value = val;
    cell.font = { size: 10, color: { argb: DARK } };
    cell.alignment = { vertical: 'middle' };
    cell.border = borderStyle();
    if (j === 0 || j === 4) cell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (j === 7) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, size: 10, color: { argb: ORANGE } };
    }
  });
  if (i % 2 === 0) {
    for (let j = 1; j <= 8; j++) {
      ws1.getCell(row, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_VLIGHT } };
    }
  }
  ws1.getRow(row).height = 22;
});

// Milestones section
const msStart = headerRow + activities.length + 2;
ws1.mergeCells(`A${msStart}:H${msStart}`);
ws1.getCell(`A${msStart}`).value = '★ HITOS DEL PROYECTO';
ws1.getCell(`A${msStart}`).font = { bold: true, size: 13, color: { argb: PURPLE } };
ws1.getCell(`A${msStart}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_VLIGHT } };
ws1.getCell(`A${msStart}`).alignment = { horizontal: 'center', vertical: 'middle' };
ws1.getRow(msStart).height = 26;

const msHeaderRow = msStart + 1;
['Hito', 'Descripción', 'Fecha'].forEach((h, i) => {
  const cell = ws1.getCell(msHeaderRow, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 10, color: { argb: WHITE } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE2 } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = borderStyle();
});

const milestones = [
  ['H1', 'Aprobación de requisitos', '23/05/2026'],
  ['H2', 'Matriz de Riesgos finalizada', '31/05/2026'],
  ['H3', 'Tablero Trello operativo', '04/06/2026'],
  ['H4', 'Middleware de seguridad implementado', '14/06/2026'],
  ['H5', 'Base de datos optimizada', '22/06/2026'],
  ['H6', 'Plataforma migrada a cloud', '28/06/2026'],
  ['H7', 'Pruebas de seguridad superadas', '03/07/2026'],
  ['H8', 'Proyecto completado y desplegado', '12/07/2026']
];

milestones.forEach((m, i) => {
  const row = msHeaderRow + 1 + i;
  ws1.getCell(row, 1).value = m[0];
  ws1.getCell(row, 2).value = m[1];
  ws1.getCell(row, 3).value = m[2];
  [1, 2, 3].forEach(j => {
    const cell = ws1.getCell(row, j);
    cell.font = { size: 10, color: { argb: DARK } };
    cell.border = borderStyle();
    cell.alignment = { vertical: 'middle' };
    if (j !== 2) cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  ws1.getCell(row, 2).font = { bold: true, size: 10, color: { argb: PURPLE } };
  if (i % 2 === 0) {
    [1, 2, 3].forEach(j => {
      ws1.getCell(row, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_VLIGHT } };
    });
  }
});

// Column widths
ws1.getColumn(1).width = 6;
ws1.getColumn(2).width = 54;
ws1.getColumn(3).width = 14;
ws1.getColumn(4).width = 14;
ws1.getColumn(5).width = 16;
ws1.getColumn(6).width = 14;
ws1.getColumn(7).width = 22;
ws1.getColumn(8).width = 14;


// ======================== SHEET 2: DIAGRAMA GANTT ========================
const ws2 = wb.addWorksheet('Diagrama Gantt', {
  pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
});

ws2.mergeCells('A1:J1');
ws2.getCell('A1').value = 'DIAGRAMA DE GANTT - LECTORUTA SABER';
ws2.getCell('A1').font = { bold: true, size: 14, color: { argb: PURPLE } };
ws2.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
ws2.getRow(1).height = 28;

ws2.mergeCells('A2:J2');
ws2.getCell('A2').value = 'Mayo - Julio 2026 | Duración: 8 semanas';
ws2.getCell('A2').font = { size: 10, italic: true, color: { argb: GRAY } };
ws2.getCell('A2').alignment = { horizontal: 'center' };

const ganttRow = 4;
// Headers
const gHeaders = ['ID', 'Actividad', 'S1\nMay 18', 'S2\nMay 25', 'S3\nJun 1', 'S4\nJun 8', 'S5\nJun 15', 'S6\nJun 22', 'S7\nJun 29', 'S8\nJul 6'];
gHeaders.forEach((h, i) => {
  const cell = ws2.getCell(ganttRow, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 9, color: { argb: WHITE } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE } };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = borderStyle();
});
ws2.getRow(ganttRow).height = 36;

// Gantt data: which weeks each activity spans
const ganttData = [
  ['A', 'Análisis requisitos',          [1,0,0,0,0,0,0,0]],
  ['B', 'Identificación riesgos',       [0,1,0,0,0,0,0,0]],
  ['C', 'Matriz de Riesgos',            [0,0,1,0,0,0,0,0]],
  ['D', 'Diseño de Gantt',              [0,0,1,0,0,0,0,0]],
  ['E', 'Tablero Trello',               [0,0,0,1,0,0,0,0]],
  ['F', 'Middleware protección rutas',   [0,0,0,1,1,0,0,0]],
  ['G', 'Seguridad sesiones',            [0,0,0,0,1,0,0,0]],
  ['H', 'Backups MongoDB',               [0,0,0,0,1,0,0,0]],
  ['I', 'Índices MongoDB',               [0,0,0,0,0,1,0,0]],
  ['J', 'Migración Cloud',               [0,0,0,0,0,1,1,0]],
  ['K', 'Documentación técnica',         [0,0,0,0,0,0,1,0]],
  ['L', 'Pruebas seguridad',             [0,0,0,0,0,0,1,1]],
  ['M', 'Capacitación docentes',         [0,0,0,0,0,0,0,1]],
  ['N', 'Despliegue final',              [0,0,0,0,0,0,0,1]]
];

ganttData.forEach((g, i) => {
  const row = ganttRow + 1 + i;
  
  // ID
  const idCell = ws2.getCell(row, 1);
  idCell.value = g[0];
  idCell.font = { bold: true, size: 10, color: { argb: PURPLE } };
  idCell.alignment = { horizontal: 'center', vertical: 'middle' };
  idCell.border = borderStyle();
  
  // Activity
  const actCell = ws2.getCell(row, 2);
  actCell.value = g[1];
  actCell.font = { size: 10, color: { argb: DARK } };
  actCell.alignment = { vertical: 'middle' };
  actCell.border = borderStyle();
  
  // Weeks
  for (let w = 0; w < 8; w++) {
    const cell = ws2.getCell(row, 3 + w);
    cell.border = borderStyle();
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (g[2][w]) {
      cell.value = '■■■■';
      cell.font = { bold: true, size: 10, color: { argb: PURPLE } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_LIGHT } };
    }
  }
  
  if (i % 2 === 0) {
    [1, 2].forEach(j => {
      ws2.getCell(row, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_VLIGHT } };
    });
  }
  ws2.getRow(row).height = 22;
});

// Legend
const legendRow = ganttRow + ganttData.length + 2;
ws2.getCell(legendRow, 1).value = 'Leyenda:';
ws2.getCell(legendRow, 1).font = { bold: true, size: 10, color: { argb: DARK } };

const legendFillCell = ws2.getCell(legendRow, 2);
legendFillCell.value = '  ■■■■  ';
legendFillCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_LIGHT } };
legendFillCell.font = { bold: true, size: 10, color: { argb: PURPLE } };
legendFillCell.alignment = { horizontal: 'center' };
legendFillCell.border = borderStyle();

ws2.getCell(legendRow, 3).value = '= Duración de la actividad en esa semana';
ws2.getCell(legendRow, 3).font = { size: 9, italic: true, color: { argb: GRAY } };

// Dependencies section
const depRow = legendRow + 2;
ws2.getCell(depRow, 1).value = 'Dependencias entre actividades:';
ws2.getCell(depRow, 1).font = { bold: true, size: 10, color: { argb: PURPLE } };
ws2.mergeCells(`A${depRow}:J${depRow}`);

const deps = [
  'A → B → C → F → G   |   A → D → E → F',
  'F → H → I → J → K → L → M → N',
  'B → C, B → D (tareas paralelas)'
];
deps.forEach((d, i) => {
  const cell = ws2.getCell(depRow + 1 + i, 1);
  cell.value = '  ' + d;
  cell.font = { size: 10, color: { argb: DARK } };
});

// Column widths
ws2.getColumn(1).width = 5;
ws2.getColumn(2).width = 24;
for (let i = 3; i <= 10; i++) ws2.getColumn(i).width = 12;


// ======================== SHEET 3: RECURSOS ========================
const ws3 = wb.addWorksheet('Carga Recursos', {
  pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
});

ws3.mergeCells('A1:D1');
ws3.getCell('A1').value = 'DISTRIBUCIÓN DE CARGA POR RECURSO';
ws3.getCell('A1').font = { bold: true, size: 14, color: { argb: PURPLE } };
ws3.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
ws3.getRow(1).height = 28;

// Headers
['Recurso', 'Actividades Asignadas', 'Días Totales', '% del Proyecto'].forEach((h, i) => {
  const cell = ws3.getCell(3, i + 1);
  cell.value = h;
  cell.font = { bold: true, size: 11, color: { argb: WHITE } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = borderStyle();
});

const resources = [
  ['Alejandro Montes (Líder del Proyecto)', 'A, B, C, K, M', 26, '37%'],
  ['Analista de Proyectos', 'D, E', 8, '11%'],
  ['Desarrollador Backend', 'F, H, I', 19, '27%'],
  ['Desarrollador Full Stack', 'G, L', 14, '20%'],
  ['Administrador BD', 'H, I', 11, '16%'],
  ['DevOps', 'J', 8, '11%']
];

resources.forEach((r, i) => {
  const row = 4 + i;
  r.forEach((val, j) => {
    const cell = ws3.getCell(row, j + 1);
    cell.value = val;
    cell.font = { size: 10, color: { argb: DARK } };
    cell.border = borderStyle();
    cell.alignment = { vertical: 'middle' };
    if (j === 0) cell.font = { bold: true, size: 10, color: { argb: DARK } };
    if (j >= 2) cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  if (i % 2 === 0) {
    for (let j = 1; j <= 4; j++) {
      ws3.getCell(row, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE_VLIGHT } };
    }
  }
  ws3.getRow(row).height = 22;
});

// Total
const totalRow = 4 + resources.length;
['TOTAL', '14 actividades', 86, '100%'].forEach((val, j) => {
  const cell = ws3.getCell(totalRow, j + 1);
  cell.value = val;
  cell.font = { bold: true, size: 11, color: { argb: WHITE } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PURPLE2 } };
  cell.border = borderStyle();
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
});

ws3.getColumn(1).width = 32;
ws3.getColumn(2).width = 24;
ws3.getColumn(3).width = 16;
ws3.getColumn(4).width = 16;

// ======================== SAVE ========================
const outputPath = 'C:\\Users\\WinterOS\\Downloads\\LECTORUTA V2.8 PARCHE SEGUIRIDAD BASIC\\GESTION_PROYECTOS\\Lectoruta_Gantt_Cronograma.xlsx';

wb.xlsx.writeFile(outputPath).then(() => {
  console.log('✅ Excel creado exitosamente:');
  console.log('   ' + outputPath);
  console.log('\nHojas:');
  console.log('   1. Cronograma Actividades - Tabla con 14 actividades + 8 hitos');
  console.log('   2. Diagrama Gantt - Visualización semanal con barras');
  console.log('   3. Carga Recursos - Distribución de trabajo por responsable');
}).catch(err => {
  console.error('Error:', err);
});
