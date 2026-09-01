import React from "react";
import ThinSpinner from "@/components/ThinSpinner";

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
}

export default function FullScreenLoader({
  isVisible,
  message = "Saving your information...",
}: FullScreenLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full text-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <ThinSpinner size="xl" text={message} />
        <div className="space-y-1 mt-2">
          <p className="text-sm text-gold-100/60">
            Please wait while we process your details.
          </p>
          <p className="text-sm text-gold-100/60">
            Do not refresh or close this page.
          </p>
        </div>
      </div>
    </div>
  );
}
