"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin/admin.service";
import { User, AlertCircle, X } from "lucide-react";
import ThinSpinner from "@/components/ThinSpinner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

import { useAppDispatch } from "@/store/hooks";
import { reviewInterestList } from "@/store/slices/adminSlice";

export default function AdminApplicationsModal({
  careRequestId,
  clientProfileId,
  onClose,
  onStatusUpdated,
}: {
  careRequestId: string;
  clientProfileId: string;
  onClose: () => void;
  onStatusUpdated?: () => void;
}) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [careRequestId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCareRequestApplications(careRequestId);
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (carerProfileId: string, status: string) => {
    if (!carerProfileId) return;
    setUpdatingId(carerProfileId);
    try {
      await dispatch(
        reviewInterestList({
          carerId: carerProfileId,
          clientId: clientProfileId || "",
          careRequestId,
          status: status as "SELECTED" | "REJECTED",
        }),
      ).unwrap();
      showSuccessToast(
        "Status Updated",
        `Application has been ${status === "SELECTED" ? "approved" : "rejected"}.`,
      );
      loadApplications();
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err: any) {
      showErrorToast(
        "Update Failed",
        err.message || "Failed to update status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const hasSelectedCarer = applications.some((a) => a.status === "SELECTED");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-gold-300/10 pb-4 mb-4">
          <div>
            <h4 className="text-lg font-bold text-gold-200">
              Care Request Applications
            </h4>
            <p className="text-xs text-gold-100/50 mt-1">
              Carers who have applied for or been assigned to this specific care request.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gold-200 hover:text-gold-50 p-1 rounded-lg hover:bg-gold-300/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasSelectedCarer && (
          <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              A carer has been selected for this placement offer and is awaiting acceptance. Other pending applications cannot be approved until this offer is resolved.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <ThinSpinner size="md" text="Loading applications..." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center p-10 border border-dashed border-gold-300/20 rounded-xl bg-navy-950/40 text-gold-100/40">
              No applications received for this request yet.
            </div>
          ) : (
            applications.map((app) => {
              const carerProfileId = app.carerProfileId || app.carerProfile?.id;
              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors ${
                    app.status === "SELECTED"
                      ? "border-emerald-500/30 bg-emerald-950/15"
                      : "border-gold-300/10 bg-navy-950/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {app.carerProfile?.profilePhotoUrl ? (
                      <img
                        src={app.carerProfile.profilePhotoUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border border-gold-300/20 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-bold text-gold-100">
                        {app.carerProfile?.user?.firstName}{" "}
                        {app.carerProfile?.user?.lastName}
                      </h5>
                      {app.isAssignedByAdmin && (
                        <div className="mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                          Selected by Admin
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : app.status === "SELECTED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {app.status}
                        </span>
                        {app.status === "SELECTED" && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                            Waiting for Carer Acceptance
                          </span>
                        )}
                        <span className="text-xs text-gold-100/50">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {app.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth={false}
                          disabled={updatingId === carerProfileId}
                          onClick={() =>
                            handleUpdateStatus(carerProfileId, "REJECTED")
                          }
                          className="!border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10"
                        >
                          {updatingId === carerProfileId ? "..." : "Reject"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth={false}
                          disabled={updatingId === carerProfileId || hasSelectedCarer}
                          title={
                            hasSelectedCarer
                              ? "Another carer is currently selected and awaiting acceptance"
                              : "Approve application"
                          }
                          onClick={() =>
                            handleUpdateStatus(carerProfileId, "SELECTED")
                          }
                          className={`${
                            hasSelectedCarer
                              ? "!border-gray-700 !text-gray-500 !opacity-40 !cursor-not-allowed"
                              : "!border-emerald-500/30 !text-emerald-400 hover:!bg-emerald-500/10"
                          }`}
                        >
                          {updatingId === carerProfileId ? "..." : "Approve"}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost-gold"
                      size="sm"
                      fullWidth={false}
                      onClick={() =>
                        router.push(
                          `/admin/carers/${app.carerProfile?.user?.id}?source=client-care-requests`,
                        )
                      }
                    >
                      View Carer
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
