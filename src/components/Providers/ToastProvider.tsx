"use client";

import { Toaster, toast } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      expand={true}
      style={{ zIndex: 999999 }}
    />
  );
}
