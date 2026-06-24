"use client";

import { useState } from "react";
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  Heart,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";
import StatusBadge from "./shared/StatusBadge";
import Table, { TableColumn } from "./shared/Table";

interface CarerApplicationsProps {
  carers: CarerApplication[];
  onUpdateDocumentStatus?: (
    docId: string,
    status: "VERIFIED" | "REJECTED",
  ) => Promise<void> | void;

  page: number;
  totalPages: number;
  totalItems: number;
  status: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const getMockDocDetails = (docName: string) => {
  const types: Record<string, { type: string; uploadDate: string; expiryDate: string }> = {
    "DBS Certificate": {
      type: "Criminal Record Check",
      uploadDate: "2026-05-10",
      expiryDate: "2029-05-10",
    },
    "Driver's License": {
      type: "Identification",
      uploadDate: "2026-05-12",
      expiryDate: "2031-11-20",
    },
    "Dementia Cert": {
      type: "Certification",
      uploadDate: "2026-05-14",
      expiryDate: "Lifetime",
    },
    "Dementia Certificate": {
      type: "Certification",
      uploadDate: "2026-05-14",
      expiryDate: "Lifetime",
    },
    "Nurses Registry": {
      type: "Professional License",
      uploadDate: "2026-05-15",
      expiryDate: "2027-03-31",
    },
  };
  return types[docName] || {
    type: "Verification Document",
    uploadDate: "2026-05-16",
    expiryDate: "N/A",
  };
};

const getCarerExtendedDetails = (carerId: string) => {
  const db: Record<string, any> = {
    // Helena Rostova
    "carer-1": {
      registrationDate: "2026-06-04T10:00:00.000Z",
      availableFrom: "08:00 AM",
      availableUntil: "08:00 PM",
      consecutiveDays: "5 Days (Mon - Fri)",
      availabilityStatus: "Available",
      biography: "Compassionate and dedicated carer with over 5 years of experience in elderly care, specialized in post-operative recovery, personal hygiene, and emotional support.",
      placements: [
        {
          clientName: "Winston Churchill",
          clientAddress: "10 Downing Street, London, SW1A 2AA",
          startDate: "2026-05-29",
          endDate: "Ongoing",
          status: "Active",
        },
        {
          clientName: "Arthur Pendelton",
          clientAddress: "42 Baker Street, London, NW1 6XE",
          startDate: "2026-01-15",
          endDate: "2026-04-30",
          status: "Completed",
        }
      ],
      notes: [
        {
          title: "Performance Review",
          timestamp: "24 Jun 2026 - 10:35 AM",
          content: "Client reported excellent communication.",
          adminName: "Sarah Connor"
        },
        {
          title: "Initial Document Audit",
          timestamp: "04 Jun 2026 - 02:15 PM",
          content: "DBS and professional licenses verified successfully during registry check.",
          adminName: "James Bond"
        }
      ],
      feedback: [
        {
          type: "Client Feedback",
          timestamp: "22 Jun 2026 - 04:30 PM",
          content: "Helena was extremely patient and supportive during Churchill's morning session. Family expressed sincere gratitude."
        },
        {
          type: "Concerns Raised",
          timestamp: "10 Jun 2026 - 11:00 AM",
          content: "Slight delay reported in arrival due to local transport strike. Issue resolved with prompt notification."
        },
        {
          type: "Follow-up Actions",
          timestamp: "05 Jun 2026 - 09:00 AM",
          content: "Conducted onboarding telephone verification with the carer to review guidelines."
        }
      ]
    },
    // Eleanor Vance
    "carer-2": {
      registrationDate: "2026-05-15T09:00:00.000Z",
      availableFrom: "09:00 AM",
      availableUntil: "06:00 PM",
      consecutiveDays: "3 Days (Tue - Thu)",
      availabilityStatus: "Partially Available",
      biography: "Specialist in dementia care and physical support, committed to promoting independence and dignity in comfortable residential environments.",
      placements: [
        {
          clientName: "Arthur Pendelton",
          clientAddress: "42 Baker Street, London, NW1 6XE",
          startDate: "2026-06-01",
          endDate: "Ongoing",
          status: "Active",
        }
      ],
      notes: [
        {
          title: "Dementia Cert Verification",
          timestamp: "18 May 2026 - 11:00 AM",
          content: "Verified dementia certificate from Alzheimer's Society.",
          adminName: "Sarah Connor"
        }
      ],
      feedback: [
        {
          type: "Client Feedback",
          timestamp: "15 Jun 2026 - 02:00 PM",
          content: "Eleanor is fantastic. Arthur really connects with her and feels much more confident during walks."
        }
      ]
    }
  };

  return db[carerId] || {
    registrationDate: "2026-06-10T12:00:00.000Z",
    availableFrom: "09:00 AM",
    availableUntil: "05:00 PM",
    consecutiveDays: "4 Days (Mon - Thu)",
    availabilityStatus: "Available",
    biography: "Professional carer dedicated to providing exceptional support, daily assistance, and specialized therapeutic companionship.",
    placements: [],
    notes: [
      {
        title: "Profile Created",
        timestamp: "10 Jun 2026 - 12:00 PM",
        content: "Initial carer profile created and awaiting review.",
        adminName: "James Bond"
      }
    ],
    feedback: []
  };
};

export default function CarerApplications({
  carers,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
  limit,
  onLimitChange,
}: CarerApplicationsProps) {

  const columns: TableColumn<CarerApplication>[] = [
    {
      header: "Carer Name",
      key: "name",
      sortable: true,
      render: (carer) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shrink-0 font-bold text-xs uppercase">
            {carer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="font-bold text-gold-200 truncate max-w-[150px]" title={carer.name}>
            {carer.name}
          </span>
        </div>
      ),
    },
    {
      header: "Registration Date",
      key: "registrationDate",
      sortable: true,
      render: (carer) => {
        const ext = getCarerExtendedDetails(carer.id);
        return (
          <span className="font-mono text-gold-100/60">
            {new Date(ext.registrationDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Availability Status",
      key: "availability",
      sortable: true,
      render: (carer) => {
        const ext = getCarerExtendedDetails(carer.id);
        return <StatusBadge status={ext.availabilityStatus} />;
      },
    },
    {
      header: "Experience",
      key: "experience",
      sortable: true,
      render: (carer) => (
        <span className="text-gold-200">{carer.experience}</span>
      ),
    },
    {
      header: "DBS Status",
      key: "dbsStatus",
      sortable: true,
      render: (carer) => <StatusBadge status={carer.dbsStatus} />,
    },
    {
      header: "Application Status",
      key: "status",
      sortable: true,
      render: (carer) => <StatusBadge status={carer.status} />,
    },
    {
      header: "Action",
      key: "action",
      render: (carer) => (
        <Link
          href={`/admin/carers/${carer.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gold text-navy-950 font-bold px-3.5 py-1.5 text-[11px] hover:bg-gold-200 transition duration-200 cursor-pointer"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Carer Applications Registry
          </h3>
          <p className="text-xs text-gold-100/50">
            Review background checks, DBS status, and verify practitioner documentation
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
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main reusable table displaying the listing */}
      <Table
        columns={columns}
        data={carers}
        pagination={{
          page,
          totalPages,
          totalItems,
          pageSize: limit,
          onPageChange,
          onPageSizeChange: onLimitChange,
        }}
      />
    </div>
  );
}
