"use client";

import React, { createContext, useContext, useState } from 'react';

export type AvailabilityCategory = 'Live-in Ongoing Care' | 'Live-in Respite Care';

export type PlacementStatus =
  | 'Active'
  | 'Emergency'
  | 'In Progress'
  | 'Upcoming'
  | 'Confirmed'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';

export type CareRequestStage =
  | 'New Enquiry'
  | 'Reviewing Requirements'
  | 'Matching Carers'
  | 'Confirming Payment'
  | 'Confirming Accommodation'
  | 'Finalised';

export type CareRequestPaymentStatus = 'Pending' | 'Confirmed' | 'Paid';

export type AccommodationPhotoCategory = 'Carer Bedroom' | 'Bathroom' | 'Additional Space';
export type AccommodationPhotoStatus = 'pending_approval' | 'approved' | 'rejected';

export interface AccommodationPhotoItem {
  id: string;
  url: string;
  category: AccommodationPhotoCategory;
  uploadedBy: 'client' | 'admin';
  uploadedAt: string;
  status: AccommodationPhotoStatus;
  consentConfirmed: boolean;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const SOLE_OCCUPANCY_BEDROOM = 'Private bedroom (sole occupancy)';
export const SHARED_CARER_BEDROOM =
  'Shared bedroom with another live-in carer, subject to both carers’ agreement';

export interface AccommodationDetails {
  privateBedroomConfirmed: boolean;
  bedroomType: string;
  multipleCarersInHousehold?: boolean;
  bothCarersAgreedSharedBedroom?: boolean;
  bedroomOtherDetails?: string;
  bathroomType: string;
  bathroomOtherDetails?: string;
  showerType: string;
  showerOtherDetails?: string;
  householdNotes: string;
  /** Strictly approved/published photo URLs visible on client profile & to approved carers */
  photos: string[];
  /** Complete list of photo items (pending_approval, approved, rejected) for moderation & management */
  photoItems?: AccommodationPhotoItem[];
  clientPhotoConsentConfirmed?: boolean;
  adminVerified: boolean;
}

export interface AccessLogEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'scheduled' | 'restricted';
}

export interface LifestyleProfileLogEntry {
  id: string;
  date: string;
  updatedBy: string;
  summary: string;
}

export interface ReturningCarerRecord {
  carerName: string;
  avatar: string;
  previousDates: string;
  confirmedReturnDate?: string;
  returnConfirmedByAdmin: boolean;
}

export interface PlacementRecord {
  id: string;
  clientFirstName: string;
  clientSurname: string; // Protected
  age: number;
  location: string; // General city/county
  residentialAddress: string; // Protected
  telephoneNumber: string; // Protected
  emailAddress: string; // Strictly hidden unless admin override
  avatar: string;
  placementType: AvailabilityCategory;
  duration: string;
  isEmergency: boolean;
  status: PlacementStatus;
  /** Weekly fee paid by Grace & Goodwill to the carer — visible to Admin & Carers (incl. Available Placements), NEVER visible to Clients */
  weeklyPayment: number;
  /** Weekly food allowance for the carer — visible to Admin & Carers (incl. Available Placements), NEVER shown as carer pay to Clients */
  foodAllowance: number;
  hasFoodAllowance: boolean;
  /** Weekly fee agreed by the client to pay Grace & Goodwill — visible to Client & Admin only */
  agreedClientWeeklyFee: number;
  paymentStatus?: CareRequestPaymentStatus;
  paymentArrangement?: string;
  startDate: string; // ISO or readable
  startDateISO: string; // YYYY-MM-DD for 7-day calculation
  endDate: string;
  rotationSchedule: string;
  nextHandover: string;
  primaryCarer: {
    name: string;
    fullName: string;
    avatar: string;
  };
  reliefCarer?: {
    name: string;
    avatar: string;
    confirmedDates?: string;
  };
  // Medical & Care Summary for Approved Carers
  mainMedicalConcerns: string[];
  mobilityLevel: string;
  mobilityDetails: string;
  personalCareNeeds: string[];
  personalCareNotes: string;
  medicationSupport: string;
  pets: string;
  smoking: string;
  verbalAbuseHistory: string;
  racialAbuseHistory: string;
  lifestyleNotes?: string;
  lifestyleChangeLog?: LifestyleProfileLogEntry[];
  interests: string[];
  aboutClient: string;
  careGoals: string;
  accommodation: AccommodationDetails;
  // Access & Confidentiality Controls
  confirmedDate: string;
  agreementsSigned: boolean;
  agreementsSignedDate?: string;
  manualOverride: 'none' | 'granted' | 'revoked';
  emailExceptionAuthorised: boolean;
  emailExceptionReason?: string;
  confirmedReturnDateISO?: string;
  returningCarers: ReturningCarerRecord[];
  accessHistory: AccessLogEntry[];
  circulatedToCarers: boolean;
  opportunityBadge?: 'New' | 'Urgent' | 'Emergency';
}

export interface CareRequestRecord {
  id: string;
  clientCode: string;
  clientFirstName: string;
  clientSurname: string;
  displayTitle: string;
  age: number;
  dob: string;
  location: string;
  residentialAddress: string;
  telephoneNumber: string;
  emailAddress: string;
  avatar: string;
  placementType: AvailabilityCategory;
  duration: string;
  isEmergency: boolean;
  /** Internal matching carer weekly rate (Admin & Carer only — never displayed on Client Care Request, Profile, Portal, or Client documents) */
  weeklyPayment: number;
  foodAllowance: number;
  /** Weekly fee agreed by the client to pay Grace & Goodwill */
  agreedClientWeeklyFee: number;
  paymentStatus: CareRequestPaymentStatus;
  paymentArrangement: string;
  requestDate: string;
  preferredStart: string;
  preferredStartISO: string;
  stage: CareRequestStage;
  priority: 'Standard' | 'Urgent / Emergency';
  assignedCarerName: string;
  source: string;
  lastUpdated: string;
  familyContact: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    avatar: string;
  };
  aboutClient: string;
  careGoals: string;
  conditions: string[];
  conditionsNotes: string;
  mobilityLevel: string;
  mobilityDetails: string;
  aids: string[];
  aidsNotes: string;
  personalCare: string[];
  personalCareOtherDetails?: string;
  personalCareNotes: string;
  medicationSupport: string;
  pets: string;
  smoking: string;
  verbalAbuseHistory: string;
  racialAbuseHistory: string;
  lifestyleNotes?: string;
  lifestyleChangeLog?: LifestyleProfileLogEntry[];
  interests: string[];
  accommodation: AccommodationDetails;
}

export interface EvaluatedAccessState {
  canCarerViewIdentityAndContact: boolean;
  canCarerViewEmail: boolean;
  accessStateLabel: 'Released & Active' | 'Access Scheduled' | 'Restricted (Agreements Pending)' | 'Revoked / Ended';
  releaseDateDisplay: string;
  reasonSummary: string;
}

export type PlatformViewerRole = 'admin' | 'carer' | 'client';
export type AdminUserRole = 'admin' | 'super_admin';

export interface FinancialVisibilityPolicy {
  canViewCarerFeeAndAllowance: boolean;
  canViewAgreedClientFee: boolean;
}

/**
 * Enforces Grace & Goodwill financial visibility across dashboards, placements,
 * profiles, care requests, payment sections, and auto-generated documents:
 * - Admin: sees both Agreed Client Fee (Grace & Goodwill) and Weekly Carer Fee + Food Allowance
 * - Carer: always sees Weekly Carer Fee + Food Allowance (including Available Placements); does not see Client's Grace & Goodwill fee
 * - Client: ONLY sees the Agreed Grace & Goodwill Fee; NEVER sees Weekly Carer Fee or amounts paid to carers
 */
export function getFinancialVisibility(role: PlatformViewerRole): FinancialVisibilityPolicy {
  if (role === 'admin') {
    return {
      canViewCarerFeeAndAllowance: true,
      canViewAgreedClientFee: true,
    };
  }
  if (role === 'carer') {
    return {
      canViewCarerFeeAndAllowance: true,
      canViewAgreedClientFee: false,
    };
  }
  return {
    canViewCarerFeeAndAllowance: false,
    canViewAgreedClientFee: true,
  };
}

