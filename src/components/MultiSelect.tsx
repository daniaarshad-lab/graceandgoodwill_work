import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
  placeholder?: string;
}

export default function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  error,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const getOptionLabel = (val: string) => {
    return options.find((opt) => opt.value === val)?.label || val;
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="form-label">{label}</label>

      <div
        className={`w-full rounded-xl border outline-none flex items-center cursor-pointer transition-all focus-within:ring-2 focus-within:ring-gold ${
          error ? "border-red-500" : "border-gray-300"
        } h-[50px] bg-transparent`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <div className="flex-1 flex flex-wrap items-center content-center gap-1.5 px-4 h-full overflow-y-auto py-1.5 custom-scrollbar">
          {value.length === 0 && (
            <span className="text-gray-400 select-none text-sm">{placeholder}</span>
          )}
          
          {value.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 text-gold-600 dark:text-gold-200 text-xs font-semibold border border-gold/20 whitespace-nowrap shrink-0"
            >
              {getOptionLabel(val)}
              <button
                type="button"
                onClick={(e) => removeOption(e, val)}
                className="hover:bg-gold/20 rounded-full p-0.5 transition-colors focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="pr-4 pl-2 flex items-center h-full">
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            if (option.value === "") return null;
            return (
              <div
                key={option.value}
                className={`px-4 py-2.5 cursor-pointer hover:bg-gold/10 flex items-center gap-3 transition-colors ${
                  isSelected ? "bg-gold/5" : ""
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? "bg-gold border-gold" : "border-gray-300 dark:border-gray-600"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${isSelected ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="form-help text-red-500">{error}</p>}
    </div>
  );
}
