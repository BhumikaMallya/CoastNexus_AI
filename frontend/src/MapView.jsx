import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UTIL } from "./scenarios";

const COLOR = { operational: "#19d3b0", degraded: "#f5a524", closed: "#f43f5e" };
const xIcon = L.divIcon({ className: "x-mark", html: "✕", iconSize: [18, 18] });

// Sea legs bend offshore (east) so they don't cut across land. Visual only.
function leg(a, b, sea) {
  if (!sea) return { pts: [a, b], mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let pLat = -(b[1] - a[1]), pLon = b[0] - a[0];
  if (pLon < 0) { pLat = -pLat; pLon = -pLon; }
  const c = [mid[0] + pLat * 0.18, mid[1] + pLon * 0.18];
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
              u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return { pts, mid: [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]] };
}

function FitBounds({ ports }) {
  const map = useMap();
  useEffect(() => {
    if (ports.length) map.fitBounds(ports.map((p) => [p.lat, p.lon]), { padding: [50, 50] });
  }, [ports, map]);
  return null;
}

export default function MapView({ ports, routes, status, route, origin, dest, selected, cyclone, onSelect }) {
  const byId = Object.fromEntries(ports.map((p) => [p.id, p]));
  const at = (id) => [byId[id].lat, byId[id].lon];
  const key = (a, b) => [a, b].sort().join("|");
  const active = new Set((route?.legs || []).map((l) => key(l.from, l.to)));
  const st = (id) => status[id] || "operational";

  return (
    <MapContainer center={[13, 80]} zoom={6} className="map" scrollWheelZoom>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds ports={ports} />

      {cyclone && (
        <>
          <Circle center={cyclone.center} radius={cyclone.radiusKm * 1000}
            pathOptions={{ color: "#f43f5e", weight: 1.5, dashArray: "6 6", fillColor: "#f5a524", fillOpacity: 0.12 }} />
          <Circle center={cyclone.center} radius={cyclone.coreKm * 1000}
            pathOptions={{ color: "#f43f5e", weight: 1, fillColor: "#f43f5e", fillOpacity: 0.22 }}>
            <Tooltip permanent direction="center" className="cyc-label">Cyclone core • {cyclone.kts} kts</Tooltip>
          </Circle>
        </>
      )}

      {routes.map((r, i) => {
        if (!byId[r.from] || !byId[r.to]) return null;
        const { pts, mid } = leg(at(r.from), at(r.to), r.mode === "sea");
        const down = st(r.from) === "closed" || st(r.to) === "closed";
        const on = active.has(key(r.from, r.to));
        const style = on
          ? { color: "#19d3b0", weight: 5, dashArray: "9 8", opacity: 1 }
          : down
          ? { color: "#f43f5e", weight: 2, dashArray: "4 7", opacity: 0.75 }
          : { color: "#5a7a96", weight: 2, opacity: 0.7, dashArray: r.mode === "rail" ? "10 5" : undefined };
        return (
          <span key={i}>
            <Polyline positions={pts} pathOptions={style}>
              <Tooltip sticky>{r.mode.toUpperCase()} • {r.hours} h • ${r.cost}</Tooltip>
            </Polyline>
            {down && !on && <Marker position={mid} icon={xIcon} interactive={false} />}
          </span>
        );
      })}

      {ports.map((p) => {
        const s = st(p.id);
        const ends = p.id === origin || p.id === dest;
        const dot = s === "operational" && p.type === "hub" ? "#38bdf8" : COLOR[s];
        return (
          <span key={p.id}>
            {selected === p.id && (
              <CircleMarker center={[p.lat, p.lon]} radius={20} interactive={false}
                pathOptions={{ color: "#ffffff", weight: 1.5, dashArray: "3 4", fillOpacity: 0 }} />
            )}
            <CircleMarker center={[p.lat, p.lon]} radius={14}
              pathOptions={{ color: ends ? "#ffffff" : COLOR[s], weight: ends ? 3 : 2, fillColor: COLOR[s], fillOpacity: 0.12 }}
              eventHandlers={{ click: () => onSelect(p.id) }}>
              <Tooltip permanent direction="right" offset={[14, 0]} className="node-label">
                <b>{p.name}</b>
                <br />
                <span className="mono">{p.id} • {UTIL[p.id] ?? "--"}% util</span>
              </Tooltip>
            </CircleMarker>
            <CircleMarker center={[p.lat, p.lon]} radius={5} interactive={false}
              pathOptions={{ color: dot, weight: 1, fillColor: dot, fillOpacity: 1 }} />
          </span>
        );
      })}
    </MapContainer>
  );
}