// Reference "today" aligned with platform timeline (25 Oct 2026) so 7-day release rules work transparently
export const PLATFORM_REFERENCE_DATE = '2026-10-25';

export function evaluateClientInfoAccess(
  placement: PlacementRecord,
  referenceDateISO: string = PLATFORM_REFERENCE_DATE
): EvaluatedAccessState {
  const refTime = new Date(referenceDateISO + 'T09:00:00Z').getTime();

  // Rule 8: Cancelled or Completed placements immediately revoke access unless a confirmed return applies
  const isEnded = placement.status === 'Completed' || placement.status === 'Cancelled';
  const hasConfirmedActiveReturn = Boolean(placement.confirmedReturnDateISO);

  if (placement.manualOverride === 'revoked') {
    return {
      canCarerViewIdentityAndContact: false,
      canCarerViewEmail: false,
      accessStateLabel: 'Revoked / Ended',
      releaseDateDisplay: 'Restricted by Administrator',
      reasonSummary: 'Administrator manually revoked access to client identifying and contact details.',
    };
  }

  if (placement.manualOverride === 'granted') {
    return {
      canCarerViewIdentityAndContact: true,
      canCarerViewEmail: placement.emailExceptionAuthorised,
      accessStateLabel: 'Released & Active',
      releaseDateDisplay: 'Granted via Admin Override',
      reasonSummary: 'Administrator manually authorised immediate release of client full name, address and telephone.',
    };
  }

  if (isEnded && !hasConfirmedActiveReturn) {
    return {
      canCarerViewIdentityAndContact: false,
      canCarerViewEmail: false,
      accessStateLabel: 'Revoked / Ended',
      releaseDateDisplay: 'Revoked upon placement end',
      reasonSummary:
        'Placement has ended or been cancelled. Surname, residential address, telephone and email are automatically restricted; non-identifying historical summary remains in carer history.',
    };
  }

  // Rule 6C: Agreements must be signed before any client contact details are released
  if (!placement.agreementsSigned) {
    return {
      canCarerViewIdentityAndContact: false,
      canCarerViewEmail: false,
      accessStateLabel: 'Restricted (Agreements Pending)',
      releaseDateDisplay: 'Locked until agreements signed',
      reasonSummary:
        'Client identifying and contact details remain hidden until the required agreements have been signed.',
    };
  }

  // Target start date (or confirmed return date for returning carers per Rule 7)
  const targetISO = placement.confirmedReturnDateISO || placement.startDateISO;
  const targetTime = new Date(targetISO + 'T09:00:00Z').getTime();
  const diffDays = Math.ceil((targetTime - refTime) / (1000 * 60 * 60 * 24));

  // Compute 7-day prior date string
  const releaseDateObj = new Date(targetTime - 7 * 24 * 60 * 60 * 1000);
  const releaseDateFormatted = releaseDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Rule 6B: Starting within <= 7 days (with signed agreements — handled separately from Emergency Placement flag)
  if (diffDays <= 7) {
    return {
      canCarerViewIdentityAndContact: true,
      canCarerViewEmail: placement.emailExceptionAuthorised,
      accessStateLabel: 'Released & Active',
      releaseDateDisplay:
        diffDays <= 7 && diffDays >= 0
          ? `${releaseDateFormatted} (7-day window active)`
          : 'Released (Signed Agreements & Active Window)',
      reasonSummary:
        diffDays < 7 && diffDays >= 0
          ? 'Placement starts within 7 days with signed agreements — full name, residential address and telephone released.'
          : 'Contact information is available to the assigned carer following signed agreements.',
    };
  }

  // Rule 6A: More than 7 days away -> Scheduled
  return {
    canCarerViewIdentityAndContact: false,
    canCarerViewEmail: false,
    accessStateLabel: 'Access Scheduled',
    releaseDateDisplay: `Scheduled for ${releaseDateFormatted}`,
    reasonSummary: `Placement starts in ${diffDays} days. Full name, address and telephone will automatically release 7 days before start (${releaseDateFormatted}).`,
  };
}

/**
 * Automatically derives a client's Main Care Needs from their linked Client Account / Care Request
 * record (falling back to placement clinical fields) so admins never have to enter care needs twice.
 */
export function buildConciseCareNeeds(params: {
  conditions: string[];
  mobilityLevel: string;
  personalCare: string[];
  medicationSupport: string;
  maxItems?: number;
}): string[] {
  const { conditions, mobilityLevel, personalCare, medicationSupport, maxItems = 4 } = params;
  const rawConditions = conditions.filter(
    (c) => c.trim() && !c.toLowerCase().startsWith('other')
  );

  const needs: string[] = [];
  const addUnique = (label: string) => {
    const cleaned = label.trim();
    if (!cleaned) return;
    if (!needs.some((existing) => existing.toLowerCase() === cleaned.toLowerCase())) {
      needs.push(cleaned);
    }
  };

  // Map mobility status to concise care-need terminology
  let mobilityNeed = '';
  const hasExplicitMobility = rawConditions.some((c) => c.toLowerCase().includes('mobility'));
  if (!hasExplicitMobility) {
    if (mobilityLevel === 'Bedbound, requires full support with mobility and repositioning') {
      mobilityNeed = 'Bedbound Mobility & Repositioning';
    } else if (mobilityLevel === 'Unable to walk, requires full assistance') {
      mobilityNeed = 'Full Mobility Assistance';
    } else if (mobilityLevel === 'Requires support') {
      mobilityNeed = 'Limited Mobility';
    } else if (mobilityLevel === 'Wheelchair user') {
      mobilityNeed = 'Wheelchair Mobility';
    } else if (mobilityLevel === 'Independent (with aid)') {
      mobilityNeed = 'Mobility Aid Support';
    }
  }

  // Insert primary condition first, followed by mobility need, then remaining key conditions
  if (rawConditions.length > 0) {
    addUnique(rawConditions[0]);
    if (mobilityNeed) addUnique(mobilityNeed);
    rawConditions.slice(1).forEach(addUnique);
  } else if (mobilityNeed) {
    addUnique(mobilityNeed);
  }

  // Include specific continence support if applicable and within summary budget
  if (
    personalCare.some((p) => p.toLowerCase().includes('continence')) &&
    needs.length < maxItems
  ) {
    addUnique('Continence Care');
  }

  // Only append broader daily support labels when needed to form at least a 2-item summary
  if (personalCare.length > 0 && needs.length < 2) {
    addUnique('Personal Care');
  }
  if (medicationSupport && needs.length < 2) {
    addUnique('Medication Support');
  }

  const concise = needs.slice(0, maxItems);
  return concise.length > 0 ? concise : ['Live-in Companionship & Daily Support'];
}

export function deriveCareNeedsFromAccount(
  account: CareRequestRecord,
  maxItems = 4
): string[] {
  return buildConciseCareNeeds({
    conditions: account.conditions || [],
    mobilityLevel: account.mobilityLevel,
    personalCare: account.personalCare || [],
    medicationSupport: account.medicationSupport,
    maxItems,
  });
}

export function deriveMainCareNeeds(
  placement: PlacementRecord,
  careRequests: CareRequestRecord[] = [],
  maxItems = 4
): string[] {
  const linkedAccount = careRequests.find(
    (cr) =>
      cr.clientFirstName.trim().toLowerCase() === placement.clientFirstName.trim().toLowerCase() &&
      cr.clientSurname.trim().toLowerCase() === placement.clientSurname.trim().toLowerCase() &&
      cr.location.trim().toLowerCase() === placement.location.trim().toLowerCase()
  );

  return buildConciseCareNeeds({
    conditions: linkedAccount?.conditions?.length
      ? linkedAccount.conditions
      : placement.mainMedicalConcerns,
    mobilityLevel: linkedAccount?.mobilityLevel || placement.mobilityLevel,
    personalCare: linkedAccount?.personalCare?.length
      ? linkedAccount.personalCare
      : placement.personalCareNeeds,
    medicationSupport: linkedAccount?.medicationSupport || placement.medicationSupport,
    maxItems,
  });
}

