import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { Placement, CarerApplication } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import Button from "@/components/Button";
import Link from "next/link";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import InternalNotes from "./shared/InternalNotes/InternalNotes";
import AdminPlacementDetailModal from "./AdminPlacementDetailModal";

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
  const router = useRouter();
  const [filter, setFilter] = useState<
    | "All"
    | "PLACEMENT_STARTED"
    | "PLACEMENT_CONFIRMED"
    | "COMPLETED"
    | "ONGOING"
    | "CANCELLED"
  >("All");
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(
    null,
  );
  const [detailModalPlacementId, setDetailModalPlacementId] = useState<
    string | null
  >(null);
  const [togglingContactId, setTogglingContactId] = useState<string | null>(null);

  const handleToggleContact = async (placementId: string) => {
    setTogglingContactId(placementId);
    try {
      await onToggleContactRelease(placementId);
      if (refreshPlacements) refreshPlacements();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to toggle contact release.");
    } finally {
      setTogglingContactId(null);
    }
  };





  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      ACTIVE: "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400",
      PAUSED:
        "bg-amber-950/60 border border-amber-500/30 text-amber-400 animate-pulse",
      CANCELLED: "bg-red-950/60 border border-red-500/30 text-red-400",
      PAID: "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400",
      PENDING: "bg-amber-950/60 border border-amber-500/30 text-amber-400",
      FAILED:
        "bg-red-950/60 border border-red-500/30 text-red-400 animate-pulse",
      OVERDUE: "bg-rose-950/60 border border-rose-500/30 text-rose-400",
      REFUNDED: "bg-slate-900 border border-slate-700 text-slate-400",
    };
    return statusMap[status.toUpperCase()] || "bg-navy-800 text-slate-400";
  };

  const filteredPlacements = placements.filter((p) => {
    // Placements only exist once accepted by carer
    if (p.status === "PENDING_ACCEPTANCE") return false;
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
      showSuccessToast(
        "Status Updated",
        "Placement status successfully updated.",
      );
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
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gold-200 mb-1.5">
            Care Placement Tracking Pipeline
          </h3>
          <p className="text-xs text-gold-100/50 max-w-xl leading-relaxed">
            Monitor active matchups, authorize contact release, perform manual
            override swaps, and audit operational timelines
          </p>
        </div>

        <div
          className="flex flex-nowrap items-center rounded-xl bg-navy-950 p-1 border border-gold-300/10 gap-1 max-w-full overflow-x-auto admin-placement-tabs"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.admin-placement-tabs::-webkit-scrollbar { display: none; }`}</style>
          {[
            { label: "All", value: "All" },
            { label: "Matched", value: "PLACEMENT_CONFIRMED" },
            { label: "Active", value: "PLACEMENT_STARTED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Re-assignment Needed", value: "REJECTED_BY_CARER" },
            { label: "Completed", value: "COMPLETED" },
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

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 admin-placement-list-scroll">
        <style>{`
          .admin-placement-list-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .admin-placement-list-scroll::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.4);
            border-radius: 4px;
          }
          .admin-placement-list-scroll::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 55, 0.2);
            border-radius: 4px;
          }
          .admin-placement-list-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(212, 175, 55, 0.4);
          }
        `}</style>
        {filteredPlacements.map((place) => {
          return (
            <div
              key={place.id}
              className="rounded-xl border border-gold-300/10 bg-navy-900/60 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-gold-300/20 space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col min-w-[120px] max-w-[200px]">
                      <span className="text-[9px] uppercase tracking-widest text-gold-100/40 font-bold mb-0.5">
                        Client
                      </span>
                      <Link
                        href={`/admin/clients/${place.clientId}`}
                        className="text-[15px] font-medium text-white hover:text-gold hover:underline transition duration-200 cursor-pointer truncate"
                        title={place.clientName}
                      >
                        {place.clientName}
                      </Link>
                    </div>

                    <div className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-navy-950 border border-gold-300/10 mt-3">
                      <ArrowRight className="w-3 h-3 text-gold/40" />
                    </div>

                    <div className="flex flex-col min-w-[120px] max-w-[200px]">
                      <span className="text-[9px] uppercase tracking-widest text-gold-100/40 font-bold mb-0.5">
                        Assigned Carer
                      </span>
                      <h4
                        className="text-[15px] font-medium text-gold-200 truncate"
                        title={place.carerName}
                      >
                        {place.carerName}
                      </h4>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                    <p className="text-sm text-gold-100/50 truncate">
                      {place.careType &&
                        (Array.isArray(place.careType)
                          ? place.careType.join(", ")
                          : place.careType) + " • "}
                      {place.location} • Commenced: {place.startDate}
                    </p>
                    {place.contactDetailsReleased ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> Contacts Released
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Lock className="w-3 h-3" /> Contacts Locked (48h Auto)
                      </span>
                    )}
                  </div>

                  {place.status === "REJECTED_BY_CARER" && (
                    <div className="mt-2.5 flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-rose-300">
                          Placement Offer Declined by Carer ({place.carerName}) — Re-assignment Needed
                        </p>
                        <p className="text-[11px] text-rose-300/80">
                          {place.rejectionReason ? `Reason: "${place.rejectionReason}" — ` : ""}
                          The care request has been reverted to Under Review.
                        </p>
                      </div>
                    </div>
                  )}


                </div>

                <div className="flex flex-nowrap items-center gap-2 shrink-0 mt-2 md:mt-0">
                  <Button
                    onClick={() => handleToggleContact(place.id)}
                    variant={place.contactDetailsReleased ? "outline" : "primary"}
                    size="sm"
                    fullWidth={false}
                    disabled={togglingContactId === place.id}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      place.contactDetailsReleased
                        ? "!border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                        : ""
                    }`}
                    title={
                      place.contactDetailsReleased
                        ? "Revoke client contact details from carer view"
                        : "Manually unlock and release client contact details to carer immediately"
                    }
                  >
                    {togglingContactId === place.id ? (
                      "Updating..."
                    ) : place.contactDetailsReleased ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Revoke
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 mr-1" /> Release
                      </>
                    )}
                  </Button>
                  <select
                    value={place.status}
                    disabled={updatingStatusFor === place.id}
                    onChange={(e) =>
                      handleUpdateStatus(place.id, e.target.value)
                    }
                    className="rounded-md border border-gold-300/20 bg-navy-950 px-2 py-1.5 text-xs font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer"
                  >
                    <option value="PENDING_ACCEPTANCE">Pending Carer Acceptance</option>
                    <option value="PLACEMENT_CONFIRMED">Matched</option>
                    <option value="PLACEMENT_STARTED">Active</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="REJECTED_BY_CARER">Re-assignment Needed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button
                    onClick={() => router.push(`/placement/${place.id}`)}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                    className="px-4 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    View Full Placement →
                  </Button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredPlacements.length === 0 && (
          <div className="rounded-xl border border-gold-300/10 p-10 text-center text-gold-100/50 text-sm bg-navy-900/40">
            No placements found matching the &apos;{filter}&apos; filter.
          </div>
        )}
      </div>

      {detailModalPlacementId && (
        <AdminPlacementDetailModal
          placementId={detailModalPlacementId}
          timeline={placements.find((p) => p.id === detailModalPlacementId)?.timeline}
          onClose={() => setDetailModalPlacementId(null)}
          onPlacementUpdated={refreshPlacements}
        />
      )}
    </div>
  );
}
