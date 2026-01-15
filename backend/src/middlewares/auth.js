const jwt = require("jsonwebtoken");
const env = require("../config/env");

function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const [type, token] = h.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ error: "No autorizado" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; 
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = { requireAuth };
