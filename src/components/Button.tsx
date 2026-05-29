import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "secondary" | "outline" | "navy" | "gold" | "whatsapp";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  text,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  style,
  asChild = false,
  fullWidth = size !== "sm",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-out transform outline-none cursor-pointer " +
    "focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-navy-950 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:translate-y-0 disabled:shadow-none";

  const variants = {
    primary:
      "bg-gold-muted text-navy-950 hover:bg-[#b59469] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] active:translate-y-0 active:shadow-none",
    secondary:
      "bg-navy-950/40 border border-gold-muted/20 text-[#fde6c4] hover:bg-gold-muted/10 hover:border-gold-muted/40 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(160,128,84,0.10)] active:translate-y-0 active:shadow-none",
    outline:
      "border border-gold-muted text-gold-muted hover:bg-gold-muted/10 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(160,128,84,0.12)] active:translate-y-0 active:shadow-none",
    navy:
      "bg-[#0f1a33] text-white border border-[#0f1a33] hover:bg-navy-800 hover:border-navy-800 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,26,51,0.3)] active:translate-y-0 active:shadow-none",
    gold:
      "bg-transparent text-white border-2 border-gold-muted hover:bg-gold-muted hover:border-gold-muted hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(160,128,84,0.2)] active:translate-y-0 active:shadow-none",
    whatsapp:
      "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)] active:translate-y-0 active:shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${combinedClassName} ${children.props.className || ""}`.trim(),
      style: { ...style, ...children.props.style },
      ...props,
    } as any);
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {text || children}
    </button>
  );
}
