from pydantic import BaseModel
from typing import List, Optional, Dict

"""
ML Engine: API Contract Layer (Pydantic)
Path: apps/ml-engine/models/schemas.py
Update [GS-38-FIX]: Explicitly added forecast_trajectory to the ResearchResult.
Without this, FastAPI will strip the field from the JSON response.
"""

class GlobalStats(BaseModel):
    total_indexed: int
    anomalies: int
    drift_24h: int
    sync_state: str
    last_updated: str

class SectorAnalysis(BaseModel):
    name: str
    count: int
    risk: float

class MarketMatrixPoint(BaseModel):
    ticker: str
    x: float
    y: int
    z: float
    anomaly: bool

class ShapFactor(BaseModel):
    name: str
    value: float
    description: str

class SentimentSignal(BaseModel):
    source: str
    headline: str
    sentiment_score: float
    impact_weight: float
    date: str

class ForecastPoint(BaseModel):
    """Data structure for the 12-month predictive path."""
    date: str
    value: float
    confidence_high: float
    confidence_low: float

class ResearchResult(BaseModel):
    id: Optional[str] = None 
    ticker: str
    name: str
    sector: str
    market_cap: float
    raw_score: int
    ai_adjusted_score: int
    anomaly_detected: bool
    last_audit: str
    esg_trend: Optional[str] = "STABLE"
    shap_attribution: Optional[List[ShapFactor]] = []
    sentiment_feed: Optional[List[SentimentSignal]] = []
    divergence_detected: bool = False
    
    # CRITICAL FIX: This field MUST be here for the JSON to show it
    forecast_trajectory: Optional[List[ForecastPoint]] = []

class SearchRequest(BaseModel):
    query: str
    sector: Optional[str] = None
    page: int = 1
    limit: int = 10

class SearchResponse(BaseModel):
    total: int
    hits: List[ResearchResult]