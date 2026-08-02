"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin/admin.service";
import {
  FileText,
  Shield,
  Calendar,
  User,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface UserAuditLogsProps {
  userId: string;
  title?: string;
  subtitle?: string;
}

export default function UserAuditLogs({
  userId,
  title = "Audit Logs History",
  subtitle = "Complete activity and event audit trail for this user",
}: UserAuditLogsProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    adminService
      .getAuditLogsForUser(userId, 1, 50)
      .then((res) => {
        setLogs(res.items || []);
      })
      .catch((err) => {
        console.error("Failed to load audit logs for user:", err);
        setError(err.message || "Failed to load audit trail.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const getEventBadge = (action: string | null, event: string) => {
    if (
      action === "APPROVE" ||
      event.includes("APPROVED") ||
      event.includes("CREATED") ||
      event.includes("VERIFIED")
    ) {
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
    }
    if (
      action === "REJECT" ||
      event.includes("REJECTED") ||
      event.includes("SUSPENDED")
    ) {
      return {
        icon: <XCircle className="h-4 w-4 text-rose-400" />,
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      };
    }
    if (event.includes("UPDATED") || event.includes("CHANGED")) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    }
    return {
      icon: <Info className="h-4 w-4 text-sky-400" />,
      badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    };
  };

  return (
    <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" /> {title}
          </h3>
          <p className="text-xs text-gold-100/50 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-mono text-gold/70 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
          {logs.length} Total Events
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gold-100/60 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading audit logs history...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-rose-400 text-xs bg-rose-500/10 rounded-xl border border-rose-500/20 p-4">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-gold-100/40 flex flex-col items-center gap-2">
          <FileText className="h-10 w-10 text-gold-300/20" />
          <p className="text-sm font-semibold text-gold-200/60">
            No Audit Logs Found
          </p>
          <p className="text-xs max-w-sm">
            There are currently no logged governance or system events for this
            user.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold-300/10 space-y-6">
          {logs.map((log) => {
            const { icon, badgeClass } = getEventBadge(log.action, log.event);
            const dt = new Date(log.timestamp);
            const formattedDate = !isNaN(dt.getTime())
              ? dt.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : log.timestamp;

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-9 top-1.5 h-6 w-6 rounded-full bg-navy-950 border border-gold-300/20 flex items-center justify-center shadow">
                  {icon}
                </div>

                <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-4 transition duration-200 hover:border-gold-300/30">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}
                      >
                        {log.event}
                      </span>
                      {log.action && (
                        <span className="text-[9px] uppercase font-bold text-gold-200/60 bg-gold-300/5 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gold-100/40 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gold/50" />{" "}
                      {formattedDate}
                    </span>
                  </div>

                  <p className="text-xs text-gold-100/90 leading-relaxed font-medium">
                    {log.details || "No details provided"}
                  </p>

                  <div className="mt-3 pt-2 border-t border-gold-300/5 flex items-center justify-between text-[10px] text-gold-100/40">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-gold/60" /> Performed by:{" "}
                      {log.adminUser ? (
                        <span className="font-bold text-gold-200 bg-gold/10 px-2 py-0.5 rounded border border-gold/20 text-[11px]">
                          {`${log.adminUser.firstName || ""} ${log.adminUser.lastName || ""}`.trim() ||
                            log.adminUser.email ||
                            "Admin"}
                        </span>
                      ) : (
                        <span className="text-gold-100/50 italic font-mono">
                          System
                        </span>
                      )}
                    </span>
                    {log.targetEntityType && (
                      <span className="font-mono text-gold/50">
                        Target: {log.targetEntityType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
