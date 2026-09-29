"use client";

import { useState } from "react";
import { UserCheck, ShieldCheck, ArrowRight, X, AlertTriangle } from "lucide-react";
import Button from "@/components/Button";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface PromoteBackupModalProps {
  placementId: string;
  clientName: string;
  currentPrimaryName?: string;
  backupCarerName?: string;
  isOpen: boolean;
  onClose: () => void;
  onPromoted?: () => void;
}

export default function PromoteBackupModal({
  placementId,
  clientName,
  currentPrimaryName = "Primary Carer",
  backupCarerName = "Preferred Backup Carer",
  isOpen,
  onClose,
  onPromoted,
}: PromoteBackupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePromote = async () => {
    setIsSubmitting(true);
    try {
      await backupCarerService.promoteBackupToPrimary(placementId);
      showSuccessToast(
        "Backup Carer Promoted!",
        `${backupCarerName} is now the Primary Carer for ${clientName}. New primary service agreements generated.`
      );
      if (onPromoted) onPromoted();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to promote backup carer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Promote to Primary Carer</h3>
            <p className="text-xs text-gold-100/60">
              Placement: <span className="text-gold-200 font-semibold">{clientName}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-gold-100/80 leading-relaxed">
          If the primary carer permanently withdraws or resigns, you can promote the designated
          preferred relief/backup carer to become the new permanent Primary Carer.
        </p>

        {/* Transition Summary */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-navy-950/80 border border-gold-300/15 text-xs">
          <div>
            <span className="text-[10px] uppercase text-rose-400 font-bold block mb-1">
              Vacating Primary
            </span>
            <span className="font-semibold text-white">{currentPrimaryName}</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gold-400" />

          <div>
            <span className="text-[10px] uppercase text-emerald-400 font-bold block mb-1">
              New Primary Carer
            </span>
            <span className="font-bold text-emerald-300">{backupCarerName}</span>
          </div>
        </div>

        <div className="space-y-2 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
          <strong>Promote Workflow Actions:</strong>
          <ul className="list-disc pl-4 space-y-1 mt-1 text-gold-100/70">
            <li>Designation will update so {backupCarerName} becomes the Primary Carer.</li>
            <li>A new Preferred Backup Carer can subsequently be designated for the client.</li>
            <li>New placement agreements will automatically be queued for digital signing.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gold-300/10">
          <Button
            variant="ghost-gold"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePromote}
            disabled={isSubmitting}
            className="font-bold shadow-md shadow-gold/20"
          >
            {isSubmitting ? "Promoting..." : "Confirm Promotion"}
          </Button>
        </div>
      </div>
    </div>
  );
}
