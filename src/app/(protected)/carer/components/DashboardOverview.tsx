import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { ComplianceDoc } from "../types/carer.types";
import Button from "@/components/Button";
import { groupDatesIntoRanges, formatRangeDisplay } from "../utils/date.utils";
import { useAppSelector } from "@/store/hooks";

interface DashboardOverviewProps {
  applicationStatus: "pending" | "approved" | "rejected";
  membershipActive: boolean;
  membershipExpiry: string;
  complianceDocs: ComplianceDoc[];
  availability: string[];
  setActiveTab: (tab: any) => void;
}

export default function DashboardOverview({
  applicationStatus,
  membershipActive,
  membershipExpiry,
  complianceDocs,
  availability,
  setActiveTab,
}: DashboardOverviewProps) {
  const profile = useAppSelector((state) => state.carer.profile);
  const membershipTier = (profile as any)?.membershipTier || "FREE";
  
  const planName = membershipTier === "GOLD_ELITE" ? "Gold Elite Membership" : "Free Membership";
  const billingNode = membershipTier === "GOLD_ELITE" ? "Annual Coverage" : "No Billing (Free)";

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

        {/* Progress bar visual indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gold-100/50">
            <span>Credentials Verification</span>
            <span>75% Verified</span>
          </div>
          <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-gold-300/10">
            <div
              className="h-full bg-gold-DEFAULT rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </SectionCard>

      {/* Membership Status elegant card UI */}
      <SectionCard className="border-gold-300/20 bg-gradient-to-br from-navy-900/60 to-navy-950/80 shadow-elegant flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-300">
                Grace & Goodwill
              </p>
              <h4 className="font-bold text-white text-lg">
                {planName}
              </h4>
            </div>
            {membershipActive ? (
              <span className="rounded-full bg-gold-DEFAULT/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-DEFAULT border border-gold-DEFAULT/30">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-500/30">
                Expired
              </span>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs">
              <span className="text-gold-100/50">Expiry Date:</span>
              <span className="text-gold-200 font-semibold">
                {membershipExpiry || "Lifetime"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gold-100/50">Billing Node:</span>
              <span className="text-gold-200 font-semibold">
                {billingNode}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() =>
            alert("Billing portal connection is in mockup simulation state.")
          }
          variant="primary"
          size="sm"
          fullWidth
        >
          Renew & Review Plan
        </Button>
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
          <div className="flex justify-between items-center p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-gold-DEFAULT"></span>
              <span className="text-xs text-gold-100/80">
                Submit your final CRB Criminal Record Check document for
                verification.
              </span>
            </div>
            <button
              onClick={() => setActiveTab("compliance")}
              className="text-xs font-semibold text-gold-DEFAULT hover:underline"
            >
              Update
            </button>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-gold-100/80">
                Specialty training certification verified by support team!
              </span>
            </div>
            <span className="text-[10px] text-gold-100/40 font-semibold">
              Verified
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
