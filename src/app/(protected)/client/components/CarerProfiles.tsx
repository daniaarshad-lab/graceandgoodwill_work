import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarers,
  addToInterestList,
  removeFromInterestList,
  fetchInterestList,
} from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import { Carer } from "../types/client-ui.types";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Heart, User } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const SafeImage = ({
  src,
  alt,
  fallback,
  className,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  if (errorMsg || !src) return <>{fallback}</>;

  const cleanSrc = src.trim();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const imageSrc = cleanSrc.startsWith("http")
    ? cleanSrc
    : `${API_BASE_URL}${cleanSrc.startsWith("/") ? "" : "/"}${cleanSrc}`;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className || ""}`}
      onError={(e) => {
        setErrorMsg("Failed to load");
      }}
    />
  );
};

interface CarerProfilesProps {
  carers: Carer[];
}

export default function CarerProfiles({ carers }: CarerProfilesProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { interestList } = useAppSelector((state) => state.client);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCarers());
    dispatch(fetchInterestList());
  }, [dispatch]);

  const handleWishlistToggle = async (carer: Carer) => {
    const isWishlisted = interestList.some((w: Carer) => w.id === carer.id);

    if (!isWishlisted && interestList.length >= 8) {
      showErrorToast(
        "Limit Reached",
        "Maximum 8 carers allowed in Interest List.",
      );
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
          Browse profiles verified by Grace & Goodwill. You can save them to
          your Interest List.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {carers.map((carer) => {
          const isWishlisted = interestList.some(
            (w: Carer) => w.id === carer.id,
          );
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
                  <div
                    className={`relative h-16 w-16 rounded-full border-2 shrink-0 shadow-soft overflow-hidden bg-navy-950 ${!carer.profilePhotoUrl ? carer.avatarBg : "border-gold-300/20"}`}
                  >
                    {carer.profilePhotoUrl ? (
                      <SafeImage
                        src={carer.profilePhotoUrl}
                        alt={carer.name}
                        fallback={
                          <div
                            className={`h-full w-full flex items-center justify-center text-2xl font-bold ${carer.avatarBg}`}
                          >
                            {carer.name
                              .split(" ")
                              .map((n) => n.charAt(0))
                              .join("")}
                          </div>
                        }
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full flex items-center justify-center text-2xl font-bold ${carer.avatarBg}`}
                      >
                        {carer.name
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                      </div>
                    )}
                  </div>


                </div>

                <div>
                  <h4 className="text-lg font-bold text-gold-50">
                    {carer.name}
                  </h4>
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
                  onClick={() => handleWishlistToggle(carer)}
                  variant={isWishlisted ? "outline" : "primary"}
                  size="sm"
                  fullWidth
                  disabled={isProcessing || (!isWishlisted && isMaxReached)}
                  className={
                    isWishlisted
                      ? "!border-gold-300/30 !text-gold-200 hover:!bg-gold-300/10"
                      : ""
                  }
                >
                  <Heart
                    className={`w-3 h-3 mr-2 ${isWishlisted ? "fill-gold-200" : ""}`}
                  />
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
