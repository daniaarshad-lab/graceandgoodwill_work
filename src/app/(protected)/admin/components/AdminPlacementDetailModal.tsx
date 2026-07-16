import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle, Download, DollarSign } from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { AdminPlacementDetail } from "../types/admin.types";
import Button from "@/components/Button";
import InternalNotes from "./shared/InternalNotes/InternalNotes";

interface AdminPlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
}

export default function AdminPlacementDetailModal({ placementId, onClose }: AdminPlacementDetailModalProps) {
  const [placement, setPlacement] = useState<AdminPlacementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlacement() {
      try {
        setLoading(true);
        const data = await adminService.getPlacementDetail(placementId);
        setPlacement(data);
      } catch (err: any) {
        setError(err.message || "Failed to load placement details");
      } finally {
        setLoading(false);
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
        <div className="sticky top-0 bg-navy-900 z-10 border-b border-gold-300/10 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gold-200 flex items-center gap-2">
              Comprehensive Placement Detail
              <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${placement.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gold-300/10 text-gold-200 border border-gold-300/20'}`}>
                {placement.status}
              </span>
            </h2>
            <p className="text-sm text-gold-100/60 mt-1">ID: {placement.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Care Request Details */}
            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold-200" /> Care Request
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">Category</span>
                  <span className="text-gold-100">{placement.careRequest?.careCategory || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">Requirements</span>
                  <span className="text-gold-100">{placement.careRequest?.requirements || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">Location</span>
                  <span className="text-gold-100">{placement.careRequest?.city || placement.careRequest?.postcode || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">Emergency</span>
                  <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${placement.careRequest?.isEmergency ? "bg-rose-500/10 text-rose-400" : "bg-navy-800 text-gold-100"}`}>
                    {placement.careRequest?.isEmergency ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Profiles */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
                <h3 className="text-sm font-bold text-gold-200 flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gold-200" /> Client
                </h3>
                <div className="text-sm">
                  <span className="text-gold-100 font-bold">{placement.clientProfile?.user?.firstName} {placement.clientProfile?.user?.lastName}</span>
                  <div className="text-gold-100/60 mt-1">
                    {placement.clientProfile?.user?.email} • {placement.clientProfile?.user?.phoneNumber}
                  </div>
                </div>
              </div>
              
              <div className="p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
                <h3 className="text-sm font-bold text-gold-200 flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gold-200" /> Carer
                </h3>
                <div className="text-sm">
                  <span className="text-gold-100 font-bold">{placement.carerProfile?.user?.firstName} {placement.carerProfile?.user?.lastName}</span>
                  <div className="text-gold-100/60 mt-1">
                    {placement.carerProfile?.user?.email} • {placement.carerProfile?.user?.phoneNumber}
                  </div>
                  <div className="mt-2 text-xs font-bold px-2 py-0.5 bg-navy-900 inline-block rounded text-gold-200">
                    Status: {placement.carerProfile?.user?.status}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2 border-b border-gold-300/10 pb-2">
              <DollarSign className="h-5 w-5 text-gold-200" /> Associated Invoices
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
              <div className="text-center py-6 border border-gold-300/5 rounded-xl bg-navy-950/20">
                <p className="text-sm text-gold-100/60">No invoices found for this placement.</p>
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t border-gold-300/10">
            <h3 className="text-lg font-bold text-gold-200 mb-4">Internal Notes</h3>
            <InternalNotes entityId={placement.id} entityType="PLACEMENT" />
          </div>

        </div>
      </div>
    </div>
  );
}