export function getAccommodationPhotoItems(acc: AccommodationDetails): AccommodationPhotoItem[] {
  if (acc.photoItems) {
    return acc.photoItems;
  }
  const categories: AccommodationPhotoCategory[] = [
    'Carer Bedroom',
    'Bathroom',
    'Additional Space',
  ];
  return (acc.photos || []).map((url, idx) => ({
    id: `init-photo-${idx}`,
    url,
    category: categories[idx] || 'Additional Space',
    uploadedBy: 'admin',
    uploadedAt: 'Verified on file',
    status: 'approved',
    consentConfirmed: true,
    reviewedBy: 'Jessica Smith (Admin)',
  }));
}

export function getApprovedAccommodationPhotos(acc: AccommodationDetails): string[] {
  if (acc.photoItems) {
    return acc.photoItems.filter((item) => item.status === 'approved').map((item) => item.url);
  }
  return acc.photos || [];
}

export function hasPendingAccommodationPhotos(acc: AccommodationDetails): boolean {
  return getAccommodationPhotoItems(acc).some((item) => item.status === 'pending_approval');
}

export function getAccommodationApprovalStatus(
  acc: AccommodationDetails
): 'Pending Approval' | 'Approved' {
  if (hasPendingAccommodationPhotos(acc) || !acc.adminVerified) {
    return 'Pending Approval';
  }
  return 'Approved';
}

const DEFAULT_ACCOMMODATION_PHOTOS = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=500&auto=format&fit=crop&q=80',
];

