interface PortalHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  photoUploading: boolean;
  photoProgress: number;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logout: () => void;
}

export default function PortalHeader({
  firstName,
  lastName,
  email,
  phone,
  profilePhoto,
  photoUploading,
  photoProgress,
  handlePhotoChange,
  logout,
}: PortalHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-3xl font-bold text-gold-DEFAULT shadow-soft">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Avatar Preview"
                className="h-full w-full object-cover"
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
          <h1 className="text-3xl font-semibold text-gold-50 mt-1">
            {firstName} {lastName}
          </h1>
          <p className="text-sm text-gold-100/60 mt-1">
            {email} • {phone}
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-xl border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT transition hover:bg-gold-DEFAULT/10 hover:border-gold-DEFAULT"
      >
        Log Out
      </button>
    </section>
  );
}
