"use client";

import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Camera,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Check,
  CheckCircle2,
  Home,
  Plus,
  Accessibility,
  BedDouble,
  Shield,
  ShieldCheck,
  PawPrint,
  Cigarette,
  Heart,
  User,
  Users,
  Save,
  X,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  Info,
  Trash2,
  Upload,
  Clock,
  XCircle,
  ZoomIn,
  Coins,
  Eye,
} from 'lucide-react';
import {
  AccommodationPhotoCategory,
  AccommodationPhotoItem,
  AvailabilityCategory,
  CareRequestRecord,
  CareRequestStage,
  getAccommodationApprovalStatus,
  getAccommodationPhotoItems,
  hasPendingAccommodationPhotos,
  SHARED_CARER_BEDROOM,
  SOLE_OCCUPANCY_BEDROOM,
  usePlatformStore,
} from '@/data/care-platform/platformStore';
import { CarerAccommodationView } from './CarerAccommodationView';

interface DeclarationsViewProps {
  onBack: () => void;
  onNavigateToPlacements?: (placementId?: string) => void;
}

const PIPELINE_STAGES: {
  stage: CareRequestStage;
  shortLabel: string;
  description: string;
}[] = [
  {
    stage: 'New Enquiry',
    shortLabel: '1. New Enquiries',
    description: 'Initial family or hospital enquiries received',
  },
  {
    stage: 'Reviewing Requirements',
    shortLabel: '2. Reviewing Requirements',
    description: 'Assessing medical, mobility & personal care needs',
  },
  {
    stage: 'Matching Carers',
    shortLabel: '3. Matching Carers',
    description: 'Shortlisting vetted live-in carers',
  },
  {
    stage: 'Confirming Accommodation',
    shortLabel: '4. Confirming Accommodation',
    description: 'Verifying private bedroom & equipped bathroom',
  },
  {
    stage: 'Finalised',
    shortLabel: '5. Finalised Placements',
    description: 'Confirmed & published to Placements roster',
  },
];

const VETTED_CARERS = [
  {
    name: 'Anita K.',
    role: 'Live-in Ongoing & Respite Carer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sophie Williams',
    role: 'Live-in Ongoing Carer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  },
  {
    name: 'Daniel Carter',
    role: 'Live-in Respite Carer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amelia Khan',
    role: 'Live-in Ongoing & Respite Carer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
  },
];

const EXTRA_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
];

