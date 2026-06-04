import { WeeklyAvailability } from "../types/carer.types";

export function validateProfileForm(data: {
  experience: string;
  bio: string;
  address: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.experience.trim()) {
    errors.experience = "Experience is required.";
  } else if (!/^\d+$/.test(data.experience.trim())) {
    errors.experience = "Experience must contain numeric years only.";
  }

  if (!data.bio.trim()) {
    errors.bio = "Biographical summary is required.";
  } else if (data.bio.trim().length < 20) {
    errors.bio = "Biographical summary must be at least 20 characters.";
  } else if (data.bio.trim().length > 500) {
    errors.bio = "Biographical summary cannot exceed 500 characters.";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required.";
  }

  return errors;
}

export function validateAvailabilitySchedule(availability: WeeklyAvailability) {
  let isSchedulePopulated = false;
  for (const day of Object.keys(availability)) {
    const dayData = availability[day];
    if (dayData.enabled) {
      if (
        dayData.shifts.morning ||
        dayData.shifts.afternoon ||
        dayData.shifts.night
      ) {
        isSchedulePopulated = true;
        break;
      }
    }
  }
  return isSchedulePopulated;
}
