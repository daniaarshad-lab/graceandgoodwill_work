"use client";

import { useState, useCallback, useMemo } from "react";
import { LocalRange } from "./types";
import DateCell, { RangePosition } from "./DateCell";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  buildDateString,
  isToday,
  isPastDate,
  expandRange,
  toISODateString,
} from "../../utils/date.utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  ranges: LocalRange[];
  activeEditRangeId: string | null;
  onAddRange: (start: string, end: string) => void;
  onUpdateActiveRange: (start: string, end: string) => void;
  rangeStart: string | null;
  onSetRangeStart: (dateStr: string | null) => void;
  hoverDate: string | null;
  onSetHoverDate: (dateStr: string | null) => void;
  variant?: "solid" | "hollow";
}

interface GridCell {
  dateStr: string;
  dayNumber: number;
  isOtherMonth: boolean;
}

export default function CalendarGrid({
  ranges,
  activeEditRangeId,
  onAddRange,
  onUpdateActiveRange,
  rangeStart,
  onSetRangeStart,
  hoverDate,
  onSetHoverDate,
  variant = "solid",
}: CalendarGridProps) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }, []);

  const isCurrentMonthToday =
    currentYear === now.getFullYear() && currentMonth === now.getMonth();

  // Build grid cells
  const gridCells = useMemo<GridCell[]>(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const cells: GridCell[] = [];

    // Leading days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push({
        dateStr: buildDateString(prevYear, prevMonth, day),
        dayNumber: day,
        isOtherMonth: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        dateStr: buildDateString(currentYear, currentMonth, day),
        dayNumber: day,
        isOtherMonth: false,
      });
    }

    // Trailing days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells) {
      cells.push({
        dateStr: buildDateString(nextYear, nextMonth, nextDay),
        dayNumber: nextDay,
        isOtherMonth: true,
      });
      nextDay++;
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Compute preview range (hover feedback while building a range)
  const previewSet = useMemo<Set<string>>(() => {
    if (!rangeStart) return new Set();
    if (!hoverDate) return new Set([rangeStart]);
    const lo = rangeStart < hoverDate ? rangeStart : hoverDate;
    const hi = rangeStart < hoverDate ? hoverDate : rangeStart;
    return new Set(expandRange(lo, hi));
  }, [rangeStart, hoverDate]);

  // Compute lookup map for dates to ranges
  const dateToRangeMap = useMemo(() => {
    const map = new Map<string, LocalRange>();
    for (const r of ranges) {
      const dates = expandRange(r.start, r.end);
      for (const d of dates) {
        map.set(d, r);
      }
    }
    return map;
  }, [ranges]);

  // Compute range position for each cell
  const getRangePosition = useCallback(
    (dateStr: string, isSelected: boolean, range: LocalRange | undefined): RangePosition => {
      if (!isSelected || !range) return "none";
      if (dateStr === range.start && dateStr === range.end) return "single";
      if (dateStr === range.start) return "start";
      if (dateStr === range.end) return "end";
      if (dateStr > range.start && dateStr < range.end) return "middle";
      return "none";
    },
    []
  );

  // Compute preview range position for each cell
  const getPreviewPosition = useCallback(
    (dateStr: string): RangePosition => {
      if (!rangeStart || !hoverDate) return "none";
      const lo = rangeStart < hoverDate ? rangeStart : hoverDate;
      const hi = rangeStart < hoverDate ? hoverDate : rangeStart;
      if (dateStr === lo && dateStr === hi) return "single";
      if (dateStr === lo) return "start";
      if (dateStr === hi) return "end";
      if (dateStr > lo && dateStr < hi) return "middle";
      return "none";
    },
    [rangeStart, hoverDate]
  );

  // Date click handler — implements range selection
  const handleDateMouseDown = useCallback(
    (dateStr: string) => {
      if (rangeStart === null) {
        // First click: start range selection
        onSetRangeStart(dateStr);
      } else {
        // Second click: complete the range
        const lo = rangeStart < dateStr ? rangeStart : dateStr;
        const hi = rangeStart < dateStr ? dateStr : rangeStart;
        if (activeEditRangeId) {
          onUpdateActiveRange(lo, hi);
        } else {
          onAddRange(lo, hi);
        }
      }
    },
    [rangeStart, activeEditRangeId, onSetRangeStart, onAddRange, onUpdateActiveRange]
  );

  const handleDateMouseEnter = useCallback(
    (dateStr: string) => {
      if (rangeStart) {
        onSetHoverDate(dateStr);
      }
    },
    [rangeStart, onSetHoverDate]
  );

  return (
    <div
      className="flex flex-col h-full"
      onMouseLeave={() => onSetHoverDate(null)}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gold-50 tracking-tight">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          {!isCurrentMonthToday && (
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-[11px] font-semibold tracking-wide uppercase
                rounded-lg border border-gold-muted/30 text-gold-300
                hover:bg-gold-muted/10 hover:border-gold-muted/50 hover:text-gold-100
                transition-all duration-200 active:scale-95"
            >
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-gold-300/60 hover:text-gold-100 hover:bg-gold-muted/10
              transition-all duration-200 active:scale-90"
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-gold-300/60 hover:text-gold-100 hover:bg-gold-muted/10
              transition-all duration-200 active:scale-90"
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
        </div>
      </div>



      {/* Range selection hint */}
      {rangeStart && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-gold-DEFAULT/[0.06] border border-gold-DEFAULT/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT animate-pulse" />
            <span className="text-[11px] text-gold-200/70 font-medium">
              Click another date to complete the range
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onSetRangeStart(null);
              onSetHoverDate(null);
            }}
            className="text-[10px] text-gold-DEFAULT hover:text-gold-200 hover:underline font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-0">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[11px] font-semibold uppercase tracking-widest text-gold-muted/50 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 flex-1">
        {gridCells.map((cell) => {
          const range = dateToRangeMap.get(cell.dateStr);
          const isSelected = !!range;
          const isPreview = previewSet.has(cell.dateStr);
          const rangePosition = isSelected
            ? getRangePosition(cell.dateStr, isSelected, range)
            : isPreview
              ? getPreviewPosition(cell.dateStr)
              : "none";
              
          // Dim other ranges if we are editing a specific range
          const isEditingOthers = activeEditRangeId !== null && range && range.id !== activeEditRangeId;
          const isEditingThis = activeEditRangeId !== null && range && range.id === activeEditRangeId;

          return (
            <div key={cell.dateStr} className={isEditingOthers ? "opacity-30 pointer-events-none" : ""}>
              <DateCell
                dayNumber={cell.dayNumber}
                isSelected={isSelected}
                isToday={isToday(cell.dateStr)}
                isDisabled={!cell.isOtherMonth && isPastDate(cell.dateStr)}
                isOtherMonth={cell.isOtherMonth}
                isPreview={isPreview}
                rangePosition={rangePosition}
                isRangeStart={cell.dateStr === rangeStart}
                isHoverDate={cell.dateStr === hoverDate}
                colorIndex={range ? range.colorIndex : 0}
                isEditing={isEditingThis}
                variant={variant}
                onMouseDown={() => handleDateMouseDown(cell.dateStr)}
                onMouseEnter={() => handleDateMouseEnter(cell.dateStr)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helper icons ────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Inline date helpers ─────────────────────────────────────────────────────

function getPrevDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d - 1, 12, 0, 0);
  return toISODateString(date);
}

function getNextDayStr(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + 1, 12, 0, 0);
  return toISODateString(date);
}
