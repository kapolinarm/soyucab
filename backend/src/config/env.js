const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

function must(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || String(v).trim() === "") {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
  return v;
}

module.exports = {
  DB_HOST: must("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_NAME: must("DB_NAME"),
  DB_USER: must("DB_USER"),
  DB_PASSWORD: must("DB_PASSWORD"),
  JWT_SECRET: must("JWT_SECRET", "dev_secret_change_me"),
  JSREPORT_URL: must("JSREPORT_URL", "http://localhost:5488"),
};
