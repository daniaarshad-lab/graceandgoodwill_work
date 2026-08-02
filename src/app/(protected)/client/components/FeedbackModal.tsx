import { useState, useEffect } from "react";
import { Star, X, User } from "lucide-react";
import Button from "@/components/Button";
import { useAppDispatch } from "@/store/hooks";
import { submitFeedback } from "@/store/slices/clientSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface FeedbackModalProps {
  placementId: string;
  carerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackModal({
  placementId,
  carerName,
  onClose,
  onSuccess,
}: FeedbackModalProps) {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200); // Wait for animation to finish
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showErrorToast("Please select a rating.");
      return;
    }
    if (!message.trim()) {
      showErrorToast("Please provide a feedback message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        submitFeedback({ placementId, payload: { rating, message } }),
      ).unwrap();
      showSuccessToast("Feedback submitted successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      showErrorToast(error || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible && !isClosing ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-navy-900 border border-gold-300/20 rounded-2xl w-full max-w-[860px] shadow-elegant overflow-y-auto custom-scrollbar max-h-[90vh] relative transition-all duration-200 transform flex flex-col ${
          isVisible && !isClosing
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex justify-between items-start p-5 px-6 border-b border-gold-300/10">
          <div>
            <h2 className="text-xl font-bold text-gold-200 flex items-center gap-2">
              <Star className="w-5 h-5 fill-gold text-gold" />
              Leave Feedback
            </h2>
            <p className="text-xs text-gold-100/60 mt-1">
              Share your experience with this carer to help us maintain the
              highest quality of care.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gold-200/50 hover:text-gold-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            {/* Carer Information Card */}
            <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-navy-950/50 border border-gold-300/10">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                <User className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gold-50">{carerName}</h3>
                <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                  ✓ Placement Completed
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex-1 flex flex-col items-center md:items-end justify-center pr-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                          : "text-gold-300/20 hover:text-gold-300/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-medium text-gold-200/60 mt-1.5 h-4">
                {rating > 0 || hoveredRating > 0 ? (
                  <span>
                    {
                      ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                        (hoveredRating || rating) - 1
                      ]
                    }
                  </span>
                ) : (
                  "Tap to rate"
                )}
              </p>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1.5 relative mt-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              placeholder="Tell us about your experience with this carer. What went well? Is there anything that could be improved?"
              className="w-full bg-navy-950/50 border border-gold-300/20 rounded-xl p-3.5 text-sm text-gold-50 placeholder:text-gold-200/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all min-h-[100px] resize-y custom-scrollbar leading-relaxed"
            />
            <div className="absolute bottom-2.5 right-3 text-[10px] font-medium text-gold-200/40 bg-navy-950/80 px-1.5 py-0.5 rounded">
              {message.length} / 500
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-gold-300/10 flex justify-end gap-3 bg-navy-950/30">
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="primary"
            size="sm"
            fullWidth={false}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
