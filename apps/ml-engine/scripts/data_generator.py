# greenscale/apps/ml-engine/scripts/data_generator.py

import pandas as pd
import numpy as np
from faker import Faker
import datetime
import os
import uuid

"""
GreenScale Phase 6: Big Data Generation Script (Forecasting Edition)
Path: apps/ml-engine/scripts/data_generator.py
Update: Expanded 'last_audit_date' to cover 5 years to align with historical trends.
Fix: Ensures consistent relative paths for the Intelligence Service hydration.
"""

fake = Faker()
NUM_COMPANIES = 10000
YEARS_OF_HISTORY = 5
DAYS_PER_YEAR = 252 # Trading days

print(f"🚀 Initializing Big Data Generation Engine...")

def generate_company_universe():
    print(f"📊 Creating metadata for {NUM_COMPANIES} institutional tickers...")
    sectors = ['Renewable Energy', 'Technology', 'Healthcare', 'Financials', 'Utilities', 'Industrial']
    regions = ['EMEA', 'APAC', 'NORTH_AMERICA', 'LATAM']
    
    data = []
    for _ in range(NUM_COMPANIES):
        ticker = fake.unique.bothify(text='????').upper()
        base_esg = np.random.randint(20, 90)
        
        # FIX: Changed start_date to -5y to match the historical 5-year range.
        # This ensures the 'last_audit_date' distributions reflect a multi-year archive.
        data.append({
            "id": str(uuid.uuid4()),
            "ticker": ticker,
            "name": fake.company(),
            "sector": np.random.choice(sectors),
            "region": np.random.choice(regions),
            "market_cap_bn": round(np.random.uniform(1.5, 500.0), 2),
            "base_esg_score": base_esg,
            "energy_efficiency_index": round(np.random.uniform(0.1, 1.0), 2),
            "employee_turnover_rate": round(np.random.uniform(0.05, 0.25), 2),
            "carbon_intensity": round(np.random.uniform(10.0, 450.0), 2),
            "last_audit_date": fake.date_between(start_date='-5y', end_date='today')
        })
    return pd.DataFrame(data)

def generate_time_series(companies_df):
    """
    Generates historical drift for ESG and Stock ROI.
    """
    print(f"📈 Simulating {YEARS_OF_HISTORY} years of daily history for all tickers...")
    
    total_days = YEARS_OF_HISTORY * DAYS_PER_YEAR
    dates = pd.date_range(end=datetime.datetime.now(), periods=total_days)
    tickers_to_simulate = companies_df['ticker'].tolist()
    
    all_history = []
    
    # We use a subset of 1000 tickers for the heavy time-series file to keep local dev fast
    for ticker in tickers_to_simulate[:1000]:
        esg_steps = np.random.normal(0.001, 0.02, total_days)
        roi_steps = np.random.normal(0.0005, 0.015, total_days)
        
        history_df = pd.DataFrame({
            "ticker": ticker,
            "date": dates,
            "historical_esg_score": np.clip(70 + np.cumsum(esg_steps), 0, 100).astype(int),
            "daily_return": roi_steps
        })
        all_history.append(history_df)
    
    return pd.concat(all_history)

if __name__ == "__main__":
    # Ensure directory exists in ml-engine root
    os.makedirs("./data/historical", exist_ok=True)

    # 1. Create Snapshot
    df_universe = generate_company_universe()
    
    # AI Formula logic to simulate "Adjusted Scores"
    df_universe['ai_predicted_drift'] = (
        df_universe['base_esg_score'] - 
        (df_universe['carbon_intensity'] / 10) + 
        (df_universe['energy_efficiency_index'] * 20)
    ).clip(0, 100).astype(int)
    
    df_universe['anomaly_flag'] = (df_universe['employee_turnover_rate'] > 0.20) & (df_universe['energy_efficiency_index'] < 0.3)

    # 2. Save snapshot (Parquet is the Big Data standard)
    print("💾 Saving Universe Snapshot (Parquet)...")
    df_universe.to_parquet("./data/companies_universe.parquet", compression='snappy')

    # 3. Generate Time Series
    df_history = generate_time_series(df_universe)
    print("💾 Saving Historical Time-Series (Parquet)...")
    df_history.to_parquet("./data/historical/market_history.parquet", compression='snappy')

    print(f"✅ Generation Complete.")
    print(f"📍 Snapshot: {len(df_universe)} records")
    print(f"📍 History: {len(df_history)} daily data points")