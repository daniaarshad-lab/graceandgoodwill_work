import { CarerProfile } from "@/types/client.types";
import { Carer } from "@/app/(protected)/client/types/client-ui.types";

export const mapCarerProfileToUICarer = (carer: CarerProfile): Carer => {
  return {
    id: carer.id,
    name: `${carer.firstName || "Not Provided"} ${carer.lastName || ""}`.trim(),
    experience: carer.experienceYears
      ? `${carer.experienceYears} Years`
      : "Not Provided",
    specialties:
      carer.careSpecialties && carer.careSpecialties.length > 0
        ? carer.careSpecialties.join(", ")
        : "No Specialties Available",
    availability:
      carer.availability === "AVAILABLE" ? "Available" : "Limited Availability",
    bio: carer.summary || carer.bio || "Not Provided",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    introVideoUrl: carer.introVideoUrl || null,
  };
};
