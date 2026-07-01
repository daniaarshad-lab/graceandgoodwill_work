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

interface ClientRequestsProps {
  requests: ClientRequest[];
  setSelectedRequestForMatching: UseAdminPortalReturn["setSelectedRequestForMatching"];
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
  setSelectedRequestForMatching,
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

  const handleStatusChange = async (reqId: string, newStatus: string) => {
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
          <h3 className="text-xl font-bold text-gold-200">
            Client Care Requests
          </h3>
          <p className="text-xs text-gold-100/50">
            Manage incoming family requests, support needs, and triage urgent
            assignments
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
            <option value="NEW_ENQUIRY">New Enquiry</option>
            <option value="AWAITING_CONSULTATION">Awaiting Consultation</option>
            <option value="OPEN_FOR_APPLICATIONS">Open for Applications</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CLIENT_INTERVIEW_STAGE">Client Interview Stage</option>
            <option value="CARER_SELECTED">Carer Selected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {requests.map((req) => (
          <SectionCard
            key={req.id}
            className={`flex flex-col justify-between space-y-4 ${
              req.urgency === "Emergency"
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
                  <select
                    value={req.status}
                    disabled={updatingStatusFor === req.id}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-[10px] font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer"
                  >
                    <option value="NEW_ENQUIRY">NEW_ENQUIRY</option>
                    <option value="AWAITING_CONSULTATION">AWAITING_CONSULTATION</option>
                    <option value="OPEN_FOR_APPLICATIONS">OPEN_FOR_APPLICATIONS</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="CLIENT_INTERVIEW_STAGE">CLIENT_INTERVIEW_STAGE</option>
                    <option value="CARER_SELECTED">CARER_SELECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
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

            <div className="flex flex-col gap-2 mt-4">
              <Button
                onClick={() => setSelectedRequestIdForApps(req.id)}
                variant="outline"
                size="sm"
                fullWidth
              >
                View Applications
              </Button>

              {(req.status as string) !== "CARER_SELECTED" && (req.status as string) !== "CANCELLED" ? (
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
              
              <Link href={`/admin/clients/${req.clientProfileId || req.id}`} className="w-full">
                <Button
                  variant="ghost-gold"
                  size="sm"
                  fullWidth
                >
                  View Details / Manage Client
                </Button>
              </Link>
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
          onClose={() => setSelectedRequestIdForApps(null)}
        />
      )}
    </div>
  );
}
