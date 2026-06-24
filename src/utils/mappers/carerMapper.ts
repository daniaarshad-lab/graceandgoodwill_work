import { CarerProfile } from "@/types/client.types";
import { Carer } from "@/app/(protected)/client/types/client-ui.types";

export const mapCarerProfileToUICarer = (carer: any): Carer => {
  const city = carer.city || (carer as any).postcode ? carer.city : "";
  const postcode = carer.postcode || "";
  const locationParts = [city, postcode].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(", ") : undefined;

  const availabilityVal = carer.availability;
  let availabilityStatus: "Available" | "Limited Availability" | "Unavailable" = "Limited Availability";
  if (availabilityVal === "AVAILABLE" || availabilityVal === "Available") {
    availabilityStatus = "Available";
  } else if (availabilityVal === "UNAVAILABLE" || availabilityVal === "Unavailable") {
    availabilityStatus = "Unavailable";
  }

  return {
    id: carer.id,
    name: `${carer.firstName || carer.user?.firstName || "Profile information pending"} ${carer.lastName || carer.user?.lastName || ""}`.trim(),
    experience: carer.experienceYears
      ? `${carer.experienceYears} Years`
      : "Profile information pending",
    specialties: Array.isArray(carer.careSpecialties) && carer.careSpecialties.length > 0
      ? carer.careSpecialties.join(", ")
      : typeof carer.careSpecialties === "string" && carer.careSpecialties.trim() !== ""
        ? carer.careSpecialties
        : "Profile information pending",
    availability: availabilityStatus,
    bio: carer.summary || carer.bio || "Profile information pending",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    introVideoUrl: carer.introVideoUrl || null,
    location: location || "Location pending",
    qualifications: carer.qualifications || "Profile information pending",
    profilePhotoUrl: carer.profilePhotoUrl || null,
    fullBiography: carer.bio || carer.summary || "Profile information pending",
    experienceDetails: carer.experience || carer.summary || "Profile information pending",
    availabilityDetails: Array.isArray(carer.availability)
      ? carer.availability
      : typeof carer.availability === "string"
        ? [carer.availability]
        : [],
  };
};
