import { EnquiryStatus } from "../../types/client-ui.types";

interface EnquiryStatusBadgeProps {
  status: EnquiryStatus;
}

const statusConfig: Record<EnquiryStatus, { label: string; classes: string }> =
  {
    PENDING: {
      label: "Pending",
      classes: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    },
    IN_PROGRESS: {
      label: "In Progress",
      classes:
        "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20",
    },
    RESPONDED: {
      label: "Responded",
      classes: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    },
    RESOLVED: {
      label: "Resolved",
      classes:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    CLOSED: {
      label: "Closed",
      classes: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
    },
  };

export default function EnquiryStatusBadge({
  status,
}: EnquiryStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status || "Unknown",
    classes: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
