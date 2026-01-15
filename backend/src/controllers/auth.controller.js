const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const r = await authService.register(req.body);
    return res.status(201).json(r);
  } catch (e) {
    return res.status(e.status || 500).json({ error: String(e.message || e) });
  }
}

async function login(req, res) {
  try {
    const r = await authService.login(req.body);
    return res.json(r);
  } catch (e) {
    return res.status(e.status || 500).json({ error: String(e.message || e) });
  }
}

async function me(req, res) {
  try {
    const persona = await authService.me(req.user.sub);
    return res.json({ user: req.user, persona });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

module.exports = { register, login, me };
