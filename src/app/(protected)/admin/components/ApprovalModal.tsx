import { CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";

interface ApprovalModalProps {
  carer: CarerApplication;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

export default function ApprovalModal({
  carer,
  onConfirm,
  onCancel,
}: ApprovalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gold-300/10 bg-navy-900 p-6 shadow-soft space-y-6">
        <div className="flex items-start justify-between border-b border-gold-300/10 pb-4">
          <div>
            <h4 className="text-lg font-bold text-gold-200">
              Verify & Approve Carer
            </h4>
            <p className="text-xs text-gold-100/50">
              Confirm DBS review and background documentation
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gold-100/40 hover:text-gold-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs text-gold-100/80">
          <p>
            You are about to approve{" "}
            <strong className="text-gold">{carer.name}</strong> as an active
            caregiver on the Grace & Goodwill platform.
          </p>

          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/5 space-y-2">
            {carer.documents.map((doc) => (
              <div key={doc.name} className="flex justify-between">
                <span className="font-semibold text-gold-200">{doc.name}:</span>
                <span
                  className={`font-bold ${
                    doc.status === "Verified"
                      ? "text-emerald-400"
                      : doc.status === "Uploaded"
                        ? "text-gold-DEFAULT"
                        : "text-rose-400"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <p className="text-gold-100/50 italic">
            Approval grants the carer visibility in the pre-screened directory
            for match recommendations.
          </p>
        </div>

        <div className="flex gap-4 border-t border-gold-300/10 pt-4">
          <Button
            onClick={() => onConfirm(carer.id)}
            variant="primary"
            size="md"
            fullWidth
          >
            Confirm & Approve ✓
          </Button>
          <Button onClick={onCancel} variant="ghost-gold" size="md" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
