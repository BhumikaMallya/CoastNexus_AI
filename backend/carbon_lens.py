
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(
    prefix="/carbon",
    tags=["Carbon Lens AI"]
)


# -----------------------------------------
# 1. INPUT MODEL
# -----------------------------------------

class RouteData(BaseModel):
    route_name: str
    co2_kg: float = Field(ge=0)
    hours: float = Field(ge=0)
    cost: float = Field(ge=0)


class CarbonRequest(BaseModel):
    routes: List[RouteData]


# -----------------------------------------
# 2. CARBON ANALYSIS
# -----------------------------------------

@router.post("/analyze")
def analyze_carbon(request: CarbonRequest):

    if not request.routes:
        raise HTTPException(
            status_code=400,
            detail="At least one route is required"
        )

    results = []

    for route in request.routes:

        results.append({
            "route_name": route.route_name,
            "estimated_co2_kg": route.co2_kg,
            "travel_hours": route.hours,
            "estimated_cost": route.cost
        })

    # Find route with lowest emissions
    greenest_route = min(
        results,
        key=lambda x: x["estimated_co2_kg"]
    )

    # Find route with lowest cost
    cheapest_route = min(
        results,
        key=lambda x: x["estimated_cost"]
    )

    # Find fastest route
    fastest_route = min(
        results,
        key=lambda x: x["travel_hours"]
    )

    return {
        "module": "Carbon Lens AI",
        "total_routes_analyzed": len(results),
        "route_analysis": results,
        "recommendations": {
            "lowest_emission_route": greenest_route,
            "lowest_cost_route": cheapest_route,
            "fastest_route": fastest_route
        }
    }
