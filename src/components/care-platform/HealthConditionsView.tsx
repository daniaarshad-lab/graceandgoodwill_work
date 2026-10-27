"use client";

import React, { useState } from 'react';
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
} from 'lucide-react';

interface HealthConditionsViewProps {
  onBack?: () => void;
}

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  totalCount: number;
  iconType: string;
  tags: { text: string; hasRemove?: boolean }[];
  moreCountText?: string;
  hasOtherSpecify?: boolean;
}

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

export const HealthConditionsView: React.FC<HealthConditionsViewProps> = () => {
  // Master list of 14 libraries exactly matching reference image
  const [libraries, setLibraries] = useState<LibraryItem[]>([
    {
      id: 'languages',
      title: 'Languages',
      description: 'Languages spoken by carers and clients.',
      totalCount: 42,
      iconType: 'globe',
      tags: [
        { text: 'English' },
        { text: 'Polish' },
        { text: 'Urdu' },
        { text: 'Gujarati' },
      ],
      moreCountText: '+39 more',
      hasOtherSpecify: true,
    },
    {
      id: 'interests-hobbies',
      title: 'Interests & Hobbies',
      description: 'Activities, interests and lifestyle preferences.',
      totalCount: 128,
      iconType: 'heart',
      tags: [
        { text: 'Reading' },
        { text: 'Gardening' },
        { text: 'Walking' },
        { text: 'Bowls', hasRemove: true },
        { text: 'Music' },
      ],
      moreCountText: '+124 more',
      hasOtherSpecify: true,
    },
    {
      id: 'conditions',
      title: 'Conditions',
      description: 'Medical conditions and health needs.',
      totalCount: 96,
      iconType: 'stethoscope',
      tags: [
        { text: 'Diabetes' },
        { text: 'Dementia' },
        { text: 'PSP', hasRemove: true },
        { text: "Parkinson's" },
        { text: 'Arthritis' },
      ],
      moreCountText: '+92 more',
      hasOtherSpecify: true,
    },
    {
      id: 'skills-training',
      title: 'Skills & Training',
      description: 'Skills, qualifications and training.',
      totalCount: 87,
      iconType: 'graduation',
      tags: [
        { text: 'Manual handling' },
        { text: 'First aid' },
        { text: 'Medication' },
        { text: 'Dementia care' },
        { text: 'Moving & handling' },
      ],
      moreCountText: '+83 more',
      hasOtherSpecify: false,
    },
    {
      id: 'medication',
      title: 'Medication',
      description: 'Medications, dosages and administration.',
      totalCount: 152,
      iconType: 'pill',
      tags: [
        { text: 'Paracetamol' },
        { text: 'Warfarin' },
        { text: 'Insulin' },
        { text: 'Amlodipine' },
        { text: 'Morphine' },
      ],
      moreCountText: '+148 more',
      hasOtherSpecify: false,
    },
    {
      id: 'clinical-info',
      title: 'Clinical Information',
      description: 'Clinical notes and relevant health information.',
      totalCount: 73,
      iconType: 'clipboard',
      tags: [
        { text: 'BP monitoring' },
        { text: 'Catheter care' },
        { text: 'Epilepsy' },
        { text: 'PEG feeding' },
        { text: 'Stoma care' },
      ],
      moreCountText: '+69 more',
      hasOtherSpecify: false,
    },
    {
      id: 'allergies',
      title: 'Allergies',
      description: 'Known allergies and adverse reactions.',
      totalCount: 58,
      iconType: 'shield',
      tags: [
        { text: 'Penicillin' },
        { text: 'Nuts' },
        { text: 'Latex' },
        { text: 'Pollen' },
        { text: 'Shellfish' },
      ],
      moreCountText: '+54 more',
      hasOtherSpecify: true,
    },
    {
      id: 'household-duties',
      title: 'Household Duties',
      description: 'Domestic tasks and household support.',
      totalCount: 106,
      iconType: 'home',
      tags: [
        { text: 'Cleaning' },
        { text: 'Laundry' },
        { text: 'Shopping' },
        { text: 'Meal preparation' },
        { text: 'Ironing' },
      ],
      moreCountText: '+102 more',
      hasOtherSpecify: false,
    },
    {
      id: 'personal-care',
      title: 'Personal Care',
      description: 'Personal care needs and support tasks.',
      totalCount: 94,
      iconType: 'user-check',
      tags: [
        { text: 'Washing' },
        { text: 'Dressing' },
        { text: 'Toileting' },
        { text: 'Showering' },
        { text: 'Continence care' },
      ],
      moreCountText: '+69 more',
      hasOtherSpecify: true,
    },
    {
      id: 'diet',
      title: 'Diet',
      description: 'Dietary requirements and meal preferences.',
      totalCount: 64,
      iconType: 'apple',
      tags: [
        { text: 'Vegetarian' },
        { text: 'Vegan' },
        { text: 'Halal' },
        { text: 'Kosher' },
        { text: 'Gluten free' },
      ],
      moreCountText: '+60 more',
      hasOtherSpecify: false,
    },
    {
      id: 'mobility',
      title: 'Mobility',
      description: 'Mobility levels and movement support.',
      totalCount: 81,
      iconType: 'accessibility',
      tags: [
        { text: 'Independent' },
        { text: 'Walking frame' },
        { text: 'Wheelchair' },
        { text: 'Hoist' },
        { text: 'Assistance x1' },
      ],
      moreCountText: '+77 more',
      hasOtherSpecify: false,
    },
    {
      id: 'aids-equipment',
      title: 'Aids & Equipment',
      description: 'Equipment used at home or in the community.',
      totalCount: 69,
      iconType: 'frame',
      tags: [
        { text: 'Walking stick' },
        { text: 'Wheelchair' },
        { text: 'Hoist' },
        { text: 'Profiling bed' },
        { text: 'Commode' },
      ],
      moreCountText: '+65 more',
      hasOtherSpecify: false,
    },
    {
      id: 'pets',
      title: 'Pets',
      description: 'Pets in the home and care considerations.',
      totalCount: 46,
      iconType: 'paw',
      tags: [
        { text: 'Dog' },
        { text: 'Cat' },
        { text: 'Bird' },
        { text: 'Rabbit' },
        { text: 'No pets' },
      ],
      moreCountText: '+42 more',
      hasOtherSpecify: false,
    },
    {
      id: 'night-time-support',
      title: 'Night-time Support',
      description: 'Night care needs and overnight support.',
      totalCount: 51,
      iconType: 'moon',
      tags: [
        { text: 'Waking at night' },
        { text: 'Toileting' },
        { text: 'Repositioning' },
        { text: 'Medication' },
        { text: 'Sleep monitoring' },
      ],
      moreCountText: '+47 more',
      hasOtherSpecify: false,
    },
  ]);

  // Search & Filter state
  const [filterQuery, setFilterQuery] = useState('');

  // Interactive Modals State
  const [activeModal, setActiveModal] = useState<
    'none' | 'add' | 'edit' | 'reorder' | 'viewAll'
  >('none');
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [allowFreeText, setAllowFreeText] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active dropdown menu for 3 dots
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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
      default:
        return <Tag className={iconClass} />;
    }
  };

  // Remove single tag handler
  const handleRemoveTag = (libraryId: string, tagText: string) => {
    setLibraries((prev) =>
      prev.map((lib) => {
        if (lib.id === libraryId) {
          return {
            ...lib,
            totalCount: Math.max(0, lib.totalCount - 1),
            tags: lib.tags.filter((t) => t.text !== tagText),
          };
        }
        return lib;
      })
    );
    showToast(`Removed "${tagText}" from library`);
  };

  // Open Add Item modal
  const handleOpenAddModal = (lib: LibraryItem) => {
    setSelectedLibrary(lib);
    setNewItemName('');
    setAllowFreeText(lib.hasOtherSpecify || false);
    setActiveModal('add');
    setOpenDropdownId(null);
  };

  // Submit Add Item
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibrary || !newItemName.trim()) return;

    const trimmed = newItemName.trim();
    setLibraries((prev) =>
      prev.map((lib) => {
        if (lib.id === selectedLibrary.id) {
          // Check if already exists
          if (lib.tags.some((t) => t.text.toLowerCase() === trimmed.toLowerCase())) {
            return lib;
          }
          return {
            ...lib,
            totalCount: lib.totalCount + 1,
            tags: [...lib.tags, { text: trimmed }],
            hasOtherSpecify: allowFreeText,
          };
        }
        return lib;
      })
    );

    showToast(`Added "${trimmed}" to ${selectedLibrary.title}`);
    setActiveModal('none');
    setNewItemName('');
  };

  // Open Edit Modal
  const handleOpenEditModal = (lib: LibraryItem) => {
    setSelectedLibrary(lib);
    setActiveModal('edit');
    setOpenDropdownId(null);
  };

  // Open Reorder Modal
  const handleOpenReorder = (lib: LibraryItem) => {
    setSelectedLibrary(lib);
    setActiveModal('reorder');
    setOpenDropdownId(null);
  };

  // Alphabetize tags for library
  const handleSortAlphabetical = (libraryId: string) => {
    setLibraries((prev) =>
      prev.map((lib) => {
        if (lib.id === libraryId) {
          const sorted = [...lib.tags].sort((a, b) => a.text.localeCompare(b.text));
          return { ...lib, tags: sorted };
        }
        return lib;
      })
    );
    showToast(`Sorted items alphabetically`);
    setActiveModal('none');
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

  // Calculate totals
  const totalLibraries = 15; // exactly as shown in screenshot stat card
  const totalItemsCount = libraries.reduce((acc, curr) => acc + curr.totalCount, 0);

  // Divide into Rows 1-3 (3 cards each) and Row 4 (5 cards)
  const mainLibraries = filteredLibraries.slice(0, 9);
  const bottomLibraries = filteredLibraries.slice(9);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative select-none bg-[#FAF7F2] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1629] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border border-[#C5A059]/30">
          <Check className="w-4 h-4 text-[#D4AF7A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header Section (Title + Subtitle + Gold Knot Emblem, Quote Removed) ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 min-h-[128px] overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#0A1629] tracking-tight leading-tight">
            Master Libraries
          </h1>
          <h2 className="text-base sm:text-[17px] font-medium text-[#1E293B] mt-1 tracking-normal font-sans">
            The foundation of Grace &amp; Goodwill
          </h2>
          <p className="text-xs sm:text-[13.5px] text-[#64748B] max-w-2xl mt-1.5 leading-relaxed font-sans">
            Manage the library of options used across Client, Carer and Admin portals.
            <br className="hidden sm:inline" />
            Add, edit or archive items here and they instantly become available everywhere.
          </p>
        </div>

        {/* Right Header Grace & Goodwill Gold Knot Logo (matching reference image without quote phrase) */}
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
        {/* Left Callout Card */}
        <div className="md:col-span-12 lg:col-span-7 bg-white rounded-xl border border-[#E8DFD5] p-4 sm:p-4.5 flex items-start gap-4 shadow-sm">
          <div className="p-2 rounded-lg bg-[#FAF5EE] shrink-0 mt-0.5">
            <NetworkNodeIcon className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="font-semibold text-xs sm:text-[14.5px] text-[#0A1629]">
              One library. A more connected platform.
            </h3>
            <p className="text-[11.5px] sm:text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Items you add here are available across all Grace &amp; Goodwill portals &mdash; for client profiles, carer profiles, care requests, placements and beyond.
            </p>
          </div>
        </div>

        {/* Middle Stat Card (15 Master Libraries) */}
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

        {/* Right Stat Card (1,842 Total Items) */}
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

      {/* ── Optional In-Page Quick Filter (subtle search if user wants to filter) ── */}
      {filterQuery && (
        <div className="relative z-10 flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-[#E8DFD5] text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>Filtering libraries for: <strong className="text-[#0A1629]">&ldquo;{filterQuery}&rdquo;</strong></span>
          </div>
          <button
            onClick={() => setFilterQuery('')}
            className="text-xs text-[#C5A059] hover:underline font-semibold"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* ── Main Library Cards (Rows 1 to 3: 3 Columns) ── */}
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
                    {tag.hasRemove && (
                      <button
                        onClick={() => handleRemoveTag(lib.id, tag.text)}
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
                  <div className="absolute right-0 bottom-8 w-44 bg-white rounded-xl shadow-lg border border-[#E8DFD5] py-1.5 z-20 text-xs">
                    <button
                      onClick={() => handleOpenAddModal(lib)}
                      className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Add New Item</span>
                    </button>
                    <button
                      onClick={() => handleSortAlphabetical(lib.id)}
                      className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Sort A to Z</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast(`Exported ${lib.title} to CSV`);
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-[#1E293B] hover:bg-[#FAF5EE] flex items-center gap-2"
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

      {/* ── Bottom Library Cards (Row 4: 5 Columns on Desktop) ── */}
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
                </div>
              </div>
            </div>
          ))}
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
                    New items immediately update across all portals.
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

      {/* ── Modal: Edit Library & Manage Tags ── */}
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
                    Manage {selectedLibrary.title}
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

            <div className="overflow-y-auto space-y-3 pr-1 py-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0A1629]">
                  Active Options ({selectedLibrary.tags.length})
                </span>
                <button
                  onClick={() => handleSortAlphabetical(selectedLibrary.id)}
                  className="text-xs text-[#C5A059] font-medium hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Sort A &rarr; Z
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] max-h-56 overflow-y-auto">
                {selectedLibrary.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#1E293B] bg-white border border-[#E2E8F0] shadow-sm"
                  >
                    <span>{tag.text}</span>
                    <button
                      onClick={() => handleRemoveTag(selectedLibrary.id, tag.text)}
                      className="text-[#64748B] hover:text-rose-600 font-bold ml-1"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={selectedLibrary.description}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    setLibraries((prev) =>
                      prev.map((l) =>
                        l.id === selectedLibrary.id ? { ...l, description: newDesc } : l
                      )
                    );
                    setSelectedLibrary({ ...selectedLibrary, description: newDesc });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] text-xs text-[#0A1629]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1EFEB] shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleOpenAddModal(selectedLibrary);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A059] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Item
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Updated ${selectedLibrary.title}`);
                  setActiveModal('none');
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#1E293B] text-xs font-medium transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Reorder Library ── */}
      {activeModal === 'reorder' && selectedLibrary && (
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
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] text-left flex items-center justify-between transition-colors"
              >
                <span>Alphabetical (A &rarr; Z)</span>
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={() => {
                  // Reverse order
                  setLibraries((prev) =>
                    prev.map((l) =>
                      l.id === selectedLibrary.id ? { ...l, tags: [...l.tags].reverse() } : l
                    )
                  );
                  showToast('Reversed items order');
                  setActiveModal('none');
                }}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] text-left flex items-center justify-between transition-colors"
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
