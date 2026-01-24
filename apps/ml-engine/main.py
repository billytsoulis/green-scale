# greenscale/apps/ml-engine/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.routes import router
from services.intelligence import intelligence_service
from services.elasticsearch_service import es_service

"""
GreenScale ML Engine: Production Entry Point
Path: apps/ml-engine/main.py
Logic: Orchestrates the modular Intelligence Service and Elasticsearch synchronization.
Update: Integrated CORSMiddleware to allow institutional dashboard access (GS-33).
"""

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Institutional Data Lifecycle Management
    1. Hydrate RAM: Load Parquet files using the modular Data Loader.
    2. Synchronize ES: Push the hydrated DataFrame to the Elasticsearch index.
    """
    print("🚀 [Lifecycle] Initializing Institutional Intelligence Layer...")
    
    # Hydrate the modular service
    intelligence_service.hydrate_engine()
    
    # Sync with Elasticsearch analytical search index
    if intelligence_service.universe_df is not None:
        print("🔍 [Lifecycle] Synchronizing Search Index with Elasticsearch...")
        await es_service.sync_universe(intelligence_service.universe_df)
    else:
        print("⚠️ [Lifecycle] Sync Aborted: Source Parquet files not found.")
    
    yield
    
    print("🛑 [Lifecycle] Shutting down Intelligence Engine...")

app = FastAPI(
    title="GreenScale Intelligence Engine",
    description="Big Data Analytical Core for ESG Prediction and Anomaly Detection",
    version="1.0.4",
    lifespan=lifespan
)

# GS-33 Fix: CORS Configuration
# Logic: Explicitly allows the Vite dev server (5173) to perform GET/POST 
# analytical requests against the Python engine.
origins = [
    "http://localhost:5173",  # Staff Dashboard
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # Defaulting to port 8000 for standard ML service discovery
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)