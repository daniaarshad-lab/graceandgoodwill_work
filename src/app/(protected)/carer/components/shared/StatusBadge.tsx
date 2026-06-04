interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClasses = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (s === "approved" || s === "verified" || s === "active") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (s === "pending") {
      return "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20";
    }
    if (s === "rejected" || s === "expired") {
      return "bg-red-500/10 text-red-500 border border-red-500/30";
    }
    return "bg-navy-950 text-gold-100/40 border border-gold-300/10";
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getBadgeClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}
