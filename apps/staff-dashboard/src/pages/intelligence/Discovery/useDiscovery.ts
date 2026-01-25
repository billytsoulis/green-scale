import { useState, useEffect } from "react";

/**
 * Institutional Intelligence: Discovery Search Hook
 * Path: src/pages/intelligence/Discovery/useDiscovery.ts
 * Purpose: Manages high-speed fuzzy search state and Elasticsearch synchronization.
 * Logic: Implements a 300ms debounce to prevent API thrashing during ticker entry.
 */

import type { 
SearchRequest, 
SearchResponse, 
ResearchResult 
} from "../shared/types.ts";

const ML_ENGINE_URL = "http://localhost:8000";

export const useDiscovery = () => {
  // 1. Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSector, setActiveSector] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // 2. Data & UI State
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Discovery Execution Lifecycle
   * Logic: Triggers a POST request to the Python FastAPI search gateway.
   */
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // Applying the SearchRequest contract to the payload
        const payload: SearchRequest = {
          query: searchTerm,
          sector: activeSector === "ALL" ? null : activeSector,
          page: currentPage,
          limit: limit
        };

        const response = await fetch(`${ML_ENGINE_URL}/ml/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Search cluster unreachable. Verify Elasticsearch status.");
        }

        // Applying the SearchResponse contract to the incoming data
        const data: SearchResponse = await response.json();
        setResults(data.hits);
        setTotal(data.total);
      } catch (err: any) {
        console.error("🔍 [useDiscovery] Search Failure:", err.message);
        setError(err.message);
      } finally {
        // Institutional simulation of Big Data indexing delay
        setTimeout(() => setLoading(false), 400);
      }
    };

    // Debounce: Wait 300ms after last keystroke before querying the cluster
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeSector, currentPage, limit]);

  /**
   * Public API of the hook
   */
  return {
    // State
    searchTerm,
    activeSector,
    currentPage,
    results,
    total,
    loading,
    error,
    limit,
    // Actions
    setSearchTerm: (val: string) => {
      setSearchTerm(val);
      setCurrentPage(1); // Reset page on new query
    },
    setActiveSector: (val: string) => {
      setActiveSector(val);
      setCurrentPage(1); // Reset page on filter change
    },
    setPage: (page: number) => setCurrentPage(page)
  };
};

export default useDiscovery;