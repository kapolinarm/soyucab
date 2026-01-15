const API_BASE = "/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    if (ct.includes("application/json")) {
      const j = await res.json().catch(() => null);
      if (j?.error) msg = j.error;
    } else {
      msg = await res.text().catch(() => msg);
    }
    throw new Error(msg);
  }

  if (ct.includes("application/json")) return res.json();
  return res.arrayBuffer(); // para PDFs
}

export async function downloadPdf(path, filename = "reporte.pdf") {
  const buf = await api(path);
  const blob = new Blob([buf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
