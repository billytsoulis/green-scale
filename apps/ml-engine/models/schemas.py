# greenscale/apps/ml-engine/models/schemas.py

from pydantic import BaseModel
from typing import List, Optional

"""
Data Transfer Objects (DTOs)
Path: apps/ml-engine/models/schemas.py
Purpose: Strict type validation for API requests and responses using Pydantic.
"""

class ResearchResult(BaseModel):
    ticker: str
    name: str
    sector: str
    raw_score: int
    ai_adjusted_score: int
    anomaly_detected: bool

class AnomalySummary(BaseModel):
    total_found: int
    anomalies: List[ResearchResult]