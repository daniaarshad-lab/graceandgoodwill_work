import React, { useEffect, useState } from 'react';
import {
  Globe,
  Heart,
  Stethoscope,
  GraduationCap,
  Pill,
  ClipboardList,
  ShieldAlert,
  Home,
  UserCheck,
  Apple,
  Accessibility,
  PawPrint,
  Moon,
  Tag,
  ChevronRight,
  Plus,
  Edit2,
  SlidersHorizontal,
  MoreVertical,
  Search,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  Lock,
  Shield,
  ShieldCheck,
  Archive,
  Clock,
  Wallet,
  GitBranch,
  Trash2,
} from 'lucide-react';
import { useOptionalPlatformStore, AdminUserRole } from '../../data/platformStore';
import {
  executeMasterLibraryMutation,
  MasterLibraryMutationPayload,
} from '../../server/masterLibrariesService';

export type LibraryScope = 'client_carer' | 'admin_portal';
export type ApprovalActionType = 'edit' | 'archive' | 'remove';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface HealthConditionsViewProps {
  onBack?: () => void;
  userRole?: string | null;
}

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  scope: LibraryScope;
  totalCount: number;
  iconType: string;
  tags: { text: string; hasRemove?: boolean }[];
  archivedTags?: string[];
  moreCountText?: string;
  hasOtherSpecify?: boolean;
}

