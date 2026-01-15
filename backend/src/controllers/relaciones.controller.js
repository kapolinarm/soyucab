const { queryRows, exec } = require("../db/query");

async function listMine(req, res) {
  try {
    const rows = await queryRows(
      `SELECT correo_solicitante, correo_receptor, tipo_relacion, fecha_inicio, estado
       FROM relacion_de_personas
       WHERE correo_solicitante=$1 OR correo_receptor=$1
       ORDER BY fecha_inicio DESC`,
      [req.user.sub]
    );
    return res.json({ rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function create(req, res) {
  try {
    const { correo_receptor, tipo_relacion } = req.body || {};
    if (!correo_receptor || !tipo_relacion) {
      return res.status(400).json({ error: "correo_receptor y tipo_relacion son obligatorios" });
    }

    await exec(
      `INSERT INTO relacion_de_personas(correo_solicitante, correo_receptor, tipo_relacion, fecha_inicio, estado)
       VALUES ($1,$2,$3,CURRENT_DATE,'PENDIENTE')
       ON CONFLICT (correo_solicitante, correo_receptor) DO NOTHING`,
      [req.user.sub, correo_receptor, tipo_relacion]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    // si viola chk_relacion_distintos, cae aquí
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function changeEstado(req, res) {
  try {
    const { correo_solicitante, correo_receptor, estado } = req.body || {};
    const est = String(estado || "").toUpperCase();

    if (!correo_solicitante || !correo_receptor || !["ACEPTADA", "RECHAZADA", "BLOQUEADA"].includes(est)) {
      return res.status(400).json({ error: "Body: correo_solicitante, correo_receptor, estado(ACEPTADA/RECHAZADA/BLOQUEADA)" });
    }

    // solo receptor o ADMIN
    if (req.user.role !== "ADMIN" && req.user.sub !== correo_receptor) {
      return res.status(403).json({ error: "Solo el receptor puede cambiar el estado" });
    }

    await exec(
      `UPDATE relacion_de_personas
       SET estado=$3
       WHERE correo_solicitante=$1 AND correo_receptor=$2`,
      [correo_solicitante, correo_receptor, est]
    );

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { listMine, create, changeEstado };
