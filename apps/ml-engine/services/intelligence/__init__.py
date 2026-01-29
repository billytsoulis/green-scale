# greenscale/apps/ml-engine/services/intelligence/__init__.py

from .data_loader import DataLoader
from .metrics_engine import MetricsEngine
from .research_engine import ResearchEngine
from .nlp_engine import NLPEngine
import pandas as pd
from typing import Optional, List, Dict

"""
Institutional Intelligence Service (Unified Orchestrator)
Path: services/intelligence/__init__.py
Update [GS-38]: Orchestrates Research, NLP, and Metrics engines.
Logic: Merges time-series forecasts with real-time news sentiment for the Ticker Forge.
"""

class IntelligenceService:
    def __init__(self):
        # Data paths for columnar storage
        self.loader = DataLoader(
            snapshot_path="./data/companies_universe.parquet",
            history_path="./data/historical/market_history.parquet"
        )
        # Sub-engine initialization
        self.metrics = MetricsEngine()
        self.research = ResearchEngine()
        self.nlp = NLPEngine()

        # In-memory dataframes for high-performance vectorized operations
        self.universe_df: Optional[pd.DataFrame] = None
        self.history_df: Optional[pd.DataFrame] = None

    def hydrate_engine(self):
        """
        Hydrates the engine during the FastAPI lifespan event.
        Logic: Loads 10,000 records and 5 years of history into RAM.
        """
        self.universe_df = self.loader.load_universe()
        self.history_df = self.loader.load_history()
        if self.universe_df is not None:
            print(f"✅ [Intelligence] Engine Hydrated with {len(self.universe_df)} tickers.")

    def get_global_stats(self) -> Dict:
        """Proxies to MetricsEngine for platform-wide aggregations."""
        return self.metrics.calculate_global_stats(self.universe_df)

    def get_sector_analysis(self) -> List[Dict]:
        """Proxies to MetricsEngine for sector risk distribution."""
        return self.metrics.analyze_sectors(self.universe_df)

    def get_market_matrix(self, sample_size: int = 100) -> List[Dict]:
        """Proxies to ResearchEngine for coordinate mapping."""
        return self.research.sample_market_matrix(self.universe_df, sample_size)

    def get_ticker_details(self, ticker: str) -> Optional[Dict]:
        """
        Coordinates the deep-dive response for the Ticker Forge.
        Logic: 
        1. Fetches base details, SHAP values, and LSTM forecasts from ResearchEngine.
        2. Injects real-time news sentiment and divergence flags via NLPEngine.
        """
        # Call the method you selected in the Canvas
        details = self.research.fetch_ticker_details(self.universe_df, self.history_df, ticker)
        
        if details:
            # Overlays linguistic evidence onto the numerical/predictive data
            feed = self.nlp.generate_sentiment_feed(ticker, details['raw_score'])
            details['sentiment_feed'] = feed
            details['divergence_detected'] = self.nlp.detect_divergence(details['raw_score'], feed)
            
        return details

# Singleton instance exported for use in api/routes.py
intelligence_service = IntelligenceService()