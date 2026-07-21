import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle, Download, DollarSign } from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { AdminPlacementDetail, CarerPayment } from "../types/admin.types";
import Button from "@/components/Button";
import InternalNotes from "./shared/InternalNotes/InternalNotes";
import { toast } from "sonner";

interface AdminPlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
}

function PaymentUpdateModal({ payment, onClose, onSuccess }: { payment: CarerPayment, onClose: () => void, onSuccess: () => void }) {
  const [status, setStatus] = useState(payment.status);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("status", status);
      if (file) {
        formData.append("receipt", file);
      }
      await adminService.updateCarerPaymentStatus(payment.id, formData);
      toast.success("Payment status updated successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gold-100/60 hover:text-gold-200">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-gold-200 mb-6">Update Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gold-200 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-lg border border-gold-300/20 bg-navy-950 p-2.5 text-sm text-gold-100"
            >
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gold-200 mb-2">Receipt (Optional)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gold-100/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-300/10 file:text-gold-200 hover:file:bg-gold-300/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gold-300/10">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPlacementDetailModal({ placementId, onClose }: AdminPlacementDetailModalProps) {
  const [placement, setPlacement] = useState<AdminPlacementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<CarerPayment | null>(null);

  const loadPlacement = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPlacementDetail(placementId);
      setPlacement(data);
    } catch (err: any) {
      setError(err.message || "Failed to load placement details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <h3 className="text-xl font-bold text-rose-400">Error Loading Details</h3>
          <p className="text-sm text-gold-100/60">{error}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-navy-900 z-40 border-b border-gold-300/10 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gold-50 flex items-center gap-3">
              Placement Profile
              <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider border ${placement.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gold-300/10 text-gold-200 border-gold-300/20'}`}>
                {placement.status.replace(/_/g, ' ')}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          <div className="space-y-6">
            
            {/* User Profiles Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative overflow-hidden p-4 rounded-xl border border-gold-300/10 bg-gradient-to-br from-navy-900 to-navy-950 shadow-inner group">

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-gold-100/40 font-medium block mb-0.5">Client</span>
                    <h3 className="text-base font-medium text-gold-50 truncate">{placement.clientProfile?.user?.firstName} {placement.clientProfile?.user?.lastName}</h3>
                    <div className="text-xs text-gold-100/60 mt-0.5 truncate">
                      {placement.clientProfile?.user?.email} • {placement.clientProfile?.user?.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-4 rounded-xl border border-gold-300/10 bg-gradient-to-br from-navy-900 to-navy-950 shadow-inner group">

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 border border-gold-300/10 text-gold-200 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-gold-100/40 font-medium shrink-0">Assigned Carer</span>
                      <span className="text-[8px] uppercase tracking-wider bg-gold-300/10 text-gold-200 px-1.5 py-0.5 rounded font-medium border border-gold-300/20 whitespace-nowrap">
                        {placement.carerProfile?.user?.status}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-gold-200 truncate">{placement.carerProfile?.user?.firstName} {placement.carerProfile?.user?.lastName}</h3>
                    <div className="text-xs text-gold-100/60 mt-0.5 truncate">
                      {placement.carerProfile?.user?.email} • {placement.carerProfile?.user?.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Request Details */}
            <div className="relative overflow-hidden p-6 rounded-2xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2 mb-5">
                <FileText className="h-4 w-4 text-gold-200" /> Care Request Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metadata Column */}
                <div className="space-y-4">
                  <div className="bg-navy-900/50 p-4 rounded-xl border border-gold-300/5">
                    <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">Category</span>
                    <span className="text-gold-100 font-normal text-sm">{placement.careRequest?.careCategory || "N/A"}</span>
                  </div>
                  <div className="bg-navy-900/50 p-4 rounded-xl border border-gold-300/5">
                    <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">Location</span>
                    <span className="text-gold-100 font-normal text-sm">{placement.careRequest?.city || placement.careRequest?.postcode || "N/A"}</span>
                  </div>
                  <div className="bg-navy-900/50 p-4 rounded-xl border border-gold-300/5">
                    <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">Priority Level</span>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-medium inline-block mt-1 ${placement.careRequest?.isEmergency ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                      {placement.careRequest?.isEmergency ? "Emergency" : "Standard"}
                    </span>
                  </div>
                </div>
                
                {/* Requirements Column */}
                <div className="md:col-span-2 bg-navy-900/50 p-5 rounded-xl border border-gold-300/5 flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider block mb-3 text-gold-100/40 font-medium">Requirements & Details</span>
                  <div className="text-gold-100/80 text-sm font-normal leading-relaxed max-h-[220px] overflow-y-auto pr-3 custom-placement-scroll bg-navy-950/30 p-4 rounded-lg flex-1">
                    <style>{`
                      .custom-placement-scroll::-webkit-scrollbar { width: 5px; }
                      .custom-placement-scroll::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.4); border-radius: 4px; }
                      .custom-placement-scroll::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 4px; }
                    `}</style>
                    {placement.careRequest?.requirements || "No specific requirements detailed."}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Financials Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoices List */}
            <div className="relative overflow-hidden p-6 rounded-2xl border border-gold-300/10 bg-navy-950/40 flex flex-col">
              <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2 mb-5">
                <DollarSign className="h-4 w-4 text-gold-200" /> Client Invoices
              </h3>
            
            {placement.invoices && placement.invoices.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gold-300/5 bg-navy-950/20">
                <table className="w-full text-left border-collapse text-xs text-slate-350">
                  <thead>
                    <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold text-gold-200">
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placement.invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                        <td className="py-3 px-3 text-slate-400">
                          {inv.billingPeriodStart ? `${new Date(inv.billingPeriodStart).toLocaleDateString()} - ${new Date(inv.billingPeriodEnd).toLocaleDateString()}` : "N/A"}
                        </td>
                        <td className="py-3 px-3 font-mono">£{Number(inv.subtotal).toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">£{Number(inv.total).toFixed(2)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            inv.status === "PAID" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : inv.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {inv.pdfUrl ? (
                            <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="text-gold-DEFAULT hover:underline font-bold text-[10px] inline-flex items-center gap-1">
                              <Download className="h-3 w-3"/>
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
            ) : (
              <div className="text-center py-8 rounded-xl bg-navy-900/30 border border-gold-300/5 flex-1 flex items-center justify-center">
                <p className="text-sm text-gold-100/40">No invoices found for this placement.</p>
              </div>
            )}
            </div>
          
            {/* Carer Payments List */}
            <div className="relative overflow-hidden p-6 rounded-2xl border border-gold-300/10 bg-navy-950/40 flex flex-col">
              <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2 mb-5">
                <DollarSign className="h-4 w-4 text-gold-200" /> Carer Payments
              </h3>
            
            {placement.carerPayments && placement.carerPayments.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gold-300/5 bg-navy-950/20">
                <table className="w-full text-left border-collapse text-xs text-slate-350">
                  <thead>
                    <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold text-gold-200">
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Receipt</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placement.carerPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors">
                        <td className="py-3 px-3 text-slate-400">
                          {payment.periodStartDate ? `${new Date(payment.periodStartDate).toLocaleDateString()} - ${new Date(payment.periodEndDate).toLocaleDateString()}` : "N/A"}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">£{Number(payment.amount).toFixed(2)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            payment.status === "PAID" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : payment.status === "UNPAID"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {payment.transactionProofUrl ? (
                            <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${payment.transactionProofUrl}`} target="_blank" rel="noreferrer" className="text-gold-DEFAULT hover:underline font-bold text-[10px] inline-flex items-center gap-1">
                              <Download className="h-3 w-3"/>
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)} className="py-1 px-2 text-[10px]">
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl bg-navy-900/30 border border-gold-300/5 flex-1 flex items-center justify-center">
                <p className="text-sm text-gold-100/40">No carer payments found for this placement.</p>
              </div>
            )}
            </div>
          </div>
          
          <div className="pt-2">
            <InternalNotes entityId={placement.id} entityType="PLACEMENT" />
          </div>

        </div>
      </div>

      {selectedPayment && (
        <PaymentUpdateModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onSuccess={() => {
            setSelectedPayment(null);
            loadPlacement();
          }}
        />
      )}
    </div>
  );
}
