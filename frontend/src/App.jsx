import { useEffect, useState } from "react";
import { getPorts, getRoutes, getRoute } from "./api";
import { SCENARIOS, UTIL } from "./scenarios";
import MapView from "./MapView";

export default function App() {
  const [ports, setPorts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [scenario, setScenario] = useState("cyclone");
  const [status, setStatus] = useState({ ...SCENARIOS.cyclone.status });
  const [selected, setSelected] = useState("INMAA");
  const [origin, setOrigin] = useState("INVTZ");
  const [dest, setDest] = useState("INPNY");
  const [route, setRoute] = useState(null);
  const [base, setBase] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const closed = Object.keys(status).filter((id) => status[id] === "closed");
  const closedKey = closed.sort().join(",");

  useEffect(() => {
    Promise.all([getPorts(), getRoutes()])
      .then(([p, r]) => { setPorts(p); setRoutes(r); })
      .catch((e) => setLoadError(e.message));
  }, []);

  useEffect(() => {
    if (!ports.length) return;
    let stale = false;
    const list = closedKey ? closedKey.split(",") : [];
    Promise.all([
      getRoute(origin, dest, list).catch((e) => e),
      getRoute(origin, dest, []).catch(() => null),
    ]).then(([r, b]) => {
      if (stale) return;
      setBase(b);
      if (r instanceof Error) { setRoute(null); setError(r.message); }
      else { setRoute(r); setError(""); }
    });
    return () => { stale = true; };
  }, [origin, dest, closedKey, ports.length]);

  const pick = (key) => { setScenario(key); setStatus({ ...SCENARIOS[key].status }); };
  const setNode = (id, s) => setStatus((cur) => {
    const next = { ...cur };
    if (s === "operational") delete next[id]; else next[id] = s;
    return next;
  });

  const name = (id) => ports.find((p) => p.id === id)?.name ?? id;
  const sel = ports.find((p) => p.id === selected);
  const selStatus = status[selected] || "operational";
  const delay = route && base ? route.hours - base.hours : null;
  const counts = {
    closed: closed.length,
    degraded: Object.values(status).filter((s) => s === "degraded").length,
  };

  const select = (value, set) => (
    <select value={value} onChange={(e) => set(e.target.value)}>
      {ports.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );

  return (
    <div className="app">
      <aside className="side">
        <h1>Coast<b>Nexus</b> AI</h1>
        <p className="mu">Coastal digital twin and PortGenesis auto-recovery</p>
        {loadError && <p className="err">{loadError}</p>}

        <h2>Scenario</h2>
        <div className="seg">
          {Object.entries(SCENARIOS).map(([k, s]) => (
            <button key={k} className={scenario === k ? "on" : ""} onClick={() => pick(k)}>{s.label}</button>
          ))}
        </div>
        <p className="mu small">{counts.closed} closed • {counts.degraded} degraded</p>

        <h2>Shipment route</h2>
        <label>Origin {select(origin, setOrigin)}</label>
        <label>Destination {select(dest, setDest)}</label>

        <h2>Selected node</h2>
        {sel ? (
          <div className="card">
            <b>{sel.name}</b> <span className="mono mu">{sel.id}</span>
            <p className="mu small">{sel.type === "hub" ? "Inland / cold hub" : "Port"} • utilisation {UTIL[sel.id] ?? "--"}%</p>
            <div className="bar"><i style={{ width: `${UTIL[sel.id] ?? 0}%` }} /></div>
            <div className="seg three">
              {["operational", "degraded", "closed"].map((s) => (
                <button key={s} className={`${s} ${selStatus === s ? "on" : ""}`} onClick={() => setNode(sel.id, s)}>
                  {s === "operational" ? "Operational" : s === "degraded" ? "Degraded" : "Closed"}
                </button>
              ))}
            </div>
          </div>
        ) : <p className="mu">Click a node on the map.</p>}

        <h2>AI rebuilt route</h2>
        {error && <p className="err">{error}</p>}
        {route && (
          <>
            <p className="chain">{route.path.map(name).join(" → ")}</p>
            <div className="stats">
              <div><small>Time</small><b>{route.hours.toFixed(1)} h</b></div>
              <div><small>Cost</small><b>${route.cost.toLocaleString()}</b></div>
              <div><small>CO₂</small><b>{route.co2_kg.toLocaleString()} kg</b></div>
            </div>
            {delay !== null && (
              <p className={delay > 0 ? "warn" : "mu"}>
                {delay > 0 ? `+${delay.toFixed(1)} h vs normal route (${base.hours.toFixed(1)} h)` : "Same as the normal route"}
              </p>
            )}
          </>
        )}
      </aside>

      <main className="stage">
        <div className="maphead">
          <b>Coastal digital twin and PortGenesis auto-recovery map</b>
          <span className="mu small">Click a port or hub to inspect it, then set its status to rebuild the route.</span>
        </div>
        <div className="mapwrap">
          <MapView ports={ports} routes={routes} status={status} route={route}
                   origin={origin} dest={dest} selected={selected}
                   cyclone={SCENARIOS[scenario].cyclone} onSelect={setSelected} />
          <div className="legend">
            <span><i style={{ background: "#19d3b0" }} /> Operational</span>
            <span><i style={{ background: "#f5a524" }} /> Degraded</span>
            <span><i style={{ background: "#f43f5e" }} /> Closed</span>
            <span><i className="line" /> AI rebuilt route</span>
          </div>
        </div>
      </main>
    </div>
  );
}
