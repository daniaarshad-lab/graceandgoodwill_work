import SectionCard from "./shared/SectionCard";
import { CareRequest } from "@/types/client.types";

interface RequestTrackingProps {
  careRequests: CareRequest[];
}

export default function RequestTracking({
  careRequests,
}: RequestTrackingProps) {
  const getProgress = (status: string) => {
    switch (status) {
      case "PENDING":
        return 15;
      case "REVIEWING":
        return 45;
      case "MATCHED":
        return 75;
      case "COMPLETED":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Care Placement Progress
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Track requirements review and carer pairing processes in real time.
        </p>
      </div>

      <div className="space-y-6">
        {careRequests.map((req) => {
          const progress = getProgress(req.status);

          return (
            <SectionCard key={req.id} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-300 font-bold">
                    Tracking ID: {req.id}
                  </span>

                  <h4 className="text-lg font-bold text-gold-50 mt-0.5">
                    {req.careCategory}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gold-100/50">
                    Expected Placement: {req.startDate}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      req.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : req.status === "MATCHED"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : req.status === "REVIEWING"
                            ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20"
                            : "bg-navy-950 text-gold-100/40 border border-gold-300/10"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative flex justify-between">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-950 -translate-y-1/2 z-0 border-t border-gold-300/10" />

                  <div
                    className="absolute top-1/2 left-0 h-1 bg-gold-DEFAULT -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />

                  {[
                    { label: "Pending", threshold: 15 },
                    { label: "Reviewing", threshold: 45 },
                    { label: "Matched", threshold: 75 },
                    { label: "Completed", threshold: 100 },
                  ].map((cp) => {
                    const isActive = progress >= cp.threshold;

                    return (
                      <div
                        key={cp.label}
                        className="relative z-10 flex flex-col items-center"
                      >
                        <div
                          className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-navy-950 border-gold-DEFAULT text-gold-DEFAULT shadow-soft"
                              : "bg-navy-950 border-gray-300/20 text-gold-100/20"
                          }`}
                        >
                          {isActive ? "✓" : "•"}
                        </div>

                        <span
                          className={`text-[10px] font-bold mt-2 tracking-wider ${
                            isActive ? "text-gold-200" : "text-gold-100/20"
                          }`}
                        >
                          {cp.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-xs text-gold-100/50 pt-2 border-t border-gold-300/10">
                  <span>Allocated Duration: {req.duration}</span>

                  <span>Overall Placement Completeness: {progress}%</span>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
