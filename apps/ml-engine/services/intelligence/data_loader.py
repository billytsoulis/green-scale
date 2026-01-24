# greenscale/apps/ml-engine/services/intelligence/data_loader.py

import pandas as pd
import os
from typing import Optional

"""
Intelligence: Data Loader Module
Path: services/intelligence/data_loader.py
Purpose: Handles columnar Parquet hydration and filesystem safety checks.
"""

class DataLoader:
    def __init__(self, snapshot_path: str, history_path: str):
        self.snapshot_path = snapshot_path
        self.history_path = history_path

    def load_universe(self) -> Optional[pd.DataFrame]:
        """
        Loads the 10,000 ticker universe.
        Functionality: Performs Snappy-decompression of the primary Parquet snapshot.
        """
        if os.path.exists(self.snapshot_path):
            return pd.read_parquet(self.snapshot_path)
        print(f"❌ [Loader] Missing: {self.snapshot_path}")
        return None

    def load_history(self) -> Optional[pd.DataFrame]:
        """
        Loads the 5-year historical ledger.
        Functionality: Hydrates multi-million row time-series into RAM for analysis.
        """
        if os.path.exists(self.history_path):
            return pd.read_parquet(self.history_path)
        print(f"❌ [Loader] Missing: {self.history_path}")
        return None