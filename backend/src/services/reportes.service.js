const { queryRows } = require("../db/query");

async function crecimiento() {
  return queryRows(`SELECT * FROM vw_reporte_crecimiento_registros_mes ORDER BY mes DESC, tipo ASC`);
}

async function interaccion() {
  return queryRows(`SELECT * FROM vw_reporte_interaccion_usuarios ORDER BY score_interaccion DESC, correo_electronico ASC LIMIT 50`);
}

async function topGrupos() {
  return queryRows(`SELECT * FROM vw_reporte_top_grupos_miembros`);
}

async function eventosAsistencia() {
  return queryRows(`SELECT * FROM vw_reporte_eventos_asistencia`);
}

async function egresadosGeo() {
  return queryRows(`SELECT * FROM vw_reporte_egresados_distribucion_geografica`);
}

module.exports = { crecimiento, interaccion, topGrupos, eventosAsistencia, egresadosGeo };
