"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

interface PortalHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
}

export default function PortalHeader({
  firstName,
  lastName,
  email,
  phone,
  profilePhoto,
}: PortalHeaderProps) {
  const profile = useAppSelector((state) => state.carer.profile);

  const currentPhoto = profile?.profilePhotoUrl || profilePhoto;

  const getPhotoUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${apiUrl}${url}`;
  };
  return (
    <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-4 sm:p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <div className="relative group block">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT shadow-soft">
            {currentPhoto ? (
              <img
                src={getPhotoUrl(currentPhoto)}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              `${firstName.charAt(0)}${lastName.charAt(0)}`
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold-300 truncate">
            Carer Dashboard
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-50 mt-1 leading-tight truncate">
            {firstName} {lastName}
          </h1>
          <p className="text-xs sm:text-sm text-gold-100/60 mt-1 hidden sm:block truncate">
            {email} • {phone}
          </p>
          <div className="sm:hidden mt-1 space-y-0.5">
            <p className="text-[10px] text-gold-100/60 truncate">{email}</p>
            <p className="text-[10px] text-gold-100/60 truncate">{phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
