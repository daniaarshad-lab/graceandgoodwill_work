"use client";

import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";
import ThinSpinner from "@/components/ThinSpinner";

interface ClientApprovalModalProps {
  client: any; // We can use any or the specific client type here
  onConfirm: (clientId: string) => void;
  onCancel: () => void;
  isApproving?: boolean;
}

export default function ClientApprovalModal({
  client,
  onConfirm,
  onCancel,
  isApproving = false,
}: ClientApprovalModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!client) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-navy-900 border border-gold-300/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-gold-300/10">
          <h2
            id="modal-title"
            className="text-lg font-bold text-gold-200 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-gold" /> Approve Client Access?
          </h2>
          <button
            onClick={onCancel}
            disabled={isApproving}
            className="p-1 rounded-lg text-gold-100/50 hover:text-gold-200 hover:bg-gold-300/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-gold-100/80">
          <p>
            By approving this client, you are confirming that they can proceed
            with their Grace & Goodwill account and access the next stage of
            registration.
          </p>
          
          <div className="p-4 rounded-xl bg-navy-950/50 border border-gold-300/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-gold-100/50">Client Name:</span>
              <span className="font-semibold text-gold-200">{client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gold-100/50">Email:</span>
              <span className="font-semibold text-gold-200 truncate ml-4">{client.email}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p>
              Once approved, the client will be able to access the Terms & Conditions and their client portal.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gold-300/10 bg-navy-950/30">
          <button
            type="button"
            onClick={onCancel}
            disabled={isApproving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gold-100 hover:bg-gold-300/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(client.id)}
            disabled={isApproving}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gold text-navy-950 hover:bg-gold-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isApproving ? (
              <>
                <ThinSpinner size="xs" spinnerClassName="border-navy-950 shrink-0" className="inline-flex flex-row space-y-0" />
                Approving...
              </>
            ) : (
              "Approve Client"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
