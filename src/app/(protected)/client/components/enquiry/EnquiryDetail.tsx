import { useState } from "react";
import { Enquiry, EnquiryMessage } from "../../types/client-ui.types";
import EnquiryStatusBadge from "./EnquiryStatusBadge";
import EnquiryTimeline from "./EnquiryTimeline";
import EmptyEnquiryState from "./EmptyEnquiryState";
import { ArrowLeft, Send } from "lucide-react";

interface EnquiryDetailProps {
  enquiry: Enquiry | null;
  onSendReply: (enquiryId: string, message: string) => void;
  onBack?: () => void; // Mobile back button
  showBackButton?: boolean;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MessageBubble({
  msg,
  clientUserId,
}: {
  msg: EnquiryMessage;
  clientUserId: string;
}) {
  const isClient = msg.senderId === clientUserId;

  return (
    <div className={`flex ${isClient ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isClient
            ? "bg-gold-DEFAULT/8 border border-gold-DEFAULT/20 rounded-br-md"
            : "bg-navy-900/60 border border-gold-300/10 rounded-bl-md"
        }`}
      >
        {/* Sender header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
              isClient
                ? "bg-gold-DEFAULT/20 text-gold-DEFAULT"
                : "bg-cyan-500/15 text-cyan-400"
            }`}
          >
            {isClient ? "U" : "S"}
          </div>
          <span
            className={`text-[10px] font-semibold ${
              isClient ? "text-gold-200" : "text-cyan-300/80"
            }`}
          >
            {isClient ? "You" : "Support"}
          </span>
          <span className="text-[9px] text-gold-100/30">
            {isClient ? "You" : "Support"}
          </span>
        </div>

        {/* Message content */}
        <p className="text-xs text-gold-100/80 leading-relaxed">
          {msg.message}
        </p>

        {/* Timestamp */}
        <p
          className={`text-[9px] mt-2 ${
            isClient ? "text-gold-100/30 text-right" : "text-gold-100/30"
          }`}
        >
          {formatDateTime(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function EnquiryDetail({
  enquiry,
  onSendReply,
  onBack,
  showBackButton = false,
}: EnquiryDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!enquiry) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyEnquiryState variant="no-selection" />
      </div>
    );
  }

  const isConversationClosed =
    enquiry.status === "RESOLVED" || enquiry.status === "CLOSED";

  const handleSend = () => {
    if (!replyText.trim()) return;
    setIsSending(true);

    // Simulate send delay
    setTimeout(() => {
      onSendReply(enquiry.id, replyText.trim());
      setReplyText("");
      setIsSending(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0">
      {/* Header */}
      <div className="border-b border-gold-300/10 pb-6 mb-6 space-y-4 shrink-0">
        <div className="flex items-start gap-3">
          {/* Mobile back button */}
          {showBackButton && (
            <button
              onClick={onBack}
              className="mt-0.5 p-1 rounded-lg hover:bg-navy-900/60 transition-colors text-gold-100/50 hover:text-gold-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-sm font-bold text-gold-50 line-clamp-2 leading-tight">
                {enquiry.message}
              </h3>
              <EnquiryStatusBadge status={enquiry.status} />
            </div>

            <div className="flex items-center gap-3 mt-2 text-[10px] text-gold-100/40">
              <span>Created: {formatDate(enquiry.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <EnquiryTimeline status={enquiry.status} />
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-thin mb-6 min-h-0">
        {enquiry.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gold-100/40">
              No conversation history available.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {enquiry.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                clientUserId={enquiry.userId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reply Section */}
      <div className="border-t border-gold-300/10 pt-6 shrink-0 mt-auto">
        {isConversationClosed ? (
          <div className="text-center py-3 rounded-xl bg-navy-900/40 border border-gold-300/5">
            <p className="text-xs text-gold-100/40">
              This enquiry has been {enquiry.status.toLowerCase()}. To continue
              the conversation, please create a new enquiry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your reply… (Shift+Enter for new line)"
              className="w-full rounded-xl border border-gold-300/10 bg-navy-950/60 px-4 py-3 text-xs text-gold-100 placeholder:text-gold-100/30 outline-none focus:ring-2 focus:ring-gold-DEFAULT/30 focus:border-gold-DEFAULT/30 transition duration-300 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || isSending}
                className="inline-flex items-center gap-2 rounded-xl bg-[#b59469] px-5 py-2 text-xs font-semibold text-navy-950 transition-all duration-300 hover:bg-[#c9a67d] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <Send className="h-3.5 w-3.5" />
                {isSending ? "Sending…" : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
