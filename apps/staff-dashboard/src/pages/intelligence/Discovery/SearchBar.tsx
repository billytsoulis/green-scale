/**
 * Institutional Intelligence: Discovery Search Bar
 * Path: src/pages/intelligence/Discovery/SearchBar.tsx
 * Purpose: Encapsulates the fuzzy-search input and sector filtering logic.
 * UX: Optimized for speed with high-contrast active states and touch-friendly targets.
 */

import { SearchIcon } from "../shared/icons.tsx";
import { cn } from "../../../lib/utils.ts";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeSector: string;
  setActiveSector: (val: string) => void;
  sectors: string[];
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  activeSector,
  setActiveSector,
  sectors
}: SearchBarProps) => {
  return (
    <section 
      className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-4 items-center"
      data-component="DiscoverySearchBar"
    >
      {/* 1. Fuzzy Search Input (Targeting Elasticsearch) */}
      <div className="relative flex-1 group w-full">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
          <SearchIcon />
        </div>
        <input 
          type="text" 
          placeholder="Search by Ticker, ISIN, or Entity Name..."
          className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-slate-900 shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 2. Sector Filter Horizontal List (Mobile Responsive) */}
      <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
        {sectors.map(sector => (
          <button 
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={cn(
              "px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer border-none",
              activeSector === sector 
                ? "bg-emerald-950 text-white shadow-lg" 
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
          >
            {sector}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchBar;