# greenscale/apps/ml-engine/services/intelligence.py

import pandas as pd
import os
from typing import List, Optional

"""
Intelligence & Data Analytics Service
Path: apps/ml-engine/services/intelligence.py
Purpose: Encapsulates the heavy-lifting logic (Pandas/Big Data operations).
Presentation Value: Showcases how to abstract data science logic away from the API layer.
"""

class IntelligenceService:
    def __init__(self):
        self.universe_df: Optional[pd.DataFrame] = None
        self.data_path = "./data/companies_universe.parquet"

    def hydrate_engine(self):
        """Loads the Parquet dataset into memory for sub-millisecond lookups."""
        if os.path.exists(self.data_path):
            self.universe_df = pd.read_parquet(self.data_path)
            print(f"✅ [Intelligence Service] {len(self.universe_df)} tickers loaded.")
        else:
            print("❌ [Intelligence Service] Data source missing.")

    def get_ticker_details(self, ticker: str):
        if self.universe_df is None:
            return None
        
        match = self.universe_df[self.universe_df['ticker'] == ticker.upper()]
        if match.empty:
            return None
        
        data = match.iloc[0]
        return {
            "ticker": data['ticker'],
            "name": data['name'],
            "sector": data['sector'],
            "raw_score": int(data['base_esg_score']),
            "ai_adjusted_score": int(data['ai_adjusted_score']),
            "anomaly_detected": bool(data['governance_flag'])
        }

    def get_sector_anomalies(self, sector: Optional[str] = None) -> List:
        if self.universe_df is None:
            return []
        
        query = self.universe_df[self.universe_df['governance_flag'] == True]
        if sector:
            query = query[query['sector'] == sector]
            
        return query.head(20).to_dict(orient='records')

# Singleton instance
intelligence_service = IntelligenceService()