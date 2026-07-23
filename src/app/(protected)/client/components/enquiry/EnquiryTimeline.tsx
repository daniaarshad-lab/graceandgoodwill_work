import { EnquiryStatus } from "../../types/client-ui.types";

interface EnquiryTimelineProps {
  status: EnquiryStatus;
}

const stages = [
  { label: "Submitted", key: 1 },
  { label: "Under Review", key: 2 },
  { label: "Responded", key: 3 },
  { label: "Resolved", key: 4 },
];

function getActiveStage(status: EnquiryStatus): number {
  switch (status) {
    case "PENDING":
      return 1;
    case "IN_PROGRESS":
      return 2;
    case "RESPONDED":
      return 3;
    case "RESOLVED":
    case "CLOSED":
      return 4;
    default:
      return 0;
  }
}

export default function EnquiryTimeline({ status }: EnquiryTimelineProps) {
  const activeStage = getActiveStage(status);

  return (
    <div className="relative flex justify-between items-start py-2">
      {/* Background track */}
      <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-navy-950 border-t border-gold-300/10 z-0" />

      {/* Active track */}
      <div
        className="absolute top-[14px] left-0 h-[2px] bg-gold-DEFAULT z-0 transition-all duration-500"
        style={{
          width: `${((activeStage - 1) / (stages.length - 1)) * 100}%`,
        }}
      />

      {stages.map((stage) => {
        const isActive = stage.key <= activeStage;
        const isCurrent = stage.key === activeStage;

        return (
          <div
            key={stage.key}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                isActive
                  ? "bg-navy-950 border-gold-DEFAULT text-gold-DEFAULT shadow-soft"
                  : "bg-navy-950 border-gray-300/20 text-gold-100/20"
              } ${isCurrent ? "ring-2 ring-gold-DEFAULT/20 ring-offset-1 ring-offset-navy-950" : ""}`}
            >
              {isActive ? "✓" : stage.key}
            </div>
            <span
              className={`text-[9px] font-bold mt-1.5 tracking-wider text-center leading-tight ${
                isActive ? "text-gold-200" : "text-gold-100/20"
              }`}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
