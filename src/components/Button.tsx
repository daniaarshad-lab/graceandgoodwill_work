import React, { ButtonHTMLAttributes } from "react";
import { Phone, ArrowRight } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "navy"
    | "gold"
    | "goldDarker"
    | "whatsapp"
    | "ghost-gold"
    | "danger"
    | "selectable"
    | "goldBrown";
  isSelected?: boolean;
  size?: "sm" | "md" | "lg" | "custom";
  asChild?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

function Button({
  text,
  variant = "primary",
  size = "md",
  isSelected = false,
  disabled,
  className = "",
  style,
  asChild = false,
  fullWidth = size !== "sm" && size !== "custom",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold shadow-none translate-y-0 " +
    "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform outline-none cursor-pointer " +
    "focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-navy-950 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:translate-y-0 disabled:shadow-none";

  const variants = {
    primary:
      "bg-[#b59469] text-navy-950 hover:bg-[#b59469] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] active:translate-y-0 active:shadow-none",
    secondary:
      "bg-navy-900/90 border border-gold-muted/40 text-gold-100 hover:bg-gold-muted/15 hover:border-gold-muted/65 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(160,128,84,0.14)] active:translate-y-0 active:shadow-none",
    outline:
      "border border-gold-muted text-gold-200 hover:bg-gold-muted/10 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(160,128,84,0.12)] active:translate-y-0 active:shadow-none",
    navy: "bg-navy-900 text-gold-100 border border-gold-muted/30 hover:bg-navy-800 hover:border-gold-muted/50 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(15,26,51,0.3)] active:translate-y-0 active:shadow-none",
    gold: "bg-transparent text-gold-100 border-2 border-gold-muted hover:bg-gold-muted hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.2)] active:translate-y-0 active:shadow-none",
    goldDarker:
      "bg-gold-darker text-white border-2 border-[#a08054] hover:bg-[#a08054] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.2)] active:translate-y-0 active:shadow-none",
    whatsapp:
      "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)] active:translate-y-0 active:shadow-none",
    "ghost-gold":
      "border border-gold-muted/45 bg-navy-950/40 text-gold-200 hover:border-gold-muted/70 hover:bg-gold-muted/10 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(160,128,84,0.12)] active:translate-y-0 active:shadow-none",
    danger:
      "bg-red-600 text-white border border-red-600 hover:bg-red-500 hover:border-red-500 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(220,38,38,0.2)] active:translate-y-0 active:shadow-none",
    selectable: isSelected
      ? "bg-gold-muted/15 border-2 border-gold-muted text-gold-200 shadow-[0_0_15px_rgba(160,128,84,0.18)] hover:bg-gold-muted/25 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(160,128,84,0.22)] active:translate-y-0 active:shadow-none"
      : "bg-navy-900/40 border border-gold-muted/30 text-gold-200/60 hover:bg-gold-muted/10 hover:border-gold-muted/50 hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(160,128,84,0.12)] active:translate-y-0 active:shadow-none",
    goldBrown:
      "bg-[#d4a047] text-white border-2 border-[#7b4806] hover:bg-[#9c661c] hover:border-[#6b420e] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(140,87,19,0.25)] active:translate-y-0 active:shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
    custom: "",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className:
        `${combinedClassName} ${children.props.className || ""}`.trim(),
      style: { ...style, ...children.props.style },
      ...props,
    } as any);
  }

  return (
    <button
      type={props.type || "button"}
      disabled={disabled}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {text || children}
    </button>
  );
}

export default React.memo(Button);

export function CallUsButton({ href = "tel:02045240108", phoneNumber = "020 4524 0108", className = "" }: { href?: string, phoneNumber?: string, className?: string }) {
  return (
    <a
      href={href}
      className={`flex items-center w-full rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] ${className}`}
      style={{ backgroundColor: "#0d1b3e", height: "48px" }}
    >
      <span
        className="flex items-center justify-center w-12 h-full shrink-0"
        style={{ backgroundColor: "#162248" }}
      >
        <Phone className="w-5 h-5" style={{ color: "#c8a96e" }} />
      </span>
      <span
        className="w-px self-stretch"
        style={{ backgroundColor: "#ffffff18" }}
      />
      <span className="flex-1 px-4 text-left">
        <span className="block text-sm font-bold" style={{ color: "#f0e8d5" }}>
          Call Us
        </span>
        <span className="block text-xs" style={{ color: "#8a9ab8" }}>
          {phoneNumber}
        </span>
      </span>
      <span className="pr-4">
        <ArrowRight className="w-4 h-4" style={{ color: "#8a9ab8" }} />
      </span>
    </a>
  );
}

export function WhatsAppButton({ href = "https://wa.me/447462931949", phoneNumber = "+44 7462 931949", className = "" }: { href?: string, phoneNumber?: string, className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center w-full rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] ${className}`}
      style={{ backgroundColor: "#1a6641", height: "48px" }}
    >
      <span
        className="flex items-center justify-center w-12 h-full shrink-0"
        style={{ backgroundColor: "#155535" }}
      >
        <WhatsAppIcon className="w-5 h-5" style={{ color: "#ffffff" }} />
      </span>
      <span
        className="w-px self-stretch"
        style={{ backgroundColor: "#ffffff18" }}
      />
      <span className="flex-1 px-4 text-left">
        <span className="block text-sm font-bold" style={{ color: "#ffffff" }}>
          WhatsApp Us
        </span>
        <span className="block text-xs" style={{ color: "#a8d8b8" }}>
          {phoneNumber}
        </span>
      </span>
      <span className="pr-4">
        <ArrowRight className="w-4 h-4" style={{ color: "#a8d8b8" }} />
      </span>
    </a>
  );
}

export function EnquiryButton({ href = "mailto:hello@graceandgoodwill.co.uk", email = "hello@graceandgoodwill.co.uk", className = "" }: { href?: string, email?: string, className?: string }) {
  return (
    <a
      href={href}
      className={`flex items-center w-full rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] ${className}`}
      style={{ backgroundColor: "#c8a96e", height: "48px" }}
    >
      <span
        className="flex items-center justify-center w-12 h-full shrink-0"
        style={{ backgroundColor: "#b8954e" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#ffffff" strokeWidth={2}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span
        className="w-px self-stretch"
        style={{ backgroundColor: "#ffffff28" }}
      />
      <span className="flex-1 px-4 text-left">
        <span className="block text-sm font-bold" style={{ color: "#ffffff" }}>
          Make an Enquiry
        </span>
      </span>
      <span className="pr-4">
        <ArrowRight className="w-4 h-4" style={{ color: "#ffffff" }} />
      </span>
    </a>
  );
}
