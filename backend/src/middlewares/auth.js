const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

function authRequired(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Falta token Bearer" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, role, iat, exp }
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

function requireSelfOrAdmin(paramName = "correo") {
  return (req, res, next) => {
    const target = String(req.params[paramName] || "");
    if (req.user?.sub === target) return next();
    if (req.user?.role === "ADMIN") return next();
    return res.status(403).json({ error: "No autorizado" });
  };
}

function requireRole(roles = []) {
  const allowed = roles.map(r => String(r).toUpperCase());
  return (req, res, next) => {
    const r = String(req.user?.role || "").toUpperCase();
    if (allowed.includes(r)) return next();
    return res.status(403).json({ error: "Rol no autorizado" });
  };
}

module.exports = { authRequired, requireSelfOrAdmin, requireRole };
