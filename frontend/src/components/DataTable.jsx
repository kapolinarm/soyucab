import React, { useEffect, useState } from "react";

export default function DataTable({
  title,
  columns,
  fetchPage,
  rowKey,
  onRowClick,
  actions,
  defaultSort = "id",
  defaultDir = "asc",
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(defaultSort);
  const [dir, setDir] = useState(defaultDir);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [data, setData] = useState({ rows: [], total: 0 });
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const r = await fetchPage({ page, pageSize, q, sort, dir });
      setData({ rows: r.rows || [], total: r.total || 0 });
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, [page, sort, dir]);

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / pageSize));

  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>{title}</h2>

        <input
          className="input"
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <button className="btn primary" onClick={() => { setPage(1); load(); }}>
          Buscar
        </button>

        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          {columns.filter(c => c.sortable).map(c => (
            <option key={c.key} value={c.key}>Orden: {c.key}</option>
          ))}
        </select>

        <select className="input" value={dir} onChange={(e) => setDir(e.target.value)}>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      {err && <div className="msg">{err}</div>}

      <table className="table">
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.rows.map(r => (
            <tr
              key={rowKey(r)}
              onClick={() => onRowClick && onRowClick(r)}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map(c => <td key={c.key}>{String(r[c.key] ?? "")}</td>)}
              {actions && <td>{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
        <small>Página {page} / {totalPages} · Total {data.total}</small>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
