"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInterestList, removeFromInterestList } from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import { Carer } from "../types/client-ui.types";
import Button from "@/components/Button";
import { Video, Trash2, AlertCircle } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const SafeImage = ({ src, alt, fallback, className }: { src: string, alt: string, fallback: React.ReactNode, className?: string }) => {
  const [error, setError] = useState(false);
  if (error) return <>{fallback}</>;
  return <Image src={src} alt={alt} fill className={className} onError={() => setError(true)} />;
};

interface InterestListPanelProps {
  onRequestIntro: (carer: Carer) => void;
}

export default function InterestListPanel({ onRequestIntro }: InterestListPanelProps) {
  const dispatch = useAppDispatch();
  const { interestList, interestListLoading } = useAppSelector((state) => state.client);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchInterestList());
  }, [dispatch]);

  const handleRemove = async (carer: Carer) => {
    console.log("carer item:", carer);
    console.log("carerProfileId to remove:", carer.id);
    
    setRemovingId(carer.id);
    try {
      await dispatch(removeFromInterestList(carer.id)).unwrap();
      showSuccessToast("Removed", "Removed from Interest List");
    } catch (error: any) {
      showErrorToast("Action failed", error || "Failed to remove carer");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gold-200">
            Interest List ❤️
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
            Your shortlisted carers. You need to select at least 3, up to a maximum of 8.
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-sm font-bold text-gold-50 bg-navy-900 px-4 py-2 rounded-lg border border-gold-DEFAULT/30">
            {interestList.length} / 8 Selected
          </div>
          {interestList.length > 0 && interestList.length < 3 && (
            <div className="flex items-center text-amber-400 text-xs mt-2 font-semibold">
              <AlertCircle className="w-3 h-3 mr-1" />
              Minimum 3 required
            </div>
          )}
        </div>
      </div>

      {interestListLoading && interestList.length === 0 ? (
        <div className="text-center py-10 text-gold-200 animate-pulse">Loading your Interest List...</div>
      ) : interestList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gold-300/20 rounded-xl bg-navy-950/40">
          <div className="w-16 h-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center mb-4">
            <span className="text-2xl">❤️</span>
          </div>
          <h3 className="text-lg font-bold text-gold-200 mb-2">Interest List is Empty</h3>
          <p className="text-sm text-gold-100/60 max-w-md mx-auto">
            No carers added to your Interest List yet. Browse carers and click &quot;Add to Interest List&quot; to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interestList.map((carer: Carer) => (
            <SectionCard
              key={carer.id}
              className="flex flex-col justify-between space-y-6 relative"
            >
              <div className="space-y-4">
                {/* Avatar & Availability Badge */}
                <div className="flex justify-between items-start">
                  <div className={`relative h-16 w-16 rounded-full border-2 shrink-0 shadow-soft overflow-hidden bg-navy-950 ${!carer.profilePhotoUrl ? carer.avatarBg : 'border-gold-300/20'}`}>
                    {carer.profilePhotoUrl ? (
                      <SafeImage
                        src={carer.profilePhotoUrl}
                        alt={carer.name}
                        fallback={
                          <div className={`h-full w-full flex items-center justify-center text-2xl font-bold ${carer.avatarBg}`}>
                            {carer.name.split(" ").map((n) => n.charAt(0)).join("")}
                          </div>
                        }
                        className="object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center text-2xl font-bold ${carer.avatarBg}`}>
                        {carer.name.split(" ").map((n) => n.charAt(0)).join("")}
                      </div>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                      carer.availability === "Available"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {carer.availability}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gold-50">{carer.name}</h4>
                  <p className="text-xs text-gold-100/50 mt-0.5">
                    Professional Experience: {carer.experience}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gold-300">
                    Specialties
                  </p>
                  <p className="text-xs text-gold-100/80 leading-relaxed truncate">
                    {carer.specialties}
                  </p>
                </div>

                <p className="text-xs text-gold-100/60 leading-relaxed pt-2 border-t border-gold-300/10">
                  {carer.bio}
                </p>

                {/* Embedded Video Player */}
                {carer.introVideoUrl ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-gold-300/10 bg-black shadow-inner relative mt-4">
                    <video
                      src={carer.introVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl border border-dashed border-gold-300/20 bg-navy-950/40 flex flex-col items-center justify-center p-4 text-center space-y-2 mt-4">
                    <Video className="w-6 h-6 text-gold-300/30 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-semibold text-gold-200">Video Preview Pending</p>
                      <p className="text-[8px] text-gold-100/40 max-w-[140px] mx-auto leading-relaxed mt-0.5">
                        The carer is finalizing their video upload.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => handleRemove(carer)}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10"
                  disabled={removingId === carer.id}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  {removingId === carer.id ? "Removing..." : "Remove from Interest List"}
                </Button>
                <Button
                  onClick={() => onRequestIntro(carer)}
                  variant="secondary"
                  size="sm"
                  fullWidth
                >
                  Request Introduction
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
