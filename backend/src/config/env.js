function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: parseInt(process.env.PORT || "3000", 10),

  DB_HOST: required("DB_HOST"),
  DB_PORT: parseInt(required("DB_PORT"), 10),
  DB_NAME: required("DB_NAME"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),

  JWT_SECRET: required("JWT_SECRET"),
  JSREPORT_URL: required("JSREPORT_URL")
};

module.exports = env;
