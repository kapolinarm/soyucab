const { queryRows, exec } = require("../db/query");

async function listByEncuesta(req, res) {
  try {
    const { titulo_encuesta, fecha_creacion } = req.query || {};
    if (!titulo_encuesta || !fecha_creacion) {
      return res.status(400).json({ error: "Query params requeridos: titulo_encuesta, fecha_creacion" });
    }

    const rows = await queryRows(
      `SELECT r.correo_electronico, p.nombres, p.apellidos, r.contenido_respuesta
       FROM respuesta_encuesta r
       JOIN persona p ON p.correo_electronico = r.correo_electronico
       WHERE r.titulo_encuesta=$1 AND r.fecha_creacion=$2
       ORDER BY p.apellidos ASC`,
      [titulo_encuesta, fecha_creacion]
    );

    return res.json({ titulo_encuesta, fecha_creacion, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function upsert(req, res) {
  try {
    const { titulo_encuesta, fecha_creacion, contenido_respuesta } = req.body || {};
    if (!titulo_encuesta || !fecha_creacion || !contenido_respuesta) {
      return res.status(400).json({ error: "titulo_encuesta, fecha_creacion, contenido_respuesta son obligatorios" });
    }

    await exec(
      `INSERT INTO respuesta_encuesta(correo_electronico, titulo_encuesta, fecha_creacion, contenido_respuesta)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (correo_electronico, titulo_encuesta, fecha_creacion)
       DO UPDATE SET contenido_respuesta = EXCLUDED.contenido_respuesta`,
      [req.user.sub, titulo_encuesta, fecha_creacion, contenido_respuesta]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { listByEncuesta, upsert };
