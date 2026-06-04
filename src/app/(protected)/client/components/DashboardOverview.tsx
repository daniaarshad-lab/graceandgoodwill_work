import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { CareRequest, Enquiry } from "../types/client.types";

interface DashboardOverviewProps {
  user: any;
  careRequests: CareRequest[];
  enquiries: Enquiry[];
  setActiveTab: (tab: any) => void;
}

export default function DashboardOverview({
  user,
  careRequests,
  enquiries,
  setActiveTab,
}: DashboardOverviewProps) {
  const latestRequest = careRequests[0];
  const sliceEnquiries = enquiries.slice(0, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quick Info & Stats */}
      <SectionCard className="md:col-span-2 space-y-6">
        <div className="border-b border-gold-300/10 pb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gold-200">
            Active Care Operations
          </h3>
          <span className="text-xs text-gold-100/50">Secure Node Coverage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-gold-100/50">
              Total Submissions
            </p>
            <p className="text-3xl font-bold text-gold-DEFAULT">
              {careRequests.length}
            </p>
            <p className="text-[10px] text-gold-100/40">
              Care requirements requested so far.
            </p>
          </div>

          <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-gold-100/50">
              Matched Matches
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {careRequests.filter((r) => r.status === "Matched").length}
            </p>
            <p className="text-[10px] text-gold-100/40">
              Carer placement confirmed and operational.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-300/10 bg-navy-950/20 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gold-50">
            Latest Request Update
          </h4>
          {latestRequest ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gold-200">
                  {latestRequest.careType}
                </p>
                <p className="text-[10px] text-gold-100/50 mt-1">
                  Started: {latestRequest.startDate} • Duration:{" "}
                  {latestRequest.duration}
                </p>
              </div>

              <StatusBadge status={latestRequest.status} />
            </div>
          ) : (
            <p className="text-xs text-gold-100/40">No requests registered.</p>
          )}
        </div>
      </SectionCard>

      {/* Fast Enquiries Summary card */}
      <SectionCard className="flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
            Support Coverage
          </h3>

          <div className="space-y-3">
            {sliceEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-3 rounded-xl border border-gold-300/10 bg-navy-950/20 space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gold-50 truncate max-w-[150px]">
                    {enq.subject}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                      enq.status === "Responded"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-gold-DEFAULT/10 text-gold-DEFAULT"
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
                <p className="text-[10px] text-gold-100/40">
                  Preference: {enq.preference} • Date: {enq.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setActiveTab("enquiry")}
          className="w-full rounded-xl bg-gold-DEFAULT py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
        >
          Create New Enquiry
        </button>
      </SectionCard>

      <SectionCard className="md:col-span-3 space-y-4">
        <h4 className="text-sm font-bold text-gold-200">
          Recent Portal Activity
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
            <p className="text-xs text-gold-100/70">
              Enquiry{" "}
              <span className="font-semibold">
                {enquiries[0]?.id || "ENQ-901"}
              </span>{" "}
              has been marked as completed/responded by Grace & Goodwill support
              staff.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
            <span className="h-2 w-2 rounded-full bg-gold-DEFAULT shrink-0"></span>
            <p className="text-xs text-gold-100/70">
              New live-in carer application tracking index requested for client{" "}
              {user?.firstName} {user?.lastName}.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
