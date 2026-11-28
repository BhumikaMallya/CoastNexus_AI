import { Fragment, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UTIL } from "./scenarios";

const COLOR = { operational: "#19d3b0", degraded: "#f5a524", closed: "#f43f5e" };
const SHORT = {
  INVTZ: "Visakhapatnam", INKRI: "Krishnapatnam", "HUB-NEL": "Nellore", INKAT: "Kattupalli",
  INENR: "Ennore", INMAA: "Chennai", "WH-SRI": "Sri City", "HUB-HSR": "Hosur",
  INPNY: "Pondicherry", "HUB-MDU": "Madurai", INTUT: "Tuticorin",
};
// Label tier: 0 always, 1 from zoom 7, 2 from zoom 8 (the crowded Chennai cluster).
const TIER = { INKRI: 1, "HUB-NEL": 1, "WH-SRI": 1, INKAT: 2, INENR: 2, INMAA: 2 };
const DIR = { "HUB-NEL": "left", "WH-SRI": "left", "HUB-HSR": "left" };
const xIcon = L.divIcon({ className: "x-mark", html: "✕", iconSize: [18, 18] });

// Sea legs bend offshore so they don't cut across land. Visual only.
function leg(a, b, sea) {
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (!sea) return { pts: [a, b], mid };
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

function along(pts, frac) {
  const seg = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    total += d;
  }
  let target = frac * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const u = seg[i] ? target / seg[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
    }
    target -= seg[i];
  }
  return pts[pts.length - 1];
}

function Ships({ pts }) {
  const [t, setT] = useState(0);
  const n = pts.length;
  useEffect(() => {
    if (n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setT((x) => (x + 0.004) % 1), 60);
    return () => clearInterval(id);
  }, [n]);
  if (n < 2) return null;
  return [0, 0.34, 0.67].map((o) => (
    <CircleMarker key={o} center={along(pts, (t + o) % 1)} radius={5} interactive={false}
      pathOptions={{ color: "#19d3b0", weight: 2, fillColor: "#ffffff", fillOpacity: 1 }} />
  ));
}

function FitBounds({ ports }) {
  const map = useMap();
  useEffect(() => {
    if (ports.length) map.fitBounds(ports.map((p) => [p.lat, p.lon]), { padding: [50, 50] });
  }, [ports, map]);
  return null;
}

function ZoomWatch({ onZoom }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => { onZoom(map.getZoom()); }, [map, onZoom]);
  return null;
}

function Controls({ ports, dark, setDark }) {
  const map = useMap();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);
  return (
    <div className="focus" ref={ref}>
      <button onClick={() => map.flyTo([13.2, 80.3], 9, { duration: 0.8 })}>Zoom to Chennai–Ennore</button>
      <button onClick={() => map.fitBounds(ports.map((p) => [p.lat, p.lon]), { padding: [50, 50] })}>Show all</button>
      <button onClick={() => setDark(!dark)}>{dark ? "Light map" : "Dark map"}</button>
    </div>
  );
}

export default function MapView({ ports, routes, status = {}, route, origin, dest, selected, cyclone, risk = {}, onSelect }) {
  const [zoom, setZoom] = useState(6);
  const [dark, setDark] = useState(true);
  const byId = Object.fromEntries(ports.map((p) => [p.id, p]));
  const at = (id) => [byId[id].lat, byId[id].lon];
  const key = (a, b) => [a, b].sort().join("|");
  const active = new Set((route?.legs || []).map((l) => key(l.from, l.to)));
  const st = (id) => status[id] || "operational";

  const routePts = [];
  (route?.legs || []).forEach((l) => {
    if (!byId[l.from] || !byId[l.to]) return;
    const { pts } = leg(at(l.from), at(l.to), l.mode === "sea");
    routePts.push(...(routePts.length ? pts.slice(1) : pts));
  });

  const showLabel = (p) => {
    const tier = TIER[p.id] ?? 0;
    return p.id === selected || p.id === origin || p.id === dest || st(p.id) === "closed"
      || tier === 0 || (tier === 1 && zoom >= 7) || (tier === 2 && zoom >= 8);
  };

  return (
    <div className={`mapbox ${dark ? "dark" : "light"}`}>
      <MapContainer center={[13, 80]} zoom={6} minZoom={5} maxZoom={11} className="map" scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitBounds ports={ports} />
        <ZoomWatch onZoom={setZoom} />
        <Controls ports={ports} dark={dark} setDark={setDark} />

        {cyclone && (
          <>
            <Circle center={cyclone.center} radius={cyclone.radiusKm * 1000}
              pathOptions={{ color: "#f43f5e", weight: 1.5, dashArray: "6 6", fillColor: "#f5a524", fillOpacity: 0.12 }} />
            <Circle center={cyclone.center} radius={cyclone.coreKm * 1000}
              pathOptions={{ color: "#f43f5e", weight: 1, fillColor: "#f43f5e", fillOpacity: 0.22 }}>
              <Tooltip sticky>Cyclone core • {cyclone.kts} kts</Tooltip>
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
            ? { color: "#f43f5e", weight: 1.5, dashArray: "4 7", opacity: 0.6 }
            : { color: "#6f8aa5", weight: 1.5, opacity: 0.45, dashArray: r.mode === "rail" ? "10 5" : undefined };
          return (
            <Fragment key={i}>
              <Polyline positions={pts} pathOptions={style}>
                <Tooltip sticky>{r.mode.toUpperCase()} • {r.hours} h • ${r.cost}</Tooltip>
              </Polyline>
              {down && !on && zoom >= 7 && <Marker position={mid} icon={xIcon} interactive={false} />}
            </Fragment>
          );
        })}

        <Ships pts={routePts} />

        {ports.map((p) => {
          const s = st(p.id);
          const ends = p.id === origin || p.id === dest;
          const dot = s === "operational" && p.type === "hub" ? "#38bdf8" : COLOR[s];
          const label = showLabel(p);
          return (
            <Fragment key={p.id}>
              {selected === p.id && (
                <CircleMarker center={[p.lat, p.lon]} radius={16} interactive={false}
                  pathOptions={{ color: "#ffffff", weight: 1.5, dashArray: "3 4", fillOpacity: 0 }} />
              )}
              <CircleMarker center={[p.lat, p.lon]} radius={10}
                pathOptions={{ color: ends ? "#ffffff" : COLOR[s], weight: ends ? 3 : 2, fillColor: COLOR[s], fillOpacity: 0.15 }}
                eventHandlers={{ click: () => onSelect(p.id) }}>
                <Tooltip direction="top" offset={[0, -8]}>
                  <b>{p.name}</b> ({p.id})<br />
                  {s.toUpperCase()} • {risk[p.id] != null ? `weather risk ${risk[p.id]}` : `${UTIL[p.id] ?? "--"}% util`}
                </Tooltip>
              </CircleMarker>
              <CircleMarker center={[p.lat, p.lon]} radius={4} interactive={false}
                pathOptions={{ color: dot, weight: 1, fillColor: dot, fillOpacity: 1 }}>
                {label && (
                  <Tooltip permanent direction={DIR[p.id] || "right"} offset={[DIR[p.id] ? -8 : 8, 0]} className="node-label">
                    <b>{SHORT[p.id] || p.name}</b>
                    {selected === p.id && (<><br /><span className="mono">{p.id} • {risk[p.id] != null ? `risk ${risk[p.id]}` : `${UTIL[p.id] ?? "--"}% util`}</span></>)}
                  </Tooltip>
                )}
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

