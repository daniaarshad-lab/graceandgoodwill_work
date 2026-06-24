"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  key: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  isLoading?: boolean;
  
  // External pagination (optional)
  pagination?: {
    page: number;
    totalPages: number;
    totalItems?: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };

  // Internal pagination (optional)
  pageSize?: number;
  
  maxHeight?: string; // e.g. "500px"
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys,
  isLoading = false,
  pagination,
  pageSize: initialPageSize,
  maxHeight = "500px",
  className = "",
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize || 10);

  // Search logic
  const searchedData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    
    return data.filter((item: any) => {
      const keysToSearch = searchKeys || columns.map((col) => col.key);
      return keysToSearch.some((key) => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchable, searchKeys, columns]);

  // Sort logic
  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setInternalPage(1); // Reset page on sort
  };

  const sortedData = useMemo(() => {
    const items = [...searchedData];
    if (!sortConfig) return items;
    
    items.sort((a: any, b: any) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (aVal === undefined || aVal === null) aVal = "";
      if (bVal === undefined || bVal === null) bVal = "";
      
      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortConfig.direction === "asc"
          ? (aVal > bVal ? 1 : -1)
          : (bVal > aVal ? 1 : -1);
      }
    });
    
    return items;
  }, [searchedData, sortConfig]);

  // Pagination configuration
  const isExternalPagination = !!pagination;
  const isInternalPagination = !isExternalPagination && (!!initialPageSize);
  const currentPageSize = isExternalPagination ? pagination.pageSize : internalPageSize;

  const paginatedData = useMemo(() => {
    if (!isInternalPagination) return sortedData;
    
    const startIndex = (internalPage - 1) * currentPageSize;
    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, isInternalPagination, internalPage, currentPageSize]);

  const totalPages = isExternalPagination 
    ? pagination.totalPages 
    : Math.ceil(sortedData.length / currentPageSize) || 1;

  const currentPage = isExternalPagination ? pagination.page : internalPage;

  const handlePageChange = (page: number) => {
    if (isExternalPagination) {
      pagination.onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isExternalPagination) {
      pagination.onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
      setInternalPage(1);
    }
  };

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;
    if (sortConfig?.key !== column.key) {
      return <ArrowUpDown className="ml-1.5 h-3 w-3 opacity-40 hover:opacity-100 transition" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-gold" />
    ) : (
      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-gold" />
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input Bar */}
      {searchable && (
        <div className="flex justify-end">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gold/45" />
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setInternalPage(1);
              }}
              className="w-full bg-navy-950 border border-gold-300/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gold-100 placeholder-gold-100/30 focus:outline-none focus:border-gold-300/30 transition duration-200"
            />
          </div>
        </div>
      )}

      {/* Main Table container wrapper with fixed height and scrolls */}
      <div className="border border-gold-300/10 rounded-2xl bg-navy-900/60 shadow-soft overflow-hidden flex flex-col w-full">
        <div 
          className="overflow-x-auto overflow-y-auto" 
          style={{ 
            maxHeight,
            scrollbarWidth: "thin", 
            scrollbarColor: "rgba(160,128,84,0.18) transparent" 
          }}
        >
          <table className="w-full text-left text-xs text-gold-100/70 border-collapse table-auto min-w-[700px] md:min-w-full">
            <thead>
              <tr className="bg-navy-950/95 sticky top-0 z-20 border-b border-gold-300/10 backdrop-blur-md">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`py-3.5 px-4 text-left text-[10px] font-bold uppercase tracking-wider text-gold-200/60 sticky top-0 bg-navy-950/95 border-b border-gold-300/10 select-none ${
                      col.sortable ? "cursor-pointer hover:text-gold" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <span>{col.header}</span>
                      {renderSortIcon(col)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-300/5">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-gold-100/40">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="h-6 w-6 text-gold animate-spin" />
                      <span className="font-semibold text-xs animate-pulse">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-gold-100/30 font-semibold"
                  >
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={(item as any).id || idx}
                    className="hover:bg-navy-900/20 transition duration-150"
                  >
                    {columns.map((col) => {
                      const val = (item as any)[col.key];
                      return (
                        <td key={col.key} className="py-4 px-4 align-middle">
                          {col.render ? (
                            col.render(item)
                          ) : (
                            <span 
                              className="block truncate max-w-[200px] text-gold-100/80"
                              title={typeof val === "string" && val.length > 25 ? val : undefined}
                            >
                              {String(val || "")}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Pagination & Page Size Selector Footer */}
      {(isExternalPagination || isInternalPagination) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gold-300/10 pt-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gold-100/50">
            {isExternalPagination && pagination.totalItems !== undefined && (
              <span>
                Showing page {currentPage} of {totalPages || 1} ({pagination.totalItems} total records)
              </span>
            )}
            {!isExternalPagination && (
              <span>
                Showing page {currentPage} of {totalPages || 1} ({sortedData.length} filtered records)
              </span>
            )}
            
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                value={currentPageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bg-navy-950 border border-gold-300/10 rounded-lg px-2 py-1 text-gold-200 outline-none focus:border-gold-300/30 transition duration-200 cursor-pointer text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="rounded-xl border border-gold-300/10 bg-navy-900/60 px-4 py-2 text-xs font-bold text-gold hover:border-gold-300/30 disabled:opacity-40 disabled:pointer-events-none transition duration-300"
            >
              Previous
            </button>
            <span className="text-xs text-gold-200 font-bold px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="rounded-xl border border-gold-300/10 bg-navy-900/60 px-4 py-2 text-xs font-bold text-gold hover:border-gold-300/30 disabled:opacity-40 disabled:pointer-events-none transition duration-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
