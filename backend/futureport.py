"""FuturePort AI - interactive coastal network simulator."""
import itertools
import json
from pathlib import Path
from typing import Optional

import networkx as nx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

DATA = Path(__file__).resolve().parent.parent / "data"
ports = json.loads((DATA / "ports.json").read_text(encoding="utf-8-sig"))
routes = json.loads((DATA / "routes.json").read_text(encoding="utf-8-sig"))
IDS = {p["id"] for p in ports}

router = APIRouter(prefix="/futureport", tags=["FuturePort AI"])


class RouteRef(BaseModel):
    from_: str = Field(alias="from")
    to: str
    model_config = {"populate_by_name": True}


class NewRoute(RouteRef):
    mode: str = "road"
    hours: float
    cost: float
    co2_kg: float


class Scenario(BaseModel):
    closed_ports: list[str] = []
    closed_routes: list[RouteRef] = []
    delay_factor: float = 1.0
    port_delay: dict[str, float] = {}
    new_routes: list[NewRoute] = []
    pairs: Optional[list[tuple[str, str]]] = None


def build_graph(sc: Optional[Scenario] = None) -> nx.Graph:
    sc = sc or Scenario()
    closed = set(sc.closed_ports)
    shut = {frozenset((r.from_, r.to)) for r in sc.closed_routes}
    g = nx.Graph()
    g.add_nodes_from(p["id"] for p in ports if p["id"] not in closed)

    def add(a, b, mode, hours, cost, co2):
        if a not in g or b not in g or frozenset((a, b)) in shut:
            return
        hours *= sc.delay_factor * sc.port_delay.get(a, 1.0) * sc.port_delay.get(b, 1.0)
        if g.has_edge(a, b) and g[a][b]["hours"] <= hours:
            return
        g.add_edge(a, b, mode=mode, hours=hours, cost=cost, co2_kg=co2)

    for r in routes:
        add(r["from"], r["to"], r["mode"], r["hours"], r["cost"], r["co2_kg"])
    for r in sc.new_routes:
        add(r.from_, r.to, r.mode, r.hours, r.cost, r.co2_kg)
    return g


def solve(g: nx.Graph, a: str, b: str) -> dict:
    if a not in g or b not in g:
        return {"status": "closed"}
    try:
        path = nx.shortest_path(g, a, b, weight="hours")
    except nx.NetworkXNoPath:
        return {"status": "no_route"}
    legs = [g[x][y] for x, y in zip(path, path[1:])]
    return {"status": "ok", "path": path,
            "hours": round(sum(l["hours"] for l in legs), 2),
            "cost": round(sum(l["cost"] for l in legs), 2),
            "co2_kg": round(sum(l["co2_kg"] for l in legs), 2)}


@router.post("/simulate")
def simulate(sc: Scenario):
    refs = set(sc.closed_ports) | {p for r in sc.closed_routes for p in (r.from_, r.to)}
    refs |= {p for pr in (sc.pairs or []) for p in pr}
    refs |= set(sc.port_delay)
    bad = [n for n in refs if n not in IDS]
    if bad:
        raise HTTPException(404, f"Unknown node(s): {sorted(bad)}")
    if sc.delay_factor <= 0:
        raise HTTPException(422, "delay_factor must be > 0")

    base, scen = build_graph(), build_graph(sc)
    pairs = sc.pairs or list(itertools.combinations(sorted(IDS), 2))
    results, disconnected, rerouted, slower = [], 0, 0, []
    for a, b in pairs:
        before, after = solve(base, a, b), solve(scen, a, b)
        item = {"from": a, "to": b, "baseline": before, "scenario": after}
        if before["status"] == "ok":
            if after["status"] != "ok":
                disconnected += 1
                item["impact"] = "disconnected"
            else:
                d = round(after["hours"] - before["hours"], 2)
                item["delta_hours"] = d
                item["delta_cost"] = round(after["cost"] - before["cost"], 2)
                item["delta_co2_kg"] = round(after["co2_kg"] - before["co2_kg"], 2)
                if after["path"] != before["path"]:
                    rerouted += 1
                    item["impact"] = "rerouted"
                else:
                    item["impact"] = "unchanged"
                if d > 0:
                    slower.append(d)
        results.append(item)

    return {
        "summary": {
            "pairs_tested": len(results),
            "disconnected": disconnected,
            "rerouted": rerouted,
            "avg_extra_hours": round(sum(slower) / len(slower), 2) if slower else 0.0,
            "worst_extra_hours": max(slower, default=0.0),
            "isolated_ports": sorted(n for n in IDS - set(sc.closed_ports)
                                     if scen.degree(n) == 0),
        },
        "results": results,
    }