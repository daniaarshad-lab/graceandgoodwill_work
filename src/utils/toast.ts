"use client";

import { toast } from "sonner";

const safeString = (val: any) => {
  if (val instanceof Error) return val.message;
  if (typeof val === "object" && val !== null) return JSON.stringify(val);
  return String(val);
};

let lastToast: {
  message: string;
  description?: string;
  timestamp: number;
} | null = null;

const isDuplicateError = (message: string, description?: any): boolean => {
  if (!lastToast) return false;

  const now = Date.now();
  if (now - lastToast.timestamp > 1000) return false;

  const msg1 = safeString(message).trim();
  const desc1 = description ? safeString(description).trim() : "";
  const msg2 = lastToast.message.trim();
  const desc2 = lastToast.description ? lastToast.description.trim() : "";

  // Guard: If both errors have descriptions and they are different, they are not duplicates.
  // E.g., "Validation Error" (Full Name required) vs "Validation Error" (DOB required)
  if (desc1 && desc2 && desc1 !== desc2) {
    return false;
  }

  // 1. Exact matches of messages or descriptions crossing over
  if (msg1 === msg2 && desc1 === desc2) return true;
  if (desc1 && desc1 === msg2) return true;
  if (msg1 && msg1 === desc2) return true;

  // 2. Generic prefix / wrapper check
  // E.g., Middleware shows "Invalid credentials"
  // Component catch block shows "Login Failed: Invalid credentials"
  if (msg1 !== msg2 && (msg1.includes(msg2) || msg2.includes(msg1))) {
    const genericPrefixes = [
      "error",
      "failed",
      "failure",
      "validationerror",
      "unableto",
      "somethingwentwrong",
    ];
    const diff =
      msg1.length > msg2.length
        ? msg1.replace(msg2, "").toLowerCase()
        : msg2.replace(msg1, "").toLowerCase();

    const cleanDiff = diff.replace(/[^a-z]/g, "").trim();
    if (
      cleanDiff === "" ||
      genericPrefixes.some(
        (prefix) => prefix.includes(cleanDiff) || cleanDiff.includes(prefix),
      )
    ) {
      return true;
    }
  }

  return false;
};

export const showSuccessToast = (message: string, description?: any) => {
  toast.success(safeString(message), {
    description: description ? safeString(description) : undefined,
  });
};

export const showErrorToast = (message: string, description?: any) => {
  if (isDuplicateError(message, description)) {
    return;
  }

  lastToast = {
    message: safeString(message),
    description: description ? safeString(description) : undefined,
    timestamp: Date.now(),
  };

  toast.error(safeString(message), {
    description: description ? safeString(description) : undefined,
  });
};

export const showWarningToast = (message: string, description?: any) => {
  toast.warning(safeString(message), {
    description: description ? safeString(description) : undefined,
  });
};

export const showInfoToast = (message: string, description?: any) => {
  toast.info(safeString(message), {
    description: description ? safeString(description) : undefined,
  });
};
