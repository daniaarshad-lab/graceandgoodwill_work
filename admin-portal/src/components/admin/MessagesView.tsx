import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  CheckCheck,
  FileText,
  User,
  Shield,
  Lock,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { usePlatformStore, ChatMessage, InternalNote } from '../../data/platformStore';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    sendMessage,
    addInternalNote,
    updateConversationStatus,
  } = usePlatformStore();

  const [channelTab, setChannelTab] = useState<'clients' | 'carers'>('clients');
  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations.find((c) => c.type === 'client')?.id || 'conv-1'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<
    'New' | 'In progress' | 'Awaiting client' | 'Completed' | 'Cancelled'
  >('Completed');
  const [statusResolutionNote, setStatusResolutionNote] = useState('');
  const [carerCardModalOpen, setCarerCardModalOpen] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations.find((c) => c.type === (channelTab === 'clients' ? 'client' : 'carer')) ||
    conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchesChannel =
      channelTab === 'clients' ? c.type === 'client' : c.type === 'carer';
    const lastMsgText = c.messages[c.messages.length - 1]?.text || '';
    const matchesSearch =
      c.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMsgText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.linkedRequestId && c.linkedRequestId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  const handleSend = () => {
    if (!messageInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageInput.trim(), 'Admin');
    setMessageInput('');
  };

  const handleAddNote = () => {
    if (!internalNoteInput.trim() || !activeConv) return;
    addInternalNote(activeConv.id, internalNoteInput.trim());
    setInternalNoteInput('');
  };

  const handleUpdateStatusConfirm = () => {
    if (!activeConv) return;
    updateConversationStatus(activeConv.id, targetStatus, statusResolutionNote);
    setStatusModalOpen(false);
    setStatusResolutionNote('');
  };

  const handleSendCarerCard = (carerName: string, role: string, exp: string) => {
    if (!activeConv) return;
    const cardText = `[CARER PROFILE INTRODUCED]\nCarer: ${carerName}\nDesignation: ${role}\nExperience: ${exp}\nCompliance: Fully DBS Checked, 2 References Verified, Moving & Handling Certified.\nGrace & Goodwill Ref: GGW-CR-2024`;
    sendMessage(activeConv.id, cardText, 'Admin');
    setCarerCardModalOpen(false);
  };

  const handleSendCareRequestSummary = () => {
    if (!activeConv) return;
    const summaryText = `[CARE REQUEST SUMMARY: ${activeConv.linkedRequestId || 'CR-2024-001'}]\nStatus: Approved & Live\nClient: ${activeConv.participantName}\nCare Type: Live-in Ongoing Care\nAgreed Client Fee: £1,450/week\nSchedule: Two-week rotation\nPrivate bedroom confirmed with private bathroom.`;
    sendMessage(activeConv.id, summaryText, 'Admin');
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Awaiting client':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] bg-[#F8F5EE] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-white border-b border-[#E2D8C3] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl lg:text-2xl font-serif text-[#060D1E] font-medium tracking-tight">
              Operational Messaging &amp; Inquiries
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#B88E3E] font-medium border border-[#D4AF7A]/30">
              WhatsApp &amp; iMessage Style
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compliant communication with audit trails. Admin ↔ Client and Admin ↔ Carer channels are strictly separate. Direct client-carer messaging is disabled.
          </p>
        </div>

        {/* Channel Tab Selector */}
        <div className="flex items-center gap-2 bg-[#F1EAD9] p-1 rounded-xl border border-[#D4AF7A]/20">
          <button
            onClick={() => {
              setChannelTab('clients');
              const firstClient = conversations.find((c) => c.type === 'client');
              if (firstClient) setActiveConversationId(firstClient.id);
            }}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
              channelTab === 'clients'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Clients &amp; Representatives
          </button>
          <button
            onClick={() => {
              setChannelTab('carers');
              const firstCarer = conversations.find((c) => c.type === 'carer');
              if (firstCarer) setActiveConversationId(firstCarer.id);
            }}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
              channelTab === 'carers'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Carers
          </button>
        </div>
      </div>

      {/* Main Workspace: Left List + Chat Area + Notes Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Conversation List */}
        <div className="w-80 lg:w-96 bg-white border-r border-[#E2D8C3] flex flex-col shrink-0">
          {/* Search bar */}
          <div className="p-3 border-b border-[#E2D8C3] bg-[#FAF7F2]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${channelTab === 'clients' ? 'clients' : 'carers'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#D4AF7A]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/30"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1EAD9]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No conversations found in this category.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                const lastMsg = conv.messages[conv.messages.length - 1]?.text || 'No messages yet';
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-[#F9F6EE] border-l-4 border-l-[#B88E3E]'
                        : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        className="w-10 h-10 rounded-full object-cover border border-[#D4AF7A]/30"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#B88E3E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-[#060D1E] truncate">
                          {conv.participantName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${getStatusColor(
                            conv.requestStatus
                          )}`}
                        >
                          {conv.requestStatus}
                        </span>
                        {conv.linkedRequestId && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {conv.linkedRequestId}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 truncate">
                        {lastMsg}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Center: Live Chat Pane */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-[#FAF7F2] min-w-0">
            {/* Top Channel Bar */}
            <div className="bg-white px-6 py-3.5 border-b border-[#E2D8C3] flex items-center justify-between gap-4 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.participantAvatar}
                  alt={activeConv.participantName}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF7A]/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-[#060D1E]">
                      {activeConv.participantName}
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      ({activeConv.participantRole})
                    </span>
                    <button
                      onClick={() => {
                        setTargetStatus(activeConv.requestStatus);
                        setStatusModalOpen(true);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border hover:opacity-80 transition-opacity ${getStatusColor(
                        activeConv.requestStatus
                      )}`}
                    >
                      {activeConv.requestStatus} ▾
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    {activeConv.linkedRequestId && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#B88E3E]" />
                        Care Request:{' '}
                        <strong className="text-slate-700 font-mono">
                          {activeConv.linkedRequestId}
                        </strong>
                      </span>
                    )}
                    {activeConv.assignedAdmin && (
                      <span>
                        Assigned Admin:{' '}
                        <span className="text-slate-700 font-medium">
                          {activeConv.assignedAdmin}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNotesDrawerOpen(!notesDrawerOpen)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                    notesDrawerOpen
                      ? 'bg-[#060D1E] text-[#FAF7F2] border-[#060D1E]'
                      : 'bg-white text-slate-700 border-[#D4AF7A]/40 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#B88E3E]" />
                  Internal Notes ({activeConv.internalNotes?.length || 0})
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Security Banner */}
              <div className="mx-auto max-w-md bg-[#FAF4E6] border border-[#D4AF7A]/40 rounded-xl p-3 text-center text-xs text-slate-700 shadow-xs">
                <div className="flex items-center justify-center gap-1.5 text-[#8C6D23] font-medium mb-1">
                  <Shield className="w-4 h-4" />
                  Grace &amp; Goodwill Secure Messaging
                </div>
                <p className="text-[11px] text-slate-600">
                  Messages are encrypted and archived for regulatory compliance. Direct communication between clients and carers is strictly prohibited under safeguarding policies.
                </p>
              </div>

              {activeConv.messages.map((msg: ChatMessage) => {
                const isAdmin = msg.senderRole === 'Admin' || msg.senderRole === 'Super Admin';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xl rounded-2xl px-4 py-3 shadow-xs ${
                        isAdmin
                          ? 'bg-[#060D1E] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-[#E2D8C3] rounded-bl-xs'
                      }`}
                    >
                      {/* Sender Tag */}
                      <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-white/10 text-[10px]">
                        <span
                          className={`font-semibold ${
                            isAdmin ? 'text-[#D4AF7A]' : 'text-slate-700'
                          }`}
                        >
                          {msg.senderName} ({msg.senderRole || 'Client'})
                        </span>
                        <span className={isAdmin ? 'text-slate-400' : 'text-slate-400'}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className="text-xs whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Delivery Status and Formal Footnote */}
                      <div className="mt-2 pt-1 flex items-center justify-between text-[9px] opacity-75 border-t border-white/10">
                        <span>
                          {msg.senderName} · {msg.senderRole || 'User'} · Replied at {msg.timestamp}
                        </span>
                        {isAdmin && (
                          <span className="flex items-center gap-0.5 ml-2 text-[#D4AF7A]">
                            <CheckCheck className="w-3 h-3" />
                            Sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Bar */}
            <div className="bg-[#F4EFE6] px-6 py-2 border-t border-[#E2D8C3] flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B88E3E]" />
                Quick Actions:
              </span>
              <button
                onClick={() => setCarerCardModalOpen(true)}
                className="px-2.5 py-1 bg-white hover:bg-[#FAF7F2] border border-[#D4AF7A]/40 rounded-md text-[11px] text-[#060D1E] font-medium whitespace-nowrap shadow-xs"
              >
                Send Carer Profile Card
              </button>
              <button
                onClick={handleSendCareRequestSummary}
                className="px-2.5 py-1 bg-white hover:bg-[#FAF7F2] border border-[#D4AF7A]/40 rounded-md text-[11px] text-[#060D1E] font-medium whitespace-nowrap shadow-xs"
              >
                Send Care Request Summary
              </button>
            </div>

            {/* Message Input Box */}
            <div className="bg-white p-4 border-t border-[#E2D8C3] flex items-end gap-3 shrink-0">
              <div className="flex-1 bg-[#FAF7F2] border border-[#D4AF7A]/40 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-[#B88E3E]/30 focus-within:bg-white transition-all">
                <textarea
                  rows={2}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Write an official reply to ${activeConv.participantName}... (Press Enter to send)`}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between pt-1 border-t border-[#E2D8C3]/50 text-[10px] text-slate-500">
                  <span>
                    Sending as: <strong>Jessica Smith (Admin)</strong>
                  </span>
                  <span>Shift + Enter for new line</span>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="px-5 py-3.5 bg-[#060D1E] hover:bg-[#1E293B] disabled:opacity-40 text-[#FAF7F2] rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#D4AF7A]" />
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#FAF7F2] text-slate-500 text-xs">
            Select a conversation to begin.
          </div>
        )}

        {/* Right Drawer: Confidential Internal Notes */}
        {notesDrawerOpen && activeConv && (
          <div className="w-80 lg:w-96 bg-white border-l border-[#E2D8C3] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#E2D8C3] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B88E3E]" />
                <h3 className="text-xs font-semibold text-[#060D1E]">
                  Internal Admin Notes
                </h3>
              </div>
              <button
                onClick={() => setNotesDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border-b border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <p>
                Internal notes are confidential to the Grace &amp; Goodwill administrative team. They are never visible to clients, representatives or carers.
              </p>
            </div>

            {/* Note entry list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.internalNotes && activeConv.internalNotes.length > 0 ? (
                activeConv.internalNotes.map((note: InternalNote) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2D8C3] text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-[#060D1E]">{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{note.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No internal notes recorded for this request.
                </div>
              )}
            </div>

            {/* Note input */}
            <div className="p-4 border-t border-[#E2D8C3] bg-[#FAF7F2]">
              <textarea
                rows={3}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Record confidential admin observation or phone summary..."
                className="w-full p-2.5 text-xs bg-white border border-[#D4AF7A]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/30 resize-none mb-2"
              />
              <button
                onClick={handleAddNote}
                disabled={!internalNoteInput.trim()}
                className="w-full py-2 bg-[#060D1E] hover:bg-[#1E293B] disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-all"
              >
                Add Internal Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && activeConv && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#D4AF7A]/30">
            <h3 className="text-base font-serif font-bold text-[#060D1E] mb-2">
              Update Request &amp; Communication Status
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Select the new status for conversation with{' '}
              <strong>{activeConv.participantName}</strong>.
            </p>

            <div className="space-y-2 mb-4">
              {(
                [
                  'New',
                  'In progress',
                  'Awaiting client',
                  'Completed',
                  'Cancelled',
                ] as const
              ).map((st) => (
                <label
                  key={st}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                    targetStatus === st
                      ? 'border-[#B88E3E] bg-[#FAF7F2] font-semibold text-[#060D1E]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={targetStatus === st}
                    onChange={() => setTargetStatus(st)}
                    className="accent-[#B88E3E]"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>

            {targetStatus === 'Completed' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Resolution Summary / Completion Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={statusResolutionNote}
                  onChange={(e) => setStatusResolutionNote(e.target.value)}
                  placeholder="Record summary of outcome, confirmed placement ref, or next steps..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/30"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatusConfirm}
                className="px-4 py-2 text-xs bg-[#060D1E] text-white rounded-lg hover:bg-slate-800 font-medium"
              >
                Confirm Status Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Carer Card Modal */}
      {carerCardModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D4AF7A]/30">
            <h3 className="text-base font-serif font-bold text-[#060D1E] mb-2">
              Send Carer Profile Card
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Select an approved, compliance-verified carer to introduce to this client or representative.
            </p>

            <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
              {[
                {
                  name: 'Anita Kowalska',
                  role: 'Senior Live-in Carer',
                  exp: '9 years live-in experience, specialist in dementia and mobility support',
                  avatar:
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                },
                {
                  name: 'Sophie Williams',
                  role: 'Certified Live-in Carer',
                  exp: '6 years experience, palliative and stroke recovery care',
                  avatar:
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                },
                {
                  name: 'David Thompson',
                  role: 'Live-in Companion &amp; Carer',
                  exp: '5 years experience, driving license, culinary preparation',
                  avatar:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-3 border border-[#E2D8C3] rounded-xl flex items-center justify-between gap-3 hover:border-[#B88E3E] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF7A]/30"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#060D1E]">{c.name}</div>
                      <div className="text-[11px] text-[#B88E3E] font-medium">{c.role}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{c.exp}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendCarerCard(c.name, c.role, c.exp)}
                    className="px-3 py-1.5 bg-[#060D1E] hover:bg-[#1E293B] text-white rounded-lg text-xs font-medium whitespace-nowrap"
                  >
                    Insert Card
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCarerCardModalOpen(false)}
                className="px-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
