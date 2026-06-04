import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { ClientRequest } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import Button from "@/components/Button";

interface ClientRequestsProps {
  requests: ClientRequest[];
  setSelectedRequestForMatching: UseAdminPortalReturn["setSelectedRequestForMatching"];
  setActiveTab: UseAdminPortalReturn["setActiveTab"];
}

export default function ClientRequests({
  requests,
  setSelectedRequestForMatching,
  setActiveTab,
}: ClientRequestsProps) {
  const [filter, setFilter] = useState<
    "All" | "Unmatched" | "Matched" | "Emergency"
  >("All");

  const filteredRequests = requests.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Emergency")
      return r.status === "Emergency" || r.urgency === "Emergency";
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Client Care Requests
          </h3>
          <p className="text-xs text-gold-100/50">
            Manage incoming family requests, support needs, and triage urgent
            assignments
          </p>
        </div>

        <div className="flex rounded-xl bg-navy-950 p-1 border border-gold-300/10 gap-1">
          {(["All", "Unmatched", "Matched", "Emergency"] as const).map(
            (tab) => (
              <Button
                key={tab}
                onClick={() => setFilter(tab)}
                variant="selectable"
                isSelected={filter === tab}
                size="sm"
                fullWidth={false}
                className="rounded-lg px-4 py-1.5 text-xs tracking-wide"
              >
                {tab}
              </Button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredRequests.map((req) => (
          <SectionCard
            key={req.id}
            className={`flex flex-col justify-between space-y-4 ${
              req.urgency === "Emergency" || req.status === "Emergency"
                ? "border-rose-500/30 bg-rose-950/5 hover:border-rose-500/40"
                : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gold-200">
                    {req.clientName}
                  </h4>
                  <p className="text-xs text-gold-100/40">
                    Location: {req.location}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={req.status} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      req.urgency === "Emergency"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                        : req.urgency === "High"
                          ? "bg-gold/10 text-gold border border-gold/20"
                          : "bg-navy-950 text-gold-100/40 border border-gold-300/5"
                    }`}
                  >
                    {req.urgency} Urgency
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-navy-950/60 p-3.5 border border-gold-300/5">
                <div className="flex items-center justify-between text-xs border-b border-gold-300/5 pb-2">
                  <span className="text-gold-100/40 font-semibold uppercase">
                    Care Type:
                  </span>
                  <span className="text-gold-200 font-medium">
                    {req.careType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gold-100/40 font-semibold uppercase">
                    Start Date:
                  </span>
                  <span className="text-gold-200 font-medium">
                    {req.startDate}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-1">
                  Family Notes & Custom Needs
                </p>
                <p className="text-xs text-gold-100/70 italic bg-navy-950/30 p-2.5 rounded-lg border border-gold-300/5 leading-relaxed">
                  &ldquo;{req.notes}&rdquo;
                </p>
              </div>
            </div>

            {req.status !== "Matched" ? (
              <Button
                onClick={() => {
                  setSelectedRequestForMatching(req);
                  setActiveTab("matching");
                }}
                variant={req.urgency === "Emergency" ? "danger" : "primary"}
                size="sm"
                fullWidth
              >
                Match Available Carer ➔
              </Button>
            ) : (
              <div className="flex items-center justify-center rounded-xl bg-emerald-500/10 p-3 text-center border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                ✓ Placement Assigned & Tracked
              </div>
            )}
          </SectionCard>
        ))}

        {filteredRequests.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
            No client requests found in the &apos;{filter}&apos; category.
          </div>
        )}
      </div>
    </div>
  );
}
