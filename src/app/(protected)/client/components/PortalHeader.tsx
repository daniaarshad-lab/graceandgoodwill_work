import { useAppSelector } from "@/store/hooks";

interface PortalHeaderProps {
  user: any;
}

export default function PortalHeader({ user }: PortalHeaderProps) {
  const profile = useAppSelector((state) => state.client.profile);

  const displayUser = profile?.user || user;

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-2xl font-bold text-gold-DEFAULT">
          {displayUser?.firstName?.charAt(0) || "C"}
          {displayUser?.lastName?.charAt(0) || "P"}
        </div>

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
