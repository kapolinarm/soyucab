function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toTable(title, rows) {
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const head = cols.map(c => `<th>${escapeHtml(c)}</th>`).join("");
  const body = rows.map(r => `<tr>${cols.map(c => `<td>${escapeHtml(r[c])}</td>`).join("")}</tr>`).join("");

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body{ font-family: Arial, sans-serif; padding: 16px; }
      h1{ font-size: 18px; margin-bottom: 12px; }
      table{ width:100%; border-collapse: collapse; }
      th,td{ border:1px solid #ccc; padding: 6px; font-size: 12px; }
      th{ background:#f3f3f3; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body || `<tr><td colspan="${cols.length || 1}">Sin datos</td></tr>`}</tbody>
    </table>
  </body>
  </html>`;
}

module.exports = { toTable };
