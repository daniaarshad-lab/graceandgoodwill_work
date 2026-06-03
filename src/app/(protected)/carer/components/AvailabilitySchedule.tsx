import SectionCard from "./shared/SectionCard";
import { WeeklyAvailability } from "../types/carer.types";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";

interface AvailabilityScheduleProps {
  availability: WeeklyAvailability;
  availabilityError: string | null;
  availabilitySuccess: boolean;
  isAvailabilitySaving: boolean;
  handleSaveAvailability: (e: React.FormEvent) => void;
  handleToggleDay: (day: string) => void;
  handleToggleShift: (
    day: string,
    shift: "morning" | "afternoon" | "night",
  ) => void;
}

export default function AvailabilitySchedule({
  availability,
  availabilityError,
  availabilitySuccess,
  isAvailabilitySaving,
  handleSaveAvailability,
  handleToggleDay,
  handleToggleShift,
}: AvailabilityScheduleProps) {
  return (
    <SectionCard className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gold-300/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gold-200">
            Weekly Availability Schedule
          </h3>
          <p className="text-xs text-gold-100/50 mt-1">
            Configure your weekly slots and shift preferences for client
            assignment.
          </p>
        </div>
        <Button
          onClick={handleSaveAvailability}
          disabled={isAvailabilitySaving}
          variant="primary"
          size="sm"
          fullWidth={false}
        >
          {isAvailabilitySaving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>

      {availabilityError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {availabilityError}
        </div>
      )}

      {availabilitySuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          Availability schedule successfully updated and saved in memory!
        </div>
      )}

      <div className="space-y-4">
        {Object.keys(availability).map((day) => {
          const dayData = availability[day];
          return (
            <div
              key={day}
              className={`p-4 rounded-2xl border transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                dayData.enabled
                  ? "border-gold-300/20 bg-navy-950/40"
                  : "border-gold-300/5 bg-navy-950/10 opacity-60"
              }`}
            >
              {/* Day and Toggle switch */}
              <div className="flex items-center gap-4 min-w-[150px]">
                <Toggle
                  checked={dayData.enabled}
                  disabled={isAvailabilitySaving}
                  onChange={() => handleToggleDay(day)}
                />
                <div>
                  <h4 className="text-sm font-semibold text-gold-50">{day}</h4>
                  <p className="text-[10px] text-gold-100/40">
                    {dayData.enabled ? "Available for Shifts" : "Unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex-grow grid grid-cols-3 gap-3 w-full md:w-auto">
                {[
                  { id: "morning", label: "Morning", time: "8am - 12pm" },
                  { id: "afternoon", label: "Afternoon", time: "12pm - 5pm" },
                  { id: "night", label: "Night", time: "5pm - 10pm" },
                ].map((shift) => {
                  const isSelected =
                    dayData.shifts[
                      shift.id as "morning" | "afternoon" | "night"
                    ];
                  return (
                    <Button
                      key={shift.id}
                      variant="selectable"
                      isSelected={isSelected}
                      disabled={!dayData.enabled || isAvailabilitySaving}
                      onClick={() => handleToggleShift(day, shift.id as any)}
                      size="custom"
                      fullWidth
                      className="p-3 select-none flex-col items-center justify-center text-center gap-0.5"
                    >
                      <h5 className="text-xs font-semibold">{shift.label}</h5>
                      <p className="text-[9px] opacity-60">{shift.time}</p>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
