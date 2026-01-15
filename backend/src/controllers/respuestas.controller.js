const { exec, queryRows } = require("../db/query");

async function responder(req, res) {
  const { titulo_encuesta, fecha_creacion, contenido_respuesta } = req.body || {};
  if (!titulo_encuesta || !fecha_creacion || !contenido_respuesta) {
    return res.status(400).json({ error: "titulo_encuesta, fecha_creacion, contenido_respuesta son obligatorios" });
  }

  await exec(
    `INSERT INTO respuesta_encuesta(correo_electronico, titulo_encuesta, fecha_creacion, contenido_respuesta)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT DO NOTHING`,
    [req.user.sub, titulo_encuesta, fecha_creacion, contenido_respuesta]
  );

  return res.status(201).json({ ok: true });
}

async function misRespuestas(req, res) {
  const rows = await queryRows(
    `SELECT * FROM respuesta_encuesta
     WHERE correo_electronico=$1
     ORDER BY fecha_creacion DESC`,
    [req.user.sub]
  );
  return res.json({ rows });
}

module.exports = { responder, misRespuestas };
