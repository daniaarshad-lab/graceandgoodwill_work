import { Carer } from "@/app/(protected)/client/types/client-ui.types";
import { formatDateArrayToRanges } from "@/utils/dateRangeFormatter";

export const mapCarerProfileToUICarer = (carer: any): Carer => {
  const city = carer.city || (carer as any).postcode ? carer.city : "";
  const postcode = carer.postcode || "";
  const locationParts = [city, postcode].filter(Boolean);
  const location =
    locationParts.length > 0 ? locationParts.join(", ") : undefined;

  const availabilityVal = carer.availability;
  let availabilityStatus: "Available" | "Limited Availability" | "Unavailable" =
    "Limited Availability";
  if (availabilityVal === "AVAILABLE" || availabilityVal === "Available") {
    availabilityStatus = "Available";
  } else if (
    availabilityVal === "UNAVAILABLE" ||
    availabilityVal === "Unavailable"
  ) {
    availabilityStatus = "Unavailable";
  } else if (Array.isArray(availabilityVal) && availabilityVal.length > 0) {
    availabilityStatus = "Available";
  }

  return {
    id: carer.id,
    name: `${carer.firstName || carer.user?.firstName || "Profile information pending"} ${carer.lastName || carer.user?.lastName || ""}`.trim(),
    experience:
      carer.experienceYears !== undefined && carer.experienceYears !== null
        ? `${carer.experienceYears} Years`
        : "Profile information pending",
    specialties:
      Array.isArray(carer.careSpecialties) && carer.careSpecialties.length > 0
        ? carer.careSpecialties.join(", ")
        : typeof carer.careSpecialties === "string" &&
            carer.careSpecialties.trim() !== ""
          ? carer.careSpecialties
          : "Profile information pending",
    availability: availabilityStatus,
    bio: carer.bio || "Profile information pending",
    avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    introVideoUrl: carer.introVideoUrl || null,
    location: location || "Location pending",
    qualifications: carer.qualifications || "Profile information pending",
    profilePhotoUrl: (() => {
      const url =
        carer.profilePhotoUrl ||
        carer.user?.profilePhotoUrl ||
        carer.publicProfile?.profilePhotoUrl ||
        carer.publicProfile?.photoUrl ||
        carer.photoUrl ||
        null;
      if (typeof url === "string") {
        return url
          .replace("gracoanddoodwill", "graceanddoodwill")
          .replace("graceandgoodwill", "graceanddoodwill");
      }
      return url;
    })(),
    fullBiography: carer.summary || "Profile information pending",
    experienceDetails:
      carer.experience || carer.summary || "Profile information pending",
    availabilityDetails: Array.isArray(carer.availability)
      ? formatDateArrayToRanges(carer.availability)
      : typeof carer.availability === "string"
        ? [carer.availability]
        : [],
    rawAvailability: Array.isArray(carer.availability)
      ? carer.availability
      : [],
    email: carer.email || "",
    phone: carer.phone || "",
    address:
      [carer.address, carer.city, carer.postcode || carer.pincode]
        .filter(Boolean)
        .join(", ") || "",
    feedbacks: Array.isArray(carer.feedbacks) ? carer.feedbacks : [],
    canDrive: !!carer.canDrive,
    drivingPreferences: Array.isArray(carer.drivingPreferences) ? carer.drivingPreferences : [],
  };
};
