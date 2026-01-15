const { queryRows } = require("../db/query");
const { reportLayoutHtml } = require("../utils/reports");
const { renderWithJsreport } = require("../services/reportes.service");

function getFormat(req) {
  const f = String(req.query.format || "pdf").toLowerCase();
  return (f === "html") ? "html" : "pdf";
}

function sendReport(res, format, filename, payload) {
  res.setHeader("Content-Type", format === "pdf" ? "application/pdf" : "text/html; charset=utf-8");
  res.setHeader("Content-Disposition", `inline; filename="${filename}.${format}"`);
  res.send(payload);
}

async function crecimiento(req, res) {
  try {
    const format = getFormat(req);
    const rows = await queryRows(`
      SELECT mes, tipo, nuevos_registros
      FROM vw_reporte_crecimiento_registros_mes
      ORDER BY mes ASC, tipo ASC
    `);

    const columns = ["mes", "tipo", "nuevos_registros"];
    const templateContent = reportLayoutHtml("Reporte: Crecimiento", "Nuevos registros por mes y tipo", columns);

    const payload = await renderWithJsreport({
      templateContent,
      data: { rows, generatedAt: new Date().toISOString() },
      format,
      reportName: "reporte_crecimiento"
    });

    return sendReport(res, format, "reporte_crecimiento", payload);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function interaccion(req, res) {
  try {
    const format = getFormat(req);
    const limit = Math.min(Number(req.query.limit || 20), 200);

    const rows = await queryRows(
      `
      SELECT correo_electronico, nombres, apellidos,
             conexiones_aceptadas, grupos_participa, eventos_registrado, encuestas_respondidas,
             score_interaccion
      FROM vw_reporte_interaccion_usuarios
      ORDER BY score_interaccion DESC, conexiones_aceptadas DESC
      LIMIT $1
      `,
      [limit]
    );

    const columns = [
      "correo_electronico", "nombres", "apellidos",
      "conexiones_aceptadas", "grupos_participa", "eventos_registrado", "encuestas_respondidas",
      "score_interaccion"
    ];
    const templateContent = reportLayoutHtml("Reporte: Interacción", "Top usuarios por conexiones + participación", columns);

    const payload = await renderWithJsreport({
      templateContent,
      data: { rows, generatedAt: new Date().toISOString() },
      format,
      reportName: "reporte_interaccion"
    });

    return sendReport(res, format, "reporte_interaccion", payload);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function grupos(req, res) {
  try {
    const format = getFormat(req);
    const limit = Math.min(Number(req.query.limit || 20), 200);

    const rows = await queryRows(
      `
      SELECT nombre_grupo, privacidad, miembros
      FROM vw_reporte_top_grupos_miembros
      ORDER BY miembros DESC, nombre_grupo ASC
      LIMIT $1
      `,
      [limit]
    );

    const columns = ["nombre_grupo", "privacidad", "miembros"];
    const templateContent = reportLayoutHtml("Reporte: Grupos", "Top grupos por miembros", columns);

    const payload = await renderWithJsreport({
      templateContent,
      data: { rows, generatedAt: new Date().toISOString() },
      format,
      reportName: "reporte_grupos"
    });

    return sendReport(res, format, "reporte_grupos", payload);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function eventos(req, res) {
  try {
    const format = getFormat(req);

    const rows = await queryRows(`
      SELECT nombre_evento, fecha_inicio, ubicacion,
             total_registros, total_asistio, total_confirmado, total_no_asistio,
             tasa_asistencia_pct
      FROM vw_reporte_eventos_asistencia
      ORDER BY fecha_inicio DESC, nombre_evento ASC
    `);

    const columns = [
      "nombre_evento", "fecha_inicio", "ubicacion",
      "total_registros", "total_asistio", "total_confirmado", "total_no_asistio",
      "tasa_asistencia_pct"
    ];
    const templateContent = reportLayoutHtml("Reporte: Eventos", "Asistencia por evento + tasa (%)", columns);

    const payload = await renderWithJsreport({
      templateContent,
      data: { rows, generatedAt: new Date().toISOString() },
      format,
      reportName: "reporte_eventos"
    });

    return sendReport(res, format, "reporte_eventos", payload);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function egresados(req, res) {
  try {
    const format = getFormat(req);

    const rows = await queryRows(`
      SELECT region_pais, nombre_capitulo, pais, ciudad
      FROM vw_reporte_egresados_distribucion_geografica
      ORDER BY region_pais ASC, pais ASC, ciudad ASC
    `);

    const columns = ["region_pais", "nombre_capitulo", "pais", "ciudad"];
    const templateContent = reportLayoutHtml("Reporte: Egresados", "Distribución geográfica", columns);

    const payload = await renderWithJsreport({
      templateContent,
      data: { rows, generatedAt: new Date().toISOString() },
      format,
      reportName: "reporte_egresados"
    });

    return sendReport(res, format, "reporte_egresados", payload);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { crecimiento, interaccion, grupos, eventos, egresados };
