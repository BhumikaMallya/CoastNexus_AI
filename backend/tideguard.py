
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(
    prefix="/tideguard",
    tags=["TideGuard AI"]
)


# Input details for one coastal location
class CoastalReading(BaseModel):
    port_name: str
    tide_level_m: float = Field(ge=0)
    critical_level_m: float = Field(gt=0)
    wave_height_m: float = Field(ge=0)


# Request containing multiple coastal locations
class TideGuardRequest(BaseModel):
    locations: List[CoastalReading]


def assess_risk(reading: CoastalReading):

    tide_level = reading.tide_level_m
    critical_level = reading.critical_level_m
    wave_height = reading.wave_height_m

    # Calculate how close the tide is to the critical level
    tide_ratio = tide_level / critical_level

    # Rule-based risk classification
    if tide_ratio >= 1.0 or wave_height >= 2.5:
        risk_level = "High"

        recommendation = (
            "Issue a high-risk alert. Review port operations "
            "and activate the local coastal emergency plan if needed."
        )

        alert = True

    elif tide_ratio >= 0.8 or wave_height >= 1.5:
        risk_level = "Medium"

        recommendation = (
            "Increase monitoring and prepare precautionary "
            "measures for potentially affected port operations."
        )

        alert = True

    else:
        risk_level = "Low"

        recommendation = (
            "Continue routine monitoring and maintain normal "
            "coastal safety precautions."
        )

        alert = False

    return {
        "port_name": reading.port_name,
        "tide_level_m": tide_level,
        "critical_level_m": critical_level,
        "wave_height_m": wave_height,
        "tide_threshold_ratio": round(tide_ratio, 2),
        "risk_level": risk_level,
        "alert_required": alert,
        "recommendation": recommendation
    }


@router.post("/analyze")
def analyze_tideguard(request: TideGuardRequest):

    if not request.locations:
        raise HTTPException(
            status_code=400,
            detail="At least one coastal location is required"
        )

    results = []

    for location in request.locations:
        assessment = assess_risk(location)
        results.append(assessment)

    high_risk_count = sum(
        1 for item in results
        if item["risk_level"] == "High"
    )

    medium_risk_count = sum(
        1 for item in results
        if item["risk_level"] == "Medium"
    )

    low_risk_count = sum(
        1 for item in results
        if item["risk_level"] == "Low"
    )

    return {
        "module": "TideGuard AI",
        "total_locations_analyzed": len(results),

        "risk_summary": {
            "high_risk": high_risk_count,
            "medium_risk": medium_risk_count,
            "low_risk": low_risk_count
        },

        "coastal_assessments": results
    }
