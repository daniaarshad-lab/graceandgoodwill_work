import React from "react";
import ThinSpinner from "@/components/ThinSpinner";

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
  isOverlay?: boolean;
}

export default function FullScreenLoader({
  isVisible,
  message = "Saving your information...",
  isOverlay = false,
}: FullScreenLoaderProps) {
  if (!isVisible) return null;

  if (isOverlay) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200">
        <div className="flex flex-col items-center space-y-4 text-center">
          <ThinSpinner size="xl" text={message} />
          <div className="space-y-1 mt-2">
            <p className="text-sm text-gold-100/80 font-medium">
              Please wait while we upload and process your document.
            </p>
            <p className="text-xs text-gold-100/50">
              Do not refresh or close this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
