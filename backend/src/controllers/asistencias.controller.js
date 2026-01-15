const { exec, queryRows } = require("../db/query");

async function inscribirse(req, res) {
  const { nombre_evento, fecha_inicio } = req.body || {};
  if (!nombre_evento || !fecha_inicio) {
    return res.status(400).json({ error: "nombre_evento y fecha_inicio son obligatorios" });
  }

  await exec(
    `INSERT INTO asistencia_de_evento(correo_electronico, nombre_evento, fecha_inicio, estado_asistencia)
     VALUES ($1,$2,$3,'CONFIRMADO')
     ON CONFLICT DO NOTHING`,
    [req.user.sub, nombre_evento, fecha_inicio]
  );

  return res.status(201).json({ ok: true });
}

async function misAsistencias(req, res) {
  const rows = await queryRows(
    `SELECT * FROM asistencia_de_evento
     WHERE correo_electronico=$1
     ORDER BY fecha_inicio DESC`,
    [req.user.sub]
  );
  return res.json({ rows });
}

module.exports = { inscribirse, misAsistencias };