const INITIAL_PLACEMENTS: PlacementRecord[] = [
  {
    id: 'pl-doris',
    clientFirstName: 'Doris',
    clientSurname: 'Thompson',
    age: 88,
    location: 'Hertfordshire',
    residentialAddress: '14 Oakwood Lane\nSt Albans\nHertfordshire\nAL3 6DR',
    telephoneNumber: '07712 345678',
    emailAddress: 'doris.thompson.family@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    status: 'Active',
    weeklyPayment: 900,
    foodAllowance: 40,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1350,
    startDate: '01 Nov 2026',
    startDateISO: '2026-11-01',
    endDate: 'Ongoing',
    rotationSchedule: '4 weeks on / 1 week respite',
    nextHandover: '29 Nov 2026',
    primaryCarer: {
      name: 'Anita K.',
      fullName: 'Anita Kapoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    },
    reliefCarer: {
      name: 'Maria S.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      confirmedDates: '29 Nov 2026 – 06 Dec 2026',
    },
    mainMedicalConcerns: ['Dementia', 'Arthritis'],
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Using a walking frame indoors; requires supervision on stairs and uneven garden paths.',
    personalCareNeeds: ['Washing / bathing', 'Dressing', 'Toileting'],
    personalCareNotes: 'Requires gentle prompting and hands-on support with morning washing and dressing.',
    medicationSupport: 'Prompting and administration support twice daily (08:00 & 20:00).',
    pets: 'Yes, 1 dog and 1 cat',
    smoking: 'No (Non-smoking household)',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'Previously reported, not currently occurring',
    interests: ['Gardening', 'Music', 'Reading'],
    aboutClient:
      'Doris is a kind and sociable lady who enjoys conversation, gardening and spending time with her pets. She lives in Hertfordshire and would like to remain in her home with the support of an experienced live-in carer.',
    careGoals:
      'To support Doris to live comfortably and safely at home, maintaining her dignity, independence and quality of life, with support for daily activities, personal care and companionship.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Private bathroom',
      showerType: 'Private',
      householdNotes: 'Spacious ground-accessible guest bedroom with Wi-Fi, desk and garden view. Fully equipped private bathroom with toilet, washbasin and walk-in shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 3),
      photoItems: [
        {
          id: 'doris-ph-1',
          url: DEFAULT_ACCOMMODATION_PHOTOS[0],
          category: 'Carer Bedroom',
          uploadedBy: 'client',
          uploadedAt: '18 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Jessica Smith (Admin)',
          reviewedAt: '18 Oct 2026',
        },
        {
          id: 'doris-ph-2',
          url: DEFAULT_ACCOMMODATION_PHOTOS[1],
          category: 'Bathroom',
          uploadedBy: 'client',
          uploadedAt: '18 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Jessica Smith (Admin)',
          reviewedAt: '18 Oct 2026',
        },
        {
          id: 'doris-ph-3',
          url: DEFAULT_ACCOMMODATION_PHOTOS[2],
          category: 'Additional Space',
          uploadedBy: 'admin',
          uploadedAt: '19 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Auto-approved (Admin Upload)',
          reviewedAt: '19 Oct 2026',
        },
        {
          id: 'doris-ph-4-pending',
          url: DEFAULT_ACCOMMODATION_PHOTOS[3],
          category: 'Additional Space',
          uploadedBy: 'client',
          uploadedAt: 'Today, 09:40',
          status: 'pending_approval',
          consentConfirmed: true,
        },
      ],
      clientPhotoConsentConfirmed: true,
      adminVerified: false,
    },
    confirmedDate: '18 Oct 2026',
    agreementsSigned: false,
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [
      {
        carerName: 'Anita K.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
        previousDates: '12 Sep 2026 – 26 Sep 2026',
        returnConfirmedByAdmin: true,
      },
    ],
    accessHistory: [
      {
        id: 'log-1',
        date: '18 Oct 2026',
        time: '14:32',
        title: 'Placement confirmed',
        subtitle: 'by Jessica Smith',
        status: 'completed',
      },
      {
        id: 'log-2',
        date: '18 Oct 2026',
        time: '15:10',
        title: 'Agreements signed',
        subtitle: 'by Anita K.',
        status: 'completed',
      },
      {
        id: 'log-3',
        date: '25 Oct 2026',
        time: '09:00',
        title: 'Client information released (7 days before start)',
        subtitle: 'Full name, address & phone released automatically',
        status: 'active',
      },
      {
        id: 'log-4',
        date: '—',
        time: '',
        title: 'Email address remains hidden',
        subtitle: 'Admin override not applied',
        status: 'restricted',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'New',
  },
  {
    id: 'pl-richard',
    clientFirstName: 'Richard',
    clientSurname: 'Hargrave',
    age: 79,
    location: 'Cheshire',
    residentialAddress: '8 Willowbank Close\nKnutsford\nCheshire\nWA16 8BQ',
    telephoneNumber: '07845 901223',
    emailAddress: 'richard.h@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Respite Care',
    duration: '14 days (Urgent cover)',
    isEmergency: true,
    status: 'Emergency',
    weeklyPayment: 950,
    foodAllowance: 35,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1425,
    startDate: '26 Oct 2026',
    startDateISO: '2026-10-26',
    endDate: '09 Nov 2026',
    rotationSchedule: 'Single 14-day respite block',
    nextHandover: '09 Nov 2026',
    primaryCarer: {
      name: 'Daniel C.',
      fullName: 'Daniel Carter',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    },
    reliefCarer: {
      name: 'Thomas G.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    },
    mainMedicalConcerns: ['Stroke', 'Arthritis'],
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Uses a walking frame for indoor mobility. Can manage stairs with supervision.',
    personalCareNeeds: ['Washing / bathing', 'Dressing', 'Toileting'],
    personalCareNotes: 'Prompting and hands-on support following hospital discharge.',
    medicationSupport: 'Osteoarthritis and blood pressure tablets 3 times daily.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Local history', 'Gardening', 'Classical radio'],
    aboutClient:
      'Mr Richard is a kind and sociable gentleman requiring urgent live-in respite care starting tomorrow following hospital discharge.',
    careGoals:
      'Safe urgent transition home, mobility reassurance and daily personal care routines.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Shared bathroom with client',
      showerType: 'Shared with client',
      householdNotes: 'Private double bedroom upstairs; fully equipped bathroom with toilet, washbasin and shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 3),
      adminVerified: true,
    },
    confirmedDate: '25 Oct 2026',
    agreementsSigned: true,
    agreementsSignedDate: '25 Oct 2026',
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'r-1',
        date: '25 Oct 2026',
        time: '10:15',
        title: 'Emergency placement confirmed (<7 days)',
        subtitle: 'by Jessica Smith',
        status: 'completed',
      },
      {
        id: 'r-2',
        date: '25 Oct 2026',
        time: '10:22',
        title: 'Agreements signed & immediate access released',
        subtitle: 'Starts tomorrow — Rule 6B immediate release triggered',
        status: 'active',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'Urgent',
  },
  {
    id: 'pl-margaret',
    clientFirstName: 'Margaret',
    clientSurname: 'Lewis',
    age: 82,
    location: 'Newcastle',
    residentialAddress: '22 Jesmond Park West\nNewcastle upon Tyne\nNE7 7BU',
    telephoneNumber: '07911 223344',
    emailAddress: 'margaret.lewis@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Respite Care',
    duration: '2 weeks',
    isEmergency: false,
    status: 'In Progress',
    weeklyPayment: 850,
    foodAllowance: 40,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1295,
    startDate: '18 Oct 2026',
    startDateISO: '2026-10-18',
    endDate: '01 Nov 2026',
    rotationSchedule: '2-week respite arrangement',
    nextHandover: '01 Nov 2026',
    primaryCarer: {
      name: 'Sophie W.',
      fullName: 'Sophie Williams',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    },
    reliefCarer: {
      name: 'Olivia B.',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
    },
    mainMedicalConcerns: ['Parkinson’s', 'COPD'],
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Transfer assistance and steady support indoors.',
    personalCareNeeds: ['Washing / bathing', 'Dressing', 'Medication reminders'],
    personalCareNotes: 'Morning routine takes extra time due to stiffness.',
    medicationSupport: 'Timed Parkinson’s medication administration.',
    pets: 'Yes, 1 cat',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Watercolour painting', 'Baking', 'Documentaries'],
    aboutClient: 'Margaret is warm and appreciative of calm, structured daily routines in her Newcastle home.',
    careGoals: 'Maintain timed medication schedule and safe household mobility while family is away.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Ensuite bathroom',
      showerType: 'Private',
      householdNotes: 'Private bedroom with ensuite toilet, washbasin and shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 2),
      adminVerified: true,
    },
    confirmedDate: '05 Oct 2026',
    agreementsSigned: true,
    agreementsSignedDate: '06 Oct 2026',
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'm-1',
        date: '11 Oct 2026',
        time: '09:00',
        title: 'Client information released to Sophie W.',
        subtitle: '7 days prior to 18 Oct start',
        status: 'active',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'New',
  },
  {
    id: 'pl-eleanor',
    clientFirstName: 'Eleanor',
    clientSurname: 'Briggs',
    age: 76,
    location: 'Surrey',
    residentialAddress: '5Heathside Gardens\nGuildford\nSurrey\nGU1 4TY',
    telephoneNumber: '07700 954321',
    emailAddress: 'eleanor.briggs@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    status: 'Upcoming',
    weeklyPayment: 900,
    foodAllowance: 40,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1350,
    startDate: '10 Nov 2026',
    startDateISO: '2026-11-10',
    endDate: 'Ongoing',
    rotationSchedule: '3 weeks on / 1 week off',
    nextHandover: '01 Dec 2026',
    primaryCarer: {
      name: 'James P.',
      fullName: 'James Parker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    },
    reliefCarer: {
      name: 'Amelia K.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      confirmedDates: '01 Dec 2026 – 08 Dec 2026',
    },
    mainMedicalConcerns: ['Multiple Sclerosis', 'Hypertension'],
    mobilityLevel: 'Independent (with aid)',
    mobilityDetails: 'Uses a walking stick indoors; wheelchair for longer community outings.',
    personalCareNeeds: ['Showering assistance', 'Dressing'],
    personalCareNotes: 'Right-side weakness following mild stroke.',
    medicationSupport: 'Daily morning blood pressure medication prompt.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Bridge', 'Botanical gardens', 'Crosswords'],
    aboutClient: 'Eleanor enjoys lively conversation and trips to local Surrey garden centres.',
    careGoals: 'Support safe independent living and confidence outdoors.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Private bathroom',
      showerType: 'Private',
      householdNotes: 'First-floor private carer bedroom and dedicated bathroom with bathtub and shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS,
      adminVerified: true,
    },
    confirmedDate: '20 Oct 2026',
    agreementsSigned: true,
    agreementsSignedDate: '21 Oct 2026',
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'e-1',
        date: '21 Oct 2026',
        time: '11:40',
        title: 'Placement confirmed & agreements signed',
        subtitle: 'Auto-release scheduled for 03 Nov 2026 (7 days before start)',
        status: 'scheduled',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'New',
  },
  {
    id: 'pl-david',
    clientFirstName: 'David',
    clientSurname: 'Mercer',
    age: 81,
    location: 'York',
    residentialAddress: '19 Bootham Terrace\nYork\nYO30 7DH',
    telephoneNumber: '07788 412398',
    emailAddress: 'david.mercer@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    status: 'Upcoming',
    weeklyPayment: 880,
    foodAllowance: 40,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1320,
    startDate: '12 Nov 2026',
    startDateISO: '2026-11-12',
    endDate: 'Ongoing',
    rotationSchedule: '2 weeks on / 2 weeks off',
    nextHandover: '26 Nov 2026',
    primaryCarer: {
      name: 'Patricia E.',
      fullName: 'Patricia Evans',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    },
    mainMedicalConcerns: ['Type 2 Diabetes', 'Visual Impairment'],
    mobilityLevel: 'Independent (with aid)',
    mobilityDetails: 'Steady indoors; requires guiding arm in unfamiliar places.',
    personalCareNeeds: ['Meal preparation', 'Medication support', 'Shaving'],
    personalCareNotes: 'Diabetic-friendly balanced home cooking required.',
    medicationSupport: 'Blood glucose monitoring and oral medication.',
    pets: 'Yes, 1 friendly Labrador',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Cricket radio', 'Walking the dog', 'History books'],
    aboutClient: 'Retired schoolmaster in York who loves daily walks by the river and audiobooks.',
    careGoals: 'Consistent diabetic meal routines, companionship and safe outdoor walks.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Shared bathroom with client',
      showerType: 'Shared with client',
      householdNotes: 'Comfortable guest bedroom; full bathroom with toilet, washbasin and bathtub.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 2),
      adminVerified: true,
    },
    confirmedDate: '22 Oct 2026',
    agreementsSigned: false, // Demonstrates Rule 6C unsigned agreement state!
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'd-1',
        date: '22 Oct 2026',
        time: '16:05',
        title: 'Placement provisionally assigned to Patricia E.',
        subtitle: 'Awaiting signed placement agreement before scheduling release',
        status: 'restricted',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'New',
  },
  {
    id: 'pl-jean',
    clientFirstName: 'Jean',
    clientSurname: 'Whitaker',
    age: 85,
    location: 'Hull',
    residentialAddress: '41 Beverley Road\nHull\nHU3 1XH',
    telephoneNumber: '07901 667788',
    emailAddress: 'jean.whitaker@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Respite Care',
    duration: '14 days',
    isEmergency: false,
    status: 'Completed',
    weeklyPayment: 820,
    foodAllowance: 40,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1245,
    startDate: '01 Oct 2026',
    startDateISO: '2026-10-01',
    endDate: '15 Oct 2026',
    rotationSchedule: 'Completed 14-day respite placement',
    nextHandover: 'Completed',
    primaryCarer: {
      name: 'Bharti S.',
      fullName: 'Bharti Sharma',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
    },
    mainMedicalConcerns: ['Dementia', 'Arthritis'],
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Uses a rollator frame indoors.',
    personalCareNeeds: ['Washing / bathing', 'Dressing'],
    personalCareNotes: 'Gentle pace in mornings.',
    medicationSupport: 'Morning and evening cardiac medication prompt.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Knitting', 'Afternoon tea', 'Family photos'],
    aboutClient: 'Jean completed a two-week respite placement while her daughter was travelling.',
    careGoals: 'Safe respite cover and companionship.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Private bathroom',
      showerType: 'Private',
      householdNotes: 'Private guest room and downstairs shower room.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 2),
      adminVerified: true,
    },
    confirmedDate: '20 Sep 2026',
    agreementsSigned: true,
    agreementsSignedDate: '21 Sep 2026',
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'j-1',
        date: '15 Oct 2026',
        time: '18:00',
        title: 'Placement completed — Client contact information automatically restricted',
        subtitle: 'Surname, address & telephone revoked per Rule 8; historical summary retained',
        status: 'restricted',
      },
    ],
    circulatedToCarers: false,
  },
  {
    id: 'pl-arthur-emergency',
    clientFirstName: 'Arthur',
    clientSurname: 'Pendleton',
    age: 86,
    location: 'Oxfordshire',
    residentialAddress: '3 Manor Farm Cottages\nHenley-on-Thames\nRG9 4AE',
    telephoneNumber: '07755 339911',
    emailAddress: 'arthur.family@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Emergency Ongoing Start',
    isEmergency: true,
    status: 'Emergency',
    weeklyPayment: 980,
    foodAllowance: 45,
    hasFoodAllowance: true,
    agreedClientWeeklyFee: 1480,
    startDate: '26 Oct 2026',
    startDateISO: '2026-10-26',
    endDate: 'Ongoing',
    rotationSchedule: '3 weeks on / 1 week respite',
    nextHandover: '16 Nov 2026',
    primaryCarer: {
      name: 'Komal V.',
      fullName: 'Komal Verma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    },
    reliefCarer: {
      name: 'Anita K.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    },
    mainMedicalConcerns: ['Early Dementia', 'Falls Risk'],
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Requires supervision during all transfers following sudden family carer illness.',
    personalCareNeeds: ['Washing / bathing', 'Dressing', 'Toileting', 'Continence care'],
    personalCareNotes: 'Reassuring, calm communication required.',
    medicationSupport: 'Full administration support 3 times daily.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Jazz music', 'Countryside views', 'Chess'],
    aboutClient: 'Urgent 24-hour emergency live-in placement arranged after family caregiver hospitalisation.',
    careGoals: 'Immediate safe continuity of care in Arthur’s own home.',
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Ensuite bathroom',
      showerType: 'Private',
      householdNotes: 'Ground-floor private bedroom with ensuite toilet, washbasin and shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS,
      adminVerified: true,
    },
    confirmedDate: '25 Oct 2026',
    agreementsSigned: true,
    agreementsSignedDate: '25 Oct 2026',
    manualOverride: 'none',
    emailExceptionAuthorised: false,
    returningCarers: [],
    accessHistory: [
      {
        id: 'a-1',
        date: '25 Oct 2026',
        time: '08:45',
        title: 'Emergency placement confirmed (<24h start)',
        subtitle: 'Immediate release of full name, address & phone upon agreement signing',
        status: 'active',
      },
    ],
    circulatedToCarers: true,
    opportunityBadge: 'Emergency',
  },
];

