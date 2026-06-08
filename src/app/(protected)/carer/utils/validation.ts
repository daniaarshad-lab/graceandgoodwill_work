import { WeeklyAvailability } from "../types/carer.types";

export function validateProfileForm(_data: {
  experience: string;
  bio: string;
  address: string;
}) {
  return {};
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
