# greenscale/apps/ml-engine/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
from api.routes import router
from services.intelligence import intelligence_service
from services.elasticsearch_service import es_service

"""
GreenScale ML Engine: Professional Microservice Orchestrator
Path: apps/ml-engine/main.py
Fix: Resolved NameError by ensuring es_service is correctly imported.
Logic: Orchestrates the 'Hydrate & Sync' pattern within the modern Lifespan manager.
"""

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle Manager: Handles startup and shutdown logic.
    Coordinates dependencies between local Parquet data and the Elasticsearch index.
    """
    # 1. STARTUP: Hydrate our Big Data Parquet files into memory (Pandas)
    print("🚀 [Lifecycle] Initializing ML Engine...")
    intelligence_service.hydrate_engine()
    
    # 2. STARTUP: Sync the hydrated data to Elasticsearch for analytical search
    # We check if universe_df is populated before attempting synchronization
    if intelligence_service.universe_df is not None:
        print("🔍 [Lifecycle] Synchronizing Search Index with Elasticsearch...")
        # Awaiting the async sync operation from the es_service
        await es_service.sync_universe(intelligence_service.universe_df)
    else:
        print("⚠️ [Lifecycle] Skipping Elasticsearch sync: No data found in memory.")
    
    yield # The application serves requests here
    
    # 3. SHUTDOWN: Resource cleanup
    print("🛑 [Lifecycle] Shutting down ML Engine...")

app = FastAPI(
    title="GreenScale Intelligence Engine",
    description="Big Data AI service for ESG drift prediction and portfolio optimization.",
    version="1.0.0",
    lifespan=lifespan
)

# Include the modular routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run uses the string import to enable hot-reloading correctly
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)