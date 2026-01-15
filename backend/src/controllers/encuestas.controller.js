const { queryRows } = require("../db/query");

async function list(req, res) {
  const rows = await queryRows(
    `SELECT titulo_encuesta, fecha_creacion, nombre_dependencia
     FROM encuesta_institucional
     ORDER BY fecha_creacion DESC, titulo_encuesta ASC`
  );
  return res.json({ rows });
}

module.exports = { list };
