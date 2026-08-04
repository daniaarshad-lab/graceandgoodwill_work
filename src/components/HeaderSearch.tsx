"use client";

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setGlobalSearchQuery } from "@/store/slices/adminSlice";

export default function HeaderSearch() {
  const dispatch = useAppDispatch();
  const globalSearchQuery = useAppSelector(
    (state) => state.admin?.globalSearchQuery || "",
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Keyboard shortcut CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        if (pathname.startsWith("/admin")) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pathname]);

  // Clear query when route changes
  useEffect(() => {
    dispatch(setGlobalSearchQuery(""));
  }, [pathname, dispatch]);

  // Prevent rendering if not on admin portal
  if (!pathname.startsWith("/admin")) return null;

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 w-48 sm:w-64 lg:w-80 bg-navy-900 border border-gold-300/10 focus-within:border-gold-300/30 rounded-full transition-all text-left group shadow-sm">
        <Search className="w-4 h-4 text-gold-200/50 group-focus-within:text-gold-DEFAULT transition-colors shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search module..."
          value={globalSearchQuery}
          onChange={(e) => dispatch(setGlobalSearchQuery(e.target.value))}
          className="flex-1 w-full bg-transparent border-none p-0 text-xs text-gold-100 placeholder:text-gold-200/50 focus:ring-0 focus:outline-none h-6"
        />
        {globalSearchQuery ? (
          <button
            onClick={() => {
              dispatch(setGlobalSearchQuery(""));
              inputRef.current?.focus();
            }}
            className="flex items-center justify-center rounded-full hover:bg-gold-300/10 p-0.5 transition-colors focus:outline-none shrink-0"
          >
            <X className="w-3.5 h-3.5 text-gold-200/50 hover:text-gold-100" />
          </button>
        ) : (
          <div className="hidden sm:flex ml-auto items-center shrink-0">
            <span className="text-[9px] font-mono font-medium text-gold-200/40 bg-navy-950 px-1.5 py-0.5 rounded border border-gold-300/10">
              ⌘K
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
