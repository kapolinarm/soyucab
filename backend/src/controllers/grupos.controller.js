const { queryRows, queryOne } = require("../db/query");

async function list(req, res) {
  const rows = await queryRows(
    `SELECT g.nombre_grupo, g.descripcion, g.privacidad,
            (SELECT COUNT(*)::int FROM membresia m WHERE m.nombre_grupo=g.nombre_grupo) AS miembros
     FROM grupo g
     ORDER BY miembros DESC, g.nombre_grupo ASC`
  );
  return res.json({ rows });
}

async function detail(req, res) {
  const g = await queryOne(
    `SELECT g.nombre_grupo, g.descripcion, g.privacidad
     FROM grupo g WHERE g.nombre_grupo=$1`,
    [req.params.grupo]
  );
  if (!g) return res.status(404).json({ error: "Grupo no existe" });
  return res.json(g);
}

module.exports = { list, detail };
