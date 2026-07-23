import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div className={`border rounded-2xl p-6 shadow-sm bg-card ${className}`}>
      {children}
    </div>
  );
}
