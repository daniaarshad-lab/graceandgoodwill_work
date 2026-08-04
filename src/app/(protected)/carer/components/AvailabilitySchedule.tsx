"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCarerAvailability } from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import {
  sanitizeDateArray,
  expandRange,
  toISODateString,
  groupDatesIntoRanges,
  rangeDayCount,
} from "../utils/date.utils";
import { Info } from "lucide-react";

import { LocalRange } from "./availability/types";
import SectionCard from "./shared/SectionCard";
import CalendarGrid from "./availability/CalendarGrid";
import CalendarSkeleton from "./availability/CalendarSkeleton";
import AvailabilitySummaryPanel from "./availability/AvailabilitySummaryPanel";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface AvailabilityScheduleProps {
  isProfileLoading: boolean;
}

export default function AvailabilitySchedule({
  isProfileLoading,
}: AvailabilityScheduleProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.carer.profile);

  // Server-synced dates — sanitized to avoid "undefined undefined NaN"
  const serverDates = useMemo<Set<string>>(() => {
    const clean = sanitizeDateArray(profile?.availability);
    return new Set(clean);
  }, [profile?.availability]);

  // Local working copy
  const [ranges, setRanges] = useState<LocalRange[]>([]);
  const [activeEditRangeId, setActiveEditRangeId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Reset hydration state when profile starts loading
  useEffect(() => {
    if (isProfileLoading) {
      setIsHydrated(false);
    }
  }, [isProfileLoading]);

  // Hydrate from server
  useEffect(() => {
    if (profile && !isProfileLoading && !isHydrated) {
      const parsedRanges = groupDatesIntoRanges(Array.from(serverDates));
      setRanges(
        parsedRanges.map((r, i) => ({
          id: generateId(),
          start: r.start,
          end: r.end,
          colorIndex: i,
        })),
      );
      setIsHydrated(true);
    }
  }, [serverDates, profile, isProfileLoading, isHydrated]);

  const flatSelectedDates = useMemo(() => {
    const dates = new Set<string>();
    for (const r of ranges) {
      for (const d of expandRange(r.start, r.end)) {
        dates.add(d);
      }
    }
    return dates;
  }, [ranges]);

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    if (!isHydrated) return false;
    if (flatSelectedDates.size !== serverDates.size) return true;
    for (const date of flatSelectedDates) {
      if (!serverDates.has(date)) return true;
    }
    return false;
  }, [flatSelectedDates, serverDates, isHydrated]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddRange = useCallback((start: string, end: string) => {
    setRanges((prev) => [
      ...prev,
      { id: generateId(), start, end, colorIndex: prev.length },
    ]);
    setRangeStart(null);
    setHoverDate(null);
  }, []);

  const handleUpdateActiveRange = useCallback(
    (start: string, end: string) => {
      setRanges((prev) =>
        prev.map((r) =>
          r.id === activeEditRangeId ? { ...r, start, end } : r,
        ),
      );
      setActiveEditRangeId(null);
      setRangeStart(null);
      setHoverDate(null);
    },
    [activeEditRangeId],
  );

  const handleEditRange = useCallback((id: string) => {
    setActiveEditRangeId(id);
    setRangeStart(null);
    setHoverDate(null);
  }, []);

  const handleRemoveRange = useCallback(
    (id: string) => {
      setRanges((prev) => prev.filter((r) => r.id !== id));
      if (activeEditRangeId === id) {
        setActiveEditRangeId(null);
      }
    },
    [activeEditRangeId],
  );

  const handleQuickAction = useCallback(
    (action: "next2" | "next7" | "next30" | "clear") => {
      const today = new Date();
      const todayStr = toISODateString(today);
      setRangeStart(null); // Clear pending selection in all cases
      setHoverDate(null);
      setActiveEditRangeId(null);

      switch (action) {
        case "next2": {
          const end = new Date(today);
          end.setDate(end.getDate() + 1);
          setRanges([
            {
              id: generateId(),
              start: todayStr,
              end: toISODateString(end),
              colorIndex: 0,
            },
          ]);
          break;
        }

        case "next7": {
          const end = new Date(today);
          end.setDate(end.getDate() + 6);
          setRanges([
            {
              id: generateId(),
              start: todayStr,
              end: toISODateString(end),
              colorIndex: 0,
            },
          ]);
          break;
        }

        case "next30": {
          const end = new Date(today);
          end.setDate(end.getDate() + 29);
          setRanges([
            {
              id: generateId(),
              start: todayStr,
              end: toISODateString(end),
              colorIndex: 0,
            },
          ]);
          break;
        }

        case "clear":
          setRanges([]);
          break;
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const payload = Array.from(flatSelectedDates).sort();

    try {
      setIsSaving(true);
      await dispatch(updateCarerAvailability(payload)).unwrap();
      showSuccessToast(
        "Availability Updated",
        "Availability updated successfully",
      );
    } catch (error: unknown) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to save availability. Please try again.";
      showErrorToast("Update Failed", errorMsg);
    } finally {
      setIsSaving(false);
    }
  }, [flatSelectedDates, dispatch]);

  const isValid = useMemo(() => {
    if (ranges.length === 0) return false;
    return ranges.every((range) => rangeDayCount(range) >= 2);
  }, [ranges]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SectionCard className="w-full !p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[560px]">
        {/* Left: Calendar */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
          {/* Section Header */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gold-200">
              Availability Calendar
            </h3>
            <p className="text-xs text-gold-100/45 mt-1">
              Click a start date, then an end date to select a range. Click a
              selected date to remove it.
            </p>
          </div>

          {/* Availability Guidance Notice */}
          <div className="mb-6 p-4 rounded-xl bg-navy-900/40 border border-gold-300/10 flex items-start gap-3 backdrop-blur-md">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
              <Info className="w-4 h-4 text-gold-DEFAULT" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-semibold text-gold-200">
                Please provide a minimum of 2 consecutive available days.
              </p>
              <p className="text-xs text-gold-100/60 leading-relaxed font-light">
                We recommend adding as much future availability as possible,
                ideally several months in advance, so families can plan care
                well ahead of time and view your future availability.
              </p>
            </div>
          </div>

          {isProfileLoading || !isHydrated ? (
            <div className="flex-1">
              <CalendarSkeleton />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <CalendarGrid
                ranges={ranges}
                activeEditRangeId={activeEditRangeId}
                onAddRange={handleAddRange}
                onUpdateActiveRange={handleUpdateActiveRange}
                rangeStart={rangeStart}
                onSetRangeStart={setRangeStart}
                hoverDate={hoverDate}
                onSetHoverDate={setHoverDate}
              />
              {!isValid && (
                <p className="text-red-500 text-xs font-semibold mt-4">
                  Please provide a minimum of 2 consecutive available days.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gold-300/10 to-transparent" />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-gold-300/10 to-transparent" />

        {/* Right: Summary Panel */}
        <div className="w-full lg:w-[320px] xl:w-[360px] p-4 sm:p-6 lg:p-8 bg-navy-950/30">
          {isProfileLoading || !isHydrated ? (
            <SummarySkeleton />
          ) : (
            <AvailabilitySummaryPanel
              ranges={ranges}
              activeEditRangeId={activeEditRangeId}
              onEditRange={handleEditRange}
              onRemoveRange={handleRemoveRange}
              onSave={handleSave}
              onQuickAction={handleQuickAction}
              isSaving={isSaving}
              hasChanges={hasChanges}
              isValid={isValid}
            />
          )}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Skeleton sub-component ──────────────────────────────────────────────────

function SummarySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold-muted/8" />
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-gold-muted/8 rounded" />
          <div className="h-3 w-20 bg-gold-muted/6 rounded" />
        </div>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-16 bg-gold-muted/6 rounded-lg" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-gold-muted/5 rounded-xl calendar-skeleton"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
