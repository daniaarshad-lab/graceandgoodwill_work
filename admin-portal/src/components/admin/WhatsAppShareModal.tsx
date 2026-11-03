import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Share2, Shield, AlertTriangle } from 'lucide-react';
import { CareRequestRecord, usePlatformStore } from '../../data/platformStore';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  careRequest: CareRequestRecord;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  careRequest,
}) => {
  const { addAuditEntry } = usePlatformStore();
  const [copied, setCopied] = useState(false);
  const [loggedShare, setLoggedShare] = useState(false);

  if (!isOpen) return null;

  const clientFirstName = careRequest.clientFirstName || 'Eleanor';
  const clientFullName = careRequest.displayTitle || 'Eleanor Briggs';
  const requestRef = careRequest.id;
  const versionNum = careRequest.version || 'v1.0';
  
  // Mask email e.g. e***r@example.co.uk
  const rawEmail = careRequest.emailAddress || 'eleanor.briggs@example.co.uk';
  const parts = rawEmail.split('@');
  const maskedEmail =
    parts[0].length > 2
      ? `${parts[0][0]}***${parts[0].slice(-1)}@${parts[1]}`
      : `***@${parts[1]}`;

  const messageText = `Dear ${clientFirstName},

Your Grace & Goodwill profile and care request for ${clientFullName} (reference ${requestRef}, version ${versionNum}) is ready for review.

We have also sent full details to your verified email address (${maskedEmail}).

Please review the complete record, including care requirements, health conditions, medication, allergies, daily routines, accommodation, dates and agreed client charges:

https://graceandgoodwill.co.uk/portal/review/${requestRef}?v=${versionNum}

If anything needs correcting, please select “Request corrections” before approving.

To approve, follow the link, review the information, tick the declarations and select “Agree and approve for publication”.

A reply on WhatsApp does not constitute approval.

Kind regards,
Grace & Goodwill
graceandgoodwill.co.uk`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Audit log
    addAuditEntry({
      adminName: 'Jessica Smith',
      adminRole: 'Admin',
      actionType: 'whatsapp_shared',
      entityType: 'care_request',
      entityId: requestRef,
      clientName: clientFullName,
      location: careRequest.location || 'Cheshire',
      description: `Dispatched WhatsApp review message to client/representative. Explicit non-approval notice included.`,
    });
    setLoggedShare(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF7A]/30 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C3]">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-serif font-bold text-[#060D1E]">
                WhatsApp Sharing Notification
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compliant message template with masked address and mandatory non-approval disclaimer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loggedShare && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>WhatsApp dispatch recorded in compliance audit trail.</span>
          </div>
        )}

        {/* Warning Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Statutory Rule:</strong> WhatsApp is an informational alert channel only. A reply or consent message sent via WhatsApp does NOT constitute client approval.
          </p>
        </div>

        {/* Message Content */}
        <div className="mt-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4AF7A]/40 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
          {messageText}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E2D8C3]">
          <span className="text-[11px] text-slate-500">
            Send via WhatsApp Web or verified Business API
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied & Logged' : 'Copy & Log Dispatch'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
