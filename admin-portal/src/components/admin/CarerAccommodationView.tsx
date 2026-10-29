import React, { useRef, useState } from 'react';
import {
  BedDouble,
  ShowerHead,
  Camera,
  Upload,
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Trash2,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import {
  AccommodationPhotoCategory,
  AccommodationPhotoItem,
  getAccommodationApprovalStatus,
  getAccommodationPhotoItems,
  SHARED_CARER_BEDROOM,
  SOLE_OCCUPANCY_BEDROOM,
  usePlatformStore,
} from '../../data/platformStore';

interface CarerAccommodationViewProps {
  requestId?: string;
  onBack: () => void;
  onOpenAdminReview?: () => void;
}

const SAMPLE_SLOT_PHOTOS: Record<AccommodationPhotoCategory, string> = {
  'Carer Bedroom':
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
  Bathroom:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  'Additional Space':
    'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&auto=format&fit=crop&q=80',
};

const BATHROOM_OPTIONS = [
  'Private bathroom',
  'Ensuite bathroom',
  'Shared bathroom with client',
  'Shared bathroom with household',
  'Other, please specify',
];

const SHOWER_OPTIONS = [
  'Private',
  'En-suite',
  'Shared with client',
  'Shared with household',
  'Other, please specify',
];

export const CarerAccommodationView: React.FC<CarerAccommodationViewProps> = ({
  requestId,
  onBack,
  onOpenAdminReview,
}) => {
  const { careRequests, updateCareRequest } = usePlatformStore();

  const [selectedReqId, setSelectedReqId] = useState<string>(
    requestId || careRequests[0]?.id || 'cr-doris'
  );

  const currentReq =
    careRequests.find((r) => r.id === selectedReqId) || careRequests[0];

  const [hasPrivateBedroom, setHasPrivateBedroom] = useState<boolean>(
    currentReq?.accommodation.privateBedroomConfirmed ?? true
  );
  const [multipleCarersInHousehold, setMultipleCarersInHousehold] = useState<boolean>(
    Boolean(currentReq?.accommodation.multipleCarersInHousehold)
  );
  const [bedroomType, setBedroomType] = useState<string>(
    currentReq?.accommodation.bedroomType === SHARED_CARER_BEDROOM
      ? SHARED_CARER_BEDROOM
      : SOLE_OCCUPANCY_BEDROOM
  );
  const [bathroomType, setBathroomType] = useState<string>(
    currentReq?.accommodation.bathroomType === 'Other – please specify'
      ? 'Other, please specify'
      : currentReq?.accommodation.bathroomType || 'Private bathroom'
  );
  const [bathroomOther, setBathroomOther] = useState<string>(
    currentReq?.accommodation.bathroomOtherDetails || ''
  );
  const [showerType, setShowerType] = useState<string>(
    currentReq?.accommodation.showerType === 'Other – please specify'
      ? 'Other, please specify'
      : currentReq?.accommodation.showerType || 'Private'
  );
  const [showerOther, setShowerOther] = useState<string>(
    currentReq?.accommodation.showerOtherDetails || ''
  );

  // Local working list of client accommodation photos synced on save/remove
  const [workingPhotos, setWorkingPhotos] = useState<AccommodationPhotoItem[]>(() =>
    currentReq ? getAccommodationPhotoItems(currentReq.accommodation) : []
  );

  // Track whether client added or replaced photos in this session requiring active consent
  const [hasNewClientUploads, setHasNewClientUploads] = useState<boolean>(false);

  // Requirement 1: Mandatory consent checkbox MUST NOT be preselected (strictly false by default)
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Switch client profile if user changes client selector
  const handleSelectClient = (nextId: string) => {
    setSelectedReqId(nextId);
    const nextReq = careRequests.find((r) => r.id === nextId);
    if (!nextReq) return;
    setHasPrivateBedroom(nextReq.accommodation.privateBedroomConfirmed);
    setMultipleCarersInHousehold(Boolean(nextReq.accommodation.multipleCarersInHousehold));
    setBedroomType(
      nextReq.accommodation.bedroomType === SHARED_CARER_BEDROOM
        ? SHARED_CARER_BEDROOM
        : SOLE_OCCUPANCY_BEDROOM
    );
    setBathroomType(
      nextReq.accommodation.bathroomType === 'Other – please specify'
        ? 'Other, please specify'
        : nextReq.accommodation.bathroomType
    );
    setBathroomOther(nextReq.accommodation.bathroomOtherDetails || '');
    setShowerType(
      nextReq.accommodation.showerType === 'Other – please specify'
        ? 'Other, please specify'
        : nextReq.accommodation.showerType
    );
    setShowerOther(nextReq.accommodation.showerOtherDetails || '');
    setWorkingPhotos(getAccommodationPhotoItems(nextReq.accommodation));
    setHasNewClientUploads(false);
    setConsentChecked(false);
    setValidationError(null);
  };

  // Helper to get primary slot item for each of the 3 main slots matching the illustration
  const primarySlots: {
    slotKey: string;
    category: AccommodationPhotoCategory;
    uploadLabel: string;
    replaceLabel: string;
  }[] = [
    {
      slotKey: 'slot-bedroom',
      category: 'Carer Bedroom',
      uploadLabel: 'Upload carer bedroom photo',
      replaceLabel: 'Replace carer bedroom photo',
    },
    {
      slotKey: 'slot-bathroom',
      category: 'Bathroom',
      uploadLabel: 'Upload bathroom photo',
      replaceLabel: 'Replace bathroom photo',
    },
    {
      slotKey: 'slot-additional',
      category: 'Additional Space',
      uploadLabel: 'Upload additional photo',
      replaceLabel: 'Replace additional photo',
    },
  ];

  const getPrimaryPhotoForCategory = (category: AccommodationPhotoCategory) =>
    workingPhotos.find((p) => p.category === category);

  const extraAdditionalPhotos = workingPhotos.filter((p, idx) => {
    if (p.category !== 'Additional Space') return false;
    const firstAdditionalIdx = workingPhotos.findIndex(
      (item) => item.category === 'Additional Space'
    );
    return idx !== firstAdditionalIdx;
  });

  // Client uploads or replaces a photo -> enters pending_approval and requires active consent checkbox
  const applyClientPhotoUpload = (
    url: string,
    category: AccommodationPhotoCategory,
    replacePhotoId?: string
  ) => {
    const newItem: AccommodationPhotoItem = {
      id: `client-ph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url,
      category,
      uploadedBy: 'client',
      uploadedAt: 'Just now',
      status: 'pending_approval',
      consentConfirmed: false,
    };

    setWorkingPhotos((prev) => {
      if (replacePhotoId) {
        return prev.map((item) => (item.id === replacePhotoId ? newItem : item));
      }
      return [...prev, newItem];
    });

    // Require client to actively tick consent for newly uploaded/replaced photos
    setHasNewClientUploads(true);
    setConsentChecked(false);
    setValidationError(null);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: AccommodationPhotoCategory,
    replacePhotoId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyClientPhotoUpload(reader.result, category, replacePhotoId);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Requirement 6: Clients can remove their accommodation photographs at any time
  const handleRemovePhoto = (photoId: string) => {
    const nextPhotos = workingPhotos.filter((p) => p.id !== photoId);
    setWorkingPhotos(nextPhotos);

    // Immediately sync removal to store so removed photos disappear from profile & carers right away
    if (currentReq) {
      updateCareRequest(currentReq.id, (prev) => ({
        ...prev,
        accommodation: {
          ...prev.accommodation,
          photoItems: nextPhotos,
        },
      }));
    }

    const stillHasUnconsented = nextPhotos.some(
      (p) => p.uploadedBy === 'client' && !p.consentConfirmed
    );
    if (!stillHasUnconsented) {
      setHasNewClientUploads(false);
    }
    setValidationError(null);
    showToast('Photograph removed from your accommodation profile.');
  };

  // Submit / Next Step handler enforcing Rules 1, 3, 4, 6
  const handleSubmitAccommodation = (isDraftSave: boolean) => {
    setValidationError(null);

    if (!hasPrivateBedroom) {
      setValidationError(
        'Compulsory requirement: Please confirm that the live-in carer will have their own private bedroom for the duration of the placement.'
      );
      return;
    }

    // Requirement 1 & 3: Consent checkbox is ONLY mandatory if the client chooses to upload photographs
    const hasAnyPhotosToSubmit =
      workingPhotos.length > 0 &&
      (hasNewClientUploads ||
        workingPhotos.some((p) => p.uploadedBy === 'client' && p.status === 'pending_approval'));

    if (!isDraftSave && hasAnyPhotosToSubmit && !consentChecked) {
      setValidationError(
        'Please tick the photograph confirmation checkbox below to confirm your consent before submitting accommodation photographs, or remove the photographs if you prefer to proceed without them.'
      );
      return;
    }

    if (!currentReq) return;

    const finalizedItems = workingPhotos.map((item) =>
      item.uploadedBy === 'client' && consentChecked
        ? { ...item, consentConfirmed: true }
        : item
    );

    const hasPendingForAdmin = finalizedItems.some((item) => item.status === 'pending_approval');
    const resolvedBedroomType =
      multipleCarersInHousehold && bedroomType === SHARED_CARER_BEDROOM
        ? SHARED_CARER_BEDROOM
        : SOLE_OCCUPANCY_BEDROOM;

    updateCareRequest(currentReq.id, (prev) => ({
      ...prev,
      lastUpdated: 'Just now',
      accommodation: {
        ...prev.accommodation,
        privateBedroomConfirmed: hasPrivateBedroom,
        multipleCarersInHousehold,
        bedroomType: resolvedBedroomType,
        bothCarersAgreedSharedBedroom:
          resolvedBedroomType === SHARED_CARER_BEDROOM
            ? prev.accommodation.bothCarersAgreedSharedBedroom
            : false,
        bathroomType,
        bathroomOtherDetails: bathroomType === 'Other, please specify' ? bathroomOther : '',
        showerType,
        showerOtherDetails: showerType === 'Other, please specify' ? showerOther : '',
        photoItems: finalizedItems,
        clientPhotoConsentConfirmed:
          finalizedItems.length > 0 ? consentChecked || prev.accommodation.clientPhotoConsentConfirmed : false,
        // Requirement 4: Carer accommodation remains Pending Approval until Admin reviews client-submitted photos
        adminVerified: hasPendingForAdmin ? false : prev.accommodation.adminVerified,
      },
    }));

    setWorkingPhotos(finalizedItems);
    setHasNewClientUploads(false);

    if (isDraftSave) {
      showToast('Carer accommodation progress saved.');
      return;
    }

    if (hasPendingForAdmin) {
      showToast(
        'Submitted! Client photographs are now Pending Approval in the Admin portal before becoming visible to carers.'
      );
    } else {
      showToast(
        workingPhotos.length === 0
          ? 'Carer accommodation saved without photographs (optional).'
          : 'Carer accommodation details updated.'
      );
    }
  };

  const overallApprovalStatus = currentReq
    ? getAccommodationApprovalStatus({
        ...currentReq.accommodation,
        photoItems: workingPhotos,
      })
    : 'Pending Approval';

  const pendingPhotosCount = workingPhotos.filter((p) => p.status === 'pending_approval').length;

  return (
    <div className="w-full max-w-[1380px] mx-auto px-2 sm:px-4 py-3 space-y-6 select-none">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium border border-[#C5A059]/40 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="leading-relaxed">{toastMsg}</span>
          {pendingPhotosCount > 0 && (
            <button
              onClick={() => (onOpenAdminReview ? onOpenAdminReview() : onBack())}
              className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#0A1629] font-bold whitespace-nowrap cursor-pointer hover:bg-[#D4AF7A]"
            >
              Review as Admin &rarr;
            </button>
          )}
        </div>
      )}

      {/* Top Header Row matching original illustration + Client Switcher / Admin Review shortcut */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-[38px] font-semibold text-[#0A1629] tracking-tight leading-tight">
              Carer Accommodation
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${
                overallApprovalStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {overallApprovalStatus === 'Approved' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Status: {overallApprovalStatus}</span>
            </span>
          </div>
          <p className="text-sm text-[#5C5549] mt-1">
            Please provide details about the live-in carer&apos;s accommodation and personal space.
          </p>
        </div>

        {/* Client Account Selector & Switch to Admin Review */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E2D9C8] text-xs">
            <span className="text-[#64748B] font-medium">Client Profile:</span>
            <select
              value={selectedReqId}
              onChange={(e) => handleSelectClient(e.target.value)}
              className="font-bold text-[#0A1629] bg-transparent focus:outline-none cursor-pointer"
            >
              {careRequests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.displayTitle} ({r.location})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAdminReview || onBack}
            className="px-3.5 py-2 rounded-xl bg-[#0A1629] hover:bg-[#152542] text-[#EBD8B2] border border-[#D4AF7A]/40 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF7A]" />
            <span>
              Admin Review Portal{pendingPhotosCount > 0 ? ` (${pendingPhotosCount} Pending)` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* 5-Step Connected Horizontal Stepper matching original illustration */}
      <div className="py-2 px-2 sm:px-8">
        <div className="relative flex items-start justify-between">
          {/* Connecting Line Behind Circles */}
          <div className="absolute top-3.5 left-[8%] right-[8%] h-[1.5px] bg-[#DDD3C0] z-0" />
          <div className="absolute top-3.5 left-[8%] w-[64%] h-[1.5px] bg-[#C5A059]/60 z-0" />

          {[
            { num: 1, label: 'Basic Information', active: false },
            { num: 2, label: 'Health & Support', active: false },
            { num: 3, label: 'Home Environment', active: false },
            { num: 4, label: 'Carer Space', active: true },
            { num: 5, label: 'Review & Submit', active: false },
          ].map((step) => (
            <div
              key={step.num}
              className="relative z-10 flex flex-col items-center text-center w-1/5"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.active
                    ? 'bg-[#A68242] text-white shadow-sm ring-4 ring-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#5C5549] border border-[#D8CEBC]'
                }`}
              >
                {step.num}
              </div>
              <span
                className={`text-[11px] sm:text-xs mt-1.5 ${
                  step.active ? 'font-bold text-[#0A1629]' : 'text-[#5C5549] font-normal'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{validationError}</span>
        </div>
      )}

      {/* Main Two-Column Layout matching WhatsApp_Image_2026-10-19_at_11.32.14_PM_befbf1cb.jpeg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Soft Cream Outer Container holding Private Bedroom, Bathroom Arrangements & Accommodation Photos */}
        <div className="lg:col-span-8 bg-[#FDFBF7] rounded-2xl border border-[#E6DFD0] p-4 sm:p-5 space-y-5 shadow-2xs">
          {/* 1. Bedroom Arrangements & Mandatory Private Bedroom Requirement Card */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D2] space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                <BedDouble className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#0A1629]">
                  Bedroom Arrangements
                </h2>
                <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                  The live-in carer must have their own private bedroom. Sharing a bedroom with the
                  client or other household members is not permitted.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 pt-1 cursor-pointer group">
              <button
                type="button"
                role="checkbox"
                aria-checked={hasPrivateBedroom}
                onClick={() => setHasPrivateBedroom(!hasPrivateBedroom)}
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                  hasPrivateBedroom
                    ? 'bg-[#0A1629] border-[#0A1629] text-white'
                    : 'bg-white border-[#94A3B8] group-hover:border-[#0A1629]'
                }`}
              >
                {hasPrivateBedroom && <Check className="w-3.5 h-3.5 stroke-[2.6]" />}
              </button>
              <span className="text-xs sm:text-[13px] font-semibold text-[#0A1629]">
                I confirm that the live-in carer will have their own private bedroom for the
                duration of the placement. <span className="text-rose-600">*</span>
              </span>
            </label>

            <div className="rounded-xl border border-[#EAE2D2] bg-[#FDFBF7] p-4 space-y-3">
              <div className="text-xs sm:text-[13px] font-bold text-[#0A1629]">
                Bedroom arrangements
              </div>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={multipleCarersInHousehold}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setMultipleCarersInHousehold(checked);
                    if (!checked) {
                      setBedroomType(SOLE_OCCUPANCY_BEDROOM);
                    }
                  }}
                  className="w-4 h-4 accent-[#0A1629] rounded cursor-pointer"
                />
                <span>Multiple carers are accommodated within the same household</span>
              </label>

              <div className="space-y-2 pt-0.5">
                {(multipleCarersInHousehold
                  ? [SOLE_OCCUPANCY_BEDROOM, SHARED_CARER_BEDROOM]
                  : [SOLE_OCCUPANCY_BEDROOM]
                ).map((opt) => {
                  const selected = bedroomType === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setBedroomType(opt)}
                      className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1E293B] cursor-pointer py-0.5"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                          selected
                            ? 'bg-[#0A1629] border-[#0A1629]'
                            : 'bg-white border-[#CBD5E1]'
                        }`}
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className={selected ? 'font-medium text-[#0A1629]' : ''}>{opt}</span>
                    </label>
                  );
                })}
              </div>

              {multipleCarersInHousehold && bedroomType === SHARED_CARER_BEDROOM && (
                <p className="text-xs text-[#5C5549] bg-[#FAF6EE] border border-[#E6D7B9] rounded-lg p-3 leading-relaxed">
                  Both carers must explicitly agree to this arrangement before the placement is
                  confirmed. Neither carer will be expected or required to share accommodation
                  without their consent.
                </p>
              )}
            </div>
          </div>

          {/* 2. Bathroom Arrangements Card */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D2] space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                <ShowerHead className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#0A1629]">
                  Bathroom Arrangements
                </h2>
                <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                  Please confirm the bathroom and shower arrangements for the live-in carer.
                </p>
              </div>
            </div>

            {/* Two Side-by-Side Sub-Boxes: Left = Bathroom Arrangements, Right = Shower Arrangements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Sub-box A: Bathroom Arrangements */}
              <div className="rounded-xl border border-[#EAE2D2] bg-[#FDFBF7] p-4 space-y-2.5">
                <div className="text-xs sm:text-[13px] font-bold text-[#0A1629] mb-1">
                  Bathroom Arrangements
                </div>
                {BATHROOM_OPTIONS.map((opt) => {
                  const selected = bathroomType === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setBathroomType(opt)}
                      className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1E293B] cursor-pointer py-0.5"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                          selected
                            ? 'bg-[#0A1629] border-[#0A1629]'
                            : 'bg-white border-[#CBD5E1]'
                        }`}
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className={selected ? 'font-medium text-[#0A1629]' : ''}>{opt}</span>
                    </label>
                  );
                })}
                {bathroomType === 'Other, please specify' && (
                  <input
                    type="text"
                    value={bathroomOther}
                    onChange={(e) => setBathroomOther(e.target.value)}
                    placeholder="Please specify bathroom arrangement..."
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                  />
                )}
              </div>

              {/* Sub-box B: Shower Arrangements */}
              <div className="rounded-xl border border-[#EAE2D2] bg-[#FDFBF7] p-4 space-y-2.5">
                <div className="text-xs sm:text-[13px] font-bold text-[#0A1629] mb-1">
                  Shower Arrangements
                </div>
                {SHOWER_OPTIONS.map((opt) => {
                  const selected = showerType === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setShowerType(opt)}
                      className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1E293B] cursor-pointer py-0.5"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                          selected
                            ? 'bg-[#0A1629] border-[#0A1629]'
                            : 'bg-white border-[#CBD5E1]'
                        }`}
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className={selected ? 'font-medium text-[#0A1629]' : ''}>{opt}</span>
                    </label>
                  );
                })}
                {showerType === 'Other, please specify' && (
                  <input
                    type="text"
                    value={showerOther}
                    onChange={(e) => setShowerOther(e.target.value)}
                    placeholder="Please specify shower arrangement..."
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 3. Accommodation Photos (Optional) Card matching original illustration + Rules 1-7 */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D2] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                  <Camera className="w-5 h-5" strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#0A1629]">
                    Accommodation Photos (Optional)
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                    You can upload photographs of the carer&apos;s bedroom, bathroom and/or
                    additional relevant areas. These are optional but can help carers understand the
                    accommodation available.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Primary Categorised Photo Upload Cards matching illustration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {primarySlots.map((slot) => {
                const existingPhoto = getPrimaryPhotoForCategory(slot.category);
                return (
                  <div
                    key={slot.slotKey}
                    className="rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] overflow-hidden flex flex-col justify-between shadow-2xs"
                  >
                    {/* Hidden real file input */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[slot.slotKey] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileInputChange(e, slot.category, existingPhoto?.id)
                      }
                    />

                    {/* Top Image Preview or Optional Empty Dropzone */}
                    {existingPhoto ? (
                      <div className="relative h-36 sm:h-40 w-full bg-[#EFE9DD] group">
                        <img
                          src={existingPhoto.url}
                          alt={slot.category}
                          className="w-full h-full object-cover"
                        />

                        {/* Approval Status Badge on Photo */}
                        <div className="absolute top-2 left-2">
                          {existingPhoto.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-900/85 text-white text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                              Approved
                            </span>
                          )}
                          {existingPhoto.status === 'pending_approval' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-900/90 text-amber-50 text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-xs">
                              <Clock className="w-3 h-3 text-amber-300" />
                              Pending Approval
                            </span>
                          )}
                          {existingPhoto.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-900/90 text-white text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-xs">
                              <XCircle className="w-3 h-3 text-rose-300" />
                              Not Approved
                            </span>
                          )}
                        </div>

                        {/* Remove Photo Button (Requirement 6: remove at any time) */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(existingPhoto.id)}
                          title="Remove photograph"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#0A1629]/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {existingPhoto.status === 'rejected' && existingPhoto.rejectionReason && (
                          <div className="absolute inset-x-0 bottom-0 bg-rose-950/90 text-rose-100 px-2.5 py-1.5 text-[10px] leading-snug">
                            Hidden from profile: {existingPhoto.rejectionReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[slot.slotKey]?.click()}
                        className="h-36 sm:h-40 w-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-[#F4EFE4] transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white border border-[#E2D9C8] flex items-center justify-center text-[#B88E3E] mb-2">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-[#0A1629]">
                          {slot.category}
                        </span>
                        <span className="text-[10.5px] text-[#7D7362] mt-0.5">
                          Optional &bull; Click to select image
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyClientPhotoUpload(SAMPLE_SLOT_PHOTOS[slot.category], slot.category);
                          }}
                          className="mt-2 text-[10.5px] font-semibold text-[#8C6D2B] underline hover:text-[#0A1629] cursor-pointer"
                        >
                          Use example {slot.category.toLowerCase()} photo
                        </button>
                      </div>
                    )}

                    {/* Bottom Upload / Replace Strip matching original illustration */}
                    <div className="bg-[#F6F1E6] border-t border-[#E5DEC9] px-2.5 py-2.5 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[slot.slotKey]?.click()}
                        className="text-[11.5px] font-semibold text-[#0A1629] hover:text-[#8C6D2B] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {existingPhoto ? (
                          <>
                            <RefreshCw className="w-3 h-3 text-[#8C6D2B]" />
                            <span>{slot.replaceLabel}</span>
                          </>
                        ) : (
                          <>
                            <span>&uarr;</span>
                            <span>{slot.uploadLabel}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra Additional Photos (if client uploaded more than 3) + Add Additional Photo button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2.5">
                {extraAdditionalPhotos.map((extra) => (
                  <div
                    key={extra.id}
                    className="relative w-24 h-20 rounded-xl overflow-hidden border border-[#DFD5C2] bg-[#FAF7F2]"
                  >
                    <img
                      src={extra.url}
                      alt="Additional space"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${
                        extra.status === 'approved'
                          ? 'bg-emerald-800/90'
                          : extra.status === 'rejected'
                          ? 'bg-rose-800/90'
                          : 'bg-amber-800/90'
                      }`}
                    >
                      {extra.status === 'approved'
                        ? 'Approved'
                        : extra.status === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(extra.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0A1629]/80 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <input
                  ref={(el) => {
                    fileInputRefs.current['extra-additional'] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileInputChange(e, 'Additional Space')}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current['extra-additional']?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] px-3 py-1.5 rounded-lg border border-[#E2D9C8] bg-[#FAF7F2] hover:bg-[#F3ECE0] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another space photo (optional)</span>
                </button>
              </div>
            </div>

            {/* REQUIREMENT 1 & 3: Mandatory Consent Checkbox (Strictly NOT Preselected; mandatory ONLY when uploading photos) */}
            <div
              className={`rounded-xl p-3.5 border transition-colors ${
                validationError && !consentChecked && workingPhotos.length > 0
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-[#FDFBF7] border-[#EAE2D2]'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={consentChecked}
                  onClick={() => {
                    setConsentChecked(!consentChecked);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border-2 transition-colors shrink-0 cursor-pointer ${
                    consentChecked
                      ? 'bg-[#0A1629] border-[#0A1629] text-white'
                      : 'bg-white border-[#64748B] hover:border-[#0A1629]'
                  }`}
                >
                  {consentChecked && <Check className="w-3.5 h-3.5 stroke-[2.6]" />}
                </button>
                <span className="text-xs text-[#334155] leading-relaxed">
                  I confirm that I am authorised to upload these images and agree that these
                  particular images may be shown to approved carers within the Grace &amp; Goodwill
                  network who are considering or undertaking this care arrangement. I understand
                  that uploading accommodation photographs is optional and that I can remove them
                  from my profile.{' '}
                  {workingPhotos.length > 0 ? (
                    <span className="text-rose-600 font-bold" title="Mandatory when uploading photographs">
                      * (Required to submit photographs)
                    </span>
                  ) : (
                    <span className="text-[#64748B] italic">
                      (Only required if you choose to upload photographs)
                    </span>
                  )}
                </span>
              </label>
            </div>

            {/* REQUIREMENT 2: Blue Information Notice directly underneath checkbox with exact new wording */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#EBF3FB] border border-[#C3DAF2] flex items-start gap-3 text-xs text-[#1E3A5F]">
              <div className="w-5 h-5 rounded-full bg-[#1D4E89] text-white flex items-center justify-center font-serif font-bold text-[11px] shrink-0 mt-0.5">
                i
              </div>
              <p className="leading-relaxed">
                Please do not upload photographs containing people, personal photographs, visible
                house numbers, street numbers, documents or other identifying or sensitive
                information. Only upload photographs of the live-in carer&rsquo;s bedroom, bathroom
                and any other private space available to the carer, if you feel happy and
                comfortable doing so. Uploading photographs is entirely optional.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Bedroom Illustration Image + Why This Information Is Important + Helpful Tips */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE2D2] p-5 space-y-5 shadow-2xs">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80"
            alt="Comfortable private carer bedroom"
            className="w-full h-64 object-cover rounded-xl border border-[#EAE2D2]"
          />

          <div className="space-y-2.5">
            <h3 className="font-serif text-xl font-semibold text-[#0A1629] pb-2.5 border-b border-[#EAE2D2]">
              Why this information is important
            </h3>
            <p className="text-xs sm:text-[13px] text-[#5C5549] leading-relaxed">
              Having a comfortable, private space helps the live-in carer feel rested and
              supported, which contributes to a positive and sustainable care arrangement for
              everyone.
            </p>
          </div>

          {/* Helpful tips Card matching original illustration with Lightbulb icon & Compulsory bathroom requirement */}
          <div className="bg-[#FAF6EE] rounded-xl p-5 border border-[#EAE2D2] space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-[#B88E3E] shrink-0" strokeWidth={1.8} />
              <h4 className="font-serif text-lg font-semibold text-[#0A1629]">Helpful tips</h4>
            </div>

            <div className="space-y-2.5 text-xs text-[#475569]">
              {[
                'The live-in carer must have their own private bedroom.',
                'A quiet and comfortable space helps the carer to rest.',
                'Compulsory: The live-in carer must have access to a fully equipped bathroom with a toilet, washbasin and either a shower or bathtub.',
                'You can upload photographs to give carers a better understanding of the accommodation.',
                'Photographs are optional.',
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#B88E3E] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar matching original illustration */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF6EE] hover:bg-white text-xs sm:text-sm font-semibold text-[#0A1629] transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#5C5549]" />
          <span>Back</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmitAccommodation(true)}
            className="px-5 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF6EE] hover:bg-white text-xs sm:text-sm font-semibold text-[#0A1629] transition-colors cursor-pointer"
          >
            Save and Finish Later
          </button>

          <button
            type="button"
            onClick={() => handleSubmitAccommodation(false)}
            className="px-7 py-2.5 rounded-xl bg-[#0A1629] hover:bg-[#152542] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
