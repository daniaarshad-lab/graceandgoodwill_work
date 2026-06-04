import { ChangeEvent } from "react";
import Image from "next/image";

interface UploadPhotoSectionProps {
  profilePhoto: string | null;
  photoUploading: boolean;
  photoProgress: number;
  photoError: string | null;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadPhotoSection({
  profilePhoto,
  photoUploading,
  photoProgress,
  photoError,
  handlePhotoChange,
}: UploadPhotoSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-gold-300/10 bg-navy-950/30">
      <div className="relative group">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT shadow-soft">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt="Profile Avatar"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            "AM"
          )}
        </div>

        {photoUploading && (
          <div className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
            <span className="text-[9px] text-gold-DEFAULT mt-1">
              {photoProgress}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 flex-grow text-center sm:text-left">
        <h4 className="text-sm font-semibold text-gold-50">Profile Picture</h4>
        <p className="text-xs text-gold-100/50">
          Upload a professional high-resolution headshot. Supports JPEG, PNG
          formats.
        </p>
        {photoError && (
          <p className="text-xs text-red-500 font-medium">{photoError}</p>
        )}
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/20 transition-all duration-300">
          Upload New Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
            disabled={photoUploading}
          />
        </label>
      </div>
    </div>
  );
}
