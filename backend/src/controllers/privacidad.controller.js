const { queryOne, exec } = require("../db/query");

async function get(req, res) {
  const r = await queryOne(
    `SELECT * FROM configuracion_de_privacidad WHERE correo_electronico=$1`,
    [req.user.sub]
  );
  return res.json(r);
}

async function update(req, res) {
  const { visibilidad_perfil, mostrar_email, mostrar_telefono, mostrar_foto } = req.body || {};
  await exec(
    `UPDATE configuracion_de_privacidad
     SET visibilidad_perfil = COALESCE($2, visibilidad_perfil),
         mostrar_email = COALESCE($3, mostrar_email),
         mostrar_telefono = COALESCE($4, mostrar_telefono),
         mostrar_foto = COALESCE($5, mostrar_foto)
     WHERE correo_electronico=$1`,
    [req.user.sub, visibilidad_perfil, mostrar_email, mostrar_telefono, mostrar_foto]
  );
  return res.json({ ok: true });
}

module.exports = { get, update };
