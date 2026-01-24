# greenscale/apps/ml-engine/services/intelligence/__init__.py

from .data_loader import DataLoader
from .metrics_engine import MetricsEngine
from .research_engine import ResearchEngine
import pandas as pd
from typing import Optional, List, Dict

"""
Institutional Intelligence Service (Unified Orchestrator)
Path: services/intelligence/__init__.py
Architecture: Assembles modular engines into a singleton service interface.
"""

class IntelligenceService:
    def __init__(self):
        # Engines
        self.loader = DataLoader(
            snapshot_path="./data/companies_universe.parquet",
            history_path="./data/historical/market_history.parquet"
        )
        self.metrics = MetricsEngine()
        self.research = ResearchEngine()

        # Data Cache
        self.universe_df: Optional[pd.DataFrame] = None
        self.history_df: Optional[pd.DataFrame] = None

    def hydrate_engine(self):
        """Orchestrates RAM hydration across modules."""
        self.universe_df = self.loader.load_universe()
        self.history_df = self.loader.load_history()
        if self.universe_df is not None:
            print(f"✅ [Intelligence] Modular Engine Hydrated: {len(self.universe_df)} tickers.")

    def get_global_stats(self) -> Dict:
        return self.metrics.calculate_global_stats(self.universe_df)

    def get_sector_analysis(self) -> List[Dict]:
        return self.metrics.analyze_sectors(self.universe_df)

    def get_market_matrix(self, sample_size: int = 100) -> List[Dict]:
        return self.research.sample_market_matrix(self.universe_df, sample_size)

    def get_ticker_details(self, ticker: str) -> Optional[Dict]:
        return self.research.fetch_ticker_details(self.universe_df, self.history_df, ticker)

# Export as singleton to maintain existing imports
intelligence_service = IntelligenceService()