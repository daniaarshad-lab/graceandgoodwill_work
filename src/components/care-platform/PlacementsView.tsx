"use client";
import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  FileText,
  Edit2,
  Check,
  X,
  Info,
  AlertTriangle,
  Heart,
  PawPrint,
  Cigarette,
  MessageSquare,
  Utensils,
  Coins,
  RotateCcw,
  Key,
  ShieldOff,
  LayoutGrid,
  List,
  Eye,
  BookOpen,
} from 'lucide-react';
import {
  AvailabilityCategory,
  deriveCareNeedsFromAccount,
  deriveMainCareNeeds,
  evaluateClientInfoAccess,
  getAccommodationApprovalStatus,
  getApprovedAccommodationPhotos,
  getFinancialVisibility,
  hasPendingAccommodationPhotos,
  PlacementRecord,
  PlacementStatus,
  usePlatformStore,
} from '@/data/care-platform/platformStore';

interface PlacementsViewProps {
  initialMode?: 'admin-list' | 'carer-available' | 'client-portal';
  initialSelectedPlacementId?: string | null;
}

export const PlacementsView: React.FC<PlacementsViewProps> = ({
  initialMode = 'admin-list',
  initialSelectedPlacementId = null,
}) => {
  const { placements, careRequests, updatePlacement, addPlacement } = usePlatformStore();

  const [viewMode, setViewMode] = useState<
    'admin-list' | 'admin-detail' | 'carer-available' | 'client-portal'
  >(initialSelectedPlacementId ? 'admin-detail' : initialMode);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(
    initialSelectedPlacementId || placements[0]?.id || 'pl-doris'
  );

  // Admin Placements List Filters
  const [activeFilterTab, setActiveFilterTab] = useState<
    'all' | 'emergency' | 'active' | 'upcoming' | 'on-hold' | 'completed' | 'cancelled'
  >('all');
  const [displayLayout, setDisplayLayout] = useState<'cards' | 'roster'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'start' | 'rate' | 'name'>('start');

  // Admin Placement Detail Sub-tabs
  const [detailTab, setDetailTab] = useState<
    | 'overview'
    | 'client-info'
    | 'payments'
    | 'carer-details'
    | 'dates-rotations'
    | 'agreements'
    | 'access-controls'
    | 'notes'
  >('client-info');

  // Return date input for Admin Access Controls
  const [returnDateInput, setReturnDateInput] = useState('2026-11-08');
  const [editingPlacementLifestyle, setEditingPlacementLifestyle] = useState(false);

  // Carer Available Placements Portal Preview State
  const circulatedPlacements = placements.filter((p) => p.circulatedToCarers);
  const [selectedAvailableId, setSelectedAvailableId] = useState<string>(
    circulatedPlacements[0]?.id || 'pl-doris'
  );
  const [carerDetailSubTab, setCarerDetailSubTab] = useState<
    'overview' | 'offer' | 'medical' | 'accommodation' | 'lifestyle' | 'other' | 'history'
  >('overview');
  const [carerSearchQuery, setCarerSearchQuery] = useState('');
  const [carerTypeFilter, setCarerTypeFilter] = useState<'all' | AvailabilityCategory>('all');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);

  // New Placement Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedClientAccountId, setSelectedClientAccountId] = useState<string>('');
  const [newClientFirst, setNewClientFirst] = useState('');
  const [newClientSurname, setNewClientSurname] = useState('');
  const [newClientAge, setNewClientAge] = useState('82');
  const [newClientLocation, setNewClientLocation] = useState('');
  const [newPlacementType, setNewPlacementType] =
    useState<AvailabilityCategory>('Live-in Ongoing Care');
  const [newIsEmergency, setNewIsEmergency] = useState(false);
  const [newAgreedClientFee, setNewAgreedClientFee] = useState('1350');
  const [newWeeklyRate, setNewWeeklyRate] = useState('900');
  const [newFoodAllowance, setNewFoodAllowance] = useState('40');
  const [newStartDateISO, setNewStartDateISO] = useState('2026-11-05');
  const [newCarerName, setNewCarerName] = useState('Anita K.');

  // Toast Feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3400);
  };

  // Sparkline SVG helper matching illustration
  const renderSparkline = () => (
    <svg className="w-20 h-6 shrink-0" viewBox="0 0 80 24" fill="none">
      <path
        d="M2 18 C 18 18, 26 11, 42 14 C 56 17, 64 6, 78 5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  // Selected placement for detail view
  const currentPlacement =
    placements.find((p) => p.id === selectedPlacementId) || placements[0];

  // Dynamic KPI Calculations (connected to platform state)
  const activeCount =
    78 +
    placements.filter(
      (p) => p.status === 'Active' || p.status === 'In Progress' || p.status === 'Emergency'
    ).length;
  const emergencyCount = placements.filter((p) => p.isEmergency || p.status === 'Emergency').length;
  const upcomingHandoversCount = 12;
  const startingSoonCount =
    6 + placements.filter((p) => p.status === 'Upcoming' || p.status === 'Confirmed').length;
  const completedCount = 55 + placements.filter((p) => p.status === 'Completed').length;

  // Filtered placements for Admin List
  const filteredPlacements = placements
    .filter((p) => {
      if (activeFilterTab === 'emergency') return p.isEmergency || p.status === 'Emergency';
      if (activeFilterTab === 'active')
        return p.status === 'Active' || p.status === 'In Progress';
      if (activeFilterTab === 'upcoming')
        return p.status === 'Upcoming' || p.status === 'Confirmed';
      if (activeFilterTab === 'on-hold') return p.status === 'On Hold';
      if (activeFilterTab === 'completed') return p.status === 'Completed';
      if (activeFilterTab === 'cancelled') return p.status === 'Cancelled';
      return true;
    })
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const careNeeds = deriveMainCareNeeds(p, careRequests);
      return (
        p.clientFirstName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.primaryCarer.name.toLowerCase().includes(q) ||
        p.placementType.toLowerCase().includes(q) ||
        careNeeds.some((need) => need.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rate') return b.weeklyPayment - a.weeklyPayment;
      if (sortBy === 'name') return a.clientFirstName.localeCompare(b.clientFirstName);
      return a.startDateISO.localeCompare(b.startDateISO);
    });

  const getStatusStyle = (status: PlacementStatus, isEmergency?: boolean) => {
    if (isEmergency || status === 'Emergency') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Upcoming':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  // Admin Access Control Handlers
  const handleManualGrant = (placementId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatePlacement(placementId, (prev) => ({
      ...prev,
      manualOverride: 'granted',
      accessHistory: [
        {
          id: `log-${Date.now()}`,
          date: '25 Oct 2026',
          time: nowTime,
          title: 'Manual Override: Client information access granted',
          subtitle: `Authorised by Jessica Smith (Admin) for ${prev.primaryCarer.name}`,
          status: 'active',
        },
        ...prev.accessHistory,
      ],
    }));
    showToast('Client full name, address & phone manually released to assigned carer');
  };

  const handleManualRevoke = (placementId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatePlacement(placementId, (prev) => ({
      ...prev,
      manualOverride: 'revoked',
      emailExceptionAuthorised: false,
      accessHistory: [
        {
          id: `log-${Date.now()}`,
          date: '25 Oct 2026',
          time: nowTime,
          title: 'Manual Override: Client information access revoked',
          subtitle: 'Revoked immediately by Jessica Smith (Admin)',
          status: 'restricted',
        },
        ...prev.accessHistory,
      ],
    }));
    showToast('Client identifying and contact details immediately revoked');
  };

  const handleToggleEmailException = (placementId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatePlacement(placementId, (prev) => {
      const nextState = !prev.emailExceptionAuthorised;
      return {
        ...prev,
        emailExceptionAuthorised: nextState,
        accessHistory: [
          {
            id: `log-${Date.now()}`,
            date: '25 Oct 2026',
            time: nowTime,
            title: nextState
              ? 'Exceptional Email Access Authorised'
              : 'Exceptional Email Access Revoked',
            subtitle: nextState
              ? `Client email made visible to ${prev.primaryCarer.name} by Admin`
              : 'Client email hidden (default rule restored)',
            status: nextState ? 'active' : 'restricted',
          },
          ...prev.accessHistory,
        ],
      };
    });
    showToast('Updated exceptional client email visibility');
  };

  const handleSetReturnDate = (placementId: string) => {
    if (!returnDateInput) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const diffDays = Math.ceil(
      (new Date(returnDateInput + 'T09:00:00Z').getTime() -
        new Date('2026-10-25T09:00:00Z').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    updatePlacement(placementId, (prev) => ({
      ...prev,
      manualOverride: 'none',
      confirmedReturnDateISO: returnDateInput,
      accessHistory: [
        {
          id: `log-${Date.now()}`,
          date: '25 Oct 2026',
          time: nowTime,
          title: `Confirmed Return Date set (${returnDateInput})`,
          subtitle:
            diffDays <= 7
              ? 'Returning within 7 days — access available immediately'
              : 'Returning in >7 days — automatic release scheduled 7 days before return',
          status: diffDays <= 7 ? 'active' : 'scheduled',
        },
        ...prev.accessHistory,
      ],
    }));
    showToast(
      diffDays <= 7
        ? 'Confirmed return is within 7 days — carer access active immediately'
        : 'Confirmed return scheduled — access will auto-release 7 days before return'
    );
  };

  const handleStatusChange = (placementId: string, nextStatus: PlacementStatus) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatePlacement(placementId, (prev) => {
      const ended = nextStatus === 'Completed' || nextStatus === 'Cancelled';
      return {
        ...prev,
        status: nextStatus,
        isEmergency: nextStatus === 'Emergency' ? true : prev.isEmergency,
        manualOverride: ended ? 'none' : prev.manualOverride,
        emailExceptionAuthorised: ended ? false : prev.emailExceptionAuthorised,
        confirmedReturnDateISO: ended ? undefined : prev.confirmedReturnDateISO,
        accessHistory: [
          {
            id: `log-${Date.now()}`,
            date: '25 Oct 2026',
            time: nowTime,
            title: ended
              ? `Placement ${nextStatus} — Client contact info automatically revoked`
              : `Placement status updated to ${nextStatus}`,
            subtitle: ended
              ? 'Surname, address, phone & email restricted; historical summary retained'
              : 'by Jessica Smith (Admin)',
            status: ended ? 'restricted' : 'completed',
          },
          ...prev.accessHistory,
        ],
      };
    });
    showToast(`Placement status updated to ${nextStatus}`);
  };

  const handleSelectClientAccountInModal = (accountId: string) => {
    setSelectedClientAccountId(accountId);
    const linked = careRequests.find((c) => c.id === accountId);
    if (!linked) return;
    setNewClientFirst(linked.clientFirstName);
    setNewClientSurname(linked.clientSurname);
    setNewClientAge(String(linked.age));
    setNewClientLocation(linked.location);
    setNewPlacementType(linked.placementType);
    setNewAgreedClientFee(String(linked.agreedClientWeeklyFee));
    setNewWeeklyRate(String(linked.weeklyPayment));
    setNewFoodAllowance(String(linked.foodAllowance));
    setNewStartDateISO(linked.preferredStartISO);
    setNewIsEmergency(linked.isEmergency);
  };

  const handleCreateNewPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientFirst.trim() || !newClientLocation.trim()) return;
    const linkedAccount = careRequests.find(
      (c) =>
        c.id === selectedClientAccountId ||
        (c.clientFirstName.trim().toLowerCase() === newClientFirst.trim().toLowerCase() &&
          c.clientSurname.trim().toLowerCase() === newClientSurname.trim().toLowerCase())
    );
    const formattedStart = new Date(newStartDateISO + 'T09:00:00Z').toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const created: PlacementRecord = {
      id: `pl-${Date.now()}`,
      clientFirstName: newClientFirst.trim(),
      clientSurname: newClientSurname.trim() || 'Client',
      age: Number(newClientAge) || linkedAccount?.age || 82,
      location: newClientLocation.trim(),
      residentialAddress: linkedAccount
        ? linkedAccount.residentialAddress.replace(/,\s*/g, '\n')
        : `10 High Street\n${newClientLocation.trim()}`,
      telephoneNumber: linkedAccount?.telephoneNumber || '07700 900456',
      emailAddress: linkedAccount?.emailAddress || 'client.private@example.co.uk',
      avatar:
        linkedAccount?.avatar ||
        'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=240&auto=format&fit=crop&q=80',
      placementType: newPlacementType,
      duration:
        linkedAccount?.duration ||
        (newPlacementType === 'Live-in Ongoing Care' ? 'Long-term' : '14 days respite'),
      isEmergency: newIsEmergency,
      status: newIsEmergency ? 'Emergency' : 'Confirmed',
      agreedClientWeeklyFee:
        Number(newAgreedClientFee) || linkedAccount?.agreedClientWeeklyFee || 1350,
      weeklyPayment: Number(newWeeklyRate) || 900,
      foodAllowance: Number(newFoodAllowance) || linkedAccount?.foodAllowance || 40,
      hasFoodAllowance: true,
      startDate: formattedStart,
      startDateISO: newStartDateISO,
      endDate: newPlacementType === 'Live-in Ongoing Care' ? 'Ongoing' : '19 Nov 2026',
      rotationSchedule:
        newPlacementType === 'Live-in Ongoing Care'
          ? '3 weeks on / 1 week respite'
          : 'Single respite block',
      nextHandover: '25 Nov 2026',
      primaryCarer: {
        name: newCarerName,
        fullName: newCarerName,
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      },
      mainMedicalConcerns: linkedAccount?.conditions?.length
        ? linkedAccount.conditions
        : ['Dementia', 'Arthritis'],
      mobilityLevel: linkedAccount?.mobilityLevel || 'Requires support',
      mobilityDetails: linkedAccount?.mobilityDetails || 'Uses walking frame indoors.',
      personalCareNeeds: linkedAccount?.personalCare?.length
        ? linkedAccount.personalCare
        : ['Washing / bathing', 'Dressing'],
      personalCareNotes:
        linkedAccount?.personalCareNotes || 'Daily morning and evening personal care.',
      medicationSupport: linkedAccount?.medicationSupport || 'Twice daily prompting.',
      pets: linkedAccount?.pets || 'No pets',
      smoking: linkedAccount?.smoking || 'No',
      verbalAbuseHistory: linkedAccount?.verbalAbuseHistory || 'No',
      racialAbuseHistory: linkedAccount?.racialAbuseHistory || 'No',
      interests: linkedAccount?.interests?.length ? linkedAccount.interests : ['Reading', 'Gardening'],
      aboutClient:
        linkedAccount?.aboutClient ||
        `${newClientFirst.trim()} seeks a dedicated live-in carer in ${newClientLocation.trim()}.`,
      careGoals: linkedAccount?.careGoals || 'Safe, comfortable live-in care at home.',
      accommodation: linkedAccount
        ? { ...linkedAccount.accommodation, adminVerified: true }
        : {
            privateBedroomConfirmed: true,
            bedroomType: 'Private bedroom (sole occupancy)',
            bathroomType: 'Private bathroom',
            showerType: 'Private',
            householdNotes:
              'Private bedroom and fully equipped bathroom with toilet, washbasin and shower.',
            photos: [],
            adminVerified: true,
          },
      confirmedDate: '25 Oct 2026',
      agreementsSigned: false,
      manualOverride: 'none',
      emailExceptionAuthorised: false,
      returningCarers: [],
      accessHistory: [
        {
          id: `log-${Date.now()}`,
          date: '25 Oct 2026',
          time: 'Just now',
          title: newIsEmergency ? 'Emergency placement created' : 'Placement created & confirmed',
          subtitle: 'by Jessica Smith (Admin)',
          status: 'completed',
        },
      ],
      circulatedToCarers: true,
      opportunityBadge: newIsEmergency ? 'Emergency' : 'New',
    };

    addPlacement(created);
    setShowNewModal(false);
    setSelectedClientAccountId('');
    setNewClientFirst('');
    setNewClientSurname('');
    setNewClientLocation('');
    if (newIsEmergency) {
      setActiveFilterTab('emergency');
    }
    showToast(`Created ${newIsEmergency ? 'Emergency ' : ''}placement for ${created.clientFirstName}`);
  };

  // ============================================================================
  // VIEW 4: CLIENT PORTAL — PLACEMENT, PAYMENT & CLIENT DOCUMENTS PREVIEW
  // Strictly enforces getFinancialVisibility('client'):
  // - Shows ONLY Agreed Grace & Goodwill Fee (agreedClientWeeklyFee)
  // - NEVER displays Weekly Carer Fee or Food Allowance anywhere
  // ============================================================================
  if (viewMode === 'client-portal') {
    const clientFinancePolicy = getFinancialVisibility('client');
    const clientPlacement =
      placements.find((p) => p.id === selectedPlacementId) || placements[0];

    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative bg-[#FAF7F2] min-h-screen">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-[#C5A059]/40">
            <Check className="w-4 h-4 text-[#D4AF7A]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8C6D2B] font-semibold mb-1">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Client Portal View &bull; Grace &amp; Goodwill Agreed Client Fee Only</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
              My Live-in Care Placement &amp; Agreed Fees
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Client-facing summary displaying your care schedule, assigned carers, agreed Grace &amp; Goodwill fee, and service agreement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <select
              value={clientPlacement?.id || ''}
              onChange={(e) => setSelectedPlacementId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#DFD5C2] bg-white text-xs font-semibold text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
            >
              {placements.map((p) => (
                <option key={p.id} value={p.id}>
                  Client Account: {p.clientFirstName} {p.clientSurname} ({p.location})
                </option>
              ))}
            </select>

            <button
              onClick={() => setViewMode('admin-list')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Back to Admin Placements</span>
            </button>
          </div>
        </div>

        {clientPlacement && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Cols: Placement Overview + Assigned Carers (No carer pay shown) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={clientPlacement.avatar}
                      alt={clientPlacement.clientFirstName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E8DFD5]"
                    />
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#0A1629]">
                        {clientPlacement.clientFirstName} {clientPlacement.clientSurname}
                      </h2>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        {clientPlacement.placementType} &middot; {clientPlacement.location}
                      </div>
                      <div className="text-xs font-medium text-[#334155] mt-1 tabular-nums">
                        Start: {clientPlacement.startDate} -{' '}
                        {clientPlacement.endDate === 'Ongoing'
                          ? 'Ongoing'
                          : `End: ${clientPlacement.endDate}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    {clientPlacement.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[11px] text-[#64748B]">Main Care Needs</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">
                      {deriveMainCareNeeds(clientPlacement, careRequests, 4).join(', ')}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[11px] text-[#64748B]">Care Continuity &amp; Handover</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">
                      {clientPlacement.rotationSchedule} &middot; Next: {clientPlacement.nextHandover}
                    </div>
                  </div>
                </div>

                {/* Assigned Carers (Zero Carer Remuneration Shown) */}
                <div className="pt-2 border-t border-[#F2ECE0]">
                  <div className="text-xs font-bold text-[#0A1629] mb-2.5">
                    Assigned Live-in Care Team
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center gap-3">
                      <img
                        src={clientPlacement.primaryCarer.avatar}
                        alt={clientPlacement.primaryCarer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[11px] text-[#64748B]">Primary Live-in Carer</div>
                        <div className="font-bold text-[#0A1629]">
                          {clientPlacement.primaryCarer.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          DBS &amp; Reference Verified
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center gap-3">
                      {clientPlacement.reliefCarer ? (
                        <>
                          <img
                            src={clientPlacement.reliefCarer.avatar}
                            alt={clientPlacement.reliefCarer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-[11px] text-[#64748B]">Relief Carer</div>
                            <div className="font-bold text-[#0A1629]">
                              {clientPlacement.reliefCarer.name}
                            </div>
                            <div className="text-[11px] text-[#64748B]">
                              Scheduled relief cover
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-[#64748B]">
                          Single respite arrangement &mdash; no relief handover required.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client-Facing Automatically Generated Service Agreement */}
              {clientFinancePolicy.canViewAgreedClientFee && (
                <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#F2ECE0] pb-3">
                    <div>
                      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8C6D2B]">
                        Automatically Generated Client Document
                      </div>
                      <h3 className="font-bold text-sm text-[#0A1629] mt-0.5">
                        Grace &amp; Goodwill Client Care Service Agreement &amp; Fee Schedule
                      </h3>
                    </div>
                    <FileText className="w-4 h-4 text-[#C5A059]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Client</span>
                      <span className="font-bold text-[#0A1629]">
                        {clientPlacement.clientFirstName} {clientPlacement.clientSurname}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Care Service</span>
                      <span className="font-semibold text-[#0A1629]">
                        {clientPlacement.placementType} ({clientPlacement.duration})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Placement Dates</span>
                      <span className="font-semibold text-[#0A1629] tabular-nums">
                        Start: {clientPlacement.startDate} -{' '}
                        {clientPlacement.endDate === 'Ongoing'
                          ? 'Ongoing'
                          : `End: ${clientPlacement.endDate}`}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-[#E6DEC8] flex justify-between items-baseline">
                      <span className="font-semibold text-[#0A1629]">
                        Agreed Weekly Care Fee Payable to Grace &amp; Goodwill
                      </span>
                      <span className="text-base font-bold text-[#0A1629] tabular-nums">
                        &pound;{clientPlacement.agreedClientWeeklyFee.toLocaleString()} / week
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Client Payment Summary */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-sm sm:text-base text-[#0A1629]">
                  Agreed Grace &amp; Goodwill Payment Summary
                </h3>
              </div>

              {clientFinancePolicy.canViewAgreedClientFee && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] space-y-1.5">
                  <div className="text-[11px] text-[#64748B]">
                    Weekly Fee Agreed with Grace &amp; Goodwill
                  </div>
                  <div className="text-2xl font-bold text-[#0A1629] tabular-nums">
                    &pound;{clientPlacement.agreedClientWeeklyFee.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-[#64748B]">per week</span>
                  </div>
                  <p className="text-[11px] text-[#5C5549] pt-1 leading-relaxed">
                    Invoiced directly by Grace &amp; Goodwill in accordance with your signed Client Care Service Agreement.
                  </p>
                </div>
              )}

              <div className="divide-y divide-[#F2ECE0] border border-[#EFE8DC] rounded-xl overflow-hidden">
                <div className="p-3.5 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0A1629]">Current Weekly Statement</div>
                    <div className="text-[11px] text-[#64748B]">Grace &amp; Goodwill Care Services</div>
                  </div>
                  <span className="font-bold text-[#0A1629] tabular-nums">
                    &pound;{clientPlacement.agreedClientWeeklyFee.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 bg-[#FDFBF7] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0A1629]">Agreement Status</div>
                    <div className="text-[11px] text-[#64748B]">
                      {clientPlacement.agreementsSigned
                        ? `Signed (${clientPlacement.agreementsSignedDate || 'Confirmed'})`
                        : 'Awaiting signature'}
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 3: CARER PORTAL — AVAILABLE PLACEMENTS & COMPLETED HISTORY (image_3c5ca530.png)
  // Strictly enforces getFinancialVisibility('carer'):
  // - Weekly carer fee & food allowance are ALWAYS visible to carers
  // - Client's Grace & Goodwill fee is never shown to carers
  // ============================================================================
  if (viewMode === 'carer-available') {
    const carerFinancePolicy = getFinancialVisibility('carer');
    const filteredAvailable = circulatedPlacements.filter((p) => {
      const matchesType = carerTypeFilter === 'all' || p.placementType === carerTypeFilter;
      if (!carerSearchQuery.trim()) return matchesType;
      const q = carerSearchQuery.toLowerCase();
      const careNeeds = deriveMainCareNeeds(p, careRequests);
      return (
        matchesType &&
        (p.clientFirstName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          careNeeds.some((m) => m.toLowerCase().includes(q)) ||
          p.mainMedicalConcerns.some((m) => m.toLowerCase().includes(q)))
      );
    });

    const activeOpportunity =
      filteredAvailable.find((p) => p.id === selectedAvailableId) ||
      filteredAvailable[0] ||
      circulatedPlacements[0];

    const currentOppIndex = filteredAvailable.findIndex((p) => p.id === activeOpportunity?.id);

    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative bg-[#FAF7F2] min-h-screen">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-[#C5A059]/40">
            <Check className="w-4 h-4 text-[#D4AF7A]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Bar with Return to Admin Placements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8C6D2B] font-semibold mb-1">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Approved Carer View &bull; Client Identity &amp; Contact Protected</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
              Available Placements
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Browse current live-in care opportunities and apply for placements that match your skills and availability.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start">
            <button
              onClick={() =>
                setCarerDetailSubTab(
                  carerDetailSubTab === 'history' ? 'overview' : 'history'
                )
              }
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                carerDetailSubTab === 'history'
                  ? 'bg-[#0A1629] text-[#EBD8B2] border-[#0A1629]'
                  : 'bg-white text-[#0A1629] border-[#E0D5C1] hover:bg-[#FAF5EE]'
              }`}
            >
              {carerDetailSubTab === 'history'
                ? 'Back to Opportunity Details'
                : 'My Placement History'}
            </button>

            <button
              onClick={() => setViewMode('admin-list')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Admin Placements Roster</span>
            </button>
          </div>
        </div>

        {/* Split Layout matching image_3c5ca530.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Circulated Opportunities List */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE3D4] p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={carerSearchQuery}
                  onChange={(e) => setCarerSearchQuery(e.target.value)}
                  placeholder="Search by location, condition..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E2DACB] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:bg-white focus:border-[#C5A059]"
                />
              </div>
              <select
                value={carerTypeFilter}
                onChange={(e) => setCarerTypeFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-[#E2DACB] bg-white text-xs font-medium text-[#0A1629] focus:outline-none"
              >
                <option value="all">All Live-in</option>
                <option value="Live-in Ongoing Care">Ongoing</option>
                <option value="Live-in Respite Care">Respite</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-[760px] overflow-y-auto pr-0.5">
              {filteredAvailable.map((opp) => {
                const isSelected = opp.id === activeOpportunity?.id;
                return (
                  <div
                    key={opp.id}
                    onClick={() => {
                      setSelectedAvailableId(opp.id);
                      if (carerDetailSubTab === 'history') setCarerDetailSubTab('overview');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#FDFBF7] border-[#C5A059] ring-1 ring-[#C5A059]/30 shadow-xs'
                        : 'bg-white border-[#EFE8DC] hover:border-[#D4AF7A]/60'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={opp.avatar}
                        alt={opp.clientFirstName}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E8DFD5]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {/* Strictly First Name Only */}
                          <h3 className="font-bold text-sm text-[#0A1629]">
                            {opp.clientFirstName}
                          </h3>
                          {opp.opportunityBadge && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                opp.opportunityBadge === 'Urgent' ||
                                opp.opportunityBadge === 'Emergency'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-[#FEF3D6] text-[#855B14] border border-[#F6E1B2]'
                              }`}
                            >
                              {opp.opportunityBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">
                          Age {opp.age} &bull; {opp.location}
                        </div>
                        <div className="text-xs font-semibold text-[#0A1629] mt-1">
                          {opp.placementType}
                        </div>
                        {carerFinancePolicy.canViewCarerFeeAndAllowance && (
                          <div className="text-xs font-bold text-[#0A1629] tabular-nums mt-0.5">
                            &pound;{opp.weeklyPayment}/wk &middot; Food allowance: &pound;
                            {opp.foodAllowance}/wk
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-1 tabular-nums">
                          <Calendar className="w-3 h-3 text-[#C5A059] shrink-0" />
                          <span>
                            Start: {opp.startDate} -{' '}
                            {opp.endDate === 'Ongoing' ? 'Ongoing' : `End: ${opp.endDate}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Prominent Available Live-in Placement Summary + Comprehensive Details */}
          {activeOpportunity && (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-5">
              {/* Top Nav Row */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F3EDE2]">
                <span className="font-semibold tracking-wider text-[#8C6D2B] uppercase text-[11px]">
                  Available Live-in Placement
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentOppIndex <= 0}
                    onClick={() => {
                      if (currentOppIndex > 0) {
                        setSelectedAvailableId(filteredAvailable[currentOppIndex - 1].id);
                      }
                    }}
                    className="px-3 py-1 rounded-lg border border-[#E2DACB] text-[#475569] hover:text-[#0A1629] disabled:opacity-40 cursor-pointer"
                  >
                    &lsaquo; Previous
                  </button>
                  <button
                    disabled={currentOppIndex >= filteredAvailable.length - 1}
                    onClick={() => {
                      if (currentOppIndex < filteredAvailable.length - 1) {
                        setSelectedAvailableId(filteredAvailable[currentOppIndex + 1].id);
                      }
                    }}
                    className="px-3 py-1 rounded-lg border border-[#E2DACB] text-[#475569] hover:text-[#0A1629] disabled:opacity-40 cursor-pointer"
                  >
                    Next &rsaquo;
                  </button>
                </div>
              </div>

              {/* Client First Name, Age, General Location + Apply / Shortlist CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={activeOpportunity.avatar}
                    alt={activeOpportunity.clientFirstName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#EAE3D4]"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-2xl font-bold text-[#0A1629]">
                        {activeOpportunity.clientFirstName}
                      </h2>
                      {activeOpportunity.opportunityBadge && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FEF3D6] text-[#855B14] text-xs font-semibold border border-[#F6E1B2]">
                          {activeOpportunity.opportunityBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#475569] mt-0.5">
                      Age {activeOpportunity.age} years old
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#64748B] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{activeOpportunity.location}</span>
                      <span className="text-[11px] text-[#94A3B8] ml-1">
                        (Surname, street address &amp; contact details protected)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:w-60 shrink-0">
                  <button
                    onClick={() => {
                      if (!appliedIds.includes(activeOpportunity.id)) {
                        setAppliedIds([...appliedIds, activeOpportunity.id]);
                      }
                      showToast(
                        `Placement application submitted for ${activeOpportunity.clientFirstName}`
                      );
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#C59B47] hover:bg-[#B38936] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>
                      {appliedIds.includes(activeOpportunity.id)
                        ? 'Application Submitted ✓'
                        : 'Apply for this placement →'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShortlistedIds((prev) =>
                        prev.includes(activeOpportunity.id)
                          ? prev.filter((i) => i !== activeOpportunity.id)
                          : [...prev, activeOpportunity.id]
                      );
                      showToast('Updated placement shortlist');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF5EE] text-[#0A1629] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        shortlistedIds.includes(activeOpportunity.id)
                          ? 'fill-[#C59B47] text-[#C59B47]'
                          : 'text-[#C5A059]'
                      }`}
                    />
                    <span>
                      {shortlistedIds.includes(activeOpportunity.id)
                        ? 'Saved to shortlist ✓'
                        : 'Save to shortlist'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3-Column Financial & Placement Strip matching image_3c5ca530.png — Always Visible to Carers */}
              {carerFinancePolicy.canViewCarerFeeAndAllowance && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3.5 px-4 rounded-xl bg-[#FAF7F2] border border-[#EDE5D7]">
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-[#C5A059] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-[#64748B]">Placement Type</div>
                      <div className="text-xs sm:text-sm font-bold text-[#0A1629]">
                        {activeOpportunity.placementType}
                      </div>
                      <div className="text-[11px] text-[#64748B]">({activeOpportunity.duration})</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:border-l sm:border-[#E6DEC8] sm:pl-4">
                    <Coins className="w-5 h-5 text-[#C5A059] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-[#64748B]">Weekly Carer Fee</div>
                      <div className="text-base font-bold text-[#0A1629] tabular-nums">
                        &pound;{activeOpportunity.weeklyPayment}
                      </div>
                      <div className="text-[11px] text-[#64748B]">per week</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:border-l sm:border-[#E6DEC8] sm:pl-4">
                    <Utensils className="w-5 h-5 text-[#C5A059] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-[#64748B]">Weekly Food Allowance</div>
                      <div className="text-base font-bold text-[#0A1629] tabular-nums">
                        &pound;{activeOpportunity.foodAllowance} per week
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {activeOpportunity.hasFoodAllowance
                          ? 'Paid alongside weekly carer fee'
                          : 'Included in household meals'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 10-Tile Quick Assessment Summary Grid (Section 5 & image_3c5ca530.png) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Heart className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Main Care Needs</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {deriveMainCareNeeds(activeOpportunity, careRequests).join(', ')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <PawPrint className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Pets</div>
                  <div className="text-xs font-bold text-[#0A1629]">{activeOpportunity.pets}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Cigarette className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Smoking</div>
                  <div className="text-xs font-bold text-[#0A1629]">{activeOpportunity.smoking}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">History of Verbal Abuse</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.verbalAbuseHistory}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">
                    History of Racially Abusive Behaviour
                  </div>
                  <div className="text-[11px] font-bold text-[#0A1629] leading-snug">
                    {activeOpportunity.racialAbuseHistory}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Preferred Start Date</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.startDate}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Duration</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.duration}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Mobility</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.mobilityLevel}
                  </div>
                  <div className="text-[10px] text-[#64748B] line-clamp-1">
                    {activeOpportunity.mobilityDetails}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <Home className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Accommodation</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.accommodation.bedroomType}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    {activeOpportunity.accommodation.bathroomType}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <div className="text-[10.5px] text-[#64748B]">Interests &amp; Hobbies</div>
                  <div className="text-xs font-bold text-[#0A1629]">
                    {activeOpportunity.interests.join(', ')}
                  </div>
                </div>
              </div>

              {/* Comprehensive Details Tabs */}
              <div className="flex items-center gap-4 border-b border-[#EAE3D4] overflow-x-auto text-xs pt-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'offer', label: 'Carer Fee & Offer' },
                  { id: 'medical', label: 'Medical & Care Needs' },
                  { id: 'accommodation', label: 'Accommodation' },
                  { id: 'lifestyle', label: 'Lifestyle & Preferences' },
                  { id: 'history', label: 'My Completed History' },
                ].map((t) => {
                  const active = carerDetailSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setCarerDetailSubTab(t.id as any)}
                      className={`pb-2.5 px-1 font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                        active
                          ? 'border-[#C5A059] text-[#0A1629]'
                          : 'border-transparent text-[#64748B] hover:text-[#0A1629]'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {carerDetailSubTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1.5">
                    <h4 className="text-xs font-bold text-[#0A1629]">
                      About {activeOpportunity.clientFirstName}
                    </h4>
                    <p className="text-xs text-[#5C5549] leading-relaxed">
                      {activeOpportunity.aboutClient}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1.5">
                    <h4 className="text-xs font-bold text-[#0A1629]">Care Goals</h4>
                    <p className="text-xs text-[#5C5549] leading-relaxed">
                      {activeOpportunity.careGoals}
                    </p>
                  </div>
                </div>
              )}

              {carerDetailSubTab === 'offer' && carerFinancePolicy.canViewCarerFeeAndAllowance && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2.5">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8C6D2B]">
                      Carer Remuneration Breakdown
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1629]">
                      Weekly Carer Fee &amp; Food Allowance
                    </h4>
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Weekly Carer Fee</span>
                        <span className="font-bold text-[#0A1629] tabular-nums">
                          &pound;{activeOpportunity.weeklyPayment} per week
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Weekly Food Allowance</span>
                        <span className="font-bold text-[#0A1629] tabular-nums">
                          &pound;{activeOpportunity.foodAllowance} per week
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#E6DEC8] flex justify-between items-baseline">
                        <span className="font-semibold text-[#0A1629]">
                          Total Weekly Carer Remuneration &amp; Allowance
                        </span>
                        <span className="text-sm font-bold text-[#0A1629] tabular-nums">
                          &pound;
                          {activeOpportunity.weeklyPayment + activeOpportunity.foodAllowance} / wk
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8C6D2B]">
                        Auto-Generated Carer Offer Summary
                      </div>
                      <h4 className="font-bold text-sm text-[#0A1629]">
                        Placement Schedule &amp; Offer Decision
                      </h4>
                      <p className="text-[#5C5549] leading-relaxed">
                        Start: {activeOpportunity.startDate} -{' '}
                        {activeOpportunity.endDate === 'Ongoing'
                          ? 'Ongoing'
                          : `End: ${activeOpportunity.endDate}`}{' '}
                        ({activeOpportunity.duration}). Both your weekly carer fee and food allowance are guaranteed for the confirmed placement term.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setDeclinedIds((prev) => prev.filter((i) => i !== activeOpportunity.id));
                          if (!appliedIds.includes(activeOpportunity.id)) {
                            setAppliedIds([...appliedIds, activeOpportunity.id]);
                          }
                          showToast(
                            `Accepted placement offer for ${activeOpportunity.clientFirstName}`
                          );
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#0A1629] hover:bg-[#1E293B] text-white font-semibold cursor-pointer"
                      >
                        {appliedIds.includes(activeOpportunity.id)
                          ? 'Offer Accepted ✓'
                          : 'Accept Offer'}
                      </button>
                      <button
                        onClick={() => {
                          setAppliedIds((prev) => prev.filter((i) => i !== activeOpportunity.id));
                          if (!declinedIds.includes(activeOpportunity.id)) {
                            setDeclinedIds([...declinedIds, activeOpportunity.id]);
                          }
                          showToast(
                            `Declined placement offer for ${activeOpportunity.clientFirstName}`
                          );
                        }}
                        className="py-2 px-3 rounded-xl border border-[#DFD5C2] bg-white hover:bg-rose-50 hover:text-rose-700 text-[#0A1629] font-semibold cursor-pointer"
                      >
                        {declinedIds.includes(activeOpportunity.id) ? 'Declined' : 'Decline'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {carerDetailSubTab === 'medical' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2">
                    <h4 className="font-bold text-[#0A1629]">
                      Health Conditions &amp; Medication Support
                    </h4>
                    <p className="text-[#5C5549]">
                      <strong>Conditions:</strong>{' '}
                      {activeOpportunity.mainMedicalConcerns.join(', ')}
                    </p>
                    <p className="text-[#5C5549]">
                      <strong>Medication:</strong> {activeOpportunity.medicationSupport}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2">
                    <h4 className="font-bold text-[#0A1629]">Mobility &amp; Personal Care</h4>
                    <p className="text-[#5C5549]">
                      <strong>Mobility ({activeOpportunity.mobilityLevel}):</strong>{' '}
                      {activeOpportunity.mobilityDetails}
                    </p>
                    <p className="text-[#5C5549]">
                      <strong>Personal Care:</strong>{' '}
                      {activeOpportunity.personalCareNeeds.join(', ')} &mdash;{' '}
                      {activeOpportunity.personalCareNotes}
                    </p>
                  </div>
                </div>
              )}

              {carerDetailSubTab === 'accommodation' && (
                /* Directly sourced from Client Care Request per Requirement 2 */
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Compulsory Carer Accommodation Standards</div>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed">
                        The live-in carer must have their own private bedroom and access to a fully equipped bathroom with a toilet, washbasin and either a shower or bathtub. The bathroom may be private or shared, provided the arrangements are suitable.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                      <div className="text-[11px] text-[#64748B]">Private Bedroom</div>
                      <div className="font-bold text-[#0A1629] mt-0.5">
                        {activeOpportunity.accommodation.bedroomType} (Confirmed)
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                      <div className="text-[11px] text-[#64748B]">Bathroom Arrangements</div>
                      <div className="font-bold text-[#0A1629] mt-0.5">
                        {activeOpportunity.accommodation.bathroomType}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                      <div className="text-[11px] text-[#64748B]">Shower Arrangements</div>
                      <div className="font-bold text-[#0A1629] mt-0.5">
                        {activeOpportunity.accommodation.showerType}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="font-bold text-[#0A1629] mb-1">
                      Household &amp; Living Arrangements (from Client Care Request)
                    </div>
                    <p className="text-[#5C5549] leading-relaxed">
                      {activeOpportunity.accommodation.householdNotes}
                    </p>
                  </div>

                  {(() => {
                    const approvedPhotos = getApprovedAccommodationPhotos(
                      activeOpportunity.accommodation
                    );
                    return approvedPhotos.length > 0 ? (
                      <div>
                        <div className="font-bold text-[#0A1629] mb-2">
                          Approved Accommodation Photographs (Optional)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {approvedPhotos.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`Approved Accommodation ${i + 1}`}
                              className="w-full h-24 object-cover rounded-xl border border-[#E8DFD5]"
                            />
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {carerDetailSubTab === 'lifestyle' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1.5">
                    <div className="font-bold text-[#0A1629]">Pets &amp; Household</div>
                    <p className="text-[#5C5549]">Pets: {activeOpportunity.pets}</p>
                    <p className="text-[#5C5549]">Smoking: {activeOpportunity.smoking}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1.5">
                    <div className="font-bold text-[#0A1629]">Hobbies &amp; Behavioural Notes</div>
                    <p className="text-[#5C5549]">
                      Interests: {activeOpportunity.interests.join(', ')}
                    </p>
                    <p className="text-[#5C5549]">
                      Verbal abuse: {activeOpportunity.verbalAbuseHistory} &bull; Racial abuse:{' '}
                      {activeOpportunity.racialAbuseHistory}
                    </p>
                  </div>
                </div>
              )}

              {carerDetailSubTab === 'history' && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[#8C6D2B] text-[11px]">
                      Previous Placement
                    </span>
                    <span className="font-semibold text-emerald-800">Completed</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-[#64748B] block">Client</span>
                      <strong className="text-[#0A1629]">Doris</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Location</span>
                      <strong className="text-[#0A1629]">Hertfordshire</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Placement Type</span>
                      <strong className="text-[#0A1629]">Live-in Ongoing Care</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Dates</span>
                      <strong className="text-[#0A1629] tabular-nums">
                        Start: 12 Oct 2026 - End: 26 Oct 2026
                      </strong>
                    </div>
                    {carerFinancePolicy.canViewCarerFeeAndAllowance && (
                      <>
                        <div>
                          <span className="text-[#64748B] block">Weekly Carer Fee</span>
                          <strong className="text-[#0A1629] tabular-nums">&pound;900 per week</strong>
                        </div>
                        <div>
                          <span className="text-[#64748B] block">Food Allowance</span>
                          <strong className="text-[#0A1629] tabular-nums">&pound;40 per week</strong>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-[#64748B] block">Duration</span>
                      <strong className="text-[#0A1629]">14 days</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Confidential Contact Info</span>
                      <strong className="text-rose-700">Automatically Restricted</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: ADMIN PLACEMENT DETAILS & ADMIN ACCESS CONTROLS (image_4c6b32ab & image_1ccc5538)
  // ============================================================================
  if (viewMode === 'admin-detail' && currentPlacement) {
    const accessEval = evaluateClientInfoAccess(currentPlacement);
    const adminFinancePolicy = getFinancialVisibility('admin');

    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative bg-[#FAF7F2] min-h-screen">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-[#C5A059]/40">
            <Check className="w-4 h-4 text-[#D4AF7A]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Back Link */}
        <button
          onClick={() => setViewMode('admin-list')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0A1629] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Placements</span>
        </button>

        {/* Page Title Row (Adapts cleanly between Placement Details & Admin Access Controls) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight">
                {detailTab === 'access-controls' ? 'Admin Access Controls' : 'Placement Details'}
              </h1>
              <span
                className={`px-3 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(
                  currentPlacement.status,
                  currentPlacement.isEmergency
                )}`}
              >
                {currentPlacement.isEmergency ? 'Emergency' : currentPlacement.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              {detailTab === 'access-controls'
                ? 'Manage client information access, permissions and manual overrides for this placement.'
                : `${currentPlacement.placementType}  |  Start: ${currentPlacement.startDate}  |  ${currentPlacement.duration}`}
            </p>
          </div>

          {/* Action buttons matching image_c3de7f63.png and image_6c79f65d.png */}
          <div className="flex flex-wrap items-center gap-2.5">
            {detailTab === 'access-controls' ? (
              <button
                onClick={() => setDetailTab('client-info')}
                className="px-4 py-2 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#8C6D2B] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <span>View Full Placement</span>
                <span>&rarr;</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setDetailTab('access-controls')}
                  className="px-3.5 py-2 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#8C6D2B] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Access Controls</span>
                </button>
                <button
                  onClick={() => showToast(`Edit placement mode opened for ${currentPlacement.clientFirstName}`)}
                  className="px-3.5 py-2 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Edit Placement</span>
                </button>
                <button
                  className="p-2 rounded-xl border border-[#E0D5C1] bg-white hover:bg-[#FAF5EE] text-[#64748B] hover:text-[#0A1629] transition-colors cursor-pointer shadow-2xs"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Client Hero Banner matching image_c3de7f63.png & image_6c79f65d.png */}
        <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentPlacement.avatar}
              alt={currentPlacement.clientFirstName}
              className="w-20 h-20 rounded-2xl object-cover border border-[#E8DFD5] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1629]">
                  {currentPlacement.clientFirstName}
                </h2>
                {detailTab === 'access-controls' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Age {currentPlacement.age} &bull; {currentPlacement.location}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#475569] mt-2.5">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Home className="w-3.5 h-3.5 text-[#C5A059]" />
                  {currentPlacement.placementType}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  {currentPlacement.startDate}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  {currentPlacement.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                  <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
                  &pound;{currentPlacement.weeklyPayment} per week
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                  <Utensils className="w-3.5 h-3.5 text-[#C5A059]" />
                  Food allowance: &pound;{currentPlacement.foodAllowance} per week
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs Bar */}
        <div className="bg-white rounded-xl border border-[#EAE3D4] px-4 pt-1 flex items-center gap-2 sm:gap-5 overflow-x-auto text-xs shadow-2xs">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'client-info', label: 'Client Information', icon: Home },
            { id: 'payments', label: 'Payments & Fees', icon: Coins },
            { id: 'carer-details', label: 'Carer Details', icon: User },
            { id: 'dates-rotations', label: 'Dates & Rotations', icon: Calendar },
            { id: 'agreements', label: 'Agreements & Docs', icon: CheckCircle2 },
            { id: 'access-controls', label: 'Access Controls', icon: Lock },
            { id: 'notes', label: 'Notes & Activity', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = detailTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id as any)}
                className={`py-3 px-2 flex items-center gap-2 font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'border-[#C5A059] text-[#0A1629]'
                    : 'border-transparent text-[#64748B] hover:text-[#0A1629]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#C5A059]' : 'text-[#94A3B8]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: CLIENT INFORMATION (Exact match to image_4c6b32ab.png) */}
        {detailTab === 'client-info' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Cols: Client Contact Information + Client Summary */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {accessEval.canCarerViewIdentityAndContact ? (
                      <Unlock className="w-4 h-4 text-[#C5A059]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#C5A059]" />
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-[#0A1629]">
                      Client Contact Information
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748B]">
                    Assigned Carer: {currentPlacement.primaryCarer.name}
                  </span>
                </div>

                {/* Dynamic Release Status Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    accessEval.canCarerViewIdentityAndContact
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : accessEval.accessStateLabel === 'Access Scheduled'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      accessEval.canCarerViewIdentityAndContact
                        ? 'text-emerald-600'
                        : accessEval.accessStateLabel === 'Access Scheduled'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  />
                  <div>
                    <div className="font-bold">
                      {accessEval.canCarerViewIdentityAndContact
                        ? 'Contact information is now available to the assigned carer'
                        : `Carer access status: ${accessEval.accessStateLabel}`}
                    </div>
                    <div className="text-[11.5px] mt-0.5 opacity-90">{accessEval.reasonSummary}</div>
                  </div>
                </div>

                {/* Protected Fields Table */}
                <div className="divide-y divide-[#F2ECE0] border border-[#EFE8DC] rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 bg-[#FDFBF7] items-center gap-2">
                    <div className="sm:col-span-5 flex items-center gap-2 text-[#64748B]">
                      <User className="w-3.5 h-3.5" />
                      <span>Full Name</span>
                    </div>
                    <div className="sm:col-span-7 font-semibold text-[#0A1629] flex items-center justify-between">
                      <span>
                        {currentPlacement.clientFirstName} {currentPlacement.clientSurname}
                      </span>
                      {!accessEval.canCarerViewIdentityAndContact && (
                        <span className="text-[10.5px] text-amber-800 font-medium">
                          Carer sees: &ldquo;{currentPlacement.clientFirstName}&rdquo; only
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 bg-white items-start gap-2">
                    <div className="sm:col-span-5 flex items-center gap-2 text-[#64748B]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Residential Address</span>
                    </div>
                    <div className="sm:col-span-7 font-medium text-[#0A1629] whitespace-pre-line leading-relaxed flex items-start justify-between gap-2">
                      <span>{currentPlacement.residentialAddress}</span>
                      {!accessEval.canCarerViewIdentityAndContact && (
                        <span className="text-[10.5px] text-amber-800 font-medium shrink-0">
                          Hidden from carer
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 bg-[#FDFBF7] items-center gap-2">
                    <div className="sm:col-span-5 flex items-center gap-2 text-[#64748B]">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telephone Number</span>
                    </div>
                    <div className="sm:col-span-7 font-bold text-[#0A1629] tabular-nums flex items-center justify-between">
                      <span>{currentPlacement.telephoneNumber}</span>
                      {!accessEval.canCarerViewIdentityAndContact && (
                        <span className="text-[10.5px] text-amber-800 font-medium">
                          Hidden from carer
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 bg-white items-center gap-2">
                    <div className="sm:col-span-5 flex items-center gap-2 text-[#64748B]">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Address</span>
                    </div>
                    <div className="sm:col-span-7">
                      {accessEval.canCarerViewEmail ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-amber-900">
                            {currentPlacement.emailAddress} (Admin Exception Active)
                          </span>
                          <button
                            onClick={() => handleToggleEmailException(currentPlacement.id)}
                            className="text-[11px] text-rose-700 font-semibold hover:underline cursor-pointer"
                          >
                            Revoke Immediately
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-[#0A1629]">Hidden</div>
                          <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                            <span>Client email address is not shared with carers.</span>
                            <Info className="w-3 h-3 text-[#94A3B8]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Summary 8-Box Grid matching image_4c6b32ab.png */}
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-bold text-sm text-[#0A1629]">Client Summary</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Age</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">
                      {currentPlacement.age} years old
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Location</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">
                      {currentPlacement.location}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Placement Type</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">
                      {currentPlacement.placementType}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">
                      Weekly Carer Fee (Admin &amp; Carer)
                    </div>
                    <div className="font-bold text-[#0A1629] mt-0.5 tabular-nums">
                      &pound;{currentPlacement.weeklyPayment} per week
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">
                      Food Allowance (Admin &amp; Carer)
                    </div>
                    <div className="font-bold text-[#0A1629] mt-0.5 tabular-nums">
                      &pound;{currentPlacement.foodAllowance} per week
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">
                      Agreed Client Fee (G&amp;G)
                    </div>
                    <div className="font-bold text-[#8C6D2B] mt-0.5 tabular-nums">
                      &pound;{currentPlacement.agreedClientWeeklyFee.toLocaleString()} per week
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Start &amp; End Dates</div>
                    <div className="font-bold text-[#0A1629] mt-0.5 tabular-nums">
                      Start: {currentPlacement.startDate} -{' '}
                      {currentPlacement.endDate === 'Ongoing'
                        ? 'Ongoing'
                        : `End: ${currentPlacement.endDate}`}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Pets</div>
                    <div className="font-bold text-[#0A1629] mt-0.5">{currentPlacement.pets}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                    <div className="text-[10.5px] text-[#64748B]">Main Care Needs</div>
                    <div className="font-bold text-[#0A1629] mt-0.5 leading-relaxed">
                      {deriveMainCareNeeds(currentPlacement, careRequests).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Information Access Timeline + Important Information */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-bold text-sm sm:text-base text-[#0A1629]">
                    Information Access Timeline
                  </h3>
                </div>

                <div className="space-y-5 relative pl-6 border-l-2 border-[#E8DFD5] ml-2 text-xs">
                  <div className="relative">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center absolute -left-[33px] top-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <div className="font-bold text-emerald-800">Placement confirmed</div>
                    <div className="text-[#0A1629] font-medium mt-0.5">
                      {currentPlacement.confirmedDate}
                    </div>
                    <p className="text-[#64748B] text-[11px] mt-0.5">
                      Placement assigned to {currentPlacement.primaryCarer.name}{' '}
                      {currentPlacement.agreementsSigned
                        ? 'and agreements signed.'
                        : '(awaiting signed agreements).'}
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center absolute -left-[33px] top-0.5 ${
                        accessEval.canCarerViewIdentityAndContact
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-400 text-white'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <div className="font-bold text-[#0A1629]">
                      Client information release to carer
                    </div>
                    <div className="text-[#0A1629] font-medium mt-0.5">
                      {accessEval.releaseDateDisplay}
                    </div>
                    <p className="text-[#64748B] text-[11px] mt-0.5">
                      Full name, address and telephone number made available 7 days before start date (or immediately for urgent &lt;7d placements).
                    </p>
                  </div>

                  <div className="relative">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#CBD5E1] absolute -left-[32px] top-1" />
                    <div className="font-bold text-[#0A1629]">Placement start date</div>
                    <div className="text-[#0A1629] font-medium mt-0.5">
                      {currentPlacement.startDate}
                    </div>
                    <p className="text-[#64748B] text-[11px] mt-0.5">
                      Assigned carer retains access during active confirmed placement dates.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#CBD5E1] bg-white absolute -left-[32px] top-1" />
                    <div className="font-bold text-[#0A1629]">Placement end date</div>
                    <div className="text-[#0A1629] font-medium mt-0.5">
                      {currentPlacement.endDate}
                    </div>
                    <p className="text-[#64748B] text-[11px] mt-0.5">
                      Identifying and contact information is automatically restricted immediately when the placement ends or is cancelled.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Information Box */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#8C6D2B]">
                  <Info className="w-4 h-4 text-[#C5A059]" />
                  <span>Important Information</span>
                </div>
                <ul className="space-y-2 text-[11.5px] text-[#5C5549]">
                  {[
                    'Client email address is always hidden from carers by default.',
                    'Access to client information is only available to the assigned carer.',
                    'If the placement starts in fewer than 7 days, information is released immediately after confirmation and signed agreements.',
                    'Access is automatically removed when the placement ends, is cancelled or terminated early.',
                    'Administrators can manually grant or revoke access if required.',
                  ].map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: ACCESS CONTROLS (Exact match to image_1ccc5538.png) */}
        {detailTab === 'access-controls' && (
          <div className="space-y-5">
            {/* Row 1: Access Status Horizontal Stepper + Information Visible to Carer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Access Status Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="font-bold text-sm sm:text-base text-[#0A1629]">Access Status</h3>
                    <span className="text-xs text-[#64748B]">{accessEval.accessStateLabel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentPlacement.primaryCarer.avatar}
                      alt={currentPlacement.primaryCarer.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#E8DFD5]"
                    />
                    <div>
                      <div className="font-bold text-sm text-[#0A1629]">
                        {currentPlacement.primaryCarer.name}
                      </div>
                      <div className="text-xs text-[#64748B]">Primary Carer</div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                      accessEval.canCarerViewIdentityAndContact
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-[#FEF3D6] text-[#855B14] border-[#F6E1B2]'
                    }`}
                  >
                    {accessEval.accessStateLabel}
                  </span>
                </div>

                {/* 4-Node Horizontal Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                  <div className="space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#C59B47] text-white flex items-center justify-center mx-auto">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-semibold text-[#0A1629]">Placement confirmed</div>
                    <div className="text-[#64748B] text-[10px]">
                      {currentPlacement.confirmedDate}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
                        currentPlacement.agreementsSigned
                          ? 'bg-[#C59B47] text-white'
                          : 'border-2 border-amber-400 bg-white text-amber-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-semibold text-[#0A1629]">Agreements signed</div>
                    <div className="text-[#64748B] text-[10px]">
                      {currentPlacement.agreementsSigned
                        ? currentPlacement.agreementsSignedDate || 'Signed'
                        : 'Pending'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
                        accessEval.canCarerViewIdentityAndContact
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-[#C59B47] bg-white'
                      }`}
                    >
                      {accessEval.canCarerViewIdentityAndContact && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="font-bold text-[#0A1629]">Information release</div>
                    <div className="text-[#64748B] text-[10px]">
                      {accessEval.releaseDateDisplay}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] bg-[#F8FAFC] mx-auto" />
                    <div className="font-semibold text-[#64748B]">Placement start</div>
                    <div className="text-[#64748B] text-[10px]">{currentPlacement.startDate}</div>
                  </div>
                </div>
              </div>

              {/* Information Visible to Carer Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-bold text-sm sm:text-base text-[#0A1629]">
                    Information Visible to Carer
                  </h3>
                </div>

                <div className="divide-y divide-[#F2ECE0] text-xs pt-1">
                  {[
                    { label: 'Client full name', icon: User },
                    { label: 'Residential address', icon: MapPin },
                    { label: 'Telephone number', icon: Phone },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="py-2.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[#475569]">
                          <Icon className="w-3.5 h-3.5 text-[#64748B]" />
                          {row.label}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visible from {accessEval.releaseDateDisplay}</span>
                        </span>
                      </div>
                    );
                  })}

                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[#475569]">
                      <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                      Email address
                    </span>
                    {accessEval.canCarerViewEmail ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Visible (Admin Exception)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>Always hidden</span>
                        <Info className="w-3 h-3 text-rose-400 ml-0.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 3 Administrator Manual Intervention Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Manual Override */}
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                    <Key className="w-4 h-4 text-[#C5A059]" />
                    <span>Manual Override</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Administrators can manually grant or revoke access for this specific carer and placement in exceptional circumstances.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleManualGrant(currentPlacement.id)}
                    className="py-2 px-3 rounded-xl border border-[#D4AF7A] bg-[#FDF8EE] hover:bg-[#F7EBD4] text-xs font-semibold text-[#8C6D2B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Grant Access Now</span>
                  </button>
                  <button
                    onClick={() => handleManualRevoke(currentPlacement.id)}
                    className="py-2 px-3 rounded-xl border border-[#E2DACB] bg-white hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold text-[#0A1629] hover:text-rose-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    <span>Revoke Access</span>
                  </button>
                </div>
              </div>

              {/* 2. Email Access (Exceptional) */}
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span>Email Access (Exceptional)</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Client email is always hidden from carers by default. Only make visible if the client has no phone and specifically requires email contact.
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={currentPlacement.emailExceptionAuthorised}
                    onClick={() => handleToggleEmailException(currentPlacement.id)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                      currentPlacement.emailExceptionAuthorised
                        ? 'bg-[#C59B47] justify-end'
                        : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs block" />
                  </button>
                  <span className="text-xs font-medium text-[#0A1629]">
                    Make client email visible to this carer
                  </span>
                </label>
              </div>

              {/* 3. Return to Placement */}
              <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                    <RotateCcw className="w-4 h-4 text-[#C5A059]" />
                    <span>Return to Placement</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Confirm a returning rotation date to automatically manage 7-day or &lt;7-day access release for this carer.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={returnDateInput}
                    onChange={(e) => setReturnDateInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    onClick={() => handleSetReturnDate(currentPlacement.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#C59B47] hover:bg-[#B38936] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    Set Return Date
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Access Rules + Returning Carers + Access History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Access Rules */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>Access Rules</span>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F8FD] border border-[#DCE8F8] space-y-2.5 text-xs text-[#334155]">
                  {[
                    'Client information is released 7 days before the placement start date.',
                    'If the placement starts in fewer than 7 days, information is released immediately after confirmation and signed agreements.',
                    'Client email address is always hidden unless manually authorised by an administrator.',
                    'Access is automatically removed when the placement ends, is cancelled or terminated early.',
                    'Administrators can manually grant or revoke access at any time.',
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Returning Carers */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                    <User className="w-4 h-4 text-[#C5A059]" />
                    <span>Returning Carers</span>
                  </div>

                  {currentPlacement.returningCarers.length > 0 ? (
                    currentPlacement.returningCarers.map((rc, i) => (
                      <div key={i} className="flex items-center gap-3 pt-1">
                        <img
                          src={rc.avatar}
                          alt={rc.carerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#0A1629]">{rc.carerName}</span>
                            <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              Previous Carer
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">
                            {rc.previousDates}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#64748B]">
                      No prior rotations recorded for this client yet.
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] text-[11px] text-[#5C5549] leading-relaxed">
                  Existing valid master agreements are recognised automatically for returning carers; confirmed return dates apply the 7-day or immediate &lt;7-day release rule.
                </div>
              </div>

              {/* Access History Audit Log */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>Access History</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">Audit Log</span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                  {currentPlacement.accessHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2.5 pb-2.5 border-b border-[#F3EDE2] last:border-none"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          item.status === 'completed' || item.status === 'active'
                            ? 'bg-emerald-600'
                            : item.status === 'scheduled'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#0A1629] leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#64748B]">{item.subtitle}</div>
                        {item.date !== '—' && (
                          <div className="text-[10px] text-[#94A3B8] mt-0.5 tabular-nums">
                            {item.date} {item.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: OVERVIEW & CARER ACCOMMODATION CONFIRMATION */}
        {detailTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-[#0A1629]">
                  Medical, Care &amp; Behavioural Summary
                </h3>
                {viewMode === 'admin-detail' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingPlacementLifestyle) {
                        setEditingPlacementLifestyle(false);
                        showToast('Client lifestyle & safety disclosures updated.');
                      } else {
                        setEditingPlacementLifestyle(true);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B88E3E] hover:underline cursor-pointer"
                  >
                    {editingPlacementLifestyle ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Disclosures</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[#5C5549] leading-relaxed">{currentPlacement.aboutClient}</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="col-span-2 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block">Main Care Needs</span>
                  <strong className="text-[#0A1629]">
                    {deriveMainCareNeeds(currentPlacement, careRequests).join(', ')}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block">Medical Conditions</span>
                  <strong className="text-[#0A1629]">
                    {currentPlacement.mainMedicalConcerns.join(', ')}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block">Mobility</span>
                  <strong className="text-[#0A1629]">{currentPlacement.mobilityLevel}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block">Pets in Home</span>
                  {editingPlacementLifestyle && viewMode === 'admin-detail' ? (
                    <input
                      type="text"
                      value={currentPlacement.pets}
                      onChange={(e) =>
                        updatePlacement(currentPlacement.id, (prev) => ({
                          ...prev,
                          pets: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs"
                    />
                  ) : (
                    <strong className="text-[#0A1629]">{currentPlacement.pets || 'No'}</strong>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block">Smoking</span>
                  {editingPlacementLifestyle && viewMode === 'admin-detail' ? (
                    <input
                      type="text"
                      value={currentPlacement.smoking}
                      onChange={(e) =>
                        updatePlacement(currentPlacement.id, (prev) => ({
                          ...prev,
                          smoking: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs"
                    />
                  ) : (
                    <strong className="text-[#0A1629]">{currentPlacement.smoking || 'No'}</strong>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block">Verbal Abuse History</span>
                  {editingPlacementLifestyle && viewMode === 'admin-detail' ? (
                    <input
                      type="text"
                      value={currentPlacement.verbalAbuseHistory}
                      onChange={(e) =>
                        updatePlacement(currentPlacement.id, (prev) => ({
                          ...prev,
                          verbalAbuseHistory: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs"
                    />
                  ) : (
                    <strong className="text-[#0A1629]">
                      {currentPlacement.verbalAbuseHistory}
                    </strong>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block">Racially Abusive Behaviour</span>
                  {editingPlacementLifestyle && viewMode === 'admin-detail' ? (
                    <input
                      type="text"
                      value={currentPlacement.racialAbuseHistory}
                      onChange={(e) =>
                        updatePlacement(currentPlacement.id, (prev) => ({
                          ...prev,
                          racialAbuseHistory: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs"
                    />
                  ) : (
                    <strong className="text-[#0A1629]">
                      {currentPlacement.racialAbuseHistory}
                    </strong>
                  )}
                </div>
              </div>
            </div>

            {/* Carer Accommodation Confirmation incorporated into Placements */}
            <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-[#0A1629]">
                  Carer Accommodation Verification
                </h3>
                <span
                  className={`text-xs font-semibold inline-flex items-center gap-1.5 ${
                    getAccommodationApprovalStatus(currentPlacement.accommodation) === 'Approved'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {getAccommodationApprovalStatus(currentPlacement.accommodation) === 'Approved' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span>{getAccommodationApprovalStatus(currentPlacement.accommodation)}</span>
                </span>
              </div>
              <p className="text-[#5C5549] leading-relaxed">
                <strong>Compulsory Requirement:</strong> The live-in carer must have their own private bedroom and access to a fully equipped bathroom with a toilet, washbasin and either a shower or bathtub.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block">Bedroom</span>
                  <strong className="text-[#0A1629]">
                    {currentPlacement.accommodation.bedroomType}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block">Bathroom &amp; Shower</span>
                  <strong className="text-[#0A1629]">
                    {currentPlacement.accommodation.bathroomType} ({currentPlacement.accommodation.showerType})
                  </strong>
                </div>
              </div>
              {getApprovedAccommodationPhotos(currentPlacement.accommodation).length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                    Approved Profile Photographs ({getApprovedAccommodationPhotos(currentPlacement.accommodation).length})
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {getApprovedAccommodationPhotos(currentPlacement.accommodation).map((src, idx) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt={`Approved accommodation ${idx + 1}`}
                        className="w-full h-16 object-cover rounded-lg border border-[#EAE3D4]"
                      />
                    ))}
                  </div>
                </div>
              )}
              {hasPendingAccommodationPhotos(currentPlacement.accommodation) && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11.5px] text-amber-900">
                  Client-uploaded accommodation photographs are awaiting Admin approval in Care Requests and remain hidden from carers until approved.
                </div>
              )}
              <button
                onClick={() => {
                  if (hasPendingAccommodationPhotos(currentPlacement.accommodation)) {
                    showToast('Please approve or reject pending client photographs in Care Requests first');
                    return;
                  }
                  updatePlacement(currentPlacement.id, (prev) => ({
                    ...prev,
                    accommodation: {
                      ...prev.accommodation,
                      adminVerified: !prev.accommodation.adminVerified,
                    },
                  }));
                  showToast('Updated Carer Accommodation verification status');
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1629] text-white text-xs font-semibold hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                {getAccommodationApprovalStatus(currentPlacement.accommodation) === 'Approved'
                  ? 'Accommodation Approved ✓'
                  : 'Confirm Accommodation Approved'}
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PAYMENTS & FEES (Admin Role-Segregated Financial Management) */}
        {detailTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* 1. Carer Remuneration — Visible to Admin & Carers; Strictly Hidden from Clients */}
            <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-[#F2ECE0] pb-3">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800">
                    Visible to Admin &amp; Carers &bull; Hidden from Client
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A1629] mt-0.5">
                    Carer Remuneration &amp; Food Allowance
                  </h3>
                </div>
                <Coins className="w-4 h-4 text-[#C5A059] shrink-0" />
              </div>

              <p className="text-[#5C5549] leading-relaxed">
                Shown to approved carers on Available Placements, placement offers, and carer schedules so they can make an informed decision. Never displayed anywhere in the Client Portal, client profile, care request, or client documents.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Weekly Carer Fee (&pound;)
                  </label>
                  <input
                    type="number"
                    value={currentPlacement.weeklyPayment}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      updatePlacement(currentPlacement.id, (prev) => ({
                        ...prev,
                        weeklyPayment: val,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] font-bold text-[#0A1629] tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Weekly Food Allowance (&pound;)
                  </label>
                  <input
                    type="number"
                    value={currentPlacement.foodAllowance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      updatePlacement(currentPlacement.id, (prev) => ({
                        ...prev,
                        foodAllowance: val,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] font-bold text-[#0A1629] tabular-nums"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center justify-between">
                <span className="font-semibold text-[#0A1629]">
                  Total Weekly Carer Package (Carer &amp; Admin View)
                </span>
                <span className="text-sm font-bold text-[#0A1629] tabular-nums">
                  &pound;{currentPlacement.weeklyPayment + currentPlacement.foodAllowance} / week
                </span>
              </div>
            </div>

            {/* 2. Agreed Client Fee — Visible to Client & Admin; Hidden from Carers */}
            <div className="bg-white rounded-2xl border border-[#EAE3D4] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-[#F2ECE0] pb-3">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8C6D2B]">
                    Visible to Client &amp; Admin &bull; Hidden from Carers
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A1629] mt-0.5">
                    Agreed Grace &amp; Goodwill Client Fee
                  </h3>
                </div>
                <Shield className="w-4 h-4 text-[#C5A059] shrink-0" />
              </div>

              <p className="text-[#5C5549] leading-relaxed">
                Clients only see the weekly fee they have agreed to pay Grace &amp; Goodwill across their Client Portal, Client Profile, Care Request, and client statements.
              </p>

              <div>
                <label className="font-semibold text-[#0A1629] block mb-1">
                  Agreed Weekly Fee Payable to Grace &amp; Goodwill (&pound;)
                </label>
                <input
                  type="number"
                  value={currentPlacement.agreedClientWeeklyFee}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updatePlacement(currentPlacement.id, (prev) => ({
                      ...prev,
                      agreedClientWeeklyFee: val,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] font-bold text-[#0A1629] tabular-nums"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center justify-between">
                <span className="font-semibold text-[#0A1629]">
                  Client-Facing Weekly Statement Amount
                </span>
                <span className="text-sm font-bold text-[#8C6D2B] tabular-nums">
                  &pound;{currentPlacement.agreedClientWeeklyFee.toLocaleString()} / week
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CARER DETAILS / DATES & ROTATIONS / AGREEMENTS / NOTES */}
        {(detailTab === 'carer-details' ||
          detailTab === 'dates-rotations' ||
          detailTab === 'agreements' ||
          detailTab === 'notes') && (
          <div className="bg-white rounded-2xl border border-[#EAE3D4] p-6 space-y-4 text-xs">
            {detailTab === 'carer-details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center gap-3">
                  <img
                    src={currentPlacement.primaryCarer.avatar}
                    alt={currentPlacement.primaryCarer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[#64748B]">Assigned Primary Carer</div>
                    <div className="font-bold text-sm text-[#0A1629]">
                      {currentPlacement.primaryCarer.fullName}
                    </div>
                    <div className="text-[#8C6D2B] font-medium mt-0.5">
                      {currentPlacement.placementType} &middot; &pound;
                      {currentPlacement.weeklyPayment}/wk + &pound;{currentPlacement.foodAllowance}{' '}
                      food allowance
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex items-center gap-3">
                  {currentPlacement.reliefCarer ? (
                    <>
                      <img
                        src={currentPlacement.reliefCarer.avatar}
                        alt={currentPlacement.reliefCarer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[#64748B]">Assigned Relief Carer</div>
                        <div className="font-bold text-sm text-[#0A1629]">
                          {currentPlacement.reliefCarer.name}
                        </div>
                        <div className="text-[#64748B] mt-0.5">
                          Confirmed relief window:{' '}
                          {currentPlacement.reliefCarer.confirmedDates || 'As scheduled'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-[#64748B]">No relief carer required for single respite block.</div>
                  )}
                </div>
              </div>
            )}

            {detailTab === 'dates-rotations' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="text-[#64748B]">Rotation Schedule</div>
                  <div className="font-bold text-[#0A1629] text-sm mt-1">
                    {currentPlacement.rotationSchedule}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="text-[#64748B]">Upcoming Handover</div>
                  <div className="font-bold text-[#0A1629] text-sm mt-1">
                    {currentPlacement.nextHandover}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="text-[#64748B]">Start &amp; End Dates</div>
                  <div className="font-bold text-[#0A1629] text-sm mt-1 tabular-nums">
                    Start: {currentPlacement.startDate} -{' '}
                    {currentPlacement.endDate === 'Ongoing'
                      ? 'Ongoing'
                      : `End: ${currentPlacement.endDate}`}
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'agreements' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#0A1629]">
                    Placement &amp; Confidentiality Agreements (Rule 6C)
                  </h3>
                  <p className="text-[#64748B]">
                    Client identifying and contact details are strictly withheld until required placement agreements are completed, even if the placement starts within 7 days.
                  </p>
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPlacement.agreementsSigned}
                      onChange={(e) => {
                        const signed = e.target.checked;
                        updatePlacement(currentPlacement.id, (prev) => ({
                          ...prev,
                          agreementsSigned: signed,
                          agreementsSignedDate: signed ? '25 Oct 2026' : undefined,
                        }));
                        showToast(
                          signed
                            ? 'Agreements marked signed — automatic release rules active'
                            : 'Agreements marked unsigned — client contact details locked'
                        );
                      }}
                      className="w-4 h-4 accent-[#B88E3E]"
                    />
                    <span className="font-semibold text-[#0A1629]">
                      Confirm Placement Agreement &amp; Confidentiality Undertaking Signed by{' '}
                      {currentPlacement.primaryCarer.name}
                    </span>
                  </label>
                </div>

                {/* Role-Segregated Automatically Generated Documents */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-[#F2ECE0]">
                  {/* Carer-Facing Document */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2.5">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800">
                      Carer &amp; Admin Document &bull; Hidden from Client
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1629]">
                      Auto-Generated Carer Placement Offer &amp; Remuneration Schedule
                    </h4>
                    <div className="space-y-1.5 pt-1 text-[#334155]">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Assigned Carer</span>
                        <span className="font-semibold text-[#0A1629]">
                          {currentPlacement.primaryCarer.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Weekly Carer Fee</span>
                        <span className="font-bold text-[#0A1629] tabular-nums">
                          &pound;{currentPlacement.weeklyPayment} per week
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Weekly Food Allowance</span>
                        <span className="font-bold text-[#0A1629] tabular-nums">
                          &pound;{currentPlacement.foodAllowance} per week
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client-Facing Document */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2.5">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8C6D2B]">
                      Client &amp; Admin Document &bull; Zero Carer Pay Exposed
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1629]">
                      Auto-Generated Client Care Service Agreement &amp; Fee Schedule
                    </h4>
                    <div className="space-y-1.5 pt-1 text-[#334155]">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Client</span>
                        <span className="font-semibold text-[#0A1629]">
                          {currentPlacement.clientFirstName} {currentPlacement.clientSurname}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Care Arrangement</span>
                        <span className="font-semibold text-[#0A1629]">
                          {currentPlacement.placementType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Agreed Grace &amp; Goodwill Weekly Fee</span>
                        <span className="font-bold text-[#0A1629] tabular-nums">
                          &pound;{currentPlacement.agreedClientWeeklyFee.toLocaleString()} per week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'notes' && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0A1629]">Placement Activity Log</h3>
                {currentPlacement.accessHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] flex justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#0A1629]">{h.title}</span>
                      <span className="text-[#64748B] ml-2">{h.subtitle}</span>
                    </div>
                    <span className="text-[#94A3B8] tabular-nums">
                      {h.date} {h.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 1: PRIMARY ADMIN PLACEMENTS ROSTER & CARDS (image_5540fc35.png + Emergency Tab)
  // ============================================================================
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative bg-[#FAF7F2] min-h-screen">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-[#C5A059]/40">
          <Check className="w-4 h-4 text-[#D4AF7A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row matching image_5540fc35.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-[38px] font-semibold text-[#0A1629] tracking-tight leading-tight">
            Placements
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            View and manage all client&ndash;carer placements, rotations and handovers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('carer-available')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] transition-colors shadow-2xs cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#C59B47]" />
            <span>Carer View: Available Placements</span>
          </button>

          <button
            onClick={() => setViewMode('client-portal')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E0D5C1] bg-white hover:bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] transition-colors shadow-2xs cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#8C6D2B]" />
            <span>Client Portal View</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C59B47] hover:bg-[#B38936] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Placement</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards Row matching image_5540fc35.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#EAE3D4] p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#C5A059] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Active Placements</div>
              <div className="text-2xl sm:text-[28px] font-bold text-[#0A1629] tabular-nums leading-tight mt-0.5">
                {activeCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1">&#8599; 6%</div>
            </div>
          </div>
          {renderSparkline()}
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE3D4] p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#C5A059] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Upcoming Handovers</div>
              <div className="text-2xl sm:text-[28px] font-bold text-[#0A1629] tabular-nums leading-tight mt-0.5">
                {upcomingHandoversCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1">&#8599; 20%</div>
            </div>
          </div>
          {renderSparkline()}
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE3D4] p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#C5A059] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Starting Soon</div>
              <div className="text-2xl sm:text-[28px] font-bold text-[#0A1629] tabular-nums leading-tight mt-0.5">
                {startingSoonCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1">&#8599; 14%</div>
            </div>
          </div>
          {renderSparkline()}
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE3D4] p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#C5A059] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Completed Placements</div>
              <div className="text-2xl sm:text-[28px] font-bold text-[#0A1629] tabular-nums leading-tight mt-0.5">
                {completedCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1">&#8599; 10%</div>
            </div>
          </div>
          {renderSparkline()}
        </div>
      </div>

      {/* Filter Tabs Row — WITH EMERGENCY PLACEMENTS TAB RIGHT BETWEEN ALL PLACEMENTS AND ACTIVE! */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Placements' },
            {
              id: 'emergency',
              label: `Emergency Placements (${emergencyCount})`,
              isEmergencyTab: true,
            },
            { id: 'active', label: 'Active' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'on-hold', label: 'On Hold' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const isActive = activeFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? tab.isEmergencyTab
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-[#0A1629] border-b-2 border-b-[#C59B47] border-[#EAE3D4] shadow-2xs'
                    : tab.isEmergencyTab
                    ? 'bg-rose-50/80 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-white/60 text-[#64748B] border-transparent hover:bg-white hover:text-[#0A1629]'
                }`}
              >
                {tab.isEmergencyTab && (
                  <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search + Roster/Cards Switcher + Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search placements..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EAE3D4] text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Toggle Option A Table/Roster vs Card Grid */}
          <div className="flex items-center bg-white rounded-xl border border-[#EAE3D4] p-0.5">
            <button
              onClick={() => setDisplayLayout('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer ${
                displayLayout === 'cards'
                  ? 'bg-[#FAF5EE] text-[#0A1629] font-semibold'
                  : 'text-[#64748B]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setDisplayLayout('roster')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer ${
                displayLayout === 'roster'
                  ? 'bg-[#FAF5EE] text-[#0A1629] font-semibold'
                  : 'text-[#64748B]'
              }`}
              title="Placements Roster Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Roster Table</span>
            </button>
          </div>

          <button
            onClick={() =>
              setSortBy((prev) =>
                prev === 'start' ? 'rate' : prev === 'rate' ? 'name' : 'start'
              )
            }
            className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D4] text-xs font-medium text-[#0A1629] hover:bg-[#FAF5EE] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Sort: {sortBy === 'start' ? 'Start Date' : sortBy === 'rate' ? 'Rate' : 'Name'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Banner when on Emergency Placements Tab */}
      {activeFilterTab === 'emergency' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-rose-950">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Emergency Placements Only:</strong> Urgent live-in placements starting within 7 days automatically release client full name, address and telephone immediately once agreements are signed (Rule 6B).
            </span>
          </div>
        </div>
      )}

      {/* LAYOUT A: 3-Column Placement Cards matching image_5540fc35.png */}
      {displayLayout === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlacements.map((pl) => (
            <div
              key={pl.id}
              className="bg-white rounded-2xl border border-[#EAE3D4] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top: Photo + Name + Status + Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={pl.avatar}
                      alt={pl.clientFirstName}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E8DFD5] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-[#0A1629] truncate">
                        {pl.clientFirstName}
                      </h3>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        Age {pl.age} &bull; {pl.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusStyle(
                        pl.status,
                        pl.isEmergency
                      )}`}
                    >
                      {pl.isEmergency ? 'Emergency' : pl.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPlacementId(pl.id);
                        setDetailTab('access-controls');
                        setViewMode('admin-detail');
                      }}
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0A1629] hover:bg-[#FAF5EE] cursor-pointer"
                      title="Access Controls"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Placement Details Lines */}
                <div className="space-y-1.5 text-xs text-[#475569] pt-1">
                  <div className="flex items-center gap-2 font-semibold text-[#0A1629]">
                    <Home className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>{pl.placementType}</span>
                  </div>
                  <div className="flex items-start gap-2 leading-snug">
                    <Heart className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      <span className="font-semibold text-[#0A1629]">Main Care Needs:</span>{' '}
                      <span className="text-[#334155]">
                        {deriveMainCareNeeds(pl, careRequests, 4).join(', ')}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <Coins className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>
                      &pound;{pl.weeklyPayment} per week &nbsp;|&nbsp; Food allowance: &pound;
                      {pl.foodAllowance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>
                      Start: {pl.startDate} -{' '}
                      {pl.endDate === 'Ongoing' ? 'Ongoing' : `End: ${pl.endDate}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] pl-5.5">
                    Rotation: {pl.rotationSchedule} &bull; Handover: {pl.nextHandover}
                  </div>
                </div>
              </div>

              {/* Card Footer: Primary Carer + Relief Carer + View Details */}
              <div className="pt-3.5 border-t border-[#F2ECE0] flex items-center justify-between gap-2">
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <div className="text-[10px] text-[#94A3B8] mb-1">Primary Carer</div>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={pl.primaryCarer.avatar}
                        alt={pl.primaryCarer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-[#0A1629] whitespace-nowrap">
                        {pl.primaryCarer.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#94A3B8] mb-1">Relief Carer</div>
                    {pl.reliefCarer ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={pl.reliefCarer.avatar}
                          alt={pl.reliefCarer.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-[#475569] whitespace-nowrap">
                          {pl.reliefCarer.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">&mdash;</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlacementId(pl.id);
                    setDetailTab('client-info');
                    setViewMode('admin-detail');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] hover:bg-[#0A1629] hover:text-white text-xs font-semibold text-[#0A1629] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LAYOUT B: Option A Comprehensive Placements Roster Table */
        <div className="bg-white rounded-2xl border border-[#EAE3D4] shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D4] bg-[#FAF7F2] text-[#64748B] font-semibold">
                <th className="py-3.5 px-4">Client &amp; Location</th>
                <th className="py-3.5 px-4">Arrangement Type</th>
                <th className="py-3.5 px-4">Primary Carer</th>
                <th className="py-3.5 px-4">Relief Carer</th>
                <th className="py-3.5 px-4">Start &amp; End Dates</th>
                <th className="py-3.5 px-4">Rotation &amp; Handover</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Info Access</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0]">
              {filteredPlacements.map((pl) => {
                const access = evaluateClientInfoAccess(pl);
                return (
                  <tr key={pl.id} className="hover:bg-[#FAF7F2]/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pl.avatar}
                          alt={pl.clientFirstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-[#0A1629]">
                            {pl.clientFirstName} {pl.clientSurname}
                          </div>
                          <div className="text-[11px] text-[#64748B]">{pl.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#0A1629]">{pl.placementType}</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">
                        Main Care Needs: {deriveMainCareNeeds(pl, careRequests, 4).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#0A1629]">
                      {pl.primaryCarer.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {pl.reliefCarer?.name || '—'}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums whitespace-nowrap">
                      Start: {pl.startDate} -{' '}
                      {pl.endDate === 'Ongoing' ? 'Ongoing' : `End: ${pl.endDate}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{pl.rotationSchedule}</div>
                      <div className="text-[11px] text-[#8C6D2B]">Next: {pl.nextHandover}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusStyle(
                          pl.status,
                          pl.isEmergency
                        )}`}
                      >
                        {pl.isEmergency ? 'Emergency' : pl.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          access.canCarerViewIdentityAndContact
                            ? 'text-emerald-700'
                            : 'text-amber-800'
                        }`}
                      >
                        {access.accessStateLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPlacementId(pl.id);
                          setDetailTab('client-info');
                          setViewMode('admin-detail');
                        }}
                        className="text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] cursor-pointer"
                      >
                        Open &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: + New Placement */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#EAE3D4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE0] pb-3">
              <h3 className="font-bold text-base text-[#0A1629]">Create Confirmed Placement</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPlacement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#0A1629] block mb-1">
                  Select Client Account (Auto-populates details &amp; Main Care Needs)
                </label>
                <select
                  value={selectedClientAccountId}
                  onChange={(e) => handleSelectClientAccountInModal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                >
                  <option value="">Manual entry or choose existing client...</option>
                  {careRequests.map((cr) => (
                    <option key={cr.id} value={cr.id}>
                      {cr.clientFirstName} {cr.clientSurname} ({cr.location})
                    </option>
                  ))}
                </select>
                {selectedClientAccountId && (() => {
                  const chosen = careRequests.find((c) => c.id === selectedClientAccountId);
                  if (!chosen) return null;
                  const previewNeeds = deriveCareNeedsFromAccount(chosen, 4);
                  return (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] text-[11px] text-[#0A1629]">
                      <span className="text-[#64748B]">Main Care Needs: </span>
                      <span className="font-bold">{previewNeeds.join(', ')}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">Client First Name</label>
                  <input
                    required
                    value={newClientFirst}
                    onChange={(e) => setNewClientFirst(e.target.value)}
                    placeholder="e.g. Beatrice"
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Surname (Protected)
                  </label>
                  <input
                    required
                    value={newClientSurname}
                    onChange={(e) => setNewClientSurname(e.target.value)}
                    placeholder="e.g. Hollow"
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">County / City</label>
                  <input
                    required
                    value={newClientLocation}
                    onChange={(e) => setNewClientLocation(e.target.value)}
                    placeholder="e.g. Kent"
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDateISO}
                    onChange={(e) => setNewStartDateISO(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Live-in Arrangement
                  </label>
                  <select
                    value={newPlacementType}
                    onChange={(e) => setNewPlacementType(e.target.value as AvailabilityCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  >
                    <option value="Live-in Ongoing Care">Live-in Ongoing Care</option>
                    <option value="Live-in Respite Care">Live-in Respite Care</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Agreed Client Fee &mdash; G&amp;G (&pound;/wk)
                  </label>
                  <input
                    type="number"
                    value={newAgreedClientFee}
                    onChange={(e) => setNewAgreedClientFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                <div className="col-span-2 text-[10.5px] font-semibold text-[#8C6D2B]">
                  Carer Remuneration (Visible to Admin &amp; Carers &bull; Hidden from Client)
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Weekly Carer Fee (&pound;)
                  </label>
                  <input
                    type="number"
                    value={newWeeklyRate}
                    onChange={(e) => setNewWeeklyRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0A1629] block mb-1">
                    Food Allowance (&pound;/wk)
                  </label>
                  <input
                    type="number"
                    value={newFoodAllowance}
                    onChange={(e) => setNewFoodAllowance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0A1629] block mb-1">Assigned Primary Carer</label>
                <select
                  value={newCarerName}
                  onChange={(e) => setNewCarerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2]"
                >
                  <option value="Anita K.">Anita K. (Ongoing &amp; Respite)</option>
                  <option value="Komal V.">Komal V. (Ongoing &amp; Respite)</option>
                  <option value="Sophie W.">Sophie W. (Live-in Ongoing Care)</option>
                  <option value="Daniel C.">Daniel C. (Live-in Respite Care)</option>
                </select>
              </div>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsEmergency}
                  onChange={(e) => setNewIsEmergency(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-rose-600 shrink-0"
                />
                <div>
                  <div className="font-semibold text-rose-900">Mark as Emergency Placement</div>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">
                    Prioritise this placement and display it in the Emergency Placements section.
                  </p>
                </div>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2ECE0]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C59B47] text-white font-semibold hover:bg-[#B38936] cursor-pointer"
                >
                  Create Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
