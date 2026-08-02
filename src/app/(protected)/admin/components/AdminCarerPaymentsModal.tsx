import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle,
  Upload,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { adminService } from "../../../../services/admin/admin.service";
import { storageService } from "@/services/storage.service";

interface Payment {
  id: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: number;
  status: "UNPAID" | "PAID";
  transactionProofUrl: string | null;
  paidAt: string | null;
}

interface AdminCarerPaymentsModalProps {
  placementId: string;
  onClose: () => void;
}

export const AdminCarerPaymentsModal: React.FC<
  AdminCarerPaymentsModalProps
> = ({ placementId, onClose }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPayments();
  }, [placementId]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCarerPayments(placementId);
      setPayments(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      await adminService.updateCarerPaymentStatus(
        paymentId,
        "PAID",
        receiptFile || undefined,
      );
      // Refresh
      await fetchPayments();
      setReceiptFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to update payment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  const formatAmount = (amt: number | string) => {
    return `£${Number(amt).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-gold-300/20 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold-300/20 flex justify-between items-center bg-navy-900/50">
          <h2 className="text-xl font-bold text-gold-200 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Carer Payments History
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-navy-800 rounded-lg text-gold-200/60 hover:text-gold-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gold-200/50">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No payment records found for this placement.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-navy-800/50 border border-gold-300/10 rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          payment.status === "PAID"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {payment.status}
                      </span>
                      <span className="text-sm font-medium text-gold-100/60 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(
                          payment.periodStartDate,
                          payment.periodEndDate,
                        )}
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-gold-DEFAULT">
                      {formatAmount(payment.amount)}
                    </div>

                    {payment.status === "PAID" && payment.paidAt && (
                      <div className="text-xs text-green-400/70 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Paid on {new Date(payment.paidAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3 border-t md:border-t-0 border-gold-300/10 pt-4 md:pt-0">
                    {payment.status === "UNPAID" ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex justify-center items-center gap-2 px-3 py-1.5 bg-navy-950 border border-gold-300/20 text-gold-100 text-xs rounded hover:bg-navy-900 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {receiptFile ? receiptFile.name : "Attach Receipt"}
                          </button>
                        </div>
                        <button
                          onClick={() => handleMarkAsPaid(payment.id)}
                          disabled={processingId === payment.id}
                          className="w-full px-4 py-2 bg-gold-DEFAULT text-navy-950 font-bold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                        >
                          {processingId === payment.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>{" "}
                              Processing
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" /> Mark as Paid
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      payment.transactionProofUrl && (
                        <a
                          href={payment.transactionProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (payment.transactionProofUrl) {
                              const url = await storageService.getPresignedUrl(
                                payment.transactionProofUrl,
                              );
                              window.open(url, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className="px-4 py-2 bg-navy-950 border border-gold-300/20 text-gold-200 font-medium rounded-lg hover:bg-navy-900 hover:text-gold-100 transition-colors text-sm flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                          <DollarSign className="w-4 h-4" /> View Receipt
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
