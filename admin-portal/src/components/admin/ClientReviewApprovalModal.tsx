import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Info,
  Shield,
  Coins,
  Calendar,
  Pill,
  Heart,
  Home,
  MessageSquare,
} from 'lucide-react';
import { usePlatformStore, CareRequestRecord } from '../../data/platformStore';

interface ClientReviewApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  careRequest: CareRequestRecord;
  onApproved: () => void;
  onRequestCorrections: (notes: string) => void;
}

export const ClientReviewApprovalModal: React.FC<ClientReviewApprovalModalProps> = ({
  isOpen,
  onClose,
  careRequest,
  onApproved,
  onRequestCorrections,
}) => {
  const { approveCareRequestByClient, requestCareRequestCorrections } = usePlatformStore();

  // Declarations must ALL initially be unticked
  const [dec1, setDec1] = useState(false);
  const [dec2, setDec2] = useState(false);
  const [dec3, setDec3] = useState(false);
  const [dec4, setDec4] = useState(false);
  const [dec5, setDec5] = useState(false);
  const [dec6, setDec6] = useState(false);

  // Approver details
  const [approverName, setApproverName] = useState('Mrs. Eleanor Briggs');
  const [approverRole, setApproverRole] = useState<'client' | 'authorised_representative'>('client');
  const [relationshipDetails, setRelationshipDetails] = useState('');
  const [approverEmail, setApproverEmail] = useState(
    careRequest.emailAddress || 'eleanor.briggs@example.co.uk'
  );

  // Corrections state
  const [isRequestingCorrections, setIsRequestingCorrections] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [clientModalError, setClientModalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const allDeclarationsChecked = dec1 && dec2 && dec3 && dec4 && dec5 && dec6;

  const handleApprove = () => {
    setClientModalError(null);
    if (!allDeclarationsChecked) {
      setClientModalError('All 6 statutory declarations must be reviewed and ticked to submit approval.');
      return;
    }
    if (!approverName.trim()) {
      setClientModalError('Please enter the approver’s full name.');
      return;
    }

    approveCareRequestByClient(careRequest.id, {
      approverName,
      capacity: approverRole === 'client' ? 'Client' : 'Authorised Representative',
      relationBasis:
        relationshipDetails || (approverRole === 'client' ? 'Client direct' : 'Lasting Power of Attorney'),
      email: approverEmail,
      declarations: [
        'Authority confirmed',
        'Information accuracy verified',
        'Secure carer sharing acknowledged',
        'Clinical confirmation responsibility acknowledged',
        `Client charges (£${careRequest.agreedClientWeeklyFee}/wk) confirmed`,
        'Authorisation for matching and publication granted',
      ],
    });

    onApproved();
    onClose();
  };

  const handleSendCorrections = () => {
    setClientModalError(null);
    if (!correctionNotes.trim()) {
      setClientModalError('Please explain what needs correcting or updating.');
      return;
    }
    requestCareRequestCorrections(careRequest.id, correctionNotes, approverName);
    onRequestCorrections(correctionNotes);
    onClose();
  };

  const currentVersionNumber = careRequest.version || 'v1.0';
  const preparedDate = careRequest.pricingNotes?.agreementDate || '12 Oct 2024, 11:30';
  const preparedBy = careRequest.pricingNotes?.enteredBy || 'Jessica Smith (Admin)';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF7A]/30 my-8 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2D8C3]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-[#060D1E]">
                Client Information Review &amp; Statutory Authorisation
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium border border-amber-300">
                {currentVersionNumber} &bull; Awaiting Client Approval
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory verification portal. The complete care request record is displayed below. Admin entering information does NOT count as client approval.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {clientModalError && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{clientModalError}</span>
          </div>
        )}

        {/* Audit Metadata Banner */}
        <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
          <div>
            <span className="text-slate-400 text-[10px] block">Reference</span>
            <strong className="text-[#060D1E] font-mono">{careRequest.id}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Version</span>
            <strong className="text-[#060D1E]">{currentVersionNumber}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Prepared by</span>
            <strong className="text-[#060D1E]">{preparedBy}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Prepared on</span>
            <strong className="text-[#060D1E]">{preparedDate}</strong>
          </div>
        </div>

        {/* Complete Information Display BEFORE Declarations */}
        <div className="mt-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#E2D8C3] pb-2">
            <h3 className="font-serif font-bold text-sm text-[#060D1E]">
              Complete Care Record Awaiting Review
            </h3>
            <button
              onClick={() => window.print()}
              className="text-[11px] text-[#B88E3E] font-medium hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download / Print Official Copy
            </button>
          </div>

          {/* Section A: Client & Care Requirements */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#B88E3E]" />
              Care Requirements &amp; Medical Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Client Name &amp; Age</span>
                <span className="font-medium text-slate-900">
                  {careRequest.displayTitle} ({careRequest.age} years old)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Placement Type &amp; Dates</span>
                <span className="font-medium text-slate-900">
                  {careRequest.placementType} &bull; Start: {careRequest.preferredStart}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Core Care Needs &amp; Goals</span>
                <span>{careRequest.careGoals || 'Personal care, mobility support, and companionship.'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Health Conditions</span>
                <span>{careRequest.conditions?.join(', ') || 'Hypertension, mobility frailty.'}</span>
              </div>
            </div>
          </div>

          {/* Section B: Clinical Medication & Allergies */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2">
            <div className="font-semibold text-amber-900 text-xs flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-700" />
              Medication Information, Timings &amp; Allergies
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Medication Details &amp; Support</span>
                <span className="font-mono text-xs text-slate-900">
                  {careRequest.medicationSupport || 'Amlodipine 5mg (08:00), Paracetamol 1g PRN'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Allergies</span>
                <span className="text-slate-900 font-medium">
                  {careRequest.aboutClient?.includes('Allergies:')
                    ? careRequest.aboutClient.split('Allergies:')[1]
                    : 'Penicillin (rash). No known food allergies.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section C: Accommodation */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
              <Home className="w-4 h-4 text-[#B88E3E]" />
              Accommodation Provided for Live-in Carer
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Bedroom Type</span>
                <span className="font-medium text-emerald-800">
                  {careRequest.accommodation?.bedroomType || 'Private bedroom (sole occupancy)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Bathroom</span>
                <span>{careRequest.accommodation?.bathroomType || 'Private bathroom'}</span>
              </div>
            </div>
          </div>

          {/* Section D: Agreed Client Charges */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4AF7A]/50 space-y-2">
            <div className="font-semibold text-[#060D1E] text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#B88E3E]" />
                Agreed Client Charges
              </span>
              <span className="text-base font-serif font-bold text-[#B88E3E]">
                &pound;{careRequest.agreedClientWeeklyFee || 1450} / week
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The weekly charge for live-in care under this agreement is &pound;
              {careRequest.agreedClientWeeklyFee || 1450}. Food allowance of &pound;
              {careRequest.foodAllowance || 50}/week is provided by the client/household directly for the carer.
            </p>
          </div>
        </div>

        {/* Request Corrections Drawer / Section */}
        {isRequestingCorrections ? (
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-xs text-amber-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                Request Corrections to this Care Request
              </h4>
              <button
                onClick={() => setIsRequestingCorrections(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
            <p className="text-[11px] text-amber-800">
              Please specify any details that are incorrect, outdated, or incomplete. Admin will update the record and issue an amended version for approval.
            </p>
            <textarea
              rows={3}
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              placeholder="e.g. Please update medication dosage for Ramipril to 5mg, and correct preferred start date to 1st December..."
              className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none"
            />
            <button
              onClick={handleSendCorrections}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900"
            >
              Submit Correction Request
            </button>
          </div>
        ) : null}

        {/* Declarations & Authorisation Section */}
        <div className="mt-8 border-t-2 border-[#D4AF7A]/30 pt-6 space-y-5">
          <div>
            <h3 className="font-serif font-bold text-base text-[#060D1E] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#B88E3E]" />
              Client Information Review and Statutory Authorisation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please review each declaration carefully. All required checkboxes must be completed before submission.
            </p>
          </div>

          {/* Warning Banner: Admin cannot tick on client's behalf */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              <strong>Safeguarding &amp; Governance Guard:</strong> Administrative staff must not tick these declarations or submit approval on the client’s behalf. Approval must be executed directly by the client or their legally authorised representative.
            </p>
          </div>

          {/* The 6 Statutory Declarations (Verbatim) */}
          <div className="space-y-3.5 text-xs text-slate-700">
            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec1}
                onChange={(e) => setDec1(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I confirm that I am the client or am appropriately authorised to review this information and give this authorisation on the client’s behalf. Where acting as a representative, I have provided my relationship to the client and the basis of my authority.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec2}
                onChange={(e) => setDec2(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I have reviewed the complete client profile and care request identified below, including information entered by Grace &amp; Goodwill on my behalf. To the best of my knowledge, it is accurate, complete, current and correctly reflects the information supplied. I have requested correction of any errors or omissions before approving.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec3}
                onChange={(e) => setDec3(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I understand that relevant approved information will be shared securely with carers considering or undertaking the placement, in accordance with the Privacy Policy and applicable access controls. I understand that carers may rely on this information when considering the placement and preparing for and providing day-to-day support.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec4}
                onChange={(e) => setDec4(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I understand my responsibility to provide accurate information, check information entered on my behalf and promptly report changes, particularly changes affecting health conditions, medication, allergies, care requirements or safety. Where information requires clinical confirmation, I will seek this from the appropriate healthcare professional.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec5}
                onChange={(e) => setDec5(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I confirm that I have reviewed and agree to the client charges expressly listed in this version, including the weekly charge of &pound;
                {careRequest.agreedClientWeeklyFee || 1450} and any additional charges identified.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-slate-200 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dec6}
                onChange={(e) => setDec6(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#B88E3E] shrink-0"
              />
              <span className="leading-relaxed">
                I authorise Grace &amp; Goodwill to make this approved version live for matching and to share relevant information for that purpose. I understand that this approval does not itself confirm a placement or authorise medication or treatment changes.
              </span>
            </label>
          </div>

          {/* Legal Reliance Footnote */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed italic">
            Grace &amp; Goodwill relies on information supplied by clients and their authorised representatives. Your approval records your confirmation of this version; it does not remove Grace &amp; Goodwill’s responsibility to record information with reasonable care, correct identified errors or meet its legal obligations.
          </div>

          {/* Approver Details Form */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D8C3] space-y-3 text-xs">
            <h4 className="font-semibold text-slate-800">Approver Identity &amp; Authority Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Approver’s Full Name</label>
                <input
                  type="text"
                  required
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Approving As</label>
                <select
                  value={approverRole}
                  onChange={(e) => setApproverRole(e.target.value as any)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800"
                >
                  <option value="client">Client directly</option>
                  <option value="authorised_representative">Authorised Representative / Family</option>
                </select>
              </div>

              {approverRole === 'authorised_representative' && (
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">
                    Relationship and Basis of Authority
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daughter holding registered Lasting Power of Attorney (Health & Welfare)"
                    value={relationshipDetails}
                    onChange={(e) => setRelationshipDetails(e.target.value)}
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">
                  Verified Email Address for Electronic Confirmation
                </label>
                <input
                  type="email"
                  required
                  value={approverEmail}
                  onChange={(e) => setApproverEmail(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Mandatory Electronic Signature Text Immediately Above Button */}
          <div className="p-3 bg-amber-50/70 border border-amber-300/80 rounded-xl text-center text-xs text-amber-950 font-medium">
            “By ticking the declarations above and selecting ‘Agree and approve for publication’, you confirm that you have read, understood and agree to the information and terms set out in this version. This will be recorded as your electronic acceptance.”
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsRequestingCorrections(true)}
              className="text-xs font-semibold text-slate-600 hover:text-amber-800 underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Request Corrections
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs"
              >
                Close
              </button>

              <button
                type="button"
                disabled={!allDeclarationsChecked}
                onClick={handleApprove}
                className="px-6 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] disabled:opacity-40 text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <FileCheck className="w-4 h-4 text-[#D4AF7A]" />
                Agree and approve for publication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
