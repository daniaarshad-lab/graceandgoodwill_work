import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { showErrorToast } from "@/utils/toast";

/**
 * Redux middleware that listens for rejected thunk actions
 * and displays a global error toast.
 */
export const toastMiddleware: Middleware =
  () => (next) => (action: any) => {
    // RTK Query or AsyncThunk rejection
    if (isRejectedWithValue(action)) {
      if (!action.meta?.arg?.skipGlobalToast) {
        const errorMsg =
          typeof action.payload === "string"
            ? action.payload
            : action.error?.message || "An unexpected error occurred.";
            
        showErrorToast(errorMsg);
      }
    }

    return next(action);
  };
