"use client";

import { useAppSelector } from "@/store/hooks";
interface PortalHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  onShareClick?: () => void;
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

  const getPhotoUrl = (url: string | null | undefined, updatedAt?: string) => {
    if (!url) return "";
    let finalUrl = url;
    if (!url.startsWith("http")) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      let baseUrl = apiUrl;
      try {
        baseUrl = new URL(apiUrl).origin;
      } catch (e) {
        baseUrl = apiUrl.replace(/\/api\/?$/, "");
      }
      const cleanPath = url.startsWith("/") ? url : `/${url}`;
      finalUrl = `${baseUrl}${cleanPath}`;
    }

    if (
      updatedAt &&
      !finalUrl.startsWith("blob:") &&
      !finalUrl.includes("X-Amz-Signature") &&
      !finalUrl.includes("Signature=") &&
      !finalUrl.includes("Amz-Credential") &&
      !finalUrl.includes("X-Amz-")
    ) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl += `${separator}t=${new Date(updatedAt).getTime()}`;
    }
    return finalUrl;
  };

  return (
    <section className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-4 sm:p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5 min-w-0 flex-1">
        <div className="relative group block">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT shadow-soft">
            {currentPhoto ? (
              <img
                src={getPhotoUrl(currentPhoto, profile?.updatedAt)}
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
            Profile Details
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
          {((profile as any)?.publicProfileId ||
            (profile as any)?.user?.publicProfileId) && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300/70">
                Public Profile ID:
              </span>
              <span className="text-xs font-mono font-bold text-gold-DEFAULT bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
                {(profile as any)?.publicProfileId ||
                  (profile as any)?.user?.publicProfileId}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