interface LibraryApprovalRequest {
  id: string;
  libraryId: string;
  libraryTitle: string;
  actionType: ApprovalActionType;
  targetItem: string;
  proposedItem?: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

const DEFAULT_LIBRARIES: LibraryItem[] = [
  {
    id: 'languages',
    title: 'Languages',
    description: 'Languages spoken by carers and clients.',
    scope: 'client_carer',
    totalCount: 42,
    iconType: 'globe',
    tags: [
      { text: 'English' },
      { text: 'Polish' },
      { text: 'Urdu' },
      { text: 'Gujarati' },
    ],
    archivedTags: [],
    moreCountText: '+39 more',
    hasOtherSpecify: true,
  },
  {
    id: 'interests-hobbies',
    title: 'Interests & Hobbies',
    description: 'Activities, interests and lifestyle preferences.',
    scope: 'client_carer',
    totalCount: 128,
    iconType: 'heart',
    tags: [
      { text: 'Reading' },
      { text: 'Gardening' },
      { text: 'Walking' },
      { text: 'Bowls', hasRemove: true },
      { text: 'Music' },
    ],
    archivedTags: [],
    moreCountText: '+124 more',
    hasOtherSpecify: true,
  },
  {
    id: 'conditions',
    title: 'Conditions',
    description: 'Medical conditions and health needs.',
    scope: 'client_carer',
    totalCount: 96,
    iconType: 'stethoscope',
    tags: [
      { text: 'Diabetes' },
      { text: 'Dementia' },
      { text: 'PSP', hasRemove: true },
      { text: "Parkinson's" },
      { text: 'Arthritis' },
    ],
    archivedTags: [],
    moreCountText: '+92 more',
    hasOtherSpecify: true,
  },
  {
    id: 'skills-training',
    title: 'Skills & Training',
    description: 'Skills, qualifications and training.',
    scope: 'client_carer',
    totalCount: 87,
    iconType: 'graduation',
    tags: [
      { text: 'Manual handling' },
      { text: 'First aid' },
      { text: 'Medication' },
      { text: 'Dementia care' },
      { text: 'Moving & handling' },
    ],
    archivedTags: [],
    moreCountText: '+83 more',
    hasOtherSpecify: false,
  },
  {
    id: 'medication',
    title: 'Medication',
    description: 'Medications, dosages and administration.',
    scope: 'client_carer',
    totalCount: 152,
    iconType: 'pill',
    tags: [
      { text: 'Paracetamol' },
      { text: 'Warfarin' },
      { text: 'Insulin' },
      { text: 'Amlodipine' },
      { text: 'Morphine' },
    ],
    archivedTags: [],
    moreCountText: '+148 more',
    hasOtherSpecify: false,
  },
  {
    id: 'clinical-info',
    title: 'Clinical Information',
    description: 'Clinical notes and relevant health information.',
    scope: 'client_carer',
    totalCount: 73,
    iconType: 'clipboard',
    tags: [
      { text: 'BP monitoring' },
      { text: 'Catheter care' },
      { text: 'Epilepsy' },
      { text: 'PEG feeding' },
      { text: 'Stoma care' },
    ],
    archivedTags: [],
    moreCountText: '+69 more',
    hasOtherSpecify: false,
  },
  {
    id: 'allergies',
    title: 'Allergies',
    description: 'Known allergies and adverse reactions.',
    scope: 'client_carer',
    totalCount: 58,
    iconType: 'shield',
    tags: [
      { text: 'Penicillin' },
      { text: 'Nuts' },
      { text: 'Latex' },
      { text: 'Pollen' },
      { text: 'Shellfish' },
    ],
    archivedTags: [],
    moreCountText: '+54 more',
    hasOtherSpecify: true,
  },
  {
    id: 'household-duties',
    title: 'Household Duties',
    description: 'Domestic tasks and household support.',
    scope: 'client_carer',
    totalCount: 106,
    iconType: 'home',
    tags: [
      { text: 'Cleaning' },
      { text: 'Laundry' },
      { text: 'Shopping' },
      { text: 'Meal preparation' },
      { text: 'Ironing' },
    ],
    archivedTags: [],
    moreCountText: '+102 more',
    hasOtherSpecify: false,
  },
  {
    id: 'personal-care',
    title: 'Personal Care',
    description: 'Personal care needs and support tasks.',
    scope: 'client_carer',
    totalCount: 94,
    iconType: 'user-check',
    tags: [
      { text: 'Washing' },
      { text: 'Dressing' },
      { text: 'Toileting' },
      { text: 'Showering' },
      { text: 'Continence care' },
    ],
    archivedTags: [],
    moreCountText: '+69 more',
    hasOtherSpecify: true,
  },
  {
    id: 'diet',
    title: 'Diet',
    description: 'Dietary requirements and meal preferences.',
    scope: 'client_carer',
    totalCount: 64,
    iconType: 'apple',
    tags: [
      { text: 'Vegetarian' },
      { text: 'Vegan' },
      { text: 'Halal' },
      { text: 'Kosher' },
      { text: 'Gluten free' },
    ],
    archivedTags: [],
    moreCountText: '+60 more',
    hasOtherSpecify: false,
  },
  {
    id: 'mobility',
    title: 'Mobility',
    description: 'Mobility levels and movement support.',
    scope: 'client_carer',
    totalCount: 81,
    iconType: 'accessibility',
    tags: [
      { text: 'Independent' },
      { text: 'Walking frame' },
      { text: 'Wheelchair' },
      { text: 'Hoist' },
      { text: 'Assistance x1' },
    ],
    archivedTags: [],
    moreCountText: '+77 more',
    hasOtherSpecify: false,
  },
  {
    id: 'aids-equipment',
    title: 'Aids & Equipment',
    description: 'Equipment used at home or in the community.',
    scope: 'client_carer',
    totalCount: 69,
    iconType: 'frame',
    tags: [
      { text: 'Walking stick' },
      { text: 'Wheelchair' },
      { text: 'Hoist' },
      { text: 'Profiling bed' },
      { text: 'Commode' },
    ],
    archivedTags: [],
    moreCountText: '+65 more',
    hasOtherSpecify: false,
  },
  {
    id: 'pets',
    title: 'Pets',
    description: 'Pets in the home and care considerations.',
    scope: 'client_carer',
    totalCount: 46,
    iconType: 'paw',
    tags: [
      { text: 'Dog' },
      { text: 'Cat' },
      { text: 'Bird' },
      { text: 'Rabbit' },
      { text: 'No pets' },
    ],
    archivedTags: [],
    moreCountText: '+42 more',
    hasOtherSpecify: false,
  },
  {
    id: 'night-time-support',
    title: 'Night-time Support',
    description: 'Night care needs and overnight support.',
    scope: 'client_carer',
    totalCount: 51,
    iconType: 'moon',
    tags: [
      { text: 'Waking at night' },
      { text: 'Toileting' },
      { text: 'Repositioning' },
      { text: 'Medication' },
      { text: 'Sleep monitoring' },
    ],
    archivedTags: [],
    moreCountText: '+47 more',
    hasOtherSpecify: false,
  },
  // Admin Portal Exclusive Master Libraries (Super Admin Only)
  {
    id: 'admin-payments-fees',
    title: 'Payments & Fee Settings',
    description: 'Client fee structures, payment arrangements and payment statuses.',
    scope: 'admin_portal',
    totalCount: 9,
    iconType: 'wallet',
    tags: [
      { text: 'Pending' },
      { text: 'Confirmed' },
      { text: 'Paid' },
      { text: 'Weekly Direct Debit' },
      { text: 'Private Self-Funding' },
    ],
    archivedTags: [],
    moreCountText: '+4 more',
    hasOtherSpecify: false,
  },
  {
    id: 'admin-placement-workflows',
    title: 'Placement Workflow Stages',
    description: 'Care request and placement workflow stages across the Admin Portal.',
    scope: 'admin_portal',
    totalCount: 6,
    iconType: 'workflow',
    tags: [
      { text: 'New Enquiries' },
      { text: 'Reviewing Requirements' },
      { text: 'Matching Carers' },
      { text: 'Confirming Payment' },
      { text: 'Confirming Accommodation' },
      { text: 'Finalised Placements' },
    ],
    archivedTags: [],
    hasOtherSpecify: false,
  },
  {
    id: 'admin-operational-statuses',
    title: 'Operational Statuses & Controls',
    description: 'Administrative placement statuses, emergency classifications and agreement rules.',
    scope: 'admin_portal',
    totalCount: 8,
    iconType: 'lock-shield',
    tags: [
      { text: 'Active' },
      { text: 'Emergency' },
      { text: 'In Progress' },
      { text: 'Upcoming' },
      { text: 'Confirmed' },
      { text: 'On Hold' },
    ],
    archivedTags: [],
    moreCountText: '+2 more',
    hasOtherSpecify: false,
  },
];

// Custom walking frame / aids & equipment icon matching reference screenshot
const WalkingFrameIcon = ({ className = 'w-5 h-5 text-[#0A1629]' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 20V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
    <path d="M4 11h16" />
    <path d="M5 16h14" />
    <circle cx="5" cy="20" r="1.5" />
    <circle cx="19" cy="20" r="1.5" />
  </svg>
);

// Custom network node fork icon matching reference screenshot
const NetworkNodeIcon = ({ className = 'w-6 h-6 text-[#C5A059]' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// Custom database cylinder stack icon matching reference screenshot
const DatabaseStackIcon = ({ className = 'w-6 h-6 text-[#C5A059]' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
  </svg>
);

function normalizeRoleInput(raw?: string | null): AdminUserRole | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === 'super_admin' || cleaned === 'superadmin' || cleaned === 'super-admin') {
    return 'super_admin';
  }
  if (cleaned === 'admin') {
    return 'admin';
  }
  return null;
}

function getStoredAuthHeaders(activeRole: AdminUserRole): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-role': activeRole,
    'x-admin-actor':
      activeRole === 'super_admin' ? 'Jessica Smith (Super Admin)' : 'Jessica Smith (Admin)',
  };

  if (typeof window !== 'undefined') {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Ignore storage access errors
    }
  }
  return headers;
}

