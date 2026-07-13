"use client";

import { memo } from "react";
import { RANGE_COLORS } from "./colors";

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
  isEditing?: boolean;
  colorIndex?: number;
  variant?: "solid" | "hollow";
  dateStr: string;
  onMouseDown: (dateStr: string) => void;
  onMouseEnter: (dateStr: string) => void;
  onMouseUp: (dateStr: string) => void;
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
  isEditing,
  colorIndex = 0,
  variant = "solid",
  dateStr,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DateCellProps) {
  const rangeColor = RANGE_COLORS[colorIndex % RANGE_COLORS.length];
  
  // Use solid colors computed against the navy background to prevent double-opacity 
  // lines when pseudo elements overlap to cover sub-pixel gaps.
  const rangeBgColor = isPreview ? "#22221f" : "#363222";

  // ─── Container classes (row-level range fill band wrapper) 
  const containerClasses = [
    "relative flex items-center justify-center w-full transition-all duration-200 ease-out",
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
    variant === "hollow" ? "w-5 h-5 sm:w-6 sm:h-6" : "w-7 h-7 sm:w-8 sm:h-8",
    variant === "hollow" ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm",
    "select-none transition-all duration-200 ease-out z-10",
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
      // Circle styling based on variant
      if (variant === "hollow") {
        cellClasses.push(
          rangeColor.ringClass, "font-bold rounded-full cursor-pointer",
          "hover:scale-105", "active:scale-95"
        );
      } else {
        cellClasses.push(
          rangeColor.bgClass, rangeColor.textClass, "font-bold rounded-full cursor-pointer",
          rangeColor.shadowClass,
          rangeColor.hoverBgClass, "hover:scale-105",
          "active:scale-95",
        );
      }
      if (isEditing) cellClasses.push("ring-2 ring-white/50 ring-offset-1 ring-offset-navy-950 animate-pulse");
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
        rangeColor.bgClass, rangeColor.textClass, "font-bold rounded-full cursor-pointer",
        rangeColor.shadowClass,
        rangeColor.hoverBgClass, "hover:scale-105",
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
    <div className={containerClasses.join(" ")} style={{ "--range-bg": rangeBgColor } as any}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          if (!isDisabled && !isOtherMonth) onMouseDown(dateStr);
        }}
        onMouseEnter={() => {
          if (!isDisabled && !isOtherMonth) onMouseEnter(dateStr);
        }}
        onMouseUp={() => {
          if (!isDisabled && !isOtherMonth) onMouseUp(dateStr);
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
