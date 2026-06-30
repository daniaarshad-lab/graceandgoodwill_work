export function validateCareForm(data: {
  fullName: string;
  email: string;
  phone: string;
  careType: string[];
  support: string;
  startDate: string;
  duration: string;
  address: string;
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
  }

  if (!data.duration.trim()) {
    errors.duration = "Please specify the duration of care.";
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
