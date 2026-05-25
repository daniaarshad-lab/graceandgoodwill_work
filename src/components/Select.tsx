import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <select
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
