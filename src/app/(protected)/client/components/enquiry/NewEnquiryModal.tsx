import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

interface NewEnquiryModalProps {
  onClose: () => void;
  onSubmit: (data: {
    message: string;
  }) => void;
}



export default function NewEnquiryModal({
  onClose,
  onSubmit,
}: NewEnquiryModalProps) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!message.trim()) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      onSubmit({ message });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-gold-300/10 bg-navy-900/95 backdrop-blur-md p-6 shadow-elegant animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-navy-950/60 transition-colors text-gold-100/40 hover:text-gold-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="border-b border-gold-300/10 pb-4 mb-5">
          <h3 className="text-lg font-bold text-gold-200">
            Create New Enquiry
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
            Submit a new support enquiry. Our team will respond within 24
            hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">


          <div className="space-y-2">
            <label className="text-sm font-medium text-gold-200">
              Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or concern in detail…"
              className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                errors.message
                  ? "border-red-500"
                  : "border-gray-300/20"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-500 font-medium">
                {errors.message}
              </p>
            )}
          </div>



          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost-gold"
              size="sm"
              fullWidth={false}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="sm"
              fullWidth={false}
            >
              {isSubmitting ? "Submitting…" : "Submit Enquiry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
