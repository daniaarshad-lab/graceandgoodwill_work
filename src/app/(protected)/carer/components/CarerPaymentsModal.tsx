import React, { useState, useEffect } from "react";
import { X, CheckCircle, Calendar, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { carerService } from "@/services/carer/carer.service";

interface Payment {
  id: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: number;
  status: "UNPAID" | "PAID";
  transactionProofUrl: string | null;
  paidAt: string | null;
}

interface CarerPaymentsModalProps {
  placementId: string;
  onClose: () => void;
}

export const CarerPaymentsModal: React.FC<CarerPaymentsModalProps> = ({
  placementId,
  onClose,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [placementId]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carerService.getPlacementPayments(placementId);
      setPayments(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
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
            My Payment History
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-navy-800 rounded-lg text-gold-200/60 hover:text-gold-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 flex items-center gap-3 text-rose-400 text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gold-200/50 bg-navy-950/30 rounded-xl border border-gold-300/5">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20 text-gold-100" />
              <p>No payment records found for this placement.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-navy-800/50 border border-gold-300/10 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center hover:bg-navy-800/80 transition-colors">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        payment.status === "PAID" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {payment.status}
                      </span>
                      <span className="text-sm font-medium text-gold-100/60 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(payment.periodStartDate, payment.periodEndDate)}
                      </span>
                    </div>
                    
                    <div className="text-2xl font-bold text-gold-DEFAULT">
                      {formatAmount(payment.amount)}
                    </div>
                    
                    {payment.status === "PAID" && payment.paidAt && (
                      <div className="text-xs text-emerald-400/70 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Paid on {new Date(payment.paidAt).toLocaleDateString()}
                      </div>
                    )}
                    {payment.status === "UNPAID" && (
                      <div className="text-xs text-amber-400/70 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Admin Payment
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-auto flex justify-end sm:justify-start border-t sm:border-t-0 border-gold-300/10 pt-4 sm:pt-0">
                    {payment.transactionProofUrl ? (
                      <a 
                        href={payment.transactionProofUrl.startsWith('http') ? payment.transactionProofUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${payment.transactionProofUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-navy-950 border border-gold-300/20 text-gold-200 font-medium rounded-lg hover:bg-navy-900 hover:text-gold-100 transition-colors text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <DollarSign className="w-4 h-4" /> View Receipt
                      </a>
                    ) : payment.status === "PAID" ? (
                      <div className="px-4 py-2 bg-navy-950/50 border border-gold-300/10 text-gold-100/50 rounded-lg text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                        No Receipt Attached
                      </div>
                    ) : null}
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
