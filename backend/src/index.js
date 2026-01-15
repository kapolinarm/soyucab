require("dotenv").config();

const express = require("express");
const env = require("./config/env");
const { corsMiddleware } = require("./config/cors");
const { requireAuth } = require("./middlewares/auth");

const app = express();
app.use(corsMiddleware());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", require("./routes/auth.routes"));

app.use("/personas", requireAuth, require("./routes/personas.routes"));
app.use("/privacidad", requireAuth, require("./routes/privacidad.routes"));
app.use("/relaciones", requireAuth, require("./routes/relaciones.routes"));
app.use("/grupos", requireAuth, require("./routes/grupos.routes"));
app.use("/membresias", requireAuth, require("./routes/membresias.routes"));
app.use("/eventos", requireAuth, require("./routes/eventos.routes"));
app.use("/asistencias", requireAuth, require("./routes/asistencias.routes"));
app.use("/encuestas", requireAuth, require("./routes/encuestas.routes"));
app.use("/respuestas", requireAuth, require("./routes/respuestas.routes"));
app.use("/reportes", requireAuth, require("./routes/reportes.routes"));

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(env.PORT, () => {
  console.log(`soyucab-api listening on :${env.PORT}`);
});
