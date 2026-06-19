import React, { useState } from "react";
import { Referral, ReferralStatus } from "@/types/referral";

interface ReferralDashboardProps {
  referrals: Referral[];
  loading: boolean;
  filterType?: "CARER" | "CLIENT";
}

export default function ReferralDashboard({
  referrals,
  loading,
  filterType,
}: ReferralDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: ReferralStatus) => {
    const statusMap: Record<
      ReferralStatus,
      { label: string; classes: string }
    > = {
      PENDING: {
        label: "Pending",
        classes:
          "border border-gold-DEFAULT/40 text-gold-DEFAULT bg-transparent",
      },
      EMAIL_SENT: {
        label: "Email Sent",
        classes:
          "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20",
      },
      REGISTERED: {
        label: "Registered",
        classes: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      },
      APPROVED: {
        label: "Approved",
        classes:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      },
      REJECTED: {
        label: "Rejected",
        classes: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      },
    };

    const config = statusMap[status] || {
      label: status,
      classes: "bg-navy-950 text-gold-200/50 border border-gold-300/10",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.classes}`}
      >
        {config.label}
      </span>
    );
  };

  // Filter & Search computation
  const filteredReferrals = React.useMemo(() => {
    let list = referrals;
    if (filterType) {
      list = list.filter((r) => r.type === filterType);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.firstName.toLowerCase().includes(q) ||
          r.lastName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "ALL") {
      list = list.filter((r) => r.status === statusFilter);
    }
    return list;
  }, [referrals, filterType, searchQuery, statusFilter]);

  return (
    <div className="h-full flex flex-col justify-between space-y-5">
      <style>{`
        .referral-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .referral-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .referral-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 122, 0.15);
          border-radius: 9999px;
        }
        .referral-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 122, 0.3);
        }
      `}</style>

      {/* Top Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gold-300/5 pb-3">
          <div>
            <h3 className="text-xl font-bold text-gold-200 tracking-tight">
              Referral History
            </h3>
            <p className="text-xs text-gold-100/50 mt-0.5">
              Review and track all your referred candidates.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search referrals by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-2.5 pl-9 text-xs text-gold-100 focus:outline-none transition duration-300 focus:ring-1 focus:ring-gold-DEFAULT/20"
            />
            <span className="absolute left-3.5 top-3 text-xs opacity-40">
              🔍
            </span>
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-2.5 text-xs text-gold-200 focus:outline-none focus:ring-1 focus:ring-gold-DEFAULT/20 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="EMAIL_SENT">Email Sent</option>
            <option value="REGISTERED">Registered</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center min-h-0 pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 flex-grow">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gold-100/50">
              Fetching referral records...
            </p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 space-y-3 flex-grow bg-navy-950/20 border border-gold-300/5 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-navy-950 border border-gold-300/10 flex items-center justify-center text-gold-200/30 text-xl shadow-[0_0_15px_rgba(212,175,122,0.02)]">
              👥
            </div>
            <h4 className="text-sm font-bold text-gold-200">
              No referrals found
            </h4>
            <p className="text-xs text-gold-100/40 max-w-xs leading-relaxed">
              Your submitted referrals will appear here once available.
            </p>
          </div>
        ) : (
          <div className="flex-grow flex flex-col min-h-0">
            {/* Desktop Table Container */}
            <div className="hidden md:flex flex-col flex-grow overflow-hidden rounded-2xl border border-gold-300/10 bg-navy-950/30 shadow-[0_0_20px_rgba(0,0,0,0.15)] min-h-0">
              <div className="overflow-y-auto referral-scroll flex-grow pr-0.5">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-widest text-gold-200/50 bg-[#12213c]/90 sticky top-0 z-10">
                      <th className="py-3.5 px-5 w-[30%]">Referral Name</th>
                      <th className="py-3.5 px-5 w-[33%]">Email Address</th>
                      <th className="py-3.5 px-5 w-[15%]">Type</th>
                      <th className="py-3.5 px-5 w-[15%]">Submitted</th>
                      <th className="py-3.5 px-5 w-[17%]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5 text-[12.5px] text-gold-100/80">
                    {filteredReferrals.map((ref) => (
                      <tr
                        key={ref.id}
                        className="hover:bg-gold-DEFAULT/5 cursor-pointer transition-colors duration-200"
                      >
                        <td className="py-3.5 px-5 font-semibold text-gold-200 truncate">
                          {ref.firstName} {ref.lastName}
                        </td>
                        <td className="py-3.5 px-5 text-gold-100/50 font-mono truncate">
                          {ref.email}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                              ref.type === "CARER"
                                ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                                : "bg-[#2563eb]/10 text-[#60a5fa] border border-[#2563eb]/20"
                            }`}
                          >
                            {ref.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-gold-100/40">
                          {formatDate(ref.submittedDate)}
                        </td>
                        <td className="py-3.5 px-5">
                          {getStatusBadge(ref.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards Container */}
            <div className="block md:hidden overflow-y-auto referral-scroll max-h-[440px] space-y-3 pr-1">
              {filteredReferrals.map((ref) => (
                <div
                  key={ref.id}
                  className="rounded-2xl border border-gold-300/10 bg-navy-950/20 p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gold-200 truncate">
                        {ref.firstName} {ref.lastName}
                      </h4>
                      <p className="text-[11px] text-gold-100/40 font-mono truncate">
                        {ref.email}
                      </p>
                    </div>
                    {getStatusBadge(ref.status)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] border-t border-gold-300/5 pt-2.5">
                    <span
                      className={`inline-flex items-center text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                        ref.type === "CARER"
                          ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "bg-[#2563eb]/10 text-[#60a5fa]"
                      }`}
                    >
                      {ref.type}
                    </span>
                    <span className="text-gold-100/40">
                      {formatDate(ref.submittedDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
