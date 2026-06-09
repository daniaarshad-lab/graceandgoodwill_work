"use client";

import { useState } from "react";
import {
  Enquiry,
  EnquiryMessage,
} from "@/app/(protected)/client/types/client-ui.types";

interface SupportEnquiryManagementProps {
  enquiries: Enquiry[];
  selectedEnquiry: Enquiry | null;
  setSelectedEnquiry: (enquiry: Enquiry | null) => void;
  loadEnquiryDetails: (id: string) => Promise<void>;
  handleRespondToEnquiry: (id: string, message: string) => Promise<void>;
  handleUpdateEnquiryStatus: (id: string, status: string) => Promise<void>;
}

export default function SupportEnquiryManagement({
  enquiries,
  selectedEnquiry,
  setSelectedEnquiry,
  loadEnquiryDetails,
  handleRespondToEnquiry,
  handleUpdateEnquiryStatus,
}: SupportEnquiryManagementProps) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  >("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectEnquiry = async (enq: Enquiry) => {
    await loadEnquiryDetails(enq.id);
  };

  const handleSend = async () => {
    if (!selectedEnquiry || !replyText.trim()) return;
    setIsSending(true);
    try {
      await handleRespondToEnquiry(selectedEnquiry.id, replyText.trim());
      setReplyText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleCloseStatus = async () => {
    if (!selectedEnquiry) return;
    const isClosed =
      selectedEnquiry.status === "CLOSED" ||
      selectedEnquiry.status === "RESOLVED";
    const newStatus = isClosed ? "PENDING" : "CLOSED";
    await handleUpdateEnquiryStatus(selectedEnquiry.id, newStatus);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter, Search and Sort logic
  const filteredEnquiries = enquiries
    .filter((enq) => {
      const matchesStatus =
        filterStatus === "ALL" || enq.status === filterStatus;

      const matchesSearch =
        enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.id?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isRead === b.isRead) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return a.isRead ? 1 : -1; // unread (isRead: false) first
    });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "RESPONDED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "PENDING":
      case "OPEN":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse";
      case "IN_PROGRESS":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "CLOSED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-navy-900 border border-gold-300/10 text-gold-100/60";
    }
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isClosed =
    selectedEnquiry?.status === "CLOSED" ||
    selectedEnquiry?.status === "RESOLVED";
  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gold-200">
          Support & Enquiries Console
        </h2>
        <p className="text-sm text-gold-100/50 flex items-center flex-wrap gap-2">
          <span>
            Review issues, reply to general enquiries, and manage client
            relations.
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400 animate-pulse">
              ● {unreadCount} Unread
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px] h-[calc(100vh-280px)]">
        {/* LEFT COLUMN: LIST OF ENQUIRIES */}
        <div className="lg:col-span-2 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-4 flex flex-col h-full overflow-hidden shadow-soft backdrop-blur-md">
          {/* SEARCH & FILTERS */}
          <div className="space-y-3 mb-4 shrink-0">
            <input
              type="text"
              placeholder="Search by name, email, query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gold-300/10 bg-navy-950 px-4 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold focus:outline-none"
            />

            <div className="flex flex-wrap gap-1.5 border-b border-gold-300/10 pb-2">
              {(["ALL", "PENDING", "IN_PROGRESS", "CLOSED"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterStatus === status
                        ? "bg-gold text-navy-950"
                        : "bg-navy-950/40 text-gold-100/60 border border-gold-300/5 hover:text-gold hover:border-gold-300/20"
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredEnquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gold-100/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-xs">No matching enquiries found</span>
              </div>
            ) : (
              filteredEnquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <button
                    key={enq.id}
                    onClick={() => handleSelectEnquiry(enq)}
                    className={`w-full text-left rounded-xl p-3.5 border transition-all ${
                      isSelected
                        ? "bg-gold/10 border-gold/30"
                        : "bg-navy-950/40 border-gold-300/5 hover:border-gold-300/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {!enq.isRead && (
                          <span
                            className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"
                            title="Unread"
                          />
                        )}
                        <span
                          className={`text-xs font-bold ${!enq.isRead ? "text-gold-200" : "text-gold-100"}`}
                        >
                          {enq.name}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(enq.status)}`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-gold-100/40 mb-2 truncate">
                      {enq.email}
                    </div>
                    <p className="text-xs text-gold-100/70 line-clamp-2 leading-relaxed">
                      {enq.message}
                    </p>
                    <div className="mt-2.5 text-[9px] text-gold-100/30 font-mono text-right">
                      {formatDateTime(enq.createdAt)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & THREAD */}
        <div className="lg:col-span-3 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 flex flex-col h-full overflow-hidden shadow-soft backdrop-blur-md">
          {selectedEnquiry ? (
            <div className="flex flex-col h-full">
              {/* HEADER INFO */}
              <div className="border-b border-gold-300/10 pb-4 mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gold-100">
                      {selectedEnquiry.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(selectedEnquiry.status)}`}
                    >
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <div className="text-xs text-gold-100/40">
                    Email:{" "}
                    <span className="text-gold-200">
                      {selectedEnquiry.email}
                    </span>{" "}
                    • Phone:{" "}
                    <span className="text-gold-200">
                      {selectedEnquiry.phone || "N/A"}
                    </span>
                  </div>
                </div>

                {/* CLOSE TRIGGER BUTTON */}
                <button
                  onClick={handleToggleCloseStatus}
                  className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                    isClosed
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                  }`}
                >
                  {isClosed ? "Reopen Enquiry" : "Close Enquiry"}
                </button>
              </div>

              {/* ORIGINAL TICKET SUMMARY */}
              <div className="mb-4 rounded-xl bg-navy-950/60 p-4 border border-gold-300/5 shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gold/60 mb-1">
                  Original Enquiry Query:
                </div>
                <p className="text-xs text-gold-100/90 leading-relaxed font-sans">
                  {selectedEnquiry.message}
                </p>
                <div className="mt-2 text-[9px] text-gold-100/30 font-mono">
                  Submitted at: {formatDateTime(selectedEnquiry.createdAt)}
                </div>
              </div>

              {/* MESSAGES THREAD CONTAINER */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin mb-4 min-h-0">
                {selectedEnquiry.messages &&
                selectedEnquiry.messages.length > 0 ? (
                  selectedEnquiry.messages.map((msg: EnquiryMessage) => {
                    // Outgoing = Admin response
                    const isOutgoing = msg.senderId !== selectedEnquiry.userId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                            isOutgoing
                              ? "bg-gold/10 border-gold/20 rounded-br-none"
                              : "bg-navy-950/80 border-gold-300/5 rounded-bl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider ${
                                isOutgoing ? "text-gold" : "text-cyan-400"
                              }`}
                            >
                              {isOutgoing ? "Support (Admin)" : "Client"}
                            </span>
                            <span className="text-[8px] text-gold-100/20">
                              {formatDateTime(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gold-100/90 leading-relaxed font-sans whitespace-pre-line">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gold-100/20">
                    <span className="text-xs">
                      No thread message history. Send a reply to start the
                      conversation.
                    </span>
                  </div>
                )}
              </div>

              {/* REPLY BLOCK */}
              <div className="border-t border-gold-300/10 pt-4 shrink-0">
                {isClosed ? (
                  <div className="text-center py-3.5 rounded-xl bg-navy-950/40 border border-rose-500/15">
                    <p className="text-xs text-rose-400/80 font-bold">
                      This enquiry has been Closed/Resolved. Reopen it using the
                      button above to post new replies.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type administrative reply... (Shift+Enter for line break, Enter to send)"
                      className="w-full rounded-xl border border-gold-300/10 bg-navy-950/60 px-4 py-3 text-xs text-gold-100 placeholder:text-gold-100/30 outline-none focus:ring-1 focus:ring-gold focus:border-gold transition duration-300 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSend}
                        disabled={!replyText.trim() || isSending}
                        className="inline-flex items-center gap-2 rounded-xl bg-gold hover:bg-gold-600 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-navy-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? "Sending Reply..." : "Send Response"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gold-100/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-3 opacity-30 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              <h4 className="text-sm font-bold text-gold-200 mb-1">
                Select an Enquiry
              </h4>
              <p className="text-xs max-w-md">
                Choose an enquiry from the left list pane to load customer
                details, conversation history, and actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
