const Reportes = require("../services/reportes.service");
const { renderPdfFromHtml } = require("../services/jsreport.service");
const { toTable } = require("../utils/html");

async function run(res, name, rowsPromise, format) {
  const rows = await rowsPromise;
  if (format === "pdf") {
    const html = toTable(`Reporte: ${name}`, rows);
    const pdf = await renderPdfFromHtml(html);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${name}.pdf"`);
    return res.send(pdf);
  }
  return res.json({ rows });
}

async function crecimiento(req, res) {
  return run(res, "crecimiento", Reportes.crecimiento(), req.query.format);
}
async function interaccion(req, res) {
  return run(res, "interaccion", Reportes.interaccion(), req.query.format);
}
async function topGrupos(req, res) {
  return run(res, "top_grupos", Reportes.topGrupos(), req.query.format);
}
async function eventosAsistencia(req, res) {
  return run(res, "eventos_asistencia", Reportes.eventosAsistencia(), req.query.format);
}
async function egresadosGeo(req, res) {
  return run(res, "egresados_geo", Reportes.egresadosGeo(), req.query.format);
}

module.exports = { crecimiento, interaccion, topGrupos, eventosAsistencia, egresadosGeo };
