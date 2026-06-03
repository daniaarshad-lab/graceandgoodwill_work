interface PortalHeaderProps {
  user: any;
  logout: () => void;
}

export default function PortalHeader({ user, logout }: PortalHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-2xl font-bold text-gold-DEFAULT">
          {user?.firstName?.charAt(0) || "C"}
          {user?.lastName?.charAt(0) || "P"}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">
            Family & Client Portal
          </p>
          <h1 className="text-3xl text-gold-50 mt-1">
            Welcome back, {user?.firstName || "Family"} {user?.lastName || ""}
          </h1>
          <p className="body-small text-gold-100/60 mt-1">{user?.email}</p>
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
