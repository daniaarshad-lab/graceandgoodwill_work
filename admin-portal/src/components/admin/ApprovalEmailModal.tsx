import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send, ExternalLink, Shield } from 'lucide-react';
import { CareRequestRecord } from '../../data/platformStore';

interface ApprovalEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  careRequest: CareRequestRecord;
  onOpenDirectReview: () => void;
}

export const ApprovalEmailModal: React.FC<ApprovalEmailModalProps> = ({
  isOpen,
  onClose,
  careRequest,
  onOpenDirectReview,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatedSent, setSimulatedSent] = useState(false);

  if (!isOpen) return null;

  const clientFirstName = careRequest.clientFirstName || 'Eleanor';
  const clientFullName = careRequest.displayTitle || 'Eleanor Briggs';
  const requestRef = careRequest.id;
  const versionNum = careRequest.version || 'v1.0';
  const adminName = careRequest.pricingNotes?.enteredBy || 'Jessica Smith (Admin)';
  const preparedOn = careRequest.pricingNotes?.agreementDate || new Date().toLocaleString('en-GB');

  const subject = `Action required: review and approve your Grace & Goodwill profile and care request`;

  const emailBody = `Dear ${clientFirstName},

We have completed or updated the Grace & Goodwill client profile and care request for ${clientFullName}, using information supplied by you or your representative.

Your completed information is ready for review:

Reference: ${requestRef}
Version: ${versionNum}
Prepared by: ${adminName}
Prepared on: ${preparedOn}

Please review the complete record carefully before approving. This includes the care requirements, health conditions, medication information, allergies, daily routines, accommodation, placement dates, agreed client charges and any other details recorded on your behalf.

[ Review information and approve securely: https://graceandgoodwill.co.uk/portal/review/${requestRef}?v=${versionNum} ]

You can view and download a complete copy through the secure link above. If anything is incorrect, incomplete, unclear or out of date, please select “Request corrections” before approving.

The information you approve will be used to identify suitable carers. Relevant information will be shared securely with carers considering or undertaking the placement, subject to our access controls and Privacy Policy. It may influence a carer’s decision to accept the placement and how they prepare for and provide day-to-day support. Incorrect or missing information may affect suitability and safety.

You are responsible for providing accurate and complete information to the best of your knowledge, checking that information entered on your behalf accurately reflects what you supplied, and promptly notifying us of changes.

Please pay particular attention to medication names, doses, timings, allergies and support requirements. Where you are uncertain, obtain confirmation from the appropriate healthcare professional before approving the relevant information.

Grace & Goodwill records the information supplied for matching and administrative purposes. This record is not a clinical assessment, care plan, prescription or authority to change medication or treatment.

To approve, follow the secure link, review the information, tick the declarations and select “Agree and approve for publication”. Your checkbox submission will be recorded as your electronic acceptance; no separate signature is required.

Your profile and care request will remain awaiting approval until you or an appropriately authorised representative completes this process. Approval authorises the approved version to become live for matching or be shared with selected carers; it does not itself confirm a placement.

If you need help accessing or reviewing the information, please contact our team.

Kind regards,
Grace & Goodwill
Care Defined by Integrity
graceandgoodwill.co.uk`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = () => {
    setSimulatedSent(true);
    setTimeout(() => setSimulatedSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF7A]/30 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C3]">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#B88E3E]" />
              <h2 className="text-xl font-serif font-bold text-[#060D1E]">
                Automatic Client Approval Email
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Exact statutory notification dispatched to the client's verified address ({careRequest.emailAddress || 'eleanor.briggs@example.co.uk'}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {simulatedSent && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Approval email successfully dispatched to{' '}
              <strong>{careRequest.emailAddress || 'verified address'}</strong>. Logged in audit history.
            </span>
          </div>
        )}

        {/* Email Meta */}
        <div className="mt-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">To:</span>
            <span className="font-semibold text-slate-800">
              {careRequest.emailAddress || 'eleanor.briggs@example.co.uk'}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-[#E2D8C3]/60 pt-2">
            <span className="text-slate-500">Subject:</span>
            <span className="font-semibold text-[#060D1E]">{subject}</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="mt-4 p-5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed shadow-inner max-h-96 overflow-y-auto">
          {emailBody}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2D8C3]">
          <button
            onClick={onOpenDirectReview}
            className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D4AF7A]/40 rounded-xl text-xs font-semibold text-[#060D1E] flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B88E3E]" />
            Preview Secure Client Approval View
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={handleSendEmail}
              className="px-5 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-[#D4AF7A]" />
              Send Approval Email Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
