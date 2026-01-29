# greenscale/apps/ml-engine/services/intelligence/nlp_engine.py

import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta

"""
Intelligence: NLP Sentiment Engine (FinBERT Simulation)
Path: services/intelligence/nlp_engine.py
Purpose: Extracts linguistic sentiment from synthetic news feeds to detect Greenwashing.
Logic: Calculates 'Sentiment Divergence' by comparing news tone to self-reported ESG scores.
"""

class NLPEngine:
    def __init__(self):
        self.sources = ["Bloomberg", "Reuters", "Financial Times", "ESG Today", "Twitter Finance"]

    def generate_sentiment_feed(self, ticker: str, base_score: int) -> List[Dict]:
        """
        Simulates NLP extraction of ESG news signals.
        Logic: Companies with high base scores but negative news tone trigger 'Divergence'.
        """
        num_signals = np.random.randint(3, 6)
        feed = []
        
        # High score (>80) but we simulate a potential scandal signal
        is_greenwashing_candidate = base_score > 75 and np.random.random() > 0.7

        headlines = [
            f"{ticker} announces new offshore wind initiative in North Sea.",
            f"Supply chain audit reveals labor discrepancies at {ticker} subsidiaries.",
            f"Institutional investors question {ticker}'s 2030 net-zero roadmap.",
            f"CEO of {ticker} reaffirms commitment to biodiversity preservation.",
            f"Regulatory probe launched into {ticker} emissions reporting accuracy."
        ]

        for i in range(num_signals):
            sentiment = np.random.uniform(-0.8, 0.8)
            # If greenwashing candidate, tilt one news signal to be heavy negative
            if is_greenwashing_candidate and i == 0:
                sentiment = -0.92

            feed.append({
                "source": np.random.choice(self.sources),
                "headline": headlines[i % len(headlines)],
                "sentiment_score": round(sentiment, 2),
                "impact_weight": round(np.random.uniform(0.1, 0.9), 2),
                "date": (datetime.now() - timedelta(days=np.random.randint(0, 30))).strftime("%Y-%m-%d")
            })
        
        return sorted(feed, key=lambda x: x['date'], reverse=True)

    def detect_divergence(self, base_score: int, feed: List[Dict]) -> bool:
        """
        Detects if news sentiment is significantly lower than self-reported ESG.
        Institutional Logic: Score > 75 but Average Sentiment < -0.2 = DIVERGENCE.
        """
        if not feed: return False
        avg_sentiment = sum(s['sentiment_score'] for s in feed) / len(feed)
        
        # Self-reported as 'Green' but media sentiment is 'Negative/Critical'
        return base_score > 75 and avg_sentiment < -0.1