export const DeclarationsView: React.FC<DeclarationsViewProps> = ({
  onBack,
  onNavigateToPlacements,
}) => {
  const { careRequests, updateCareRequest, confirmCareRequestToPlacement } = usePlatformStore();

  // View mode: 'detail' (matches image_34c66094.png), 'pipeline' (Option B Matching Pipeline), or 'carer-form' (full Carer Accommodation form from image_4aae6312.png)
  const [viewMode, setViewMode] = useState<'detail' | 'pipeline' | 'carer-form'>('detail');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    careRequests[0]?.id || 'cr-doris'
  );

  // Detail sub-tab matching image_34c66094.png
  const [activeTab, setActiveTab] = useState<
    'overview' | 'health' | 'accommodation' | 'lifestyle' | 'activity'
  >('accommodation');

  // Role preview toggle so Admin can verify Client Portal Care Request view (zero carer fee exposure)
  const [portalRoleView, setPortalRoleView] = useState<'admin' | 'client'>('admin');
  const [showClientAgreementPreview, setShowClientAgreementPreview] = useState<boolean>(false);

  // Inline edit toggles for cards
  const [editingCard, setEditingCard] = useState<string | null>(null);

  // Confirm & Finalise Placement modal state
  const [confirmModalRequest, setConfirmModalRequest] = useState<CareRequestRecord | null>(null);
  const [selectedCarerIdx, setSelectedCarerIdx] = useState<number>(0);
  const [markAsEmergency, setMarkAsEmergency] = useState<boolean>(false);
  const [adminConfirmedAccommodation, setAdminConfirmedAccommodation] = useState<boolean>(true);
  const [recentlyConfirmedPlacementId, setRecentlyConfirmedPlacementId] = useState<string | null>(
    null
  );

  // Admin photo upload & inspection state
  const adminFileInputRef = useRef<HTMLInputElement | null>(null);
  const [adminUploadCategory, setAdminUploadCategory] =
    useState<AccommodationPhotoCategory>('Additional Space');
  const [previewPhotoItem, setPreviewPhotoItem] = useState<AccommodationPhotoItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const currentReq =
    careRequests.find((r) => r.id === selectedRequestId) || careRequests[0];

  const allConditionsOptions = [
    'Dementia',
    'Arthritis',
    'Stroke',
    'COPD',
    'Multiple Sclerosis',
    'Brain Injury',
    'Spinal Cord Injury',
    'Cancer',
    "Parkinson's",
    'Hypertension',
    'Diabetes',
    'Heart condition',
    'Respiratory condition',
    'Visual impairment',
    'Hearing impairment',
    'Other – please specify',
  ];

  const allMobilityLevels = [
    'Independent (no aid)',
    'Independent (with aid)',
    'Requires support',
    'Wheelchair user',
    'Unable to walk, requires full assistance',
    'Bedbound, requires full support with mobility and repositioning',
  ];

  const allPersonalCareOptions = [
    'Washing / bathing',
    'Dressing',
    'Toileting',
    'Continence care',
    'Oral care',
    'Hair care',
    'Shaving',
    'Hearing aid assistance',
    'Nail care',
    'Other – please specify',
  ];

  const bedroomOptions = currentReq.accommodation.multipleCarersInHousehold
    ? [SOLE_OCCUPANCY_BEDROOM, SHARED_CARER_BEDROOM]
    : [SOLE_OCCUPANCY_BEDROOM];

  const bathroomOptions = [
    'Private bathroom',
    'Ensuite bathroom',
    'Shared bathroom with client',
    'Shared bathroom with household',
    'Other, please specify',
  ];

  const showerOptions = [
    'Private',
    'En-suite',
    'Shared with client',
    'Shared with household',
    'Other, please specify',
  ];

  const toggleCondition = (item: string) => {
    updateCareRequest(currentReq.id, (prev) => ({
      ...prev,
      conditions: prev.conditions.includes(item)
        ? prev.conditions.filter((c) => c !== item)
        : [...prev.conditions, item],
    }));
  };

  const togglePersonalCare = (item: string) => {
    updateCareRequest(currentReq.id, (prev) => ({
      ...prev,
      personalCare: prev.personalCare.includes(item)
        ? prev.personalCare.filter((c) => c !== item)
        : [...prev.personalCare, item],
    }));
  };

  const openConfirmModal = (req: CareRequestRecord) => {
    const matchedIdx = VETTED_CARERS.findIndex((c) => c.name === req.assignedCarerName);
    setSelectedCarerIdx(matchedIdx >= 0 ? matchedIdx : 0);
    setMarkAsEmergency(req.isEmergency);
    const isBedroomValid =
      req.accommodation.bedroomType === SOLE_OCCUPANCY_BEDROOM ||
      req.accommodation.bedroomType === 'Private bedroom' ||
      (Boolean(req.accommodation.multipleCarersInHousehold) &&
        req.accommodation.bedroomType === SHARED_CARER_BEDROOM &&
        Boolean(req.accommodation.bothCarersAgreedSharedBedroom));
    setAdminConfirmedAccommodation(
      req.accommodation.privateBedroomConfirmed &&
        isBedroomValid &&
        !hasPendingAccommodationPhotos(req.accommodation)
    );
    setConfirmModalRequest(req);
  };

  const handleFinalisePlacement = () => {
    if (!confirmModalRequest) return;
    if (!confirmModalRequest.accommodation.privateBedroomConfirmed) {
      triggerToast(
        'Compulsory: Please confirm that the live-in carer will have their own private bedroom for the duration of the placement.'
      );
      return;
    }
    if (
      confirmModalRequest.accommodation.bedroomType === SHARED_CARER_BEDROOM &&
      (!confirmModalRequest.accommodation.multipleCarersInHousehold ||
        !confirmModalRequest.accommodation.bothCarersAgreedSharedBedroom)
    ) {
      triggerToast(
        'Shared bedroom with another live-in carer requires multiple carers in the household and explicit agreement from both carers before confirming.'
      );
      return;
    }
    if (hasPendingAccommodationPhotos(confirmModalRequest.accommodation)) {
      triggerToast(
        'Pending Approval: Please review and approve or reject all client-submitted accommodation photographs first.'
      );
      return;
    }
    if (!adminConfirmedAccommodation) {
      triggerToast('Please tick administrator accommodation verification to finalise.');
      return;
    }

    const chosenCarer = VETTED_CARERS[selectedCarerIdx] || VETTED_CARERS[0];
    const createdOrUpdated = confirmCareRequestToPlacement(
      confirmModalRequest.id,
      chosenCarer.name,
      chosenCarer.avatar,
      markAsEmergency
    );

    setConfirmModalRequest(null);
    if (createdOrUpdated) {
      setRecentlyConfirmedPlacementId(createdOrUpdated.id);
      triggerToast(
        `Placement confirmed for ${confirmModalRequest.displayTitle} and automatically added to Placements!`
      );
    }
  };

  const handleAdvanceStage = (req: CareRequestRecord) => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.stage === req.stage);
    if (idx < 3) {
      const nextStage = PIPELINE_STAGES[idx + 1].stage;
      updateCareRequest(req.id, (prev) => ({
        ...prev,
        stage: nextStage,
        lastUpdated: 'Just now',
      }));
      triggerToast(`Moved ${req.displayTitle} to "${nextStage}"`);
    } else if (idx === 3) {
      openConfirmModal(req);
    }
  };

  // Admin approves an individual client-uploaded photograph
  const handleAdminApprovePhoto = (photoId: string) => {
    updateCareRequest(currentReq.id, (prev) => {
      const currentItems = getAccommodationPhotoItems(prev.accommodation);
      const nextItems = currentItems.map((item) =>
        item.id === photoId ? { ...item, status: 'approved' as const } : item
      );
      const stillHasPending = nextItems.some((item) => item.status === 'pending_approval');
      return {
        ...prev,
        lastUpdated: 'Just now',
        accommodation: {
          ...prev.accommodation,
          photoItems: nextItems,
          adminVerified: !stillHasPending && prev.accommodation.privateBedroomConfirmed,
        },
      };
    });
    setPreviewPhotoItem((prev) =>
      prev && prev.id === photoId ? { ...prev, status: 'approved' } : prev
    );
    triggerToast(
      'Photograph approved by Admin — added to client profile and visible to approved carers.'
    );
  };

  // Admin rejects an individual client-uploaded photograph (hidden from profile & carers)
  const handleAdminRejectPhoto = (photoId: string) => {
    updateCareRequest(currentReq.id, (prev) => {
      const currentItems = getAccommodationPhotoItems(prev.accommodation);
      const nextItems = currentItems.map((item) =>
        item.id === photoId ? { ...item, status: 'rejected' as const } : item
      );
      const stillHasPending = nextItems.some((item) => item.status === 'pending_approval');
      return {
        ...prev,
        lastUpdated: 'Just now',
        accommodation: {
          ...prev.accommodation,
          photoItems: nextItems,
          adminVerified: !stillHasPending && prev.accommodation.privateBedroomConfirmed,
        },
      };
    });
    setPreviewPhotoItem((prev) =>
      prev && prev.id === photoId ? { ...prev, status: 'rejected' } : prev
    );
    triggerToast(
      'Photograph rejected by Admin — excluded from client profile and hidden from carers.'
    );
  };

  const handleAdminApproveAllPending = () => {
    updateCareRequest(currentReq.id, (prev) => {
      const currentItems = getAccommodationPhotoItems(prev.accommodation);
      const nextItems = currentItems.map((item) =>
        item.status === 'pending_approval' ? { ...item, status: 'approved' as const } : item
      );
      return {
        ...prev,
        lastUpdated: 'Just now',
        accommodation: {
          ...prev.accommodation,
          photoItems: nextItems,
          adminVerified: prev.accommodation.privateBedroomConfirmed,
        },
      };
    });
    triggerToast('All pending accommodation photographs approved and published to profile.');
  };

  // Requirement 5: Admin uploads directly through Admin portal on client's behalf -> automatically approved!
  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl) return;
        const newAdminPhoto: AccommodationPhotoItem = {
          id: `admin-ph-${Date.now()}-${idx}`,
          url: dataUrl,
          category: adminUploadCategory,
          status: 'approved',
          uploadedBy: 'admin',
          uploadedAt: 'Uploaded by Admin just now',
          consentConfirmed: true,
          reviewedBy: 'Admin',
        };
        updateCareRequest(currentReq.id, (prev) => {
          const existing = getAccommodationPhotoItems(prev.accommodation);
          return {
            ...prev,
            lastUpdated: 'Just now',
            accommodation: {
              ...prev.accommodation,
              photoItems: [...existing, newAdminPhoto],
            },
          };
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    triggerToast(
      'Uploaded by Admin on client’s behalf — automatically approved and added to client profile.'
    );
  };

  const handleAdminAddSamplePhoto = () => {
    const existingItems = getAccommodationPhotoItems(currentReq.accommodation);
    const nextPhoto =
      EXTRA_SAMPLE_PHOTOS[existingItems.length % EXTRA_SAMPLE_PHOTOS.length];
    const newAdminPhoto: AccommodationPhotoItem = {
      id: `admin-sample-${Date.now()}`,
      url: nextPhoto,
      category: adminUploadCategory,
      status: 'approved',
      uploadedBy: 'admin',
      uploadedAt: 'Uploaded by Admin just now',
      consentConfirmed: true,
      reviewedBy: 'Admin',
    };
    updateCareRequest(currentReq.id, (prev) => ({
      ...prev,
      lastUpdated: 'Just now',
      accommodation: {
        ...prev.accommodation,
        photoItems: [...getAccommodationPhotoItems(prev.accommodation), newAdminPhoto],
      },
    }));
    triggerToast(
      'Uploaded by Admin on client’s behalf — automatically approved without requiring second review.'
    );
  };

  const handleRemovePhotoItem = (photoId: string) => {
    updateCareRequest(currentReq.id, (prev) => {
      const nextItems = getAccommodationPhotoItems(prev.accommodation).filter(
        (item) => item.id !== photoId
      );
      const stillHasPending = nextItems.some((item) => item.status === 'pending_approval');
      return {
        ...prev,
        lastUpdated: 'Just now',
        accommodation: {
          ...prev.accommodation,
          photoItems: nextItems,
          adminVerified: stillHasPending ? false : prev.accommodation.adminVerified,
        },
      };
    });
    if (previewPhotoItem?.id === photoId) {
      setPreviewPhotoItem(null);
    }
    triggerToast('Accommodation photograph removed.');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative select-none bg-[#FAF7F2] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-[#C5A059]/40">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Banner when a Care Request has just been finalised into Placements */}
      {recentlyConfirmedPlacementId && (
        <div className="relative z-20 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Placement confirmed and automatically added to the <strong>Placements</strong> roster
              with inherited Carer Accommodation details.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToPlacements && (
              <button
                onClick={() => onNavigateToPlacements(recentlyConfirmedPlacementId)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0A1629] text-white text-xs font-semibold hover:bg-[#152542] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Placements</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF7A]" />
              </button>
            )}
            <button
              onClick={() => setRecentlyConfirmedPlacementId(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODE 1: CARE REQUESTS & MATCHING PIPELINE BOARD (Option B incorporated)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'carer-form' ? (
        <CarerAccommodationView
          requestId={currentReq.id}
          onBack={() => setViewMode('detail')}
          onOpenAdminReview={() => {
            setActiveTab('accommodation');
            setViewMode('detail');
          }}
        />
      ) : viewMode === 'pipeline' ? (
        <div className="space-y-5 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5549] hover:text-[#0A1629] mb-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0A1629] tracking-tight">
                Client Care Requests &amp; Matching Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Manage new enquiries, review care &amp; accommodation requirements, match vetted live-in
                carers, and finalise placements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onNavigateToPlacements && (
                <button
                  onClick={() => onNavigateToPlacements()}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DFD5C2] text-xs font-semibold text-[#0A1629] hover:border-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>View Confirmed Placements</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedRequestId('cr-doris');
                  setActiveTab('accommodation');
                  setViewMode('detail');
                }}
                className="px-4 py-2 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Doris Care Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5-Column Matching Pipeline (New Enquiries -> Reviewing -> Matching -> Accommodation -> Finalised) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
            {PIPELINE_STAGES.map((col) => {
              const items = careRequests.filter((r) => r.stage === col.stage);
              return (
                <div
                  key={col.stage}
                  className="bg-[#F4EFE6]/80 rounded-2xl border border-[#E5DEC9] p-3.5 flex flex-col gap-3 min-h-[420px]"
                >
                  <div className="pb-2.5 border-b border-[#E5DEC9]">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#0A1629] uppercase tracking-wider">
                        {col.shortLabel}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#DFD5C2] text-[11px] font-bold text-[#0A1629]">
                        {items.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71685A] mt-1 leading-snug">{col.description}</p>
                  </div>

                  <div className="space-y-3 flex-1">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#D8CEBC] p-5 text-center text-[11px] text-[#8C827A]">
                        No care requests currently in this stage
                      </div>
                    ) : (
                      items.map((req) => (
                        <div
                          key={req.id}
                          className="bg-white rounded-xl border border-[#EAE2D2] p-3.5 shadow-2xs hover:border-[#C5A059] transition-all flex flex-col gap-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              onClick={() => {
                                setSelectedRequestId(req.id);
                                setViewMode('detail');
                              }}
                              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                            >
                              <img
                                src={req.avatar}
                                alt={req.displayTitle}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FAF5EE] shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-serif text-base font-bold text-[#0A1629] group-hover:text-[#B88E3E] truncate">
                                  {req.displayTitle}
                                </div>
                                <div className="text-[11px] text-[#64748B] truncate">
                                  Age {req.age} &bull; {req.location}
                                </div>
                              </div>
                            </div>
                            {req.isEmergency && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold shrink-0">
                                Urgent
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-[#475569] space-y-1 pt-1 border-t border-[#F5F1E9]">
                            <div className="font-semibold text-[#0A1629]">{req.placementType}</div>
                            <div>Start: {req.preferredStart}</div>
                            <div className="flex items-center gap-1 text-[10.5px]">
                              <BedDouble className="w-3 h-3 text-[#B88E3E] shrink-0" />
                              <span>
                                {req.accommodation.bedroomType} &bull; {req.accommodation.bathroomType}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10.5px]">
                              <Users className="w-3 h-3 text-[#B88E3E] shrink-0" />
                              <span>Carer: {req.assignedCarerName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-[#0A1629] tabular-nums">
                              <Coins className="w-3 h-3 text-[#B88E3E] shrink-0" />
                              <span>Agreed G&amp;G Client Fee: &pound;{req.agreedClientWeeklyFee}/wk</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#F5F1E9] flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedRequestId(req.id);
                                setActiveTab('accommodation');
                                setViewMode('detail');
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-[#E2D9C8] text-[11px] font-medium text-[#0A1629] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                            >
                              Open Details
                            </button>

                            {req.stage !== 'Finalised' ? (
                              <button
                                onClick={() =>
                                  req.stage === 'Confirming Accommodation'
                                    ? openConfirmModal(req)
                                    : handleAdvanceStage(req)
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#C8A464] hover:bg-[#B89352] text-white text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>
                                  {req.stage === 'Confirming Accommodation'
                                    ? 'Finalise'
                                    : 'Next Stage'}
                                </span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                In Placements
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════════
            MODE 2: CLIENT CARE REQUEST DETAIL (Matches image_34c66094.png exactly)
        ═══════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-5 relative z-10">
          {/* Top Navigation Bar: Back to Care Requests Pipeline + Quick Client Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setViewMode('pipeline')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0A1629] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Care Requests</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center bg-white rounded-lg border border-[#E6DEC8] p-0.5 mr-1">
                <button
                  onClick={() => setPortalRoleView('admin')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    portalRoleView === 'admin'
                      ? 'bg-[#0A1629] text-white'
                      : 'text-[#475569] hover:text-[#0A1629]'
                  }`}
                >
                  Admin View
                </button>
                <button
                  onClick={() => {
                    setPortalRoleView('client');
                    if (activeTab === 'activity') setActiveTab('overview');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                    portalRoleView === 'client'
                      ? 'bg-[#C8A464] text-white'
                      : 'text-[#475569] hover:text-[#0A1629]'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Client Portal View</span>
                </button>
              </div>
              {portalRoleView === 'admin' && (
                <>
                  <span className="text-[11px] text-[#71685A] mr-1">Active Enquiries:</span>
                  {careRequests.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRequestId(r.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        r.id === currentReq.id
                          ? 'bg-[#0A1629] text-white shadow-2xs'
                          : 'bg-white border border-[#E6DEC8] text-[#475569] hover:border-[#C5A059]'
                      }`}
                    >
                      {r.displayTitle}
                    </button>
                  ))}
                  <button
                    onClick={() => setViewMode('pipeline')}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-[#DFD0B4] text-xs font-semibold text-[#8A6626] hover:bg-[#F3E9D7] transition-colors cursor-pointer ml-1"
                  >
                    Matching Pipeline ({careRequests.length})
                  </button>
                </>
              )}
            </div>
          </div>

          {portalRoleView === 'client' && (
            <div className="rounded-xl bg-[#FAF5EE] border border-[#DFD0B4] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#0A1629]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B88E3E] shrink-0" />
                <span>
                  <strong>Client Portal Care Request View:</strong> Displays only your care arrangement details and your agreed Grace &amp; Goodwill weekly care fee (&pound;{currentReq.agreedClientWeeklyFee}/wk).
                </span>
              </div>
              <button
                onClick={() => setShowClientAgreementPreview(true)}
                className="text-xs font-semibold text-[#8A6626] hover:text-[#0A1629] underline cursor-pointer"
              >
                View Client Fee Schedule &rarr;
              </button>
            </div>
          )}

          {/* Client Header Banner matching image_34c66094.png */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-4">
              <img
                src={currentReq.avatar}
                alt={currentReq.displayTitle}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white border border-[#E5DEC9] shadow-xs shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#0A1629] leading-tight">
                    {currentReq.displayTitle}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-[#F5E8CE] text-[#8B6623] text-xs font-semibold">
                    {currentReq.stage === 'Confirming Accommodation' ? 'New' : currentReq.stage}
                  </span>
                  {currentReq.isEmergency && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                      Emergency Live-in
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#5C5549] mt-1">
                  Age {currentReq.age} &bull; {currentReq.location}
                </p>
                <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5">
                  {currentReq.placementType} &nbsp;|&nbsp; Start: {currentReq.preferredStart} &nbsp;|&nbsp;{' '}
                  {currentReq.duration}
                </p>
              </div>
            </div>

            {/* Top-Right Client Accommodation Form, Save Draft & Confirm Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
              <button
                onClick={() => setViewMode('carer-form')}
                className="px-4 py-2.5 rounded-xl bg-[#FAF5EE] border border-[#DFD0B4] text-xs sm:text-sm font-semibold text-[#0A1629] hover:border-[#C5A059] hover:bg-[#F3E9D7] transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <BedDouble className="w-4 h-4 text-[#B88E3E]" />
                <span>Client Carer Accommodation Form</span>
              </button>
              <button
                onClick={() => triggerToast(`Draft saved for ${currentReq.displayTitle}`)}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#E2D9C8] text-xs sm:text-sm font-semibold text-[#1E293B] hover:bg-[#FAF6EE] transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#8C6D2B]" />
                <span>Save Draft</span>
              </button>
              {portalRoleView === 'admin' && (
                <button
                  onClick={() => openConfirmModal(currentReq)}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>
                    {currentReq.stage === 'Finalised' ? 'Update Confirmed Placement' : 'Confirm & Proceed'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 5-Tab Bar matching image_34c66094.png */}
          <div className="bg-white rounded-xl border border-[#EAE2D2] px-3 sm:px-5 overflow-x-auto shadow-2xs">
            <div className="flex items-center gap-4 sm:gap-8 min-w-max">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'health', label: 'Health & Support', icon: Shield },
                { id: 'accommodation', label: 'Home & Accommodation', icon: Home },
                { id: 'lifestyle', label: 'Lifestyle & Preferences', icon: Heart },
                ...(portalRoleView === 'admin'
                  ? [{ id: 'activity', label: 'Notes & Activity', icon: ClipboardList }]
                  : []),
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`py-3.5 text-xs sm:text-[13.5px] font-medium inline-flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#C8A464] text-[#0A1629] font-semibold'
                        : 'border-transparent text-[#64748B] hover:text-[#0A1629]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-[#C8A464]' : 'text-[#94A3B8]'}`}
                    />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TAB 3 (DEFAULT): HOME & ACCOMMODATION matching image_34c66094.png ── */}
          {activeTab === 'accommodation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT COLUMN (6 cols): Medical Conditions, Mobility, Personal Care Requirements */}
              <div className="lg:col-span-6 space-y-5">
                {/* 1. Medical Conditions */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">Medical Conditions</h3>
                    </div>
                    <button
                      onClick={() =>
                        setEditingCard(editingCard === 'conditions' ? null : 'conditions')
                      }
                      className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{editingCard === 'conditions' ? 'Done' : 'Edit'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#64748B] mb-3">
                    Pre-existing conditions (select all that apply)
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {allConditionsOptions.map((cond) => {
                      const isSelected = currentReq.conditions.includes(cond);
                      return (
                        <button
                          key={cond}
                          onClick={() => toggleCondition(cond)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                              : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#B88E3E]" />}
                          <span>{cond}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Mobility */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Accessibility className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">Mobility</h3>
                    </div>
                    <button
                      onClick={() => setEditingCard(editingCard === 'mobility' ? null : 'mobility')}
                      className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{editingCard === 'mobility' ? 'Done' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-7">
                      <p className="text-xs text-[#64748B] mb-2.5">Mobility level</p>
                      <div className="flex flex-wrap gap-2">
                        {allMobilityLevels.map((lvl) => {
                          const isSelected = currentReq.mobilityLevel === lvl;
                          return (
                            <button
                              key={lvl}
                              onClick={() =>
                                updateCareRequest(currentReq.id, (prev) => ({
                                  ...prev,
                                  mobilityLevel: lvl,
                                }))
                              }
                              className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                                  : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#B88E3E]" />}
                              <span>{lvl}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <p className="text-xs font-semibold text-[#0A1629] mb-2">Details</p>
                      {editingCard === 'mobility' ? (
                        <textarea
                          rows={4}
                          value={currentReq.mobilityDetails}
                          placeholder="Explain mobility requirements, including transfers, repositioning, or specialist moving and handling equipment..."
                          onChange={(e) =>
                            updateCareRequest(currentReq.id, (prev) => ({
                              ...prev,
                              mobilityDetails: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] p-2.5 text-xs text-[#334155] focus:outline-none focus:border-[#C8A464]"
                        />
                      ) : (
                        <div className="rounded-xl bg-[#FAF6EE] border border-[#EFE8DC] p-3 text-xs text-[#475569] leading-relaxed">
                          {currentReq.mobilityDetails}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Personal Care Requirements */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">
                        Personal Care Requirements
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        setEditingCard(editingCard === 'personalCare' ? null : 'personalCare')
                      }
                      className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{editingCard === 'personalCare' ? 'Done' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-7">
                      <p className="text-xs text-[#64748B] mb-2.5">
                        Support required with (select all that apply)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {allPersonalCareOptions.map((item) => {
                          const isSelected = currentReq.personalCare.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => togglePersonalCare(item)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                                  : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#B88E3E]" />}
                              <span>{item}</span>
                            </button>
                          );
                        })}
                      </div>
                      {currentReq.personalCare.includes('Other – please specify') && (
                        <input
                          type="text"
                          value={currentReq.personalCareOtherDetails || ''}
                          onChange={(e) =>
                            updateCareRequest(currentReq.id, (prev) => ({
                              ...prev,
                              personalCareOtherDetails: e.target.value,
                            }))
                          }
                          placeholder="Please specify additional personal care requirements..."
                          className="w-full mt-2.5 px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                        />
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <p className="text-xs font-semibold text-[#0A1629] mb-2">Notes</p>
                      {editingCard === 'personalCare' ? (
                        <textarea
                          rows={4}
                          value={currentReq.personalCareNotes}
                          placeholder="Add further personal care details..."
                          onChange={(e) =>
                            updateCareRequest(currentReq.id, (prev) => ({
                              ...prev,
                              personalCareNotes: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] p-2.5 text-xs text-[#334155] focus:outline-none focus:border-[#C8A464]"
                        />
                      ) : (
                        <div className="rounded-xl bg-[#FAF6EE] border border-[#EFE8DC] p-3 text-xs text-[#475569] leading-relaxed">
                          {currentReq.personalCareNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (6 cols): Carer Accommodation, Bedroom, Bathroom, Photos */}
              <div className="lg:col-span-6 space-y-5">
                {/* 1. Carer Accommodation (Compulsory Requirements + Live Approval Status) */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Home className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">Carer Accommodation</h3>
                      <span
                        className={`text-[11.5px] font-semibold inline-flex items-center gap-1 ${
                          getAccommodationApprovalStatus(currentReq.accommodation) === 'Approved'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {getAccommodationApprovalStatus(currentReq.accommodation) === 'Approved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{getAccommodationApprovalStatus(currentReq.accommodation)}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setViewMode('carer-form')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6EE] border border-[#E5D8BE] text-xs font-semibold text-[#0A1629] hover:border-[#C8A464] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#B88E3E]" />
                      <span>Open Client Form</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed mb-3.5">
                    The live-in carer must have their own private bedroom and access to a fully
                    equipped bathroom with a toilet, washbasin and either a shower or bathtub. The
                    bathroom may be private or shared, provided the arrangements are suitable.
                  </p>

                  {/* Compulsory Private Bedroom Confirmation Checkbox */}
                  <label className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#EAF5EE] border border-[#CBE6D4] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentReq.accommodation.privateBedroomConfirmed}
                      onChange={(e) =>
                        updateCareRequest(currentReq.id, (prev) => ({
                          ...prev,
                          accommodation: {
                            ...prev.accommodation,
                            privateBedroomConfirmed: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 accent-[#2F5233] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1B3B22]">
                      I confirm that the live-in carer will have their own private bedroom for the
                      duration of the placement. *
                    </span>
                  </label>

                  {/* Admin Overall Accommodation Approval Toggle */}
                  <div className="mt-3 pt-3 border-t border-[#F1ECE2] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#5C5549]">
                      {hasPendingAccommodationPhotos(currentReq.accommodation)
                        ? 'Carer accommodation remains Pending Approval until client photographs below are reviewed.'
                        : currentReq.accommodation.adminVerified
                        ? 'Admin has reviewed and approved carer accommodation for profile & carer visibility.'
                        : 'Ready for Admin approval (photographs are optional).'}
                    </span>
                    {!hasPendingAccommodationPhotos(currentReq.accommodation) && (
                      <button
                        onClick={() => {
                          if (!currentReq.accommodation.privateBedroomConfirmed) {
                            triggerToast('Compulsory: Confirm private bedroom first.');
                            return;
                          }
                          updateCareRequest(currentReq.id, (prev) => ({
                            ...prev,
                            accommodation: {
                              ...prev.accommodation,
                              adminVerified: !prev.accommodation.adminVerified,
                            },
                          }));
                          triggerToast(
                            currentReq.accommodation.adminVerified
                              ? 'Carer accommodation returned to Pending Approval.'
                              : 'Carer accommodation approved by Admin.'
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                          currentReq.accommodation.adminVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-[#0A1629] text-white hover:bg-[#152542]'
                        }`}
                      >
                        {currentReq.accommodation.adminVerified
                          ? 'Approved ✓'
                          : 'Approve Accommodation'}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Bedroom Arrangements */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BedDouble className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">Bedroom Arrangements</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('carer-form')}
                      className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#64748B]">
                    Bedroom provided for live-in carer (sharing a bedroom with the client or other
                    household members is not permitted)
                  </p>

                  {/* Household multiple-carers toggle governing second bedroom option */}
                  <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(currentReq.accommodation.multipleCarersInHousehold)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        updateCareRequest(currentReq.id, (prev) => ({
                          ...prev,
                          accommodation: {
                            ...prev.accommodation,
                            multipleCarersInHousehold: checked,
                            bedroomType: checked
                              ? prev.accommodation.bedroomType
                              : SOLE_OCCUPANCY_BEDROOM,
                            bothCarersAgreedSharedBedroom: checked
                              ? prev.accommodation.bothCarersAgreedSharedBedroom
                              : false,
                          },
                        }));
                      }}
                      className="w-4 h-4 accent-[#0A1629] rounded cursor-pointer"
                    />
                    <span>Multiple carers are accommodated within the same household</span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {bedroomOptions.map((opt) => {
                      const isSelected =
                        currentReq.accommodation.bedroomType === opt ||
                        (opt === SOLE_OCCUPANCY_BEDROOM &&
                          currentReq.accommodation.bedroomType === 'Private bedroom');
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            updateCareRequest(currentReq.id, (prev) => ({
                              ...prev,
                              accommodation: {
                                ...prev.accommodation,
                                bedroomType: opt,
                                privateBedroomConfirmed: true,
                                bothCarersAgreedSharedBedroom:
                                  opt === SHARED_CARER_BEDROOM
                                    ? prev.accommodation.bothCarersAgreedSharedBedroom
                                    : false,
                              },
                            }))
                          }
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 text-left transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                              : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#B88E3E] shrink-0" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {currentReq.accommodation.bedroomType === SHARED_CARER_BEDROOM && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#E6D7B9] p-3 space-y-2 text-xs text-[#475569]">
                      <p className="leading-relaxed">
                        If a shared bedroom with another live-in carer is proposed,{' '}
                        <strong className="text-[#0A1629]">
                          both carers must explicitly agree to the arrangement before the placement
                          is confirmed
                        </strong>
                        . Neither carer should be expected or required to share accommodation
                        without their consent.
                      </p>
                      {portalRoleView === 'admin' && (
                        <label className="flex items-start gap-2 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(
                              currentReq.accommodation.bothCarersAgreedSharedBedroom
                            )}
                            onChange={(e) =>
                              updateCareRequest(currentReq.id, (prev) => ({
                                ...prev,
                                accommodation: {
                                  ...prev.accommodation,
                                  bothCarersAgreedSharedBedroom: e.target.checked,
                                },
                              }))
                            }
                            className="mt-0.5 w-4 h-4 accent-[#0A1629] rounded cursor-pointer"
                          />
                          <span className="font-semibold text-[#0A1629]">
                            Both live-in carers have explicitly agreed to share this bedroom prior
                            to placement confirmation. *
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Bathroom Arrangements + Compulsory Helpful Tips Wording */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-[15px] font-bold text-[#0A1629]">Bathroom Arrangements</h3>
                    </div>
                    <button
                      onClick={() => setViewMode('carer-form')}
                      className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left: Bathroom Arrangements */}
                    <div>
                      <p className="text-xs font-medium text-[#64748B] mb-2.5">
                        Bathroom Arrangements
                      </p>
                      <div className="space-y-2">
                        {bathroomOptions.map((opt) => {
                          const isSelected =
                            currentReq.accommodation.bathroomType === opt ||
                            (opt === 'Other, please specify' &&
                              currentReq.accommodation.bathroomType === 'Other – please specify');
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                updateCareRequest(currentReq.id, (prev) => ({
                                  ...prev,
                                  accommodation: {
                                    ...prev.accommodation,
                                    bathroomType: opt,
                                  },
                                }))
                              }
                              className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                                  : 'bg-white border-[#ECE7DD] text-[#475569] hover:border-[#C8A464]'
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-[#B88E3E] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1] shrink-0" />
                              )}
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                        {(currentReq.accommodation.bathroomType === 'Other, please specify' ||
                          currentReq.accommodation.bathroomType === 'Other – please specify') && (
                          <input
                            type="text"
                            value={currentReq.accommodation.bathroomOtherDetails || ''}
                            onChange={(e) =>
                              updateCareRequest(currentReq.id, (prev) => ({
                                ...prev,
                                accommodation: {
                                  ...prev.accommodation,
                                  bathroomOtherDetails: e.target.value,
                                },
                              }))
                            }
                            placeholder="Please specify bathroom arrangement..."
                            className="w-full mt-2 px-3 py-1.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Right: Shower Arrangements */}
                    <div>
                      <p className="text-xs font-medium text-[#64748B] mb-2.5">
                        Shower Arrangements
                      </p>
                      <div className="space-y-2">
                        {showerOptions.map((opt) => {
                          const isSelected =
                            currentReq.accommodation.showerType === opt ||
                            (opt === 'Other, please specify' &&
                              currentReq.accommodation.showerType === 'Other – please specify');
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                updateCareRequest(currentReq.id, (prev) => ({
                                  ...prev,
                                  accommodation: {
                                    ...prev.accommodation,
                                    showerType: opt,
                                  },
                                }))
                              }
                              className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                                  : 'bg-white border-[#ECE7DD] text-[#475569] hover:border-[#C8A464]'
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-[#B88E3E] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1] shrink-0" />
                              )}
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                        {(currentReq.accommodation.showerType === 'Other, please specify' ||
                          currentReq.accommodation.showerType === 'Other – please specify') && (
                          <input
                            type="text"
                            value={currentReq.accommodation.showerOtherDetails || ''}
                            onChange={(e) =>
                              updateCareRequest(currentReq.id, (prev) => ({
                                ...prev,
                                accommodation: {
                                  ...prev.accommodation,
                                  showerOtherDetails: e.target.value,
                                },
                              }))
                            }
                            placeholder="Please specify shower arrangement..."
                            className="w-full mt-2 px-3 py-1.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Accommodation Photos (Optional) — Admin Review, Individual Moderation & Direct Auto-Approved Admin Upload */}
                {(() => {
                  const photoItems = getAccommodationPhotoItems(currentReq.accommodation);
                  const pendingCount = photoItems.filter(
                    (p) => p.status === 'pending_approval'
                  ).length;
                  const approvedCount = photoItems.filter((p) => p.status === 'approved').length;
                  const rejectedCount = photoItems.filter((p) => p.status === 'rejected').length;

                  return (
                    <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <Camera className="w-4 h-4 text-[#C8A464]" />
                            <h3 className="text-[15px] font-bold text-[#0A1629]">
                              Accommodation Photos (Optional) — Admin Moderation
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-[#64748B] mt-1">
                            <span>{approvedCount} Approved (visible to carers)</span>
                            <span aria-hidden="true">&bull;</span>
                            <span
                              className={
                                pendingCount > 0 ? 'font-semibold text-amber-700' : undefined
                              }
                            >
                              {pendingCount} Pending Approval
                            </span>
                            {rejectedCount > 0 && (
                              <>
                                <span aria-hidden="true">&bull;</span>
                                <span className="text-rose-700">
                                  {rejectedCount} Rejected (hidden)
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setViewMode('carer-form')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A6626] hover:text-[#0A1629] cursor-pointer"
                        >
                          <span>Client Upload View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Admin Review Banner when client-uploaded photos are Pending Approval */}
                      {pendingCount > 0 && (
                        <div className="rounded-xl bg-amber-50/90 border border-amber-200 p-3.5 space-y-2 text-xs text-amber-950">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>
                                {pendingCount} Client Photograph{pendingCount > 1 ? 's' : ''}{' '}
                                Pending Admin Review
                              </span>
                            </div>
                            <button
                              onClick={handleAdminApproveAllPending}
                              className="px-3 py-1 rounded-lg bg-[#0A1629] text-white text-[11px] font-semibold hover:bg-[#152542] transition-colors cursor-pointer"
                            >
                              Approve All Reviewed
                            </button>
                          </div>
                          <p className="text-[11.5px] text-amber-900 leading-relaxed">
                            Inspect each client-submitted photograph before publication to confirm
                            it only shows the carer&rsquo;s bedroom, bathroom or appropriate private
                            space, with no people, personal photographs, visible house/street
                            numbers, documents or sensitive details. Pending and rejected
                            photographs remain hidden from the client&rsquo;s profile and carers.
                          </p>
                        </div>
                      )}

                      {/* Individual Photograph Moderation Cards */}
                      {photoItems.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#D8CEBC] bg-[#FAF8F4] p-5 text-center text-xs text-[#64748B]">
                          No accommodation photographs uploaded yet. Photographs are optional for
                          clients.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {photoItems.map((item) => {
                            const isPending = item.status === 'pending_approval';
                            const isApproved = item.status === 'approved';
                            const isRejected = item.status === 'rejected';
                            return (
                              <div
                                key={item.id}
                                className={`rounded-xl border overflow-hidden flex flex-col bg-[#FAF8F4] transition-all ${
                                  isPending
                                    ? 'border-amber-300 ring-1 ring-amber-200/70'
                                    : isRejected
                                    ? 'border-rose-200 opacity-85'
                                    : 'border-[#E5DEC9]'
                                }`}
                              >
                                <div className="relative h-36 bg-[#EFEAE0] group">
                                  <img
                                    src={item.url}
                                    alt={item.category}
                                    onClick={() => setPreviewPhotoItem(item)}
                                    className={`w-full h-full object-cover cursor-pointer ${
                                      isRejected ? 'grayscale' : ''
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setPreviewPhotoItem(item)}
                                    className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-[#0A1629]/80 text-white text-[10.5px] font-medium inline-flex items-center gap-1 hover:bg-[#0A1629] cursor-pointer"
                                  >
                                    <ZoomIn className="w-3 h-3" />
                                    <span>Inspect</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhotoItem(item.id)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-md bg-white/90 hover:bg-rose-600 text-[#475569] hover:text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                                    title="Remove photograph"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-bold text-[#0A1629]">
                                        {item.category}
                                      </span>
                                      <span
                                        className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
                                          isApproved
                                            ? 'text-emerald-700'
                                            : isPending
                                            ? 'text-amber-700'
                                            : 'text-rose-700'
                                        }`}
                                      >
                                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        {isPending && <Clock className="w-3.5 h-3.5" />}
                                        {isRejected && <XCircle className="w-3.5 h-3.5" />}
                                        <span>
                                          {isApproved
                                            ? 'Approved'
                                            : isPending
                                            ? 'Pending Approval'
                                            : 'Rejected (Hidden)'}
                                        </span>
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-[#64748B] mt-0.5">
                                      {item.uploadedBy === 'admin'
                                        ? 'Admin Upload · Auto-Approved'
                                        : 'Client Upload · Consent Confirmed'}
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-[#ECE5D8] flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleAdminApprovePhoto(item.id)}
                                      disabled={isApproved}
                                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center gap-1 transition-colors ${
                                        isApproved
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                          : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                                      }`}
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>{isApproved ? 'Approved' : 'Approve'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAdminRejectPhoto(item.id)}
                                      disabled={isRejected}
                                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center gap-1 transition-colors ${
                                        isRejected
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200 cursor-default'
                                          : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer'
                                      }`}
                                    >
                                      <X className="w-3 h-3" />
                                      <span>{isRejected ? 'Rejected' : 'Reject'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Requirement 5: Direct Admin Upload on Client's Behalf (Automatically Approved) */}
                      <div className="rounded-xl bg-[#FAF6EE] border border-[#E5DEC9] p-3.5 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-[#0A1629] flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-[#B88E3E]" />
                              <span>Upload on Client&rsquo;s Behalf (Admin Auto-Approved)</span>
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-0.5">
                              Photographs uploaded directly by Admin are pre-vetted and
                              automatically approved onto the client&rsquo;s profile without
                              requiring a second approval.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <select
                            value={adminUploadCategory}
                            onChange={(e) =>
                              setAdminUploadCategory(e.target.value as AccommodationPhotoCategory)
                            }
                            aria-label="Photograph space category"
                            className="px-3 py-2 rounded-lg bg-white border border-[#DFD5C2] text-xs font-medium text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                          >
                            <option value="Carer Bedroom">Carer Bedroom</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Additional Space">Additional Space</option>
                          </select>

                          <input
                            ref={adminFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdminFileUpload}
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => adminFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-lg bg-[#0A1629] hover:bg-[#152542] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#D4AF7A]" />
                            <span>Upload Photo (Auto-Approve)</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleAdminAddSamplePhoto}
                            className="px-3 py-2 rounded-lg bg-white border border-[#DFD5C2] hover:border-[#C8A464] text-xs font-medium text-[#0A1629] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
                            <span>Add Vetted Sample</span>
                          </button>
                        </div>
                      </div>

                      {/* Requirement 2: Retained Blue Information Notice with Exact Wording */}
                      <div className="rounded-xl bg-[#EBF3FA] border border-[#C6DCF0] px-4 py-3.5 flex items-start gap-3">
                        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#1E3A5F] leading-relaxed">
                          Please do not upload photographs containing people, personal photographs,
                          visible house numbers, street numbers, documents or other identifying or
                          sensitive information. Only upload photographs of the live-in
                          carer&rsquo;s bedroom, bathroom and any other private space available to
                          the carer, if you feel happy and comfortable doing so. Uploading
                          photographs is entirely optional.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 5. Helpful tips Card — Exact Original Layout with Updated Compulsory Bathroom Wording */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE3D4] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8DEC9]">
                    <CheckCircle2 className="w-4 h-4 text-[#B88E3E]" />
                    <h4 className="text-xs font-bold text-[#0A1629]">Helpful tips</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B88E3E] mt-0.5 shrink-0" />
                      <span className="text-[#7D7362]">
                        The live-in carer must have their own private bedroom.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B88E3E] mt-0.5 shrink-0" />
                      <span className="text-[#7D7362]">
                        A quiet and comfortable space helps the carer to rest.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B88E3E] mt-0.5 shrink-0" />
                      <span className="text-[#7D7362]">
                        Compulsory: The live-in carer must have access to a fully equipped bathroom
                        with a toilet, washbasin and either a shower or bathtub.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B88E3E] mt-0.5 shrink-0" />
                      <span className="text-[#7D7362]">
                        You can upload photographs to give carers a better understanding of the
                        accommodation.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B88E3E] mt-0.5 shrink-0" />
                      <span className="text-[#7D7362]">Photographs are optional.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                    Client Overview &amp; Live-in Care Arrangement
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-2">
                      Live-in Care Category (Grace &amp; Goodwill Live-in Only)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          {
                            cat: 'Live-in Ongoing Care' as AvailabilityCategory,
                            desc: 'Long-term placements and ongoing live-in support',
                          },
                          {
                            cat: 'Live-in Respite Care' as AvailabilityCategory,
                            desc: 'Short-term or one-off live-in care arrangements',
                          },
                        ] as const
                      ).map((opt) => {
                        const selected = currentReq.placementType === opt.cat;
                        return (
                          <button
                            key={opt.cat}
                            onClick={() =>
                              updateCareRequest(currentReq.id, (prev) => ({
                                ...prev,
                                placementType: opt.cat,
                              }))
                            }
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selected
                                ? 'bg-[#FDF4E3] border-[#C8A464] shadow-2xs'
                                : 'bg-white border-[#EAE2D2] hover:border-[#C8A464]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0A1629]">{opt.cat}</span>
                              {selected && <CheckCircle2 className="w-4 h-4 text-[#B88E3E]" />}
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-1">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0A1629] mb-1.5">
                      About {currentReq.displayTitle}
                    </label>
                    <textarea
                      rows={3}
                      value={currentReq.aboutClient}
                      onChange={(e) =>
                        updateCareRequest(currentReq.id, (prev) => ({
                          ...prev,
                          aboutClient: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#EAE2D2] bg-[#FAF7F2] p-3 text-xs text-[#334155] leading-relaxed focus:outline-none focus:border-[#C8A464]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0A1629] mb-1.5">
                      Care Goals &amp; Outcomes
                    </label>
                    <textarea
                      rows={2}
                      value={currentReq.careGoals}
                      onChange={(e) =>
                        updateCareRequest(currentReq.id, (prev) => ({
                          ...prev,
                          careGoals: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#EAE2D2] bg-[#FAF7F2] p-3 text-xs text-[#334155] leading-relaxed focus:outline-none focus:border-[#C8A464]"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-[#0A1629]">
                    {portalRoleView === 'client'
                      ? 'Your Contact & Care Request Details'
                      : 'Confidential Client & Family Contact'}
                  </h3>
                  {portalRoleView === 'admin' && (
                    <p className="text-[11px] text-[#71685A]">
                      Protected under Grace &amp; Goodwill confidentiality rules. Surname, address and
                      telephone are only released to assigned carers 7 days prior to start (or
                      immediately for urgent &lt;7d placements once agreements are signed).
                    </p>
                  )}
                  <div className="space-y-2 pt-2 border-t border-[#F3EEE4] text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">
                        {portalRoleView === 'client' ? 'Client Name:' : 'Full Name (Admin):'}
                      </span>
                      <span className="font-semibold text-[#0A1629]">
                        {currentReq.clientFirstName} {currentReq.clientSurname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B]">Agreed G&amp;G Care Fee:</span>
                      <span className="font-semibold text-[#0A1629] tabular-nums">
                        &pound;{currentReq.agreedClientWeeklyFee.toLocaleString()} per week
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Family Contact:</span>
                      <span className="font-semibold text-[#0A1629]">
                        {currentReq.familyContact.name} ({currentReq.familyContact.relation})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Telephone:</span>
                      <span className="font-semibold text-[#0A1629]">{currentReq.telephoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Agreed Grace & Goodwill Client Fee & Client Care Agreement Summary (Zero Carer Payout Shown) */}
                <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#C8A464]" />
                      <h3 className="text-sm font-bold text-[#0A1629]">
                        Agreed Grace &amp; Goodwill Fee
                      </h3>
                    </div>
                    {portalRoleView === 'admin' && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCard(editingCard === 'clientFee' ? null : 'clientFee')
                        }
                        className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{editingCard === 'clientFee' ? 'Done' : 'Edit'}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    {portalRoleView === 'client'
                      ? 'Your agreed weekly live-in care service fee payable directly to Grace & Goodwill.'
                      : 'Client-facing care fee agreed with Grace & Goodwill. Carer remuneration is never displayed on Care Requests, Client Profiles, the Client Portal, or client-facing documents.'}
                  </p>

                  {editingCard === 'clientFee' && portalRoleView === 'admin' ? (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#0A1629]">
                        Agreed Client Weekly Fee (&pound;/wk)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={currentReq.agreedClientWeeklyFee}
                        onChange={(e) =>
                          updateCareRequest(currentReq.id, (prev) => ({
                            ...prev,
                            agreedClientWeeklyFee: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] px-3 py-2 text-xs font-bold text-[#0A1629] tabular-nums focus:outline-none focus:border-[#C8A464]"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#64748B]">Weekly Care Service Fee</div>
                        <div className="text-lg font-bold text-[#0A1629] tabular-nums mt-0.5">
                          &pound;{currentReq.agreedClientWeeklyFee.toLocaleString()}.00
                          <span className="text-xs font-normal text-[#64748B]"> / week</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#8C6D2B]">
                        Payable to Grace &amp; Goodwill
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowClientAgreementPreview(true)}
                    className="w-full py-2 px-3.5 rounded-xl border border-[#DFD0B4] bg-[#FAF5EE] hover:bg-[#F3E9D7] text-xs font-semibold text-[#0A1629] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Preview Client Care Agreement &amp; Fee Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: HEALTH & SUPPORT ── */}
          {activeTab === 'health' && (
            <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                Medical, Medication, Mobility &amp; Personal Care Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Main Medical Conditions</div>
                  <div className="text-[#475569]">{currentReq.conditions.join(', ') || 'None recorded'}</div>
                  <div className="text-[#64748B] pt-1">{currentReq.conditionsNotes}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] space-y-2">
                  <div className="font-bold text-[#0A1629]">Mobility</div>
                  <div className="flex flex-wrap gap-1.5">
                    {allMobilityLevels.map((lvl) => {
                      const isSelected = currentReq.mobilityLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            updateCareRequest(currentReq.id, (prev) => ({
                              ...prev,
                              mobilityLevel: lvl,
                            }))
                          }
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium inline-flex items-center gap-1 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                              : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#B88E3E]" />}
                          <span>{lvl}</span>
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    rows={2}
                    value={currentReq.mobilityDetails}
                    placeholder="Explain mobility requirements, including transfers, repositioning, or specialist moving and handling equipment..."
                    onChange={(e) =>
                      updateCareRequest(currentReq.id, (prev) => ({
                        ...prev,
                        mobilityDetails: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#DFD5C2] bg-white p-2.5 text-xs text-[#334155] focus:outline-none focus:border-[#C8A464]"
                  />
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Medication Support</div>
                  <div className="text-[#475569]">{currentReq.medicationSupport}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] space-y-1.5">
                  <div className="font-bold text-[#0A1629]">Aids &amp; Equipment</div>
                  <div className="text-[#475569]">{currentReq.aids.join(', ')}</div>
                  <div className="text-[#64748B] pt-1">{currentReq.aidsNotes}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] space-y-2 md:col-span-2">
                  <div className="font-bold text-[#0A1629]">Personal Care Requirements</div>
                  <div className="flex flex-wrap gap-1.5">
                    {allPersonalCareOptions.map((item) => {
                      const isSelected = currentReq.personalCare.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePersonalCare(item)}
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium inline-flex items-center gap-1 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FDF4E3] border-[#E4C994] text-[#7C5819]'
                              : 'bg-white border-[#E5E0D5] text-[#475569] hover:border-[#C8A464]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#B88E3E]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[#64748B] pt-1">{currentReq.personalCareNotes}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: LIFESTYLE & PREFERENCES ── */}
          {activeTab === 'lifestyle' && (
            <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                Household, Lifestyle &amp; Carer Safety Disclosures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2]">
                  <div className="flex items-center gap-2 font-bold text-[#0A1629] mb-1">
                    <PawPrint className="w-4 h-4 text-[#C8A464]" />
                    <span>Pets in Home</span>
                  </div>
                  <p className="text-[#475569]">{currentReq.pets}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2]">
                  <div className="flex items-center gap-2 font-bold text-[#0A1629] mb-1">
                    <Cigarette className="w-4 h-4 text-[#C8A464]" />
                    <span>Smoking</span>
                  </div>
                  <p className="text-[#475569]">{currentReq.smoking}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2]">
                  <div className="flex items-center gap-2 font-bold text-[#0A1629] mb-1">
                    <AlertTriangle className="w-4 h-4 text-[#C8A464]" />
                    <span>History of Verbal Abuse</span>
                  </div>
                  <p className="text-[#475569]">{currentReq.verbalAbuseHistory}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2]">
                  <div className="flex items-center gap-2 font-bold text-[#0A1629] mb-1">
                    <Shield className="w-4 h-4 text-[#C8A464]" />
                    <span>History of Racial Abuse</span>
                  </div>
                  <p className="text-[#475569]">{currentReq.racialAbuseHistory}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: NOTES & ACTIVITY (Workflow Stage Control) ── */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl border border-[#EAE2D2] p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                    Care Request Workflow Stage
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Progress this enquiry through matching and accommodation verification to publish
                    to Placements.
                  </p>
                </div>
                <button
                  onClick={() => openConfirmModal(currentReq)}
                  className="px-4 py-2 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm &amp; Finalise Placement
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
                {PIPELINE_STAGES.map((st) => {
                  const isCurrent = currentReq.stage === st.stage;
                  return (
                    <button
                      key={st.stage}
                      onClick={() =>
                        updateCareRequest(currentReq.id, (prev) => ({
                          ...prev,
                          stage: st.stage,
                        }))
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0A1629] text-white border-[#0A1629]'
                          : 'bg-[#FAF7F2] text-[#475569] border-[#EAE2D2] hover:border-[#C8A464]'
                      }`}
                    >
                      <div className="text-xs font-bold">{st.shortLabel}</div>
                      <div
                        className={`text-[10.5px] mt-1 ${
                          isCurrent ? 'text-[#D4AF7A]' : 'text-[#71685A]'
                        }`}
                      >
                        {st.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: CONFIRM ACCOMMODATION & FINALISE PLACEMENT -> PLACEMENTS ROSTER
      ═══════════════════════════════════════════════════════════════════════════ */}
      {confirmModalRequest && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DEC9] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0A1629]">
                  Confirm Accommodation &amp; Finalise Placement
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Client: <strong>{confirmModalRequest.displayTitle}</strong> ({confirmModalRequest.location}) &bull;{' '}
                  {confirmModalRequest.placementType}
                </p>
              </div>
              <button
                onClick={() => setConfirmModalRequest(null)}
                className="p-1 text-[#64748B] hover:text-[#0A1629] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Matched Vetted Live-in Carer */}
            <div>
              <label className="block text-xs font-semibold text-[#0A1629] mb-2">
                Assign Matched Approved Live-in Carer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VETTED_CARERS.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCarerIdx(idx)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                      selectedCarerIdx === idx
                        ? 'bg-[#FDF4E3] border-[#C8A464]'
                        : 'bg-white border-[#EAE2D2] hover:border-[#C8A464]'
                    }`}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0A1629] truncate">{c.name}</div>
                      <div className="text-[10.5px] text-[#64748B] truncate">{c.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin-Only Carer Remuneration for Circulated Placement (Hidden from Client) */}
            <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D2] p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#0A1629] flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#B88E3E]" />
                  <span>Carer Remuneration (Visible to Admin &amp; Carers Only)</span>
                </span>
                <span className="text-[10.5px] font-semibold text-rose-700">
                  Hidden from Client
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1">
                    Weekly Carer Fee (&pound;/wk)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={confirmModalRequest.weeklyPayment}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setConfirmModalRequest((prev) =>
                        prev ? { ...prev, weeklyPayment: val } : prev
                      );
                      updateCareRequest(confirmModalRequest.id, (prev) => ({
                        ...prev,
                        weeklyPayment: val,
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DFD5C2] bg-white font-bold text-[#0A1629] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1">
                    Weekly Food Allowance (&pound;/wk)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={confirmModalRequest.foodAllowance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setConfirmModalRequest((prev) =>
                        prev ? { ...prev, foodAllowance: val } : prev
                      );
                      updateCareRequest(confirmModalRequest.id, (prev) => ({
                        ...prev,
                        foodAllowance: val,
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DFD5C2] bg-white font-bold text-[#0A1629] tabular-nums"
                  />
                </div>
              </div>
              <p className="text-[10.5px] text-[#64748B]">
                Both amounts are shown to carers on Available Placements and Carer Schedules so they can make an informed decision, and never appear in the Client Portal, client profile, care request, or client documents.
              </p>
            </div>

            {/* Inherited Accommodation Summary & Compulsory Verification */}
            <div className="rounded-xl bg-[#FAF6EE] border border-[#E6D7B9] p-3.5 space-y-2 text-xs">
              <div className="font-bold text-[#0A1629] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B88E3E]" />
                <span>Compulsory Carer Accommodation Check</span>
              </div>
              <p className="text-[11.5px] text-[#475569]">
                Bedroom: <strong>{confirmModalRequest.accommodation.bedroomType}</strong> &bull;
                Bathroom: <strong>{confirmModalRequest.accommodation.bathroomType}</strong> &bull;
                Shower: <strong>{confirmModalRequest.accommodation.showerType}</strong>
              </p>
              {confirmModalRequest.accommodation.bedroomType === SHARED_CARER_BEDROOM && (
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(
                      confirmModalRequest.accommodation.bothCarersAgreedSharedBedroom
                    )}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setConfirmModalRequest((prev) =>
                        prev
                          ? {
                              ...prev,
                              accommodation: {
                                ...prev.accommodation,
                                bothCarersAgreedSharedBedroom: checked,
                              },
                            }
                          : prev
                      );
                      updateCareRequest(confirmModalRequest.id, (prev) => ({
                        ...prev,
                        accommodation: {
                          ...prev.accommodation,
                          bothCarersAgreedSharedBedroom: checked,
                        },
                      }));
                    }}
                    className="mt-0.5 w-4 h-4 accent-[#0A1629] cursor-pointer"
                  />
                  <span className="text-[11.5px] font-semibold text-[#0A1629]">
                    Both live-in carers have explicitly agreed to the shared bedroom arrangement
                    before placement confirmation (neither carer is required to share without
                    consent).
                  </span>
                </label>
              )}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminConfirmedAccommodation}
                  onChange={(e) => setAdminConfirmedAccommodation(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0A1629] cursor-pointer"
                />
                <span className="text-[11.5px] font-medium text-[#0A1629]">
                  Administrator confirms the live-in carer will have their own private bedroom for
                  the duration of the placement and access to a fully equipped bathroom (toilet,
                  washbasin, and shower or bathtub).
                </span>
              </label>
            </div>

            {/* Emergency Placement Flag */}
            <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
              <input
                type="checkbox"
                checked={markAsEmergency}
                onChange={(e) => setMarkAsEmergency(e.target.checked)}
                className="w-4 h-4 accent-rose-600 cursor-pointer"
              />
              <span>
                Classify as <strong>Emergency Placement</strong> (places in Emergency Placements tab
                &amp; releases client contact details immediately upon signed agreements)
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F1ECE2]">
              <button
                onClick={() => setConfirmModalRequest(null)}
                className="px-4 py-2 rounded-xl border border-[#E2D9C8] text-xs font-semibold text-[#475569] hover:bg-[#FAF6EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalisePlacement}
                className="px-4 py-2 rounded-xl bg-[#0A1629] hover:bg-[#152542] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF7A]" />
                <span>Confirm &amp; Publish to Placements</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          LIGHTBOX MODAL: ADMIN PHOTOGRAPH PRIVACY INSPECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      {previewPhotoItem && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DEC9] max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-[#EFE8DC] flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                  Admin Photograph Privacy Review &mdash; {previewPhotoItem.category}
                </h3>
                <p className="text-[11.5px] text-[#64748B]">
                  {previewPhotoItem.uploadedBy === 'admin'
                    ? 'Uploaded directly by Admin · Automatically Approved'
                    : 'Uploaded by Client · Check no people, personal photos, visible house/street numbers or documents appear'}
                </p>
              </div>
              <button
                onClick={() => setPreviewPhotoItem(null)}
                className="p-1.5 text-[#64748B] hover:text-[#0A1629] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0A1629] max-h-[60vh] flex items-center justify-center overflow-hidden">
              <img
                src={previewPhotoItem.url}
                alt={previewPhotoItem.category}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#0A1629]">
                Current Status:{' '}
                <span
                  className={
                    previewPhotoItem.status === 'approved'
                      ? 'text-emerald-700'
                      : previewPhotoItem.status === 'pending_approval'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }
                >
                  {previewPhotoItem.status === 'approved'
                    ? 'Approved (Visible to Approved Carers)'
                    : previewPhotoItem.status === 'pending_approval'
                    ? 'Pending Approval (Hidden from Carers)'
                    : 'Rejected (Hidden from Client Profile & Carers)'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdminRejectPhoto(previewPhotoItem.id)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Photograph</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdminApprovePhoto(previewPhotoItem.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve for Profile &amp; Carers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══════════════════════════════════════════════════════════════════════════
          AUTO-GENERATED CLIENT CARE AGREEMENT & SCHEDULE OF FEES PREVIEW
          (Strictly shows ONLY Agreed Grace & Goodwill Client Fee — Zero Carer Pay)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {showClientAgreementPreview && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DEC9] max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-[#D4AF7A] font-semibold">
                  Grace &amp; Goodwill &bull; Auto-Generated Client Document
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  Client Care Service Agreement &amp; Schedule of Fees
                </h3>
              </div>
              <button
                onClick={() => setShowClientAgreementPreview(false)}
                className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#334155]">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D2]">
                <div>
                  <span className="text-[10.5px] text-[#64748B] block">Client Name</span>
                  <strong className="text-[#0A1629]">
                    {currentReq.clientFirstName} {currentReq.clientSurname}
                  </strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#64748B] block">Client Reference</span>
                  <strong className="text-[#0A1629]">{currentReq.clientCode}</strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#64748B] block">Care Arrangement</span>
                  <strong className="text-[#0A1629]">{currentReq.placementType}</strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#64748B] block">Preferred Start</span>
                  <strong className="text-[#0A1629]">{currentReq.preferredStart}</strong>
                </div>
              </div>

              <div className="rounded-xl border border-[#DFD0B4] bg-[#FDF9F1] p-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D2B]">
                  Agreed Schedule of Client Fees (Payable to Grace &amp; Goodwill)
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-[#EDE3CE]">
                  <span className="font-semibold text-[#0A1629]">
                    Weekly Live-in Care Service Fee
                  </span>
                  <span className="text-base font-bold text-[#0A1629] tabular-nums">
                    &pound;{currentReq.agreedClientWeeklyFee.toLocaleString()}.00 / week
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] leading-relaxed pt-1">
                  This schedule sets out the weekly service fee agreed between the Client and Grace &amp; Goodwill for the provision and coordination of live-in care services.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowClientAgreementPreview(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2D9C8] text-xs font-semibold text-[#0A1629] hover:bg-[#FAF6EE] cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
