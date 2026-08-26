import React, { useState } from "react";
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
  const [selectedRequestIdForApps, setSelectedRequestIdForApps] = useState<
    string | null
  >(null);
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(
    null,
  );
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (
    reqId: string,
    newStatus: string,
    currentStatus: string,
  ) => {
    if (newStatus === currentStatus) return; // Prevent duplicate API calls

    setUpdatingStatusFor(reqId);
    try {
      await adminService.updateCareRequestStatus(reqId, newStatus);
      showSuccessToast(
        "Status Updated",
        "Care request status has been updated.",
      );
      // Trigger a reload of requests to reflect the new status
      refreshRequests();
    } catch (err: any) {
      showErrorToast(
        "Update Failed",
        err.message || "Failed to update status.",
      );
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 space-y-6 w-full">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
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

      <div className="overflow-x-auto w-full rounded-2xl border border-gold-300/10 bg-navy-950/20">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-wider text-gold-200/60 bg-navy-950/60">
              <th className="p-4 rounded-tl-xl whitespace-nowrap">
                Client & Location
              </th>
              <th className="p-4 whitespace-nowrap">Care Details</th>
              <th className="p-4 whitespace-nowrap">Urgency</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 text-right rounded-tr-xl whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-300/5">
            {requests.map((req) => {
              const isExpanded = expandedRows[req.id];
              return (
                <React.Fragment key={req.id}>
                  <tr
                    className={`hover:bg-navy-900/30 transition-colors group ${isExpanded ? "bg-navy-900/20" : ""}`}
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gold-200">
                          {req.clientName}
                        </span>
                        <span className="text-xs text-gold-100/50">
                          {req.location}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className="text-xs font-medium text-gold-200 line-clamp-1 max-w-[200px]"
                          title={
                            Array.isArray(req.careType)
                              ? req.careType.join(", ")
                              : req.careType
                          }
                        >
                          {Array.isArray(req.careType)
                            ? req.careType.join(", ")
                            : req.careType}
                        </span>
                        <span className="text-[10px] text-gold-100/40 uppercase tracking-wide">
                          Start: {req.startDate}
                        </span>
                      </div>
                        {req.placement?.status === "REJECTED_BY_CARER" && (
                          <div className="mt-2 flex items-center justify-between gap-2 p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-300">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-rose-400 shrink-0">Declined by Carer:</span>
                              <span className="truncate max-w-[150px]" title={req.placement?.rejectionReason || "Declined"}>
                                {req.placement?.carerProfile?.user ? `${req.placement.carerProfile.user.firstName} ${req.placement.carerProfile.user.lastName}` : "Carer"}
                                {req.placement?.rejectionReason ? ` - "${req.placement.rejectionReason}"` : ""}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                              Re-assignment Needed
                            </span>
                          </div>
                        )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                          req.urgency === "Emergency"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                            : req.urgency === "High"
                              ? "bg-gold/10 text-gold border border-gold/20"
                              : "bg-navy-950 text-gold-100/40 border border-gold-300/5"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <select
                          value={req.status}
                          disabled={updatingStatusFor === req.id}
                          onChange={(e) =>
                            handleStatusChange(
                              req.id,
                              e.target.value,
                              req.status,
                            )
                          }
                          className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-[10px] font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer min-w-[150px]"
                        >
                          {CARE_REQUEST_STATUS_OPTIONS.map((opt, index) => {
                            const currentIndex =
                              CARE_REQUEST_STATUS_OPTIONS.findIndex(
                                (o) => o.value === req.status,
                              );
                            let isDisabled =
                              currentIndex !== -1 && index <= currentIndex;
                            let titleText = "";

                            if (opt.value === "OPEN_FOR_APPLICATIONS") {
                              if (req.status === "NEW_ENQUIRY") {
                                isDisabled = false;
                                titleText = "";
                              } else {
                                const normalizedStatus = req.clientStatus?.toUpperCase();
                                const isNotApproved =
                                  normalizedStatus !== "APPROVED" && normalizedStatus !== "ACTIVE";
                                const noFees = req.clientAgreedWeeklyFee == null;

                                if (isNotApproved || noFees) {
                                  isDisabled = true;
                                  titleText =
                                    "Client must be approved and weekly fees must be updated";
                                }
                              }
                            }

                            return (
                              <option
                                key={opt.value}
                                value={opt.value}
                                disabled={isDisabled}
                                title={titleText}
                                className={
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed text-gold-100/30"
                                    : ""
                                }
                              >
                                {opt.label}
                              </option>
                            );
                          })}
                        </select>
                        {(req.status as string) === "CARER_SELECTED" && (
                          <div className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1 pl-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Assigned
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right align-top">
                      <div className="flex items-center justify-end gap-2 relative">
                        <Button
                          onClick={() => setSelectedRequestIdForApps(req.id)}
                          variant="outline"
                          size="sm"
                          className="!px-3 !py-1.5 !text-[11px] !rounded-lg whitespace-nowrap"
                        >
                          View Applications
                        </Button>

                        <div className="relative group/menu inline-block">
                          <button className="p-1.5 rounded-lg hover:bg-gold-300/10 text-gold-200/60 hover:text-gold-200 transition-colors outline-none focus:ring-2 focus:ring-gold-300/20">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>

                          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gold-300/10 bg-navy-950 shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 py-1.5 origin-top-right">
                            {req.clientId ? (
                              <Link
                                href={`/admin/clients/${req.clientId}?careRequestId=${req.id}&clientName=${encodeURIComponent(req.clientName)}`}
                                className="block px-4 py-2 text-xs text-left text-gold-200 hover:bg-gold-300/10 w-full transition-colors"
                              >
                                Manage Client Profile
                              </Link>
                            ) : (
                              <div className="px-4 py-2 text-xs text-left text-gold-100/40 w-full">
                                Profile Unavailable
                              </div>
                            )}
                            {req.clientId &&
                              (req.interestListCount ?? 0) > 0 && (
                                <Link
                                  href={`/admin/clients/${req.clientId}/interest-list?clientName=${encodeURIComponent(req.clientName)}&careRequestId=${req.id}`}
                                  className="block px-4 py-2 text-xs text-left text-emerald-400 hover:bg-emerald-500/10 w-full transition-colors border-t border-gold-300/5 mt-1 pt-2"
                                >
                                  View Interest List ({req.interestListCount})
                                </Link>
                              )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleRow(req.id)}
                          className={`p-1.5 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-gold-300/20 ${isExpanded ? "bg-gold-300/10 text-gold-200" : "hover:bg-gold-300/10 text-gold-200/60 hover:text-gold-200"}`}
                          title={isExpanded ? "Hide Notes" : "View Notes"}
                        >
                          {isExpanded ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 15.75l7.5-7.5 7.5 7.5"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-navy-900/10">
                      <td
                        colSpan={5}
                        className="px-4 pb-4 pt-1 border-b border-gold-300/5"
                      >
                        <div className="bg-navy-950/40 rounded-xl p-4 border border-gold-300/5 shadow-inner">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-gold-200/50 mb-2 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                            Family Notes & Custom Needs
                          </h5>
                          <p className="text-xs text-gold-100/80 italic leading-relaxed whitespace-pre-wrap pl-6">
                            {req.notes && req.notes.trim() !== ""
                              ? req.notes
                              : "No additional notes or custom needs provided by the family."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
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
          clientProfileId={
            requests.find((r) => r.id === selectedRequestIdForApps)
              ?.clientProfileId || ""
          }
          onClose={() => setSelectedRequestIdForApps(null)}
          onStatusUpdated={refreshRequests}
        />
      )}
    </div>
  );
}
