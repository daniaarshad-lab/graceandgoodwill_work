import { WeeklyAvailability } from "../types/carer.types";

export function validateProfileForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  bio: string;
  address: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else {
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

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
