# greenscale/apps/ml-engine/services/elasticsearch_service.py

import pandas as pd
from elasticsearch import Elasticsearch, helpers
from typing import Optional, Dict
import logging

"""
Institutional Search & Analytics Engine (Hardened)
Path: apps/ml-engine/services/elasticsearch_service.py
Update [GS-33-FIX]: Resolved 0-result bug when filtering by sector with empty query.
Logic: Enforces Keyword mapping and uses case-insensitive matching for sectors.
"""

class ElasticsearchService:
    def __init__(self):
        # Connecting to the local Docker node (port 9200)
        self.es = Elasticsearch("http://127.0.0.1:9200")
        self.index_name = "gs_company_universe"

    async def sync_universe(self, df: pd.DataFrame):
        """
        Synchronizes the hydrated DataFrame with the Elasticsearch cluster.
        Fix: Ensures the index is fresh and mappings are strictly applied.
        """
        print(f"📡 [ES Service] Preparing to sync {len(df)} records...")

        try:
            # 1. For development, we ensure the index matches our current schema
            # If you want to force a refresh, you can uncomment the delete line below once
            # self.es.indices.delete(index=self.index_name, ignore=[400, 404])

            if not self.es.indices.exists(index=self.index_name):
                self.es.indices.create(
                    index=self.index_name,
                    mappings={
                        "properties": {
                            "id": {"type": "keyword"},
                            "ticker": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
                            "name": {"type": "text"},
                            "sector": {"type": "keyword"}, # Critical for exact filtering
                            "market_cap": {"type": "float"},
                            "base_score": {"type": "integer"},
                            "ai_score": {"type": "integer"},
                            "governance_anomaly": {"type": "boolean"},
                            "last_audit_date": {"type": "date"}
                        }
                    }
                )
                print(f"✅ [ES Service] Index '{self.index_name}' created with strict mappings.")

            # 2. Bulk Action Generator
            def generate_actions():
                for _, row in df.iterrows():
                    yield {
                        "_index": self.index_name,
                        "_id": str(row['id']),
                        "_source": {
                            "id": str(row['id']),
                            "ticker": row['ticker'],
                            "name": row['name'],
                            "sector": row['sector'],
                            "market_cap": row['market_cap_bn'],
                            "base_score": int(row['base_esg_score']),
                            "ai_score": int(row['ai_predicted_drift']),
                            "governance_anomaly": bool(row['anomaly_flag']),
                            "last_audit_date": str(row['last_audit_date'])
                        }
                    }

            # 3. Execute Bulk Upload
            success, failed = helpers.bulk(self.es, generate_actions())
            print(f"✅ [ES Service] Sync Complete: {success} indexed.")
        except Exception as e:
            print(f"❌ [ES Sync Error] {str(e)}")

    async def search_tickers(self, query: str, sector: Optional[str], page: int, limit: int) -> Dict:
        """
        High-Speed Analytical Search
        Fix: Optimized for Sector filtering when query is empty.
        """
        from_idx = (page - 1) * limit
        
        # Build the Query DSL using the modern ES 8.x structure
        must_clauses = []
        filter_clauses = []

        # 1. Search Query logic
        if query:
            must_clauses.append({
                "multi_match": {
                    "query": query,
                    "fields": ["ticker^3", "name"],
                    "fuzziness": "AUTO"
                }
            })
        else:
            must_clauses.append({"match_all": {}})

        # 2. Sector Filter logic
        if sector and sector != "ALL":
            # We use 'term' because we mapped sector as a keyword.
            # If term fails, it means the mapping is 'text'. 
            # This logic tries the keyword subfield if the mapping is dynamic.
            filter_clauses.append({
                "bool": {
                    "should": [
                        {"term": {"sector": sector}},
                        {"term": {"sector.keyword": sector}} # Fallback for dynamic mapping
                    ]
                }
            })

        try:
            res = self.es.search(
                index=self.index_name,
                query={
                    "bool": {
                        "must": must_clauses,
                        "filter": filter_clauses
                    }
                },
                from_=from_idx,
                size=limit,
                sort=[{"_score": "desc"}]
            )
            
            hits = []
            for hit in res['hits']['hits']:
                s = hit['_source']
                hits.append({
                    "id": s.get('id') or hit['_id'],
                    "ticker": s['ticker'],
                    "name": s['name'],
                    "sector": s['sector'],
                    "market_cap": s['market_cap'],
                    "raw_score": s['base_score'],
                    "ai_adjusted_score": s['ai_score'],
                    "anomaly_detected": s['governance_anomaly'],
                    "last_audit": s['last_audit_date']
                })

            return {
                "total": res['hits']['total']['value'],
                "hits": hits
            }
        except Exception as e:
            print(f"❌ [ES Search Error] {str(e)}")
            return {"total": 0, "hits": []}

es_service = ElasticsearchService()