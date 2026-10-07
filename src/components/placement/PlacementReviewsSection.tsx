"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  User,
  AlertCircle,
  X,
  Plus,
  Pencil,
} from "lucide-react";
import Button from "@/components/Button";
import { clientService } from "@/services/client/client.service";
import { toast } from "sonner";

interface CarerOption {
  id: string;
  name: string;
  role: string;
  profilePhotoUrl?: string | null;
}

interface PlacementReviewsSectionProps {
  placementId: string;
  primaryCarer?: any;
  preferredBackupCarer?: any;
  activeReliefCarer?: any;
  backupCarers?: any[];
  feedbacks?: any[];
  onReviewSubmitted?: () => void;
}

export default function PlacementReviewsSection({
  placementId,
  primaryCarer,
  preferredBackupCarer,
  activeReliefCarer,
  backupCarers = [],
  feedbacks = [],
  onReviewSubmitted,
}: PlacementReviewsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [selectedCarerId, setSelectedCarerId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract carer display name
  const getCarerName = (carer: any, fallback: string) => {
    if (!carer) return fallback;
    if (carer.user) {
      const full = `${carer.user.firstName || ""} ${carer.user.lastName || ""}`.trim();
      if (full) return full;
    }
    if (carer.firstName || carer.lastName) {
      return `${carer.firstName || ""} ${carer.lastName || ""}`.trim();
    }
    return carer.name || fallback;
  };

  // Compile list of eligible carers for this placement
  const availableCarers: CarerOption[] = [];
  const seenCarerIds = new Set<string>();

  if (primaryCarer?.id) {
    availableCarers.push({
      id: primaryCarer.id,
      name: getCarerName(primaryCarer, "Primary Carer"),
      role: "Primary Carer",
      profilePhotoUrl: primaryCarer.profilePhotoUrl,
    });
    seenCarerIds.add(primaryCarer.id);
  }

  if (preferredBackupCarer?.id && !seenCarerIds.has(preferredBackupCarer.id)) {
    availableCarers.push({
      id: preferredBackupCarer.id,
      name: getCarerName(preferredBackupCarer, "Preferred Relief Carer"),
      role: "Preferred Relief Carer",
      profilePhotoUrl: preferredBackupCarer.profilePhotoUrl,
    });
    seenCarerIds.add(preferredBackupCarer.id);
  }

  if (activeReliefCarer?.id && !seenCarerIds.has(activeReliefCarer.id)) {
    availableCarers.push({
      id: activeReliefCarer.id,
      name: getCarerName(activeReliefCarer, "Active Relief Carer"),
      role: "Active Relief Carer",
      profilePhotoUrl: activeReliefCarer.profilePhotoUrl,
    });
    seenCarerIds.add(activeReliefCarer.id);
  }

  if (Array.isArray(backupCarers)) {
    backupCarers.forEach((bc: any) => {
      const profile = bc.carerProfile;
      if (profile?.id && !seenCarerIds.has(profile.id)) {
        availableCarers.push({
          id: profile.id,
          name: getCarerName(profile, `Backup Carer (Priority ${bc.priority || 1})`),
          role: bc.priority === 1 ? "1st Choice Relief Carer" : "2nd Choice Relief Carer",
          profilePhotoUrl: profile.profilePhotoUrl,
        });
        seenCarerIds.add(profile.id);
      }
    });
  }

  // Determine which carers already have reviews
  const reviewedCarerIds = new Set<string>(
    feedbacks.map((f: any) => f.carerProfileId || f.carerProfile?.id).filter(Boolean),
  );

  const openReviewModal = (carerId?: string) => {
    setEditingFeedbackId(null);
    const defaultCarer = carerId || availableCarers.find((c) => !reviewedCarerIds.has(c.id))?.id || availableCarers[0]?.id || "";
    setSelectedCarerId(defaultCarer);
    setRating(0);
    setHoverRating(0);
    setMessage("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (feedback: any) => {
    setEditingFeedbackId(feedback.id);
    const carerId = feedback.carerProfileId || feedback.carerProfile?.id || "";
    setSelectedCarerId(carerId);
    setRating(feedback.rating || 0);
    setHoverRating(0);
    setMessage(feedback.message || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarerId) {
      setError("Please select the carer you wish to review.");
      return;
    }
    if (!rating || rating < 1) {
      setError("Please select a star rating (1 to 5 stars).");
      return;
    }
    if (!message.trim()) {
      setError("Please provide a review message.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingFeedbackId) {
        await clientService.updateFeedback(editingFeedbackId, {
          rating,
          message: message.trim(),
        });
        toast.success("Review updated successfully!");
      } else {
        await clientService.submitFeedback(placementId, {
          carerProfileId: selectedCarerId,
          rating,
          message: message.trim(),
        });
        toast.success("Review submitted successfully!");
      }

      setIsModalOpen(false);
      setEditingFeedbackId(null);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setError(err.message || "Failed to save review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingDescriptions: Record<number, string> = {
    1: "Needs Improvement",
    2: "Fair Support",
    3: "Good Care",
    4: "Very Good & Professional",
    5: "Exceptional & Highly Recommended",
  };

  return (
    <div className="space-y-6">
      {/* Header card with action */}
      <div className="p-6 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-DEFAULT" />
              Carer Reviews & Placement Feedback
            </h3>
            <p className="text-xs text-gold-100/70 max-w-2xl leading-relaxed">
              Share your feedback for each carer assigned to this placement (Primary Carer and Relief/Backup Carers).
            </p>
          </div>

          {availableCarers.length > 0 && availableCarers.some((c) => !reviewedCarerIds.has(c.id)) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => openReviewModal()}
              className="font-bold shadow-md shadow-gold/20 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Leave a Review
            </Button>
          )}
        </div>

        {/* Carers review status grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {availableCarers.map((carer) => {
            const hasReviewed = reviewedCarerIds.has(carer.id);
            const carerFeedback = feedbacks.find(
              (f: any) => (f.carerProfileId || f.carerProfile?.id) === carer.id,
            );

            return (
              <div
                key={carer.id}
                className="p-4 rounded-xl border border-gold-300/15 bg-navy-950/60 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center font-bold text-xs text-gold-200 shrink-0 overflow-hidden">
                    {carer.profilePhotoUrl ? (
                      <img
                        src={carer.profilePhotoUrl}
                        alt={carer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gold-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white block truncate">
                      {carer.name}
                    </span>
                    <span className="text-[11px] font-medium text-gold-300/70 block truncate">
                      {carer.role}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {hasReviewed ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Review Submitted</span>
                      </span>
                      {carerFeedback && (
                        <button
                          onClick={() => openEditModal(carerFeedback)}
                          className="px-2.5 py-1 rounded-lg border border-gold-300/30 hover:border-gold-300/60 bg-gold-DEFAULT/10 hover:bg-gold-DEFAULT/20 text-gold-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                          title="Edit your review"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => openReviewModal(carer.id)}
                      className="px-3 py-1.5 rounded-lg border border-gold-300/30 hover:border-gold-300/60 bg-gold-DEFAULT/10 hover:bg-gold-DEFAULT/20 text-gold-200 text-xs font-bold transition cursor-pointer"
                    >
                      Review Carer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submitted reviews list */}
      {feedbacks.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider text-gold-100/60 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-gold-DEFAULT" />
            Submitted Reviews ({feedbacks.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb: any) => {
              const carerName = getCarerName(fb.carerProfile, "Assigned Carer");
              const isEdited =
                fb.updatedAt &&
                new Date(fb.updatedAt).getTime() - new Date(fb.createdAt).getTime() > 2000;

              return (
                <div
                  key={fb.id}
                  className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/50 space-y-3 shadow-md relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-white block">
                        {carerName}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= fb.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gold-100/20"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-gold-200 ml-1.5">
                          {fb.rating}.0
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Submitted</span>
                      </span>
                      <button
                        onClick={() => openEditModal(fb)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-gold-300/30 hover:border-gold-300/60 bg-gold-DEFAULT/10 hover:bg-gold-DEFAULT/20 text-gold-200 transition cursor-pointer"
                        title="Edit your review"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gold-100/80 italic leading-relaxed bg-navy-950/40 p-3 rounded-xl border border-gold-300/10">
                    &ldquo;{fb.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gold-100/50 pt-1 border-t border-gold-300/10">
                    <span>
                      Submitted{" "}
                      {new Date(fb.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {isEdited && (
                      <span className="text-gold-200/50 italic text-[10px]">
                        (Edited)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-gold-300/10 bg-navy-950/30 text-center space-y-2">
          <Star className="w-8 h-8 text-gold-DEFAULT/40 mx-auto" />
          <h4 className="text-sm font-bold text-gold-100">No Reviews Submitted Yet</h4>
          <p className="text-xs text-gold-100/60 max-w-md mx-auto">
            You haven&apos;t left a review for the carers on this placement yet. Click the &ldquo;Leave a Review&rdquo; button above to share your feedback.
          </p>
        </div>
      )}

      {/* Review Submission / Editing Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-navy-900 border border-gold-300/20 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-navy-800 border border-gold-300/10 flex items-center justify-center text-gold-100/50 hover:text-gold-50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {editingFeedbackId ? (
                  <Pencil className="w-5 h-5 text-gold-DEFAULT" />
                ) : (
                  <Star className="w-5 h-5 text-gold-DEFAULT fill-gold-DEFAULT" />
                )}
                {editingFeedbackId ? "Edit Carer Review" : "Leave Carer Review"}
              </h3>
              <p className="text-xs text-gold-100/70">
                {editingFeedbackId
                  ? "Update your rating and review for this carer."
                  : "Rate and review your experience with the carer for this placement."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Carer Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Select Carer to Review
                </label>
                <select
                  value={selectedCarerId}
                  onChange={(e) => setSelectedCarerId(e.target.value)}
                  disabled={Boolean(editingFeedbackId)}
                  required
                  className={`w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 focus:border-gold outline-none ${
                    editingFeedbackId ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="" disabled>
                    Choose a carer...
                  </option>
                  {availableCarers.map((carer) => (
                    <option
                      key={carer.id}
                      value={carer.id}
                      disabled={!editingFeedbackId && reviewedCarerIds.has(carer.id)}
                    >
                      {carer.name} — {carer.role}{" "}
                      {!editingFeedbackId && reviewedCarerIds.has(carer.id)
                        ? "(Already Reviewed)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interactive Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        title={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                              : "text-slate-600 hover:text-amber-300/50"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-gold-200 ml-2">
                    {(hoverRating || rating) > 0 ? (
                      ratingDescriptions[hoverRating || rating]
                    ) : (
                      <span className="text-gold-100/40 font-normal">Select a rating</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Review Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Your Review
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your experience with this carer (e.g. punctuality, compassion, attentiveness, communication)..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gold-300/10">
                <Button
                  variant="ghost-gold"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting || !selectedCarerId || rating < 1 || !message.trim()}
                  className="font-bold shadow-md shadow-gold/20"
                >
                  {isSubmitting
                    ? editingFeedbackId
                      ? "Updating Review..."
                      : "Submitting Review..."
                    : editingFeedbackId
                    ? "Update Review"
                    : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
