"use client";

import React, { useState, useMemo } from "react";
import { 
  DataTableProps, 
  SortState, 
  FilterState, 
  SortOrder 
} from "./types";

/**
 * DataTable Component
 * A high-density, premium data table designed for the GreenScale Staff Dashboard.
 * Supports hybrid FE/BE pagination, column-specific filtering, and luxury sorting.
 */
export function DataTable<T>({
  data,
  columns,
  loading = false,
  pagination,
  initialSort,
  onSort,
  onFilter,
  rowKey = "id" as keyof T,
  variant = "relaxed",
}: DataTableProps<T>) {
  // --- State Management ---
  const [localSort, setLocalSort] = useState<SortState>(
    initialSort || { column: null, order: null }
  );
  const [localFilters, setLocalFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);

  // --- Sorting Logic ---
  const handleSort = (columnKey: string) => {
    let newOrder: SortOrder = "asc";
    if (localSort.column === columnKey) {
      if (localSort.order === "asc") newOrder = "desc";
      else if (localSort.order === "desc") newOrder = null;
    }

    const newSortState = { column: columnKey, order: newOrder };
    setLocalSort(newSortState);
    if (onSort) onSort(newSortState);
  };

  // --- Filtering Logic ---
  const handleFilterChange = (columnKey: string, value: string) => {
    const nextFilters = { ...localFilters, [columnKey]: value };
    if (!value) delete nextFilters[columnKey];
    
    setLocalFilters(nextFilters);
    if (onFilter) onFilter(nextFilters);
  };

  // --- Data Processing (Frontend Mode) ---
  // If no pagination object is provided, we assume FE mode and process data here.
  const processedData = useMemo(() => {
    if (pagination) return data; // BE mode: data is already sliced/filtered/sorted

    let result = [...data];

    // 1. Filter
    Object.entries(localFilters).forEach(([key, value]) => {
      result = result.filter((item) => {
        const itemValue = String((item as any)[key] || "").toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });

    // 2. Sort
    if (localSort.column && localSort.order) {
      result.sort((a, b) => {
        const aVal = (a as any)[localSort.column!];
        const bVal = (b as any)[localSort.column!];
        
        if (aVal < bVal) return localSort.order === "asc" ? -1 : 1;
        if (aVal > bVal) return localSort.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, localFilters, localSort, pagination]);

  // --- Render Helpers ---
  const getRowKey = (item: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(item);
    return String(item[rowKey] || index);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Table Toolbar */}
      <div className="flex justify-end px-2">
        {columns.some(c => c.filterable) && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${showFilters 
                ? "bg-brand-emerald-50 text-brand-emerald-700 border border-brand-emerald-100" 
                : "text-slate-500 hover:bg-slate-100"}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Filter Columns"}
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="relative overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-premium">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header Row */}
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`
                      px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none
                      ${col.sortable ? "cursor-pointer hover:text-brand-emerald-600 transition-colors" : ""}
                      ${col.headerClassName || ""}
                    `}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.sortable && localSort.column === col.key && (
                        <span className="text-brand-emerald-500">
                          {localSort.order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Filter Row (Conditional) */}
              {showFilters && (
                <tr className="bg-white border-b border-slate-50 animate-in slide-in-from-top-2 duration-200">
                  {columns.map((col) => (
                    <td key={`filter-${col.key}`} className="px-4 py-2">
                      {col.filterable && (
                        <input
                          type="text"
                          placeholder={`Filter ${col.header}...`}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-emerald-500/10 focus:border-brand-emerald-500 outline-none transition-all"
                          value={localFilters[col.key] || ""}
                          onChange={(e) => handleFilterChange(col.key, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-brand-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {processedData.length > 0 ? (
                processedData.map((item, idx) => (
                  <tr 
                    key={getRowKey(item, idx)}
                    className="group hover:bg-brand-emerald-50/20 transition-colors"
                  >
                    {columns.map((col) => (
                      <td 
                        key={`${getRowKey(item, idx)}-${col.key}`}
                        className={`
                          px-6 text-sm text-slate-600 font-medium
                          ${variant === "relaxed" ? "py-5" : "py-3"}
                          ${col.cellClassName || ""}
                        `}
                      >
                        {col.render 
                          ? col.render((item as any)[col.key], item) 
                          : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.707 2.707a1 1 0 01-.707.293H11a1 1 0 01-.707-.293l-2.707-2.707A1 1 0 006.858 13H3" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-medium">No records found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination will go here in the next step */}
    </div>
  );
}