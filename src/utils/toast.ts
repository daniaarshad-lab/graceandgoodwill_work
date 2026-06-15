"use client";

import { toast } from "sonner";

const safeString = (val: any) => {
  if (val instanceof Error) return val.message;
  if (typeof val === 'object' && val !== null) return JSON.stringify(val);
  return String(val);
};

export const showSuccessToast = (message: string, description?: any) => {
  toast.success(safeString(message), {
    description: description ? safeString(description) : undefined,
  });
};

export const showErrorToast = (message: string, description?: any) => {
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
