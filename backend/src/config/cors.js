const cors = require("cors");

function corsMiddleware() {
  return cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });
}

module.exports = { corsMiddleware };
