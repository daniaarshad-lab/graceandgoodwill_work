"use client";

import { memo } from "react";

export type RangePosition = "none" | "single" | "start" | "middle" | "end";

interface DateCellProps {
  dayNumber: number;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOtherMonth: boolean;
  isPreview: boolean;
  rangePosition: RangePosition;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

function DateCell({
  dayNumber,
  isSelected,
  isToday,
  isDisabled,
  isOtherMonth,
  isPreview,
  rangePosition,
  onMouseDown,
  onMouseEnter,
}: DateCellProps) {
  // ─── Container classes (row-level range fill band) ─────────────────────────
  const containerClasses = ["relative flex items-center justify-center"];

  // Range fill band — connects selected cells visually
  if (isSelected && !isOtherMonth && rangePosition !== "none") {
    if (rangePosition === "start") {
      containerClasses.push("bg-gradient-to-r from-transparent to-gold-DEFAULT/8");
    } else if (rangePosition === "end") {
      containerClasses.push("bg-gradient-to-l from-transparent to-gold-DEFAULT/8");
    } else if (rangePosition === "middle") {
      containerClasses.push("bg-gold-DEFAULT/8");
    }
  }

  // Preview range fill band (hover-to-extend)
  if (isPreview && !isSelected && !isOtherMonth && !isDisabled) {
    containerClasses.push("bg-gold-DEFAULT/[0.04]");
  }

  // ─── Inner cell classes ────────────────────────────────────────────────────
  const cellClasses = [
    "relative flex items-center justify-center",
    "w-full aspect-square",
    "text-sm font-medium select-none",
    "transition-all duration-200 ease-out",
  ];

  // Shape: end caps are rounded, middles are not
  if (rangePosition === "middle" && isSelected) {
    cellClasses.push("rounded-none");
  } else {
    cellClasses.push("rounded-xl");
  }

  // ─── State-based styling ───────────────────────────────────────────────────
  if (isOtherMonth) {
    cellClasses.push("text-gold-100/10 cursor-default");
  } else if (isDisabled) {
    cellClasses.push(
      "text-gold-100/20 cursor-not-allowed"
    );
  } else if (isSelected) {
    if (rangePosition === "start" || rangePosition === "end" || rangePosition === "single") {
      // Endpoint cells get the full accent treatment
      cellClasses.push(
        "bg-gold-DEFAULT/20 text-gold-50 font-semibold cursor-pointer",
        "border border-gold-DEFAULT/40",
        "shadow-[0_0_12px_rgba(212,175,55,0.12)]",
        "hover:bg-gold-DEFAULT/28 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
        "active:scale-95"
      );
    } else {
      // Middle cells are subtle
      cellClasses.push(
        "bg-gold-DEFAULT/10 text-gold-100/90 cursor-pointer",
        "hover:bg-gold-DEFAULT/18",
        "active:scale-95"
      );
    }
  } else if (isPreview) {
    cellClasses.push(
      "bg-gold-DEFAULT/8 text-gold-100/60 cursor-pointer",
      "border border-dashed border-gold-DEFAULT/20",
      "rounded-xl"
    );
  } else {
    cellClasses.push(
      "text-gold-100/60 cursor-pointer",
      "hover:bg-gold-muted/10 hover:text-gold-50",
      "active:scale-95 active:bg-gold-muted/12"
    );
  }

  return (
    <div className={containerClasses.join(" ")}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          if (!isDisabled && !isOtherMonth) onMouseDown();
        }}
        onMouseEnter={() => {
          if (!isDisabled && !isOtherMonth) onMouseEnter();
        }}
        disabled={isDisabled || isOtherMonth}
        className={cellClasses.join(" ")}
        aria-label={`Day ${dayNumber}`}
      >
        <span className="relative z-10">{dayNumber}</span>

        {/* Today indicator dot */}
        {isToday && (
          <span
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-200 ${
              isSelected ? "bg-gold-50" : "bg-gold-DEFAULT"
            }`}
          />
        )}
      </button>
    </div>
  );
}

export default memo(DateCell);
