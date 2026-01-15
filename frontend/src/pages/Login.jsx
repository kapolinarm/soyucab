import React, { useState } from "react";
import { api, setToken } from "../api";
import { Link } from "react-router-dom";

export default function Login({ onLogged }) {
  const [correo_electronico, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    try {
      const r = await api("/auth/login", { method: "POST", body: { correo_electronico, password } });
      setToken(r.token);
      await onLogged();
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <input className="input" placeholder="correo" value={correo_electronico} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={e => setPass(e.target.value)} />
        <button className="btn primary" onClick={submit}>Entrar</button>
        {msg && <div className="msg">{msg}</div>}
        <div style={{ marginTop: 10 }}>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
