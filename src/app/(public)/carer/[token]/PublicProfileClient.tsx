"use client";

import { useEffect, useState, useMemo } from "react";
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
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";
import shareableProfileService, {
  PublicCarerProfile,
} from "@/services/carer/shareableProfile.service";
import { publicService } from "@/services/public.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import ThinSpinner from "@/components/ThinSpinner";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ExpiredProfileCard from "@/components/share-profile/ExpiredProfileCard";

interface ParsedRange {
  startDate: string;
  endDate: string;
  formatted: string;
  totalDays: number;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatIsoDate(dateStr: string): string {
  if (!dateStr) return "";
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);
  const month = MONTH_NAMES[m - 1] || "";
  return `${d} ${month} ${y}`;
}

function normalizeAvailabilityRanges(profile: PublicCarerProfile | null): ParsedRange[] {
  if (!profile) return [];

  const raw = profile.availabilityRanges || profile.availability;
  if (!raw) return [];

  let list: any[] = raw;
  if (typeof list === "string") {
    try {
      list = JSON.parse(list);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list) || list.length === 0) return [];

  // Case A: Array of range objects with startDate / start / from
  if (
    typeof list[0] === "object" &&
    list[0] !== null &&
    ("startDate" in list[0] || "start" in list[0] || "from" in list[0])
  ) {
    return list.map((item) => {
      const start = item.startDate || item.start || item.from || "";
      const end = item.endDate || item.end || item.to || start;
      const formatted =
        item.formatted ||
        (start === end
          ? formatIsoDate(start)
          : `${formatIsoDate(start)} – ${formatIsoDate(end)}`);

      let totalDays = item.totalDays;
      if (!totalDays && start && end) {
        const sMatch = String(start).match(/^(\d{4})-(\d{2})-(\d{2})/);
        const eMatch = String(end).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (sMatch && eMatch) {
          const sTime = Date.UTC(
            parseInt(sMatch[1], 10),
            parseInt(sMatch[2], 10) - 1,
            parseInt(sMatch[3], 10),
          );
          const eTime = Date.UTC(
            parseInt(eMatch[1], 10),
            parseInt(eMatch[2], 10) - 1,
            parseInt(eMatch[3], 10),
          );
          totalDays = Math.max(
            1,
            Math.round((eTime - sTime) / (1000 * 60 * 60 * 24)) + 1,
          );
        }
      }

      return {
        startDate: start,
        endDate: end,
        formatted,
        totalDays: totalDays || 1,
      };
    });
  }

  // Case B: Array of date strings e.g. ["2026-06-01", "2026-06-02", ...]
  if (typeof list[0] === "string") {
    const dates: string[] = [];
    for (const item of list) {
      if (typeof item === "string") {
        const m = item.trim().match(/^\d{4}-\d{2}-\d{2}/);
        if (m) dates.push(m[0]);
      }
    }
    const uniqueSorted = Array.from(new Set(dates)).sort();
    if (uniqueSorted.length === 0) return [];

    const getNextDayIso = (isoDate: string): string => {
      const [y, m, d] = isoDate.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d + 1));
      const ny = dt.getUTCFullYear();
      const nm = String(dt.getUTCMonth() + 1).padStart(2, "0");
      const nd = String(dt.getUTCDate()).padStart(2, "0");
      return `${ny}-${nm}-${nd}`;
    };

    const ranges: ParsedRange[] = [];
    let currentStart = uniqueSorted[0];
    let currentEnd = uniqueSorted[0];

    for (let i = 1; i < uniqueSorted.length; i++) {
      if (uniqueSorted[i] === getNextDayIso(currentEnd)) {
        currentEnd = uniqueSorted[i];
      } else {
        const formatted =
          currentStart === currentEnd
            ? formatIsoDate(currentStart)
            : `${formatIsoDate(currentStart)} – ${formatIsoDate(currentEnd)}`;
        const [sy, sm, sd] = currentStart.split("-").map(Number);
        const [ey, em, ed] = currentEnd.split("-").map(Number);
        const days = Math.max(
          1,
          Math.round(
            (Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) /
              (1000 * 60 * 60 * 24),
          ) + 1,
        );
        ranges.push({
          startDate: currentStart,
          endDate: currentEnd,
          formatted,
          totalDays: days,
        });
        currentStart = uniqueSorted[i];
        currentEnd = uniqueSorted[i];
      }
    }
    const formatted =
      currentStart === currentEnd
        ? formatIsoDate(currentStart)
        : `${formatIsoDate(currentStart)} – ${formatIsoDate(currentEnd)}`;
    const [sy, sm, sd] = currentStart.split("-").map(Number);
    const [ey, em, ed] = currentEnd.split("-").map(Number);
    const days = Math.max(
      1,
      Math.round(
        (Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) /
          (1000 * 60 * 60 * 24),
      ) + 1,
    );
    ranges.push({
      startDate: currentStart,
      endDate: currentEnd,
      formatted,
      totalDays: days,
    });
    return ranges;
  }

  return [];
}

