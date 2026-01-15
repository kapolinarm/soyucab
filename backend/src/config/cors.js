const cors = require("cors");
const { FRONTEND_ORIGIN } = require("./env");

module.exports = function corsMiddleware() {
  return cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });
};
