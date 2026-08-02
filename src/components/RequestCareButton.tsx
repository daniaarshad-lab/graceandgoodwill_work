import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const CareHeartIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Heart */}
    <path
      d="M12 13c-2-2-4-3.5-4-5.5a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1 7 0c0 2-2 3.5-4 5.5l-3 3-3-3z"
      transform="scale(0.85) translate(2, 0)"
    />

    {/* Left Hand */}
    <path d="M5 14c-1.5 1-2.5 2.5-2.5 4 0 1.5 1 2 2.5 2h3c1.5 0 2.5-.5 3.5-1.5l1.5-2" />
    <path d="M5 17c1.5-1 3-1.5 4.5-1.5" />

    {/* Right Hand */}
    <path d="M19 14c1.5 1 2.5 2.5 2.5 4 0 1.5-1 2-2.5 2h-3c-1.5 0-2.5-.5-3.5-1.5l-1.5-2" />
    <path d="M19 17c-1.5-1-3-1.5-4.5-1.5" />
  </svg>
);

interface RequestCareButtonProps {
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  className?: string;
}

export default function RequestCareButton({
  href = "/contact",
  onClick,
  className = "",
}: RequestCareButtonProps) {
  const wrapperClasses = `relative ${className || "w-full sm:w-max"} shrink-0`;
  const buttonClasses = `group relative flex items-center justify-between h-14 px-6 rounded-full border border-[#8a7242]/50 bg-gradient-to-r from-[#594627] to-[#3d3119] w-full shrink-0 shadow-md transition-all duration-300 hover:shadow-lg hover:border-[#8a7242]/80`;

  const content = (
    <>
      <div className="flex items-center gap-4 text-left z-10">
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(247,215,116,0.15)_0%,_transparent_70%)] blur-sm"></div>
          <CareHeartIcon className="w-5 h-5 text-[#F7D774] relative z-10 drop-shadow-sm" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[#FDF2D5] font-semibold text-[15px] leading-snug tracking-wide drop-shadow-sm whitespace-nowrap">
            Request Care
          </span>
          <span className="text-[#FDF2D5]/70 font-medium text-[11px] leading-snug whitespace-nowrap">
            Planned care and support
          </span>
        </div>
      </div>
      <ChevronRight
        strokeWidth={2.5}
        className="text-[#8a7242] w-5 h-5 ml-4 transition-transform duration-300 group-hover:translate-x-1 z-10 drop-shadow-sm"
      />
    </>
  );

  if (onClick) {
    return (
      <div className={wrapperClasses}>
        <button type="button" onClick={onClick} className={buttonClasses}>
          {content}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    </div>
  );
}
