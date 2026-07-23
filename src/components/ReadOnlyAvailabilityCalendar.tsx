"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { groupDatesIntoRanges, sanitizeDateArray, formatRangeDisplay } from "@/app/(protected)/carer/utils/date.utils";
import CalendarGrid from "@/app/(protected)/carer/components/availability/CalendarGrid";
import { getRangeColor } from "@/app/(protected)/carer/components/availability/colors";
import { LocalRange } from "@/app/(protected)/carer/components/availability/types";

interface ReadOnlyAvailabilityCalendarProps {
  availability: string[] | undefined | null;
  wrapperClassName?: string;
  hideHeader?: boolean;
}

export default function ReadOnlyAvailabilityCalendar({
  availability,
  wrapperClassName,
  hideHeader,
}: ReadOnlyAvailabilityCalendarProps) {
  const ranges = useMemo<LocalRange[]>(() => {
    const cleanDates = sanitizeDateArray(availability || []);
    const grouped = groupDatesIntoRanges(cleanDates);
    return grouped.map((r, i) => ({
      id: `ro-${i}-${r.start}`,
      start: r.start,
      end: r.end,
      colorIndex: i,
    }));
  }, [availability]);

  return (
    <div className={wrapperClassName !== undefined ? wrapperClassName : "bg-navy-900/60 backdrop-blur-md border border-gold-300/10 rounded-2xl p-4 shadow-lg flex flex-col"}>
      {!hideHeader && (
        <div className="flex items-center space-x-2 text-sm font-medium text-gold-50 mb-3">
          <Calendar className="w-4 h-4 text-gold-300/70" />
          <span>Available Time Slots</span>
        </div>
      )}

      <div>
        {ranges.length > 0 ? (
          <CalendarGrid
            ranges={ranges}
            activeEditRangeId={null}
            onAddRange={() => {}}
            onUpdateActiveRange={() => {}}
            rangeStart={null}
            onSetRangeStart={() => {}}
            hoverDate={null}
            onSetHoverDate={() => {}}
            variant="hollow"
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4 rounded-xl bg-navy-950/50 border border-gold-300/5 text-sm text-gold-100/50 text-center">
            No availability has been provided.
          </div>
        )}
      </div>

      {ranges.length > 0 && (
        <div className="mt-3 space-y-2 pt-3 border-t border-gold-300/5">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold-300/50 mb-1">Summary</h4>
          <div className="grid gap-1.5 max-h-[100px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,128,84,0.15) transparent" }}>
            {ranges.map((range) => {
              const rangeColor = getRangeColor(range.colorIndex);
              return (
                <div key={range.id} className="flex items-center p-3 rounded-xl bg-navy-950/50 border border-gold-300/5 transition-colors hover:bg-navy-900/50">
                  <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mr-3 ${rangeColor.dotClass}`} />
                  <span className="text-xs font-medium text-gold-100/80 truncate">
                    {formatRangeDisplay(range)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
