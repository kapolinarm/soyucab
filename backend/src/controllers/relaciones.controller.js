const { queryRows, exec } = require("../db/query");

async function list(req, res) {
  const rows = await queryRows(
    `SELECT * FROM relacion_de_personas
     WHERE correo_solicitante=$1 OR correo_receptor=$1
     ORDER BY fecha_solicitud DESC`,
    [req.user.sub]
  );
  return res.json({ rows });
}

async function solicitar(req, res) {
  const { correo_receptor } = req.body || {};
  if (!correo_receptor) return res.status(400).json({ error: "correo_receptor es obligatorio" });

  await exec(
    `INSERT INTO relacion_de_personas(correo_solicitante, correo_receptor, fecha_solicitud, estado)
     VALUES ($1,$2, CURRENT_DATE, 'PENDIENTE')
     ON CONFLICT DO NOTHING`,
    [req.user.sub, correo_receptor]
  );
  return res.status(201).json({ ok: true });
}

async function aceptar(req, res) {
  const { correo_solicitante } = req.body || {};
  if (!correo_solicitante) return res.status(400).json({ error: "correo_solicitante es obligatorio" });

  await exec(
    `UPDATE relacion_de_personas
     SET estado='ACEPTADA'
     WHERE correo_solicitante=$1 AND correo_receptor=$2`,
    [correo_solicitante, req.user.sub]
  );
  return res.json({ ok: true });
}

module.exports = { list, solicitar, aceptar };