const INITIAL_CARE_REQUESTS: CareRequestRecord[] = [
  {
    id: 'cr-doris',
    clientCode: 'CL-00489',
    clientFirstName: 'Doris',
    clientSurname: 'Thompson',
    displayTitle: 'Doris',
    age: 88,
    dob: '19 May 1938 (88)',
    location: 'Hertfordshire',
    residentialAddress: '14 Oakwood Lane, St Albans, Hertfordshire, AL3 6DR',
    telephoneNumber: '07712 345678',
    emailAddress: 'doris.thompson.family@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    weeklyPayment: 900,
    foodAllowance: 40,
    agreedClientWeeklyFee: 1350,
    paymentStatus: 'Confirmed',
    paymentArrangement: 'Weekly Direct Debit',
    requestDate: '16 Oct 2026',
    preferredStart: '01 Nov 2026',
    preferredStartISO: '2026-11-01',
    stage: 'Confirming Accommodation',
    priority: 'Standard',
    assignedCarerName: 'Anita K.',
    source: 'Family enquiry',
    lastUpdated: '24 Oct 2026',
    familyContact: {
      name: 'Claire Thompson',
      relation: 'Daughter',
      phone: '+44 7712 345678',
      email: 'claire.thompson@example.co.uk',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    aboutClient:
      'Doris is a kind and sociable lady who enjoys conversation, gardening and spending time with her pets. She lives in Hertfordshire and would like to remain in her home with the support of an experienced live-in carer.',
    careGoals:
      'To support Doris to live comfortably and safely at home, maintaining her dignity, independence and quality of life.',
    conditions: ['Dementia', 'Arthritis'],
    conditionsNotes: 'Mild-to-moderate dementia with short-term memory prompts needed; warm and sociable temperament.',
    mobilityLevel: 'Requires support',
    mobilityDetails:
      'Uses a walking frame for indoor mobility. Can manage stairs with supervision. Requires assistance on uneven surfaces and for longer distances.',
    aids: ['Walking frame', 'Grab rails', 'Raised toilet seat'],
    aidsNotes: 'Uses a walking frame around the house. Grab rails fitted in the bathroom.',
    personalCare: ['Washing / bathing', 'Dressing', 'Toileting'],
    personalCareNotes:
      'Requires prompting and some hands-on support with washing and dressing. Usually independent with toileting but may need occasional assistance.',
    medicationSupport: 'Prompting and morning/evening administration record.',
    pets: 'Yes, 1 dog and 1 cat',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'Previously reported, not currently occurring',
    interests: ['Gardening', 'Music', 'Reading'],
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Private bathroom',
      showerType: 'Private',
      householdNotes:
        'Dedicated private carer bedroom with Wi-Fi and natural light, plus private bathroom with toilet, washbasin and walk-in shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 3),
      photoItems: [
        {
          id: 'doris-ph-1',
          url: DEFAULT_ACCOMMODATION_PHOTOS[0],
          category: 'Carer Bedroom',
          uploadedBy: 'client',
          uploadedAt: '18 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Jessica Smith (Admin)',
          reviewedAt: '18 Oct 2026',
        },
        {
          id: 'doris-ph-2',
          url: DEFAULT_ACCOMMODATION_PHOTOS[1],
          category: 'Bathroom',
          uploadedBy: 'client',
          uploadedAt: '18 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Jessica Smith (Admin)',
          reviewedAt: '18 Oct 2026',
        },
        {
          id: 'doris-ph-3',
          url: DEFAULT_ACCOMMODATION_PHOTOS[2],
          category: 'Additional Space',
          uploadedBy: 'admin',
          uploadedAt: '19 Oct 2026',
          status: 'approved',
          consentConfirmed: true,
          reviewedBy: 'Auto-approved (Admin Upload)',
          reviewedAt: '19 Oct 2026',
        },
        {
          id: 'doris-ph-4-pending',
          url: DEFAULT_ACCOMMODATION_PHOTOS[3],
          category: 'Additional Space',
          uploadedBy: 'client',
          uploadedAt: 'Today, 09:40',
          status: 'pending_approval',
          consentConfirmed: true,
        },
      ],
      clientPhotoConsentConfirmed: true,
      adminVerified: false,
    },
  },
  {
    id: 'cr-richard',
    clientCode: 'CL-00427',
    clientFirstName: 'Richard',
    clientSurname: 'Hargrave',
    displayTitle: 'Mr Richard',
    age: 79,
    dob: '12 Apr 1947 (79)',
    location: 'Cheshire',
    residentialAddress: '8 Willowbank Close, Knutsford, Cheshire, WA16 8BQ',
    telephoneNumber: '07845 901223',
    emailAddress: 'sarah.richard@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    weeklyPayment: 920,
    foodAllowance: 40,
    agreedClientWeeklyFee: 1380,
    paymentStatus: 'Pending',
    paymentArrangement: 'Monthly Standing Order',
    requestDate: '10 Oct 2026',
    preferredStart: 'As soon as possible',
    preferredStartISO: '2026-10-30',
    stage: 'Confirming Payment',
    priority: 'Standard',
    assignedCarerName: 'Unassigned',
    source: 'Family enquiry',
    lastUpdated: '24 Oct 2026',
    familyContact: {
      name: 'Sarah Richard',
      relation: 'Daughter',
      phone: '+44 7700 900123',
      email: 'sarah.richard@email.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    aboutClient:
      'Mr Richard is a kind and sociable gentleman who enjoys conversation and has a keen interest in history and gardening. He values his independence and would like support to remain in his home in Cheshire.',
    careGoals:
      'To support Mr Richard to live comfortably and safely at home, maintaining his independence, interests and quality of life.',
    conditions: ['Stroke', 'Arthritis'],
    conditionsNotes:
      'Osteoarthritis affecting knees and hands. Generally well managed with medication. Mild short term memory changes noted.',
    mobilityLevel: 'Requires support',
    mobilityDetails:
      'Uses a walking frame for indoor mobility. Can manage stairs with supervision. Requires assistance on uneven surfaces and for longer distances.',
    aids: ['Walking frame'],
    aidsNotes:
      'Uses a walking frame around the house. There are grab rails in the bathroom and a raised toilet seat.',
    personalCare: ['Washing / bathing', 'Dressing', 'Toileting'],
    personalCareNotes:
      'Requires prompting and some hands-on support with washing and dressing. Usually independent with toileting but may need occasional assistance.',
    medicationSupport: 'Oral medication prompts morning and evening.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['History', 'Gardening', 'Reading'],
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Private bathroom',
      showerType: 'Private',
      householdNotes:
        'Comfortable private bedroom overlooking the garden and access to a fully equipped bathroom with toilet, washbasin and shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 3),
      adminVerified: false,
    },
  },
  {
    id: 'cr-edward-new',
    clientCode: 'CL-00502',
    clientFirstName: 'Edward',
    clientSurname: 'Langley',
    displayTitle: 'Edward',
    age: 83,
    dob: '04 Feb 1943 (83)',
    location: 'Cotswolds',
    residentialAddress: '11 Church Lane, Stow-on-the-Wold, GL54 1BB',
    telephoneNumber: '07799 118822',
    emailAddress: 'edward.family@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Respite Care',
    duration: '3 weeks respite',
    isEmergency: true,
    weeklyPayment: 960,
    foodAllowance: 45,
    agreedClientWeeklyFee: 1450,
    paymentStatus: 'Pending',
    paymentArrangement: 'Upfront Respite Invoice',
    requestDate: '25 Oct 2026',
    preferredStart: '28 Oct 2026 (Urgent)',
    preferredStartISO: '2026-10-28',
    stage: 'New Enquiry',
    priority: 'Urgent / Emergency',
    assignedCarerName: 'Unassigned',
    source: 'Hospital discharge team',
    lastUpdated: 'Today',
    familyContact: {
      name: 'Mark Langley',
      relation: 'Son',
      phone: '+44 7799 118822',
      email: 'mark.langley@example.co.uk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    aboutClient:
      'Edward is returning home to the Cotswolds and requires short-notice live-in respite care for 3 weeks while convalescing.',
    careGoals: 'Safe mobility rehabilitation, nutritious meals and calm daily routine.',
    conditions: ['Heart condition', 'Arthritis'],
    conditionsNotes: 'Recovering strength; steady supervision required.',
    mobilityLevel: 'Requires support',
    mobilityDetails: 'Uses a walking frame indoors; stairlift installed.',
    aids: ['Walking frame', 'Stairlift', 'Profile bed'],
    aidsNotes: 'Stairlift and profiling bed already installed at property.',
    personalCare: ['Washing / bathing', 'Dressing'],
    personalCareNotes: 'Morning and evening personal care assistance.',
    medicationSupport: 'Twice daily blister pack prompts.',
    pets: 'Yes, 1 quiet cocker spaniel',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Classical music', 'Birdwatching', 'Crosswords'],
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Ensuite bathroom',
      showerType: 'Private',
      householdNotes: 'Private guest suite with ensuite toilet, washbasin and bathtub/shower.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 2),
      adminVerified: false,
    },
  },
  {
    id: 'cr-margaret',
    clientCode: 'CL-00508',
    clientFirstName: 'Margaret',
    clientSurname: 'Lewis',
    displayTitle: 'Margaret',
    age: 84,
    dob: '09 Sep 1942 (84)',
    location: 'Chester',
    residentialAddress: '22 Abbey Green, Chester, Cheshire, CH1 2JH',
    telephoneNumber: '07734 882190',
    emailAddress: 'margaret.lewis.family@example.co.uk',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    placementType: 'Live-in Ongoing Care',
    duration: 'Long-term',
    isEmergency: false,
    weeklyPayment: 910,
    foodAllowance: 40,
    agreedClientWeeklyFee: 1365,
    paymentStatus: 'Pending',
    paymentArrangement: 'Weekly Direct Debit',
    requestDate: '24 Oct 2026',
    preferredStart: '12 Nov 2026',
    preferredStartISO: '2026-11-12',
    stage: 'Reviewing Requirements',
    priority: 'Standard',
    assignedCarerName: 'Unassigned',
    source: 'Website enquiry',
    lastUpdated: '2h ago',
    familyContact: {
      name: 'helen Lewis',
      relation: 'Niece',
      phone: '+44 7734 882190',
      email: 'helen.lewis@example.co.uk',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    aboutClient:
      'Margaret is a retired teacher in Chester seeking warm, reliable live-in ongoing care to support daily routines and safe mobility.',
    careGoals: 'Maintain safe independent living at home in Chester with companionship and medication support.',
    conditions: ['Hypertension', 'Arthritis'],
    conditionsNotes: 'Well-managed blood pressure and mild knee arthritis.',
    mobilityLevel: 'Independent (with aid)',
    mobilityDetails: 'Uses a lightweight walking stick indoors and frame outdoors.',
    aids: ['Walking frame', 'Grab rails'],
    aidsNotes: 'Grab rails fitted in hallway and bathroom.',
    personalCare: ['Washing / bathing', 'Dressing'],
    personalCareNotes: 'Light morning assistance with bathing and dressing.',
    medicationSupport: 'Morning and evening tablet reminders.',
    pets: 'No pets',
    smoking: 'No',
    verbalAbuseHistory: 'No',
    racialAbuseHistory: 'No',
    interests: ['Literature', 'Radio 4', 'Garden birds'],
    accommodation: {
      privateBedroomConfirmed: true,
      bedroomType: SOLE_OCCUPANCY_BEDROOM,
      bathroomType: 'Shared bathroom with client',
      showerType: 'Shared with client',
      householdNotes:
        'Spacious private upstairs bedroom; clean, well-maintained main bathroom with toilet, washbasin and walk-in shower shared only with Margaret.',
      photos: DEFAULT_ACCOMMODATION_PHOTOS.slice(0, 3),
      adminVerified: false,
    },
  },
];

export interface DeclarationDiffItem {
  id: string;
  section: string;
  currentLive: string;
  newDraft: string;
}

export interface DeclarationAuditEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  actor: string;
  version: string;
  details: string;
  isLatest?: boolean;
}

