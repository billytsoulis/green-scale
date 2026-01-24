# greenscale/apps/ml-engine/services/intelligence/research_engine.py

import pandas as pd
from typing import List, Optional, Dict

"""
Intelligence: Research & Discovery Engine
Path: services/intelligence/research_engine.py
Purpose: Handles deep-tier ticker lookups and market matrix sampling.
"""

class ResearchEngine:
    def sample_market_matrix(self, df: pd.DataFrame, sample_size: int = 100) -> List[Dict]:
        """
        Samples the universe for visualization.
        Functionality: Reduces 10k records to a representative sample for SVG performance.
        """
        if df is None: return []
        sample = df.sample(n=min(sample_size, len(df)))
        return [
            {
                "ticker": row['ticker'],
                "x": row['market_cap_bn'],
                "y": row['ai_predicted_drift'],
                "z": row['carbon_intensity'],
                "anomaly": row['anomaly_flag']
            }
            for _, row in sample.iterrows()
        ]

    def fetch_ticker_details(self, df: pd.DataFrame, history_df: pd.DataFrame, ticker: str) -> Optional[Dict]:
        """
        Retrieves full entity metadata and performance trends.
        Functionality: Cross-references snapshot data with historical drift.
        """
        if df is None: return None
        match = df[df['ticker'] == ticker.upper()]
        if match.empty: return None
        
        data = match.iloc[0]
        trend = "STABLE"

        if history_df is not None:
            ticker_history = history_df[history_df['ticker'] == ticker.upper()]
            if len(ticker_history) > 30:
                recent = ticker_history['historical_esg_score'].tail(30).mean()
                prior = ticker_history['historical_esg_score'].iloc[-60:-30].mean()
                trend = "UPWARD" if recent > prior else "DOWNWARD"

        return {
            "ticker": data['ticker'],
            "name": data['name'],
            "sector": data['sector'],
            "market_cap": data['market_cap_bn'],
            "raw_score": int(data['base_esg_score']),
            "ai_adjusted_score": int(data['ai_predicted_drift']),
            "anomaly_detected": bool(data['anomaly_flag']),
            "esg_trend": trend,
            "last_audit": str(data['last_audit_date'])
        }