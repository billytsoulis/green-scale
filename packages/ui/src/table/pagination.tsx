"use client";

import React from "react";
import { TablePaginationProps } from "./types";

/**
 * Table Pagination Component
 * A premium navigation footer for the GreenScale DataTable.
 */
export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show (e.g., [1, 2, 3, ..., 10])
  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Numbers to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm gap-4">
      {/* Information Section */}
      <div className="text-sm text-slate-500 font-medium">
        Showing <span className="text-slate-900 font-bold">{startItem}</span> to{" "}
        <span className="text-slate-900 font-bold">{endItem}</span> of{" "}
        <span className="text-slate-900 font-bold">{totalItems}</span> entries
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-brand-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPages().map((page, idx) => (
            <React.Fragment key={idx}>
              {page === "..." ? (
                <span className="px-3 text-slate-400 font-bold">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all
                    ${currentPage === page
                      ? "bg-brand-emerald-800 text-white shadow-md shadow-brand-emerald-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-brand-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};