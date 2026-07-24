"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  type,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>

      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`w-full rounded-xl border py-3 outline-none focus:ring-2 focus:ring-primary ${
            isPassword ? "pl-4 pr-12" : "px-4"
          } ${error ? "border-red-500" : "border-gray-300"} ${className}`}
        />

        {isPassword && (
          <div
            role="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center cursor-pointer select-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowPassword(!showPassword);
              }
            }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Eye className="w-5 h-5" strokeWidth={1.5} />
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="form-help text-red-500">{error}</p>
      ) : helperText ? (
        <p className="form-help text-gold-200/50 text-[12px] pl-1">{helperText}</p>
      ) : null}
    </div>
  );
}
