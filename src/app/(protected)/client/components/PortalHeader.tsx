"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { uploadClientProfilePhoto } from "@/store/slices/clientSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface PortalHeaderProps {
  user: any;
}

export default function PortalHeader({ user }: PortalHeaderProps) {
  const [imgError, setImgError] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.client.profile);

  const displayUser = profile?.user ?? user;
  const profilePhotoUrl =
    profile?.profilePhotoUrl ||
    user?.clientProfile?.profilePhotoUrl ||
    "";

  const getPhotoUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${apiUrl}${url}`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    setImgError(false);

    try {
      await dispatch(uploadClientProfilePhoto(file)).unwrap();
      showSuccessToast(
        "Photo Uploaded",
        "Profile photo uploaded successfully.",
      );
    } catch (err: any) {
      showErrorToast("Upload Failed", err || "Failed to upload photo");
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  const initials = `${displayUser?.firstName?.charAt(0) || "C"}${displayUser?.lastName?.charAt(0) || "P"}`;

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <label className="relative group cursor-pointer block">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT transition-transform duration-300 group-hover:scale-105 shadow-soft">
            {profilePhotoUrl && !imgError ? (
              <Image
                src={getPhotoUrl(profilePhotoUrl)}
                alt={`${displayUser?.firstName || "Client"} Profile`}
                fill
                sizes="(max-width: 640px) 96px, 112px"
                quality={100}
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{initials}</span>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            {/* Uploading Spinner */}
            {photoUploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={photoUploading}
          />
        </label>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">
            Family & Client Portal
          </p>

          <h1 className="text-3xl text-gold-50 mt-1">
            Welcome back, {displayUser?.firstName || "Family"}{" "}
            {displayUser?.lastName || ""}
          </h1>

          <p className="body-small text-gold-100/60 mt-1">
            {displayUser?.email}
          </p>
        </div>
      </div>
    </section>
  );
}
