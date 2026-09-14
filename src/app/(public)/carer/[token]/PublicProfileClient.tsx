"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Globe,
  Award,
  Video,
  Phone,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import shareableProfileService, {
  PublicCarerProfile,
} from "@/services/carer/shareableProfile.service";
import { publicService } from "@/services/public.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import ThinSpinner from "@/components/ThinSpinner";

interface PublicProfileClientProps {
  token: string;
}

export default function PublicProfileClient({ token }: PublicProfileClientProps) {
  const [profile, setProfile] = useState<PublicCarerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Request introduction form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [careNeeds, setCareNeeds] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await shareableProfileService.getPublicProfile(token);
        setProfile(data);
      } catch (err: any) {
        setError(
          err.message ||
            "This share link has expired or does not exist. For security, share links remain valid for 30 minutes.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSendIntroductionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      showErrorToast(
        "Required Fields",
        "Please provide your name and phone number so we can contact you.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await publicService.submitContactForm({
        name: clientName.trim(),
        phoneNumber: clientPhone.trim(),
        email: clientEmail.trim() || "not-provided@client.local",
        subject: `Introduction Request for Carer ${profile?.displayName || "Profile"} (Ref: ${token})`,
        message: `Client requested an introduction with carer ${profile?.displayName || "Profile"}.\n\nClient Phone: ${clientPhone.trim()}\nClient Email: ${clientEmail.trim() || "Not provided"}\n\nCare Needs & Message:\n${careNeeds.trim() || "None specified."}`,
      });

      setRequestSent(true);
      showSuccessToast(
        "Request Sent",
        "Our care managers have received your request and will contact you promptly.",
      );
    } catch (err: any) {
      showErrorToast(
        "Submission Failed",
        err.message || "Failed to submit request. Please try contacting us by phone.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading Skeleton ───────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 py-16 px-4 sm:px-6 lg:px-8 text-gold-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl space-y-8 animate-pulse">
          <div className="h-64 rounded-3xl bg-navy-900/60 border border-gold-300/10 flex items-center justify-center">
            <ThinSpinner size="lg" text="Loading carer profile..." />
          </div>
          <div className="h-40 rounded-2xl bg-navy-900/40 border border-gold-300/10" />
          <div className="h-40 rounded-2xl bg-navy-900/40 border border-gold-300/10" />
        </div>
      </main>
    );
  }

  // ── Error / Expired State ──────────────────────────────────────────
  if (error || !profile) {
    return (
      <main className="min-h-screen bg-navy-950 py-20 px-4 sm:px-6 lg:px-8 text-gold-100 flex items-center justify-center">
        <div className="max-w-lg w-full bg-navy-900/70 border border-gold-300/15 rounded-3xl p-8 sm:p-10 text-center shadow-2xl backdrop-blur-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center mx-auto text-gold-DEFAULT">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gold-50">
              Link Expired or Invalid
            </h1>
            <p className="text-sm text-gold-100/70 mt-3 leading-relaxed">
              {error ||
                "For the privacy and protection of our carers, profile share links expire after 30 minutes."}
            </p>
          </div>

          <div className="bg-navy-950/60 border border-gold-300/10 rounded-2xl p-4 text-left space-y-2 text-xs text-gold-100/60">
            <p className="font-semibold text-gold-200">What can you do?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ask the carer to generate a fresh share link.</li>
              <li>Contact Grace &amp; Goodwill directly to enquire about available live-in carers.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/contact"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 font-bold text-sm text-center shadow-lg hover:brightness-105 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl border border-gold-300/20 text-gold-200 font-semibold text-sm text-center hover:bg-gold-DEFAULT/10 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-950 text-gold-100 pb-28">
      {/* ── Top Grace & Goodwill Verified Banner ─────────────────────── */}
      <div className="bg-navy-900/90 border-b border-gold-300/10 py-2.5 px-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gold-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Compliance Checked by Grace &amp; Goodwill™</span>
          </div>
          <a
            href="tel:02045240108"
            className="text-xs text-gold-300/80 hover:text-gold-200 flex items-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support:</span> 020 4524 0108
          </a>
        </div>
      </div>

      {/* ── Hero Profile Header ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900/80 via-navy-950 to-navy-950 border-b border-gold-300/10 pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar / Photo */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-gold-DEFAULT/40 shadow-2xl bg-navy-900 flex items-center justify-center text-4xl sm:text-5xl font-bold text-gold-DEFAULT">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{profile.displayName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Carer
              </div>
            </div>

            {/* Profile Summary Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 text-gold-200 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Approved Professional Carer
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-gold-50 tracking-tight">
                  {profile.displayName}
                </h1>
                <p className="text-sm sm:text-base text-gold-100/70 max-w-2xl leading-relaxed">
                  Compliance-checked and registered through Grace &amp; Goodwill Private Care.
                </p>
              </div>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                {profile.experienceYears !== undefined && profile.experienceYears > 0 && (
                  <div className="bg-navy-900/80 border border-gold-300/15 rounded-xl px-3.5 py-2 text-center sm:text-left">
                    <p className="text-[10px] uppercase font-semibold text-gold-300/60 tracking-wider">
                      Experience
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gold-50">
                      {profile.experienceYears}+ Years
                    </p>
                  </div>
                )}
                <div className="bg-navy-900/80 border border-gold-300/15 rounded-xl px-3.5 py-2 text-center sm:text-left">
                  <p className="text-[10px] uppercase font-semibold text-gold-300/60 tracking-wider">
                    DBS Check
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Enhanced DBS
                  </p>
                </div>
                <div className="bg-navy-900/80 border border-gold-300/15 rounded-xl px-3.5 py-2 text-center sm:text-left">
                  <p className="text-[10px] uppercase font-semibold text-gold-300/60 tracking-wider">
                    Insurance
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gold-200">
                    Fully Insured
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Desktop Call To Action */}
            <div className="hidden lg:flex flex-col gap-3 shrink-0 w-64 bg-navy-900/60 border border-gold-300/15 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-gold-50 font-serif">
                Interested in {profile.displayName}?
              </h3>
              <p className="text-xs text-gold-100/65 leading-relaxed">
                Grace &amp; Goodwill will arrange an introduction and answer any care requirements.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 font-bold text-xs shadow-md hover:brightness-105 transition"
              >
                Request an Introduction
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Profile Details ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Introductory Video Section */}
        {profile.introVideoUrl && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  Meet {profile.displayName} — Video Introduction
                </h2>
                <p className="text-xs text-gold-100/60">
                  Hear directly from {profile.displayName} about their care approach.
                </p>
              </div>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-gold-300/15 shadow-2xl">
              <video
                src={profile.introVideoUrl}
                controls
                className="w-full h-full object-contain"
                poster={profile.photoUrl}
              >
                Your browser does not support the video element.
              </video>
            </div>
          </section>
        )}

        {/* Biography / About Me */}
        {profile.summary && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  About {profile.displayName}
                </h2>
                <p className="text-xs text-gold-100/60">
                  Personal biography and background
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gold-100/80 leading-relaxed whitespace-pre-line">
              {profile.summary}
            </p>
          </section>
        )}

        {/* Care Specialties & Skills */}
        {profile.careSpecialties && profile.careSpecialties.length > 0 && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  Care Specialties &amp; Competencies
                </h2>
                <p className="text-xs text-gold-100/60">
                  Areas of care expertise validated by Grace &amp; Goodwill
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {profile.careSpecialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-navy-800/80 border border-gold-300/15 text-gold-100 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT" />
                  {spec}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  Languages Spoken
                </h2>
                <p className="text-xs text-gold-100/60">
                  Languages this carer communicates in
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {profile.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-navy-800/60 border border-indigo-400/20 text-indigo-200 text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                  🌐 {lang}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Availability */}
        {profile.availability && profile.availability.length > 0 && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  Typical Weekly Availability
                </h2>
                <p className="text-xs text-gold-100/60">
                  Current schedule preferences. Exact placement dates confirmed during consultation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
              {profile.availability.map((day, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-3 text-center border transition ${
                    day.enabled
                      ? "bg-navy-800/60 border-gold-300/25 text-gold-50 shadow-sm"
                      : "bg-navy-950/40 border-gold-300/5 text-gold-100/30 opacity-60"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">
                    {day.dayName.slice(0, 3)}
                  </p>
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                      day.enabled
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-navy-900 border border-navy-800 text-gold-100/20"
                    }`}
                  >
                    {day.enabled ? "✓" : "–"}
                  </div>
                  {day.enabled && day.slots && day.slots.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {day.slots.map((slot, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize bg-gold-DEFAULT/10 text-gold-200 border border-gold-DEFAULT/20 truncate"
                        >
                          {slot.shiftType}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gold-100/40">
                      {day.enabled ? "Available" : "Off"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full Compliance Statement Block */}
        <section className="bg-gradient-to-br from-emerald-950/40 via-navy-900/60 to-navy-900/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-lg font-bold text-emerald-200 font-serif">
              Compliance Checked by Grace &amp; Goodwill™
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Every professional carer registered with Grace &amp; Goodwill has been vetted
              through strict UK care standards, including Enhanced DBS vetting, mandatory care
              training certificates, verified professional references, and valid liability insurance.
            </p>
          </div>
        </section>
      </div>

      {/* ── Sticky Bottom CTA Bar ───────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-navy-900/95 border-t border-gold-300/15 py-3.5 px-4 backdrop-blur-lg shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-gold-50 font-serif">
              Interested in {profile.displayName}?
            </p>
            <p className="text-[11px] sm:text-xs text-gold-100/60">
              Request an introduction through Grace &amp; Goodwill Private Care.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/447000000000?text=${encodeURIComponent(
                `Hello, I am interested in carer ${profile.displayName} on Grace & Goodwill.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:02045240108"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-800 border border-gold-300/20 hover:border-gold-300/40 text-gold-100 font-semibold text-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 font-bold text-xs shadow-md hover:brightness-105 transition"
            >
              <span>Request Introduction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Introduction Request Modal ───────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-navy-900 border border-gold-300/20 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-navy-800 border border-gold-300/10 flex items-center justify-center text-gold-100/50 hover:text-gold-50 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {requestSent ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-gold-50">
                  Request Received
                </h3>
                <p className="text-sm text-gold-100/70 leading-relaxed max-w-sm mx-auto">
                  Thank you. Our care coordination team will reach out to you within 24 hours to
                  discuss your care requirements and arrange an introduction with {profile.displayName}.
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setRequestSent(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendIntroductionRequest} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-gold-50">
                    Request an Introduction
                  </h3>
                  <p className="text-xs text-gold-100/60 mt-1">
                    Connect with {profile.displayName} through Grace &amp; Goodwill Private Care.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gold-200">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-gold-300/15 text-gold-50 text-sm focus:border-gold-DEFAULT focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gold-200">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 07700 900123"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-gold-300/15 text-gold-50 text-sm focus:border-gold-DEFAULT focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gold-200">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-gold-300/15 text-gold-50 text-sm focus:border-gold-DEFAULT focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gold-200">
                    Care Requirements or Message
                  </label>
                  <textarea
                    rows={3}
                    value={careNeeds}
                    onChange={(e) => setCareNeeds(e.target.value)}
                    placeholder="Briefly describe what support you or your family require (e.g. live-in companionship, dementia care, respite)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-gold-300/15 text-gold-50 text-sm focus:border-gold-DEFAULT focus:outline-none transition resize-none"
                  />
                </div>

                <p className="text-[11px] text-gold-100/50 leading-relaxed">
                  Grace &amp; Goodwill will contact you directly to discuss care arrangements. Your
                  contact details remain private and are never shared without your permission.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-gold-300/20 text-gold-200 font-semibold text-xs hover:bg-gold-DEFAULT/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 font-bold text-xs shadow-md hover:brightness-105 transition disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
