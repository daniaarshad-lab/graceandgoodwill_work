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
  Eye,
  UserCheck,
  ZoomIn,
  X,
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
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface CarerAccommodationViewProps {
  requestId?: string;
  onBack: () => void;
  onOpenAdminReview?: () => void;
  onNavigate?: (view: AdminView) => void;
}

const SAMPLE_SLOT_PHOTOS: Record<AccommodationPhotoCategory, string> = {
  'Carer Bedroom':
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
  Bathroom:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
  'Additional Space':
    'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&auto=format&fit=crop&q=80',
};

const BATHROOM_OPTIONS = [
  'Private bathroom',
  'Ensuite bathroom',
  'Shared bathroom with client',
  'Shared bathroom with household',
  'Other – please specify',
];

const SHOWER_OPTIONS = [
  'Private',
  'Shared with client',
  'Shared with household',
  'Other – please specify',
];

const normalizeBathroomOption = (val?: string): string => {
  if (!val) return 'Private bathroom';
  if (val === 'Other, please specify' || val === 'Other – please specify') {
    return 'Other – please specify';
  }
  return BATHROOM_OPTIONS.includes(val) ? val : 'Private bathroom';
};

const normalizeShowerOption = (val?: string): string => {
  if (!val) return 'Private';
  if (val === 'Other, please specify' || val === 'Other – please specify') {
    return 'Other – please specify';
  }
  if (val === 'En-suite') return 'Private';
  return SHOWER_OPTIONS.includes(val) ? val : 'Private';
};

