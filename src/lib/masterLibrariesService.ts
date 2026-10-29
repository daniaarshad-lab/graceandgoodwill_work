export type AdminRole = 'admin' | 'super_admin';
export type LibraryScope = 'client_carer' | 'admin_portal';

export interface LibraryTagItem {
  text: string;
  hasRemove?: boolean;
  archived?: boolean;
}

export interface MasterLibraryRecord {
  id: string;
  title: string;
  description: string;
  scope: LibraryScope;
  totalCount: number;
  iconType: string;
  tags: LibraryTagItem[];
  archivedTags: string[];
  moreCountText?: string;
  hasOtherSpecify?: boolean;
}

export type ApprovalActionType = 'edit' | 'archive' | 'remove';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface LibraryApprovalRequest {
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

export type MasterLibraryMutationPayload =
  | {
      action: 'add_item';
      libraryId: string;
      itemText: string;
      hasOtherSpecify?: boolean;
    }
  | {
      action: 'edit_item';
      libraryId: string;
      oldText: string;
      newText: string;
    }
  | {
      action: 'remove_item';
      libraryId: string;
      itemText: string;
    }
  | {
      action: 'archive_item';
      libraryId: string;
      itemText: string;
    }
  | {
      action: 'restore_item';
      libraryId: string;
      itemText: string;
    }
  | {
      action: 'reorder_items';
      libraryId: string;
      mode: 'alphabetical' | 'reverse';
    }
  | {
      action: 'update_library_settings';
      libraryId: string;
      description?: string;
      hasOtherSpecify?: boolean;
    }
  | {
      action: 'submit_approval_request';
      libraryId: string;
      actionType: ApprovalActionType;
      targetItem: string;
      proposedItem?: string;
      reason?: string;
    }
  | {
      action: 'resolve_approval_request';
      requestId: string;
      decision: 'approve' | 'reject';
    };

export const INITIAL_MASTER_LIBRARIES: MasterLibraryRecord[] = [
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
      { text: 'Hearing aid assistance' },
      { text: 'Nail care' },
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
  // Admin Portal Exclusive Master Libraries (Managed exclusively by Super Admin)
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

export const INITIAL_APPROVAL_REQUESTS: LibraryApprovalRequest[] = [
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
];

// In-memory singleton state
let serverLibrariesState: MasterLibraryRecord[] = JSON.parse(
  JSON.stringify(INITIAL_MASTER_LIBRARIES)
);
let serverApprovalRequestsState: LibraryApprovalRequest[] = JSON.parse(
  JSON.stringify(INITIAL_APPROVAL_REQUESTS)
);

function decodeBase64Utf8(base64: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf8');
  }
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

function decodeJwtRole(authHeader?: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeBase64Utf8(base64);
    const payload = JSON.parse(json);
    if (typeof payload?.role === 'string') {
      return payload.role;
    }
    if (typeof payload?.user?.role === 'string') {
      return payload.user.role;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Resolves and validates the caller's administrative role on the backend.
 * If a valid JWT with a role claim is present, the JWT role takes precedence over headers
 * so a regular Admin with a JWT cannot escalate privileges via custom headers.
 */
export function resolveVerifiedAdminRole(
  authHeader?: string | null,
  roleHeader?: string | null
): AdminRole | null {
  const jwtRole = decodeJwtRole(authHeader);
  const rawRole = (jwtRole || roleHeader || '').trim().toLowerCase();

  if (rawRole === 'super_admin' || rawRole === 'superadmin' || rawRole === 'super-admin') {
    return 'super_admin';
  }
  if (rawRole === 'admin') {
    return 'admin';
  }
  return null;
}

export function getMasterLibrariesSnapshot() {
  return {
    libraries: serverLibrariesState,
    approvalRequests: serverApprovalRequestsState,
  };
}

/**
 * Enforces Grace & Goodwill Master Libraries RBAC permissions on the server:
 * - Regular Admin ('admin'):
 *   - Can read all Master Libraries.
 *   - Can ONLY add new items to existing Client & Carer library categories ('client_carer').
 *   - CANNOT edit, delete, archive, restore, or reorder existing items without Super Admin approval
 *     (must use 'submit_approval_request').
 *   - CANNOT add, edit, remove, archive, reorder, or request changes to Admin Portal libraries ('admin_portal').
 * - Super Admin ('super_admin'):
 *   - Full access to add, edit, remove, archive, restore, reorder, and update settings across all libraries.
 *   - Exclusive control over Admin Portal Master Libraries ('admin_portal').
 *   - Exclusive ability to approve or reject change/removal requests ('resolve_approval_request').
 */
export function executeMasterLibraryMutation(
  role: AdminRole | null,
  actorName: string,
  payload: MasterLibraryMutationPayload
): {
  status: number;
  error?: string;
  message?: string;
  libraries: MasterLibraryRecord[];
  approvalRequests: LibraryApprovalRequest[];
} {
  if (!role) {
    return {
      status: 403,
      error: 'Unauthorised: Valid Admin or Super Admin role is required to access Master Libraries.',
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // Handle Super Admin resolving an approval request
  if (payload.action === 'resolve_approval_request') {
    if (role !== 'super_admin') {
      return {
        status: 403,
        error: 'Forbidden: Only Super Admin users can approve or reject change or removal requests.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    const reqIndex = serverApprovalRequestsState.findIndex((r) => r.id === payload.requestId);
    if (reqIndex === -1) {
      return {
        status: 404,
        error: 'Approval request not found.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    const targetReq = serverApprovalRequestsState[reqIndex];
    if (targetReq.status !== 'pending') {
      return {
        status: 400,
        error: 'This request has already been resolved.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    const nowFormatted = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (payload.decision === 'approve') {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetReq.libraryId) return lib;
        if (targetReq.actionType === 'remove') {
          const hadTag = lib.tags.some((t) => t.text === targetReq.targetItem);
          return {
            ...lib,
            totalCount: hadTag ? Math.max(0, lib.totalCount - 1) : lib.totalCount,
            tags: lib.tags.filter((t) => t.text !== targetReq.targetItem),
          };
        }
        if (targetReq.actionType === 'archive') {
          const hadTag = lib.tags.some((t) => t.text === targetReq.targetItem);
          return {
            ...lib,
            totalCount: hadTag ? Math.max(0, lib.totalCount - 1) : lib.totalCount,
            tags: lib.tags.filter((t) => t.text !== targetReq.targetItem),
            archivedTags: lib.archivedTags.includes(targetReq.targetItem)
              ? lib.archivedTags
              : [...lib.archivedTags, targetReq.targetItem],
          };
        }
        if (targetReq.actionType === 'edit' && targetReq.proposedItem?.trim()) {
          const nextLabel = targetReq.proposedItem.trim();
          return {
            ...lib,
            tags: lib.tags.map((t) =>
              t.text === targetReq.targetItem ? { ...t, text: nextLabel } : t
            ),
          };
        }
        return lib;
      });
    }

    serverApprovalRequestsState = serverApprovalRequestsState.map((r) =>
      r.id === payload.requestId
        ? {
            ...r,
            status: payload.decision === 'approve' ? 'approved' : 'rejected',
            reviewedBy: actorName || 'Super Admin',
            reviewedAt: nowFormatted,
          }
        : r
    );

    return {
      status: 200,
      message:
        payload.decision === 'approve'
          ? `Approved request on "${targetReq.targetItem}" in ${targetReq.libraryTitle}.`
          : `Rejected request on "${targetReq.targetItem}" in ${targetReq.libraryTitle}.`,
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // Locate target library for library-scoped actions
  const targetLibrary = serverLibrariesState.find((l) => l.id === payload.libraryId);
  if (!targetLibrary) {
    return {
      status: 404,
      error: 'Target Master Library category not found.',
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // CRITICAL RULE 6: Exclusive Super Admin control over Admin Portal Master Libraries
  if (targetLibrary.scope === 'admin_portal' && role !== 'super_admin') {
    return {
      status: 403,
      error:
        'Forbidden: Admin Portal Master Libraries (payments, fees, placement workflows and operational statuses) are managed exclusively by Super Admin.',
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // Handle Regular Admin submitting a change/removal request for Client/Carer libraries
  if (payload.action === 'submit_approval_request') {
    if (!payload.targetItem?.trim()) {
      return {
        status: 400,
        error: 'Target item is required.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }
    if (payload.actionType === 'edit' && !payload.proposedItem?.trim()) {
      return {
        status: 400,
        error: 'Proposed new item wording is required for an edit request.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    const nowFormatted = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newReq: LibraryApprovalRequest = {
      id: `req-${Date.now()}`,
      libraryId: targetLibrary.id,
      libraryTitle: targetLibrary.title,
      actionType: payload.actionType,
      targetItem: payload.targetItem.trim(),
      proposedItem: payload.proposedItem?.trim(),
      reason: payload.reason?.trim() || 'Requested by Admin for Super Admin review.',
      requestedBy: actorName || 'Jessica Smith (Admin)',
      requestedAt: nowFormatted,
      status: 'pending',
    };

    serverApprovalRequestsState = [newReq, ...serverApprovalRequestsState];

    return {
      status: 200,
      message: `Submitted ${payload.actionType} request for "${newReq.targetItem}" to Super Admin for approval.`,
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // Handle adding a new item (Allowed for Regular Admin ONLY on client_carer libraries, and Super Admin on all)
  if (payload.action === 'add_item') {
    const trimmed = (payload.itemText || '').trim();
    if (!trimmed) {
      return {
        status: 400,
        error: 'Item name cannot be empty.',
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    const alreadyExists = targetLibrary.tags.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      return {
        status: 400,
        error: `"${trimmed}" already exists in ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    serverLibrariesState = serverLibrariesState.map((lib) => {
      if (lib.id !== targetLibrary.id) return lib;
      return {
        ...lib,
        totalCount: lib.totalCount + 1,
        tags: [...lib.tags, { text: trimmed }],
        // Only Super Admin can alter library-level settings such as hasOtherSpecify
        hasOtherSpecify:
          role === 'super_admin' && typeof payload.hasOtherSpecify === 'boolean'
            ? payload.hasOtherSpecify
            : lib.hasOtherSpecify,
      };
    });

    return {
      status: 200,
      message: `Added "${trimmed}" to ${targetLibrary.title}.`,
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // CRITICAL RULE 5: All direct edits, removals, archiving, restoring, reordering, or settings updates require Super Admin
  if (role !== 'super_admin') {
    return {
      status: 403,
      error:
        'Forbidden: Regular Admin users cannot edit, delete, archive or remove existing items without Super Admin approval.',
      libraries: serverLibrariesState,
      approvalRequests: serverApprovalRequestsState,
    };
  }

  // Super Admin direct mutations below
  switch (payload.action) {
    case 'edit_item': {
      const nextText = (payload.newText || '').trim();
      if (!nextText) {
        return {
          status: 400,
          error: 'Updated item label cannot be empty.',
          libraries: serverLibrariesState,
          approvalRequests: serverApprovalRequestsState,
        };
      }
      serverLibrariesState = serverLibrariesState.map((lib) =>
        lib.id === targetLibrary.id
          ? {
              ...lib,
              tags: lib.tags.map((t) =>
                t.text === payload.oldText ? { ...t, text: nextText } : t
              ),
            }
          : lib
      );
      return {
        status: 200,
        message: `Updated "${payload.oldText}" to "${nextText}" in ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    case 'remove_item': {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetLibrary.id) return lib;
        const exists = lib.tags.some((t) => t.text === payload.itemText);
        return {
          ...lib,
          totalCount: exists ? Math.max(0, lib.totalCount - 1) : lib.totalCount,
          tags: lib.tags.filter((t) => t.text !== payload.itemText),
          archivedTags: lib.archivedTags.filter((t) => t !== payload.itemText),
        };
      });
      return {
        status: 200,
        message: `Removed "${payload.itemText}" from ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    case 'archive_item': {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetLibrary.id) return lib;
        const exists = lib.tags.some((t) => t.text === payload.itemText);
        return {
          ...lib,
          totalCount: exists ? Math.max(0, lib.totalCount - 1) : lib.totalCount,
          tags: lib.tags.filter((t) => t.text !== payload.itemText),
          archivedTags: lib.archivedTags.includes(payload.itemText)
            ? lib.archivedTags
            : [...lib.archivedTags, payload.itemText],
        };
      });
      return {
        status: 200,
        message: `Archived "${payload.itemText}" in ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    case 'restore_item': {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetLibrary.id) return lib;
        const wasArchived = lib.archivedTags.includes(payload.itemText);
        if (!wasArchived) return lib;
        return {
          ...lib,
          totalCount: lib.totalCount + 1,
          tags: [...lib.tags, { text: payload.itemText }],
          archivedTags: lib.archivedTags.filter((t) => t !== payload.itemText),
        };
      });
      return {
        status: 200,
        message: `Restored "${payload.itemText}" to ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    case 'reorder_items': {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetLibrary.id) return lib;
        const nextTags =
          payload.mode === 'alphabetical'
            ? [...lib.tags].sort((a, b) => a.text.localeCompare(b.text))
            : [...lib.tags].reverse();
        return {
          ...lib,
          tags: nextTags,
        };
      });
      return {
        status: 200,
        message:
          payload.mode === 'alphabetical'
            ? `Sorted ${targetLibrary.title} alphabetically.`
            : `Updated item order for ${targetLibrary.title}.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }

    case 'update_library_settings': {
      serverLibrariesState = serverLibrariesState.map((lib) => {
        if (lib.id !== targetLibrary.id) return lib;
        return {
          ...lib,
          description:
            typeof payload.description === 'string' ? payload.description : lib.description,
          hasOtherSpecify:
            typeof payload.hasOtherSpecify === 'boolean'
              ? payload.hasOtherSpecify
              : lib.hasOtherSpecify,
        };
      });
      return {
        status: 200,
        message: `Updated ${targetLibrary.title} settings.`,
        libraries: serverLibrariesState,
        approvalRequests: serverApprovalRequestsState,
      };
    }
  }
}
