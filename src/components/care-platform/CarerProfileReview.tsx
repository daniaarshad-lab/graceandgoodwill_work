"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Play,
  Car,
  Languages,
  Heart,
  Stethoscope,
  GraduationCap,
  Dog,
  Cigarette,
  Lock,
  Check,
  X,
  Plus,
  User,
  Briefcase,
  Eye,
} from 'lucide-react';
import { AvailabilityCategory, usePlatformStore } from '@/data/care-platform/platformStore';

interface CarerProfileReviewProps {
  onBack: () => void;
  onOpenCarerPortalPreview?: () => void;
}

export const CarerProfileReview: React.FC<CarerProfileReviewProps> = ({
  onBack,
  onOpenCarerPortalPreview,
}) => {
  const {
    carerAvailabilityPrefs,
    setCarerAvailabilityPrefs,
    incrementApprovedCarers,
  } = usePlatformStore();

  const [activeTab, setActiveTab] = useState<
    'personal' | 'documents' | 'compliance' | 'history' | 'notes'
  >('personal');
  const [yearsExperience, setYearsExperience] = useState('4 years');
  const [drivesVehicle, setDrivesVehicle] = useState(true);
  const [petsComfortable, setPetsComfortable] = useState(true);
  const [smoker, setSmoker] = useState(false);
  const [abusivePref, setAbusivePref] = useState('No');
  const [isApproved, setIsApproved] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const availabilityOptions: {
    id: AvailabilityCategory;
    label: AvailabilityCategory;
    subtitle: string;
  }[] = [
    {
      id: 'Live-in Ongoing Care',
      label: 'Live-in Ongoing Care',
      subtitle: 'Long-term care arrangements',
    },
    {
      id: 'Live-in Respite Care',
      label: 'Live-in Respite Care',
      subtitle: 'Short-term or one-off care arrangements',
    },
  ];

  const toggleAvailabilityType = (category: AvailabilityCategory) => {
    setCarerAvailabilityPrefs((prev) => {
      if (prev.includes(category)) {
        // Keep at least one live-in option selected or allow toggling freely
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
  };

  const summaryAvailabilityLabel =
    carerAvailabilityPrefs.length === 2
      ? 'Ongoing & Respite'
      : carerAvailabilityPrefs[0] === 'Live-in Ongoing Care'
      ? 'Live-in Ongoing'
      : 'Live-in Respite';

  const handleApprove = () => {
    if (!isApproved) {
      incrementApprovedCarers();
    }
    setIsApproved(true);
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 relative overflow-hidden">
      {/* Background Grace & Goodwill Logo Watermark */}
      <div className="absolute top-0 right-0 w-[420px] sm:w-[540px] lg:w-[620px] h-48 sm:h-56 pointer-events-none select-none z-0 overflow-hidden opacity-[0.20]">
        <img
          src="/website_logo.png"
          alt=""
          className="w-full h-full object-contain object-right filter brightness-110 contrast-110"
        />
      </div>

      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 text-[#7D7362]">
          <button onClick={onBack} className="hover:text-[#0A1629] transition-colors cursor-pointer">
            Carers
          </button>
          <span>&gt;</span>
          <span>Onboarding &amp; Profile Review</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#0A1629]">Komal V.</span>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {onOpenCarerPortalPreview && (
            <button
              onClick={onOpenCarerPortalPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF7A] bg-[#FAF5EE] text-xs font-semibold text-[#0A1629] hover:bg-[#F3E9D8] transition-colors shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Carer View: Available Placements</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0D5C1] bg-white text-xs font-medium text-[#0A1629] hover:bg-[#F6F1E7] transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Back to Carers</span>
          </button>
        </div>
      </div>

      {/* Main Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#0A1629] tracking-tight">
            Carer Profile Review
          </h1>
          <p className="text-xs sm:text-sm text-[#7D7362] mt-1">
            Review and verify live-in availability, documents and compliance before approval.
          </p>
        </div>
      </div>

      {/* Carer Profile Header Banner Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
            alt="Komal V."
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B88E3E]/40 shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#0A1629]">Komal V.</h2>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                  isApproved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isApproved ? 'Approved & Live' : 'Pending Review'}
              </span>
            </div>
            <div className="text-xs text-[#7D7362] mt-1">
              Newcastle &bull; {carerAvailabilityPrefs.join(' & ')}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A39886] mt-2">
              <span className="font-mono text-[#0A1629]">Carer ID CG-1047</span>
              <span>&bull;</span>
              <span>Application submitted 12 Oct 2026</span>
              <span>&bull;</span>
              <span>Last updated 24 Oct 2026</span>
            </div>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="w-full md:w-64 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DEC9]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#0A1629]">Profile Completeness</span>
            <span className="font-bold text-[#B88E3E] tabular-nums">96%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#EAE2D2] overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-[96%]" />
          </div>
          <p className="text-[10px] text-[#7D7362] mt-1.5">All live-in checks provided</p>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left 2 Columns: Tabs and Detailed Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#EAE3D4] pb-1 overflow-x-auto">
            {[
              { id: 'personal', label: 'Personal & Professional', icon: User },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'compliance', label: 'Compliance Checks', icon: Shield },
              { id: 'history', label: 'Placement History', icon: Briefcase },
              { id: 'notes', label: 'Notes & Activity', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-b-2 border-[#B88E3E] text-[#0A1629] bg-white shadow-sm'
                      : 'text-[#7D7362] hover:text-[#0A1629] hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B88E3E]' : 'text-[#A39886]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'history' ? (
            /* Section 9: Historical Placement Records (Client Identifying Data Automatically Restricted) */
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F2ECE0]">
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1629]">
                      Completed Placement History
                    </h3>
                    <p className="text-xs text-[#7D7362] mt-0.5">
                      Carers retain historical placement summaries while client surnames, residential addresses, telephone numbers and email addresses are automatically restricted once a placement ends.
                    </p>
                  </div>
                </div>

                {/* Historical Placement Card matching Section 9 */}
                <div className="rounded-xl border border-[#E8DFD5] bg-[#FAF7F2] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-[#8C6D2B] uppercase">
                      Previous Placement
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Client</span>
                      <span className="font-semibold text-[#0A1629]">Doris</span>
                      <span className="block text-[10px] text-[#A39886]">Surname restricted</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Location</span>
                      <span className="font-semibold text-[#0A1629]">Hertfordshire</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Placement Type</span>
                      <span className="font-semibold text-[#0A1629]">Live-in Ongoing Care</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Dates</span>
                      <span className="font-semibold text-[#0A1629]">12 October - 26 October 2026</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Duration</span>
                      <span className="font-semibold text-[#0A1629]">14 days</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Weekly Carer Fee</span>
                      <span className="font-semibold text-[#0A1629] tabular-nums">&pound;900 per week</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Food Allowance</span>
                      <span className="font-semibold text-[#0A1629] tabular-nums">&pound;40 per week</span>
                    </div>
                    <div>
                      <span className="text-[#7D7362] block text-[11px]">Contact &amp; Address Access</span>
                      <span className="font-semibold text-rose-700 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Revoked post-placement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: Years Experience, Live-in Availability Type, Driving Information */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 1. Years of Experience */}
                <div className="md:col-span-3 bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                    <GraduationCap className="w-4 h-4 text-[#B88E3E]" />
                    <span>Years of Experience</span>
                  </div>
                  <div className="pt-2">
                    <select
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E0D5C1] text-xs font-medium text-[#0A1629] px-3 py-2 rounded-xl focus:border-[#B88E3E] focus:outline-none"
                    >
                      <option>Less Than 1 Year</option>
                      <option>1–2 Years</option>
                      <option>3–5 Years</option>
                      <option>4 years</option>
                      <option>6–10 Years</option>
                      <option>11–15 Years</option>
                      <option>20+ Years</option>
                    </select>
                  </div>
                </div>

                {/* 2. Availability Type (Updated strictly to Live-in Ongoing Care & Live-in Respite Care) */}
                <div className="md:col-span-5 bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                        <Clock className="w-4 h-4 text-[#B88E3E]" />
                        <span>Availability Type</span>
                      </div>
                      <span className="text-[10px] text-[#7D7362]">Select either or both</span>
                    </div>

                    <div className="space-y-2 mt-2.5">
                      {availabilityOptions.map((opt) => {
                        const isSelected = carerAvailabilityPrefs.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleAvailabilityType(opt.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#FDF4E2] border-[#D4AF7A] text-[#0A1629] shadow-sm'
                                : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#64748B] hover:border-[#D4AF7A]/60'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-[#0A1629] border-[#0A1629] text-[#D4AF7A]'
                                  : 'bg-white border-[#CBD5E1]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" strokeWidth={2.5} />}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold leading-tight">{opt.label}</div>
                              <div className="text-[10.5px] text-[#7D7362] mt-0.5">
                                {opt.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Driving Information */}
                <div className="md:col-span-4 bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                    <Car className="w-4 h-4 text-[#B88E3E]" />
                    <span>Driving Information</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#7D7362]">Drives?</span>
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="drives"
                        checked={drivesVehicle}
                        onChange={() => setDrivesVehicle(true)}
                        className="accent-[#B88E3E]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="drives"
                        checked={!drivesVehicle}
                        onChange={() => setDrivesVehicle(false)}
                        className="accent-[#B88E3E]"
                      />
                      <span>No</span>
                    </label>
                  </div>

                  {/* Uploaded Driving Licence Preview */}
                  <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E0D5C1] flex items-center justify-between text-[11px] mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-sky-100 text-sky-800 flex items-center justify-center text-[8px] font-bold">
                        UK
                      </div>
                      <div className="font-semibold text-emerald-800 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        UK Licence Uploaded
                      </div>
                    </div>
                    <button className="text-[10px] text-[#B88E3E] hover:underline font-semibold cursor-pointer">
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Languages, Interests, Condition Expertise */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629] mb-2">
                      <Languages className="w-4 h-4 text-[#B88E3E]" />
                      <span>Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629]">
                        <strong className="font-semibold">English</strong> (Native)
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629]">
                        <strong className="font-semibold">Hindi</strong> (Fluent)
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629]">
                        <strong className="font-semibold">Punjabi</strong> (Conversational)
                      </span>
                    </div>
                  </div>
                  <button className="text-[10px] px-2 py-1 rounded-lg border border-dashed border-[#B88E3E] text-[#B88E3E] hover:bg-[#FAF7F2] flex items-center justify-center gap-1 font-medium mt-2 cursor-pointer">
                    <Plus className="w-2.5 h-2.5" /> Add language
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629] mb-2">
                      <Heart className="w-4 h-4 text-[#B88E3E]" />
                      <span>Interests &amp; Hobbies</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Cooking', 'Walking', 'Music', 'Reading', 'Gardening', 'Yoga'].map(
                        (interest) => (
                          <span
                            key={interest}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629]"
                          >
                            {interest}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <button className="text-[10px] px-2 py-1 rounded-lg border border-dashed border-[#B88E3E] text-[#B88E3E] hover:bg-[#FAF7F2] flex items-center justify-center gap-1 font-medium mt-2 cursor-pointer">
                    <Plus className="w-2.5 h-2.5" /> Add interest
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629] mb-2">
                      <Stethoscope className="w-4 h-4 text-[#B88E3E]" />
                      <span>Condition Expertise</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Dementia',
                        "Alzheimer's",
                        'Mental Health',
                        'Mobility Support',
                        'Personal Care',
                        'Stroke Recovery',
                      ].map((cond) => (
                        <span
                          key={cond}
                          className="text-[10px] px-2 py-1 rounded-md bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629]"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-[10px] px-2 py-1 rounded-lg border border-dashed border-[#B88E3E] text-[#B88E3E] hover:bg-[#FAF7F2] flex items-center justify-center gap-1 font-medium mt-2 cursor-pointer">
                    <Plus className="w-2.5 h-2.5" /> Add expertise
                  </button>
                </div>
              </div>

              {/* Section 3: Skills & Training */}
              <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                  <GraduationCap className="w-4 h-4 text-[#B88E3E]" />
                  <span>Skills &amp; Training</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Manual Handling',
                    'First Aid',
                    'Medication Support',
                    'Safeguarding',
                    'Food Hygiene',
                    'Infection Control',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                    >
                      &#10003; {skill}
                    </span>
                  ))}
                  <button className="text-[10px] px-2 py-0.5 rounded-lg border border-dashed border-[#B88E3E] text-[#B88E3E] hover:bg-[#FAF7F2] flex items-center gap-1 cursor-pointer">
                    <Plus className="w-2.5 h-2.5" /> Add skill / training
                  </button>
                </div>
              </div>

              {/* Section 4: Private Matching Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                      <Dog className="w-4 h-4 text-[#B88E3E]" />
                      <span>Pets</span>
                    </div>
                    <div className="text-[10px] text-[#7D7362] mt-1">
                      Comfortable living with pets?
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs pt-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pets"
                        checked={petsComfortable}
                        onChange={() => setPetsComfortable(true)}
                        className="accent-[#B88E3E]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pets"
                        checked={!petsComfortable}
                        onChange={() => setPetsComfortable(false)}
                        className="accent-[#B88E3E]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#EAE3D4] shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1629]">
                      <Cigarette className="w-4 h-4 text-[#B88E3E]" />
                      <span>Smoking</span>
                    </div>
                    <div className="text-[10px] text-[#7D7362] mt-1">Do you smoke?</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs pt-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="smoke"
                        checked={smoker}
                        onChange={() => setSmoker(true)}
                        className="accent-[#B88E3E]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="smoke"
                        checked={!smoker}
                        onChange={() => setSmoker(false)}
                        className="accent-[#B88E3E]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-amber-200/80 bg-amber-50/20 shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0A1629]">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-amber-700" />
                        <span>Racially Abusive Behaviour</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                        Admin Private
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7D7362] leading-tight mt-1">
                      Willing to accept placements with historical racial abuse note?
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs pt-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="abusive"
                        checked={abusivePref === 'Yes'}
                        onChange={() => setAbusivePref('Yes')}
                        className="accent-[#B88E3E]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="abusive"
                        checked={abusivePref === 'No'}
                        onChange={() => setAbusivePref('No')}
                        className="accent-[#B88E3E]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Carer Business Details */}
              <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#B88E3E]" />
                    <h3 className="text-xs font-bold text-[#0A1629]">Carer Business Details</h3>
                    <span className="text-[9.5px] px-2 py-0.5 rounded-md font-semibold bg-[#F6F1E7] text-[#8C6D2B] border border-[#E8DEC9]">
                      Private / Admin Only
                    </span>
                  </div>
                  <button className="text-xs text-[#B88E3E] font-medium hover:underline cursor-pointer">
                    View Business Details &rarr;
                  </button>
                </div>
                <p className="text-[11px] text-[#7D7362] leading-relaxed">
                  LTD company, LLP or self-employed details, tax information and payment setup. This
                  information is only visible to authorised administrators and is not shown to
                  clients or other carers.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-[#A39886] font-semibold">
                      Business Type
                    </span>
                    <span className="font-semibold text-[#0A1629]">LTD Company</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#A39886] font-semibold">
                      Company Name
                    </span>
                    <span className="font-semibold text-[#0A1629]">Komal Care Services Ltd</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#A39886] font-semibold">
                      Company Number
                    </span>
                    <span className="font-mono text-[#0A1629]">13456789</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#A39886] font-semibold">UTR</span>
                    <span className="font-mono text-[#0A1629]">12345 67890</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#A39886] font-semibold">
                      Payment Method
                    </span>
                    <span className="font-semibold text-[#0A1629]">BACS (Business Account)</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Carer Summary & Checks Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm text-center space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F2ECE0]">
              <span className="font-semibold text-[#0A1629]">Carer Summary</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  isApproved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isApproved ? 'Approved' : 'Pending Review'}
              </span>
            </div>

            <div className="relative w-28 h-28 mx-auto group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                alt="Komal V."
                className="w-full h-full rounded-full object-cover ring-4 ring-[#E8DEC9]"
              />
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>

            <button className="text-xs text-[#B88E3E] font-semibold hover:underline inline-flex items-center gap-1.5 cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Profile Video (1:24)</span>
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#0A1629]">K. V.</h3>
              <p className="text-xs text-[#7D7362]">Newcastle</p>
            </div>

            {/* Key Metrics Boxes — Dynamically reflects Live-in Ongoing / Respite! */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E0D5C1]">
                <div className="text-[10px] text-[#A39886]">Experience</div>
                <div className="text-xs font-bold text-[#0A1629]">{yearsExperience}</div>
              </div>
              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E0D5C1]">
                <div className="text-[10px] text-[#A39886]">Availability</div>
                <div className="text-[11px] font-bold text-emerald-700 leading-tight">
                  {summaryAvailabilityLabel}
                </div>
              </div>
              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E0D5C1]">
                <div className="text-[10px] text-[#A39886]">Location</div>
                <div className="text-xs font-bold text-[#0A1629]">Newcastle</div>
              </div>
            </div>

            {/* Live-in Availability Badges in Summary */}
            <div className="text-left bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE3D4] space-y-1.5">
              <div className="text-[10.5px] font-semibold text-[#0A1629]">
                Accepted Live-in Placement Types
              </div>
              <div className="space-y-1">
                {carerAvailabilityPrefs.map((pref) => (
                  <div
                    key={pref}
                    className="flex items-center gap-1.5 text-[11px] text-[#5C5549] font-medium"
                  >
                    <Check className="w-3.5 h-3.5 text-[#B88E3E] shrink-0" />
                    <span>{pref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Checks */}
            <div className="text-left pt-3 border-t border-[#F2ECE0] space-y-2">
              <div className="text-xs font-bold text-[#0A1629]">Status &amp; Checks</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <Shield className="w-3.5 h-3.5 text-[#B88E3E]" /> Identity Check
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <FileText className="w-3.5 h-3.5 text-[#B88E3E]" /> Right to Work
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <Shield className="w-3.5 h-3.5 text-[#B88E3E]" /> DBS Check
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <FileText className="w-3.5 h-3.5 text-[#B88E3E]" /> References
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 2 of 2 received
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B88E3E]" /> Training Certificates
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 3 uploaded
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <Car className="w-3.5 h-3.5 text-[#B88E3E]" /> Driving Licence
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="text-left pt-3 border-t border-[#F2ECE0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0A1629]">
                <span>Tags</span>
                <button className="text-[10px] text-[#B88E3E] hover:underline font-normal cursor-pointer">
                  + Add tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Live-in Ongoing Care',
                  'Live-in Respite Care',
                  'Dementia Experience',
                  'Owns Car',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E0D5C1] text-[#7D7362] flex items-center gap-1"
                  >
                    {tag} <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#EAE3D4] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#7D7362]">
          <Shield className="w-4 h-4 text-[#B88E3E]" />
          <span>
            {isApproved
              ? 'Approved carer — authorised to view circulated Available Placements'
              : 'Admin verification in progress'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] hover:bg-white transition-colors cursor-pointer">
            Save Draft
          </button>
          <button className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer">
            Request Changes
          </button>
          <button
            onClick={handleApprove}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#060D1E] to-[#12244C] text-[#EBD8B2] border border-[#D4AF7A]/50 text-xs font-bold hover:brightness-110 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF7A]" />
            <span>{isApproved ? 'Approved' : 'Approve Profile'}</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showApprovalSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-[#060D1E] text-white p-4 rounded-2xl border border-[#D4AF7A] shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF7A]" />
          <div>
            <p className="font-semibold text-xs text-[#EBD8B2]">Profile Approved!</p>
            <p className="text-[11px] text-slate-300">
              Komal V. is now approved and dashboard carer figures have updated automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
