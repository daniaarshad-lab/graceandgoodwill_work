import { useState, useMemo } from "react";
import SectionCard from "./shared/SectionCard";
import { ClientRequest, CarerApplication } from "../types/admin.types";

interface EmergencyCasesProps {
  requests: ClientRequest[];
  carers: CarerApplication[];
  onCreateMatch: (requestId: string, carerId: string) => void;
}

export default function EmergencyCases({
  requests,
  carers,
  onCreateMatch,
}: EmergencyCasesProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  // Filter urgent / emergency unmatched care files
  const urgentRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        (r.status === "Emergency" ||
          r.urgency === "Emergency" ||
          r.urgency === "High") &&
        r.status !== "Matched",
    );
  }, [requests]);

  const approvedCarers = useMemo(() => {
    return carers.filter((c) => c.status === "Approved");
  }, [carers]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
          </span>
          <h3 className="text-xl font-bold text-rose-400">
            Emergency Triage Dashboard
          </h3>
        </div>
        <p className="text-xs text-gold-100/50 mt-1">
          Resolve critical and high-priority care requests immediately with fast
          carer pairings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Escalation Ticket Queue */}
        <div className="lg:col-span-2 space-y-4">
          {urgentRequests.length === 0 ? (
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-12 text-center text-emerald-400">
              ✓ All emergency and high-urgency care requests successfully
              matched.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {urgentRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`cursor-pointer rounded-2xl border p-5 shadow-soft transition duration-300 ${
                    selectedRequestId === req.id
                      ? "border-rose-500 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                      : "border-rose-500/25 bg-navy-900/40 hover:border-rose-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-rose-300">
                        {req.clientName}
                      </h4>
                      <p className="text-xs text-gold-100/40">
                        {req.location} • COMMENCE: {req.startDate}
                      </p>
                    </div>
                    <span className="animate-pulse rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[8px] font-bold uppercase">
                      Urgent Case
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-200/50">
                    Care Specifications
                  </p>
                  <p className="mt-1 text-xs text-gold-200 font-medium font-mono">
                    {req.careType}
                  </p>

                  <p className="mt-3 text-xs text-gold-100/70 italic bg-navy-950/40 p-2.5 rounded-lg border border-gold-300/5 line-clamp-3">
                    &ldquo;{req.notes}&rdquo;
                  </p>

                  <div className="mt-4 flex justify-end text-xs font-bold text-rose-400">
                    Click to load triage matching ➔
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Fast Assign Triage matches drawer */}
        <div className="lg:col-span-1">
          <SectionCard className="border border-rose-500/20 bg-navy-900 h-full">
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 border-b border-rose-500/10 pb-3 mb-4">
              Fast Assign Match Panel
            </h4>

            {!selectedRequestId ? (
              <p className="text-xs text-gold-100/40 text-center py-12">
                Select an urgent care file from the triage list to load
                immediate matching candidates.
              </p>
            ) : (
              (() => {
                const reqObj = urgentRequests.find(
                  (r) => r.id === selectedRequestId,
                );
                if (!reqObj) return null;

                // Recommend approved carers based on location/specialty
                const matchCarers = approvedCarers
                  .map((c) => {
                    let points = 0;
                    if (c.city.toLowerCase() === reqObj.location.toLowerCase())
                      points += 40;
                    const noteMatches = c.specialties.filter((s) =>
                      reqObj.notes.toLowerCase().includes(s.toLowerCase()),
                    );
                    points += noteMatches.length * 20;
                    return { carer: c, points };
                  })
                  .sort((a, b) => b.points - a.points);

                return (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gold-100/50 uppercase font-semibold">
                        Triage Target client:
                      </p>
                      <p className="text-sm font-bold text-gold-200">
                        {reqObj.clientName}
                      </p>
                      <p className="text-xs text-gold-100/40">
                        Requires: {reqObj.careType} in {reqObj.location}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gold-200/50">
                        Matching Available Pool:
                      </p>
                      {matchCarers.map(({ carer, points }) => (
                        <div
                          key={carer.id}
                          className="rounded-xl bg-navy-950 p-3 border border-gold-300/5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gold-200">
                                {carer.name}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-400">
                                {points}% Match
                              </span>
                            </div>
                            <p className="text-[10px] text-gold-100/40">
                              {carer.city} • {carer.experience} exp
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              onCreateMatch(reqObj.id, carer.id);
                              setSelectedRequestId(null);
                            }}
                            className="mt-3 w-full rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] py-1.5 transition-all text-center"
                          >
                            Assign immediately ✓
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
