from fastapi.testclient import TestClient
from main import app

c = TestClient(app)

def test_closed_port_not_in_path():
    r = c.get("/route", params={"from": "INVTZ", "to": "HUB-HSR", "closed": "INMAA"})
    assert r.status_code == 200
    assert "INMAA" not in r.json()["path"]

def test_no_route_returns_409():
    r = c.get("/route", params={"from": "INVTZ", "to": "INTUT", "closed": "INKRI"})
    assert r.status_code == 409

def test_closed_origin_returns_409():
    r = c.get("/route", params={"from": "INMAA", "to": "HUB-HSR", "closed": "INMAA"})
    assert r.status_code == 409