interface PublicProfileClientProps {
  token: string;
}

export default function PublicProfileClient({ token }: PublicProfileClientProps) {
  const [profile, setProfile] = useState<PublicCarerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Normalize placement availability date ranges
  const availabilityRanges = useMemo(() => {
    return normalizeAvailabilityRanges(profile);
  }, [profile]);

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
  const isExpired = error || !profile || profile.isActive === false || (profile.expiresAt && new Date(profile.expiresAt) < new Date());

  if (isExpired) {
    return (
      <main
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#0d1b3e" }}
      >
        {/* ── Brand Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#0d1b3e" }}>
          <img
            src="/website_logo.png"
            alt="Grace & Goodwill"
            className="h-10 w-auto object-contain"
          />
          <p
            className="text-xs font-light italic text-right leading-tight hidden sm:block"
            style={{ color: "#c8a96e", maxWidth: 120 }}
          >
            Care<br />You Can<br />Trust
          </p>
        </header>

        {/* ── Wavy Hero Band ──────────────────────────────────────────────── */}
        <div className="w-full relative" style={{ height: 100 }}>
          {/* Solid navy background */}
          <div className="absolute inset-0" style={{ backgroundColor: "#0d1b3e" }} />
          {/* Smooth organic wave — cream fill, no sharp peaks */}
          <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
            <svg
              viewBox="0 0 1440 72"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ height: 72, display: "block" }}
            >
              {/* Smooth wave: quadratic bezier, y stays between 20-60, never touches edges */}
              <path
                d="M0,52 Q240,20 480,48 Q720,72 960,36 Q1200,16 1440,44 L1440,72 L0,72 Z"
                fill="#f5f0e8"
              />
            </svg>
          </div>
        </div>

        {/* ── Main Card ────────────────────────────────────────────────── */}
        <ExpiredProfileCard />
      </main>
    );
  }

  // Check whether intro video URL exists and is non-empty
  const hasIntroVideo = Boolean(
    profile.introVideoUrl &&
      typeof profile.introVideoUrl === "string" &&
      profile.introVideoUrl.trim() !== "" &&
      profile.introVideoUrl.trim().toLowerCase() !== "null" &&
      profile.introVideoUrl.trim().toLowerCase() !== "undefined",
  );

  return (
    <main className="min-h-screen bg-navy-950 text-gold-100 pb-16">
      {/* ── Hero Profile Header ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900/80 via-navy-950 to-navy-950 border-b border-gold-300/10 pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar / Photo - Circle Profile Box */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-gold-DEFAULT/40 shadow-2xl bg-navy-900 flex items-center justify-center text-4xl sm:text-5xl font-bold text-gold-DEFAULT">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {profile.displayName
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Summary Info: Name -> Verified Icon -> Compliance -> Experience */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-gold-50 tracking-tight">
                {profile.displayName}
              </h1>

              {/* 1. Verified Icon below name */}
              <div className="flex items-center justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold px-3.5 py-1 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Carer</span>
                </span>
              </div>

              {/* 2. Compliance below verified */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm font-medium text-gold-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Compliance Verified by Grace &amp; Goodwill</span>
              </div>

              {/* 3. Experience below compliance */}
              {profile.experienceYears !== undefined && profile.experienceYears > 0 && (
                <p className="text-sm sm:text-base text-gold-100/90 font-medium pt-0.5">
                  <span className="text-gold-200 font-semibold">Experience:</span>{" "}
                  <span className="text-gold-50 font-bold">{profile.experienceYears}+ Years</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Profile Details ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Introductory Video Section - Only shown if video intro exists and is not empty */}
        {hasIntroVideo && !videoError && (
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
                onError={() => setVideoError(true)}
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

        {/* Carer Placement Availability */}
        {profile && (
          <section className="bg-navy-900/40 border border-gold-300/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gold-50 font-serif">
                  Carer Availability
                </h2>
                <p className="text-xs text-gold-100/60">
                  Confirmed placement availability dates for live-in care
                </p>
              </div>
            </div>

            {availabilityRanges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {availabilityRanges.map((range, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-3 sm:p-3.5 bg-navy-800/60 border border-gold-300/15 hover:border-gold-300/35 transition shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available
                      </span>
                      {range.totalDays && range.totalDays > 0 ? (
                        <span className="text-[10px] font-medium text-gold-200/80 bg-gold-DEFAULT/10 border border-gold-DEFAULT/15 px-2 py-0.5 rounded-full">
                          {range.totalDays} {range.totalDays === 1 ? "day" : "days"}
                        </span>
                      ) : null}
                    </div>

                    {/* From and To Date Display */}
                    <div className="bg-navy-950/60 rounded-lg px-3 py-2 border border-gold-300/10 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-[9px] uppercase font-bold text-gold-300/60 tracking-wider">
                          From
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold text-gold-50 truncate block leading-tight">
                          {formatIsoDate(range.startDate)}
                        </span>
                      </div>

                      <div className="shrink-0 text-gold-DEFAULT/60 px-1 flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0 text-right">
                        <span className="block text-[9px] uppercase font-bold text-gold-300/60 tracking-wider">
                          To
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold text-gold-50 truncate block leading-tight">
                          {formatIsoDate(range.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl p-5 bg-navy-950/40 border border-gold-300/10 text-center space-y-2">
                <p className="text-sm text-gold-100/80 font-medium">
                  No specific placement dates currently listed.
                </p>
                <p className="text-xs text-gold-100/60">
                  Please contact Grace &amp; Goodwill directly to enquire about upcoming availability for {profile.displayName}.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Full Compliance Statement Block */}
        {/* <section className="bg-gradient-to-br from-emerald-950/40 via-navy-900/60 to-navy-900/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-elegant flex flex-col sm:flex-row items-start sm:items-center gap-5">
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
        </section> */}

        {/* ── Contact Grace & Goodwill Section ─────────────────────── */}
        <section className="bg-gradient-to-b from-navy-900/60 to-navy-950/80 border border-gold-300/15 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-gold-50 tracking-tight">
              Contact Grace &amp; Goodwill
            </h2>
            <p className="text-xs sm:text-sm text-gold-100/70 leading-relaxed">
              Speak directly with our dedicated care management team to enquire about live-in care arrangements with{" "}
              <span className="text-gold-200 font-semibold">{profile.displayName}</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
            {/* Phone Button */}
            <a
              href="tel:02045240108"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-navy-950/90 border border-gold-300/20 hover:border-gold-300/45 text-gold-100 hover:text-gold-50 font-semibold text-xs sm:text-sm shadow-md transition duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase font-bold text-gold-300/60 tracking-wider">
                  Office Number
                </span>
                <span className="text-sm font-bold text-gold-100">020 4524 0108</span>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={`https://api.whatsapp.com/send?phone=447462931949&text=${encodeURIComponent(
                `Hello Grace & Goodwill, I am interested in carer ${profile.displayName}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-200 hover:text-emerald-100 font-semibold text-xs sm:text-sm shadow-md transition duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase font-bold text-emerald-400/80 tracking-wider">
                  WhatsApp Us
                </span>
                <span className="text-sm font-bold text-emerald-100">+44 7462 931949</span>
              </div>
            </a>

            {/* Request Introduction Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 hover:brightness-105 font-bold text-xs sm:text-sm shadow-md transition duration-200 cursor-pointer"
            >
              <span>Request Introduction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
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
