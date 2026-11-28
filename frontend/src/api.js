const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function get(path, params) {
  const url = new URL(path, BASE);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Can't reach the backend. Is uvicorn running on port 8000?");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || `Request failed (${res.status})`);
  return body;
}

export const getPorts = () => get("/ports");
export const getRoutes = () => get("/routes");
export const getRoute = (from, to, closed) =>
  get("/route", { from, to, closed: closed.join(",") });
