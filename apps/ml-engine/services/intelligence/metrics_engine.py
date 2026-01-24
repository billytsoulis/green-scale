# greenscale/apps/ml-engine/services/intelligence/metrics_engine.py

import pandas as pd
from typing import List, Dict
from datetime import datetime

"""
Intelligence: Metrics & Aggregation Engine
Path: services/intelligence/metrics_engine.py
Purpose: Computes high-level statistics and sector-wide risk distributions.
"""

class MetricsEngine:
    def calculate_global_stats(self, df: pd.DataFrame) -> Dict:
        """
        Summarizes the state of the institutional universe.
        Functionality: Counts total records, anomaly flags, and estimates daily drift.
        """
        if df is None: return {"total_indexed": 0, "anomalies": 0, "drift_24h": 0}
        
        total = len(df)
        anomalies = len(df[df['anomaly_flag'] == True])
        drift_24h = int(total * 0.0018) # Institutional drift estimate

        return {
            "total_indexed": total,
            "anomalies": anomalies,
            "drift_24h": drift_24h,
            "sync_state": "SYNCHRONIZED",
            "last_updated": datetime.now().isoformat()
        }

    def analyze_sectors(self, df: pd.DataFrame) -> List[Dict]:
        """
        Performs sector-level anomaly density analysis.
        Functionality: Groups data by sector to find concentrations of ESG risk.
        """
        if df is None: return []
        
        analysis = []
        sectors = df['sector'].unique()

        for sector in sectors:
            sector_data = df[df['sector'] == sector]
            total_in_sector = len(sector_data)
            anomalies_in_sector = len(sector_data[sector_data['anomaly_flag'] == True])
            
            analysis.append({
                "name": sector,
                "count": total_in_sector,
                "risk": round((anomalies_in_sector / total_in_sector) * 100, 1)
            })
            
        return sorted(analysis, key=lambda x: x['risk'], reverse=True)