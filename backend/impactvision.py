
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any


router = APIRouter(
    prefix="/impact",
    tags=["ImpactVision AI"]
)


# -------------------------------
# DATA MODELS
# -------------------------------

class Shipment(BaseModel):
    shipment_id: str
    origin: str
    destination: str
    route_nodes: List[str] = Field(default_factory=list)

    teu: float = Field(ge=0)
    cargo_value: float = Field(ge=0)

    delay_cost_per_hour: float = Field(default=10, ge=0)


class ImpactRequest(BaseModel):
    closed_ports: List[str] = Field(default_factory=list)

    shipments: List[Shipment] = Field(default_factory=list)

    futureport_results: List[Dict[str, Any]] = Field(
        default_factory=list
    )


# -------------------------------
# IMPACT CALCULATION ENGINE
# -------------------------------

def calculate_severity(loss, teu, delay):

    if loss >= 1000000 or teu >= 1500 or delay >= 48:
        return "CRITICAL"

    elif loss >= 250000 or teu >= 500 or delay >= 24:
        return "HIGH"

    elif loss >= 50000 or teu >= 100 or delay >= 8:
        return "MEDIUM"

    else:
        return "LOW"


def analyze_impact(data: ImpactRequest):

    total_loss = 0
    total_teu = 0
    total_delay = 0

    affected_shipments = 0
    disconnected_shipments = 0

    # Match FuturePort results with shipment routes
    route_results = {}

    for result in data.futureport_results:

        key = (
            result.get("from"),
            result.get("to")
        )

        route_results[key] = result

    # Analyze each shipment
    for shipment in data.shipments:

        affected = False
        disconnected = False

        delay = 0
        extra_cost = 0

        # Check closed ports
        if any(
            port in data.closed_ports
            for port in shipment.route_nodes
        ):
            affected = True

        # Find the corresponding FuturePort result
        route = route_results.get(
            (shipment.origin, shipment.destination)
        )

        if route:

            baseline = route.get("baseline", {})
            scenario = route.get("scenario", {})

            if scenario.get("status") == "no_route":

                affected = True
                disconnected = True

            elif scenario.get("status") == "ok":

                old_path = baseline.get("path", [])
                new_path = scenario.get("path", [])

                if old_path != new_path:
                    affected = True

                old_hours = baseline.get("hours", 0)
                new_hours = scenario.get("hours", 0)

                delay = max(
                    0,
                    new_hours - old_hours
                )

                extra_cost = max(
                    0,
                    scenario.get("cost", 0)
                    - baseline.get("cost", 0)
                )

                if delay > 0 or extra_cost > 0:
                    affected = True

        # Estimate delay for disconnected shipments
        if disconnected:
            delay = max(delay, 48)

        if not affected:
            continue

        affected_shipments += 1
        total_teu += shipment.teu
        total_delay += delay

        if disconnected:
            disconnected_shipments += 1

        # Estimate financial exposure
        if disconnected:
            cargo_risk = shipment.cargo_value * 0.05
        else:
            cargo_risk = shipment.cargo_value * 0.01

        delay_cost = (
            delay * shipment.delay_cost_per_hour
        )

        total_loss += (
            cargo_risk + delay_cost + extra_cost
        )

    severity = calculate_severity(
        total_loss,
        total_teu,
        total_delay
    )

    return {
        "estimated_loss": round(total_loss, 2),
        "currency": "USD",
        "cargo_affected_teu": round(total_teu, 2),
        "affected_shipments": affected_shipments,
        "estimated_delay_hours": round(total_delay, 2),
        "disconnected_shipments": disconnected_shipments,
        "severity": severity
    }


# -------------------------------
# API ENDPOINTS
# -------------------------------

@router.post("/analyze")
def analyze_disruption(data: ImpactRequest):

    result = analyze_impact(data)

    return result


@router.get("/health")
def impact_health():

    return {
        "module": "ImpactVision AI",
        "status": "running"
    }
