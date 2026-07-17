import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { ComplianceDoc } from "../types/carer.types";
import Button from "@/components/Button";
import { groupDatesIntoRanges, formatRangeDisplay } from "../utils/date.utils";
import { useAppSelector } from "@/store/hooks";

interface DashboardOverviewProps {
  applicationStatus: "pending" | "approved" | "rejected";
  complianceDocs: ComplianceDoc[];
  availability: string[];
  setActiveTab: (tab: any) => void;
}

export default function DashboardOverview({
  applicationStatus,
  complianceDocs,
  availability,
  setActiveTab,
}: DashboardOverviewProps) {
  const profile = useAppSelector((state) => state.carer.profile);

  const rejectedDocs = complianceDocs.filter(
    (doc) => doc.status === "failed" && doc.rejectionReason,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Application Review Status Badges Widget */}
      <SectionCard className="md:col-span-2 space-y-6">
        <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
          <h3 className="text-lg font-bold text-gold-200">
            Application Progress
          </h3>
          <span className="text-xs text-gold-100/50">
            Status ID: GGW-2026-CARER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm text-gold-100/70">
              Your professional live-in carer application is currently in review
              by our care managers.
            </p>
            <p className="text-xs text-gold-100/50">
              We are currently verifying background reports and licenses
              uploaded.
            </p>
          </div>

          <div className="flex justify-center sm:justify-end">
            <StatusBadge status={applicationStatus} />
          </div>
        </div>


      </SectionCard>


      {/* Profile completeness Quick Stats widget */}
      <SectionCard className="space-y-4">
        <h4 className="font-bold text-gold-200 text-sm">Dashboard Overview</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4">
            <p className="text-[10px] text-gold-100/50 uppercase tracking-wider font-semibold">
              Docs Uploaded
            </p>
            <p className="text-2xl font-semibold text-gold-50">
              {complianceDocs.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2.5 min-h-[160px] flex flex-col">
            <p className="text-[10px] text-gold-100/50 uppercase tracking-wider font-semibold">
              Selected Dates
            </p>
            {availability.length === 0 ? (
              <p className="text-xs text-gold-100/35 flex-1 flex items-center">
                No availability selected yet
              </p>
            ) : (
              <ul className="text-xs text-gold-100/80 space-y-1.5 overflow-y-auto pr-1 flex-1 scroll-smooth">
                {groupDatesIntoRanges(availability).map((range) => (
                  <li
                    key={`${range.start}-${range.end}`}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT mt-1.5 flex-shrink-0" />
                    <span className="leading-tight">
                      {formatRangeDisplay(range)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Quick links & notifications panel */}
      <SectionCard className="md:col-span-2 space-y-4">
        <h4 className="font-bold text-gold-200 text-sm">Action Required</h4>
        <div className="space-y-3">
          {rejectedDocs.length > 0 ? (
            rejectedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10"
              >
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-rose-300">
                      Rejected: {doc.name}
                    </p>
                    <p className="text-xs text-gold-100/70">
                      Reason : {doc.rejectionReason || "Please upload a new version for verification."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className="text-xs font-bold text-gold-DEFAULT hover:text-gold-200 hover:underline px-3.5 py-1.5 rounded-xl border border-gold-300/10 hover:border-gold-300/30 bg-navy-950/40 transition shrink-0 ml-4 animate-none"
                >
                  Update
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-gold-300/10 bg-navy-950/20 text-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mb-2" />
              <p className="text-xs font-bold text-gold-200">No Action Required</p>
              <p className="text-[11px] text-gold-100/50 mt-1">
                All compliance documents are current and in order.
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
