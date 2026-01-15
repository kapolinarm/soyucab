const { queryOne, queryRows, exec } = require("../db/query");
const { parsePaging } = require("../utils/pagin");
const { safeSort } = require("../utils/sort");

async function list(req, res) {
  try {
    const { page, pageSize, offset, limit } = parsePaging(req);
    const q = String(req.query.q || "").trim();
    const { col, dir } = safeSort(req, ["nombre_grupo", "privacidad"], "nombre_grupo", "asc");

    const where = q ? `WHERE (nombre_grupo ILIKE $1 OR descripcion ILIKE $1)` : "";
    const totalRow = await queryOne(`SELECT COUNT(*)::int AS total FROM grupo ${where}`, q ? [`%${q}%`] : []);
    const params = q ? [`%${q}%`, limit, offset] : [limit, offset];

    const rows = await queryRows(
      `SELECT nombre_grupo, descripcion, privacidad
       FROM grupo
       ${where}
       ORDER BY ${col} ${dir}
       LIMIT $${q ? 2 : 1} OFFSET $${q ? 3 : 2}`,
      params
    );

    return res.json({ page, pageSize, total: totalRow?.total || 0, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function create(req, res) {
  try {
    const { nombre_grupo, descripcion, privacidad } = req.body || {};
    if (!nombre_grupo || !descripcion || !privacidad) {
      return res.status(400).json({ error: "nombre_grupo, descripcion, privacidad son obligatorios" });
    }

    await exec(
      `INSERT INTO grupo(nombre_grupo, descripcion, privacidad)
       VALUES ($1,$2,$3)`,
      [nombre_grupo, descripcion, String(privacidad).toUpperCase()]
    );

    // creador queda como ADMIN del grupo
    await exec(
      `INSERT INTO membresia(correo_electronico, nombre_grupo, rol_en_grupo)
       VALUES ($1,$2,'ADMIN')
       ON CONFLICT DO NOTHING`,
      [req.user.sub, nombre_grupo]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { list, create };
