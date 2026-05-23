const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel,
  PageOrientation, PageNumber, Header, Footer,
  ShadingType, TableLayoutType, convertInchesToTwip, LevelFormat,
  NumberFormat, TabStopPosition, TabStopType
} = require('docx');

// ===================== CONSTANTS =====================
const PURPLE = '6D28D9';
const PURPLE2 = '7C3AED';
const PURPLE_LIGHT = 'DDD6FE';
const PURPLE_VL = 'EDE9FE';
const DARK = '1F1F1F';
const GRAY = '6B7280';
const WHITE = 'FFFFFF';
const RED = 'DC2626';
const RED_BG = 'FEE2E2';
const ORANGE = 'EA580C';
const ORANGE_BG = 'FFEDD5';
const AMBER = 'CA8A04';
const AMBER_BG = 'FEF9C3';
const GREEN = '16A34A';
const GREEN_BG = 'DCFCE7';
const BORDER_GRAY = 'C8C8C8';

const CONTENT_WIDTH = convertInchesToTwip(6.5);

// ===================== HELPERS =====================
function p(text, opts = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({
      text,
      font: 'Calibri',
      size: opts.size || 22,
      bold: opts.bold || false,
      color: opts.color || DARK,
      italics: opts.italics || false,
    }));
  } else if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === 'string') {
        runs.push(new TextRun({ text: t, font: 'Calibri', size: opts.size || 22, color: opts.color || DARK }));
      } else {
        runs.push(new TextRun({ font: 'Calibri', size: t.size || opts.size || 22, ...t }));
      }
    });
  }
  return new Paragraph({
    children: runs,
    alignment: opts.alignment || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 120 },
    indent: opts.indent,
    heading: opts.heading,
  });
}

function spacer(h = 200) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [] });
}

function cell(text, opts = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({
      text,
      font: 'Calibri',
      size: opts.size || 18,
      bold: opts.bold || false,
      color: opts.color || DARK,
    }));
  } else if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === 'string') {
        runs.push(new TextRun({ text: t, font: 'Calibri', size: opts.size || 18, color: opts.color || DARK }));
      } else {
        runs.push(new TextRun({ font: 'Calibri', size: t.size || opts.size || 18, ...t }));
      }
    });
  }
  return new TableCell({
    children: [new Paragraph({
      children: runs,
      alignment: opts.alignment || AlignmentType.LEFT,
      spacing: { before: 40, after: 40 },
    })],
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    verticalAlign: 'center',
  });
}

function headerRow(cells, bg = PURPLE) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((c) => {
      if (typeof c === 'string') {
        return cell(c, { bold: true, size: 18, color: WHITE, alignment: AlignmentType.CENTER, shading: bg });
      }
      return cell(c.text, { bold: true, size: 18, color: WHITE, alignment: AlignmentType.CENTER, shading: bg, ...c.opts });
    }),
  });
}

function dataRow(cols, alt = false) {
  return new TableRow({
    children: cols.map((c, i) => {
      const bg = alt ? PURPLE_VL : WHITE;
      if (typeof c === 'string') {
        return cell(c, { shading: bg, ...(i === 0 || i === 4 || i === 5 || i === 6 ? { alignment: AlignmentType.CENTER } : {}) });
      }
      const opts = c.opts || {};
      return cell(c.text, { shading: bg, alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, ...opts });
    }),
  });
}

function buildTable(headers, data, colWidths) {
  const rows = [headerRow(headers)];
  data.forEach((d, i) => {
    const cols = d.map((val, j) => {
      if (headers[j] && headers[j].render) {
        return headers[j].render(val, i);
      }
      const cellOpts = {};
      if (j === 0 || j >= headers.length - 1) cellOpts.alignment = AlignmentType.CENTER;
      return { text: String(val), opts: cellOpts };
    });
    rows.push(dataRow(cols, i % 2 === 0));
  });
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: colWidths,
  });
}

