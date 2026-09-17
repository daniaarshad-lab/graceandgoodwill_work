import React from "react";

export interface ThinSpinnerProps {
  /** Size variant of the spinner ring */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Optional loading text displayed below or next to the spinner */
  text?: string;
  /** Whether to render as a full-screen or full-container centered overlay */
  fullScreen?: boolean;
  /** Optional custom class name for the wrapper */
  className?: string;
  /** Optional custom class name for the spinner ring */
  spinnerClassName?: string;
  /** Optional custom class name for the text */
  textClassName?: string;
}

const sizeClasses: Record<NonNullable<ThinSpinnerProps["size"]>, string> = {
  xs: "h-4 w-4 border-b-2",
  sm: "h-6 w-6 border-b-2",
  md: "h-8 w-8 border-b-2",
  lg: "h-10 w-10 border-b-2",
  xl: "h-12 w-12 border-b-2",
};

export default function ThinSpinner({
  size = "xl",
  text,
  fullScreen = false,
  className = "",
  spinnerClassName = "",
  textClassName = "",
}: ThinSpinnerProps) {
  const spinnerElement = (
    <span
      className={`animate-spin rounded-full border-gold-DEFAULT inline-block ${sizeClasses[size]} ${spinnerClassName}`}
    />
  );

  const content = (
    <span className={`flex flex-col items-center space-y-4 ${className}`}>
      {spinnerElement}
      {text && (
        <span
          className={`text-sm tracking-wider text-gold-200 block ${textClassName}`}
        >
          {text}
        </span>
      )}
    </span>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-gold-100 p-4">
        {content}
      </div>
    );
  }

  return content;
}
