"use client";

import { toast } from "sonner";

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
  });
};