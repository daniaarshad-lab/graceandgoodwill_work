"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInterestList, removeFromInterestList } from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import { Carer } from "../types/client-ui.types";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Video, Trash2, AlertCircle, User, Headset } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const SafeImage = ({ src, alt, fallback, className }: { src: string, alt: string, fallback: React.ReactNode, className?: string }) => {
  const [error, setError] = useState(false);
  if (error) return <>{fallback}</>;
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className || ""}`} onError={() => setError(true)} />;
};

export default function InterestListPanel() {
  const dispatch = useAppDispatch();
  const { interestList, interestListLoading } = useAppSelector((state) => state.client);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

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
      <div className="border-b border-gold-300/10 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gold-200">
            Interest List ❤️
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
            Your shortlisted carers. You need to select at least 2, up to a maximum of 8.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          {/* Premium Callout Banner - Redesigned for better UI */}
          <div className="flex items-center gap-3 bg-navy-900/40 border border-gold-300/20 rounded-xl px-4 py-2.5 hover:bg-navy-900/60 transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center">
              <Headset className="h-4 w-4 text-gold-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <p className="text-xs font-bold text-gold-200">Need help choosing?</p>
                <p className="text-[10px] text-gold-100/60">
                  Our Admin team can help you shortlist the most suitable carers.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <a href="tel:+448001234567" className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  📞 Call: +44 800 123 4567
                </a>
                <span className="text-[9px] text-gold-100/40 font-semibold tracking-wider uppercase">
                  Mon – Fri, 9–5
                </span>
              </div>
            </div>
          </div>

          {/* Counter Section */}
          <div className="flex flex-col items-end shrink-0">
            <div className="text-sm font-bold text-gold-50 bg-navy-900 px-4 py-2.5 rounded-xl border border-gold-DEFAULT/30">
              {interestList.length} / 8 Selected
            </div>
            {interestList.length > 0 && interestList.length < 2 && (
              <div className="flex items-center text-amber-400 text-[10px] mt-1.5 font-semibold">
                <AlertCircle className="w-3 h-3 mr-1" />
                Minimum 2 required
              </div>
            )}
          </div>
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

                <p className="text-xs text-gold-100/60 leading-relaxed pt-2 border-t border-gold-300/10 line-clamp-2">
                  {carer.bio}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => router.push(`/client/carers/${carer.id}`)}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="!border-gold-300/30 !text-gold-200 hover:!bg-gold-300/10"
                >
                  <User className="w-3 h-3 mr-2" />
                  View Carer Details
                </Button>
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
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
