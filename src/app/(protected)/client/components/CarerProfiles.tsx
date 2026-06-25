import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarers, addToInterestList, removeFromInterestList } from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import { Carer } from "../types/client-ui.types";
import Button from "@/components/Button";
import { Video, Heart } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const SafeImage = ({ src, alt, fallback, className }: { src: string, alt: string, fallback: React.ReactNode, className?: string }) => {
  const [error, setError] = useState(false);
  if (error) return <>{fallback}</>;
  return <Image src={src} alt={alt} fill className={className} onError={() => setError(true)} />;
};

interface CarerProfilesProps {
  carers: Carer[];
}

export default function CarerProfiles({
  carers,
}: CarerProfilesProps) {
  const dispatch = useAppDispatch();
  const { interestList } = useAppSelector((state) => state.client);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCarers());
  }, [dispatch]);

  const handleWishlistToggle = async (carer: Carer) => {
    const isWishlisted = interestList.some((w: Carer) => w.id === carer.id);
    
    if (!isWishlisted && interestList.length >= 8) {
      showErrorToast("Limit Reached", "Maximum 8 carers allowed in Interest List.");
      return;
    }

    setProcessingId(carer.id);
    try {
      if (isWishlisted) {
        await dispatch(removeFromInterestList(carer.id)).unwrap();
        showSuccessToast("Removed", "Removed from Interest List");
      } else {
        await dispatch(addToInterestList(carer.id)).unwrap();
        showSuccessToast("Added", "Added to Interest List");
      }
    } catch (error: any) {
      showErrorToast("Action failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Pre-screened Carers Index
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Browse profiles verified by Grace & Goodwill. You can save them to your Interest List.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {carers.map((carer) => {
          const isWishlisted = interestList.some((w: Carer) => w.id === carer.id);
          const isMaxReached = interestList.length >= 8;
          const isProcessing = processingId === carer.id;

          return (
            <SectionCard
              key={carer.id}
              className="flex flex-col justify-between space-y-6"
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
                  onClick={() => handleWishlistToggle(carer)}
                  variant={isWishlisted ? "outline" : "primary"}
                  size="sm"
                  fullWidth
                  disabled={isProcessing || (!isWishlisted && isMaxReached)}
                  className={isWishlisted ? "!border-gold-300/30 !text-gold-200 hover:!bg-gold-300/10" : ""}
                >
                  <Heart className={`w-3 h-3 mr-2 ${isWishlisted ? "fill-gold-200" : ""}`} />
                  {isProcessing 
                    ? "Updating..." 
                    : isWishlisted 
                      ? "Remove from Interest List" 
                      : isMaxReached 
                        ? "Maximum 8 allowed" 
                        : "Add to Interest List"}
                </Button>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
