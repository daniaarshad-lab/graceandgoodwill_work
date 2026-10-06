"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, User, Shield, Clock } from "lucide-react";

interface PlacementCalendarViewProps {
  primaryCarerName?: string;
  reliefCarerName?: string;
  leaveStartDate?: string; // e.g. "2026-10-15"
  leaveEndDate?: string;   // e.g. "2026-10-22"
  className?: string;
}

export default function PlacementCalendarView({
  primaryCarerName = "Primary Carer",
  reliefCarerName = "Relief Carer",
  leaveStartDate,
  leaveEndDate,
  className = "",
}: PlacementCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const leaveStart = leaveStartDate ? new Date(leaveStartDate) : null;
  const leaveEnd = leaveEndDate ? new Date(leaveEndDate) : null;

  const getDayStatus = (dayNumber: number) => {
    if (!leaveStart || !leaveEnd) return "PRIMARY";
    const dayDate = new Date(year, month, dayNumber);
    const dayDateOnly = dayDate.toISOString().split("T")[0];
    const startOnly = leaveStart.toISOString().split("T")[0];
    const endOnly = leaveEnd.toISOString().split("T")[0];

    const isReliefPeriod = dayDateOnly >= startOnly && dayDateOnly <= endOnly;
    if (isReliefPeriod) {
      return "RELIEF";
    }
    return "PRIMARY";
  };

  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      className={`rounded-2xl border border-gold-300/20 bg-navy-900/60 p-6 shadow-xl space-y-5 ${className}`}
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h4 className="text-base font-bold text-gold-200">
            Placement Schedule & Dates Served
          </h4>
          <p className="text-xs text-gold-100/60 mt-0.5">
            Color-coded shift calendar showing Primary vs. Relief carer coverage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-navy-950 border border-gold-300/20 p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-gold-100/70 hover:text-gold-200 hover:bg-gold-300/10 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gold-200 px-3">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-gold-100/70 hover:text-gold-200 hover:bg-gold-300/10 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-navy-950/60 p-3 rounded-xl border border-gold-300/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-gold-100/80 font-medium">
            Primary Carer: <span className="text-white font-bold">{primaryCarerName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
          <span className="text-gold-100/80 font-medium">
            Active Relief Carer: <span className="text-white font-bold">{reliefCarerName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500" />
          <span className="text-gold-100/80 font-medium">Primary Carer On Holiday / Leave</span>
        </div>
      </div>

      {/* Month Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDayLabels.map((lbl) => (
            <span
              key={lbl}
              className="text-[11px] font-bold uppercase text-gold-100/50 py-1.5"
            >
              {lbl}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-xl bg-navy-950/20 border border-transparent" />
          ))}

          {/* Days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const status = getDayStatus(dayNum);
            const isSelected = selectedDay === dayNum;

            let badgeStyle = "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400";
            let dotColor = "bg-emerald-400";

            if (status === "RELIEF") {
              badgeStyle = "bg-indigo-950/50 border-indigo-500/50 text-indigo-200 hover:border-indigo-300 font-bold";
              dotColor = "bg-indigo-400";
            }

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-11 rounded-xl border flex flex-col items-center justify-center relative transition-all cursor-pointer ${badgeStyle} ${
                  isSelected ? "ring-2 ring-gold scale-105 shadow-md shadow-gold/20" : ""
                }`}
              >
                <span className="text-xs font-semibold">{dayNum}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Breakdown */}
      {selectedDay && (
        <div className="p-4 rounded-xl bg-navy-950 border border-gold-300/15 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold-300/10 text-gold-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-gold-100/50 font-bold block">
                {selectedDay} {monthNames[month]} {year}
              </span>
              <p className="font-bold text-white text-sm">
                {getDayStatus(selectedDay) === "RELIEF"
                  ? `Active Relief Care Coverage • ${reliefCarerName}`
                  : `Primary Ongoing Live-in Care • ${primaryCarerName}`}
              </p>
            </div>
          </div>

          <span
            className={`self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              getDayStatus(selectedDay) === "RELIEF"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {getDayStatus(selectedDay) === "RELIEF" ? "Relief Coverage" : "Primary Service"}
          </span>
        </div>
      )}
    </div>
  );
}
