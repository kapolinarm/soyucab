require("dotenv").config();

const express = require("express");
const corsMiddleware = require("./config/cors");

const { queryRows } = require("./db/query");

const authRoutes = require("./routes/auth.routes");
const personasRoutes = require("./routes/personas.routes");
const privacidadRoutes = require("./routes/privacidad.routes");
const relacionesRoutes = require("./routes/relaciones.routes");
const gruposRoutes = require("./routes/grupos.routes");
const membresiasRoutes = require("./routes/membresias.routes");
const eventosRoutes = require("./routes/eventos.routes");
const asistenciasRoutes = require("./routes/asistencias.routes");
const encuestasRoutes = require("./routes/encuestas.routes");
const respuestasRoutes = require("./routes/respuestas.routes");
const reportesRoutes = require("./routes/reportes.routes");

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: "2mb" }));

app.get("/health", async (req, res) => {
  try {
    await queryRows("SELECT 1 AS ok");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

app.use("/auth", authRoutes);
app.use("/personas", personasRoutes);
app.use("/privacidad", privacidadRoutes);
app.use("/relaciones", relacionesRoutes);
app.use("/grupos", gruposRoutes);
app.use("/membresias", membresiasRoutes);
app.use("/eventos", eventosRoutes);
app.use("/asistencias", asistenciasRoutes);
app.use("/encuestas", encuestasRoutes);
app.use("/respuestas", respuestasRoutes);
app.use("/reportes", reportesRoutes);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno", detail: String(err.message || err) });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
