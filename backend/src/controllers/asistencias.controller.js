const { queryRows, exec } = require("../db/query");

async function listByEvento(req, res) {
  try {
    const { nombre_evento, fecha_inicio } = req.query || {};
    if (!nombre_evento || !fecha_inicio) {
      return res.status(400).json({ error: "Query params requeridos: nombre_evento, fecha_inicio" });
    }

    const rows = await queryRows(
      `SELECT a.correo_electronico, a.estado_asistencia, p.nombres, p.apellidos
       FROM asistencia_de_evento a
       JOIN persona p ON p.correo_electronico = a.correo_electronico
       WHERE a.nombre_evento=$1 AND a.fecha_inicio=$2
       ORDER BY p.apellidos ASC`,
      [nombre_evento, fecha_inicio]
    );

    return res.json({ nombre_evento, fecha_inicio, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function upsert(req, res) {
  try {
    const { nombre_evento, fecha_inicio, estado_asistencia } = req.body || {};
    if (!nombre_evento || !fecha_inicio || !estado_asistencia) {
      return res.status(400).json({ error: "nombre_evento, fecha_inicio, estado_asistencia son obligatorios" });
    }

    await exec(
      `INSERT INTO asistencia_de_evento(correo_electronico, nombre_evento, fecha_inicio, estado_asistencia)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (correo_electronico, nombre_evento, fecha_inicio)
       DO UPDATE SET estado_asistencia = EXCLUDED.estado_asistencia`,
      [req.user.sub, nombre_evento, fecha_inicio, String(estado_asistencia).toUpperCase()]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    // si viola chk_asistencia_estado, cae aquí
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { listByEvento, upsert };
