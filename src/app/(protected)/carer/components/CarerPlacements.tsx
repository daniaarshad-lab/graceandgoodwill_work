import { useEffect, useState } from "react";
import { carerService } from "@/services/carer/carer.service";
import { CarerPlacement } from "@/types/carer.types";
import SectionCard from "./shared/SectionCard";
import {
  User,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  Download,
} from "lucide-react";
import Button from "@/components/Button";

function PlacementDetailModal({
  placementId,
  onClose,
}: {
  placementId: string;
  onClose: () => void;
}) {
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlacement() {
      try {
        setLoading(true);
        setPaymentsLoading(true);
        const [data, paymentsData] = await Promise.all([
          carerService.getPlacementDetail(placementId),
          carerService.getPlacementPayments(placementId).catch(() => []), // fall back to empty array if fails
        ]);
        setPlacement(data);
        setPayments(paymentsData);
      } catch (err: any) {
        setError(err.message || "Failed to load placement details");
      } finally {
        setLoading(false);
        setPaymentsLoading(false);
      }
    }
    loadPlacement();
  }, [placementId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
          <h3 className="text-xl font-bold text-rose-400">
            Error Loading Details
          </h3>
          <p className="text-sm text-gold-100/60">{error}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8 space-y-8">
          <div className="border-b border-gold-300/10 pb-4">
            <h2 className="text-2xl font-bold text-gold-200 flex items-center gap-2">
              Placement Details
              <span
                className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${placement.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gold-300/10 text-gold-200 border border-gold-300/20"}`}
              >
                {placement.status}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                <User className="h-4 w-4 text-gold-200" /> Client Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Name
                  </span>
                  <span className="text-gold-100 font-bold">
                    {placement.clientProfile?.user?.firstName}{" "}
                    {placement.clientProfile?.user?.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Contact
                  </span>
                  <span className="text-gold-100">
                    {placement.clientProfile?.user?.email} <br />{" "}
                    {placement.clientProfile?.user?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold-200" /> Care Requirements
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Category
                  </span>
                  <span className="text-gold-100">
                    {placement.careRequest?.careCategory || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Location
                  </span>
                  <span className="text-gold-100">
                    {placement.careRequest?.address}
                    <br />
                    {placement.careRequest?.city}{" "}
                    {placement.careRequest?.postcode}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Schedule
                  </span>
                  <span className="text-gold-100">
                    {placement.careRequest?.startDate
                      ? new Date(
                          placement.careRequest.startDate,
                        ).toLocaleDateString()
                      : "N/A"}
                    {placement.careRequest?.endDate
                      ? ` - ${new Date(placement.careRequest.endDate).toLocaleDateString()}`
                      : placement.careRequest?.isOngoing
                        ? " (Ongoing)"
                        : ""}
                  </span>
                </div>
                {placement.careRequest?.additionalNotes && (
                  <div>
                    <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                      Notes
                    </span>
                    <span className="text-gold-100">
                      {placement.careRequest.additionalNotes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="space-y-4 pt-4 border-t border-gold-300/10">
            <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
              Payment History
            </h3>
            {paymentsLoading ? (
              <div className="flex justify-center p-4">
                <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paymentsError ? (
              <div className="text-center py-4 border border-rose-500/20 rounded-xl bg-rose-950/10">
                <p className="text-sm text-rose-400">{paymentsError}</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-6 border border-gold-300/5 rounded-xl bg-navy-950/20">
                <p className="text-sm text-gold-100/60">
                  No payment history available.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gold-300/5 bg-navy-950/20">
                <table className="w-full text-left border-collapse text-xs text-slate-350">
                  <thead>
                    <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold text-gold-200">
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors"
                      >
                        <td className="py-3 px-3 text-slate-400">
                          {payment.periodStartDate
                            ? `${new Date(payment.periodStartDate).toLocaleDateString()} - ${new Date(payment.periodEndDate).toLocaleDateString()}`
                            : "N/A"}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">
                          £{Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              payment.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : payment.status === "UNPAID"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {payment.transactionProofUrl ? (
                            <a
                              href={(() => {
                                const url = payment.transactionProofUrl;
                                if (url.startsWith("http")) return url;
                                const apiUrl =
                                  process.env.NEXT_PUBLIC_API_URL ||
                                  "http://localhost:3000";
                                let baseUrl = apiUrl;
                                try {
                                  baseUrl = new URL(apiUrl).origin;
                                } catch (e) {
                                  baseUrl = apiUrl.replace(/\/api\/?$/, "");
                                }
                                return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
                              })()}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gold-DEFAULT hover:underline font-bold text-[10px] inline-flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarerPlacements() {
  const [placements, setPlacements] = useState<CarerPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(
    null,
  );

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carerService.getPlacements();
      setPlacements(data);
    } catch (err: any) {
      setError(err.message || "Failed to load placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">Active Placements</h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          View and manage your assigned placements and client details.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
          <p className="text-xs text-rose-400/60">{error}</p>
          <Button variant="outline" onClick={fetchPlacements} className="mt-2">
            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry
          </Button>
        </div>
      ) : placements.length === 0 ? (
        <div className="text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/60">
          <p className="text-sm text-gold-100/60">
            You do not have any active placements at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {placements.map((place) => (
            <SectionCard key={place.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/5 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-gold-200">
                    {place.careRequest?.careCategory || "General Care"}
                  </h4>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Client: {place.clientProfile?.user?.firstName}{" "}
                    {place.clientProfile?.user?.lastName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    place.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-gold-300/10 text-gold-200 border border-gold-300/20"
                  }`}
                >
                  {place.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gold-100">
                  <Calendar className="h-4 w-4 text-gold/60 shrink-0" />
                  <span>
                    Started: {new Date(place.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gold-100">
                  <MapPin className="h-4 w-4 text-gold/60 shrink-0" />
                  <span className="truncate">
                    {place.careRequest?.city || "Location details hidden"}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPlacementId(place.id)}
                >
                  View Details
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {selectedPlacementId && (
        <PlacementDetailModal
          placementId={selectedPlacementId}
          onClose={() => setSelectedPlacementId(null)}
        />
      )}
    </div>
  );
}
