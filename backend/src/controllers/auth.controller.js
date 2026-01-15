const Auth = require("../services/auth.service");

async function register(req, res) {
  try {
    const r = await Auth.register(req.body);
    return res.status(201).json(r);
  } catch (e) {
    return res.status(400).json({ error: String(e.message || e) });
  }
}

async function login(req, res) {
  try {
    const r = await Auth.login(req.body);
    return res.json(r);
  } catch (e) {
    return res.status(401).json({ error: String(e.message || e) });
  }
}

module.exports = { register, login };
