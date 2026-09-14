import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>

      <select
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="form-help text-red-500">{error}</p>}
    </div>
  );
}
