import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

interface PortalHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  photoUploading: boolean;
  photoProgress: number;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PortalHeader({
  firstName,
  lastName,
  email,
  phone,
  profilePhoto,
  photoUploading,
  photoProgress: _photoProgress,
  handlePhotoChange,
}: PortalHeaderProps) {


  const profile = useAppSelector((state) => state.client.profile);

  console.log("PROFILE FROM REDUX:", profile);
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-3xl font-bold text-gold-DEFAULT shadow-soft">
            {profilePhoto ? (
              <Image
                src={profilePhoto}
                alt="Avatar Preview"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              `${firstName.charAt(0)}${lastName.charAt(0)}`
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
            <span className="text-[10px] text-gold-DEFAULT font-semibold">
              Change
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={photoUploading}
            />
          </label>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">
            Carer Dashboard
          </p>
          <h1 className="text-3xl text-gold-50 mt-1">
            {firstName} {lastName}
          </h1>
          <p className="body-small text-gold-100/60 mt-1">
            {email} • {phone}
          </p>
        </div>
      </div>

    </section>
  );
}
