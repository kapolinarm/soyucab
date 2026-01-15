const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { withClient } = require("../db/query");

let PASSWORD_COL = null;

async function detectPasswordColumn(client) {
  if (PASSWORD_COL) return PASSWORD_COL;

  const candidates = ["password", "contrasena", "password_hash", "contrasena_hash"];
  const r = await client.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema='public' AND table_name='persona'
       AND column_name = ANY($1::text[])`,
    [candidates]
  );
  if (!r.rows.length) {
    throw new Error("La tabla persona no tiene columna de password (password/contrasena/...).");
  }
  PASSWORD_COL = r.rows[0].column_name;
  return PASSWORD_COL;
}

function signToken({ correo, role }) {
  return jwt.sign({ sub: correo, role: role || "USER" }, env.JWT_SECRET, { expiresIn: "12h" });
}

async function register(payload) {
  const {
    correo_electronico,
    nombres,
    apellidos,
    password,
    tipo_usuario,
    fecha_nacimiento,
    url_foto,
    biografia
  } = payload || {};

  if (!correo_electronico || !nombres || !apellidos || !password) {
    throw new Error("correo_electronico, nombres, apellidos y password son obligatorios");
  }

  return withClient(async (client) => {
    const passCol = await detectPasswordColumn(client);
    const hashed = await bcrypt.hash(password, 10);

    await client.query("BEGIN");
    try {
      await client.query(
        `INSERT INTO persona (correo_electronico, nombres, apellidos, ${passCol}, fecha_nacimiento, url_foto, biografia)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [correo_electronico, nombres, apellidos, hashed, fecha_nacimiento || null, url_foto || null, biografia || null]
      );

      await client.query(
        `INSERT INTO configuracion_de_privacidad(correo_electronico, visibilidad_perfil, mostrar_email, mostrar_telefono, mostrar_foto)
         VALUES ($1,'PUBLICO', true, false, true)
         ON CONFLICT (correo_electronico) DO NOTHING`,
        [correo_electronico]
      );

      if (tipo_usuario) {
        const t = String(tipo_usuario).toUpperCase();
        const today = new Date().toISOString().slice(0, 10);

        if (t === "ESTUDIANTE") {
          await client.query(
            `INSERT INTO estudiante(correo_electronico, carrera, semestre, fecha_ingreso)
             VALUES ($1,$2,$3,$4)`,
            [correo_electronico, payload.carrera || "N/A", payload.semestre || 1, payload.fecha_ingreso || today]
          );
        } else if (t === "PROFESOR") {
          await client.query(
            `INSERT INTO profesor(correo_electronico, departamento, tipo_contrato, es_activo)
             VALUES ($1,$2,$3,$4)`,
            [correo_electronico, payload.departamento || "N/A", payload.tipo_contrato || "N/A", payload.es_activo ?? true]
          );
        } else if (t === "EGRESADO") {
          await client.query(
            `INSERT INTO egresado(correo_electronico, fecha_grado, titulo_obtenido, promocion)
             VALUES ($1,$2,$3,$4)`,
            [correo_electronico, payload.fecha_grado || today, payload.titulo_obtenido || "N/A", payload.promocion || "N/A"]
          );
        } else if (t === "ADMIN") {
          await client.query(
            `INSERT INTO personal_administrativo(correo_electronico, cargo, unidad)
             VALUES ($1,$2,$3)`,
            [correo_electronico, payload.cargo || "N/A", payload.unidad || "N/A"]
          );
        }
      }

      await client.query("COMMIT");
      return { token: signToken({ correo: correo_electronico, role: tipo_usuario || "USER" }) };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}

async function login({ correo_electronico, password }) {
  if (!correo_electronico || !password) throw new Error("correo_electronico y password son obligatorios");

  return withClient(async (client) => {
    const passCol = await detectPasswordColumn(client);
    const u = await client.query(
      `SELECT correo_electronico, ${passCol} AS pass
       FROM persona
       WHERE correo_electronico=$1`,
      [correo_electronico]
    );

    if (!u.rows.length) throw new Error("Credenciales inválidas");
    const ok = await bcrypt.compare(password, u.rows[0].pass);
    if (!ok) throw new Error("Credenciales inválidas");

    return { token: signToken({ correo: correo_electronico, role: "USER" }) };
  });
}

module.exports = { register, login };
