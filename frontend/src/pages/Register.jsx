import React, { useState } from "react";
import { api, setToken } from "../api";
import { Link } from "react-router-dom";

export default function Register({ onLogged }) {
  const [correo_electronico, setEmail] = useState("");
  const [nombres, setNom] = useState("");
  const [apellidos, setApe] = useState("");
  const [password, setPass] = useState("");
  const [tipo, setTipo] = useState("PERSONA");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    try {
      const r = await api("/auth/register", {
        method: "POST",
        body: { correo_electronico, nombres, apellidos, password, tipo }
      });
      setToken(r.token);
      await onLogged();
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Registro</h2>
        <input className="input" placeholder="correo" value={correo_electronico} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="nombres" value={nombres} onChange={e => setNom(e.target.value)} />
        <input className="input" placeholder="apellidos" value={apellidos} onChange={e => setApe(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={e => setPass(e.target.value)} />

        <select className="input" value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="PERSONA">PERSONA</option>
          <option value="ESTUDIANTE">ESTUDIANTE</option>
          <option value="PROFESOR">PROFESOR</option>
          <option value="EGRESADO">EGRESADO</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button className="btn primary" onClick={submit}>Registrar</button>
        {msg && <div className="msg">{msg}</div>}

        <div style={{ marginTop: 10 }}>
          <Link to="/login">Volver a login</Link>
        </div>
      </div>
    </div>
  );
}
