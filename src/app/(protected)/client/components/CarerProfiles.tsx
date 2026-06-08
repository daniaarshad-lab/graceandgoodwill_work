import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchCarers } from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import { Carer } from "../types/client-ui.types";
import Button from "@/components/Button";

interface CarerProfilesProps {
  carers: Carer[];
  onRequestIntro: (carer: Carer) => void;
}

export default function CarerProfiles({
  carers,
  onRequestIntro,
}: CarerProfilesProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Pre-screened Carers Index
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Browse profiles verified by Grace & Goodwill. You can request
          introductions directly below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {carers.map((carer) => (
          <SectionCard
            key={carer.id}
            className="flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Avatar & Availability Badge */}
              <div className="flex justify-between items-start">
                <div
                  className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold shrink-0 shadow-soft ${carer.avatarBg}`}
                >
                  {carer.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
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
            </div>

            <Button
              onClick={() => onRequestIntro(carer)}
              variant="secondary"
              size="sm"
              fullWidth
            >
              Request Introduction
            </Button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
