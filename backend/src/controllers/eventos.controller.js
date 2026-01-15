const { queryOne, queryRows, exec } = require("../db/query");
const { parsePaging } = require("../utils/pagin");
const { safeSort } = require("../utils/sort");

async function list(req, res) {
  try {
    const { page, pageSize, offset, limit } = parsePaging(req);
    const { col, dir } = safeSort(req, ["fecha_inicio", "nombre_evento", "ubicacion"], "fecha_inicio", "desc");

    const totalRow = await queryOne(`SELECT COUNT(*)::int AS total FROM evento`);
    const rows = await queryRows(
      `SELECT nombre_evento, fecha_inicio, ubicacion, nombre_dependencia, razon_social
       FROM evento
       ORDER BY ${col} ${dir}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.json({ page, pageSize, total: totalRow?.total || 0, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function create(req, res) {
  try {
    // si quieres restringir creación de eventos:
    // if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Solo ADMIN puede crear eventos" });

    const { nombre_evento, fecha_inicio, ubicacion, nombre_dependencia, razon_social } = req.body || {};
    if (!nombre_evento || !fecha_inicio || !ubicacion) {
      return res.status(400).json({ error: "nombre_evento, fecha_inicio, ubicacion son obligatorios" });
    }

    await exec(
      `INSERT INTO evento(nombre_evento, fecha_inicio, ubicacion, nombre_dependencia, razon_social)
       VALUES ($1,$2,$3,$4,$5)`,
      [nombre_evento, fecha_inicio, ubicacion, nombre_dependencia || null, razon_social || null]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { list, create };