// ===================== BUILD DOCUMENT =====================
async function main() {
  const doc = new Document({
    title: 'Parcial 1 - Gestión de Proyectos TI - Lectoruta Saber',
    description: 'Matriz de Riesgos, Diagrama de Gantt y Tablero Trello para LectoRuta Saber',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: DARK },
          paragraph: { spacing: { after: 120 } },
        },
      },
    },
    sections: [
      // ======================== PORTADA ========================
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) },
          },
        },
        children: [
          spacer(2000),
          p('CORPORACIÓN UNIVERSITARIA UNIREMINGTON', {
            bold: true, size: 36, color: PURPLE, alignment: AlignmentType.CENTER, after: 200,
          }),
          p('Facultad de Ingeniería', {
            size: 28, color: GRAY, alignment: AlignmentType.CENTER, after: 200,
          }),
          p('Programa de Ingeniería de Sistemas', {
            size: 26, color: GRAY, alignment: AlignmentType.CENTER, after: 400,
          }),
          spacer(400),
          p('PARCIAL 1', {
            bold: true, size: 44, color: PURPLE, alignment: AlignmentType.CENTER, after: 200,
          }),
          p('GESTIÓN DE PROYECTOS TI', {
            bold: true, size: 32, color: PURPLE2, alignment: AlignmentType.CENTER, after: 100,
          }),
          p('(Gestión de Proyectos Informáticos)', {
            size: 24, color: GRAY, alignment: AlignmentType.CENTER, after: 400,
          }),
          spacer(600),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Plataforma Educativa LectoRuta Saber', font: 'Calibri', size: 26, bold: true, color: PURPLE }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Aplicación de planeación de proyectos informáticos mediante', font: 'Calibri', size: 22, color: DARK }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Matriz de Riesgos, Diagrama de Gantt y Tablero Trello', font: 'Calibri', size: 22, color: DARK }),
            ],
            spacing: { after: 600 },
          }),
          spacer(400),
          p([
            { text: 'Presentado por:', bold: true, size: 22, color: GRAY },
          ], { alignment: AlignmentType.CENTER, after: 60 }),
          p('Alejandro Montes Pimienta', {
            bold: true, size: 26, color: DARK, alignment: AlignmentType.CENTER, after: 300,
          }),
          p([
            { text: 'Docente: ', bold: true, size: 22, color: GRAY },
            { text: 'Alex David Morales Acosta', size: 22, color: DARK },
          ], { alignment: AlignmentType.CENTER, after: 300 }),
          p([
            { text: 'Fecha: ', bold: true, size: 22, color: GRAY },
            { text: 'Mayo 2026', size: 22, color: DARK },
          ], { alignment: AlignmentType.CENTER, after: 100 }),
          spacer(300),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: {
              top: { style: BorderStyle.SINGLE, size: 6, color: PURPLE, space: 8 },
            },
            spacing: { before: 200 },
            children: [],
          }),
        ],
      },

      // ======================== TABLA DE CONTENIDO ========================
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) },
          },
        },
        children: [
          p('TABLA DE CONTENIDO', { bold: true, size: 28, color: PURPLE, alignment: AlignmentType.LEFT, after: 300 }),
          spacer(100),
          ...[
            ['1.', 'Matriz de Riesgos', '3'],
            ['  1.1', 'Identificación de Riesgos', '3'],
            ['  1.2', 'Escalas de Valoración', '6'],
            ['  1.3', 'Seguimiento de Riesgos', '7'],
            ['2.', 'Diagrama de Gantt', '8'],
            ['  2.1', 'Cronograma de Actividades', '8'],
            ['  2.2', 'Dependencias entre Actividades', '10'],
            ['  2.3', 'Distribución de Carga por Recurso', '10'],
            ['3.', 'Tablero Trello', '11'],
            ['  3.1', 'Estructura del Tablero', '11'],
            ['  3.2', 'Instrucciones de Configuración', '12'],
          ].map(([num, title]) =>
            p([
              { text: `${num}  ${title}`, size: 22, color: DARK },
              { text: `  ${'.'.repeat(Math.max(1, 60 - title.length))}  `, size: 22, color: GRAY },
              { text: '', size: 22, color: GRAY },
            ], { before: 60, after: 60 })
          ),
        ],
      },

      // ======================== 1. MATRIZ DE RIESGOS ========================
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) },
          },
        },
        children: [
          p('1. Matriz de Riesgos', { bold: true, size: 28, color: PURPLE, after: 200 }),
          p('A continuación se presentan los riesgos identificados para la plataforma LectoRuta Saber, evaluados según su probabilidad de ocurrencia e impacto potencial en el proyecto.', { size: 22, after: 200 }),

          p('1.1 Identificación y Evaluación de Riesgos', { bold: true, size: 24, color: PURPLE2, after: 150 }),

          // Risk matrix table
          new Table({
            rows: [
              headerRow(['#', 'Riesgo', 'Prob.', 'Imp.', 'Nivel', 'Mitigación', 'Responsable']),
              ...([
                ['1', 'Fuga de información académica', 'Alta (4)', 'Catast. (5)', '20 - Crítico', 'Middleware de protección; 2FA; cifrar datos sensibles; renovación JWT', 'Líder Técnico'],
                ['2', 'Pérdida de datos por falta de backups', 'Media (3)', 'Catast. (5)', '15 - Alto', 'Backups automáticos diarios (mongodump); MongoDB Atlas', 'Admin. BD'],
                ['3', 'Caída del servidor en periodo crítico', 'Media (3)', 'Grave (4)', '12 - Alto', 'Monitoreo Uptime Robot; migrar a cloud (Vercel/Railway)', 'DevOps'],
                ['4', 'Baja adopción por parte de docentes', 'Alta (4)', 'Grave (4)', '16 - Alto', 'Capacitaciones; video-tutoriales; onboarding guiado; feedback UX', 'Líder Proyecto'],
                ['5', 'Problemas de escalabilidad y rendimiento', 'Media (3)', 'Grave (4)', '12 - Alto', 'Índices MongoDB; caché Redis; optimizar consultas; CDN', 'Dllo. Backend'],
                ['6', 'Vulnerabilidades de seguridad en sesiones', 'Alta (4)', 'Grave (4)', '16 - Alto', 'Cookies Secure/HttpOnly/SameSite; expiración sesiones; helmet.js', 'Dllo. Full Stack'],
                ['7', 'Dependencia crítica del desarrollador original', 'Alta (4)', 'Catast. (5)', '20 - Crítico', 'Documentación técnica; repositorio Git; pruebas unitarias', 'Líder Proyecto'],
              ]).map((row, i) => {
                const alt = i % 2 === 0;
                const prob = row[2];
                const imp = row[3];
                const lvl = row[4];
                let levelColor = WHITE, levelBg = PURPLE_VL;
                if (lvl.includes('Crítico')) { levelColor = WHITE; levelBg = RED; }
                else if (lvl.includes('Alto')) { levelColor = WHITE; levelBg = ORANGE; }

                let probColor = DARK, probBg = PURPLE_VL;
                if (prob.includes('Alta')) { probColor = WHITE; probBg = RED; }
                else if (prob.includes('Media')) { probColor = WHITE; probBg = AMBER; }

                let impColor = DARK, impBg = PURPLE_VL;
                if (imp.includes('Catast')) { impColor = WHITE; impBg = RED; }
                else if (imp.includes('Grave')) { impColor = WHITE; impBg = ORANGE; }

                return new TableRow({
                  children: [
                    cell(row[0], { alignment: AlignmentType.CENTER, size: 17, bold: true, shading: alt ? PURPLE_VL : WHITE }),
                    cell(row[1], { size: 17, bold: true, shading: alt ? PURPLE_VL : WHITE }),
                    cell(prob, { alignment: AlignmentType.CENTER, size: 17, bold: true, color: probColor, shading: probBg }),
                    cell(imp, { alignment: AlignmentType.CENTER, size: 17, bold: true, color: impColor, shading: impBg }),
                    cell(lvl, { alignment: AlignmentType.CENTER, size: 17, bold: true, color: levelColor, shading: levelBg }),
                    cell(row[5], { size: 16, shading: alt ? PURPLE_VL : WHITE }),
                    cell(row[6], { alignment: AlignmentType.CENTER, size: 17, bold: true, shading: alt ? PURPLE_VL : WHITE, color: PURPLE }),
                  ],
                });
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            columnWidths: [800, 2800, 1200, 1200, 1400, 3200, 2000],
          }),

          spacer(300),
          p('1.2 Escalas de Valoración', { bold: true, size: 24, color: PURPLE2, after: 150 }),

          // Probability scale
          p('Probabilidad', { bold: true, size: 20, color: PURPLE, after: 100 }),
          new Table({
            rows: [
              headerRow(['Valor', 'Nivel', 'Descripción'], PURPLE2),
              ...[
                ['1', 'Muy Baja', 'Improbable (menos del 10%)'],
                ['2', 'Baja', 'Poco probable (10%-30%)'],
                ['3', 'Media', 'Posible (30%-60%)'],
                ['4', 'Alta', 'Probable (60%-80%)'],
                ['5', 'Muy Alta', 'Casi seguro (más del 80%)'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [1500, 2500, 4500],
          }),

          spacer(200),
          p('Impacto', { bold: true, size: 20, color: PURPLE, after: 100 }),
          new Table({
            rows: [
              headerRow(['Valor', 'Nivel', 'Descripción'], PURPLE2),
              ...[
                ['1', 'Insignificante', 'Sin efecto en el proyecto'],
                ['2', 'Menor', 'Efecto mínimo, fácil de resolver'],
                ['3', 'Moderado', 'Afecta cronograma/recursos'],
                ['4', 'Grave', 'Pérdida significativa de funcionalidad'],
                ['5', 'Catastrófico', 'Falla total del sistema o pérdida de datos'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [1500, 2500, 4500],
          }),

          spacer(200),
          p('Nivel de Riesgo (Probabilidad × Impacto)', { bold: true, size: 20, color: PURPLE, after: 100 }),
          new Table({
            rows: [
              headerRow(['Rango', 'Nivel', 'Acción Requerida'], PURPLE2),
              ...[
                ['1 - 6', 'Bajo', 'Monitoreo periódico'],
                ['7 - 12', 'Medio', 'Acción preventiva planificada'],
                ['13 - 18', 'Alto', 'Acción correctiva prioritaria'],
                ['19 - 25', 'Crítico', 'Acción inmediata, requiere atención urgente'],
              ].map((r, i) => {
                const colors = {
                  'Bajo': { color: GREEN, bg: GREEN_BG },
                  'Medio': { color: AMBER, bg: AMBER_BG },
                  'Alto': { color: ORANGE, bg: ORANGE_BG },
                  'Crítico': { color: RED, bg: RED_BG },
                };
                const c = colors[r[1]] || { color: DARK, bg: WHITE };
                return new TableRow({
                  children: [
                    cell(r[0], { alignment: AlignmentType.CENTER, size: 18, bold: true, shading: c.bg, color: c.color }),
                    cell(r[1], { alignment: AlignmentType.CENTER, size: 18, bold: true, shading: c.bg, color: c.color }),
                    cell(r[2], { size: 18, shading: c.bg, color: c.color }),
                  ],
                });
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [2000, 2000, 4500],
          }),

          spacer(300),
          p('1.3 Seguimiento de Riesgos', { bold: true, size: 24, color: PURPLE2, after: 150 }),
          new Table({
            rows: [
              headerRow(['#', 'Riesgo', 'Fecha Identif.', 'Estado', 'Última Revisión', 'Acciones Tomadas']),
              ...[
                ['1', 'Fuga de información', '16/05/2026', 'Activo', '16/05/2026', 'Pendiente de implementar middleware'],
                ['2', 'Pérdida de datos', '16/05/2026', 'Activo', '16/05/2026', 'Backup manual en curso, automatización pendiente'],
                ['3', 'Caída del servidor', '16/05/2026', 'Activo', '16/05/2026', 'Evaluando opciones de hosting cloud'],
                ['4', 'Baja adopción docentes', '16/05/2026', 'Activo', '16/05/2026', 'Manual completado, capacitaciones pendientes'],
                ['5', 'Escalabilidad', '16/05/2026', 'Activo', '16/05/2026', 'Índices de BD por implementar'],
                ['6', 'Seguridad sesiones', '16/05/2026', 'Activo', '16/05/2026', 'Revisión cookies pendiente'],
                ['7', 'Dependencia desarrollador', '16/05/2026', 'Activo', '16/05/2026', 'Repositorio Git por inicializar'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [800, 2500, 1800, 1200, 1800, 3500],
          }),
        ],
      },

      // ======================== 2. DIAGRAMA DE GANTT ========================
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) },
            orientation: PageOrientation.LANDSCAPE,
          },
        },
        children: [
          p('2. Diagrama de Gantt', { bold: true, size: 28, color: PURPLE, after: 200 }),
          p('Proyecto: Implementación de Gestión de Proyectos TI en LectoRuta Saber', { size: 22, after: 60 }),
          p('Duración: 18 de mayo al 12 de julio de 2026 (8 semanas)', { size: 22, after: 200 }),

          p('2.1 Cronograma de Actividades', { bold: true, size: 24, color: PURPLE2, after: 150 }),

          new Table({
            rows: [
              headerRow(['ID', 'Actividad', 'Inicio', 'Fin', 'Duración', 'Dependencias', 'Responsable']),
              ...[
                ['A', 'Análisis de requisitos del módulo de gestión de proyectos', '18/05/2026', '23/05/2026', '5 días', '-', 'Alejandro Montes'],
                ['B', 'Identificación y evaluación de riesgos del proyecto', '24/05/2026', '28/05/2026', '5 días', 'A', 'Alejandro Montes'],
                ['C', 'Elaboración de la Matriz de Riesgos', '29/05/2026', '31/05/2026', '3 días', 'B', 'Alejandro Montes'],
                ['D', 'Diseño del cronograma y diagrama de Gantt', '29/05/2026', '02/06/2026', '4 días', 'B', 'Analista Proyectos'],
                ['E', 'Creación y configuración del tablero Trello', '01/06/2026', '04/06/2026', '4 días', 'A, D', 'Analista Proyectos'],
                ['F', 'Implementación de middleware de protección de rutas', '05/06/2026', '14/06/2026', '8 días', 'C, E', 'Dllo. Backend'],
                ['G', 'Implementación de seguridad en sesiones y cookies', '07/06/2026', '15/06/2026', '7 días', 'F', 'Dllo. Full Stack'],
                ['H', 'Configuración de backups automatizados en MongoDB', '12/06/2026', '18/06/2026', '5 días', 'F', 'Admin. BD'],
                ['I', 'Optimización de consultas e índices en MongoDB', '15/06/2026', '22/06/2026', '6 días', 'H', 'Dllo. Backend'],
                ['J', 'Migración a hosting cloud escalable', '19/06/2026', '28/06/2026', '8 días', 'H, I', 'DevOps'],
                ['K', 'Elaboración de documentación técnica y manuales', '22/06/2026', '30/06/2026', '7 días', 'I, J', 'Alejandro Montes'],
                ['L', 'Pruebas de seguridad y rendimiento', '25/06/2026', '03/07/2026', '7 días', 'J, K', 'Dllo. Full Stack'],
                ['M', 'Capacitación a docentes y usuarios', '01/07/2026', '08/07/2026', '6 días', 'K, L', 'Alejandro Montes'],
                ['N', 'Despliegue final y cierre del proyecto', '06/07/2026', '12/07/2026', '5 días', 'L, M', 'Todo el equipo'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            columnWidths: [600, 4000, 1200, 1200, 1000, 1200, 1800],
          }),

          spacer(300),
          p('2.2 Dependencias entre Actividades', { bold: true, size: 24, color: PURPLE2, after: 150 }),
          p([
            { text: 'A → B → C → F → G', bold: true, size: 22, color: PURPLE },
            { text: '   |   ', size: 22, color: GRAY },
            { text: 'A → D → E → F', bold: true, size: 22, color: PURPLE },
          ], { after: 100 }),
          p([
            { text: 'F → H → I → J → K → L → M → N', bold: true, size: 22, color: PURPLE },
          ], { after: 100 }),
          p([
            { text: 'B → C', bold: true, size: 22, color: PURPLE },
            { text: ' y ', size: 22, color: GRAY },
            { text: 'B → D', bold: true, size: 22, color: PURPLE },
            { text: ' (actividades paralelas, no tienen dependencia entre sí)', size: 22, color: GRAY },
          ], { after: 200 }),

          spacer(200),
          p('Hitos del Proyecto', { bold: true, size: 22, color: PURPLE, after: 100 }),
          new Table({
            rows: [
              headerRow(['Hito', 'Descripción', 'Fecha'], PURPLE2),
              ...[
                ['H1', 'Aprobación de requisitos', '23/05/2026'],
                ['H2', 'Matriz de Riesgos finalizada', '31/05/2026'],
                ['H3', 'Tablero Trello operativo', '04/06/2026'],
                ['H4', 'Middleware de seguridad implementado', '14/06/2026'],
                ['H5', 'Base de datos optimizada', '22/06/2026'],
                ['H6', 'Plataforma migrada a cloud', '28/06/2026'],
                ['H7', 'Pruebas de seguridad superadas', '03/07/2026'],
                ['H8', 'Proyecto completado y desplegado', '12/07/2026'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [2000, 5000, 2000],
          }),

          spacer(300),
          p('2.3 Distribución de Carga por Recurso', { bold: true, size: 24, color: PURPLE2, after: 150 }),
          new Table({
            rows: [
              headerRow(['Recurso', 'Actividades', 'Días', '%']),
              ...[
                ['Alejandro Montes (Líder del Proyecto)', 'A, B, C, K, M', '26', '37%'],
                ['Analista de Proyectos', 'D, E', '8', '11%'],
                ['Desarrollador Backend', 'F, H, I', '19', '27%'],
                ['Desarrollador Full Stack', 'G, L', '14', '20%'],
                ['Administrador BD', 'H, I', '11', '16%'],
                ['DevOps', 'J', '8', '11%'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
              new TableRow({
                children: [
                  cell('TOTAL', { bold: true, size: 20, color: WHITE, alignment: AlignmentType.CENTER, shading: PURPLE2 }),
                  cell('14 actividades', { bold: true, size: 20, color: WHITE, alignment: AlignmentType.CENTER, shading: PURPLE2 }),
                  cell('86', { bold: true, size: 20, color: WHITE, alignment: AlignmentType.CENTER, shading: PURPLE2 }),
                  cell('100%', { bold: true, size: 20, color: WHITE, alignment: AlignmentType.CENTER, shading: PURPLE2 }),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [3500, 2500, 1200, 1200],
          }),
        ],
      },

      // ======================== 3. TABLERO TRELLO ========================
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) },
          },
        },
        children: [
          p('3. Tablero Trello', { bold: true, size: 28, color: PURPLE, after: 200 }),
          p('Para la organización y seguimiento del proyecto se implementó un tablero en Trello con la siguiente estructura.', { size: 22, after: 200 }),

          p('3.1 Estructura del Tablero', { bold: true, size: 24, color: PURPLE2, after: 150 }),

          p('Tablero: "Lectoruta - Gestión de Proyectos TI"', { bold: true, size: 20, color: PURPLE, after: 100 }),

          // Lista 1
          p('📋 Lista 1: Pendientes (Backlog)', { bold: true, size: 20, color: PURPLE2, after: 100 }),
          new Table({
            rows: [
              headerRow(['#', 'Tarjeta', 'Responsable', 'Fecha Límite']),
              ...[
                ['1', 'Analizar requisitos del módulo de gestión de proyectos', 'Alejandro Montes', '23/05/2026'],
                ['2', 'Identificar riesgos del proyecto (mín 5)', 'Alejandro Montes', '28/05/2026'],
                ['3', 'Elaborar matriz de riesgos formal', 'Alejandro Montes', '31/05/2026'],
                ['4', 'Diseñar diagrama de Gantt con dependencias', 'Analista Proyectos', '02/06/2026'],
                ['5', 'Configurar tablero Trello con listas y tarjetas', 'Analista Proyectos', '04/06/2026'],
                ['6', 'Implementar middleware de protección de rutas Next.js', 'Dllo. Backend', '14/06/2026'],
                ['7', 'Configurar cookies Secure, HttpOnly y SameSite', 'Dllo. Full Stack', '15/06/2026'],
                ['8', 'Implementar backups automatizados con mongodump', 'Admin. BD', '18/06/2026'],
                ['9', 'Crear índices compuestos en MongoDB', 'Dllo. Backend', '22/06/2026'],
                ['10', 'Migrar plataforma a hosting cloud (Vercel/Railway)', 'DevOps', '28/06/2026'],
                ['11', 'Documentar API endpoints y arquitectura del sistema', 'Alejandro Montes', '30/06/2026'],
                ['12', 'Realizar pruebas de seguridad y penetración', 'Dllo. Full Stack', '03/07/2026'],
                ['13', 'Capacitar a docentes en uso de la plataforma', 'Alejandro Montes', '08/07/2026'],
                ['14', 'Despliegue final y cierre del proyecto', 'Todo el equipo', '12/07/2026'],
              ].map((r, i) => dataRow(r, i % 2 === 0)),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [600, 5000, 2000, 1600],
          }),

          spacer(200),
          p('🔄 Lista 2: En Proceso (In Progress)', { bold: true, size: 20, color: PURPLE2, after: 100 }),
          p('Las tarjetas se mueven a esta lista cuando se comienza a trabajar en ellas.', { size: 20, after: 100 }),

          spacer(100),
          p('✅ Lista 3: Finalizadas (Done)', { bold: true, size: 20, color: PURPLE2, after: 100 }),
          p('Las tarjetas se mueven a esta lista al completar la tarea.', { size: 20, after: 200 }),

          spacer(200),
          p('3.2 Instrucciones de Configuración', { bold: true, size: 24, color: PURPLE2, after: 150 }),

          ...[
            '1. Ingresa a https://trello.com y crea una cuenta gratuita.',
            '2. Haz clic en "Crear tablero", nómbralo "Lectoruta - Gestión de Proyectos TI" y elige fondo púrpura.',
            '3. Crea las 3 listas: Pendientes (Backlog), En Proceso (In Progress), Finalizadas (Done).',
            '4. Crea las 14 tarjetas en la lista Pendientes con los nombres de la tabla anterior.',
            '5. Abre cada tarjeta y agrega: Miembro responsable, Fecha de vencimiento y Etiqueta de categoría.',
            '6. Las etiquetas sugeridas por categoría: 📝Análisis (azul), ⚠️Riesgos (rojo), 📊Planificación (verde), 🎯Seguimiento (amarillo), 🔒Seguridad (naranja), 🗄️BD (púrpura), ☁️Infraestructura (cian), 📖Documentación (gris), 🧪Testing (verde lima), 📚Capacitación (rosa), 🚀Despliegue (azul oscuro).',
            '7. Comparte el tablero: botón "Compartir" → visibilidad "Cualquier persona con el enlace" → copia el enlace.',
            '8. Toma capturas de pantalla: vista general del tablero + detalle de una tarjeta.',
          ].map(line =>
            p(line, { size: 20, after: 60, indent: { left: convertInchesToTwip(0.3) } })
          ),

          spacer(300),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: {
              top: { style: BorderStyle.SINGLE, size: 6, color: PURPLE, space: 8 },
            },
            spacing: { before: 200 },
            children: [],
          }),
          p('Documento generado para la actividad de Gestión de Proyectos TI - Mayo 2026', {
            size: 18, color: GRAY, alignment: AlignmentType.CENTER, after: 60,
          }),
          p('Corporación Universitaria Uniremington | Alejandro Montes Pimienta', {
            size: 18, color: GRAY, alignment: AlignmentType.CENTER, after: 0,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = 'C:\\Users\\WinterOS\\Downloads\\LECTORUTA V2.8 PARCHE SEGUIRIDAD BASIC\\GESTION_PROYECTOS\\Parcial1_Gestion_Proyectos_Lectoruta.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Word generado exitosamente:');
  console.log('   ' + outputPath);
  console.log('\nEstructura del documento:');
  console.log('   1. Portada (Uniremington, materia, estudiante, docente)');
  console.log('   2. Tabla de contenido');
  console.log('   3. Matriz de Riesgos (7 riesgos, escalas, seguimiento)');
  console.log('   4. Diagrama de Gantt (14 actividades, dependencias, hitos, carga recursos)');
  console.log('   5. Tablero Trello (estructura, 14 tarjetas, instrucciones)');
}

main().catch(console.error);
