import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";
import { ExternalLink, Check, X } from "lucide-react";
import Pagination from "./shared/Pagination";
import Link from "next/link";

interface CarerApplicationsProps {
  carers: CarerApplication[];
  onReject: (id: string) => void;
  setSelectedCarerForApproval: (carer: CarerApplication | null) => void;
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

export default function CarerApplications({
  carers,
  onReject,
  setSelectedCarerForApproval,
  onUpdateDocumentStatus,
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
            className="flex flex-col justify-between space-y-6"
          >
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
                <div className="flex flex-wrap gap-1.5">
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

              <div className="mt-4">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-gold-200/50 mb-2">
                  Compliance Documents Check
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {carer.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="rounded-lg bg-navy-950 p-2 border border-gold-300/5 flex flex-col justify-between items-center text-[10px] min-h-[75px]"
                    >
                      <p className="font-medium text-gold-100/70 truncate w-full text-center">
                        {doc.name}
                      </p>

                      <span
                        className={`mt-1 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          doc.status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : doc.status === "Uploaded"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : doc.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}
                      >
                        {doc.status === "Uploaded" ? "PENDING" : doc.status.toUpperCase()}
                      </span>

                      {doc.id && doc.fileUrl ? (
                        <div className="mt-2 w-full border-t border-gold-300/5 pt-1.5 flex justify-center">
                          <Link
                            href={`/admin/carers/${carer.id}/document-review?documentId=${doc.id}`}
                            className="text-gold hover:text-gold-light font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 transition duration-200"
                          >
                            View Document
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-2 w-full border-t border-gold-300/5 pt-1.5 text-center text-[9px] text-gold-100/20 uppercase font-semibold">
                          Unavailable
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gold-300/5 pt-4">
              <Button
                onClick={() => setSelectedCarer(carer)}
                variant="ghost-gold"
                size="sm"
                fullWidth
                className="text-center"
              >
                View Details
              </Button>

              {carer.status === "Pending" && (
                <>
                  <Button
                    onClick={() => {
                      setSelectedCarerForApproval(carer);
                    }}
                    variant="primary"
                    size="sm"
                    fullWidth
                  >
                    Approve Carer
                  </Button>
                  <Button
                    onClick={() => onReject(carer.id)}
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                    className="px-3"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Details Side-Drawer / Modal */}
      {selectedCarer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gold-300/10 bg-navy-900 p-6 shadow-soft space-y-6">
            <div className="flex items-start justify-between border-b border-gold-300/10 pb-4">
              <div>
                <h4 className="text-xl font-bold text-gold-200">
                  {selectedCarer.name}
                </h4>
                <p className="text-xs text-gold-100/50">
                  Carer Registration Dossier
                </p>
              </div>
              <button
                onClick={() => setSelectedCarer(null)}
                className="text-gold-100/40 hover:text-gold-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
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

              <div className="border-t border-gold-300/5 pt-4">
                <p className="text-xs text-gold-100/40 font-semibold uppercase mb-2">
                  DBS & Background Check Status
                </p>
                <div className="flex items-center space-x-3 rounded-xl bg-navy-950 p-3 border border-gold-300/5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      selectedCarer.dbsStatus === "Verified"
                        ? "bg-emerald-400"
                        : selectedCarer.dbsStatus === "Pending"
                          ? "bg-gold"
                          : "bg-rose-400"
                    }`}
                  ></span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gold-200">
                      DBS Certificate: {selectedCarer.dbsStatus}
                    </p>
                    <p className="text-[10px] text-gold-100/40">
                      Checked against the UK Disclosure and Barring Service
                      database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gold-300/5 pt-4">
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

              <div className="border-t border-gold-300/5 pt-4">
                <p className="text-xs text-gold-100/40 font-semibold uppercase mb-2">
                  Compliance Documents Dossier
                </p>
                <div className="space-y-2">
                  {selectedCarer.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-gold-300/5 text-xs"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gold-200">{doc.name}</p>
                        <p className="text-[10px] text-gold-100/40 mt-0.5">
                          Status:{" "}
                          <span
                            className={
                              doc.status === "Verified"
                                ? "text-emerald-400 font-bold"
                                : doc.status === "Uploaded"
                                  ? "text-gold-DEFAULT font-bold"
                                  : "text-rose-400 font-bold"
                            }
                          >
                            {doc.status}
                          </span>
                        </p>
                      </div>

                      {doc.id && doc.fileUrl && (
                        <div className="flex items-center gap-3">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-gold-300/10 bg-navy-900/50 px-2.5 py-1 text-[11px] font-medium text-gold hover:border-gold-300/30 transition"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>

                          {doc.status !== "Verified" && (
                            <div className="flex gap-1">
                              <button
                                onClick={async () => {
                                  if (onUpdateDocumentStatus) {
                                    await onUpdateDocumentStatus(
                                      doc.id!,
                                      "VERIFIED",
                                    );
                                  }
                                  setSelectedCarer((prev) => {
                                    if (!prev) return null;
                                    return {
                                      ...prev,
                                      documents: prev.documents.map((d) =>
                                        d.id === doc.id
                                          ? { ...d, status: "Verified" }
                                          : d,
                                      ),
                                    };
                                  });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                                title="Approve Document"
                              >
                                <Check className="h-4 w-4" />
                              </button>

                              <button
                                onClick={async () => {
                                  if (onUpdateDocumentStatus) {
                                    await onUpdateDocumentStatus(
                                      doc.id!,
                                      "REJECTED",
                                    );
                                  }
                                  setSelectedCarer((prev) => {
                                    if (!prev) return null;
                                    return {
                                      ...prev,
                                      documents: prev.documents.map((d) =>
                                        d.id === doc.id
                                          ? { ...d, status: "Rejected" }
                                          : d,
                                      ),
                                    };
                                  });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                                title="Reject Document"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-gold-300/10 pt-4">
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
