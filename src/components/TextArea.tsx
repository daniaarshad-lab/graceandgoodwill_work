"use client";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
}

export default function TextArea({
  label,
  error,
  helperText,
  className = "",
  rows = 5,
  ...props
}: TextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>

      <div className="relative">
        <textarea
          {...props}
          rows={rows}
          className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
            error ? "border-red-500" : "border-gold-muted/20"
          } ${className}`}
        />
      </div>

      {error ? (
        <p className="form-help text-red-500 mt-1 text-[10px] font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p className="form-help text-gold-200/50 text-[12px] pl-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
