import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";
import { FileText } from "lucide-react";
import Pagination from "./shared/Pagination";
import Link from "next/link";

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

export default function CarerApplications({
  carers,
  page,
  totalPages,
  totalItems,
  status,
  onPageChange,
  onStatusChange,
}: CarerApplicationsProps) {
  const [selectedCarer, setSelectedCarer] = useState<CarerApplication | null>(
    null,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Carer Applications Registry
          </h3>
          <p className="text-xs text-gold-100/50">
            Review background checks, DBS status, and verify practitioner
            documentation
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

      {/* Grid of Carer Application Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {carers.map((carer) => (
          <SectionCard
            key={carer.id}
            className="flex flex-col justify-between space-y-6 h-[410px]"
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gold-200">
                      {carer.name}
                    </h4>
                    <p className="text-xs text-gold-100/40">
                      {carer.city} • {carer.experience} Experience
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={carer.status} />
                    <span className="text-[9px] uppercase tracking-wider text-gold-100/40 font-semibold">
                      DBS: {carer.dbsStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-navy-950/60 p-2 text-xs border border-gold-300/5 text-gold-100/70">
                  <span className="font-semibold text-gold-200">
                    Availability:
                  </span>{" "}
                  {carer.availability}
                </div>

                <div className="mt-4">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-1.5">
                    Care Specialties
                  </h5>
                  <div className="flex flex-wrap gap-1.5 max-h-[56px] overflow-hidden">
                    {carer.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-navy-950 px-2 py-0.5 text-[10px] text-gold-200/70 border border-gold-300/5"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Document Summary Section */}
              <div className="mt-4 pt-3 border-t border-gold-300/5">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-1.5 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-gold-DEFAULT" />
                  Documents
                </h5>
                <ul className="space-y-1 text-xs text-gold-100/70">
                  {carer.documents.slice(0, 3).map((doc) => (
                    <li key={doc.name} className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          doc.status === "Verified"
                            ? "bg-emerald-400"
                            : doc.status === "Uploaded"
                              ? "bg-gold"
                              : doc.status === "Rejected"
                                ? "bg-rose-400"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="truncate max-w-[180px]">{doc.name}</span>
                      <span className="text-[9px] font-bold uppercase text-gold-200/40 ml-auto">
                        {doc.status === "Uploaded" ? "PENDING" : doc.status.toUpperCase()}
                      </span>
                    </li>
                  ))}
                  {carer.documents.length > 3 && (
                    <li className="text-[10px] text-gold-100/40 pl-3 font-semibold">
                      +{carer.documents.length - 3} more documents
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-gold-300/5 pt-4 flex-shrink-0">
              <Button
                onClick={() => setSelectedCarer(carer)}
                variant="primary"
                size="sm"
                fullWidth
                className="text-center"
              >
                View Details
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Details Side-Drawer / Modal */}
      {selectedCarer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 p-4 md:p-6 backdrop-blur-sm">
          <div className="w-full max-w-6xl rounded-2xl border border-gold-300/10 bg-navy-900 p-6 shadow-soft space-y-6 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-start justify-between border-b border-gold-300/10 pb-4 flex-shrink-0">
              <div>
                <h4 className="text-xl font-bold text-gold-200">
                  {selectedCarer.name}
                </h4>
                <p className="text-xs text-gold-100/50">
                  Carer Registration Dossier & Document Registry
                </p>
              </div>
              <button
                onClick={() => setSelectedCarer(null)}
                className="text-gold-100/40 hover:text-gold-200 text-lg transition duration-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Profile details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-navy-950/40 p-4 rounded-xl border border-gold-300/5">
                <div>
                  <p className="text-xs text-gold-100/40 font-semibold uppercase">
                    Experience
                  </p>
                  <p className="text-gold-200 font-medium">
                    {selectedCarer.experience}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gold-100/40 font-semibold uppercase">
                    Location
                  </p>
                  <p className="text-gold-200 font-medium">
                    {selectedCarer.city}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gold-100/40 font-semibold uppercase">
                    Registered Email
                  </p>
                  <p className="text-gold-200 font-medium break-all">
                    {selectedCarer.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gold-100/40 font-semibold uppercase">
                    Contact Number
                  </p>
                  <p className="text-gold-200 font-medium">
                    {selectedCarer.phone}
                  </p>
                </div>
              </div>

              {/* Status and Specialties */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border border-gold-300/5 rounded-xl p-4 bg-navy-950/30">
                  <p className="text-xs text-gold-100/40 font-semibold uppercase mb-2">
                    DBS Background Check
                  </p>
                  <div className="flex items-center space-x-3 rounded-lg bg-navy-950 p-3 border border-gold-300/5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        selectedCarer.dbsStatus === "Verified"
                          ? "bg-emerald-400 animate-pulse"
                          : selectedCarer.dbsStatus === "Pending"
                            ? "bg-gold"
                            : "bg-rose-400"
                      }`}
                    ></span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gold-200">
                        {selectedCarer.dbsStatus}
                      </p>
                      <p className="text-[10px] text-gold-100/40">
                        UK Disclosure Database.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 border border-gold-300/5 rounded-xl p-4 bg-navy-950/30">
                  <p className="text-xs text-gold-100/40 font-semibold uppercase mb-2">
                    Specialties Dossier
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCarer.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-navy-950 px-3 py-1 text-xs text-gold-200 border border-gold-300/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compliance Documents Section - Full Width Table */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Compliance Documents
                </h5>

                  <div className="border border-gold-300/10 rounded-xl bg-navy-950/40 overflow-hidden flex flex-col w-full">
                  <div className="max-h-[380px] overflow-y-auto overflow-x-auto pr-1">
                    {/* Desktop/Tablet Table */}
                    <table className="hidden md:table w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gold-300/10 bg-navy-950/80 text-[10px] uppercase tracking-wider text-gold-200/60 sticky top-0 z-10">
                          <th className="py-3 px-4 font-bold">Document Name</th>
                          <th className="py-3 px-4 font-bold">Document Type</th>
                          <th className="py-3 px-4 font-bold">Upload Date</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold">Expiry Date</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-300/5">
                        {selectedCarer.documents.map((doc) => {
                          const meta = getMockDocDetails(doc.name);
                          return (
                            <tr
                              key={doc.name}
                              className="transition duration-200 hover:bg-gold-500/5 text-gold-100/80"
                            >
                              <td className="py-3.5 px-4 font-semibold text-gold-200">{doc.name}</td>
                              <td className="py-3.5 px-4 text-gold-100/50">{meta.type}</td>
                              <td className="py-3.5 px-4 text-gold-100/40">{meta.uploadDate}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                    doc.status === "Verified"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : doc.status === "Uploaded"
                                        ? "bg-gold/10 text-gold border border-gold/20"
                                        : doc.status === "Rejected"
                                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                  }`}
                                >
                                  {doc.status === "Uploaded" ? "PENDING" : doc.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-gold-100/40">{meta.expiryDate}</td>
                              <td className="py-3.5 px-4 text-right">
                                {doc.id && doc.fileUrl ? (
                                  <Link
                                    href={`/admin/carers/${selectedCarer.id}/document-review?documentId=${doc.id}`}
                                    className="inline-flex items-center gap-1 rounded-xl bg-gold text-navy-950 font-bold px-3.5 py-1.5 text-xs hover:bg-gold-200 transition duration-200"
                                  >
                                    Review
                                  </Link>
                                ) : (
                                  <span className="text-[10px] text-gold-100/25 font-bold uppercase mr-2">
                                    Unavailable
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Mobile Card List */}
                    <div className="block md:hidden divide-y divide-gold-300/5">
                      {selectedCarer.documents.map((doc) => {
                        const meta = getMockDocDetails(doc.name);
                        return (
                          <div key={doc.name} className="p-4 space-y-2 text-gold-100/80 hover:bg-gold-500/5 transition">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gold-200 text-sm">{doc.name}</p>
                                <p className="text-[10px] text-gold-100/50 mt-0.5">{meta.type}</p>
                              </div>
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  doc.status === "Verified"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : doc.status === "Uploaded"
                                      ? "bg-gold/10 text-gold border border-gold/20"
                                      : doc.status === "Rejected"
                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                }`}
                              >
                                {doc.status === "Uploaded" ? "PENDING" : doc.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-gold-100/40">
                              <span>Uploaded: {meta.uploadDate}</span>
                              <span>Expires: {meta.expiryDate}</span>
                            </div>
                            <div className="pt-2 flex justify-end">
                              {doc.id && doc.fileUrl ? (
                                <Link
                                  href={`/admin/carers/${selectedCarer.id}/document-review?documentId=${doc.id}`}
                                  className="rounded-xl bg-gold text-navy-950 font-bold px-3.5 py-1.5 text-xs hover:bg-gold-200 transition duration-200"
                                >
                                  Review Document
                                </Link>
                              ) : (
                                <span className="text-[10px] text-gold-100/25 font-bold uppercase">
                                  Review Unavailable
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================
                  1. REGISTRATION INFORMATION
                 ======================================== */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Registration Information
                </h5>
                <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-5 shadow-soft">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Registered Since
                      </span>
                      <p className="text-gold-200 font-bold">04 Jun 2026</p>
                    </div>
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Duration With Grace & Goodwill
                      </span>
                      <p className="text-gold-200 font-bold">19 Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================
                  2. CURRENT AVAILABILITY
                 ======================================== */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Current Availability
                </h5>
                <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-5 shadow-soft">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Available From
                      </span>
                      <p className="text-gold-200 font-bold">08:00 AM</p>
                    </div>
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Available Until
                      </span>
                      <p className="text-gold-200 font-bold">08:00 PM</p>
                    </div>
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Consecutive Available Days
                      </span>
                      <p className="text-gold-200 font-bold">5 Days (Mon - Fri)</p>
                    </div>
                    <div>
                      <span className="text-xs text-gold-100/40 font-semibold uppercase block mb-1">
                        Current Availability Status
                      </span>
                      <div>
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================
                  3. PLACEMENT HISTORY
                 ======================================== */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Placement History
                </h5>
                <div className="border border-gold-300/10 rounded-xl bg-navy-950/40 overflow-hidden flex flex-col w-full">
                  <div className="max-h-[300px] overflow-y-auto overflow-x-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gold-300/10 bg-navy-950/80 text-[10px] uppercase tracking-wider text-gold-200/60 sticky top-0 z-10">
                          <th className="py-3 px-4 font-bold">Client Name</th>
                          <th className="py-3 px-4 font-bold">Client Address</th>
                          <th className="py-3 px-4 font-bold">Placement Start Date</th>
                          <th className="py-3 px-4 font-bold">Placement End Date</th>
                          <th className="py-3 px-4 font-bold">Placement Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-300/5">
                        <tr className="transition duration-200 hover:bg-gold-500/5 text-gold-100/80">
                          <td className="py-3.5 px-4 font-semibold text-gold-200">Winston Churchill</td>
                          <td className="py-3.5 px-4 text-gold-100/50">10 Downing Street, London, SW1A 2AA</td>
                          <td className="py-3.5 px-4 text-gold-100/40">2026-05-29</td>
                          <td className="py-3.5 px-4 text-gold-100/40">Ongoing</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          </td>
                        </tr>
                        <tr className="transition duration-200 hover:bg-gold-500/5 text-gold-100/80">
                          <td className="py-3.5 px-4 font-semibold text-gold-200">Arthur Pendelton</td>
                          <td className="py-3.5 px-4 text-gold-100/50">42 Baker Street, London, NW1 6XE</td>
                          <td className="py-3.5 px-4 text-gold-100/40">2026-01-15</td>
                          <td className="py-3.5 px-4 text-gold-100/40">2026-04-30</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Completed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ========================================
                  4. INTERNAL NOTES TIMELINE
                 ======================================== */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Internal Notes Timeline
                </h5>
                <div className="space-y-4">
                  <div className="relative pl-6 border-l-2 border-gold-300/20 space-y-4">
                    {/* Note 1 */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-DEFAULT text-navy-950 text-[10px] font-black">
                        •
                      </span>
                      <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h6 className="text-sm font-bold text-gold-200">Performance Review</h6>
                          <span className="text-[10px] text-gold-100/40 font-mono">24 Jun 2026 - 10:35 AM</span>
                        </div>
                        <p className="text-xs text-gold-100/70">Client reported excellent communication.</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gold-100/30">
                          <span className="font-semibold uppercase">Admin:</span>
                          <span>Sarah Connor</span>
                        </div>
                      </div>
                    </div>

                    {/* Note 2 */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-DEFAULT text-navy-950 text-[10px] font-black">
                        •
                      </span>
                      <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h6 className="text-sm font-bold text-gold-200">Initial Document Audit</h6>
                          <span className="text-[10px] text-gold-100/40 font-mono">04 Jun 2026 - 02:15 PM</span>
                        </div>
                        <p className="text-xs text-gold-100/70">DBS and professional licenses verified successfully during registry check.</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gold-100/30">
                          <span className="font-semibold uppercase">Admin:</span>
                          <span>James Bond</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================
                  5. COMMUNICATION & FEEDBACK HISTORY
                 ======================================== */}
              <div className="border-t border-gold-300/10 pt-6">
                <h5 className="text-base font-bold text-gold-200 mb-4 uppercase tracking-wide">
                  Communication & Feedback History
                </h5>
                <div className="space-y-4">
                  <div className="relative pl-6 border-l-2 border-gold-300/20 space-y-4">
                    {/* Item 1 */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-DEFAULT text-navy-950 text-[10px] font-black">
                        •
                      </span>
                      <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Client Feedback
                          </span>
                          <span className="text-[10px] text-gold-100/40 font-mono">22 Jun 2026 - 04:30 PM</span>
                        </div>
                        <p className="text-xs text-gold-100/70">Helena was extremely patient and supportive during Churchill's morning session. Family expressed sincere gratitude.</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-DEFAULT text-navy-950 text-[10px] font-black">
                        •
                      </span>
                      <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Concerns Raised
                          </span>
                          <span className="text-[10px] text-gold-100/40 font-mono">10 Jun 2026 - 11:00 AM</span>
                        </div>
                        <p className="text-xs text-gold-100/70">Slight delay reported in arrival due to local transport strike. Issue resolved with prompt notification.</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-DEFAULT text-navy-950 text-[10px] font-black">
                        •
                      </span>
                      <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Follow-up Actions
                          </span>
                          <span className="text-[10px] text-gold-100/40 font-mono">05 Jun 2026 - 09:00 AM</span>
                        </div>
                        <p className="text-xs text-gold-100/70">Conducted onboarding telephone verification with the carer to review guidelines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-gold-300/10 pt-4 flex-shrink-0">
              <Button
                onClick={() => setSelectedCarer(null)}
                variant="primary"
                size="md"
                fullWidth
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {carers.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
          No carer applications found.
        </div>
      ) : (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
