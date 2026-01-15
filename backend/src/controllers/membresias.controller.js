const { queryRows, exec } = require("../db/query");

async function listByGrupo(req, res) {
  const rows = await queryRows(
    `SELECT m.correo_electronico, m.rol_en_grupo, p.nombres, p.apellidos
     FROM membresia m
     JOIN persona p ON p.correo_electronico = m.correo_electronico
     WHERE m.nombre_grupo=$1
     ORDER BY m.rol_en_grupo DESC, p.apellidos ASC`,
    [req.params.grupo]
  );
  return res.json({ grupo: req.params.grupo, rows });
}

async function join(req, res) {
  const { nombre_grupo } = req.body || {};
  if (!nombre_grupo) return res.status(400).json({ error: "nombre_grupo es obligatorio" });

  await exec(
    `INSERT INTO membresia(correo_electronico, nombre_grupo, rol_en_grupo)
     VALUES ($1,$2,'MIEMBRO')
     ON CONFLICT DO NOTHING`,
    [req.user.sub, nombre_grupo]
  );
  return res.status(201).json({ ok: true });
}

async function leave(req, res) {
  await exec(
    `DELETE FROM membresia WHERE correo_electronico=$1 AND nombre_grupo=$2`,
    [req.user.sub, req.params.grupo]
  );
  return res.json({ ok: true });
}

module.exports = { listByGrupo, join, leave };
