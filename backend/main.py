
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import json
from pathlib import Path
import networkx as nx

# Import AI module routers
from impactvision import router as impact_router
from futureport import router as futureport_router
from carbon_lens import router as carbon_router
from tideguard import router as tideguard_router

# --------------------------------------------------
# 1. LOAD COASTAL NETWORK DATA
# --------------------------------------------------

DATA = Path(__file__).resolve().parent.parent / "data"

ports = json.loads(
    (DATA / "ports.json").read_text(encoding="utf-8-sig")
)

routes = json.loads(
    (DATA / "routes.json").read_text(encoding="utf-8-sig")
)

IDS = {p["id"] for p in ports}


# --------------------------------------------------
# 2. INITIALIZE FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="CoastNexus API",
    description="Intelligent Coastal Supply Chain Command Center",
    version="1.0.0"
)


# --------------------------------------------------
# 3. CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------------------------
# 4. REGISTER AI MODULE ROUTERS
# --------------------------------------------------

app.include_router(impact_router)
app.include_router(futureport_router)
app.include_router(carbon_router)
app.include_router(tideguard_router)ks

# --------------------------------------------------
# 5. BUILD COASTAL LOGISTICS NETWORK
# --------------------------------------------------

def build_graph(closed):

    g = nx.Graph()

    # Add available ports
    g.add_nodes_from(
        p["id"] for p in ports
        if p["id"] not in closed
    )

    # Add available routes
    for r in routes:
        if r["from"] in g and r["to"] in g:
            g.add_edge(
                r["from"],
                r["to"],
                mode=r["mode"],
                hours=r["hours"],
                cost=r["cost"],
                co2_kg=r["co2_kg"]
            )

    return g


# --------------------------------------------------
# 6. HEALTH CHECK
# --------------------------------------------------

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "application": "CoastNexus AI"
    }


# --------------------------------------------------
# 7. GET ALL PORTS
# --------------------------------------------------

@app.get("/ports", tags=["Coastal Network"])
def get_ports():
    return ports


# --------------------------------------------------
# 8. GET ALL ROUTES
# --------------------------------------------------

@app.get("/routes", tags=["Coastal Network"])
def get_routes():
    return routes


# --------------------------------------------------
# 9. FIND OPTIMAL ROUTE
# --------------------------------------------------

@app.get("/route", tags=["Route Optimization"])
def route(
    from_: str = Query(..., alias="from"),
    to: str = Query(...),
    closed: str = ""
):

    # Identify closed ports
    closed_set = {
        c for c in closed.split(",") if c
    }

    # Validate port IDs
    for node in (from_, to, *closed_set):
        if node not in IDS:
            raise HTTPException(
                status_code=404,
                detail=f"Unknown node: {node}"
            )

    # Check origin and destination
    if from_ in closed_set or to in closed_set:
        raise HTTPException(
            status_code=409,
            detail="Origin or destination is closed"
        )

    # Build available network
    g = build_graph(closed_set)

    # Calculate shortest available route
    try:
        path = nx.shortest_path(
            g,
            from_,
            to,
            weight="hours"
        )

    except nx.NetworkXNoPath:
        raise HTTPException(
            status_code=409,
            detail="No route available"
        )

    # Generate route details
    legs = [
        {
            "from": a,
            "to": b,
            **g[a][b]
        }
        for a, b in zip(path, path[1:])
    ]

    # Calculate total route metrics
    total_hours = sum(l["hours"] for l in legs)
    total_cost = sum(l["cost"] for l in legs)
    total_co2 = sum(l["co2_kg"] for l in legs)

    return {
        "path": path,
        "legs": legs,
        "hours": total_hours,
        "cost": total_cost,
        "co2_kg": total_co2
    }
