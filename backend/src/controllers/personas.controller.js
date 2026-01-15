const { queryOne, queryRows, exec } = require("../db/query");
const { parsePaging } = require("../utils/pagin");
const { safeSort } = require("../utils/sort");

async function list(req, res) {
  try {
    const { page, pageSize, offset, limit } = parsePaging(req);
    const q = String(req.query.q || "").trim();
    const { col, dir } = safeSort(req, ["correo_electronico", "nombres", "apellidos", "total_puntos"], "correo_electronico", "asc");

    const where = q ? `WHERE (correo_electronico ILIKE $1 OR nombres ILIKE $1 OR apellidos ILIKE $1)` : "";
    const totalRow = await queryOne(`SELECT COUNT(*)::int AS total FROM persona ${where}`, q ? [`%${q}%`] : []);
    const params = q ? [`%${q}%`, limit, offset] : [limit, offset];

    const rows = await queryRows(
      `SELECT correo_electronico, nombres, apellidos, fecha_nacimiento, url_foto, biografia, total_puntos
       FROM persona
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

async function getOne(req, res) {
  try {
    const p = await queryOne(
      `SELECT correo_electronico, nombres, apellidos, fecha_nacimiento, url_foto, biografia, total_puntos
       FROM persona WHERE correo_electronico=$1`,
      [req.params.correo]
    );
    if (!p) return res.status(404).json({ error: "No existe" });
    return res.json(p);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function update(req, res) {
  try {
    const { nombres, apellidos, fecha_nacimiento, url_foto, biografia } = req.body || {};
    await exec(
      `UPDATE persona
       SET nombres = COALESCE($2, nombres),
           apellidos = COALESCE($3, apellidos),
           fecha_nacimiento = COALESCE($4, fecha_nacimiento),
           url_foto = COALESCE($5, url_foto),
           biografia = COALESCE($6, biografia)
       WHERE correo_electronico=$1`,
      [req.params.correo, nombres || null, apellidos || null, fecha_nacimiento || null, url_foto || null, biografia || null]
    );
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { list, getOne, update };
