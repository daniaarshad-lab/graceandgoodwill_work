import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  text,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gold-muted text-navy-950 hover:bg-[#b8915e] disabled:hover:bg-gold-muted",
    secondary:
      "bg-secondary text-secondary-foreground hover:opacity-90 disabled:hover:opacity-50",
    outline:
      "border border-gold-muted text-gold-muted hover:bg-gold-muted/10 disabled:hover:bg-transparent",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 w-full",
    lg: "px-6 py-4 text-lg w-full",
  };

  return (
    <button
      type="submit"
      {...props}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
    >
      {text}
    </button>
  );
}
