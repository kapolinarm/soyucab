const { queryRows } = require("../db/query");

async function list(req, res) {
  const rows = await queryRows(
    `SELECT nombre_evento, fecha_inicio, ubicacion, cupos, descripcion
     FROM evento
     ORDER BY fecha_inicio DESC, nombre_evento ASC`
  );
  return res.json({ rows });
}

module.exports = { list };
