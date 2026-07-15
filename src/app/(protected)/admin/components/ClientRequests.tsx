import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import { ClientRequest } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import Button from "@/components/Button";
import Pagination from "./shared/Pagination";
import Link from "next/link";
import AdminApplicationsModal from "./AdminApplicationsModal";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { CARE_REQUEST_STATUS_OPTIONS } from "@/types/admin.types";

interface ClientRequestsProps {
  requests: ClientRequest[];
  setActiveTab: UseAdminPortalReturn["setActiveTab"];

  page: number;
  totalPages: number;
  totalItems: number;
  status: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  refreshRequests: () => void;
}

export default function ClientRequests({
  requests,
  setActiveTab,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
  refreshRequests,
}: ClientRequestsProps) {
  const [selectedRequestIdForApps, setSelectedRequestIdForApps] = useState<string | null>(null);
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);

  const handleStatusChange = async (reqId: string, newStatus: string, currentStatus: string) => {
    if (newStatus === currentStatus) return; // Prevent duplicate API calls
    
    setUpdatingStatusFor(reqId);
    try {
      await adminService.updateCareRequestStatus(reqId, newStatus);
      showSuccessToast("Status Updated", "Care request status has been updated.");
      // Trigger a reload of requests to reflect the new status
      refreshRequests();
    } catch (err: any) {
      showErrorToast("Update Failed", err.message || "Failed to update status.");
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gold-200 mb-1.5">
            Client Care Requests
          </h3>
          <p className="text-xs text-gold-100/50 max-w-xl leading-relaxed">
            Review incoming requests from clients and match them with suitable
            carers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold tracking-wider uppercase text-gold-200/60">
            Filter Status:
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-gold-300/10 bg-navy-950 px-4 py-2 text-xs font-bold text-gold-200 outline-none focus:border-gold-300/30 transition duration-300 cursor-pointer"
          >
            <option value="ALL">All</option>
            {CARE_REQUEST_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <SectionCard
            key={req.id}
            className={`flex flex-col justify-between space-y-4 ${req.urgency === "Emergency"
                ? "border-rose-500/30 bg-rose-950/5 hover:border-rose-500/40"
                : ""
              }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col flex-1">
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
                  <select
                    value={req.status}
                    disabled={updatingStatusFor === req.id}
                    onChange={(e) => handleStatusChange(req.id, e.target.value, req.status)}
                    className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-[10px] font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer"
                  >
                    {CARE_REQUEST_STATUS_OPTIONS.map((opt, index) => {
                      const currentIndex = CARE_REQUEST_STATUS_OPTIONS.findIndex(
                        (o) => o.value === req.status
                      );
                      // Disable the current status and all previous statuses in the workflow
                      const isDisabled = currentIndex !== -1 && index <= currentIndex;

                      return (
                        <option
                          key={opt.value}
                          value={opt.value}
                          disabled={isDisabled}
                          className={isDisabled ? "opacity-50 cursor-not-allowed text-gold-100/30" : ""}
                        >
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${req.urgency === "Emergency"
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
                <div className="flex items-start justify-between text-xs border-b border-gold-300/5 pb-2">
                  <span className="text-gold-100/40 font-semibold uppercase shrink-0 mt-0.5">
                    Care Type:
                  </span>
                  <span className="text-gold-200 font-medium text-right ml-4 line-clamp-2">
                    {Array.isArray(req.careType) ? req.careType.join(", ") : req.careType}
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

              <div className="mt-4 flex flex-col flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-1">
                  Family Notes & Custom Needs
                </p>
                <div 
                  className="bg-navy-950/30 rounded-lg border border-gold-300/5 overflow-y-auto h-24 p-2.5"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181, 148, 105, 0.3) transparent" }}
                >
                  <p className="text-xs text-gold-100/70 italic leading-relaxed">
                    &ldquo;{req.notes}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-4 shrink-0">
              <Button
                onClick={() => setSelectedRequestIdForApps(req.id)}
                variant="outline"
                size="sm"
                fullWidth
              >
                View Applications
              </Button>

              {(req.status as string) === "CARER_SELECTED" && (
                <div className="flex items-center justify-center rounded-xl bg-emerald-500/10 p-3 text-center border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  ✓ Placement Assigned & Tracked
                </div>
              )}

              {req.clientId ? (
                <Link href={`/admin/clients/${req.clientId}`} className="w-full">
                  <Button
                    variant="ghost-gold"
                    size="sm"
                    fullWidth
                  >
                    View Details / Manage Client
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost-gold"
                  size="sm"
                  fullWidth
                  disabled
                >
                  Client Profile Unavailable
                </Button>
              )}

              {req.clientId && (req.interestListCount ?? 0) > 0 && (
                <Link href={`/admin/clients/${req.clientId}/interest-list?clientName=${encodeURIComponent(req.clientName)}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="!border-emerald-500/30 !text-emerald-400 hover:!bg-emerald-500/10"
                  >
                    ❤️ View Interest List ({req.interestListCount})
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SectionCard>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50 mt-6">
          No client requests found.
        </div>
      ) : (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      )}

      {selectedRequestIdForApps && (
        <AdminApplicationsModal
          careRequestId={selectedRequestIdForApps}
          clientProfileId={requests.find(r => r.id === selectedRequestIdForApps)?.clientProfileId || ""}
          onClose={() => setSelectedRequestIdForApps(null)}
        />
      )}
    </div>
  );
}
