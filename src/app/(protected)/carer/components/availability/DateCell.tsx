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
  isRangeStart?: boolean;
  isHoverDate?: boolean;
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
  isRangeStart,
  isHoverDate,
  onMouseDown,
  onMouseEnter,
}: DateCellProps) {
  // ─── Container classes (row-level range fill band wrapper) 
  const containerClasses = [
    "relative flex items-center justify-center w-full aspect-square",
  ];

  // Apply pseudo-element based horizontal ranges
  if (!isOtherMonth && rangePosition !== "none" && rangePosition !== "single") {
    if (isSelected) {
      if (rangePosition === "start") containerClasses.push("range-start");
      else if (rangePosition === "end") containerClasses.push("range-end");
      else if (rangePosition === "middle") containerClasses.push("range-middle");
    } else if (isPreview) {
      if (rangePosition === "start") containerClasses.push("range-preview-start");
      else if (rangePosition === "end") containerClasses.push("range-preview-end");
      else if (rangePosition === "middle") containerClasses.push("range-preview-middle");
    }
  }

  // ─── Inner cell classes 
  const cellClasses = [
    "relative flex items-center justify-center",
    "w-7 h-7 sm:w-9 sm:h-9",
    "text-sm select-none",
    "transition-all duration-200 ease-out z-10",
  ];

  // ─── State-based styling 
  if (isOtherMonth) {
    cellClasses.push(
      "text-gold-100/10 cursor-default bg-transparent rounded-full",
    );
  } else if (isDisabled) {
    cellClasses.push(
      "text-gold-100/20 cursor-not-allowed bg-transparent rounded-full",
    );
  } else if (isSelected) {
    if (rangePosition === "start" || rangePosition === "single" || rangePosition === "end") {
      // Perfect filled circle with brand/accent color
      cellClasses.push(
        "bg-gold-DEFAULT text-white font-bold rounded-full cursor-pointer",
        "shadow-[0_0_12px_rgba(212,175,55,0.3)]",
        "hover:bg-gold-200 hover:scale-105",
        "active:scale-95",
      );
    } else if (rangePosition === "middle") {
      // Middle dates: transparent button, sits inside the continuous capsule bar
      cellClasses.push(
        "bg-transparent text-white font-semibold rounded-none cursor-pointer",
        "active:scale-95",
      );
    }
  } else if (isPreview) {
    if (isRangeStart || isHoverDate) {
      // Active endpoints (clicked start or hovered end) in preview: Perfect filled circle
      cellClasses.push(
        "bg-gold-DEFAULT text-white font-bold rounded-full cursor-pointer",
        "shadow-[0_0_12px_rgba(212,175,55,0.3)]",
        "hover:bg-gold-200 hover:scale-105",
        "active:scale-95",
      );
    } else {
      // Middle date in preview
      cellClasses.push(
        "bg-transparent text-gold-100 font-semibold rounded-none cursor-pointer",
        "active:scale-95",
      );
    }
  } else {
    // Unselected cells
    cellClasses.push(
      "text-gold-100/60 rounded-full cursor-pointer",
      "hover:bg-gold-muted/15 hover:text-gold-50 hover:scale-105",
      "active:scale-95 active:bg-gold-muted/20",
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
      </button>
    </div>
  );
}

export default memo(DateCell);
