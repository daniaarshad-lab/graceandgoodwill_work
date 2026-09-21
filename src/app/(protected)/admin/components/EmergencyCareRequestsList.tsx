"use client";

import { AlertCircle, Calendar, Mail, MapPin, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Table, { TableColumn } from "./shared/Table";
import { EmergencyCareRequest } from "@/types/admin.types";

interface EmergencyCareRequestsListProps {
  requests: EmergencyCareRequest[];
  page: number;
  totalPages: number;
  totalItems: number;
  status: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  loading: boolean;
  error: string | null;
}

export default function EmergencyCareRequestsList({
  requests,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
  onStatusUpdate,
  limit,
  onLimitChange,
  loading,
  error,
}: EmergencyCareRequestsListProps) {
  const searchParams = useSearchParams();
  const highlightName = searchParams.get("highlightName")?.toLowerCase();

  const columns: TableColumn<EmergencyCareRequest>[] = [
    {
      header: "Requestor",
      key: "fullName",
      sortable: true,
      render: (req) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shrink-0 font-bold text-xs uppercase">
            {req.fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)}
          </div>
          <div className="min-w-0">
            <span
              className="truncate max-w-[150px] font-bold text-gold-200 block"
              title={req.fullName}
            >
              {req.fullName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Details",
      key: "contact",
      render: (req) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gold-100/60">
            <Mail className="h-3.5 w-3.5 text-gold/45" />
            <span className="truncate max-w-[150px] text-xs" title={req.email}>
              {req.email}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gold-100/60">
            <Phone className="h-3.5 w-3.5 text-gold/45" />
            <span className="text-xs">{req.phoneNumber}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Needs Support",
      key: "whoNeedsSupport",
      render: (req) => (
        <span className="text-gold-200 text-sm">{req.whoNeedsSupport}</span>
      ),
    },
    {
      header: "Location",
      key: "location",
      render: (req) => (
        <div className="flex items-center gap-1.5 text-gold-100/60">
          <MapPin className="h-3.5 w-3.5 text-gold/45" />
          <span className="text-sm">{req.location}</span>
        </div>
      ),
    },
    {
      header: "Details",
      key: "additionalEmergencyDetails",
      render: (req) => (
        <div className="max-w-[200px]">
          <span
            className="text-xs text-gold-100/70 line-clamp-2"
            title={req.additionalEmergencyDetails}
          >
            {req.additionalEmergencyDetails || "No additional details"}
          </span>
          <span className="text-[10px] text-gold-200/50 mt-1 block">
            Prefers: {req.preferredContactMethod}
          </span>
        </div>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      sortable: true,
      render: (req) => (
        <div className="flex items-center gap-1.5 text-gold-100/60 font-mono">
          <Calendar className="h-3.5 w-3.5 text-gold/45" />
          <span className="text-xs">
            {req.createdAt
              ? new Date(req.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (req) => (
        <select
          value={req.status}
          onChange={(e) => onStatusUpdate(req.id, e.target.value)}
          className="bg-navy-950/80 text-gold-200 text-xs border border-gold-300/10 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-gold-300/30 cursor-pointer appearance-none font-semibold text-center"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-gold/10 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gold/5 rounded-lg animate-pulse max-w-full" />
          </div>
        </div>
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 space-y-4">
          <div className="grid grid-cols-7 gap-4 border-b border-gold-300/10 pb-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-gold/10 rounded animate-pulse" />
            ))}
          </div>
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-7 gap-4 py-3.5 border-b border-gold-300/5"
            >
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3 bg-gold/5 rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl mx-auto space-y-4">
        <p className="font-semibold text-sm">
          Failed to load Emergency Care Requests
        </p>
        <p className="text-xs text-red-500/80">{error}</p>
        <button
          onClick={() => onPageChange(page)}
          className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 cursor-pointer"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="flex h-3 w-3 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
            <h3 className="text-xl font-bold text-rose-400">
              Emergency Care Requests
            </h3>
          </div>
          <p className="text-xs text-gold-100/50 max-w-xl">
            View and manage emergency care requests submitted from the public
            website and client portals.
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
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-16 text-center text-gold-100/40 backdrop-blur-md flex flex-col justify-center items-center">
          <AlertCircle className="h-12 w-12 text-gold-100/20 mb-4" />
          <h3 className="text-lg font-bold text-gold-200">No Requests Found</h3>
          <p className="text-xs max-w-sm mt-2">
            There are currently no emergency care requests matching the selected
            filters.
          </p>
        </div>
      ) : (
        <Table<EmergencyCareRequest>
          columns={columns}
          data={requests}
          isLoading={loading}
          searchable={false} // Minimal search for now
          highlightRowFn={highlightName ? (req) => req.fullName.toLowerCase() === highlightName : undefined}
          pagination={{
            page,
            totalPages,
            totalItems,
            pageSize: limit,
            onPageChange,
            onPageSizeChange: onLimitChange,
          }}
        />
      )}
    </div>
  );
}
