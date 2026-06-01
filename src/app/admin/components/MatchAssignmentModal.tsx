import { ClientRequest, CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";

interface MatchAssignmentModalProps {
  request: ClientRequest;
  carer: CarerApplication;
  onConfirm: (requestId: string, carerId: string) => void;
  onCancel: () => void;
}

export default function MatchAssignmentModal({
  request,
  carer,
  onConfirm,
  onCancel,
}: MatchAssignmentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/10 bg-navy-900 p-6 shadow-soft space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold-300/10 pb-4">
          <div>
            <h4 className="text-lg font-bold text-gold-200">
              Confirm Care Assignment Match
            </h4>
            <p className="text-xs text-gold-100/50">
              Verify compatibility before activating care schedule pairing
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gold-100/40 hover:text-gold-200"
          >
            ✕
          </button>
        </div>

        {/* Comparison Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gold-100/80">
          {/* Client summary */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/5 space-y-2">
            <h5 className="font-bold text-gold-200 uppercase tracking-wider text-[10px]">
              Client File Specs
            </h5>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Client:
              </span>
              <span className="font-medium text-gold-200">
                {request.clientName}
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Service Type:
              </span>
              <span className="font-medium text-gold-200">
                {request.careType}
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Location:
              </span>
              <span className="font-medium text-gold-200">
                {request.location}
              </span>
            </div>
          </div>

          {/* Carer summary */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/5 space-y-2">
            <h5 className="font-bold text-gold uppercase tracking-wider text-[10px]">
              Carer Profile Specs
            </h5>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Carer:
              </span>
              <span className="font-medium text-gold">{carer.name}</span>
            </div>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Experience:
              </span>
              <span className="font-medium text-gold">{carer.experience}</span>
            </div>
            <div>
              <span className="font-semibold block text-gold-100/50">
                Location:
              </span>
              <span className="font-medium text-gold">{carer.city}</span>
            </div>
          </div>
        </div>

        {/* Warning Gate note */}
        <div className="rounded-xl bg-gold/5 p-3 border border-gold/10 text-xs text-gold-DEFAULT/80">
          <strong className="text-gold">Security Notice:</strong> Sensitive
          phone numbers and email details are hidden initially. Contact release
          permissions must be authorized manually on the Tracking Board once
          this matchup is confirmed.
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 border-t border-gold-300/10 pt-4">
          <Button
            onClick={() => onConfirm(request.id, carer.id)}
            variant="primary"
            size="md"
            fullWidth
          >
            Approve Match & Create Placement ✓
          </Button>
          <Button onClick={onCancel} variant="ghost-gold" size="md" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
