const { queryRows, exec } = require("../db/query");

async function getByCorreo(req, res) {
  try {
    const rows = await queryRows(
      `SELECT seccion_perfil, es_visible
       FROM configuracion_de_privacidad
       WHERE correo_electronico=$1
       ORDER BY seccion_perfil ASC`,
      [req.params.correo]
    );
    return res.json({ correo: req.params.correo, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function upsertMany(req, res) {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : null;
    if (!items) return res.status(400).json({ error: "Body debe ser { items: [...] }" });

    for (const it of items) {
      if (!it?.seccion_perfil || typeof it.es_visible !== "boolean") {
        return res.status(400).json({ error: "Cada item requiere seccion_perfil y es_visible(boolean)" });
      }

      await exec(
        `INSERT INTO configuracion_de_privacidad(seccion_perfil, correo_electronico, es_visible)
         VALUES ($1,$2,$3)
         ON CONFLICT (seccion_perfil, correo_electronico)
         DO UPDATE SET es_visible = EXCLUDED.es_visible`,
        [String(it.seccion_perfil), req.params.correo, it.es_visible]
      );
    }

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { getByCorreo, upsertMany };
