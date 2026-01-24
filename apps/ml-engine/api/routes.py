# greenscale/apps/ml-engine/api/routes.py

from fastapi import APIRouter, HTTPException
from models.schemas import (
    GlobalStats, 
    SectorAnalysis, 
    MarketMatrixPoint, 
    ResearchResult,
    SearchRequest,  # Added for Ticker Discovery
    SearchResponse  # Added for Ticker Discovery
)
from services.intelligence import intelligence_service
from services.elasticsearch_service import es_service # Imported ES service
from typing import List

"""
ML Engine API Endpoints
Path: apps/ml-engine/api/routes.py
Purpose: Exposes analytical data processed by the modular Intelligence Service.
Logic: Direct binding to the Pydantic schemas defined in the Canvas.
Update: Added the /search route to resolve the 404 error in Discovery.tsx.
"""

router = APIRouter(prefix="/ml", tags=["Intelligence"])

@router.get("/health")
async def health():
    """Service health check."""
    return {
        "status": "operational",
        "service": "ml-engine",
        "engine": "modular-pandas-v2"
    }

@router.get("/stats", response_model=GlobalStats)
async def get_global_metrics():
    """
    Returns high-level platform statistics.
    Drives: Intelligence Hub footer and Market Overview header.
    """
    return intelligence_service.get_global_stats()

@router.get("/overview/sectors", response_model=List[SectorAnalysis])
async def get_sector_distribution():
    """
    Returns aggregated anomaly density per industrial sector.
    Drives: Recharts Sector Anomaly Density Bar Chart.
    """
    return intelligence_service.get_sector_analysis()

@router.get("/overview/matrix", response_model=List[MarketMatrixPoint])
async def get_market_matrix_sample():
    """
    Returns a representative sample of tickers for high-dimensional visualization.
    Drives: Market Cap vs. ESG Maturity Scatter Plot.
    """
    return intelligence_service.get_market_matrix(sample_size=150)

@router.post("/search", response_model=SearchResponse)
async def perform_ticker_search(req: SearchRequest):
    """
    Gateway for Elasticsearch Ticker Discovery.
    Drives: Discovery.tsx search table.
    Logic: Proxies the fuzzy-search request to the Elasticsearch cluster.
    """
    return await es_service.search_tickers(
        query=req.query,
        sector=req.sector,
        page=req.page,
        limit=req.limit
    )

@router.get("/research/{ticker}", response_model=ResearchResult)
async def get_ticker_deep_dive(ticker: str):
    """
    Retrieves high-dimensional metadata and performance trends for a specific entity.
    Drives: Ticker Forge (CRUD) and detail drawers.
    """
    data = intelligence_service.get_ticker_details(ticker)
    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"Ticker '{ticker}' not found in the GreenScale institutional universe."
        )
    return data