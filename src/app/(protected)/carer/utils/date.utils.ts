/** Represents a contiguous date range (start → end inclusive) */
export interface DateRange {
  start: string;
  end: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

// ─── Validation ──────────────────────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Returns true if the string matches YYYY-MM-DD and represents a real date */
export function isValidDateString(dateStr: string): boolean {
  if (!ISO_DATE_RE.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** Filters out invalid/malformed date strings */
export function sanitizeDateArray(dates: unknown): string[] {
  if (!Array.isArray(dates)) return [];
  return dates.filter(
    (d): d is string => typeof d === "string" && isValidDateString(d)
  );
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Formats "2026-06-10" → "10 Jun 2026" */
export function formatDateDisplay(dateStr: string): string {
  if (!isValidDateString(dateStr)) return "Invalid date";
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTH_SHORT_NAMES[month - 1]} ${year}`;
}

/** Formats "2026-06-10" → "10 Jun" (short, without year) */
export function formatDateShort(dateStr: string): string {
  if (!isValidDateString(dateStr)) return "Invalid";
  const [, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTH_SHORT_NAMES[month - 1]}`;
}

/** Converts a Date object to "YYYY-MM-DD" string */
export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Builds a "YYYY-MM-DD" string from individual parts (0-indexed month) */
export function buildDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// ─── Calendar Math ───────────────────────────────────────────────────────────

/** Returns number of days in a given month (0-indexed month) */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns the day-of-week (0=Sun … 6=Sat) for the 1st of the month */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Returns the full month name for a 0-indexed month */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

// ─── Date Comparisons ────────────────────────────────────────────────────────

/** Returns true if the ISO date string represents today */
export function isToday(dateStr: string): boolean {
  return dateStr === toISODateString(new Date());
}

/** Returns true if the ISO date string is before today */
export function isPastDate(dateStr: string): boolean {
  return dateStr < toISODateString(new Date());
}

/** Sorts an array of ISO date strings in ascending order */
export function sortDatesAscending(dates: string[]): string[] {
  return [...dates].sort((a, b) => a.localeCompare(b));
}

/** Returns the next calendar day after a given ISO date string */
export function getNextDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + 1);
  return toISODateString(date);
}

// ─── Range Utilities ─────────────────────────────────────────────────────────

/**
 * Groups a flat array of ISO date strings into contiguous ranges.
 * e.g. ["2026-06-10","2026-06-11","2026-06-12","2026-06-15"]
 *    → [{ start: "2026-06-10", end: "2026-06-12" }, { start: "2026-06-15", end: "2026-06-15" }]
 */
export function groupDatesIntoRanges(dates: string[]): DateRange[] {
  const sorted = sortDatesAscending(dates);
  if (sorted.length === 0) return [];

  const ranges: DateRange[] = [];
  let currentStart = sorted[0];
  let currentEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const expected = getNextDay(currentEnd);
    if (sorted[i] === expected) {
      currentEnd = sorted[i];
    } else {
      ranges.push({ start: currentStart, end: currentEnd });
      currentStart = sorted[i];
      currentEnd = sorted[i];
    }
  }
  ranges.push({ start: currentStart, end: currentEnd });

  return ranges;
}

/**
 * Expands a date range into individual ISO date strings.
 * Both start and end are inclusive.
 */
export function expandRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = start;
  // Safety valve: max 366 days
  let safety = 0;
  while (current <= end && safety < 366) {
    dates.push(current);
    current = getNextDay(current);
    safety++;
  }
  return dates;
}

/**
 * Expands an array of ranges into a flat, deduplicated, sorted array of date strings.
 */
export function expandAllRanges(ranges: DateRange[]): string[] {
  const set = new Set<string>();
  for (const range of ranges) {
    for (const date of expandRange(range.start, range.end)) {
      set.add(date);
    }
  }
  return sortDatesAscending(Array.from(set));
}

/** Counts total individual days across all ranges */
export function countTotalDays(ranges: DateRange[]): number {
  let total = 0;
  for (const range of ranges) {
    total += expandRange(range.start, range.end).length;
  }
  return total;
}

/**
 * Formats a DateRange for display.
 * Single day:  "10 Jun 2026"
 * Multi day:   "10 Jun → 15 Jun 2026"
 * Cross-month: "28 Jun → 5 Jul 2026"
 */
export function formatRangeDisplay(range: DateRange): string {
  if (range.start === range.end) {
    return formatDateDisplay(range.start);
  }
  const [sy] = range.start.split("-");
  const [ey] = range.end.split("-");
  if (sy === ey) {
    return `${formatDateShort(range.start)} → ${formatDateShort(range.end)}`;
  }
  return `${formatDateDisplay(range.start)} → ${formatDateDisplay(range.end)}`;
}

/** Returns the number of days in a range */
export function rangeDayCount(range: DateRange): number {
  return expandRange(range.start, range.end).length;
}