interface PlatformStoreContextType {
  placements: PlacementRecord[];
  careRequests: CareRequestRecord[];
  totalCarersCount: number;
  adminRole: AdminUserRole;
  setAdminRole: React.Dispatch<React.SetStateAction<AdminUserRole>>;
  carerAvailabilityPrefs: AvailabilityCategory[];
  setCarerAvailabilityPrefs: React.Dispatch<React.SetStateAction<AvailabilityCategory[]>>;
  clientAvatars: Record<string, string>;
  setClientAvatar: (clientKey: string, url: string) => void;
  clientUploadedPhotos: Record<string, { id: string; label: string; url: string }[]>;
  addClientUploadedPhoto: (clientKey: string, photo: { id: string; label: string; url: string }) => void;
  declarationStatus: 'draft' | 'awaiting_client' | 'live';
  setDeclarationStatus: React.Dispatch<React.SetStateAction<'draft' | 'awaiting_client' | 'live'>>;
  declarationDiffs: DeclarationDiffItem[];
  setDeclarationDiffs: React.Dispatch<React.SetStateAction<DeclarationDiffItem[]>>;
  declarationAuditTrail: DeclarationAuditEntry[];
  addDeclarationAuditEntry: (entry: DeclarationAuditEntry) => void;
  incrementApprovedCarers: () => void;
  updatePlacement: (id: string, updater: (prev: PlacementRecord) => PlacementRecord) => void;
  addPlacement: (placement: PlacementRecord) => void;
  updateCareRequest: (id: string, updater: (prev: CareRequestRecord) => CareRequestRecord) => void;
  confirmCareRequestToPlacement: (
    requestId: string,
    carerName: string,
    carerAvatar: string,
    isEmergencyPlacement: boolean
  ) => PlacementRecord | null;
}

