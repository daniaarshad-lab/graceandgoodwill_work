import { useState, useMemo } from "react";
import SectionCard from "./shared/SectionCard";
import { ClientRequest, CarerApplication } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";

interface MatchingPanelProps {
  requests: ClientRequest[];
  carers: CarerApplication[];
  selectedRequest: ClientRequest | null;
  setSelectedRequest: UseAdminPortalReturn["setSelectedRequestForMatching"];
  onCreateMatch: (requestId: string, carerId: string) => void;
}

export default function MatchingPanel({
  requests,
  carers,
  selectedRequest,
  setSelectedRequest,
  onCreateMatch,
}: MatchingPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarerId, setSelectedCarerId] = useState<string | null>(null);

  // Available client requests for matching (unmatched or emergency)
  const unmatchedRequests = useMemo(() => {
    return requests.filter(
      (r) => r.status === "Unmatched" || r.status === "Emergency",
    );
  }, [requests]);

  // Approved carers pool
  const approvedCarers = useMemo(() => {
    return carers.filter((c) => c.status === "Approved");
  }, [carers]);

  // Calculate matching stats for each carer against selected client request
  const carerMatchResults = useMemo(() => {
    if (!selectedRequest) return [];

    return approvedCarers
      .map((carer) => {
        let score = 0;
        const reasons: string[] = [];

        // City match
        if (
          carer.city.toLowerCase() === selectedRequest.location.toLowerCase()
        ) {
          score += 40;
          reasons.push("Location Match (Same City)");
        }

        // Specialty matches
        const notesLower = selectedRequest.notes.toLowerCase();
        const matchedSpecialties = carer.specialties.filter((spec) =>
          notesLower.includes(spec.toLowerCase()),
        );
        if (matchedSpecialties.length > 0) {
          score += matchedSpecialties.length * 20;
          reasons.push(`Specialty Match: ${matchedSpecialties.join(", ")}`);
        }

        // Experience score
        const yearsMatch = carer.experience.match(/\d+/);
        if (yearsMatch) {
          const years = parseInt(yearsMatch[0]);
          if (years >= 5) {
            score += 15;
            reasons.push("Senior Caregiver (5+ Years)");
          }
        }

        return {
          carer,
          score,
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [selectedRequest, approvedCarers]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gold-200">
          Admin Matching Workflow
        </h3>
        <p className="text-xs text-gold-100/50">
          Select an unmatched client file to run automated criteria pairing with
          our credentialed carer pool
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Care Request Selector */}
        <div className="space-y-4 lg:col-span-1">
          <SectionCard>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200 mb-4">
              1. Choose Client Request
            </h4>

            {unmatchedRequests.length === 0 ? (
              <p className="text-xs text-gold-100/40 text-center py-4">
                No active unmatched requests. All set!
              </p>
            ) : (
              <div className="space-y-3">
                {unmatchedRequests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => {
                      setSelectedRequest(req);
                      setSelectedCarerId(null);
                    }}
                    className={`w-full rounded-xl p-3 border text-left transition-all ${
                      selectedRequest?.id === req.id
                        ? "border-gold bg-gold/10 shadow-elegant"
                        : "border-gold-300/10 bg-navy-950 hover:border-gold-300/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gold-200 truncate block max-w-[150px]">
                        {req.clientName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                          req.urgency === "Emergency"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-gold/10 text-gold-DEFAULT"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                    <p className="text-[10px] text-gold-100/50 mt-1">
                      {req.careType} • {req.location}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Selected Request Details Preview Card */}
          {selectedRequest && (
            <SectionCard className="border border-gold-300/20 bg-navy-900">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-3">
                Request Specifications
              </h4>
              <div className="space-y-2 text-xs text-gold-100/80 leading-relaxed">
                <div>
                  <span className="font-bold text-gold-200">Client:</span>{" "}
                  {selectedRequest.clientName}
                </div>
                <div>
                  <span className="font-bold text-gold-200">Start Date:</span>{" "}
                  {selectedRequest.startDate}
                </div>
                <div>
                  <span className="font-bold text-gold-200">Location:</span>{" "}
                  {selectedRequest.location}
                </div>
                <div className="rounded-lg bg-navy-950 p-2.5 border border-gold-300/5 text-gold-200/90 italic">
                  &ldquo;{selectedRequest.notes}&rdquo;
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right Side: Carer Recommendation List */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard>
            <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200">
                  2. Review Matching Candidates
                </h4>
                <p className="text-xs text-gold-100/50">
                  Ranked by location compatibility and specialty alignment
                </p>
              </div>

              {selectedRequest && (
                <input
                  type="text"
                  placeholder="Filter pool name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg bg-navy-950 border border-gold-300/10 px-3 py-1 text-xs text-gold-100 focus:outline-none focus:border-gold-300/30"
                />
              )}
            </div>

            {!selectedRequest ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gold-300/10 rounded-2xl">
                <svg
                  className="h-8 w-8 text-gold-100/30 mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <p className="text-xs text-gold-100/40">
                  Please select a care request from the left list to load
                  matching recommended carer options.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {carerMatchResults
                  .filter((item) =>
                    item.carer.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map(({ carer, score, reasons }) => (
                    <div
                      key={carer.id}
                      className="rounded-xl border border-gold-300/10 bg-navy-950 p-4 transition-all hover:border-gold-300/20"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Carer details */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-gold-200 text-sm">
                              {carer.name}
                            </h5>
                            <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold text-gold">
                              Match Score: {score}%
                            </span>
                          </div>
                          <p className="text-xs text-gold-100/40 mt-0.5">
                            {carer.city} • {carer.experience} Experience • DBS:{" "}
                            {carer.dbsStatus}
                          </p>

                          {/* Match reasons highlights */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {reasons.map((reason) => (
                              <span
                                key={reason}
                                className="rounded px-2 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedCarerId(carer.id)}
                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                              selectedCarerId === carer.id
                                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                : "bg-gold text-navy-950 hover:opacity-90"
                            }`}
                          >
                            {selectedCarerId === carer.id
                              ? "Selected Candidate"
                              : "Choose Carer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Big Pair Trigger button */}
                {selectedCarerId && (
                  <div className="border-t border-gold-300/10 pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        onCreateMatch(selectedRequest.id, selectedCarerId);
                      }}
                      className="rounded-xl bg-gold px-6 py-3 text-xs font-bold text-navy-950 shadow-elegant hover:scale-[1.01] hover:opacity-90 transition-all"
                    >
                      Confirm Placement Assignment ✓
                    </button>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
