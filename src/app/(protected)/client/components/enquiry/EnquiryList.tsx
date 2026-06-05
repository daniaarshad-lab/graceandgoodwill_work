import { useState } from "react";
import { Enquiry } from "../../types/client-ui.types";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

interface EnquiryListProps {
  enquiries: Enquiry[];
  selectedId: string | null;
  onSelect: (enquiry: Enquiry) => void;
  onCreateNew: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export default function EnquiryList({
  enquiries,
  selectedId,
  onSelect,
  onCreateNew,
}: EnquiryListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = enquiries.filter((enq) =>
    enq.message?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full flex-1 min-h-0">
      {/* Header */}
      <div className="border-b border-gold-300/10 pb-4 mb-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gold-200">My Enquiries</h3>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 px-3 py-1.5 text-[11px] font-semibold text-gold-DEFAULT transition-all duration-300 hover:bg-gold-DEFAULT/20 hover:border-gold-DEFAULT/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-100/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search enquiries…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold-300/10 bg-navy-950/60 pl-9 pr-4 py-2 text-xs text-gold-100 placeholder:text-gold-100/30 outline-none focus:ring-2 focus:ring-gold-DEFAULT/30 focus:border-gold-DEFAULT/30 transition duration-300"
          />
        </div>
      </div>

      {/* Enquiry Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1 scrollbar-thin min-h-0">
        {filtered.length === 0 ? (
          <p className="text-xs text-gold-100/40 text-center py-8">
            {searchQuery
              ? "No enquiries match your search."
              : "No enquiries yet."}
          </p>
        ) : (
          filtered.map((enq) => {
            const isSelected = selectedId === enq.id;

            return (
              <button
                key={enq.id}
                onClick={() => onSelect(enq)}
                className={`w-full text-left rounded-xl p-3.5 transition-all duration-200 border ${
                  isSelected
                    ? "bg-gold-DEFAULT/5 border-gold-DEFAULT/30 shadow-soft"
                    : "bg-navy-950/30 border-gold-300/5 hover:bg-navy-900/50 hover:border-gold-300/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-gold-50 truncate flex-1">
                    {enq.message?.substring(0, 40) || "Enquiry"}
                    {(enq.message?.length || 0) > 40 ? "..." : ""}
                  </h4>
                  <EnquiryStatusBadge status={enq.status} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gold-100/40 mt-3">
                  <span>Created: {formatDate(enq.createdAt)}</span>
                  <span>
                    Updated: {timeAgo(enq.updatedAt)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
