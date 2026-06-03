import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";

interface CarerApplicationsProps {
  carers: CarerApplication[];
  onReject: (id: string) => void;
  setSelectedCarerForApproval: (carer: CarerApplication | null) => void;
}

export default function CarerApplications({
  carers,
  onReject,
  setSelectedCarerForApproval,
}: CarerApplicationsProps) {
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [selectedCarer, setSelectedCarer] = useState<CarerApplication | null>(
    null,
  );

  const filteredCarers = carers.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

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

        <div className="flex rounded-xl bg-navy-950 p-1 border border-gold-300/10 gap-1">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setFilter(tab)}
              variant="selectable"
              isSelected={filter === tab}
              size="sm"
              fullWidth={false}
              className="rounded-lg px-4 py-1.5 text-xs tracking-wide"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of Carer Application Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredCarers.map((carer) => (
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
                      className="rounded-lg bg-navy-950 p-2 border border-gold-300/5 text-center text-[10px]"
                    >
                      <p className="font-medium text-gold-100/70 truncate">
                        {doc.name}
                      </p>
                      <span
                        className={`mt-1 inline-block font-bold uppercase tracking-wider ${
                          doc.status === "Verified"
                            ? "text-emerald-400"
                            : doc.status === "Uploaded"
                              ? "text-gold-DEFAULT"
                              : "text-rose-400"
                        }`}
                      >
                        {doc.status}
                      </span>
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

        {filteredCarers.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
            No carers found in the &apos;{filter}&apos; category.
          </div>
        )}
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
    </div>
  );
}
