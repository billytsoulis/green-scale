# GreenScale ML Engine: Big Data Intelligence Layer

This service acts as the analytical core of the GreenScale platform. It is responsible for institutional-grade ESG scoring, anomaly detection (identifying "Greenwashing"), and high-performance historical forecasting using Big Data methodologies.

---

## 🛠 Prerequisites

* **Python:** 3.10 or higher
* **Infrastructure:** Docker Compose (Ensure **Elasticsearch** and **Kibana** containers are running)
* **Data Architecture:** Parquet (Columnar storage for multi-million row time-series performance)

---

## 🚀 Setup & Installation

Navigate to the engine directory and initialize your environment:

### 1. Create Virtual Environment
```bash
cd greenscale/apps/ml-engine
python -m venv venv
```

### Activate Environment
```bash
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Data Orchestration (Big Data Generation)
Before launching the API, you must generate the synthetic institutional dataset. This creates ~12.5 million data points across 5 years of history.

- Path: greenscale/apps/ml-engine
```bash
python scripts/data_generator.py
```

## Start the FastAPI Server
- The engine utilizes a modern Lifespan manager to hydrate Parquet files into RAM and synchronize the Elasticsearch search index automatically on boot.
- greenscale/apps/ml-engine

```bash
uvicorn main:app --reload
```

## Interactive Documentation
Explore the Pydantic schemas and test the ML endpoints via the auto-generated documentation:

- Swagger UI: http://localhost:8000/docs

- Redocly: http://localhost:8000/redoc

## Analytical Infrastructure
- Elasticsearch: http://localhost:9200 (Analytical Search Engine)

- Kibana: http://localhost:5601 (Visual Data Exploration Tool)