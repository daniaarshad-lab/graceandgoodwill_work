import { Carer } from "../types/client.types";
import Button from "@/components/Button";

interface IntroductionModalProps {
  carer: Carer;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function IntroductionModal({
  carer,
  onCancel,
  onConfirm,
}: IntroductionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-gold-300/20 bg-navy-900 p-6 space-y-6 shadow-elegant">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gold-50">
            Confirm Introduction Request
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed">
            You are requesting an introduction with **{carer.name}**. Our care
            placement manager will review your client profile and contact you to
            set up the introductory call.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg font-bold shrink-0 ${carer.avatarBg}`}
          >
            {carer.name
              .split(" ")
              .map((n) => n.charAt(0))
              .join("")}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gold-50">{carer.name}</h4>
            <p className="text-xs text-gold-100/50">
              {carer.experience} Experience • {carer.availability}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            Confirm Request
          </Button>
        </div>
      </div>
    </div>
  );
}
