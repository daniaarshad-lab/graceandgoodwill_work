import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = "",
}: ToggleProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none ${
          disabled
            ? "opacity-40 cursor-not-allowed " +
              (checked
                ? "bg-gold-muted border-gold-muted/50"
                : "bg-navy-900 border-gold-muted/20")
            : checked
              ? "bg-gold-muted border-gold-muted/80 shadow-[0_0_15px_rgba(160,128,84,0.18)] hover:bg-[#b59469] hover:border-gold-muted hover:shadow-[0_0_20px_rgba(160,128,84,0.3)]"
              : "bg-navy-900 border-gold-muted/40 hover:border-gold-muted/70 hover:bg-navy-950/80"
        } focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-navy-950`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            checked
              ? "translate-x-5 " + (disabled ? "bg-navy-900" : "bg-navy-950")
              : "translate-x-0 " +
                (disabled ? "bg-gold-300/60" : "bg-gold-200 hover:bg-gold-100")
          }`}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-gold-50">{label}</span>
          )}
          {description && (
            <span className="text-xs text-gold-100/40">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
