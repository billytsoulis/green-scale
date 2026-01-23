# greenscale/apps/ml-engine/services/elasticsearch_service.py

import pandas as pd
from elasticsearch import Elasticsearch, helpers
import os
import time

"""
GreenScale Search & Analytics Service - Final Production Version
Path: apps/ml-engine/services/elasticsearch_service.py
Update: Added 'last_audit_date' to mapping for 5-year historical alignment.
Logic: Uses native v8 protocol for high-performance bulk indexing.
"""

class ElasticsearchService:
    def __init__(self):
        """
        Institutional Client Configuration
        Logic: Pointing to 127.0.0.1 ensures we bypass IPv6 resolution overhead.
        """
        self.es = Elasticsearch(
            "http://127.0.0.1:9200", 
            request_timeout=60,
            retry_on_timeout=True,
            max_retries=5,
            # Dev Mode: Security is disabled in our docker-compose
            verify_certs=False,
            ssl_show_warn=False
        )
        self.index_name = "gs_company_universe"

    async def sync_universe(self, df: pd.DataFrame):
        """
        Performs a high-performance Bulk Indexing operation.
        The client (8.19.3) and server (8.17.0) now speak the same language.
        """
        max_attempts = 10 
        attempt = 0
        connected = False

        print(f"🔍 [ES Service] Performing handshake with http://127.0.0.1:9200...")

        while attempt < max_attempts:
            try:
                # Handshake check: retrieves server metadata
                res = self.es.info()
                print(f"📡 [ES Service] Connection Established.")
                print(f"📦 [ES Service] Version Aligned: Server {res.get('version', {}).get('number')} | Client 8.19.3")
                connected = True
                break
            except Exception as e:
                attempt += 1
                print(f"⏳ [ES Service] Waiting for database... ({attempt}/{max_attempts})")
                time.sleep(5)

        if not connected:
            print("❌ [ES Service] CRITICAL: Database unreachable. Verify Docker status.")
            return

        print(f"📦 [ES Service] Mapping {len(df)} records into index '{self.index_name}'...")

        # --- Data Action Generation ---
        try:
            actions = [
                {
                    "_index": self.index_name,
                    "_id": row['id'],
                    "_source": {
                        "ticker": str(row['ticker']),
                        "name": str(row['name']),
                        "sector": str(row['sector']),
                        "region": str(row['region']),
                        "market_cap": float(row['market_cap_bn']),
                        "base_score": int(row['base_esg_score']),
                        "ai_score": int(row['ai_predicted_drift']),
                        "governance_anomaly": bool(row['anomaly_flag']),
                        "carbon_intensity": float(row['carbon_intensity']),
                        "efficiency": float(row['energy_efficiency_index']),
                        # Added for 5-year historical alignment
                        "last_audit_date": str(row['last_audit_date']) 
                    }
                }
                for _, row in df.iterrows()
            ]
        except Exception as e:
            print(f"❌ [ES Service] Data conversion error: {str(e)}")
            return

        # --- Bulk Indexing ---
        print(f"🚀 [ES Service] Streaming Bulk API payload...")
        try:
            # Refresh index for the demo (This performs the 'WIPE')
            if self.es.indices.exists(index=self.index_name):
                self.es.indices.delete(index=self.index_name)
            
            self.es.indices.create(index=self.index_name)
            
            # Helper handles the streaming logic for the 10,000 tickers
            success_count, _ = helpers.bulk(self.es, actions, stats_only=True)
            print(f"✅ [ES Service] SUCCESS: {success_count} tickers indexed. Searching is LIVE.")
            
        except Exception as e:
            print(f"❌ [ES Service] Bulk indexing failed: {str(e)}")

# Singleton instance
es_service = ElasticsearchService()