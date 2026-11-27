import json
from pathlib import Path
import networkx as nx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

DATA = Path(__file__).resolve().parent.parent / "data"
ports = json.loads((DATA / "ports.json").read_text(encoding="utf-8-sig"))
routes = json.loads((DATA / "routes.json").read_text(encoding="utf-8-sig"))
IDS = {p["id"] for p in ports}

app = FastAPI(title="CoastNexus API")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

def build_graph(closed):
    g = nx.Graph()
    g.add_nodes_from(p["id"] for p in ports if p["id"] not in closed)
    for r in routes:
        if r["from"] in g and r["to"] in g:
            g.add_edge(r["from"], r["to"], mode=r["mode"], hours=r["hours"],
                       cost=r["cost"], co2_kg=r["co2_kg"])
    return g

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ports")
def get_ports():
    return ports

@app.get("/routes")
def get_routes():
    return routes

@app.get("/route")
def route(from_: str = Query(..., alias="from"), to: str = Query(...), closed: str = ""):
    closed_set = {c for c in closed.split(",") if c}
    for node in (from_, to, *closed_set):
        if node not in IDS:
            raise HTTPException(404, f"Unknown node: {node}")
    if from_ in closed_set or to in closed_set:
        raise HTTPException(409, "Origin or destination is closed")
    g = build_graph(closed_set)
    try:
        path = nx.shortest_path(g, from_, to, weight="hours")
    except nx.NetworkXNoPath:
        raise HTTPException(409, "No route available")
    legs = [{"from": a, "to": b, **g[a][b]} for a, b in zip(path, path[1:])]
    return {"path": path, "legs": legs,
            "hours": sum(l["hours"] for l in legs),
            "cost": sum(l["cost"] for l in legs),
            "co2_kg": sum(l["co2_kg"] for l in legs)}
