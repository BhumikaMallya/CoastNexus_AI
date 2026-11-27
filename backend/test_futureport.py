from fastapi import FastAPI
from fastapi.testclient import TestClient
from futureport import router

app = FastAPI(); app.include_router(router)
c = TestClient(app)

def sim(body): return c.post("/futureport/simulate", json=body)

def test_no_change_is_unchanged():
    r = sim({"pairs": [["INVTZ", "HUB-HSR"]]}).json()
    assert r["results"][0]["impact"] == "unchanged"
    assert r["results"][0]["baseline"]["hours"] == 20   # fastest mode (sea) kept

def test_closing_port_reroutes():
    r = sim({"closed_ports": ["INMAA"], "pairs": [["INKRI", "HUB-HSR"]]}).json()
    assert r["results"][0]["scenario"]["path"] == ["INKRI", "HUB-NEL", "WH-SRI", "HUB-HSR"]

def test_closing_both_paths_disconnects():
    r = sim({"closed_ports": ["INMAA", "WH-SRI"], "pairs": [["INVTZ", "HUB-HSR"]]}).json()
    assert r["summary"]["disconnected"] == 1

def test_new_route_and_delay():
    r = sim({"delay_factor": 2, "new_routes": [{"from": "INVTZ", "to": "HUB-HSR",
             "hours": 5, "cost": 10, "co2_kg": 5}], "pairs": [["INVTZ", "HUB-HSR"]]}).json()
    assert r["results"][0]["scenario"]["path"] == ["INVTZ", "HUB-HSR"]

def test_unknown_port_404():
    assert sim({"closed_ports": ["XXX"]}).status_code == 404