# greenscale/apps/ml-engine/api/routes.py

from fastapi import APIRouter, HTTPException
from models.schemas import ResearchResult
from services.intelligence import intelligence_service
from typing import List, Optional

"""
ML Engine API Endpoints
Path: apps/ml-engine/api/routes.py
Purpose: Route definitions that delegate logic to the Intelligence Service.
"""

router = APIRouter(prefix="/ml", tags=["Intelligence"])

@router.get("/health")
async def health():
    return {
        "status": "operational",
        "service": "ml-engine",
        "storage_engine": "parquet"
    }

@router.get("/research/{ticker}", response_model=ResearchResult)
async def research_ticker(ticker: str):
    data = intelligence_service.get_ticker_details(ticker)
    if not data:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found in the GreenScale universe.")
    return data

@router.get("/anomalies", response_model=List[ResearchResult])
async def list_anomalies(sector: Optional[str] = None):
    return intelligence_service.get_sector_anomalies(sector)