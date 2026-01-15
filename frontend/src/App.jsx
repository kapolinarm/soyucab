import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { api, getToken, setToken } from "./api";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Connections from "./pages/Connections.jsx";
import Groups from "./pages/Groups.jsx";
import Events from "./pages/Events.jsx";
import Surveys from "./pages/Surveys.jsx";
import Reports from "./pages/Reports.jsx";

function Layout({ me, onLogout }) {
  return (
    <div>
      <header className="topbar">
        <div className="brand">SOYUCAB · Entrega 4 (Kelly)</div>
        <div className="right">
          <span className="me">{me?.user?.sub} ({me?.user?.role})</span>
          <button className="btn" onClick={onLogout}>Salir</button>
        </div>
      </header>

      <nav className="nav">
        <Link to="/profile">Perfil</Link>
        <Link to="/connections">Conexiones</Link>
        <Link to="/groups">Grupos</Link>
        <Link to="/events">Eventos</Link>
        <Link to="/surveys">Encuestas</Link>
        <Link to="/reports">Reportes</Link>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/profile" element={<Profile me={me} />} />
          <Route path="/connections" element={<Connections me={me} />} />
          <Route path="/groups" element={<Groups me={me} />} />
          <Route path="/events" element={<Events me={me} />} />
          <Route path="/surveys" element={<Surveys me={me} />} />
          <Route path="/reports" element={<Reports me={me} />} />
          <Route path="*" element={<Navigate to="/profile" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const r = await api("/auth/me");
    setMe(r);
  }

  useEffect(() => {
    (async () => {
      try {
        if (!getToken()) {
          setLoading(false);
          return;
        }
        await loadMe();
      } catch {
        setToken(null);
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function logout() {
    setToken(null);
    setMe(null);
    nav("/login");
  }

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login onLogged={async () => { await loadMe(); nav("/profile"); }} />} />
      <Route path="/register" element={<Register onLogged={async () => { await loadMe(); nav("/profile"); }} />} />

      <Route
        path="/*"
        element={me ? <Layout me={me} onLogout={logout} /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
