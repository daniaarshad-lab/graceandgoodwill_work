export interface CareRequest {
  id: string;
  clientName: string;
  clientLocation: string;
  careType: string;
  status: 'New' | 'In Review' | 'Matching' | 'Active';
  timeAgo: string;
  avatar: string;
}

export interface UpcomingConfirmation {
  id: string;
  carerName: string;
  carerRole: string;
  stage: string;
  timeDue: string;
  avatar: string;
}

export interface AdminNotification {
  id: string;
  type: 'green' | 'blue' | 'amber';
  title: string;
  description: string;
  timeAgo: string;
}

export interface ReviewQueueItem {
  id: string;
  carerName: string;
  actionRequired: string;
  category: 'Profile Review' | 'Documents' | 'Background Check' | 'Training';
  timeAgo: string;
  avatar: string;
}

export interface MasterLibraryItem {
  id: string;
  title: string;
  description: string;
  count?: number;
  icon: string;
}

export const INITIAL_METRICS = {
  totalCarers: { value: 248, change: 12, isPositive: true },
  clientCareRequests: { value: 36, change: 20, isPositive: true },
  pendingConfirmations: { value: 12, change: 8, isPositive: true },
  activePlacements: { value: 84, change: 6, isPositive: true },
};

export const RECENT_CARE_REQUESTS: CareRequest[] = [
  {
    id: 'cr-1',
    clientName: 'Margaret Lewis',
    clientLocation: 'Chester',
    careType: 'Live-in care',
    status: 'New',
    timeAgo: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cr-2',
    clientName: 'David Thompson',
    clientLocation: 'York',
    careType: 'Respite care',
    status: 'In Review',
    timeAgo: '4h ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cr-3',
    clientName: 'Eleanor Briggs',
    clientLocation: 'Manchester',
    careType: 'Live-in care',
    status: 'Matching',
    timeAgo: '1d ago',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cr-4',
    clientName: 'James Parker',
    clientLocation: 'Surrey',
    careType: 'Night care',
    status: 'New',
    timeAgo: '1d ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cr-5',
    clientName: 'Patricia Evans',
    clientLocation: 'Leeds',
    careType: 'Companionship',
    status: 'In Review',
    timeAgo: '2d ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const UPCOMING_CONFIRMATIONS: UpcomingConfirmation[] = [
  {
    id: 'uc-1',
    carerName: 'Sophie Williams',
    carerRole: 'Live-in carer',
    stage: 'Awaiting client',
    timeDue: 'Today',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'uc-2',
    carerName: 'Daniel Carter',
    carerRole: 'Respite carer',
    stage: 'Awaiting carer',
    timeDue: 'Today',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'uc-3',
    carerName: 'Amelia Khan',
    carerRole: 'Live-in carer',
    stage: 'Documents',
    timeDue: 'Tomorrow',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'uc-4',
    carerName: 'Thomas Green',
    carerRole: 'Companionship',
    stage: 'Reference check',
    timeDue: 'Tomorrow',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'uc-5',
    carerName: 'Olivia Brown',
    carerRole: 'Night care',
    stage: 'DBS check',
    timeDue: '18 Jan',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
];

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'n-1',
    type: 'green',
    title: 'New care request received',
    description: 'Margaret Lewis - Live-in care (Chester)',
    timeAgo: '2h ago',
  },
  {
    id: 'n-2',
    type: 'blue',
    title: 'Carer profile updated',
    description: 'Sophie Williams',
    timeAgo: '3h ago',
  },
  {
    id: 'n-3',
    type: 'amber',
    title: 'Placement confirmation required',
    description: 'David Thompson',
    timeAgo: '4h ago',
  },
  {
    id: 'n-4',
    type: 'blue',
    title: 'New document uploaded',
    description: 'Eleanor Briggs - Medical information',
    timeAgo: '6h ago',
  },
  {
    id: 'n-5',
    type: 'blue',
    title: 'Reference check completed',
    description: 'Thomas Green',
    timeAgo: '1d ago',
  },
  {
    id: 'n-6',
    type: 'blue',
    title: 'New message from client',
    description: 'Patricia Evans',
    timeAgo: '1d ago',
  },
];

export const MASTER_LIBRARIES_LIST: MasterLibraryItem[] = [
  {
    id: 'lib-requirements',
    title: 'Requirements Library',
    description: 'Care needs, conditions and support requirements',
    icon: 'document',
  },
  {
    id: 'lib-home',
    title: 'Home Environment Library',
    description: 'Property types, facilities and accessibility',
    icon: 'home',
  },
  {
    id: 'lib-interests',
    title: 'Interests & Hobbies Library',
    description: 'Activities, interests and lifestyle preferences',
    icon: 'heart',
  },
  {
    id: 'lib-languages',
    title: 'Languages Library',
    description: 'Languages spoken by carers and clients',
    icon: 'globe',
  },
  {
    id: 'lib-medication',
    title: 'Medication Library',
    description: 'Medications, dosages and administration notes',
    icon: 'pill',
  },
];

export const REVIEW_QUEUE_ITEMS: ReviewQueueItem[] = [
  {
    id: 'rq-1',
    carerName: 'Sophie Williams',
    actionRequired: 'New carer profile',
    category: 'Profile Review',
    timeAgo: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rq-2',
    carerName: 'Daniel Carter',
    actionRequired: 'Updated documents',
    category: 'Documents',
    timeAgo: '5h ago',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rq-3',
    carerName: 'Olivia Brown',
    actionRequired: 'Reference check',
    category: 'Background Check',
    timeAgo: '1d ago',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rq-4',
    carerName: 'Matthew Lewis',
    actionRequired: 'Training certificate',
    category: 'Training',
    timeAgo: '1d ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rq-5',
    carerName: 'Chloe Adams',
    actionRequired: 'New carer profile',
    category: 'Profile Review',
    timeAgo: '2d ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];
