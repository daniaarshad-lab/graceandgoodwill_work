import { ReactNode, CSSProperties } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function SectionCard({
  children,
  className = "",
  style,
}: SectionCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md transition-all duration-300 hover:border-gold-300/20 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
