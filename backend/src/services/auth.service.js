const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { queryOne, exec, tx } = require("../db/query");

async function resolveRole(correo) {
  const isAdmin = await queryOne("SELECT 1 AS ok FROM personal_administrativo WHERE correo_electronico=$1", [correo]);
  if (isAdmin) return "ADMIN";

  const isProf = await queryOne("SELECT 1 AS ok FROM profesor WHERE correo_electronico=$1", [correo]);
  if (isProf) return "PROFESOR";

  const isEgr = await queryOne("SELECT 1 AS ok FROM egresado WHERE correo_electronico=$1", [correo]);
  if (isEgr) return "EGRESADO";

  const isEst = await queryOne("SELECT 1 AS ok FROM estudiante WHERE correo_electronico=$1", [correo]);
  if (isEst) return "ESTUDIANTE";

  return "PERSONA";
}

function signToken(correo, role) {
  return jwt.sign({ sub: correo, role }, JWT_SECRET, { expiresIn: "8h" });
}

async function register(body) {
  const {
    correo_electronico,
    nombres,
    apellidos,
    password,
    fecha_nacimiento,
    url_foto,
    biografia,
    tipo,
    carrera, semestre, fecha_ingreso,
    departamento, tipo_contrato, es_activo,
    fecha_grado, titulo, promocion,
    cargo, unidad
  } = body || {};

  if (!correo_electronico || !nombres || !apellidos || !password) {
    const err = new Error("Faltan campos obligatorios (correo, nombres, apellidos, password)");
    err.status = 400;
    throw err;
  }

  const exists = await queryOne("SELECT 1 AS ok FROM persona WHERE correo_electronico=$1", [correo_electronico]);
  if (exists) {
    const err = new Error("Ya existe una persona con ese correo");
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(String(password), 10);

  await tx(async (client) => {
    await client.query(
      `INSERT INTO persona(correo_electronico, nombres, apellidos, password, fecha_nacimiento, url_foto, biografia)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [correo_electronico, nombres, apellidos, hash, fecha_nacimiento || null, url_foto || null, biografia || null]
    );

    const t = String(tipo || "PERSONA").toUpperCase();

    if (t === "ESTUDIANTE") {
      if (!carrera || !semestre || !fecha_ingreso) {
        const err = new Error("Para ESTUDIANTE: carrera, semestre, fecha_ingreso son obligatorios");
        err.status = 400;
        throw err;
      }
      await client.query(
        `INSERT INTO estudiante(correo_electronico, carrera, semestre, fecha_ingreso)
         VALUES ($1,$2,$3,$4)`,
        [correo_electronico, carrera, Number(semestre), fecha_ingreso]
      );
    }

    if (t === "PROFESOR") {
      if (!departamento || !tipo_contrato || typeof es_activo !== "boolean") {
        const err = new Error("Para PROFESOR: departamento, tipo_contrato, es_activo son obligatorios");
        err.status = 400;
        throw err;
      }
      await client.query(
        `INSERT INTO profesor(correo_electronico, departamento, tipo_contrato, es_activo)
         VALUES ($1,$2,$3,$4)`,
        [correo_electronico, departamento, tipo_contrato, es_activo]
      );
    }

    if (t === "EGRESADO") {
      if (!fecha_grado || !titulo || !promocion) {
        const err = new Error("Para EGRESADO: fecha_grado, titulo, promocion son obligatorios");
        err.status = 400;
        throw err;
      }
      await client.query(
        `INSERT INTO egresado(correo_electronico, fecha_grado, titulo, promocion)
         VALUES ($1,$2,$3,$4)`,
        [correo_electronico, fecha_grado, titulo, promocion]
      );
    }

    if (t === "ADMIN") {
      if (!cargo || !unidad) {
        const err = new Error("Para ADMIN: cargo, unidad son obligatorios");
        err.status = 400;
        throw err;
      }
      await client.query(
        `INSERT INTO personal_administrativo(correo_electronico, cargo, unidad)
         VALUES ($1,$2,$3)`,
        [correo_electronico, cargo, unidad]
      );
    }
  });

  const role = await resolveRole(correo_electronico);
  const token = signToken(correo_electronico, role);
  return { ok: true, token, role };
}

async function login(body) {
  const { correo_electronico, password } = body || {};
  if (!correo_electronico || !password) {
    const err = new Error("correo_electronico y password son obligatorios");
    err.status = 400;
    throw err;
  }

  const u = await queryOne("SELECT correo_electronico, password FROM persona WHERE correo_electronico=$1", [correo_electronico]);
  if (!u) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(String(password), String(u.password));
  if (!ok) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }

  const role = await resolveRole(correo_electronico);
  const token = signToken(correo_electronico, role);
  return { ok: true, token, role };
}

async function me(correo) {
  const persona = await queryOne(
    `SELECT correo_electronico, nombres, apellidos, fecha_nacimiento, url_foto, biografia, total_puntos
     FROM persona WHERE correo_electronico=$1`,
    [correo]
  );
  return persona;
}

module.exports = { register, login, me, resolveRole };
