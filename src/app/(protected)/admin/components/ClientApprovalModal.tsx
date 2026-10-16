"use client";

import { AlertTriangle, CheckCircle, PhoneCall, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThinSpinner from "@/components/ThinSpinner";

interface ClientApprovalModalProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    agreedWeeklyFee?: number;
  } | null;
  onConfirm: (payload: { weeklyFee?: number; explanation?: string }) => Promise<void> | void;
  onCancel: () => void;
  isApproving?: boolean;
}

const STANDARD_MIN_WEEKLY_FEE = 1350;

export default function ClientApprovalModal({
  client,
  onConfirm,
  onCancel,
  isApproving = false,
}: ClientApprovalModalProps) {
  const [weeklyFeeInput, setWeeklyFeeInput] = useState<string>(
    client?.agreedWeeklyFee && client.agreedWeeklyFee > 0
      ? String(client.agreedWeeklyFee)
      : ""
  );
  const [explanation, setExplanation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Sync fee if client changes
  useEffect(() => {
    if (client) {
      setWeeklyFeeInput(
        client.agreedWeeklyFee && client.agreedWeeklyFee > 0
          ? String(client.agreedWeeklyFee)
          : ""
      );
      setExplanation("");
      setError(null);
    }
  }, [client]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!client) return null;

  const parsedFee = weeklyFeeInput.trim() === "" ? null : parseFloat(weeklyFeeInput);
  const isException = parsedFee === null || isNaN(parsedFee) || parsedFee < STANDARD_MIN_WEEKLY_FEE;

  const handleConfirm = async () => {
    setError(null);

    if (isException && (!explanation || !explanation.trim())) {
      setError(
        "Please provide a brief explanation for approving without a fee or below the £1,350 standard minimum."
      );
      return;
    }

    try {
      await onConfirm({
        weeklyFee: parsedFee !== null && !isNaN(parsedFee) ? parsedFee : undefined,
        explanation: isException ? explanation.trim() : undefined,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to approve client.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="w-full max-w-xl bg-navy-900 border border-gold-300/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-300/10 bg-navy-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-gold-200 leading-tight">
                Approve Client Account
              </h2>
              <p className="text-[11px] text-gold-100/50">
                Administrator verification & platform access authorization
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isApproving}
            className="p-1.5 rounded-lg text-gold-100/50 hover:text-gold-200 hover:bg-gold-300/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 space-y-3.5 overflow-y-auto text-sm text-gold-100/80 flex-1">
          {/* CLIENT SUMMARY & FEE IN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-navy-950/60 border border-gold-300/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                Client Details
              </span>
              <p className="font-semibold text-gold-200 text-xs truncate" title={client.name}>
                {client.name}
              </p>
              <p className="font-mono text-gold-100/60 text-[11px] truncate" title={client.email}>
                {client.email}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/60 border border-gold-300/10 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                  Agreed Weekly Fee
                </span>
                <span className="text-[9px] font-mono text-gold-100/40">
                  Min: £1,350/wk
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gold-100/40 font-mono text-xs pointer-events-none">
                  £
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={weeklyFeeInput}
                  onChange={(e) => {
                    setWeeklyFeeInput(e.target.value);
                    setError(null);
                  }}
                  placeholder="Leave blank if not agreed"
                  className="w-full bg-navy-900 border border-gold-300/15 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-gold-100 placeholder-gold-100/25 outline-none focus:border-gold-300/40 transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* MANDATORY TELEPHONE REMINDER */}
          <div className="p-3.5 rounded-xl bg-gold-300/10 border border-gold-300/25 text-gold-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gold">
              <PhoneCall className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Mandatory Administrator and Client Discussion Check</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gold-100/90 font-medium">
              “IMPORTANT: Please ensure this client has been contacted, their care
              requirements have been discussed and the applicable weekly care fees have been
              agreed before proceeding with approval.”
            </p>
          </div>

          {/* EXCEPTION WARNING & EXPLANATION TEXTAREA */}
          {isException && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200/90 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-amber-300 text-[11px]">
                    Pricing Exception Notice
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    “This approval falls outside Grace & Goodwill’s standard fee arrangements. Your
                    explanation will be recorded, and the Super Admin will be notified.”
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 flex items-center justify-between">
                  <span>Exception Explanation (Required)</span>
                  <span className="text-[9px] font-normal text-amber-200/60 lowercase">
                    mandatory for audit & Super Admin
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => {
                    setExplanation(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. Client approved while awaiting further discussions about specific care arrangements..."
                  className="w-full bg-navy-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-gold-100 placeholder-gold-100/25 outline-none focus:border-amber-400/60 transition duration-200 resize-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-gold-300/10 bg-navy-950/60 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isApproving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gold-100 hover:bg-gold-300/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isApproving || (isException && !explanation.trim())}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gold text-navy-950 hover:bg-gold-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isApproving ? (
              <>
                <ThinSpinner
                  size="xs"
                  spinnerClassName="border-navy-950 shrink-0"
                  className="inline-flex flex-row space-y-0"
                />
                Approving Client...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Approval
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
