interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClasses = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (
      s === "matched" ||
      s === "available" ||
      s === "completed" ||
      s === "verified"
    ) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (s === "reviewing" || s === "pending" || s === "limited availability") {
      return "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20";
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
