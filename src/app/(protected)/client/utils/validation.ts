export function validateCareForm(data: {
  fullName: string;
  email: string;
  phone: string;
  careType: string[];
  support: string;
  startDate: string;
  duration: string;
  address: string;
  isOngoing?: boolean;
}) {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number (7-15 digits).";
  }

  if (!data.careType || data.careType.length === 0) {
    errors.careType = "Care type is required.";
  }

  if (!data.support.trim()) {
    errors.support = "Please describe the required support.";
  } else if (data.support.trim().length < 10) {
    errors.support = "Description must be at least 10 characters.";
  }

  if (!data.startDate) {
    errors.startDate = "Preferred start date is required.";
  } else {
    const selectedDate = new Date(data.startDate);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.startDate = "Start date cannot be in the past.";
    }
  }

  if (!data.isOngoing) {
    if (!data.duration.trim()) {
      errors.duration = "Please specify the end date of care.";
    } else if (data.startDate && data.duration) {
      const start = new Date(data.startDate);
      const end = new Date(data.duration);
      
      // Calculate difference in time (milliseconds)
      const diffTime = end.getTime() - start.getTime();
      
      // Calculate difference in days
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      if (diffDays < 2) {
        errors.duration = "Care duration must be at least 2 days.";
      }
    }
  }

  if (!data.address.trim()) {
    errors.address = "Physical care address is required.";
  }

  return errors;
}

export function validateEnquiryForm(data: {
  subject: string;
  message: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.subject.trim()) {
    errors.subject = "Subject is required.";
  } else if (data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }

  if (!data.message.trim()) {
    errors.message = "Message details are required.";
  } else if (data.message.trim().length < 15) {
    errors.message = "Message must be at least 15 characters.";
  }

  return errors;
}

export function scrollToFirstError() {
  setTimeout(() => {
    const firstErrorElement = document.querySelector(".text-red-500, .border-red-500");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
}
