import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";
import { clientService } from "@/services/client/client.service";
import { ClientPlacement } from "@/types/client.types";
import Button from "@/components/Button";

interface PlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
}

export default function PlacementDetailModal({ placementId, onClose }: PlacementDetailModalProps) {
  const [placement, setPlacement] = useState<ClientPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlacement() {
      try {
        setLoading(true);
        const data = await clientService.getPlacementDetail(placementId);
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
      <div className="w-full max-w-3xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8 space-y-8">
          <div className="border-b border-gold-300/10 pb-4">
            <h2 className="text-xl font-semibold text-gold-50 flex items-center gap-3">
              Placement Details
              <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider border ${placement.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gold-300/10 text-gold-200 border-gold-300/20'}`}>
                {placement.status.replace(/_/g, ' ')}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Care Request Details */}
            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-base font-normal text-gold-200 flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gold-200" /> Care Requirements
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-normal uppercase tracking-wider block mb-1 text-[10px]">Category</span>
                  <span className="text-gold-100 font-light">
                    {Array.isArray(placement.careRequest?.careCategory) 
                      ? placement.careRequest.careCategory.join(" • ") 
                      : placement.careRequest?.careCategory || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-normal uppercase tracking-wider block mb-1 text-[10px]">Schedule</span>
                  <span className="text-gold-100 font-light">
                    {placement.careRequest?.startDate ? new Date(placement.careRequest.startDate).toLocaleDateString() : "N/A"}
                    {placement.careRequest?.endDate ? ` - ${new Date(placement.careRequest.endDate).toLocaleDateString()}` : placement.careRequest?.isOngoing ? " (Ongoing)" : ""}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-normal uppercase tracking-wider block mb-1 text-[10px]">Location</span>
                  <span className="text-gold-100 font-light">{placement.careRequest?.city || placement.careRequest?.postcode || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Carer Profile */}
            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-base font-normal text-gold-200 flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gold-200" /> Assigned Carer
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-normal uppercase tracking-wider block mb-1 text-[10px]">Name</span>
                  <span className="text-gold-100 font-light">{placement.carerProfile?.user?.firstName} {placement.carerProfile?.user?.lastName}</span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-normal uppercase tracking-wider block mb-1 text-[10px]">Contact</span>
                  <span className="text-gold-100 font-light">
                    {placement.carerProfile?.user?.email} <br /> {placement.carerProfile?.user?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="relative overflow-hidden p-6 rounded-2xl border border-gold-300/10 bg-navy-950/40 flex flex-col">
            <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2 mb-5">
              <Calendar className="h-4 w-4 text-gold-200" /> Weekly Invoices
            </h3>
            
            {placement.invoices && placement.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-gold-100/40 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold pl-2">Invoice #</th>
                      <th className="pb-3 font-semibold">Period</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Due Date</th>
                      <th className="pb-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5">
                    {placement.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-navy-950/40 transition-colors">
                        <td className="py-3 pl-2 text-gold-200 font-mono text-xs">{inv.invoiceNumber}</td>
                        <td className="py-3 text-gold-100">
                          {new Date(inv.billingPeriodStart).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })} - {new Date(inv.billingPeriodEnd).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="py-3 text-gold-200 font-semibold">£{Number(inv.total).toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 
                            inv.status === 'OVERDUE' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-gold-300/10 text-gold-200'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-gold-100">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 text-right pr-2">
                          {inv.pdfUrl ? (
                            <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-200 inline-flex items-center gap-1 text-xs">
                              <Download className="h-3 w-3" /> PDF
                            </a>
                          ) : (
                            <span className="text-gold-100/30 text-xs">Processing</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl bg-navy-900/30 border border-gold-300/5 flex-1 flex items-center justify-center">
                <p className="text-sm text-gold-100/40">No invoices generated for this placement yet.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
