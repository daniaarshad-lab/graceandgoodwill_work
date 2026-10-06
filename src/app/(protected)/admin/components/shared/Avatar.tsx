"use client";

import React, { useState } from "react";

interface AvatarProps {
  src?: string | null;
  name: string;
  sizeClassName?: string;
  className?: string;
}

export default function Avatar({
  src,
  name,
  sizeClassName = "h-8 w-8",
  className = "",
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || "U")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const cleanSrc = src?.trim();
  const showImage = Boolean(cleanSrc && !hasError);

  return (
    <div
      className={`${sizeClassName} rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shrink-0 font-bold text-xs uppercase overflow-hidden select-none ${className}`}
    >
      {showImage ? (
        <img
          src={cleanSrc}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
