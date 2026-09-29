"use client";

import { useState, useEffect } from "react";
import { UserCheck, Search, Star, X, Check, Sparkles, Users } from "lucide-react";
import Button from "@/components/Button";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export interface CandidateCarer {
  id: string;
  name: string;
  experienceYears?: number;
  hourlyRate?: number;
  city?: string;
  specialties?: string[];
  email?: string;
  phoneNumber?: string;
  carerProfileId?: string;
}

export interface SelectBackupCarerModalProps {
  placementId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  candidates?: CandidateCarer[];
  onBackupSelected?: (carer: CandidateCarer) => void;
}

export default function SelectBackupCarerModal({
  placementId,
  clientName,
  isOpen,
  onClose,
  candidates = [],
  onBackupSelected,
}: SelectBackupCarerModalProps) {
  const [selectedCarerId, setSelectedCarerId] = useState<string>(
    candidates[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (candidates.length > 0 && !selectedCarerId) {
      setSelectedCarerId(candidates[0].id);
    }
  }, [candidates, selectedCarerId]);

  if (!isOpen) return null;

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesName = c.name?.toLowerCase().includes(q) || false;
    const matchesCity = c.city ? c.city.toLowerCase().includes(q) : false;
    const matchesSpec = c.specialties
      ? c.specialties.some((s) => s.toLowerCase().includes(q))
      : false;
    return matchesName || matchesCity || matchesSpec;
  });

  const handleConfirm = async () => {
    const chosen = candidates.find((c) => c.id === selectedCarerId);
    if (!chosen) return;

    setIsSubmitting(true);
    try {
      await backupCarerService.designatePreferredBackup(placementId, chosen.carerProfileId || chosen.id, {
        clientName,
        city: chosen.city,
        careCategory: chosen.specialties,
      });
      showSuccessToast(
        "Preferred Backup Carer Designated",
        `${chosen.name} has been set as the Preferred Relief/Backup Carer for ${clientName}. Zero extra charge.`
      );
      if (onBackupSelected) onBackupSelected(chosen);
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to designate backup carer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Select Preferred Backup Carer</h3>
            <p className="text-xs text-gold-100/60">
              Placement: <span className="text-gold-200 font-semibold">{clientName}</span>
            </p>
          </div>
        </div>

        {/* Zero Charge Notice */}
        <div className="p-3 rounded-xl bg-gold-300/10 border border-gold-300/20 text-xs text-gold-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
          <span>
            <strong>Zero Extra Charge:</strong> Designating a Preferred Backup Carer carries no additional
            cost. They are only paid for dates when relief care is actively accepted and delivered.
          </span>
        </div>

        {/* Search */}
        {candidates.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-gold-100/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by carer name, city, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 pl-9 pr-3 py-2 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none"
            />
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl bg-navy-950/40 border border-gold-300/10">
              <Users className="w-8 h-8 text-gold-100/30 mx-auto mb-2" />
              <p className="text-xs text-gold-100/70 font-medium">
                No backup carer candidates available.
              </p>
              <p className="text-[11px] text-gold-100/40 mt-1">
                Applicants and shortlisted carers from the interest list will appear here.
              </p>
            </div>
          ) : (
            filteredCandidates.map((carer) => {
              const isSelected = selectedCarerId === carer.id;
              return (
                <div
                  key={carer.id}
                  onClick={() => setSelectedCarerId(carer.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-gold bg-gold-300/15 text-white ring-1 ring-gold"
                      : "border-gold-300/10 bg-navy-950/60 text-gold-100/80 hover:border-gold-300/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{carer.name}</span>
                      {carer.experienceYears !== undefined && (
                        <span className="text-[10px] text-gold-400 font-semibold bg-gold-300/10 px-2 py-0.5 rounded-full">
                          {carer.experienceYears} yrs exp
                        </span>
                      )}
                    </div>
                    {(carer.city || carer.hourlyRate) && (
                      <p className="text-[11px] text-gold-100/60">
                        {carer.city ? `Location: ${carer.city}` : ""}
                        {carer.city && carer.hourlyRate ? " • " : ""}
                        {carer.hourlyRate ? `£${carer.hourlyRate}/hr standard` : ""}
                      </p>
                    )}
                    {carer.specialties && carer.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {carer.specialties.map((s) => (
                          <span
                            key={s}
                            className="text-[9px] bg-navy-900 border border-gold-300/10 text-gold-200/80 px-1.5 py-0.2 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-gold bg-gold text-navy-950"
                        : "border-gold-300/20 bg-navy-950 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
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
            onClick={handleConfirm}
            disabled={isSubmitting || !selectedCarerId || filteredCandidates.length === 0}
            className="font-bold shadow-md shadow-gold/20"
          >
            {isSubmitting ? "Designating..." : "Confirm Backup Carer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
