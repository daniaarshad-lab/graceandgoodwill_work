import React, { useState } from 'react';
import {
  Shield,
  Heart,
  Calendar,
  Clock,
  Utensils,
  BedDouble,
  ShowerHead,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  Link as LinkIcon,
  AlertTriangle,
  ArrowLeft,
  Coins,
  MapPin,
  Check,
  UserCheck,
  Building,
  Sparkles,
} from 'lucide-react';
import {
  CareRequestRecord,
  isShareableLinkActive,
  getShareableLinkRemainingHours,
} from '../../data/platformStore';

interface SharedCareOpportunityViewProps {
  careRequest: CareRequestRecord;
  forceExpiredPreview?: boolean;
  onBack?: () => void;
  onExpressInterest?: () => void;
}

export const SharedCareOpportunityView: React.FC<SharedCareOpportunityViewProps> = ({
  careRequest,
  forceExpiredPreview = false,
  onBack,
  onExpressInterest,
}) => {
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [carerName, setCarerName] = useState('');
  const [carerPhone, setCarerPhone] = useState('');
  const [carerNotes, setCarerNotes] = useState('');
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  const isLinkActive = !forceExpiredPreview && isShareableLinkActive(careRequest);
  const remainingHours = getShareableLinkRemainingHours(careRequest);

  // ─────────────────────────────────────────────────────────────
  // 1. EXPIRED LINK PAGE (Brand consistent with ExpiredProfileView)
  // ─────────────────────────────────────────────────────────────
  if (!isLinkActive) {
    return (
      <div className="min-h-screen bg-[#060D1E] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden p-4 sm:p-6">
        {/* Subtle Background Ambience */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=80"
            alt="Grace and Goodwill interior"
            className="w-full h-full object-cover filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060D1E]/90 via-[#060D1E]/95 to-[#060D1E]" />
        </div>

        {/* Top bar */}
        {onBack && (
          <div className="w-full max-w-4xl pt-2 pb-4 flex items-center justify-between relative z-20">
            <button
              onClick={onBack}
              className="text-xs text-[#D4AF7A] hover:text-[#EBD8B2] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-[#D4AF7A]/20 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Portal</span>
            </button>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF7A]/70 font-semibold">
              Shareable Link Verification
            </span>
          </div>
        )}

        {/* Brand Header */}
        <div className="pt-6 pb-6 flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 mb-3 relative">
            <img
              src="/website_logo.png"
              alt="Grace & Goodwill Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,122,0.4)]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="font-cinzel text-xl md:text-2xl font-medium tracking-[0.22em] text-[#D4AF7A] uppercase drop-shadow-md">
            Grace &amp; Goodwill
          </h1>
          <div className="flex items-center gap-2 mt-1.5 opacity-90">
            <div className="w-6 h-px bg-[#D4AF7A]/70" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF7A] font-medium">
              Care Defined By Integrity
            </span>
            <div className="w-6 h-px bg-[#D4AF7A]/70" />
          </div>
        </div>

        {/* Expired Opportunity Card */}
        <div className="w-full max-w-md relative z-10 mb-12">
          <div className="bg-[#FAF7F2] text-[#0A1629] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EAE2D2] relative pt-10 text-center">
            {/* Floating Chain Link Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-[#E0D5C1] shadow-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-[#B88E3E]" strokeWidth={2.4} />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#0A1629] leading-tight">
              This care opportunity is no longer available
            </h2>

            <p className="text-xs text-[#6B5E47] leading-relaxed mt-3">
              This shared care request link has expired or the placement has already been
              confirmed and fulfilled.
            </p>

            <div className="p-3.5 my-5 rounded-2xl bg-[#F4EDE0] border border-[#E5DEC9] text-left text-xs space-y-1.5 text-[#5C5549]">
              <div className="flex items-center gap-2 font-bold text-[#0A1629]">
                <Shield className="w-4 h-4 text-[#B88E3E]" />
                <span>Placement Security &amp; Expiry Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                To protect client privacy and ensure real-time carer availability, all external
                links automatically expire after 72 hours, or immediately upon carer placement
                confirmation.
              </p>
            </div>

            <p className="text-xs text-[#6B5E47] leading-relaxed">
              If you are a registered live-in carer looking for available placements, or would like
              to register with Grace &amp; Goodwill, please contact our placement team:
            </p>

            {/* Direct Contact Actions */}
            <div className="space-y-2.5 mt-5">
              <a
                href="tel:02045240108"
                className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#060D1E] text-white border border-[#D4AF7A]/40 shadow-sm hover:brightness-110 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF7A]/15 flex items-center justify-center text-[#D4AF7A]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white">Call Placement Team</div>
                    <div className="text-[11px] text-[#D4AF7A]">020 4524 0108</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D4AF7A] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="mailto:info@graceandgoodwill.co.uk?subject=Live-in Care Placement Enquiry"
                className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white text-[#0A1629] border border-[#DFD5C2] shadow-xs hover:bg-[#F3ECE0] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0A1629]/10 flex items-center justify-center text-[#0A1629]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-[#0A1629]">Email Placement Team</div>
                    <div className="text-[11px] text-[#64748B]">info@graceandgoodwill.co.uk</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#0A1629] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. ACTIVE ANONYMOUS CARE OPPORTUNITY VIEW
  // ─────────────────────────────────────────────────────────────
  const accommodationPhotos = careRequest.accommodation?.photoItems?.filter(
    (p) => p.status === 'approved'
  ) || [];

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInterestSubmitted(true);
    setInterestModalOpen(false);
    if (onExpressInterest) onExpressInterest();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1E293B] antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#060D1E] text-white border-b border-[#D4AF7A]/30 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-2 text-xs text-[#D4AF7A] hover:text-[#EBD8B2] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Back</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-[#D4AF7A]/20 border border-[#D4AF7A]/40 flex items-center justify-center text-[#D4AF7A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-[#D4AF7A] uppercase">
                Grace &amp; Goodwill
              </div>
              <div className="text-[9px] tracking-widest text-slate-300 uppercase">
                Care Defined By Integrity
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF7A]/20 border border-[#D4AF7A]/40 text-[#F6E3BA]">
              <Clock className="w-3.5 h-3.5" />
              <span>Available for ~{remainingHours}h</span>
            </span>
            <a
              href="tel:02045240108"
              className="px-3.5 py-1.5 rounded-full bg-[#C8A464] hover:bg-[#B89352] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>020 4524 0108</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner with Status & Privacy Guarantee */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0A1629] to-[#152744] text-white p-5 sm:p-6 shadow-md border border-[#C8A464]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C8A464]/20 border border-[#C8A464]/40 text-[#D4AF7A] text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Verified 72-Hour Live-in Care Opportunity</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Live-in Care Opportunity &mdash; {careRequest.location}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Grace &amp; Goodwill is introducing an approved live-in carer for an upcoming{' '}
              {careRequest.placementType.toLowerCase()} placement in {careRequest.location}.
            </p>
          </div>

          <button
            onClick={() => setInterestModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-[#0A1629] font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            Express Interest in Placement &rarr;
          </button>
        </div>

        {/* Remuneration & Key Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Weekly Carer Fee */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D2] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Weekly Carer Fee</span>
              <Coins className="w-4 h-4 text-[#C8A464]" />
            </div>
            <div className="text-2xl font-bold text-[#0A1629] tabular-nums">
              £{careRequest.weeklyPayment}
              <span className="text-xs font-normal text-[#64748B]"> / week</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Guaranteed payment for agreed dates
            </p>
          </div>

          {/* 2. Food Allowance */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D2] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Food Allowance</span>
              <Utensils className="w-4 h-4 text-[#C8A464]" />
            </div>
            <div className="text-2xl font-bold text-[#0A1629] tabular-nums">
              £{careRequest.foodAllowance}
              <span className="text-xs font-normal text-[#64748B]"> / week</span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Provided for grocery &amp; food needs
            </p>
          </div>

          {/* 3. Placement Type & Duration */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D2] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Placement Type</span>
              <Building className="w-4 h-4 text-[#C8A464]" />
            </div>
            <div className="text-base font-bold text-[#0A1629] truncate">
              {careRequest.placementType}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium">
              Duration: {careRequest.duration}
            </p>
          </div>

          {/* 4. Start Date */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D2] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Preferred Start</span>
              <Calendar className="w-4 h-4 text-[#C8A464]" />
            </div>
            <div className="text-base font-bold text-[#0A1629]">
              {careRequest.preferredStart}
            </div>
            <p className="text-[11px] text-amber-700 font-medium">
              Location: {careRequest.location}
            </p>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Care Requirements, Personal Care, Mobility */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Medical Concerns & Care Summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE2D2] shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EAE1]">
                <Heart className="w-5 h-5 text-[#C8A464]" />
                <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                  Main Care &amp; Health Requirements
                </h3>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#64748B] block mb-2">
                  Primary Medical Conditions &amp; Support Needs
                </span>
                <div className="flex flex-wrap gap-2">
                  {careRequest.conditions.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF4E8] text-[#8C6D2B] border border-[#E8DEC8]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                {careRequest.conditionsNotes && (
                  <p className="text-xs text-[#475569] mt-2.5 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE8DC]">
                    {careRequest.conditionsNotes}
                  </p>
                )}
              </div>

              {/* Personal Care Requirements */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#64748B] block mb-2">
                  Personal Care Support Required
                </span>
                <div className="flex flex-wrap gap-2">
                  {careRequest.personalCare.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8F5EE] text-[#0A1629] border border-[#DFD5C2] inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
                {careRequest.personalCareNotes && (
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    <strong>Routine Notes:</strong> {careRequest.personalCareNotes}
                  </p>
                )}
              </div>

              {/* Mobility Support */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#64748B] block mb-1">
                  Mobility &amp; Handling
                </span>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1 text-xs">
                  <div className="font-bold text-[#0A1629]">
                    Level: {careRequest.mobilityLevel}
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    {careRequest.mobilityDetails || 'Independent transfers with walking aid.'}
                  </p>
                  {careRequest.aids && careRequest.aids.length > 0 && (
                    <div className="text-[11px] text-[#64748B] pt-1">
                      <strong>Aids present:</strong> {careRequest.aids.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About Client & Lifestyle Routines */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE2D2] shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                Lifestyle, Routines &amp; Companionship
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {careRequest.aboutClient}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block text-[11px]">Pets</span>
                  <span className="font-bold text-[#0A1629]">{careRequest.pets}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block text-[11px]">Smoking</span>
                  <span className="font-bold text-[#0A1629]">{careRequest.smoking}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <span className="text-[#64748B] block text-[11px]">Interests</span>
                  <span className="font-bold text-[#0A1629]">
                    {careRequest.interests.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Accommodation, Privacy Notice, Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live-in Carer Accommodation Standards */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE2D2] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0EAE1]">
                <BedDouble className="w-5 h-5 text-[#C8A464]" />
                <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                  Carer Living &amp; Accommodation
                </h3>
              </div>

              {/* Compulsory Private Bedroom Confirmation */}
              <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Mandatory Requirement Confirmed:</strong> The live-in carer will have
                  their own private bedroom (sole occupancy) for the full duration of the
                  placement.
                </div>
              </div>

              {/* Bathroom & Shower Arrangements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block text-[11px] font-medium">
                    Bathroom Arrangements
                  </span>
                  <span className="font-bold text-[#0A1629]">
                    {careRequest.accommodation.bathroomType}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-1">
                  <span className="text-[#64748B] block text-[11px] font-medium">
                    Shower Arrangements
                  </span>
                  <span className="font-bold text-[#0A1629]">
                    {careRequest.accommodation.showerType}
                  </span>
                </div>
              </div>

              {careRequest.accommodation.householdNotes && (
                <p className="text-xs text-[#5C5549] leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE2D2]">
                  {careRequest.accommodation.householdNotes}
                </p>
              )}

              {/* Optional Approved Accommodation Photos */}
              {accommodationPhotos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-[#0A1629] block">
                    Accommodation Photographs
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {accommodationPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-xl overflow-hidden border border-[#EAE2D2] aspect-4/3 relative group bg-slate-100"
                      >
                        <img
                          src={photo.url}
                          alt={photo.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0A1629]/80 text-white text-[10px] font-medium">
                          {photo.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy & Safeguarding Notice */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E5DEC9] space-y-2.5 text-xs text-[#5C5549]">
              <div className="flex items-center gap-2 font-bold text-[#0A1629]">
                <Shield className="w-4 h-4 text-[#C8A464]" />
                <span>Safeguarding &amp; Confidentiality Notice</span>
              </div>
              <p className="text-[11.5px] leading-relaxed">
                Full client name, telephone numbers, and street address are protected and will
                only be released to the assigned carer 7 days prior to placement commencement (or
                immediately for urgent placements) after formal confirmation and signed agreements.
              </p>
            </div>

            {/* Application / Express Interest Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#C8A464] shadow-md space-y-3.5 text-center">
              <h4 className="font-serif text-lg font-bold text-[#0A1629]">
                Interested in this Live-in Placement?
              </h4>
              <p className="text-xs text-[#64748B]">
                Express interest now to notify Grace &amp; Goodwill placement coordinators.
              </p>

              {interestSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your interest has been registered with Admin.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInterestModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#0A1629] hover:bg-[#15233D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Express Interest
                </button>
              )}

              <div className="pt-2 text-[11px] text-[#64748B]">
                Or call directly:{' '}
                <a href="tel:02045240108" className="font-bold text-[#0A1629] underline">
                  020 4524 0108
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Express Interest Modal */}
      {interestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1629]/75 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] text-[#0A1629] w-full max-w-md rounded-3xl p-6 border border-[#E8DEC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D2]">
              <h3 className="font-serif text-lg font-bold text-[#0A1629]">
                Express Interest in Placement
              </h3>
              <button
                onClick={() => setInterestModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInterestSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0A1629] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={carerName}
                  onChange={(e) => setCarerName(e.target.value)}
                  placeholder="e.g. Anita Kovacs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0A1629] mb-1">Telephone Number</label>
                <input
                  type="tel"
                  required
                  value={carerPhone}
                  onChange={(e) => setCarerPhone(e.target.value)}
                  placeholder="e.g. 07700 900123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0A1629] mb-1">
                  Availability &amp; Relevant Experience (Optional)
                </label>
                <textarea
                  rows={3}
                  value={carerNotes}
                  onChange={(e) => setCarerNotes(e.target.value)}
                  placeholder="Available from start date, experienced with dementia and mobility support..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C8A464]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] text-[11px] text-[#8C6D2B]">
                Your interest will be immediately received by the Grace &amp; Goodwill Admin team.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Interest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
