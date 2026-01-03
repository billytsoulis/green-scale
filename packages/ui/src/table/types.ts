import { ReactNode } from "react";

export type SortOrder = "asc" | "desc" | null;

export interface SortState {
  column: string | null;
  order: SortOrder;
}

export interface FilterState {
  [key: string]: string;
}

export interface Column<T> {
  /** The key in the data object or a unique string for the column */
  key: string;
  /** The text displayed in the header */
  header: string;
  /** Enables sorting for this column */
  sortable?: boolean;
  /** Enables the inline filter input for this column */
  filterable?: boolean;
  /** Custom render function for the cell content */
  render?: (value: any, item: T) => ReactNode;
  /** CSS class for the header cell */
  headerClassName?: string;
  /** CSS class for the body cell */
  cellClassName?: string;
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  /** Backend Pagination configuration. If omitted, FE pagination is used. */
  pagination?: TablePaginationProps;
  /** Initial sort state */
  initialSort?: SortState;
  /** Callback triggered when sorting changes (for BE sorting) */
  onSort?: (sort: SortState) => void;
  /** Callback triggered when filters change (for BE filtering) */
  onFilter?: (filters: FilterState) => void;
  /** Unique key for rows (defaults to 'id') */
  rowKey?: keyof T | ((item: T) => string);
  /** Styling variant */
  variant?: "compact" | "relaxed";
}