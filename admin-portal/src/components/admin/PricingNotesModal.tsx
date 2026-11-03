import React, { useState } from 'react';
import {
  X,
  Coins,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { CareRequestRecord, usePlatformStore } from '../../data/platformStore';

interface PricingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  careRequest: CareRequestRecord;
}

export const PricingNotesModal: React.FC<PricingNotesModalProps> = ({
  isOpen,
  onClose,
  careRequest,
}) => {
  const { updateCareRequestPricing, platformSettings } = usePlatformStore();

  const standardFloor = platformSettings.standardWeeklyPriceFloor || 1200;
  const currentPricing = careRequest.pricingNotes;

  const [agreedWeeklyCharge, setAgreedWeeklyCharge] = useState<number>(
    currentPricing?.agreedWeeklyCharge || careRequest.agreedClientWeeklyFee || 1450
  );
  const [additionalAllowance, setAdditionalAllowance] = useState<number>(
    currentPricing?.additionalCharges?.[0]?.amount || careRequest.foodAllowance || 50
  );
  const [negotiatorName, setNegotiatorName] = useState<string>(
    currentPricing?.negotiatedBy || 'Jessica Smith'
  );
  const [representativeName, setRepresentativeName] = useState<string>(
    currentPricing?.agreedOnClientBehalfBy || 'Daughter (Authorised Representative)'
  );
  const [communicationChannel, setCommunicationChannel] = useState<
    'Phone' | 'Email' | 'In-person' | 'Website' | 'WhatsApp'
  >(currentPricing?.communicationChannel || 'Phone');
  const [notes, setNotes] = useState<string>(
    currentPricing?.notes?.[0]?.text || 'Agreed standard live-in care rate following assessment.'
  );
  const [belowStandardReason, setBelowStandardReason] = useState<string>(
    currentPricing?.belowStandardReason || ''
  );

  const [isSubstantiveChange, setIsSubstantiveChange] = useState(
    agreedWeeklyCharge !== (careRequest.agreedClientWeeklyFee || 1450)
  );

  const [priceError, setPriceError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePriceChange = (val: number) => {
    setAgreedWeeklyCharge(val);
    if (val !== (careRequest.agreedClientWeeklyFee || 1450)) {
      setIsSubstantiveChange(true);
    }
  };

  const handleSave = () => {
    setPriceError(null);
    if (agreedWeeklyCharge < standardFloor && !belowStandardReason.trim()) {
      setPriceError(
        `The agreed charge (£${agreedWeeklyCharge}/wk) is below the £${standardFloor}/wk standard floor. You must provide a documented reason.`
      );
      return;
    }

    updateCareRequestPricing(
      careRequest.id,
      {
        agreedWeeklyCharge,
        additionalCharges: [{ label: 'Food Allowance', amount: additionalAllowance }],
        negotiatedBy: negotiatorName,
        enteredBy: 'Jessica Smith',
        agreedOnClientBehalfBy: representativeName,
        agreementDate: new Date().toLocaleDateString('en-GB'),
        communicationChannel,
        belowStandardReason: agreedWeeklyCharge < standardFloor ? belowStandardReason : undefined,
        notes: [
          {
            id: 'n-' + Date.now(),
            author: 'Jessica Smith',
            authorRole: 'Admin',
            timestamp: new Date().toLocaleDateString('en-GB'),
            text: notes,
          },
        ],
      },
      'Jessica Smith'
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF7A]/30 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C3]">
          <div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#B88E3E]" />
              <h2 className="text-xl font-serif font-bold text-[#060D1E]">
                Pricing &amp; Negotiation Audit Record
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {careRequest.displayTitle} &bull; Reference: {careRequest.id} &bull; Current Version: {careRequest.version || 'v1.0'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {priceError && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{priceError}</span>
          </div>
        )}

        {/* Substantive change notice */}
        {isSubstantiveChange && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Substantive Pricing Modification Detected:</strong>
              Changing the client charge from &pound;{careRequest.agreedClientWeeklyFee} to &pound;{agreedWeeklyCharge} will create a new numbered version (e.g. v1.1) and reset the approval status to <strong>Awaiting client approval</strong>. Earlier client acceptance does not apply to modified pricing.
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 text-xs">
          {/* Agreed Charges & Additional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4AF7A]/40 space-y-2">
              <label className="block text-xs font-semibold text-[#060D1E]">
                Agreed Client Weekly Charge (&pound;/wk)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">&pound;</span>
                <input
                  type="number"
                  value={agreedWeeklyCharge}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Current approved: &pound;{careRequest.agreedClientWeeklyFee}/wk
              </span>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4AF7A]/40 space-y-2">
              <label className="block text-xs font-semibold text-[#060D1E]">
                Food Allowance (&pound;/wk)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">&pound;</span>
                <input
                  type="number"
                  value={additionalAllowance}
                  onChange={(e) => setAdditionalAllowance(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Itemised client food allowance for carer
              </span>
            </div>
          </div>

          {/* Pricing Floor Warning */}
          {agreedWeeklyCharge < standardFloor && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Agreed charge is below standard floor (&pound;{standardFloor}/wk)
              </div>
              <p className="text-[11px] text-rose-700">
                Please document the justification for this concession (e.g. companion level care, introductory period):
              </p>
              <textarea
                rows={2}
                required
                value={belowStandardReason}
                onChange={(e) => setBelowStandardReason(e.target.value)}
                placeholder="Mandatory rationale for audit review..."
                className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs"
              />
            </div>
          )}

          {/* Personnel & Channel Details */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-800">Negotiation &amp; Agreement Context</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Negotiator Name</label>
                <input
                  type="text"
                  value={negotiatorName}
                  onChange={(e) => setNegotiatorName(e.target.value)}
                  className="w-full p-2 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Communication Channel</label>
                <select
                  value={communicationChannel}
                  onChange={(e) =>
                    setCommunicationChannel(
                      e.target.value as 'Phone' | 'Email' | 'In-person' | 'Website' | 'WhatsApp'
                    )
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-lg"
                >
                  <option value="Phone">Telephone Conversation</option>
                  <option value="Email">Email Correspondence</option>
                  <option value="In-person">In-person Assessment</option>
                  <option value="Website">Website Submission</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">
                  Client / Representative
                </label>
                <input
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full p-2 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record fee discussion notes, agreed billing frequencies, or special instructions..."
                  className="w-full p-2 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E2D8C3]">
          <span className="text-[11px] text-slate-500">
            Recorded in platform audit log
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4 text-[#D4AF7A]" />
              Save Pricing Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
