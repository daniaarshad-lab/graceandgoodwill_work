import { useState, useMemo } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { Placement, CarerApplication } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";

interface PlacementTrackingProps {
  placements: Placement[];
  carers: CarerApplication[];
  onToggleContactRelease: UseAdminPortalReturn["handleToggleContactRelease"];
  onReassignCarer: UseAdminPortalReturn["handleOverridePlacementCarer"];
}

export default function PlacementTracking({
  placements,
  carers,
  onToggleContactRelease,
  onReassignCarer,
}: PlacementTrackingProps) {
  const [filter, setFilter] = useState<
    "All" | "Active" | "Matched" | "Completed"
  >("All");
  const [expandedPlacementId, setExpandedPlacementId] = useState<string | null>(
    null,
  );
  const [reassignPlacementId, setReassignPlacementId] = useState<string | null>(
    null,
  );
  const [selectedNewCarerId, setSelectedNewCarerId] = useState<string>("");

  const filteredPlacements = placements.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter;
  });

  // Approved Carers pool for reassignment overrides
  const approvedCarers = useMemo(() => {
    return carers.filter((c) => c.status === "Approved");
  }, [carers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Care Placement Tracking Pipeline
          </h3>
          <p className="text-xs text-gold-100/50">
            Monitor active matchups, authorize contact release, perform manual
            override swaps, and audit operational timelines
          </p>
        </div>

        <div className="flex rounded-xl bg-navy-950 p-1 border border-gold-300/10">
          {(["All", "Active", "Matched", "Completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                filter === tab
                  ? "bg-gold text-navy-950 shadow-elegant"
                  : "text-gold-100/60 hover:text-gold-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Placements Listing */}
      <div className="space-y-6">
        {filteredPlacements.map((place) => {
          const isExpanded = expandedPlacementId === place.id;
          const isReassigning = reassignPlacementId === place.id;

          return (
            <SectionCard key={place.id} className="space-y-5">
              {/* Row Grid */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-300/5 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-bold text-gold-200">
                      {place.clientName}
                    </h4>
                    <span className="text-gold-100/40">➔</span>
                    <h4 className="text-lg font-bold text-gold">
                      {place.carerName}
                    </h4>
                  </div>
                  <p className="text-xs text-gold-100/50 mt-1">
                    {place.careType} • {place.location} • Commenced:{" "}
                    {place.startDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={place.status} />
                  <button
                    onClick={() =>
                      setExpandedPlacementId(isExpanded ? null : place.id)
                    }
                    className="rounded-lg bg-navy-950 px-3 py-1.5 text-xs text-gold-200 border border-gold-300/10 hover:border-gold-300/20 transition"
                  >
                    {isExpanded ? "Hide Details ▲" : "Expand Details ▼"}
                  </button>
                </div>
              </div>

              {/* Collapsible Expansion Box */}
              {isExpanded && (
                <div className="grid gap-6 md:grid-cols-2 bg-navy-950/40 p-4 rounded-xl border border-gold-300/5 transition duration-300">
                  {/* Contact details authorization gates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
                        Contact Details Visibility Gate
                      </h5>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          place.contactDetailsReleased
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-gold/10 text-gold-DEFAULT border border-gold/20"
                        }`}
                      >
                        {place.contactDetailsReleased
                          ? "Released"
                          : "Restricted"}
                      </span>
                    </div>

                    <div className="space-y-2 rounded-xl bg-navy-950 p-3 border border-gold-300/5 text-xs">
                      <div className="flex items-center justify-between border-b border-gold-300/5 pb-2">
                        <span className="text-gold-100/40 font-semibold">
                          Client Phone / Email:
                        </span>
                        <span className="text-gold-200 font-medium font-mono">
                          {place.contactDetailsReleased
                            ? "+44 7700 910777"
                            : "****** Restricted ******"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gold-100/40 font-semibold">
                          Carer Phone / Email:
                        </span>
                        <span className="text-gold-200 font-medium font-mono">
                          {place.contactDetailsReleased
                            ? "+44 7700 900882"
                            : "****** Restricted ******"}
                        </span>
                      </div>
                    </div>

                    {/* Authorization Toggle button */}
                    <button
                      onClick={() => onToggleContactRelease(place.id)}
                      className={`w-full rounded-xl py-2.5 text-xs font-bold border transition ${
                        place.contactDetailsReleased
                          ? "border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10"
                          : "border-gold text-gold bg-gold/10 hover:bg-gold/20"
                      }`}
                    >
                      {place.contactDetailsReleased
                        ? "Revoke Details Visibility Gate"
                        : "Approve Contact Release"}
                    </button>
                  </div>

                  {/* Operational Tracker Timeline */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
                      Chronological Milestone Audit
                    </h5>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {place.timeline.map((event, eventIdx) => (
                          <li key={event.title}>
                            <div className="relative pb-8">
                              {eventIdx !== place.timeline.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gold-300/10"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-950 text-gold-DEFAULT border border-gold-300/10">
                                    ✓
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1.5">
                                  <p className="text-xs font-bold text-gold-200">
                                    {event.title}
                                  </p>
                                  <p className="text-[10px] text-gold-100/40">
                                    {event.timestamp}
                                  </p>
                                  <p className="text-[11px] text-gold-100/60 italic mt-1">
                                    &ldquo;{event.description}&rdquo;
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Override / Reassignment Actions bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold-300/5 pt-4">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gold-100/30">
                  Critical Placement Tools
                </p>

                {isReassigning ? (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={selectedNewCarerId}
                      onChange={(e) => setSelectedNewCarerId(e.target.value)}
                      className="rounded-lg bg-navy-950 border border-gold-300/10 px-3 py-2 text-xs text-gold-200 focus:outline-none"
                    >
                      <option value="">Select Replacement Carer...</option>
                      {approvedCarers
                        .filter((c) => c.id !== place.carerId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.city} - {c.experience})
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => {
                        if (selectedNewCarerId) {
                          onReassignCarer(place.id, selectedNewCarerId);
                          setReassignPlacementId(null);
                          setSelectedNewCarerId("");
                        }
                      }}
                      disabled={!selectedNewCarerId}
                      className="rounded-lg bg-gold px-4 py-2 text-xs font-bold text-navy-950 shadow-elegant disabled:opacity-50"
                    >
                      Reassign
                    </button>
                    <button
                      onClick={() => {
                        setReassignPlacementId(null);
                        setSelectedNewCarerId("");
                      }}
                      className="rounded-lg border border-gold-300/10 bg-navy-950 px-3 py-2 text-xs text-gold-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setReassignPlacementId(place.id)}
                    className="rounded-xl border border-gold-300/15 bg-navy-950/40 px-4 py-2 text-xs font-bold text-gold-200 hover:border-gold-300/30 transition-all"
                  >
                    Manual Override (Reassign Carer)
                  </button>
                )}
              </div>
            </SectionCard>
          );
        })}

        {filteredPlacements.length === 0 && (
          <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
            No placements found matching the &apos;{filter}&apos; filter.
          </div>
        )}
      </div>
    </div>
  );
}
