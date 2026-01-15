const { queryRows, queryOne, exec } = require("../db/query");
const { getPaging } = require("../utils/paging");

async function me(req, res) {
  const p = await queryOne(
    `SELECT correo_electronico, nombres, apellidos, fecha_nacimiento, url_foto, biografia, total_puntos
     FROM persona WHERE correo_electronico=$1`,
    [req.user.sub]
  );
  return res.json(p);
}

async function updateMe(req, res) {
  const { nombres, apellidos, fecha_nacimiento, url_foto, biografia } = req.body || {};
  await exec(
    `UPDATE persona
     SET nombres=COALESCE($2,nombres),
         apellidos=COALESCE($3,apellidos),
         fecha_nacimiento=COALESCE($4,fecha_nacimiento),
         url_foto=COALESCE($5,url_foto),
         biografia=COALESCE($6,biografia)
     WHERE correo_electronico=$1`,
    [req.user.sub, nombres, apellidos, fecha_nacimiento, url_foto, biografia]
  );
  return res.json({ ok: true });
}

async function list(req, res) {
  const { limit, page, offset } = getPaging(req);
  const q = (req.query.search || "").trim();

  const rows = await queryRows(
    `SELECT correo_electronico, nombres, apellidos, url_foto
     FROM persona
     WHERE ($1 = '' OR (nombres ILIKE '%'||$1||'%' OR apellidos ILIKE '%'||$1||'%' OR correo_electronico ILIKE '%'||$1||'%'))
     ORDER BY apellidos ASC, nombres ASC
     LIMIT $2 OFFSET $3`,
    [q, limit, offset]
  );
  return res.json({ page, limit, rows });
}

module.exports = { me, updateMe, list };
