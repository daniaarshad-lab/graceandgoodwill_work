import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  Shield,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Home,
  Check,
  AlertTriangle,
  Info,
  Sparkles,
  BedDouble,
  Pill,
  Heart,
  Clock,
  Radio,
} from 'lucide-react';
import {
  usePlatformStore,
  CareRequestRecord,
  SOLE_OCCUPANCY_BEDROOM,
} from '../../data/platformStore';

interface CreateCareRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClientId?: string;
  onSuccess: (newReqId: string) => void;
}

export const CreateCareRequestModal: React.FC<CreateCareRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedClientId,
  onSuccess,
}) => {
  const { createCareRequest, placements, platformSettings } = usePlatformStore();

  // Mode: select existing or new client
  const [clientType, setClientType] = useState<'existing' | 'new'>(
    preselectedClientId ? 'existing' : 'existing'
  );
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(
    preselectedClientId || placements[0]?.id || ''
  );

  // Form Fields
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientSurname, setClientSurname] = useState('');
  const [clientAge, setClientAge] = useState<number>(82);
  const [location, setLocation] = useState('Hertfordshire');
  const [residentialAddress, setResidentialAddress] = useState('42 Highfield Lane, St Albans');
  const [telephoneNumber, setTelephoneNumber] = useState('01727 849201');
  const [emailAddress, setEmailAddress] = useState('client@example.co.uk');

  const [informationSource, setInformationSource] = useState<'phone' | 'email' | 'in_person' | 'website'>('phone');
  const [representativeName, setRepresentativeName] = useState('Daughter (Authorised Representative)');
  const [representativeContact, setRepresentativeContact] = useState('07700 900452');

  const [placementType, setPlacementType] = useState<'Live-in Ongoing Care' | 'Live-in Respite Care'>('Live-in Ongoing Care');
  const [preferredStart, setPreferredStart] = useState('From 15 November 2024');
  const [duration, setDuration] = useState('Ongoing live-in care (2-week rotation)');

  // Clinical & Care Details
  const [careNeeds, setCareNeeds] = useState('Personal care support, medication prompt, meal preparation, mobility companionship.');
  const [healthConditions, setHealthConditions] = useState('Mild cognitive impairment, controlled hypertension, osteoarthritis in knees.');
  const [medicationDetails, setMedicationDetails] = useState('Amlodipine 5mg morning, Paracetamol 1g PRN, Ramipril 2.5mg evening.');
  const [allergies, setAllergies] = useState('Penicillin (rash). No known food allergies.');
  const [dailyRoutines, setDailyRoutines] = useState('Wakes 08:00, enjoys morning tea in conservatory, afternoon stroll in garden, lights out 22:00.');

  // Accommodation
  const [privateBedroomConfirmed, setPrivateBedroomConfirmed] = useState(true);
  const [bathroomType, setBathroomType] = useState('En-suite bathroom with walk-in shower');
  const [householdNotes, setHouseholdNotes] = useState('Quiet detached bungalow. High-speed Wi-Fi, private TV in carer bedroom.');

  // Pricing & Remuneration
  const standardFloor = platformSettings.standardWeeklyPriceFloor || 1200;
  const [agreedWeeklyFee, setAgreedWeeklyFee] = useState<number>(1450);
  const [weeklyPayment, setWeeklyPayment] = useState<number>(950);
  const [foodAllowance, setFoodAllowance] = useState<number>(50);
  const [pricingFloorReason, setPricingFloorReason] = useState('');

  // Distribution Option on Approval
  const [distributionOption, setDistributionOption] = useState<
    'broadcast_all' | 'private_selected' | 'direct_carer_acceptance'
  >('broadcast_all');

  const [initialAction, setInitialAction] = useState<'draft' | 'send_approval'>('send_approval');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let targetTitle = `${clientFirstName} ${clientSurname}`.trim();
    let targetLoc = location;
    let targetAge = clientAge;
    let targetPhone = telephoneNumber;
    let targetEmail = emailAddress;

    if (clientType === 'existing') {
      const pl = placements.find((p) => p.id === selectedPlacementId);
      if (pl) {
        targetTitle = `${pl.clientFirstName} ${pl.clientSurname}`;
        targetLoc = pl.location;
        targetAge = pl.age;
        targetPhone = pl.telephoneNumber;
        targetEmail = pl.emailAddress;
      }
    }

    if (!targetTitle) {
      setErrorMessage('Please specify the client name.');
      return;
    }

    if (agreedWeeklyFee < standardFloor && !pricingFloorReason.trim()) {
      setErrorMessage(`The agreed weekly charge (£${agreedWeeklyFee}) is below the standard floor (£${standardFloor}/wk). A documented justification is required.`);
      return;
    }

    const newRecord = createCareRequest({
      displayTitle: targetTitle,
      clientFirstName: clientFirstName || targetTitle.split(' ')[0],
      clientSurname: clientSurname || targetTitle.split(' ').slice(1).join(' '),
      age: targetAge,
      location: targetLoc,
      residentialAddress,
      telephoneNumber: targetPhone,
      emailAddress: targetEmail,
      creationSource:
        informationSource === 'phone'
          ? 'Phone'
          : informationSource === 'email'
          ? 'Email'
          : informationSource === 'in_person'
          ? 'In-person'
          : 'Website',
      placementType,
      preferredStart,
      duration,
      careGoals: careNeeds,
      conditions: [healthConditions],
      personalCare: [careNeeds],
      medicationSupport: medicationDetails,
      aboutClient: `${dailyRoutines} Allergies: ${allergies}`,
      accommodation: {
        privateBedroomConfirmed,
        bedroomType: SOLE_OCCUPANCY_BEDROOM,
        bathroomType,
        showerType: 'Walk-in Shower',
        householdNotes,
        photos: [],
        adminVerified: true,
      },
      agreedClientWeeklyFee: agreedWeeklyFee,
      weeklyPayment,
      foodAllowance,
      distributionOption:
        distributionOption === 'broadcast_all'
          ? 'broadcast'
          : distributionOption === 'private_selected'
          ? 'private_selected'
          : 'direct_carer',
      approvalStatus: initialAction === 'send_approval' ? 'Awaiting client approval' : 'Draft',
      pricingNotes: {
        agreedWeeklyCharge: agreedWeeklyFee,
        additionalCharges: [{ label: 'Food Allowance', amount: foodAllowance }],
        negotiatedBy: 'Jessica Smith',
        enteredBy: 'Jessica Smith',
        agreedOnClientBehalfBy: representativeName,
        agreementDate: new Date().toLocaleDateString('en-GB'),
        communicationChannel: informationSource === 'phone' ? 'Phone' : 'Email',
        belowStandardReason: agreedWeeklyFee < standardFloor ? pricingFloorReason : undefined,
        notes: [
          {
            id: 'n-' + Date.now(),
            author: 'Jessica Smith',
            authorRole: 'Admin',
            timestamp: new Date().toLocaleDateString('en-GB'),
            text: `Care request created by admin via ${informationSource}. Client agreed charge: £${agreedWeeklyFee}/wk.`,
          },
        ],
      },
    });

    onSuccess(newRecord.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF7A]/30 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C3]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-[#060D1E]">
                Create Admin Care Request
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#B88E3E] font-medium border border-[#D4AF7A]/30">
                Staff Entry on Behalf of Client
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Admin entered information requires client checkbox review & approval before publication. Direct admin approval is prohibited.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-5 text-xs">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {/* Section 1: Client Selection & Source */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] space-y-3">
            <h3 className="font-semibold text-xs text-[#060D1E] flex items-center gap-2">
              <User className="w-4 h-4 text-[#B88E3E]" />
              1. Client Selection &amp; Information Source
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Record Type</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="clientType"
                      checked={clientType === 'existing'}
                      onChange={() => setClientType('existing')}
                      className="accent-[#B88E3E]"
                    />
                    <span>Select Existing Client</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="clientType"
                      checked={clientType === 'new'}
                      onChange={() => setClientType('new')}
                      className="accent-[#B88E3E]"
                    />
                    <span>Create New Client Record</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Information Source</label>
                <select
                  value={informationSource}
                  onChange={(e) => setInformationSource(e.target.value as any)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800 focus:outline-none"
                >
                  <option value="phone">Telephone Consultation with Client / Family</option>
                  <option value="email">Email Request &amp; Completed Intake Document</option>
                  <option value="in_person">In-person / Hospital Discharge Assessment</option>
                  <option value="website">Direct Website Form Submission</option>
                </select>
              </div>
            </div>

            {clientType === 'existing' ? (
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Select Client</label>
                <select
                  value={selectedPlacementId}
                  onChange={(e) => setSelectedPlacementId(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-slate-800 font-medium focus:outline-none"
                >
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientFirstName} {p.clientSurname} (Age {p.age}, {p.location}) — Current Ref: {p.id}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Client First Name</label>
                  <input
                    type="text"
                    required
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="e.g. Margaret"
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Client Surname</label>
                  <input
                    type="text"
                    required
                    value={clientSurname}
                    onChange={(e) => setClientSurname(e.target.value)}
                    placeholder="e.g. Lewis"
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    value={clientAge}
                    onChange={(e) => setClientAge(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Client / Representative Email</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="For secure approval link delivery"
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Client / Representative Phone</label>
                <input
                  type="text"
                  value={telephoneNumber}
                  onChange={(e) => setTelephoneNumber(e.target.value)}
                  placeholder="For WhatsApp sharing notification"
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Care, Clinical & Daily Routines */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] space-y-3">
            <h3 className="font-semibold text-xs text-[#060D1E] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#B88E3E]" />
              2. Care Requirements, Clinical Profile &amp; Medication
            </h3>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Core Care Requirements &amp; Goals</label>
              <textarea
                rows={2}
                value={careNeeds}
                onChange={(e) => setCareNeeds(e.target.value)}
                className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Health &amp; Medical Conditions</label>
                <textarea
                  rows={2}
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Medication Names, Doses &amp; Support Required
                </label>
                <textarea
                  rows={2}
                  value={medicationDetails}
                  onChange={(e) => setMedicationDetails(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Allergies (Clinical &amp; Dietary)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Daily Routines &amp; Preferences</label>
                <input
                  type="text"
                  value={dailyRoutines}
                  onChange={(e) => setDailyRoutines(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Accommodation (Mandatory private bedroom check) */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] space-y-3">
            <h3 className="font-semibold text-xs text-[#060D1E] flex items-center gap-2">
              <Home className="w-4 h-4 text-[#B88E3E]" />
              3. Accommodation Arrangements
            </h3>

            <div className="p-3 bg-white rounded-xl border border-[#D4AF7A]/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Private Bedroom (Sole Occupancy) Confirmed
                </span>
                <span className="text-[11px] text-slate-500">
                  Regulatory requirement for all Grace &amp; Goodwill live-in placements.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privateBedroomConfirmed}
                onChange={(e) => setPrivateBedroomConfirmed(e.target.checked)}
                className="w-4 h-4 accent-[#B88E3E] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Bathroom Facility</label>
                <input
                  type="text"
                  value={bathroomType}
                  onChange={(e) => setBathroomType(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Household Notes / Wi-Fi</label>
                <input
                  type="text"
                  value={householdNotes}
                  onChange={(e) => setHouseholdNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Agreed Pricing & Remuneration */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] space-y-3">
            <h3 className="font-semibold text-xs text-[#060D1E] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#B88E3E]" />
              4. Pricing, Remuneration &amp; Floor Check
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Agreed Client Weekly Charge (&pound;/wk)
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-500">&pound;</span>
                  <input
                    type="number"
                    value={agreedWeeklyFee}
                    onChange={(e) => setAgreedWeeklyFee(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Carer Weekly Remuneration (&pound;/wk)
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-500">&pound;</span>
                  <input
                    type="number"
                    value={weeklyPayment}
                    onChange={(e) => setWeeklyPayment(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Carer Food Allowance (&pound;/wk)
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-500">&pound;</span>
                  <input
                    type="number"
                    value={foodAllowance}
                    onChange={(e) => setFoodAllowance(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {agreedWeeklyFee < standardFloor && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Agreed charge is below standard floor (&pound;{standardFloor}/wk)
                </div>
                <p className="text-[11px] text-rose-700">
                  Please record the clinical or contractual rationale for this fee reduction.
                </p>
                <input
                  type="text"
                  required
                  placeholder="e.g. Companion-only arrangement, low clinical dependency approved by Super Admin"
                  value={pricingFloorReason}
                  onChange={(e) => setPricingFloorReason(e.target.value)}
                  className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Section 5: Distribution & Approval Actions */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D8C3] space-y-3">
            <h3 className="font-semibold text-xs text-[#060D1E] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#B88E3E]" />
              5. Post-Approval Distribution Option
            </h3>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                  distributionOption === 'broadcast_all'
                    ? 'border-[#B88E3E] bg-white font-medium shadow-xs'
                    : 'border-slate-200 bg-white/60'
                }`}
              >
                <input
                  type="radio"
                  name="distOption"
                  checked={distributionOption === 'broadcast_all'}
                  onChange={() => setDistributionOption('broadcast_all')}
                  className="mt-0.5 accent-[#B88E3E]"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Once approved, publish to all eligible carers for applications
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Triggers Komal's automated broadcast email notification to all verified, matching carers.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                  distributionOption === 'private_selected'
                    ? 'border-[#B88E3E] bg-white font-medium shadow-xs'
                    : 'border-slate-200 bg-white/60'
                }`}
              >
                <input
                  type="radio"
                  name="distOption"
                  checked={distributionOption === 'private_selected'}
                  onChange={() => setDistributionOption('private_selected')}
                  className="mt-0.5 accent-[#B88E3E]"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Once approved, share privately with selected carers
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Does NOT trigger general broadcast. Sent exclusively to hand-selected carers.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                  distributionOption === 'direct_carer_acceptance'
                    ? 'border-[#B88E3E] bg-white font-medium shadow-xs'
                    : 'border-slate-200 bg-white/60'
                }`}
              >
                <input
                  type="radio"
                  name="distOption"
                  checked={distributionOption === 'direct_carer_acceptance'}
                  onChange={() => setDistributionOption('direct_carer_acceptance')}
                  className="mt-0.5 accent-[#B88E3E]"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Record existing carer's acceptance &amp; progress to placement confirmation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    For returning carers or pre-arranged private allocations.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2D8C3]">
            <div className="text-[11px] text-slate-500">
              Admin entry creates Version 1.0 (dated {new Date().toLocaleDateString('en-GB')}).
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={() => setInitialAction('draft')}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-medium"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                onClick={() => setInitialAction('send_approval')}
                className="px-5 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] text-[#FAF7F2] rounded-xl font-semibold flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF7A]" />
                Send to Client for Review &amp; Checkbox Approval
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