export const HealthConditionsView: React.FC<HealthConditionsViewProps> = ({ userRole }) => {
  const store = useOptionalPlatformStore();
  const [localRole, setLocalRole] = useState<AdminUserRole>(() => {
    const fromProp = normalizeRoleInput(userRole);
    if (fromProp) return fromProp;
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const fromStorage = normalizeRoleInput(parsed?.role);
          if (fromStorage) return fromStorage;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return 'admin';
  });

  // Sync incoming authenticated userRole if provided by parent portal
  useEffect(() => {
    const normalized = normalizeRoleInput(userRole);
    if (normalized) {
      setLocalRole(normalized);
      store?.setAdminRole(normalized);
    }
  }, [userRole]);

  const lockedByExternalUserRole = Boolean(normalizeRoleInput(userRole));
  const effectiveRole: AdminUserRole = lockedByExternalUserRole
    ? normalizeRoleInput(userRole)!
    : store?.adminRole ?? localRole;
  const isSuperAdmin = effectiveRole === 'super_admin';

  const setActiveRole = (nextRole: AdminUserRole) => {
    if (lockedByExternalUserRole) return;
    setLocalRole(nextRole);
    store?.setAdminRole(nextRole);
  };

  const [libraries, setLibraries] = useState<LibraryItem[]>(DEFAULT_LIBRARIES);
  const [approvalRequests, setApprovalRequests] = useState<LibraryApprovalRequest[]>([
    {
      id: 'req-init-1',
      libraryId: 'interests-hobbies',
      libraryTitle: 'Interests & Hobbies',
      actionType: 'archive',
      targetItem: 'Bowls',
      reason: 'Requested consolidation under Outdoor Bowls / Lawn Bowls.',
      requestedBy: 'Jessica Smith (Admin)',
      requestedAt: '25 Oct 2026, 09:40',
      status: 'pending',
    },
  ]);

  // Search & Filter state
  const [filterQuery, setFilterQuery] = useState('');

  // Interactive Modals State
  const [activeModal, setActiveModal] = useState<
    'none' | 'add' | 'edit' | 'reorder' | 'requestChange' | 'approvals'
  >('none');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [allowFreeText, setAllowFreeText] = useState(false);

  // Super Admin inline item rename state
  const [editingTagOldText, setEditingTagOldText] = useState<string | null>(null);
  const [editingTagNewText, setEditingTagNewText] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');

  // Regular Admin request-approval form state
  const [requestActionType, setRequestActionType] = useState<ApprovalActionType>('edit');
  const [requestTargetItem, setRequestTargetItem] = useState('');
  const [requestProposedItem, setRequestProposedItem] = useState('');
  const [requestReason, setRequestReason] = useState('');

  // Toast feedback state
  const [toastState, setToastState] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);

  // Active dropdown menu for 3 dots
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const selectedLibrary =
    libraries.find((l) => l.id === selectedLibraryId) || null;

  const showToast = (message: string, isError = false) => {
    setToastState({ message, isError });
    setTimeout(() => {
      setToastState(null);
    }, 3600);
  };

  // Hydrate Master Libraries and pending approval requests from backend RBAC API
  useEffect(() => {
    let cancelled = false;
    async function loadFromBackend() {
      try {
        const res = await fetch('/master-libraries-api', {
          method: 'GET',
          headers: getStoredAuthHeaders(effectiveRole),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.libraries)) {
          setLibraries(data.libraries);
          if (Array.isArray(data?.approvalRequests)) {
            setApprovalRequests(data.approvalRequests);
          }
        }
      } catch {
        // Fallback cleanly to initial state if offline
      }
    }
    loadFromBackend();
    return () => {
      cancelled = true;
    };
  }, [effectiveRole]);

  // Execute server-validated mutation against /master-libraries-api (with RBAC fallback on static CDN hosts)
  const dispatchServerMutation = async (payload: Record<string, unknown>): Promise<boolean> => {
    const actorName =
      effectiveRole === 'super_admin' ? 'Jessica Smith (Super Admin)' : 'Jessica Smith (Admin)';

    const runLocalRbacFallback = () => {
      const localResult = executeMasterLibraryMutation(
        effectiveRole,
        actorName,
        payload as unknown as MasterLibraryMutationPayload
      );
      if (localResult.status >= 400) {
        showToast(
          localResult.error || 'Permission denied: This action requires Super Admin authorisation.',
          true
        );
        return false;
      }
      setLibraries(localResult.libraries);
      setApprovalRequests(localResult.approvalRequests);
      if (localResult.message) {
        showToast(localResult.message, false);
      }
      return true;
    };

    try {
      const res = await fetch('/master-libraries-api', {
        method: 'POST',
        headers: getStoredAuthHeaders(effectiveRole),
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => null)
        : null;

      // Static hosts (e.g. Netlify SPA) return 404/405 without JSON API handler
      if ((res.status === 404 || res.status === 405) && !data?.error) {
        return runLocalRbacFallback();
      }

      if (!res.ok) {
        showToast(
          data?.error || 'Permission denied: This action requires Super Admin authorisation.',
          true
        );
        return false;
      }

      if (Array.isArray(data?.libraries)) {
        setLibraries(data.libraries);
      }
      if (Array.isArray(data?.approvalRequests)) {
        setApprovalRequests(data.approvalRequests);
      }
      if (data?.message) {
        showToast(data.message, false);
      }
      return true;
    } catch {
      return runLocalRbacFallback();
    }
  };

  // Permission helper functions (mirrored on backend)
  const canAddItemsToLibrary = (lib: LibraryItem): boolean => {
    if (lib.scope === 'admin_portal') {
      return isSuperAdmin;
    }
    return true; // Both Regular Admin and Super Admin can add items to Client & Carer libraries
  };

  const canDirectlyModifyLibrary = (_lib: LibraryItem): boolean => {
    return isSuperAdmin;
  };

  // Render library icon
  const renderIcon = (type: string) => {
    const iconClass = 'w-5 h-5 text-[#0A1629] shrink-0';
    switch (type) {
      case 'globe':
        return <Globe className={iconClass} />;
      case 'heart':
        return <Heart className={iconClass} />;
      case 'stethoscope':
        return <Stethoscope className={iconClass} />;
      case 'graduation':
        return <GraduationCap className={iconClass} />;
      case 'pill':
        return <Pill className={iconClass} />;
      case 'clipboard':
        return <ClipboardList className={iconClass} />;
      case 'shield':
        return <ShieldAlert className={iconClass} />;
      case 'home':
        return <Home className={iconClass} />;
      case 'user-check':
        return <UserCheck className={iconClass} />;
      case 'apple':
        return <Apple className={iconClass} />;
      case 'accessibility':
        return <Accessibility className={iconClass} />;
      case 'frame':
        return <WalkingFrameIcon className={iconClass} />;
      case 'paw':
        return <PawPrint className={iconClass} />;
      case 'moon':
        return <Moon className={iconClass} />;
      case 'wallet':
        return <Wallet className={iconClass} />;
      case 'workflow':
        return <GitBranch className={iconClass} />;
      case 'lock-shield':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Tag className={iconClass} />;
    }
  };

  // Remove single tag handler (Super Admin direct; Regular Admin opens approval request)
  const handleRemoveTag = async (lib: LibraryItem, tagText: string) => {
    if (lib.scope === 'admin_portal' && !isSuperAdmin) {
      showToast(
        'Admin Portal Master Libraries can only be modified by Super Admin.',
        true
      );
      return;
    }
    if (!isSuperAdmin) {
      handleOpenRequestModal(lib, tagText, 'remove');
      return;
    }
    await dispatchServerMutation({
      action: 'remove_item',
      libraryId: lib.id,
      itemText: tagText,
    });
  };

  // Open Add Item modal
  const handleOpenAddModal = (lib: LibraryItem) => {
    if (!canAddItemsToLibrary(lib)) {
      showToast(
        'Admin Portal Master Libraries are managed exclusively by Super Admin.',
        true
      );
      return;
    }
    setSelectedLibraryId(lib.id);
    setNewItemName('');
    setAllowFreeText(lib.hasOtherSpecify || false);
    setActiveModal('add');
    setOpenDropdownId(null);
  };

  // Submit Add Item
  const handleSaveNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibrary || !newItemName.trim()) return;

    const ok = await dispatchServerMutation({
      action: 'add_item',
      libraryId: selectedLibrary.id,
      itemText: newItemName.trim(),
      ...(isSuperAdmin ? { hasOtherSpecify: allowFreeText } : {}),
    });

    if (ok) {
      setActiveModal('none');
      setNewItemName('');
    }
  };

  // Open Manage / View Modal
  const handleOpenEditModal = (lib: LibraryItem) => {
    if (lib.scope === 'admin_portal' && !isSuperAdmin) {
      showToast(
        'Admin Portal settings and categories are restricted to Super Admin.',
        true
      );
      return;
    }
    setSelectedLibraryId(lib.id);
    setDescriptionDraft(lib.description);
    setEditingTagOldText(null);
    setEditingTagNewText('');
    setActiveModal('edit');
    setOpenDropdownId(null);
  };

  // Open Regular Admin Request Approval Modal
  const handleOpenRequestModal = (
    lib: LibraryItem,
    defaultItem?: string,
    defaultAction: ApprovalActionType = 'edit'
  ) => {
    if (lib.scope === 'admin_portal') {
      showToast(
        'Admin Portal Master Libraries cannot be modified by regular Admin users.',
        true
      );
      return;
    }
    setSelectedLibraryId(lib.id);
    const initialTarget = defaultItem || lib.tags[0]?.text || '';
    setRequestTargetItem(initialTarget);
    setRequestActionType(defaultAction);
    setRequestProposedItem(defaultAction === 'edit' ? initialTarget : '');
    setRequestReason('');
    setActiveModal('requestChange');
    setOpenDropdownId(null);
  };

  // Submit Regular Admin Request for Super Admin Approval
  const handleSubmitApprovalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibrary || !requestTargetItem.trim()) return;

    const ok = await dispatchServerMutation({
      action: 'submit_approval_request',
      libraryId: selectedLibrary.id,
      actionType: requestActionType,
      targetItem: requestTargetItem.trim(),
      proposedItem: requestActionType === 'edit' ? requestProposedItem.trim() : undefined,
      reason: requestReason.trim(),
    });

    if (ok) {
      setActiveModal('none');
    }
  };

  // Open Reorder Modal (Super Admin only)
  const handleOpenReorder = (lib: LibraryItem) => {
    if (!canDirectlyModifyLibrary(lib)) {
      showToast('Reordering existing library options requires Super Admin access.', true);
      return;
    }
    setSelectedLibraryId(lib.id);
    setActiveModal('reorder');
    setOpenDropdownId(null);
  };

  // Alphabetize tags for library (Super Admin only)
  const handleSortAlphabetical = async (libraryId: string) => {
    const ok = await dispatchServerMutation({
      action: 'reorder_items',
      libraryId,
      mode: 'alphabetical',
    });
    if (ok) {
      setActiveModal('none');
    }
  };

  // Filtered libraries based on search
  const filteredLibraries = libraries.filter((lib) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const titleMatch = lib.title.toLowerCase().includes(q);
    const descMatch = lib.description.toLowerCase().includes(q);
    const tagMatch = lib.tags.some((t) => t.text.toLowerCase().includes(q));
    return titleMatch || descMatch || tagMatch;
  });

  const clientCarerLibraries = filteredLibraries.filter((l) => l.scope === 'client_carer');
  const adminPortalLibraries = filteredLibraries.filter((l) => l.scope === 'admin_portal');

  // Retain exact wording & layout metrics
  const totalLibraries = libraries.length;
  const totalItemsCount = libraries.reduce((acc, curr) => acc + curr.totalCount, 0);
  const pendingApprovals = approvalRequests.filter((r) => r.status === 'pending');

  // Divide Client & Carer libraries into Rows 1-3 (3 cards each) and Row 4 (5 cards)
  const mainLibraries = clientCarerLibraries.slice(0, 9);
  const bottomLibraries = clientCarerLibraries.slice(9);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative select-none bg-[#FAF7F2] min-h-screen">
      {/* Toast Notification */}
      {toastState && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border ${
            toastState.isError
              ? 'bg-rose-950 text-white border-rose-500/40'
              : 'bg-[#0A1629] text-white border-[#C5A059]/30'
          }`}
        >
          {toastState.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          )}
          <span>{toastState.message}</span>
        </div>
      )}

      {/* ── Top Header Section (Heading + Updated Introductory Description + Gold Knot Emblem) ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 min-h-[116px] overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#0A1629] tracking-tight leading-tight">
            Master Libraries
          </h1>
          <p className="text-xs sm:text-[13.5px] text-[#64748B] max-w-2xl mt-2 leading-relaxed font-sans">
            Manage the options and categories used across the Client, Carer and Admin Portals. Add and manage items to keep information consistent throughout the platform.
          </p>
        </div>

        {/* Right Header Grace & Goodwill Gold Knot Logo */}
        <div className="pointer-events-none select-none md:absolute md:right-8 lg:right-20 md:top-[-18px] w-[220px] sm:w-[260px] lg:w-[290px] h-[145px] sm:h-[165px] overflow-hidden flex items-start justify-end opacity-[0.42] self-end md:self-auto">
          <img
            src="/assets/website_logo_dark_clean.png"
            alt="Grace & Goodwill Emblem"
            className="w-[220px] sm:w-[260px] lg:w-[285px] h-[220px] sm:h-[260px] lg:h-[285px] max-w-none object-contain filter brightness-110 contrast-105"
          />
        </div>
      </div>

      {/* ── Top Summary / Banner Cards (Row of 3 cards) ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Information Box */}
        <div className="md:col-span-12 lg:col-span-7 bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-4.5 flex items-start gap-4 shadow-sm">
          <div className="p-2 rounded-lg bg-[#FAF5EE] shrink-0 mt-0.5">
            <NetworkNodeIcon className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="font-semibold text-xs sm:text-[14.5px] text-[#0A1629]">
              One library. A more connected platform.
            </h3>
            <p className="text-[11.5px] sm:text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Changes made here are reflected across relevant areas of the platform, including client profiles, carer profiles, care requests and placements.
            </p>
          </div>
        </div>

        {/* Middle Stat Card (Master Libraries) */}
        <div className="md:col-span-6 lg:col-span-2.5 bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-4.5 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 rounded-lg bg-[#FAF5EE] shrink-0">
            <DatabaseStackIcon className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <div className="text-2xl sm:text-[28px] font-bold font-sans text-[#0A1629] leading-none">
              {totalLibraries}
            </div>
            <div className="text-[11.5px] sm:text-xs text-[#64748B] font-medium mt-1">
              Master Libraries
            </div>
          </div>
        </div>

        {/* Right Stat Card (Total Items) */}
        <div className="md:col-span-6 lg:col-span-2.5 bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-4.5 flex items-center justify-between gap-3 shadow-sm hover:border-[#D4AF7A] transition-colors group cursor-pointer">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF5EE] shrink-0">
              <Tag className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="text-2xl sm:text-[28px] font-bold font-sans text-[#0A1629] leading-none">
                {totalItemsCount > 0 ? totalItemsCount.toLocaleString() : '1,842'}
              </div>
              <div className="text-[11.5px] sm:text-xs text-[#64748B] font-medium mt-1">
                Total Items
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#0A1629] group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>

      {/* ── Access Level & Approval Queue Bar ── */}
      <div className="relative z-10 bg-white rounded-xl border border-[#E8DFD5] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#FAF5EE] text-[#C5A059] shrink-0">
            {isSuperAdmin ? (
              <ShieldCheck className="w-4 h-4 text-[#0A1629]" />
            ) : (
              <Shield className="w-4 h-4 text-[#C5A059]" />
            )}
          </div>
          <div className="text-xs text-[#475569]">
            <span className="font-semibold text-[#0A1629]">
              {isSuperAdmin ? 'Super Admin Access:' : 'Regular Admin Access:'}
            </span>{' '}
            {isSuperAdmin
              ? 'Full access to add, edit, remove, archive and restore items, approve Admin requests, and manage Admin Portal libraries.'
              : 'You can add new items to Client and Carer categories. Edits, archiving or removals require Super Admin approval, and Admin Portal libraries are Super Admin only.'}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Approval Queue Button */}
          <button
            type="button"
            onClick={() => setActiveModal('approvals')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DFD5] bg-[#FAF7F2] hover:bg-[#FAF5EE] text-xs font-medium text-[#0A1629] transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isSuperAdmin ? 'Review Requests' : 'Requested Changes'}</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059] text-white text-[10px] font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          {/* Role Toggle (unless locked by external auth session prop) */}
          {!lockedByExternalUserRole && (
            <div className="inline-flex items-center rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E8DFD5]">
              <button
                type="button"
                onClick={() => setActiveRole('admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  !isSuperAdmin
                    ? 'bg-[#0A1629] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0A1629]'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('super_admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  isSuperAdmin
                    ? 'bg-[#0A1629] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0A1629]'
                }`}
              >
                Super Admin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Optional In-Page Quick Filter ── */}
      {filterQuery && (
        <div className="relative z-10 flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-[#E8DFD5] text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>
              Filtering libraries for: <strong className="text-[#0A1629]">&ldquo;{filterQuery}&rdquo;</strong>
            </span>
          </div>
          <button
            onClick={() => setFilterQuery('')}
            className="text-xs text-[#C5A059] hover:underline font-semibold"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* ── Main Client & Carer Library Cards (Rows 1 to 3: 3 Columns) ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mainLibraries.map((lib) => (
          <div
            key={lib.id}
            className="bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:shadow-sm transition-shadow duration-200 relative"
          >
            {/* Top row: Icon + Title + Count Pill */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    {renderIcon(lib.iconType)}
                  </div>
                  <h3 className="font-semibold text-[15px] sm:text-[16px] text-[#0A1629] tracking-tight">
                    {lib.title}
                  </h3>
                </div>
                <span className="rounded-full bg-[#FAF5EE] text-[#78644A] px-2.5 py-0.5 text-xs font-semibold border border-[#E8DECE] shrink-0 font-sans">
                  {lib.totalCount}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#71717A] mt-1 mb-3.5 leading-relaxed">
                {lib.description}
              </p>

              {/* Chips Area */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[58px] mb-4">
                {lib.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-normal text-[#1E293B] bg-[#EDF2F7] border border-[#E2E8F0] shadow-sm"
                  >
                    <span>{tag.text}</span>
                    {isSuperAdmin && tag.hasRemove && (
                      <button
                        onClick={() => handleRemoveTag(lib, tag.text)}
                        className="text-[#64748B] hover:text-rose-600 font-bold ml-0.5 text-xs focus:outline-none cursor-pointer"
                        title="Remove tag"
                      >
                        &times;
                      </button>
                    )}
                  </span>
                ))}

                {/* +X more tag */}
                {lib.moreCountText && (
                  <button
                    onClick={() => handleOpenEditModal(lib)}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#64748B] hover:text-[#0A1629] hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="View all items"
                  >
                    {lib.moreCountText}
                  </button>
                )}

                {/* + Other - please specify tag */}
                {lib.hasOtherSpecify && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs italic text-[#64748B] bg-[#FAF7F2] border border-dashed border-[#D5C9B7]">
                    + Other &ndash; please specify
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-3 border-t border-[#F1EFEB] flex items-center justify-between gap-2 mt-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal(lib)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0A1629] text-white hover:bg-[#1E293B] text-xs font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>

                {isSuperAdmin ? (
                  <>
                    <button
                      onClick={() => handleOpenEditModal(lib)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleOpenReorder(lib)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Reorder</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenRequestModal(lib)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                    title="Submit an edit, archive or removal request for Super Admin approval"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Request Change</span>
                  </button>
                )}
              </div>

              {/* 3-dots Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdownId(openDropdownId === lib.id ? null : lib.id)
                  }
                  className="p-1.5 rounded-md text-[#64748B] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openDropdownId === lib.id && (
                  <div className="absolute right-0 bottom-8 w-48 bg-white rounded-xl shadow-lg border border-[#E8DFD5] py-1.5 z-20 text-xs">
                    <button
                      onClick={() => handleOpenAddModal(lib)}
                      className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Add New Item</span>
                    </button>
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleSortAlphabetical(lib.id)}
                        className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Sort A to Z</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRequestModal(lib)}
                        className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Request Change / Removal</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        showToast(`Exported ${lib.title} to CSV`);
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Client & Carer Library Cards (Row 4: 5 Columns on Desktop) ── */}
      {bottomLibraries.length > 0 && (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bottomLibraries.map((lib) => (
            <div
              key={lib.id}
              className="bg-white rounded-xl border border-[#E8DFD5] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between hover:shadow-sm transition-shadow duration-200 relative"
            >
              <div>
                {/* Top row: Icon + Title + Count Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {renderIcon(lib.iconType)}
                    </div>
                    <h3 className="font-semibold text-[14px] text-[#0A1629] tracking-tight">
                      {lib.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#FAF5EE] text-[#78644A] px-2 py-0.5 text-[11px] font-semibold border border-[#E8DECE] shrink-0 font-sans">
                    {lib.totalCount}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#71717A] mt-1 mb-3 leading-snug line-clamp-2">
                  {lib.description}
                </p>

                {/* Chips Area */}
                <div className="flex flex-wrap items-center gap-1 min-h-[54px] mb-3">
                  {lib.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-normal text-[#1E293B] bg-[#EDF2F7] border border-[#E2E8F0]"
                    >
                      <span>{tag.text}</span>
                    </span>
                  ))}

                  {lib.moreCountText && (
                    <button
                      onClick={() => handleOpenEditModal(lib)}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium text-[#64748B] hover:text-[#0A1629] hover:bg-slate-200/70 transition-colors cursor-pointer"
                    >
                      {lib.moreCountText}
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar (compact for 5 cols) */}
              <div className="pt-2.5 border-t border-[#F1EFEB] flex items-center justify-between gap-1 mt-auto">
                <button
                  onClick={() => handleOpenAddModal(lib)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0A1629] text-white hover:bg-[#1E293B] text-[11px] font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>

                <div className="flex items-center gap-1">
                  {isSuperAdmin ? (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(lib)}
                        className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[11px] font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-[#64748B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleOpenReorder(lib)}
                        className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[11px] font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-[#64748B]" />
                        <span>Reorder</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenRequestModal(lib)}
                      className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                      title="Request Super Admin approval to edit, archive or remove items"
                    >
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      <span>Request</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Admin Portal Master Libraries (Super Admin Exclusive Control) ── */}
      {adminPortalLibraries.length > 0 && (
        <div className="relative z-10 pt-2 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E8DFD5] pt-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#0A1629]">
                  Admin Portal Master Libraries
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF5EE] text-[#78644A] border border-[#E8DECE]">
                  <Lock className="w-3 h-3 text-[#C5A059]" />
                  Super Admin Only
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Settings relating to payments, fees, placement workflows and operational statuses are managed exclusively by Super Admin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminPortalLibraries.map((lib) => (
              <div
                key={lib.id}
                className="bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-shadow duration-200 relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        {renderIcon(lib.iconType)}
                      </div>
                      <h3 className="font-semibold text-[15px] sm:text-[16px] text-[#0A1629] tracking-tight">
                        {lib.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#FAF5EE] text-[#78644A] px-2.5 py-0.5 text-xs font-semibold border border-[#E8DECE] shrink-0 font-sans">
                      {lib.totalCount}
                    </span>
                  </div>

                  <p className="text-xs text-[#71717A] mt-1 mb-3.5 leading-relaxed">
                    {lib.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 min-h-[58px] mb-4">
                    {lib.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-normal text-[#1E293B] bg-[#EDF2F7] border border-[#E2E8F0] shadow-sm"
                      >
                        <span>{tag.text}</span>
                      </span>
                    ))}

                    {lib.moreCountText && isSuperAdmin && (
                      <button
                        onClick={() => handleOpenEditModal(lib)}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#64748B] hover:text-[#0A1629] hover:bg-slate-200/70 transition-colors cursor-pointer"
                      >
                        {lib.moreCountText}
                      </button>
                    )}

                    {lib.moreCountText && !isSuperAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#94A3B8]">
                        {lib.moreCountText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar: Full controls for Super Admin; Read-only locked indicator for Regular Admin */}
                <div className="pt-3 border-t border-[#F1EFEB] flex items-center justify-between gap-2 mt-auto">
                  {isSuperAdmin ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddModal(lib)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0A1629] text-white hover:bg-[#1E293B] text-xs font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(lib)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleOpenReorder(lib)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-[#475569] hover:text-[#0A1629] hover:bg-[#F1EFEB] transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#78644A] bg-[#FAF5EE] border border-[#E8DECE] px-3 py-1.5 rounded-md w-full justify-center font-medium">
                      <Lock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Restricted &mdash; Super Admin control only</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal: Add Item ── */}
      {activeModal === 'add' && selectedLibrary && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFD5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1EFEB] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] flex items-center justify-center">
                  {renderIcon(selectedLibrary.iconType)}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#0A1629]">
                    Add to {selectedLibrary.title}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    New items are reflected across relevant areas of the platform.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#0A1629] mb-1.5">
                  Item Name / Label
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`e.g. ${selectedLibrary.tags[0]?.text || 'New item'}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              {isSuperAdmin && (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="allowOther"
                    checked={allowFreeText}
                    onChange={(e) => setAllowFreeText(e.target.checked)}
                    className="rounded border-[#DFD5C2] text-[#0A1629] focus:ring-[#C5A059] mt-0.5"
                  />
                  <label htmlFor="allowOther" className="text-xs text-[#64748B] leading-tight">
                    Include <em>&ldquo;+ Other &ndash; please specify&rdquo;</em> free-text fallback for this library
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1EFEB]">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newItemName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#1E293B] disabled:opacity-50 text-xs font-medium transition-colors shadow-sm"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Manage / View Library (Super Admin full edit/archive/restore/remove; Regular Admin read + request change) ── */}
      {activeModal === 'edit' && selectedLibrary && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DFD5] space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F1EFEB] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] flex items-center justify-center">
                  {renderIcon(selectedLibrary.iconType)}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#0A1629]">
                    {isSuperAdmin ? `Manage ${selectedLibrary.title}` : selectedLibrary.title}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedLibrary.totalCount} registered items in library
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isSuperAdmin && (
              <div className="bg-[#FAF5EE] border border-[#E8DECE] rounded-xl px-3.5 py-2.5 text-xs text-[#78644A] flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  Regular Admin users can add new items, or click an existing item below to request an edit, archive or removal for Super Admin approval.
                </span>
              </div>
            )}

            <div className="overflow-y-auto space-y-3 pr-1 py-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0A1629]">
                  Active Options ({selectedLibrary.tags.length})
                </span>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleSortAlphabetical(selectedLibrary.id)}
                    className="text-xs text-[#C5A059] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Sort A &rarr; Z
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] max-h-56 overflow-y-auto">
                {selectedLibrary.tags.map((tag, idx) =>
                  isSuperAdmin && editingTagOldText === tag.text ? (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-[#C5A059] shadow-sm"
                    >
                      <input
                        type="text"
                        value={editingTagNewText}
                        onChange={(e) => setEditingTagNewText(e.target.value)}
                        className="text-xs text-[#0A1629] px-1.5 py-0.5 w-28 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingTagNewText.trim()) return;
                          const ok = await dispatchServerMutation({
                            action: 'edit_item',
                            libraryId: selectedLibrary.id,
                            oldText: tag.text,
                            newText: editingTagNewText.trim(),
                          });
                          if (ok) {
                            setEditingTagOldText(null);
                            setEditingTagNewText('');
                          }
                        }}
                        className="p-0.5 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        title="Save item rename"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTagOldText(null);
                          setEditingTagNewText('');
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#1E293B] bg-white border border-[#E2E8F0] shadow-sm"
                    >
                      <span>{tag.text}</span>
                      {isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 ml-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTagOldText(tag.text);
                              setEditingTagNewText(tag.text);
                            }}
                            className="text-[#64748B] hover:text-[#0A1629] cursor-pointer"
                            title="Edit item"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              dispatchServerMutation({
                                action: 'archive_item',
                                libraryId: selectedLibrary.id,
                                itemText: tag.text,
                              })
                            }
                            className="text-[#64748B] hover:text-amber-600 cursor-pointer"
                            title="Archive item"
                          >
                            <Archive className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(selectedLibrary, tag.text)}
                            className="text-[#64748B] hover:text-rose-600 font-bold cursor-pointer"
                            title="Remove item"
                          >
                            &times;
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenRequestModal(selectedLibrary, tag.text, 'edit')}
                          className="text-[10px] font-semibold text-[#C5A059] hover:underline ml-1 cursor-pointer"
                          title="Request Super Admin approval to edit or remove"
                        >
                          Request
                        </button>
                      )}
                    </span>
                  )
                )}
              </div>

              {/* Archived Items Section (Super Admin restore capability) */}
              {isSuperAdmin &&
                selectedLibrary.archivedTags &&
                selectedLibrary.archivedTags.length > 0 && (
                  <div className="pt-1 space-y-1.5">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Archived Items ({selectedLibrary.archivedTags.length})
                    </span>
                    <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      {selectedLibrary.archivedTags.map((archivedText, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-slate-500 bg-white border border-slate-200"
                        >
                          <span className="line-through">{archivedText}</span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatchServerMutation({
                                action: 'restore_item',
                                libraryId: selectedLibrary.id,
                                itemText: archivedText,
                              })
                            }
                            className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                          >
                            Restore
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {isSuperAdmin && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-[#64748B] mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] text-xs text-[#0A1629]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1EFEB] shrink-0">
              {canAddItemsToLibrary(selectedLibrary) ? (
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(selectedLibrary)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A059] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Item
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={async () => {
                  if (
                    isSuperAdmin &&
                    descriptionDraft.trim() &&
                    descriptionDraft.trim() !== selectedLibrary.description
                  ) {
                    await dispatchServerMutation({
                      action: 'update_library_settings',
                      libraryId: selectedLibrary.id,
                      description: descriptionDraft.trim(),
                    });
                  }
                  setActiveModal('none');
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#1E293B] text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Regular Admin Request Change / Removal for Super Admin Approval ── */}
      {activeModal === 'requestChange' && selectedLibrary && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFD5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1EFEB] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#0A1629]">
                    Request Super Admin Approval
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedLibrary.title} &bull; Edits and removals require Super Admin sign-off
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApprovalRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0A1629] mb-1">
                  Existing Item
                </label>
                <select
                  value={requestTargetItem}
                  onChange={(e) => {
                    setRequestTargetItem(e.target.value);
                    if (requestActionType === 'edit') {
                      setRequestProposedItem(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                >
                  {selectedLibrary.tags.map((t, i) => (
                    <option key={i} value={t.text}>
                      {t.text}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0A1629] mb-1">
                  Requested Action
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'edit', label: 'Edit Label' },
                      { id: 'archive', label: 'Archive' },
                      { id: 'remove', label: 'Remove' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setRequestActionType(opt.id);
                        if (opt.id === 'edit' && !requestProposedItem) {
                          setRequestProposedItem(requestTargetItem);
                        }
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        requestActionType === opt.id
                          ? 'bg-[#0A1629] text-white border-[#0A1629]'
                          : 'bg-[#FAF7F2] text-[#475569] border-[#DFD5C2] hover:bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {requestActionType === 'edit' && (
                <div>
                  <label className="block text-xs font-semibold text-[#0A1629] mb-1">
                    Proposed New Wording
                  </label>
                  <input
                    type="text"
                    value={requestProposedItem}
                    onChange={(e) => setRequestProposedItem(e.target.value)}
                    placeholder="Enter updated item label"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0A1629] mb-1">
                  Reason for Request
                </label>
                <textarea
                  rows={2}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Briefly explain why this item should be updated, archived or removed..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059] focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1EFEB]">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !requestTargetItem.trim() ||
                    (requestActionType === 'edit' && !requestProposedItem.trim())
                  }
                  className="px-4 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#1E293B] disabled:opacity-50 text-xs font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Approval Requests Queue (Super Admin Approve / Reject; Admin Status View) ── */}
      {activeModal === 'approvals' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E8DFD5] space-y-4 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F1EFEB] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#0A1629]">
                    Master Library Change &amp; Removal Requests
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {isSuperAdmin
                      ? 'Approve or reject changes and removals requested by regular Admin users.'
                      : 'Requests submitted by Admin users awaiting Super Admin approval.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {approvalRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#64748B]">
                  No change or removal requests have been submitted yet.
                </div>
              ) : (
                approvalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-[#E8DFD5] bg-[#FAF7F2] p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-[#0A1629]">
                            {req.libraryTitle}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-white border border-[#E8DECE] text-[#78644A]">
                            {req.actionType}
                          </span>
                        </div>
                        <p className="text-xs text-[#1E293B] mt-1">
                          Item: <strong>&ldquo;{req.targetItem}&rdquo;</strong>
                          {req.actionType === 'edit' && req.proposedItem && (
                            <>
                              {' '}
                              &rarr; <strong>&ldquo;{req.proposedItem}&rdquo;</strong>
                            </>
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748B]">{req.reason}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD5]/70 text-[11px] text-[#64748B]">
                      <span>
                        Requested by {req.requestedBy} &bull; {req.requestedAt}
                      </span>

                      {req.status === 'pending' && isSuperAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              dispatchServerMutation({
                                action: 'resolve_approval_request',
                                requestId: req.id,
                                decision: 'reject',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 font-semibold text-[11px] cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              dispatchServerMutation({
                                action: 'resolve_approval_request',
                                requestId: req.id,
                                decision: 'approve',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#0A1629] text-white hover:bg-[#1E293B] font-semibold text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#F1EFEB] shrink-0">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#1E293B] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Reorder Library (Super Admin Only) ── */}
      {activeModal === 'reorder' && selectedLibrary && isSuperAdmin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E8DFD5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1EFEB] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-semibold text-base text-[#0A1629]">
                  Reorder {selectedLibrary.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Choose how items in <strong>{selectedLibrary.title}</strong> should be prioritized in dropdowns and option lists across portals.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSortAlphabetical(selectedLibrary.id)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Alphabetical (A &rarr; Z)</span>
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={async () => {
                  const ok = await dispatchServerMutation({
                    action: 'reorder_items',
                    libraryId: selectedLibrary.id,
                    mode: 'reverse',
                  });
                  if (ok) {
                    setActiveModal('none');
                  }
                }}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Most Frequently Used First</span>
                <RotateCcw className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#F1EFEB]">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:bg-slate-100"
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
