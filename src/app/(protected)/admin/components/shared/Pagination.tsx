import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gold-300/10 pt-4">
      {totalItems !== undefined && (
        <span className="text-xs text-gold-100/50">
          Showing page {currentPage} of {totalPages || 1} ({totalItems} total records)
        </span>
      )}
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-xl border border-gold-300/10 bg-navy-900/60 px-4 py-2 text-xs font-bold text-gold hover:border-gold-300/30 disabled:opacity-40 disabled:pointer-events-none transition duration-300"
        >
          Previous
        </button>
        <span className="text-xs text-gold-200 font-bold px-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-xl border border-gold-300/10 bg-navy-900/60 px-4 py-2 text-xs font-bold text-gold hover:border-gold-300/30 disabled:opacity-40 disabled:pointer-events-none transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
