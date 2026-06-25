import { useState, useMemo } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { Placement, CarerApplication } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import Button from "@/components/Button";
import Link from "next/link";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface PlacementTrackingProps {
  placements: Placement[];
  carers: CarerApplication[];
  onToggleContactRelease: UseAdminPortalReturn["handleToggleContactRelease"];
  onReassignCarer: UseAdminPortalReturn["handleOverridePlacementCarer"];
  refreshPlacements?: () => void;
}

export default function PlacementTracking({
  placements,
  carers,
  onToggleContactRelease,
  onReassignCarer,
  refreshPlacements,
}: PlacementTrackingProps) {
  const [filter, setFilter] = useState<
    "All" | "PLACEMENT_STARTED" | "PLACEMENT_CONFIRMED" | "COMPLETED" | "ONGOING" | "CANCELLED"
  >("All");
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);
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

  const handleUpdateStatus = async (placementId: string, newStatus: string) => {
    setUpdatingStatusFor(placementId);
    try {
      await adminService.updatePlacementStatus(placementId, newStatus);
      showSuccessToast("Status Updated", "Placement status successfully updated.");
      if (refreshPlacements) {
        refreshPlacements();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      showErrorToast("Failed to update status", error.message);
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  return (
    <div className="space-y-6">
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

        <div className="flex flex-wrap rounded-xl bg-navy-950 p-1 border border-gold-300/10 gap-1 max-w-full overflow-x-auto">
          {[
            { label: "All", value: "All" },
            { label: "Active", value: "PLACEMENT_STARTED" },
            { label: "Matched", value: "PLACEMENT_CONFIRMED" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              variant="selectable"
              isSelected={filter === tab.value}
              size="sm"
              fullWidth={false}
              className="rounded-lg px-4 py-1.5 text-xs tracking-wide whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPlacements.map((place) => {
          const isExpanded = expandedPlacementId === place.id;
          const isReassigning = reassignPlacementId === place.id;

          return (
            <SectionCard key={place.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-300/5 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/admin/clients/${place.clientId}`}
                      className="text-lg font-bold text-gold-200 hover:text-gold hover:underline transition duration-200 cursor-pointer"
                    >
                      {place.clientName}
                    </Link>
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
                  <select
                    value={place.status}
                    disabled={updatingStatusFor === place.id}
                    onChange={(e) => handleUpdateStatus(place.id, e.target.value)}
                    className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-[10px] font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer"
                  >
                    <option value="PLACEMENT_CONFIRMED">Matched</option>
                    <option value="PLACEMENT_STARTED">Active</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button
                    onClick={() =>
                      setExpandedPlacementId(isExpanded ? null : place.id)
                    }
                    variant="ghost-gold"
                    size="sm"
                    fullWidth={false}
                  >
                    {isExpanded ? "Hide Details ▲" : "Expand Details ▼"}
                  </Button>
                </div>
              </div>

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

                    <Button
                      onClick={() => onToggleContactRelease(place.id)}
                      variant={
                        place.contactDetailsReleased ? "danger" : "primary"
                      }
                      size="sm"
                      fullWidth
                    >
                      {place.contactDetailsReleased
                        ? "Revoke Details Visibility Gate"
                        : "Approve Contact Release"}
                    </Button>
                  </div>

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

                {place.status?.toUpperCase() === "PLACEMENT_STARTED" || place.status?.toUpperCase() === "ONGOING" ? (
                  isReassigning ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <select
                        value={selectedNewCarerId}
                        onChange={(e) => setSelectedNewCarerId(e.target.value)}
                        className="w-full sm:w-auto rounded-lg bg-navy-950 border border-gold-300/10 px-3 py-2 text-xs text-gold-200 focus:outline-none"
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

                      <Button
                        onClick={() => {
                          if (selectedNewCarerId) {
                            onReassignCarer(place.id, selectedNewCarerId);
                            setReassignPlacementId(null);
                            setSelectedNewCarerId("");
                          }
                        }}
                        disabled={!selectedNewCarerId}
                        variant="primary"
                        size="sm"
                        fullWidth={false}
                      >
                        Reassign
                      </Button>
                      <Button
                        onClick={() => {
                          setReassignPlacementId(null);
                          setSelectedNewCarerId("");
                        }}
                        variant="ghost-gold"
                        size="sm"
                        fullWidth={false}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setReassignPlacementId(place.id)}
                      variant="ghost-gold"
                      size="sm"
                      fullWidth={false}
                      className="font-bold bg-navy-950/40 border border-gold-300/15"
                    >
                      Manual Override (Reassign Carer)
                    </Button>
                  )
                ) : (
                  <span className="text-xs text-rose-400 font-semibold italic bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                    Reassignment disabled: Placement is {place.status.toLowerCase()} (contract inactive)
                  </span>
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
