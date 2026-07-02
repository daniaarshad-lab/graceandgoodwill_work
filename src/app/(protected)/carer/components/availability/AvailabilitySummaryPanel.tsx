"use client";

import { useMemo } from "react";
import {
  DateRange,
  groupDatesIntoRanges,
  formatRangeDisplay,
} from "../../utils/date.utils";

interface AvailabilitySummaryPanelProps {
  selectedDates: string[];
  onRemoveRange: (range: DateRange) => void;
  onSave: () => void;
  onQuickAction: (
    action: "next3" | "next7" | "next30" | "clear",
  ) => void;
  isSaving: boolean;
  hasChanges: boolean;
  isValid: boolean;
}

export default function AvailabilitySummaryPanel({
  selectedDates,
  onRemoveRange,
  onSave,
  onQuickAction,
  isSaving,
  hasChanges,
  isValid,
}: AvailabilitySummaryPanelProps) {
  const ranges = useMemo(
    () => groupDatesIntoRanges(selectedDates),
    [selectedDates],
  );

  const isEmpty = ranges.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20">
          <CalendarIcon />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gold-50">
            Availability Summary
          </h4>
          <p className="text-[11px] text-gold-100/40">
            {isEmpty ? "No dates selected" : "Selected availability"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(
          [
            { key: "next3", label: "Next 3 Days" },
            { key: "next7", label: "Next 7 Days" },
            { key: "next30", label: "Next 30 Days" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onQuickAction(key)}
            className="px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase
              rounded-lg border border-gold-muted/20 text-gold-300/70
              hover:bg-gold-muted/10 hover:border-gold-muted/40 hover:text-gold-100
              transition-all duration-200 active:scale-95"
          >
            {label}
          </button>
        ))}
        {!isEmpty && (
          <button
            type="button"
            onClick={() => onQuickAction("clear")}
            className="px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase
              rounded-lg border border-red-500/15 text-red-400/60
              hover:bg-red-500/8 hover:border-red-500/30 hover:text-red-400
              transition-all duration-200 active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Unsaved Changes indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-gold-DEFAULT/[0.06] border border-gold-DEFAULT/15">
          <span className="w-2 h-2 rounded-full bg-gold-DEFAULT animate-pulse" />
          <span className="text-[11px] text-gold-200/70 font-semibold">
            Unsaved Changes
          </span>
        </div>
      )}

      {/* Ranges List or Empty State */}
      <div
        className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(160,128,84,0.15) transparent",
        }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-muted/5 border border-gold-muted/10 flex items-center justify-center mb-4">
              <EmptyCalendarIcon />
            </div>
            <p className="text-sm font-medium text-gold-100/35">
              No availability selected yet
            </p>
            <p className="text-[11px] text-gold-100/20 mt-1 max-w-[200px] leading-relaxed">
              Click a date to start, then click another to select a range
            </p>
          </div>
        ) : (
          ranges.map((range, idx) => {
            return (
              <div
                key={`${range.start}-${range.end}`}
                className="group flex items-center justify-between px-3 py-3
                  rounded-xl border border-gold-300/8 bg-navy-950/30
                  hover:border-gold-300/20 hover:bg-navy-950/50
                  transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-[13px] text-gold-100/90 font-medium truncate">
                    {formatRangeDisplay(range)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveRange(range)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                    text-gold-100/25 hover:text-red-400 hover:bg-red-400/10
                    transition-all duration-200"
                  aria-label={`Remove range ${idx + 1}`}
                >
                  <XIcon />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: Stats + Save */}
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !hasChanges || !isValid}
          className={`w-full py-3 rounded-xl text-sm font-semibold
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            outline-none cursor-pointer
            focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-navy-950
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
            ${hasChanges && !isSaving && isValid
              ? "bg-[#b59469] text-navy-950 hover:bg-[#c9a87d] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] active:translate-y-0 active:shadow-none"
              : "bg-gold-muted/15 text-gold-100/50 border border-gold-muted/20"
            }`}
        >
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Availability"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold-DEFAULT"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EmptyCalendarIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold-muted/25"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
