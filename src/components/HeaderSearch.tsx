"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        if (pathname.startsWith("/admin")) {
          e.preventDefault();
          setIsMobileExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pathname]);

  // Close dropdown when clicking outside (only on mobile when expanded)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileExpanded]);

  // Clear query and mobile state when route changes
  useEffect(() => {
    dispatch(setGlobalSearchQuery(""));
    setIsMobileExpanded(false);
  }, [pathname, dispatch]);

  // Prevent rendering if not on admin portal
  if (!pathname.startsWith("/admin")) return null;

  return (
    <div className="relative flex items-center" ref={searchContainerRef}>
      {/* Mobile Icon Button */}
      {!isMobileExpanded && (
        <button
          onClick={() => {
            setIsMobileExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="sm:hidden flex items-center justify-center p-2 rounded-full text-gold-200/60 hover:text-gold-DEFAULT hover:bg-gold-DEFAULT/10 focus:outline-none transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {/* Search Input Container */}
      <div
        className={`
          ${isMobileExpanded ? "fixed inset-x-0 top-0 h-[72px] px-4 z-[60] bg-navy-950 flex items-center justify-center gap-3 animate-in fade-in" : "hidden"}
          sm:flex sm:static sm:h-auto sm:px-0 sm:bg-transparent sm:z-auto sm:animate-none
        `}
      >
        <div className={`
          flex items-center gap-2 px-3 py-1.5 bg-navy-900 border border-gold-300/10 focus-within:border-gold-300/30 rounded-full transition-all text-left group shadow-sm
          ${isMobileExpanded ? "flex-1" : "w-48 sm:w-64 lg:w-80"}
        `}>
          <Search className="w-4 h-4 text-gold-200/50 group-focus-within:text-gold-DEFAULT transition-colors shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search module..."
            value={globalSearchQuery}
            onChange={(e) => dispatch(setGlobalSearchQuery(e.target.value))}
            className="flex-1 w-full bg-transparent border-none p-0 text-xs text-gold-100 placeholder:text-gold-200/50 focus:ring-0 focus:outline-none h-6"
          />
          {globalSearchQuery && (
            <button
              onClick={() => {
                dispatch(setGlobalSearchQuery(""));
                inputRef.current?.focus();
              }}
              className="flex items-center justify-center rounded-full hover:bg-gold-300/10 p-0.5 transition-colors focus:outline-none shrink-0"
            >
              <X className="w-3.5 h-3.5 text-gold-200/50 hover:text-gold-100" />
            </button>
          )}
          {!globalSearchQuery && (
            <div className="hidden sm:flex ml-auto items-center shrink-0">
              <span className="text-[9px] font-mono font-medium text-gold-200/40 bg-navy-950 px-1.5 py-0.5 rounded border border-gold-300/10">
                ⌘K
              </span>
            </div>
          )}
        </div>

        {/* Cancel button for mobile expanded view */}
        {isMobileExpanded && (
          <button
            onClick={() => {
              dispatch(setGlobalSearchQuery(""));
              setIsMobileExpanded(false);
            }}
            className="sm:hidden text-xs font-medium text-gold-200 hover:text-gold-100 whitespace-nowrap px-1 py-2 focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
