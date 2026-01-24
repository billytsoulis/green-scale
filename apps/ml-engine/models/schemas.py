from pydantic import BaseModel
from typing import List, Optional

"""
ML Engine: API Contract Layer (Pydantic)
Path: apps/ml-engine/models/schemas.py
Purpose: Defines the structure of analytical payloads for the Staff Dashboard.
Update: Made 'id' optional in ResearchResult to prevent 500 errors during 
service synchronization (GS-33).
"""

class GlobalStats(BaseModel):
    """Payload for the Intelligence Hub footer and Overview header."""
    total_indexed: int
    anomalies: int
    drift_24h: int
    sync_state: str
    last_updated: str

class SectorAnalysis(BaseModel):
    """Payload for the Sector Anomaly Density bar chart."""
    name: str
    count: int
    risk: float

class MarketMatrixPoint(BaseModel):
    """Payload for the Valuation vs ESG Scatter Plot."""
    ticker: str
    x: float  # Market Cap
    y: int    # ESG Score (AI Adjusted)
    z: float  # Carbon Intensity (Bubble Size)
    anomaly: bool

class ResearchResult(BaseModel):
    """Payload for the Ticker Forge and Discovery Table."""
    # Made optional to prevent ResponseValidationError (500) if 
    # the underlying service mapping is missing the 'id' key.
    id: Optional[str] = None 
    ticker: str
    name: str
    sector: str
    market_cap: float
    raw_score: int
    ai_adjusted_score: int
    anomaly_detected: bool
    last_audit: str
    # Made optional as ES search results might not compute 
    # historical trends in real-time during discovery.
    esg_trend: Optional[str] = "STABLE"

class SearchRequest(BaseModel):
    """The payload sent by the Discovery.tsx search bar."""
    query: str
    sector: Optional[str] = None
    page: int = 1
    limit: int = 10

class SearchResponse(BaseModel):
    """The high-speed results returned by Elasticsearch."""
    total: int
    hits: List[ResearchResult]

class AnomalyFeed(BaseModel):
    """Payload for the real-time anomaly discovery list."""
    total_found: int
    anomalies: List[ResearchResult]