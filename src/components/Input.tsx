import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