const PlatformStoreContext = createContext<PlatformStoreContextType | null>(null);

export const PlatformStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [placements, setPlacements] = useState<PlacementRecord[]>(INITIAL_PLACEMENTS);
  const [careRequests, setCareRequests] = useState<CareRequestRecord[]>(INITIAL_CARE_REQUESTS);
  const [totalCarersCount, setTotalCarersCount] = useState<number>(248);
  const [adminRole, setAdminRole] = useState<AdminUserRole>('admin');
  const [carerAvailabilityPrefs, setCarerAvailabilityPrefs] = useState<AvailabilityCategory[]>([
    'Live-in Ongoing Care',
    'Live-in Respite Care',
  ]);
  const [clientAvatars, setClientAvatarsState] = useState<Record<string, string>>({
    'margaret-lewis':
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
    'eleanor-thomas':
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  });
  const [clientUploadedPhotos, setClientUploadedPhotos] = useState<
    Record<string, { id: string; label: string; url: string }[]>
  >({
    'margaret-lewis': [
      {
        id: 'initial-portrait',
        label: 'Current Portrait',
        url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
      },
    ],
    'eleanor-thomas': [
      {
        id: 'initial-eleanor',
        label: 'Current Portrait',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      },
    ],
  });

  const setClientAvatar = (clientKey: string, url: string) => {
    setClientAvatarsState((prev) => ({ ...prev, [clientKey]: url }));
  };

  const addClientUploadedPhoto = (
    clientKey: string,
    photo: { id: string; label: string; url: string }
  ) => {
    setClientUploadedPhotos((prev) => {
      const existing = prev[clientKey] || [];
      if (existing.length >= 10) return prev;
      return { ...prev, [clientKey]: [...existing, photo] };
    });
  };

  const [declarationStatus, setDeclarationStatus] = useState<'draft' | 'awaiting_client' | 'live'>(
    'draft'
  );
  const [declarationDiffs, setDeclarationDiffs] = useState<DeclarationDiffItem[]>([
    {
      id: 'diff-1',
      section: 'Care Needs',
      currentLive: 'Assistance with mobility',
      newDraft: 'Assistance with mobility and personal care',
    },
    {
      id: 'diff-2',
      section: 'Medical Information',
      currentLive: 'None listed',
      newDraft: 'Type 2 diabetes (medication managed)',
    },
    {
      id: 'diff-3',
      section: 'Interests & Hobbies',
      currentLive: 'Gardening',
      newDraft: 'Gardening, reading, classical music',
    },
    {
      id: 'diff-4',
      section: 'Spoken Languages',
      currentLive: 'English',
      newDraft: 'English, French',
    },
  ]);

  const [declarationAuditTrail, setDeclarationAuditTrail] = useState<DeclarationAuditEntry[]>([
    {
      id: 'aud-1',
      date: '14 Jan 2024',
      time: '10:24',
      title: 'Changes submitted for client confirmation',
      actor: 'Entered by Jessica Smith (Admin)',
      version: 'Declaration v3.3 (Draft)',
      details: 'Categories: Care Needs, Medical Information, Interests & Hobbies, Spoken Languages',
      isLatest: true,
    },
    {
      id: 'aud-2',
      date: '14 Jan 2024',
      time: '10:18',
      title: 'Admin updated client information',
      actor: 'Entered by Jessica Smith (Admin)',
      version: 'Declaration v3.3 (Draft)',
      details: 'Previous values recorded (see details)',
    },
    {
      id: 'aud-3',
      date: '08 Nov 2023',
      time: '14:32',
      title: 'Client confirmed changes',
      actor: 'Confirmed by Margaret Lewis (Client)',
      version: 'Declaration v3.2 (Live)',
      details: 'Categories: Home Environment, Interests & Hobbies',
    },
    {
      id: 'aud-4',
      date: '08 Nov 2023',
      time: '10:15',
      title: 'Changes submitted for client confirmation',
      actor: 'Entered by Daniel Carter (Admin)',
      version: 'Declaration v3.2 (Pending)',
      details: '',
    },
  ]);

  const addDeclarationAuditEntry = (entry: DeclarationAuditEntry) => {
    setDeclarationAuditTrail((prev) => [
      { ...entry, isLatest: true },
      ...prev.map((item) => ({ ...item, isLatest: false })),
    ]);
  };

  const incrementApprovedCarers = () => {
    setTotalCarersCount((c) => c + 1);
  };

  const updatePlacement = (id: string, updater: (prev: PlacementRecord) => PlacementRecord) => {
    setPlacements((prev) => {
      let syncedPlacement: PlacementRecord | null = null;
      const nextPlacements = prev.map((p) => {
        if (p.id !== id) return p;
        const updated = updater(p);
        syncedPlacement = updated;
        return updated;
      });

      if (syncedPlacement) {
        const finalPl: PlacementRecord = syncedPlacement;
        setCareRequests((prevReqs) =>
          prevReqs.map((cr) => {
            if (
              cr.clientFirstName.trim().toLowerCase() === finalPl.clientFirstName.trim().toLowerCase() &&
              cr.clientSurname.trim().toLowerCase() === finalPl.clientSurname.trim().toLowerCase() &&
              cr.location.trim().toLowerCase() === finalPl.location.trim().toLowerCase()
            ) {
              return {
                ...cr,
                agreedClientWeeklyFee: finalPl.agreedClientWeeklyFee,
                paymentStatus: finalPl.paymentStatus || cr.paymentStatus,
                paymentArrangement: finalPl.paymentArrangement || cr.paymentArrangement,
                pets: finalPl.pets,
                smoking: finalPl.smoking,
                verbalAbuseHistory: finalPl.verbalAbuseHistory,
                racialAbuseHistory: finalPl.racialAbuseHistory,
                lifestyleNotes: finalPl.lifestyleNotes,
                lifestyleChangeLog: finalPl.lifestyleChangeLog,
                lastUpdated: 'Just now',
              };
            }
            return cr;
          })
        );
      }

      return nextPlacements;
    });
  };

  const addPlacement = (placement: PlacementRecord) => {
    setPlacements((prev) => [placement, ...prev]);
  };

  const updateCareRequest = (id: string, updater: (prev: CareRequestRecord) => CareRequestRecord) => {
    setCareRequests((prevReqs) => {
      let syncedUpdatedReq: CareRequestRecord | null = null;
      const nextReqs = prevReqs.map((cr) => {
        if (cr.id !== id) return cr;
        const rawNext = updater(cr);
        // Always ensure published `photos` strictly contains ONLY Admin-approved photographs!
        const normalizedItems = getAccommodationPhotoItems(rawNext.accommodation);
        const approvedUrls = normalizedItems
          .filter((item) => item.status === 'approved')
          .map((item) => item.url);
        const hasPending = normalizedItems.some((item) => item.status === 'pending_approval');
        const cleanedNext: CareRequestRecord = {
          ...rawNext,
          accommodation: {
            ...rawNext.accommodation,
            photoItems: normalizedItems,
            photos: approvedUrls,
            // Carer accommodation remains Pending Approval while any client photo awaits Admin review
            adminVerified: hasPending ? false : rawNext.accommodation.adminVerified,
          },
        };
        syncedUpdatedReq = cleanedNext;
        return cleanedNext;
      });

      if (syncedUpdatedReq) {
        const finalReq: CareRequestRecord = syncedUpdatedReq;
        setPlacements((prevPlacements) =>
          prevPlacements.map((pl) => {
            if (
              pl.clientFirstName.trim().toLowerCase() === finalReq.clientFirstName.trim().toLowerCase() &&
              pl.clientSurname.trim().toLowerCase() === finalReq.clientSurname.trim().toLowerCase() &&
              pl.location.trim().toLowerCase() === finalReq.location.trim().toLowerCase()
            ) {
              return {
                ...pl,
                placementType: finalReq.placementType,
                duration: finalReq.duration,
                agreedClientWeeklyFee: finalReq.agreedClientWeeklyFee,
                paymentStatus: finalReq.paymentStatus,
                paymentArrangement: finalReq.paymentArrangement,
                weeklyPayment: finalReq.weeklyPayment,
                foodAllowance: finalReq.foodAllowance,
                mainMedicalConcerns: finalReq.conditions,
                mobilityLevel: finalReq.mobilityLevel,
                mobilityDetails: finalReq.mobilityDetails,
                personalCareNeeds: finalReq.personalCare,
                personalCareNotes: finalReq.personalCareNotes,
                pets: finalReq.pets,
                smoking: finalReq.smoking,
                verbalAbuseHistory: finalReq.verbalAbuseHistory,
                racialAbuseHistory: finalReq.racialAbuseHistory,
                lifestyleNotes: finalReq.lifestyleNotes,
                lifestyleChangeLog: finalReq.lifestyleChangeLog,
                accommodation: { ...finalReq.accommodation },
              };
            }
            return pl;
          })
        );
      }

      return nextReqs;
    });
  };

  function requestIdOrMatch(id: string, list: CareRequestRecord[]) {
    return list.find((item) => item.id === id)?.id || id;
  }

  const confirmCareRequestToPlacement = (
    requestId: string,
    carerName: string,
    carerAvatar: string,
    isEmergencyPlacement: boolean
  ): PlacementRecord | null => {
    const req = careRequests.find((r) => r.id === requestId);
    if (!req) return null;

    // Mark Care Request as Finalised & Accommodation Verified
    setCareRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              stage: 'Finalised',
              assignedCarerName: carerName,
              isEmergency: isEmergencyPlacement,
              accommodation: { ...r.accommodation, adminVerified: true },
            }
          : r
      )
    );

    const existingPlacement = placements.find(
      (p) =>
        p.clientFirstName.trim().toLowerCase() === req.clientFirstName.trim().toLowerCase() &&
        p.clientSurname.trim().toLowerCase() === req.clientSurname.trim().toLowerCase() &&
        p.location.trim().toLowerCase() === req.location.trim().toLowerCase()
    );

    if (existingPlacement) {
      const sameCarer = existingPlacement.primaryCarer.name === carerName;
      const keepSigned = sameCarer ? existingPlacement.agreementsSigned : false;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedExisting: PlacementRecord = {
        ...existingPlacement,
        placementType: req.placementType,
        duration: req.duration,
        agreedClientWeeklyFee: req.agreedClientWeeklyFee,
        paymentStatus: req.paymentStatus,
        paymentArrangement: req.paymentArrangement,
        weeklyPayment: req.weeklyPayment,
        foodAllowance: req.foodAllowance,
        isEmergency: isEmergencyPlacement,
        status: isEmergencyPlacement ? 'Emergency' : existingPlacement.status,
        agreementsSigned: keepSigned,
        agreementsSignedDate: keepSigned ? existingPlacement.agreementsSignedDate : undefined,
        primaryCarer: {
          name: carerName,
          fullName: carerName,
          avatar: carerAvatar,
        },
        mainMedicalConcerns: req.conditions,
        mobilityLevel: req.mobilityLevel,
        mobilityDetails: req.mobilityDetails,
        personalCareNeeds: req.personalCare,
        personalCareNotes: req.personalCareNotes,
        accommodation: {
          ...req.accommodation,
          adminVerified: true,
        },
        accessHistory: [
          {
            id: `log-${Date.now()}-carer`,
            date: '25 Oct 2026',
            time: nowTime,
            title: 'Carer selection confirmed',
            subtitle: keepSigned
              ? `Selected carer: ${carerName} • Accommodation verified`
              : `Selected carer: ${carerName} • Client contact details locked until required agreements are signed`,
            status: keepSigned ? 'completed' : 'restricted',
          },
          ...existingPlacement.accessHistory,
        ],
      };
      setPlacements((prev) =>
        prev.map((p) => (p.id === existingPlacement.id ? updatedExisting : p))
      );
      return updatedExisting;
    }

    const newPlacement: PlacementRecord = {
      id: `pl-${Date.now()}`,
      clientFirstName: req.clientFirstName,
      clientSurname: req.clientSurname,
      age: req.age,
      location: req.location,
      residentialAddress: req.residentialAddress.replace(/,\s*/g, '\n'),
      telephoneNumber: req.telephoneNumber,
      emailAddress: req.emailAddress,
      avatar: req.avatar,
      placementType: req.placementType,
      duration: req.duration,
      isEmergency: isEmergencyPlacement,
      status: isEmergencyPlacement ? 'Emergency' : 'Upcoming',
      weeklyPayment: req.weeklyPayment,
      foodAllowance: req.foodAllowance,
      hasFoodAllowance: req.foodAllowance > 0,
      agreedClientWeeklyFee: req.agreedClientWeeklyFee,
      paymentStatus: req.paymentStatus,
      paymentArrangement: req.paymentArrangement,
      startDate: req.preferredStart,
      startDateISO: req.preferredStartISO,
      endDate: req.placementType === 'Live-in Ongoing Care' ? 'Ongoing' : '18 Nov 2026',
      rotationSchedule:
        req.placementType === 'Live-in Ongoing Care'
          ? '3 weeks on / 1 week respite'
          : 'Short-term respite block',
      nextHandover: '18 Nov 2026',
      primaryCarer: {
        name: carerName,
        fullName: carerName,
        avatar: carerAvatar,
      },
      mainMedicalConcerns: req.conditions,
      mobilityLevel: req.mobilityLevel,
      mobilityDetails: req.mobilityDetails,
      personalCareNeeds: req.personalCare,
      personalCareNotes: req.personalCareNotes,
      medicationSupport: req.medicationSupport,
      pets: req.pets,
      smoking: req.smoking,
      verbalAbuseHistory: req.verbalAbuseHistory,
      racialAbuseHistory: req.racialAbuseHistory,
      lifestyleNotes: req.lifestyleNotes,
      lifestyleChangeLog: req.lifestyleChangeLog,
      interests: req.interests,
      aboutClient: req.aboutClient,
      careGoals: req.careGoals,
      // Inherit Carer Accommodation directly from the Care Request without re-entry!
      accommodation: {
        ...req.accommodation,
        adminVerified: true,
      },
      confirmedDate: '25 Oct 2026',
      agreementsSigned: false,
      manualOverride: 'none',
      emailExceptionAuthorised: false,
      returningCarers: [],
      accessHistory: [
        {
          id: `log-${Date.now()}-1`,
          date: '25 Oct 2026',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Carer selection confirmed',
          subtitle: `Selected carer: ${carerName} • Accommodation verified`,
          status: 'completed',
        },
        {
          id: `log-${Date.now()}-2`,
          date: '25 Oct 2026',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Client contact details restricted (Agreements pending)',
          subtitle: 'Client contact details are only released once required agreements have been signed',
          status: 'restricted',
        },
      ],
      circulatedToCarers: true,
      opportunityBadge: isEmergencyPlacement ? 'Emergency' : 'New',
    };

    setPlacements((prev) => [newPlacement, ...prev]);
    return newPlacement;
  };

  return React.createElement(
    PlatformStoreContext.Provider,
    {
      value: {
        placements,
        careRequests,
        totalCarersCount,
        adminRole,
        setAdminRole,
        carerAvailabilityPrefs,
        setCarerAvailabilityPrefs,
        clientAvatars,
        setClientAvatar,
        clientUploadedPhotos,
        addClientUploadedPhoto,
        declarationStatus,
        setDeclarationStatus,
        declarationDiffs,
        setDeclarationDiffs,
        declarationAuditTrail,
        addDeclarationAuditEntry,
        incrementApprovedCarers,
        updatePlacement,
        addPlacement,
        updateCareRequest,
        confirmCareRequestToPlacement,
      },
    },
    children
  );
};

export function usePlatformStore() {
  const ctx = useContext(PlatformStoreContext);
  if (!ctx) {
    throw new Error('usePlatformStore must be used inside PlatformStoreProvider');
  }
  return ctx;
}

export function useOptionalPlatformStore() {
  return useContext(PlatformStoreContext);
}
