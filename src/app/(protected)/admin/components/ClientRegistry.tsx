"use client";

import Link from "next/link";
import { User, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import StatusBadge from "./shared/StatusBadge";
import Table, { TableColumn } from "./shared/Table";

interface ClientDetailItem {
  id: string;
  internalAccountNumber?: string;
  publicProfileId?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  weeklyFee: number;
  profileStatus: string;
  createdAt: string;
}

interface ClientRegistryProps {
  clients: ClientDetailItem[];
  page: number;
  totalPages: number;
  totalItems: number;
  status: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  loading: boolean;
  error: string | null;
  setActiveTab: (tab: any) => void;
}

export default function ClientRegistry({
  clients,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
  limit,
  onLimitChange,
  loading,
  error,
}: ClientRegistryProps) {
  const columns: TableColumn<ClientDetailItem>[] = [
    {
      header: "Client Name",
      key: "name",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shrink-0 font-bold text-xs uppercase">
            {client.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <span className="truncate max-w-[150px] font-bold text-gold-200 block" title={client.name}>
              {client.name}
            </span>
            {client.internalAccountNumber && (
              <span className="text-[9px] font-mono text-gold-200/70 block">
                {client.internalAccountNumber}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Public ID",
      key: "publicProfileId",
      render: (client) => (
        <span className="font-mono text-xs font-semibold text-gold-200/90 bg-gold-300/10 px-2 py-0.5 rounded border border-gold-300/20">
          {client.publicProfileId || "N/A"}
        </span>
      ),
    },
    {
      header: "Email",
      key: "email",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-1.5 text-gold-100/60">
          <Mail className="h-3.5 w-3.5 text-gold/45" />
          <span className="truncate max-w-[180px]" title={client.email}>
            {client.email}
          </span>
        </div>
      ),
    },
    {
      header: "Phone Number",
      key: "phone",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-1.5 text-gold-100/60">
          <Phone className="h-3.5 w-3.5 text-gold/45" />
          <span>{client.phone}</span>
        </div>
      ),
    },
    {
      header: "City",
      key: "city",
      sortable: true,
      render: (client) => (
        <span className="text-gold-200">{client.city}</span>
      ),
    },
    {
      header: "Weekly Fee",
      key: "weeklyFee",
      sortable: true,
      render: (client) => (
        <span className="font-mono font-bold text-gold">
          £
          {client.weeklyFee.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      header: "Profile Status",
      key: "profileStatus",
      sortable: true,
      render: (client) => <StatusBadge status={client.profileStatus} />,
    },
    {
      header: "Registration Date",
      key: "createdAt",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-1.5 text-gold-100/60 font-mono">
          <Calendar className="h-3.5 w-3.5 text-gold/45" />
          <span>
            {client.createdAt ? new Date(client.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (client) => (
        <Link
          href={`/admin/clients/${client.id}?from=registry`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gold text-navy-950 px-3.5 py-1.5 text-[11px] font-bold hover:bg-gold-200 transition duration-200 cursor-pointer whitespace-nowrap"
        >
          View Details <ArrowUpRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  // Loading skeleton while fetching
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-gold/10 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gold/5 rounded-lg animate-pulse max-w-full" />
          </div>
          <div className="h-10 w-48 bg-gold/10 rounded-lg animate-pulse" />
        </div>
        {/* Table Body Skeleton */}
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 space-y-4">
          <div className="grid grid-cols-8 gap-4 border-b border-gold-300/10 pb-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gold/10 rounded animate-pulse" />
            ))}
          </div>
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-8 gap-4 py-3.5 border-b border-gold-300/5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 bg-gold/5 rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl mx-auto space-y-4">
        <p className="font-semibold text-sm">Failed to load Client Registry</p>
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
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Client Registry & Management Console
          </h3>
          <p className="text-xs text-gold-100/50">
            Audit and inspect registered platform clients, weekly fees, profiles, and registration records.
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
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-16 text-center text-gold-100/40 backdrop-blur-md flex flex-col justify-center items-center">
          <User className="h-12 w-12 text-gold-100/20 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-gold-200">No Clients Found</h3>
          <p className="text-xs max-w-sm mt-2">
            There are currently no registered clients under the selected status filter.
          </p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={clients}
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
