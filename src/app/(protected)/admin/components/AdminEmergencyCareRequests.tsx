import React, { useState } from "react";
import { EmergencyCareRequest } from "@/types/admin.types";
import Pagination from "./shared/Pagination";

interface AdminEmergencyCareRequestsProps {
  requests: EmergencyCareRequest[];
  page: number;
  totalPages: number;
  totalItems: number;
  status: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  loading: boolean;
  error: string | null;
}

export default function AdminEmergencyCareRequests({
  requests,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
  onStatusUpdate,
  loading,
  error,
}: AdminEmergencyCareRequestsProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="flex h-3 w-3 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
            <h3 className="text-lg md:text-xl font-bold text-gold-200">
              Emergency Care Requests
            </h3>
          </div>
          <p className="text-xs text-gold-100/50 max-w-xl leading-relaxed">
            Review incoming emergency care requests submitted via the public portal.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 space-y-4">
          <p className="font-semibold text-sm">Failed to load requests</p>
          <p className="text-xs text-red-500/80">{error}</p>
        </div>
      ) : loading && requests.length === 0 ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 bg-navy-950/20 p-12 text-center">
          <p className="text-gold-200/60 font-semibold mb-2">
            No Emergency Requests Found
          </p>
          <p className="text-xs text-gold-100/40">
            There are currently no emergency care requests matching your criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full rounded-2xl border border-gold-300/10 bg-navy-950/20">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-wider text-gold-200/60 bg-navy-950/60">
                <th className="p-4 rounded-tl-xl whitespace-nowrap">Contact Details</th>
                <th className="p-4 whitespace-nowrap">Support For</th>
                <th className="p-4 whitespace-nowrap">Location</th>
                <th className="p-4 whitespace-nowrap">Submitted At</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right rounded-tr-xl whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-300/5">
              {requests.map((req) => {
                const isExpanded = expandedRows[req.id];

                return (
                  <React.Fragment key={req.id}>
                    <tr
                      className={`group transition duration-300 hover:bg-navy-900/40 ${
                        isExpanded ? "bg-navy-900/40" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gold-50 mb-0.5">
                            {req.fullName}
                          </span>
                          <div className="flex flex-col gap-0.5 text-xs text-gold-100/60">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a href={`mailto:${req.email}`} className="hover:text-gold-300 transition-colors">{req.email}</a>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <a href={`tel:${req.phoneNumber}`} className="hover:text-gold-300 transition-colors">{req.phoneNumber}</a>
                            </span>
                            <span className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-400">
                              Method: {req.preferredContactMethod}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center rounded-lg bg-navy-950 border border-gold-300/10 px-2.5 py-1 text-xs font-semibold text-gold-200/80">
                          {req.whoNeedsSupport}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs text-gold-100 font-medium">
                          {req.location}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs text-gold-100 font-medium">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={req.status || "PENDING"}
                          onChange={(e) => onStatusUpdate && onStatusUpdate(req.id, e.target.value)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer outline-none focus:ring-1 focus:ring-gold-500/50 appearance-none bg-transparent ${
                            req.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : req.status === "RESOLVED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : req.status === "CLOSED"
                                  ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                  : "bg-gold-500/10 text-gold-400 border-gold-500/20"
                          }`}
                        >
                          <option value="PENDING" className="bg-navy-950 text-amber-400">PENDING</option>
                          <option value="IN_PROGRESS" className="bg-navy-950 text-gold-400">IN PROGRESS</option>
                          <option value="RESOLVED" className="bg-navy-950 text-emerald-400">RESOLVED</option>
                          <option value="CLOSED" className="bg-navy-950 text-gray-400">CLOSED</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleRow(req.id)}
                          className="text-xs bg-navy-950 border border-gold-300/10 hover:border-gold-300/30 text-gold-200 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {isExpanded && (
                      <tr className="bg-navy-900/20 border-b border-gold-300/5">
                        <td colSpan={6} className="p-0">
                          <div className="p-6 overflow-hidden animate-slide-down">
                            <div className="grid grid-cols-1 gap-6 max-w-4xl">
                              <div className="bg-navy-950 rounded-xl p-5 border border-gold-300/10 shadow-inner">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gold-200/50 mb-3 border-b border-gold-300/10 pb-2">
                                  Additional Emergency Details
                                </h4>
                                <div className="space-y-3">
                                  {req.additionalEmergencyDetails ? (
                                    <p className="text-sm text-gold-100 whitespace-pre-wrap leading-relaxed">
                                      {req.additionalEmergencyDetails}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gold-100/40 italic">
                                      No additional details provided.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
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
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
