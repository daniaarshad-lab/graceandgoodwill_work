interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClasses = (statusStr: string) => {
    const s = statusStr.toLowerCase();

    if (
      s === "approved" ||
      s === "verified" ||
      s === "active" ||
      s === "completed" ||
      s === "matched" ||
      s === "paid" ||
      s === "success"
    ) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }

    if (
      s === "pending" ||
      s === "reviewing" ||
      s === "new_enquiry" ||
      s === "under_review" ||
      s === "open_for_applications"
    ) {
      return "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20";
    }

    if (
      s === "emergency" ||
      s === "high" ||
      s === "failed" ||
      s === "rejected" ||
      s === "overdue"
    ) {
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    }

    return "bg-navy-950 text-gold-200/50 border border-gold-300/10";
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadgeClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}