export const CarerAccommodationView: React.FC<CarerAccommodationViewProps> = ({
  requestId,
  onBack,
  onOpenAdminReview,
  onNavigate,
}) => {
  const { careRequests, updateCareRequest } = usePlatformStore();

  const [selectedReqId, setSelectedReqId] = useState<string>(
    requestId || careRequests[0]?.id || 'cr-doris'
  );

  // Role workflow mode: Client Form (default, matches image_d502c541.png), Admin Photo Review & Upload, or Approved Carer View
  const [portalMode, setPortalMode] = useState<'client-form' | 'admin-review' | 'carer-preview'>(
    'client-form'
  );

  // Step 4 ('carer-space') vs Step 5 ('review-submit') inside Client Form
  const [activeStep, setActiveStep] = useState<4 | 5>(4);

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
    normalizeBathroomOption(currentReq?.accommodation.bathroomType)
  );
  const [bathroomOther, setBathroomOther] = useState<string>(
    currentReq?.accommodation.bathroomOtherDetails || ''
  );
  const [showerType, setShowerType] = useState<string>(
    normalizeShowerOption(currentReq?.accommodation.showerType)
  );
  const [showerOther, setShowerOther] = useState<string>(
    currentReq?.accommodation.showerOtherDetails || ''
  );

  // Local working list of accommodation photos synced with store
  const [workingPhotos, setWorkingPhotos] = useState<AccommodationPhotoItem[]>(() =>
    currentReq ? getAccommodationPhotoItems(currentReq.accommodation) : []
  );

  // Requirement 1: Mandatory consent checkbox MUST NOT be preselected (strictly false by default)
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Admin review & direct upload state
  const [adminUploadCategory, setAdminUploadCategory] =
    useState<AccommodationPhotoCategory>('Carer Bedroom');
  const [rejectDraftId, setRejectDraftId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>(
    'Contains personal photographs or identifying details — hidden from profile.'
  );
  const [zoomedPhoto, setZoomedPhoto] = useState<AccommodationPhotoItem | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const adminFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
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
    setBathroomType(normalizeBathroomOption(nextReq.accommodation.bathroomType));
    setBathroomOther(nextReq.accommodation.bathroomOtherDetails || '');
    setShowerType(normalizeShowerOption(nextReq.accommodation.showerType));
    setShowerOther(nextReq.accommodation.showerOtherDetails || '');
    setWorkingPhotos(getAccommodationPhotoItems(nextReq.accommodation));
    // Requirement 1: Never preselect the consent checkbox
    setConsentChecked(false);
    setValidationError(null);
    setActiveStep(4);
  };

  // Primary 3 slot cards matching image_d502c541.png
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

  // Sync helper to persist photo list changes to platformStore immediately
  const persistPhotosToStore = (
    nextPhotos: AccommodationPhotoItem[],
    overrides?: { adminVerified?: boolean; clientConsent?: boolean }
  ) => {
    setWorkingPhotos(nextPhotos);
    if (!currentReq) return;
    const hasPending = nextPhotos.some((p) => p.status === 'pending_approval');
    updateCareRequest(currentReq.id, (prev) => ({
      ...prev,
      lastUpdated: 'Just now',
      accommodation: {
        ...prev.accommodation,
        photoItems: nextPhotos,
        clientPhotoConsentConfirmed:
          overrides?.clientConsent !== undefined
            ? overrides.clientConsent
            : prev.accommodation.clientPhotoConsentConfirmed,
        adminVerified:
          overrides?.adminVerified !== undefined
            ? overrides.adminVerified
            : hasPending
            ? false
            : prev.accommodation.adminVerified,
      },
    }));
  };

  // Requirement 4 & 6: Client uploads or replaces a photo -> status 'pending_approval', consent reset to false
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

    const nextPhotos = replacePhotoId
      ? workingPhotos.map((item) => (item.id === replacePhotoId ? newItem : item))
      : [...workingPhotos, newItem];

    setWorkingPhotos(nextPhotos);
    // Requirement 1 & 6: Any new added or replacement client photo requires active consent tick & Admin review
    setConsentChecked(false);
    setValidationError(null);
    showToast(
      replacePhotoId
        ? `${category} photograph staged for replacement — tick the consent checkbox below and submit to send for Admin review.`
        : `${category} photograph added — tick the consent checkbox below and submit to send for Admin review.`
    );
  };

  const handleClientFileInputChange = (
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
    persistPhotosToStore(nextPhotos);
    setValidationError(null);
    showToast('Photograph removed immediately from profile and carer view.');
  };

  // Helper to remove all photos at once (makes testing Rule 3 optional 0-photo submission instant)
  const handleClearAllPhotos = () => {
    persistPhotosToStore([], { clientConsent: false });
    setConsentChecked(false);
    setValidationError(null);
    showToast('All accommodation photographs removed. You can submit without photographs.');
  };

  // Requirement 5: Admin uploads accommodation photographs directly -> automatically Approved!
  const applyAdminDirectUpload = (url: string, category: AccommodationPhotoCategory) => {
    const newAdminItem: AccommodationPhotoItem = {
      id: `admin-ph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url,
      category,
      uploadedBy: 'admin',
      uploadedAt: 'Just now',
      status: 'approved',
      consentConfirmed: true,
      reviewedBy: 'Auto-approved (Admin Upload)',
      reviewedAt: 'Just now',
    };

    // Replace existing slot photo of same category if none or append cleanly
    const existingCategoryIdx = workingPhotos.findIndex((p) => p.category === category);
    const nextPhotos =
      existingCategoryIdx >= 0 && category !== 'Additional Space'
        ? workingPhotos.map((item, idx) => (idx === existingCategoryIdx ? newAdminItem : item))
        : [...workingPhotos, newAdminItem];

    const anyStillPending = nextPhotos.some((p) => p.status === 'pending_approval');
    persistPhotosToStore(nextPhotos, {
      adminVerified: !anyStillPending ? true : false,
    });
    showToast(
      `${category} photograph uploaded by Admin and automatically approved for client profile & carers.`
    );
  };

  const handleAdminFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyAdminDirectUpload(reader.result, adminUploadCategory);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Requirement 4: Admin approves or rejects individual photographs
  const handleAdminApprovePhoto = (photoId: string) => {
    const nextPhotos = workingPhotos.map((item) =>
      item.id === photoId
        ? {
            ...item,
            status: 'approved' as const,
            rejectionReason: undefined,
            reviewedBy: 'Jessica Smith (Admin)',
            reviewedAt: 'Just now',
          }
        : item
    );
    const anyStillPending = nextPhotos.some((p) => p.status === 'pending_approval');
    persistPhotosToStore(nextPhotos, {
      adminVerified: !anyStillPending ? true : false,
    });
    showToast('Photograph approved and published to client profile & carer view.');
  };

  const handleAdminRejectPhoto = (photoId: string, reason: string) => {
    const trimmedReason =
      reason.trim() ||
      'Does not meet privacy guidelines (people, personal items or identifying details visible).';
    const nextPhotos = workingPhotos.map((item) =>
      item.id === photoId
        ? {
            ...item,
            status: 'rejected' as const,
            rejectionReason: trimmedReason,
            reviewedBy: 'Jessica Smith (Admin)',
            reviewedAt: 'Just now',
          }
        : item
    );
    const anyStillPending = nextPhotos.some((p) => p.status === 'pending_approval');
    persistPhotosToStore(nextPhotos, {
      adminVerified: !anyStillPending ? true : false,
    });
    setRejectDraftId(null);
    showToast('Photograph rejected — excluded from client profile and hidden from carers.');
  };

  const handleAdminApproveAllPending = () => {
    const nextPhotos = workingPhotos.map((item) =>
      item.status === 'pending_approval'
        ? {
            ...item,
            status: 'approved' as const,
            rejectionReason: undefined,
            reviewedBy: 'Jessica Smith (Admin)',
            reviewedAt: 'Just now',
          }
        : item
    );
    persistPhotosToStore(nextPhotos, { adminVerified: true });
    showToast('All pending client photographs reviewed and approved.');
  };

  // Client photographs present in form (Rule 1 & Rule 3: consent checkbox is mandatory ONLY if client chooses to upload/submit client photographs)
  const clientPhotosInForm = workingPhotos.filter((p) => p.uploadedBy === 'client');
  const requiresPhotoConsent = clientPhotosInForm.length > 0;

  // Submit / Next Step handler enforcing Rules 1, 3, 4, 6
  const handleSubmitAccommodation = (isDraftSave: boolean) => {
    setValidationError(null);

    if (!hasPrivateBedroom) {
      setValidationError(
        'Compulsory requirement: Please confirm that the live-in carer will have their own private bedroom for the duration of the placement.'
      );
      return;
    }

    // Requirement 1 & 3: Clients must actively tick consent checkbox ONLY if submitting client photographs
    if (!isDraftSave && requiresPhotoConsent && !consentChecked) {
      setValidationError(
        'Please actively tick the mandatory confirmation checkbox beneath the accommodation photographs before submitting photographs, or remove the photographs if you prefer not to upload any (photographs are optional).'
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
        bathroomOtherDetails: bathroomType === 'Other – please specify' ? bathroomOther : '',
        showerType,
        showerOtherDetails: showerType === 'Other – please specify' ? showerOther : '',
        photoItems: finalizedItems,
        clientPhotoConsentConfirmed: requiresPhotoConsent ? consentChecked : false,
        // Requirement 4: Carer accommodation remains Pending Approval until Admin reviews client-submitted photos
        adminVerified: hasPendingForAdmin
          ? false
          : finalizedItems.length === 0
          ? true
          : prev.accommodation.adminVerified,
      },
    }));

    setWorkingPhotos(finalizedItems);

    if (isDraftSave) {
      showToast('Carer accommodation progress saved for later.');
      return;
    }

    setActiveStep(5);
    if (hasPendingForAdmin) {
      showToast(
        'Submitted! Client accommodation photographs have been sent to the Admin portal (Pending Approval) before appearing on your profile or becoming visible to carers.'
      );
    } else if (finalizedItems.length === 0) {
      showToast('Carer accommodation completed without photographs (uploading photographs is optional).');
    } else {
      showToast('Carer accommodation details confirmed and saved.');
    }
  };

  const overallApprovalStatus = currentReq
    ? getAccommodationApprovalStatus({
        ...currentReq.accommodation,
        photoItems: workingPhotos,
      })
    : 'Pending Approval';

  const pendingPhotosCount = workingPhotos.filter((p) => p.status === 'pending_approval').length;
  const approvedPhotos = workingPhotos.filter((p) => p.status === 'approved');
  const rejectedPhotosCount = workingPhotos.filter((p) => p.status === 'rejected').length;

  return (
    <div className="relative w-full max-w-[1380px] mx-auto px-3 sm:px-6 py-4 space-y-5 select-none overflow-hidden">
      {/* Subtle Top-Right Grace & Goodwill Gold Ribbon Knot Watermark matching platform design */}
      <img
        src="/website_logo.png"
        alt=""
        aria-hidden="true"
        className="hidden md:block pointer-events-none select-none absolute -top-6 right-2 w-56 h-56 object-contain opacity-[0.11] z-0"
      />

      {/* Client Section Sub-Navigation when inside Clients module */}
      {onNavigate && (
        <ClientSectionNav
          currentView="client-carer-accommodation"
          onNavigate={onNavigate}
        />
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium border border-[#C5A059]/40 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="leading-relaxed">{toastMsg}</span>
          {pendingPhotosCount > 0 && portalMode !== 'admin-review' && (
            <button
              type="button"
              onClick={() => setPortalMode('admin-review')}
              className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#0A1629] font-bold whitespace-nowrap cursor-pointer hover:bg-[#D4AF7A]"
            >
              Admin Review &rarr;
            </button>
          )}
        </div>
      )}

      {/* Enlarge Photo Lightbox Modal for Admin Inspection */}
      {zoomedPhoto && (
        <div
          onClick={() => setZoomedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden border border-[#DFD5C2] shadow-2xl"
          >
            <div className="px-5 py-3.5 bg-[#0A1629] text-white flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{zoomedPhoto.category}</div>
                <div className="text-[11px] text-[#D4AF7A]">
                  Uploaded by {zoomedPhoto.uploadedBy === 'admin' ? 'Admin (Auto-Approved)' : 'Client'} &bull;{' '}
                  {zoomedPhoto.uploadedAt}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setZoomedPhoto(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#0F172A] max-h-[65vh] flex items-center justify-center overflow-hidden">
              <img
                src={zoomedPhoto.url}
                alt={zoomedPhoto.category}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#475569]">
                Check for: no people, personal photos, visible house/street numbers, documents or sensitive details.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAdminApprovePhoto(zoomedPhoto.id);
                    setZoomedPhoto(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAdminRejectPhoto(
                      zoomedPhoto.id,
                      'Rejected during Admin inspection — contains sensitive or identifying details.'
                    );
                    setZoomedPhoto(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Row matching image_d502c541.png + Role Workflow Switcher */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-[38px] font-semibold text-[#0A1629] tracking-tight leading-tight">
              Carer Accommodation
            </h1>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 ${
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
              <span>Accommodation: {overallApprovalStatus}</span>
            </span>
          </div>
          <p className="text-sm text-[#5C5549] mt-1">
            Please provide details about the live-in carer&rsquo;s accommodation and personal space.
          </p>
        </div>

        {/* Client Selector + 3-Role Workflow Switcher (Client Form | Admin Photo Approval | Carer View) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E2D9C8] text-xs shadow-sm">
            <span className="text-[#64748B] font-medium">Client:</span>
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

          <div className="inline-flex items-center bg-white border border-[#E2D9C8] rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setPortalMode('client-form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                portalMode === 'client-form'
                  ? 'bg-[#0A1629] text-[#EBD8B2]'
                  : 'text-[#5C5549] hover:text-[#0A1629]'
              }`}
            >
              Client Portal Form
            </button>
            <button
              type="button"
              onClick={() => setPortalMode('admin-review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                portalMode === 'admin-review'
                  ? 'bg-[#0A1629] text-[#EBD8B2]'
                  : 'text-[#5C5549] hover:text-[#0A1629]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                Admin Photo Review{pendingPhotosCount > 0 ? ` (${pendingPhotosCount})` : ''}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPortalMode('carer-preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                portalMode === 'carer-preview'
                  ? 'bg-[#0A1629] text-[#EBD8B2]'
                  : 'text-[#5C5549] hover:text-[#0A1629]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Carer View ({approvedPhotos.length} Live)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODE A: CLIENT ACCOMMODATION FORM (Exact Reference Layout image_d502c541.png)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {portalMode === 'client-form' && (
        <>
          {/* 5-Step Connected Horizontal Stepper matching image_d502c541.png */}
          <div className="relative z-10 py-2 px-2 sm:px-8">
            <div className="relative flex items-start justify-between">
              <div className="absolute top-3.5 left-[8%] right-[8%] h-[1.5px] bg-[#DDD3C0] z-0" />
              <div
                className={`absolute top-3.5 left-[8%] h-[1.5px] bg-[#B89454] z-0 transition-all ${
                  activeStep === 5 ? 'w-[84%]' : 'w-[62%]'
                }`}
              />

              {[
                { num: 1, label: 'Basic Information' },
                { num: 2, label: 'Health & Support' },
                { num: 3, label: 'Home Environment' },
                { num: 4, label: 'Carer Space' },
                { num: 5, label: 'Review & Submit' },
              ].map((step) => {
                const isActive = step.num === activeStep;
                const isCompleted = step.num < activeStep;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => {
                      if (step.num === 4) setActiveStep(4);
                    }}
                    className="relative z-10 flex flex-col items-center text-center w-1/5 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#A68242] text-white shadow-sm ring-4 ring-[#F8F5EE]'
                          : isCompleted
                          ? 'bg-[#EFE7D6] text-[#8C6D2B] border border-[#C5A059]'
                          : 'bg-[#FAF7F2] text-[#5C5549] border border-[#D8CEBC]'
                      }`}
                    >
                      {step.num}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs mt-1.5 ${
                        isActive ? 'font-bold text-[#0A1629]' : 'text-[#5C5549] font-normal'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="relative z-10 rounded-xl bg-rose-50 border border-rose-300 px-4 py-3.5 flex items-start gap-2.5 text-xs text-rose-900 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{validationError}</span>
            </div>
          )}

          {activeStep === 5 ? (
            /* STEP 5: REVIEW & SUBMIT CONFIRMATION SUMMARY */
            <div className="relative z-10 bg-white rounded-2xl border border-[#E6DFD0] p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE2D2]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D2B]">
                    Step 5 of 5 &bull; Care Request Accommodation Summary
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#0A1629] mt-1">
                    Carer Accommodation Submitted
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5549] mt-1">
                    {pendingPhotosCount > 0
                      ? 'Your accommodation details are saved. Uploaded photographs are now Pending Approval in the Admin portal before being published to your profile or shown to carers.'
                      : workingPhotos.length === 0
                      ? 'Your care request accommodation details are complete without photographs (uploading photographs is optional).'
                      : 'All accommodation photographs on your profile have been reviewed by Admin.'}
                  </p>
                </div>

                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 self-start ${
                    overallApprovalStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {overallApprovalStatus === 'Approved' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                  )}
                  <span>Status: {overallApprovalStatus}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4 space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Private Bedroom</div>
                  <div className="text-[#475569]">Confirmed &bull; {bedroomType}</div>
                </div>
                <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4 space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Bathroom &amp; Shower</div>
                  <div className="text-[#475569]">
                    {bathroomType === 'Other – please specify' && bathroomOther
                      ? bathroomOther
                      : bathroomType}{' '}
                    &bull; Shower:{' '}
                    {showerType === 'Other – please specify' && showerOther
                      ? showerOther
                      : showerType}
                  </div>
                </div>
                <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4 space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Accommodation Photographs</div>
                  <div className="text-[#475569]">
                    {workingPhotos.length === 0
                      ? 'None uploaded (Optional)'
                      : `${approvedPhotos.length} Approved · ${pendingPhotosCount} Pending Admin Review · ${rejectedPhotosCount} Rejected`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF6EE] hover:bg-white text-xs sm:text-sm font-semibold text-[#0A1629] inline-flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit / Remove or Replace Photographs</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPortalMode('admin-review')}
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B58E47] text-[#0A1629] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Photo Approval</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortalMode('carer-preview')}
                    className="px-5 py-2.5 rounded-xl bg-[#0A1629] hover:bg-[#152542] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF7A]" />
                    <span>Preview Carer View</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 4: CARER SPACE MAIN TWO-COLUMN LAYOUT MATCHING image_d502c541.png */
            <>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 8 COLS: Two distinct rounded cards matching image_d502c541.png */}
                <div className="lg:col-span-8 space-y-5">
                  {/* CARD 1: Private Bedroom */}
                  <div className="bg-[#FDFBF7] rounded-2xl p-5 sm:p-6 border border-[#E6DFD0] space-y-4 shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                        <BedDouble className="w-5 h-5" strokeWidth={1.7} />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl sm:text-[22px] font-semibold text-[#0A1629]">
                          Private Bedroom
                        </h2>
                        <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                          The live-in carer must have their own private bedroom. Sharing a bedroom with the client or other household members is not permitted.
                        </p>
                      </div>
                    </div>

                    {/* Mandatory Confirmation */}
                    <label className="flex items-center gap-3 pt-1 cursor-pointer group">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={hasPrivateBedroom}
                        onClick={() => {
                          setHasPrivateBedroom(!hasPrivateBedroom);
                          if (validationError) setValidationError(null);
                        }}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                          hasPrivateBedroom
                            ? 'bg-[#0A1629] border-[#0A1629] text-white'
                            : 'bg-white border-[#94A3B8] group-hover:border-[#0A1629]'
                        }`}
                      >
                        {hasPrivateBedroom && <Check className="w-3.5 h-3.5 stroke-[2.6]" />}
                      </button>
                      <span className="text-xs sm:text-[13.5px] font-semibold text-[#0A1629]">
                        I confirm that the live-in carer will have their own private bedroom for the duration of the placement.{' '}
                        <span className="text-rose-600">*</span>
                      </span>
                    </label>

                    {/* Household multiple-carer occupancy selector */}
                    <div className="pt-1 border-t border-[#EAE2D2]/80">
                      <label className="inline-flex items-center gap-2 text-xs text-[#5C5549] cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={multipleCarersInHousehold}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setMultipleCarersInHousehold(checked);
                            if (!checked) setBedroomType(SOLE_OCCUPANCY_BEDROOM);
                          }}
                          className="w-3.5 h-3.5 accent-[#0A1629] rounded cursor-pointer"
                        />
                        <span>Multiple live-in carers are accommodated in the same household</span>
                      </label>

                      {multipleCarersInHousehold && (
                        <div className="mt-2.5 rounded-xl bg-white border border-[#EAE2D2] p-3.5 space-y-2.5">
                          <div className="text-[11.5px] font-medium text-[#475569]">
                            Bedroom arrangements:
                          </div>
                          {[SOLE_OCCUPANCY_BEDROOM, SHARED_CARER_BEDROOM].map((opt) => {
                            const selected = bedroomType === opt;
                            return (
                              <label
                                key={opt}
                                onClick={() => setBedroomType(opt)}
                                className="flex items-center gap-2.5 text-xs text-[#1E293B] cursor-pointer py-0.5"
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
                                <span className={selected ? 'font-medium text-[#0A1629]' : ''}>
                                  {opt}
                                </span>
                              </label>
                            );
                          })}

                          {bedroomType === SHARED_CARER_BEDROOM && (
                            <div className="rounded-lg bg-[#FAF6EE] border border-[#E6D7B9] p-2.5 text-[11px] text-[#5C5549] leading-relaxed">
                              <strong>Important:</strong> If a shared bedroom is proposed, both carers must explicitly agree to the arrangement before the placement is confirmed. Neither carer should be expected or required to share accommodation without their consent.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CARD 2: Unified Card containing Bathroom Arrangements + Accommodation Photos (Optional) matching image_d502c541.png */}
                  <div className="bg-[#FDFBF7] rounded-2xl p-5 sm:p-6 border border-[#E6DFD0] space-y-6 shadow-sm">
                    {/* SECTION 2A: Bathroom Arrangements */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                          <ShowerHead className="w-5 h-5" strokeWidth={1.7} />
                        </div>
                        <div>
                          <h2 className="font-serif text-xl sm:text-[22px] font-semibold text-[#0A1629]">
                            Bathroom Arrangements
                          </h2>
                          <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                            Please confirm the bathroom and shower/bathing arrangements for the
                            live-in carer.
                          </p>
                        </div>
                      </div>

                      {/* Two Side-by-Side Sub-Boxes matching image_d502c541.png */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Sub-Box: Bathroom arrangements */}
                        <div className="rounded-xl border border-[#EAE2D2] bg-white/85 p-4 space-y-2.5">
                          <div className="text-xs sm:text-[13.5px] font-bold text-[#0A1629] mb-1">
                            Bathroom arrangements
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
                                  {selected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                                <span className={selected ? 'font-medium text-[#0A1629]' : ''}>
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                          {bathroomType === 'Other – please specify' && (
                            <input
                              type="text"
                              value={bathroomOther}
                              onChange={(e) => setBathroomOther(e.target.value)}
                              placeholder="Please specify bathroom arrangement..."
                              className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                            />
                          )}
                        </div>

                        {/* Right Sub-Box: Shower/bathing arrangements */}
                        <div className="rounded-xl border border-[#EAE2D2] bg-white/85 p-4 space-y-2.5">
                          <div className="text-xs sm:text-[13.5px] font-bold text-[#0A1629] mb-1">
                            Shower/bathing arrangements
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
                                  {selected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                                <span className={selected ? 'font-medium text-[#0A1629]' : ''}>
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                          {showerType === 'Other – please specify' && (
                            <input
                              type="text"
                              value={showerOther}
                              onChange={(e) => setShowerOther(e.target.value)}
                              placeholder="Please specify shower/bathing arrangement..."
                              className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#EAE2D2]" />

                    {/* SECTION 2B: Accommodation Photos (Optional) */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                            <Camera className="w-5 h-5" strokeWidth={1.7} />
                          </div>
                          <div>
                            <h2 className="font-serif text-xl sm:text-[22px] text-[#0A1629]">
                              <span className="font-semibold">Accommodation Photos</span>{' '}
                              <span className="font-normal text-[#334155]">(Optional)</span>
                            </h2>
                            <p className="text-xs sm:text-[13px] text-[#5C5549] mt-1 leading-relaxed">
                              You can upload photographs of the carer&rsquo;s bedroom, bathroom
                              and/or additional relevant areas. These are optional but can help
                              carers understand the accommodation available.
                            </p>
                          </div>
                        </div>

                        {workingPhotos.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllPhotos}
                            className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100/70 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove all photos</span>
                          </button>
                        )}
                      </div>

                      {/* 3 Primary Categorised Photo Cards matching image_d502c541.png */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                        {primarySlots.map((slot) => {
                          const existingPhoto = getPrimaryPhotoForCategory(slot.category);
                          return (
                            <div
                              key={slot.slotKey}
                              className="rounded-xl border border-[#DFD5C2] bg-white overflow-hidden flex flex-col justify-between shadow-sm"
                            >
                              <input
                                ref={(el) => {
                                  fileInputRefs.current[slot.slotKey] = el;
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleClientFileInputChange(e, slot.category, existingPhoto?.id)
                                }
                              />

                              {existingPhoto ? (
                                <div className="relative h-36 sm:h-40 w-full bg-[#EFE9DD] group">
                                  <img
                                    src={existingPhoto.url}
                                    alt={slot.category}
                                    className="w-full h-full object-cover"
                                  />

                                  {/* Approval Status Badge on Photo */}
                                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {existingPhoto.status === 'approved' && (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-900/90 text-white text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-sm">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                                        {existingPhoto.uploadedBy === 'admin'
                                          ? 'Admin Upload · Approved'
                                          : 'Approved'}
                                      </span>
                                    )}
                                    {existingPhoto.status === 'pending_approval' && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-900/90 text-amber-50 text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-sm">
                                        <Clock className="w-3 h-3 text-amber-300" />
                                        Pending Approval
                                      </span>
                                    )}
                                    {existingPhoto.status === 'rejected' && (
                                      <span className="px-2 py-0.5 rounded-md bg-rose-900/90 text-white text-[10px] font-semibold inline-flex items-center gap-1 backdrop-blur-sm">
                                        <XCircle className="w-3 h-3 text-rose-300" />
                                        Rejected (Hidden)
                                      </span>
                                    )}
                                  </div>

                                  {/* Remove Photo Button (Requirement 6: remove at any time) */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(existingPhoto.id)}
                                    title="Remove photograph"
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#0A1629]/85 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {existingPhoto.status === 'rejected' &&
                                    existingPhoto.rejectionReason && (
                                      <div className="absolute inset-x-0 bottom-0 bg-rose-950/90 text-rose-100 px-2.5 py-1.5 text-[10px] leading-snug">
                                        Not shown on profile: {existingPhoto.rejectionReason}
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <div
                                  onClick={() => fileInputRefs.current[slot.slotKey]?.click()}
                                  className="h-36 sm:h-40 w-full flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-[#FAF7F2] hover:bg-[#F3ECE0] transition-colors"
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
                                      applyClientPhotoUpload(
                                        SAMPLE_SLOT_PHOTOS[slot.category],
                                        slot.category
                                      );
                                    }}
                                    className="mt-2 text-[10.5px] font-semibold text-[#8C6D2B] underline hover:text-[#0A1629] cursor-pointer"
                                  >
                                    Use sample {slot.category.toLowerCase()} photo
                                  </button>
                                </div>
                              )}

                              {/* Bottom Upload / Replace Strip matching image_d502c541.png */}
                              <div className="bg-[#F4EDE0] border-t border-[#E5DEC9] px-2.5 py-2.5 flex items-center justify-center gap-2">
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

                      {/* Extra Additional Space Photos + Add Another Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {extraAdditionalPhotos.map((extra) => (
                            <div
                              key={extra.id}
                              className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#DFD5C2] bg-white shadow-sm"
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
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0A1629]/85 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
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
                            onChange={(e) => handleClientFileInputChange(e, 'Additional Space')}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current['extra-additional']?.click()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] px-3 py-1.5 rounded-lg border border-[#E2D9C8] bg-white hover:bg-[#F3ECE0] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add another private space photo (optional)</span>
                          </button>
                        </div>
                      </div>

                      {/* REQUIREMENT 1 & 3: Clearly visible Mandatory Consent Checkbox directly beneath photographs — NEVER preselected */}
                      <div
                        className={`rounded-xl p-3.5 border transition-colors ${
                          validationError && !consentChecked && requiresPhotoConsent
                            ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200'
                            : 'bg-white border-[#DFD5C2]'
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
                                : 'bg-white border-[#475569] hover:border-[#0A1629]'
                            }`}
                          >
                            {consentChecked && <Check className="w-3.5 h-3.5 stroke-[2.6]" />}
                          </button>
                          <span className="text-xs text-[#1E293B] leading-relaxed">
                            I confirm that I am authorised to upload these images and agree that
                            these particular images may be shown to approved carers within the Grace
                            &amp; Goodwill network who are considering or undertaking this care
                            arrangement. I understand that uploading accommodation photographs is
                            optional and that I can remove them from my profile.{' '}
                            {requiresPhotoConsent ? (
                              <span
                                className="text-rose-600 font-bold"
                                title="Mandatory when submitting client accommodation photographs"
                              >
                                *
                              </span>
                            ) : (
                              <span className="text-[#64748B] italic">
                                (Only required if you choose to upload photographs)
                              </span>
                            )}
                          </span>
                        </label>
                      </div>

                      {/* REQUIREMENT 2: Blue Information Notice directly underneath the checkbox with exact requested wording */}
                      <div className="p-3.5 sm:p-4 rounded-xl bg-[#E8F1FA] border border-[#BFD6EE] flex items-start gap-3 text-xs text-[#1D3B5E]">
                        <div className="w-5 h-5 rounded-full bg-[#1B4F8C] text-white flex items-center justify-center font-serif font-bold text-[11px] shrink-0 mt-0.5">
                          !
                        </div>
                        <p className="leading-relaxed">
                          Please do not upload photographs containing people, personal photographs,
                          visible house numbers, street numbers, documents or other identifying or
                          sensitive information. Only upload photographs of the live-in
                          carer&rsquo;s bedroom, bathroom and any other private space available to
                          the carer, if you feel happy and comfortable doing so. Uploading
                          photographs is entirely optional.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT 4 COLS: Bedroom Illustration Image + Why This Information Is Important + Helpful Tips matching image_d502c541.png */}
                <div className="lg:col-span-4 bg-[#FDFBF7] rounded-2xl border border-[#E6DFD0] p-5 space-y-5 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80"
                    alt="Comfortable private carer bedroom"
                    className="w-full h-64 object-cover rounded-xl border border-[#EAE2D2]"
                  />

                  <div className="space-y-2.5">
                    <h3 className="font-serif text-xl sm:text-[22px] font-semibold text-[#0A1629] pb-2.5 border-b border-[#DED4C1]">
                      Why this information is important
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C5549] leading-relaxed">
                      Having a comfortable, private space helps the live-in carer feel rested and
                      supported, which contributes to a positive and sustainable care arrangement
                      for everyone.
                    </p>
                  </div>

                  {/* Helpful tips Card matching image_d502c541.png */}
                  <div className="bg-[#F6F0E4] rounded-xl p-5 border border-[#E5DEC9] space-y-3.5">
                    <div className="flex items-center gap-2.5">
                      <Lightbulb className="w-5 h-5 text-[#B88E3E] shrink-0" strokeWidth={1.8} />
                      <h4 className="font-serif text-lg font-semibold text-[#0A1629]">
                        Helpful tips
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-[12.5px] text-[#334155]">
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

              {/* Bottom Action Footer Bar matching image_d502c541.png */}
              <div className="relative z-10 pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 rounded-xl border border-[#D8CEBC] bg-[#FAF6EE] hover:bg-white text-xs sm:text-sm font-semibold text-[#0A1629] transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#5C5549]" />
                  <span>Back</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSubmitAccommodation(true)}
                    className="px-5 py-2.5 rounded-xl border border-[#D8CEBC] bg-[#FAF6EE] hover:bg-white text-xs sm:text-sm font-semibold text-[#0A1629] transition-colors cursor-pointer"
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
            </>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODE B: ADMIN PORTAL PHOTO APPROVAL & DIRECT ADMIN UPLOAD (Rules 4 & 5)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {portalMode === 'admin-review' && (
        <div className="relative z-10 space-y-6">
          {/* Admin Safeguarding Inspection Banner */}
          <div className="bg-[#0A1629] text-white rounded-2xl p-5 sm:p-6 border border-[#C5A059]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 text-[#D4AF7A] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Accommodation Photograph Moderation</span>
              </div>
              <h2 className="font-serif text-2xl font-semibold">
                Review Client Photographs &amp; Direct Admin Upload
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verify that each client-submitted photograph only shows the carer&rsquo;s bedroom,
                bathroom or appropriate private accommodation spaces — without exposing people,
                personal photographs, house/street numbers, documents or sensitive details.
                Carer accommodation remains <strong className="text-amber-300">Pending Approval</strong>{' '}
                until reviewed. Rejected or pending photographs never appear on the client&rsquo;s
                profile or carer portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {pendingPhotosCount > 0 && (
                <button
                  type="button"
                  onClick={handleAdminApproveAllPending}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF7A] text-[#0A1629] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve All Pending ({pendingPhotosCount})</span>
                </button>
              )}
              {onOpenAdminReview && (
                <button
                  type="button"
                  onClick={onOpenAdminReview}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold cursor-pointer"
                >
                  Open Full Care Request Record
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Individual Photograph Review Queue */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6DFD0] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE2D2]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                    Accommodation Photographs ({workingPhotos.length})
                  </h3>
                  <p className="text-xs text-[#5C5549] mt-0.5">
                    Approve or reject each photograph individually. Click any image to inspect full-size.
                  </p>
                </div>
                <span className="text-xs text-[#5C5549]">
                  {approvedPhotos.length} Approved &bull; {pendingPhotosCount} Pending &bull;{' '}
                  {rejectedPhotosCount} Rejected
                </span>
              </div>

              {workingPhotos.length === 0 ? (
                <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] p-8 text-center space-y-2">
                  <Camera className="w-7 h-7 text-[#B88E3E] mx-auto" />
                  <div className="text-sm font-semibold text-[#0A1629]">
                    No accommodation photographs uploaded
                  </div>
                  <p className="text-xs text-[#5C5549] max-w-md mx-auto">
                    Uploading accommodation photographs is optional for clients. Admin can also
                    upload reviewed photographs directly on the client&rsquo;s behalf using the panel
                    on the right.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workingPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="rounded-xl border border-[#DFD5C2] bg-[#FDFBF7] overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      <div
                        onClick={() => setZoomedPhoto(photo)}
                        className="relative h-48 bg-[#EFE9DD] cursor-pointer group"
                      >
                        <img
                          src={photo.url}
                          alt={photo.category}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-lg bg-[#0A1629]/85 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                            <ZoomIn className="w-3.5 h-3.5" />
                            Inspect Full Size
                          </span>
                        </div>

                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#0A1629]/85 text-white text-[10px] font-semibold">
                            {photo.category}
                          </span>
                          {photo.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-800/90 text-white text-[10px] font-semibold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                              Approved
                            </span>
                          )}
                          {photo.status === 'pending_approval' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-800/95 text-amber-50 text-[10px] font-semibold inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-300" />
                              Pending Approval
                            </span>
                          )}
                          {photo.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-800/95 text-white text-[10px] font-semibold inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-300" />
                              Rejected (Hidden)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-3">
                        <div className="text-[11px] text-[#5C5549] flex items-center justify-between gap-2">
                          <span>
                            Source:{' '}
                            <strong className="text-[#0A1629]">
                              {photo.uploadedBy === 'admin'
                                ? 'Admin Direct Upload (Auto-Approved)'
                                : 'Client Portal Submission'}
                            </strong>
                          </span>
                          <span>{photo.uploadedAt}</span>
                        </div>

                        {photo.status === 'rejected' && photo.rejectionReason && (
                          <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-2 text-[11px] text-rose-900">
                            <strong>Blocked from profile &amp; carers:</strong> {photo.rejectionReason}
                          </div>
                        )}

                        {rejectDraftId === photo.id ? (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={rejectReasonInput}
                              onChange={(e) => setRejectReasonInput(e.target.value)}
                              placeholder="Reason for rejecting photograph..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 bg-white text-xs text-[#0A1629] focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAdminRejectPhoto(photo.id, rejectReasonInput)}
                                className="flex-1 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
                              >
                                Confirm Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectDraftId(null)}
                                className="px-3 py-1.5 rounded-lg border border-[#DFD5C2] bg-white text-xs font-semibold text-[#5C5549] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleAdminApprovePhoto(photo.id)}
                              disabled={photo.status === 'approved'}
                              className={`flex-1 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                                photo.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{photo.status === 'approved' ? 'Approved' : 'Approve'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectDraftId(photo.id);
                                setRejectReasonInput(
                                  photo.rejectionReason ||
                                    'Contains personal photographs or identifying details — hidden from profile.'
                                );
                              }}
                              className="flex-1 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              title="Delete photograph"
                              className="p-2 rounded-lg border border-[#E2D9C8] bg-white hover:bg-rose-50 text-[#5C5549] hover:text-rose-700 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4 Cols: REQUIREMENT 5 — Direct Admin Upload on Client's Behalf (Auto-Approved) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6DFD0] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#0A1629]">
                    Upload on Client&rsquo;s Behalf
                  </h3>
                  <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
                    Photographs uploaded directly by Admin have already been reviewed and are{' '}
                    <strong className="text-emerald-800">automatically Approved</strong> without
                    requiring a second Admin approval.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#0A1629] mb-1.5">
                    Room / Space Category
                  </label>
                  <select
                    value={adminUploadCategory}
                    onChange={(e) =>
                      setAdminUploadCategory(e.target.value as AccommodationPhotoCategory)
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] focus:outline-none"
                  >
                    <option value="Carer Bedroom">Carer Bedroom</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Additional Space">Additional Private Space</option>
                  </select>
                </div>

                <input
                  ref={adminFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAdminFileChange}
                />

                <button
                  type="button"
                  onClick={() => adminFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-[#0A1629] hover:bg-[#152542] text-[#EBD8B2] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#D4AF7A]" />
                  <span>Upload Photo as Admin (Auto-Approve)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyAdminDirectUpload(
                      SAMPLE_SLOT_PHOTOS[adminUploadCategory],
                      adminUploadCategory
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl border border-[#DFD5C2] bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#0A1629] text-xs font-semibold transition-colors cursor-pointer"
                >
                  + Add Sample {adminUploadCategory} Photo as Admin
                </button>
              </div>

              <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] p-3.5 space-y-2 text-xs text-[#475569]">
                <div className="font-bold text-[#0A1629]">Admin Review Criteria</div>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>Shows only carer&rsquo;s bedroom, bathroom or private carer space</li>
                  <li>No people or personal/family photographs visible</li>
                  <li>No visible house numbers or street numbers</li>
                  <li>No personal documents, mail or sensitive details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODE C: APPROVED CARER PORTAL VIEW (Strictly ONLY Approved Photos Visible)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {portalMode === 'carer-preview' && (
        <div className="relative z-10 bg-white rounded-2xl border border-[#E6DFD0] p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D2]">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8C6D2B]">
                Grace &amp; Goodwill Approved Carer View
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#0A1629] mt-0.5">
                {currentReq?.displayTitle} &mdash; Carer Accommodation Space
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5549] mt-1">
                Carers can only view photographs that have been approved by Admin (or uploaded
                directly by Admin). Pending and rejected photographs are strictly hidden.
              </p>
            </div>

            {(pendingPhotosCount > 0 || rejectedPhotosCount > 0) && (
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                {pendingPhotosCount} Pending &amp; {rejectedPhotosCount} Rejected photo(s) hidden
                from carers
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4">
              <div className="text-[#64748B] font-medium">Bedroom Space</div>
              <div className="text-sm font-semibold text-[#0A1629] mt-1">
                Private bedroom confirmed ({bedroomType})
              </div>
            </div>
            <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4">
              <div className="text-[#64748B] font-medium">Bathroom Arrangements</div>
              <div className="text-sm font-semibold text-[#0A1629] mt-1">
                {bathroomType === 'Other – please specify' && bathroomOther
                  ? bathroomOther
                  : bathroomType}
              </div>
            </div>
            <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE2D2] p-4">
              <div className="text-[#64748B] font-medium">Shower / Bathing Arrangements</div>
              <div className="text-sm font-semibold text-[#0A1629] mt-1">
                {showerType === 'Other – please specify' && showerOther
                  ? showerOther
                  : showerType}
              </div>
            </div>
          </div>

          {approvedPhotos.length === 0 ? (
            <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] p-8 text-center space-y-1.5">
              <Camera className="w-6 h-6 text-[#B88E3E] mx-auto" />
              <div className="text-sm font-semibold text-[#0A1629]">
                No approved accommodation photographs published
              </div>
              <p className="text-xs text-[#5C5549]">
                Accommodation photographs are optional. Any client-uploaded photographs awaiting
                Admin review or rejected by Admin are never shown here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl border border-[#DFD5C2] bg-[#FDFBF7] overflow-hidden shadow-sm"
                >
                  <div className="h-48 bg-[#EFE9DD]">
                    <img
                      src={photo.url}
                      alt={photo.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0A1629]">{photo.category}</span>
                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Space
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
