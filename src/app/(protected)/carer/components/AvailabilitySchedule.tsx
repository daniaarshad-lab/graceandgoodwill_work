"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCarerAvailability } from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import {
  sanitizeDateArray,
  expandRange,
  toISODateString,
  DateRange,
} from "../utils/date.utils";

import SectionCard from "./shared/SectionCard";
import CalendarGrid from "./availability/CalendarGrid";
import CalendarSkeleton from "./availability/CalendarSkeleton";
import AvailabilitySummaryPanel from "./availability/AvailabilitySummaryPanel";

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
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);

  // Hydrate from server
  useEffect(() => {
    if (profile && !isProfileLoading) {
      setSelectedDates(new Set(serverDates));
      setIsHydrated(true);
    }
  }, [serverDates, profile, isProfileLoading]);

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    if (!isHydrated) return false;
    if (selectedDates.size !== serverDates.size) return true;
    for (const date of selectedDates) {
      if (!serverDates.has(date)) return true;
    }
    return false;
  }, [selectedDates, serverDates, isHydrated]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddRange = useCallback((start: string, end: string) => {
    const dates = expandRange(start, end);
    setSelectedDates((prev) => {
      const next = new Set(prev);
      for (const d of dates) {
        next.add(d);
      }
      return next;
    });
  }, []);

  const handleToggleDate = useCallback((dateStr: string) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  }, []);

  const handleRemoveRange = useCallback((range: DateRange) => {
    const dates = expandRange(range.start, range.end);
    setSelectedDates((prev) => {
      const next = new Set(prev);
      for (const d of dates) {
        next.delete(d);
      }
      return next;
    });
  }, []);

  const handleQuickAction = useCallback(
    (action: "today" | "tomorrow" | "next7" | "next30" | "clear") => {
      const today = new Date();
      const todayStr = toISODateString(today);

      switch (action) {
        case "today":
          setSelectedDates((prev) => new Set([...prev, todayStr]));
          break;

        case "tomorrow": {
          const tmr = new Date(today);
          tmr.setDate(tmr.getDate() + 1);
          setSelectedDates((prev) => new Set([...prev, toISODateString(tmr)]));
          break;
        }

        case "next7": {
          const end = new Date(today);
          end.setDate(end.getDate() + 6);
          const dates = expandRange(todayStr, toISODateString(end));
          setSelectedDates((prev) => new Set([...prev, ...dates]));
          break;
        }

        case "next30": {
          const end = new Date(today);
          end.setDate(end.getDate() + 29);
          const dates = expandRange(todayStr, toISODateString(end));
          setSelectedDates((prev) => new Set([...prev, ...dates]));
          break;
        }

        case "clear":
          setSelectedDates(new Set());
          setRangeStart(null);
          break;
      }
    },
    []
  );

  const handleSave = useCallback(async () => {
    const payload = Array.from(selectedDates).sort();

    try {
      setIsSaving(true);
      await dispatch(updateCarerAvailability(payload)).unwrap();
      showSuccessToast(
        "Availability Updated",
        "Availability updated successfully"
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
  }, [selectedDates, dispatch]);

  const selectedDatesArray = useMemo(
    () => Array.from(selectedDates),
    [selectedDates]
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SectionCard className="max-w-6xl mx-auto !p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[560px]">
        {/* Left: Calendar */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Section Header */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gold-200">
              Availability Calendar
            </h3>
            <p className="text-xs text-gold-100/45 mt-1">
              Click a start date, then an end date to select a range. Click a selected date to remove it.
            </p>
          </div>

          {isProfileLoading || !isHydrated ? (
            <CalendarSkeleton />
          ) : (
            <CalendarGrid
              selectedDates={selectedDates}
              onAddRange={handleAddRange}
              onToggleDate={handleToggleDate}
              rangeStart={rangeStart}
              onSetRangeStart={setRangeStart}
            />
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gold-300/10 to-transparent" />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-gold-300/10 to-transparent" />

        {/* Right: Summary Panel */}
        <div className="w-full lg:w-[320px] xl:w-[360px] p-6 lg:p-8 bg-navy-950/30">
          {isProfileLoading || !isHydrated ? (
            <SummarySkeleton />
          ) : (
            <AvailabilitySummaryPanel
              selectedDates={selectedDatesArray}
              onRemoveRange={handleRemoveRange}
              onSave={handleSave}
              onQuickAction={handleQuickAction}
              isSaving={isSaving}
              hasChanges={hasChanges}
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
