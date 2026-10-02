"use client";

import React, { useState } from "react";
import {
  MapPin,
  Stethoscope,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export interface MatchBreakdownProps {
  score?: number | null;
  breakdown?: {
    location?: {
      score?: number;
      maxScore?: number;
      distanceMiles?: number | null;
      maxTravelDistance?: number;
      withinRadius?: boolean | null;
      city?: string | null;
      summary?: string;
    };
    careType?: {
      score?: number;
      maxScore?: number;
      matched?: string[];
      requested?: string[];
      summary?: string;
    };
    availability?: {
      score?: number;
      maxScore?: number;
      status?: string;
      summary?: string;
    };
  } | null;
  compact?: boolean;
}

export function MatchScoreBadge({ score }: { score?: number | null }) {
  if (score === null || score === undefined) return null;

  const isHigh = score >= 80;
  const isMed = score >= 60 && score < 80;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide border shadow-sm transition-all ${
        isHigh
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/35 ring-1 ring-emerald-500/20"
          : isMed
          ? "bg-amber-500/15 text-amber-300 border-amber-500/35 ring-1 ring-amber-500/20"
          : "bg-navy-950/80 text-gold-200/80 border-gold-300/20"
      }`}
      title={`Overall Compatibility: ${score}% match`}
    >
      <Sparkles className={`w-3.5 h-3.5 ${isHigh ? "text-emerald-400" : isMed ? "text-amber-400" : "text-gold-400"}`} />
      <span>{score}% Match</span>
    </div>
  );
}

export default function CompatibilityBreakdown({
  score,
  breakdown,
  compact = false,
}: MatchBreakdownProps) {
  const [expanded, setExpanded] = useState(false);

  if (!breakdown && (score === null || score === undefined)) {
    return null;
  }

  const loc = breakdown?.location;
  const care = breakdown?.careType;
  const avail = breakdown?.availability;

  const locText = loc?.distanceMiles !== null && loc?.distanceMiles !== undefined
    ? `${loc.distanceMiles} mi away`
    : loc?.city
    ? loc.city
    : "Location pending";

  const careText = care?.matched && care.matched.length > 0
    ? `${care.matched.length} skill${care.matched.length > 1 ? "s" : ""} matched`
    : care?.requested && care.requested.length > 0
    ? "General skills"
    : "Care matched";

  const availText = avail?.status || "Available";

  return (
    <div className="w-full space-y-2 mt-2">
      {/* Micro-pills overview row */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-navy-950/60 p-2 sm:px-3 rounded-xl border border-gold-300/10">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {/* Location Pill */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${
              loc?.withinRadius
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                : "bg-navy-900 text-gold-100/70 border-gold-300/10"
            }`}
            title={loc?.summary || locText}
          >
            <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
            <span>{locText}</span>
          </div>

          {/* Care Type Pill */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${
              care?.matched && care.matched.length > 0
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                : "bg-navy-900 text-gold-100/70 border-gold-300/10"
            }`}
            title={care?.summary || careText}
          >
            <Stethoscope className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{careText}</span>
          </div>

          {/* Availability Pill */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border bg-navy-900 text-gold-100/70 border-gold-300/10"
            title={avail?.summary || availText}
          >
            <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{availText}</span>
          </div>
        </div>

        {/* Expand / Collapse Toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-gold-300/80 hover:text-gold-DEFAULT flex items-center gap-1 transition-colors px-1 py-0.5 rounded hover:bg-gold-300/5 cursor-pointer ml-auto"
        >
          <span>{expanded ? "Hide Match Details" : "Why it matches"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Accordion Details */}
      {expanded && (
        <div className="p-3.5 rounded-xl border border-gold-300/15 bg-navy-950/80 space-y-2.5 text-xs text-gold-100/80 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gold-300/10 pb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-gold-300/70 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Compatibility Breakdown
            </span>
            {score !== null && score !== undefined && (
              <span className="text-xs font-mono font-bold text-gold-DEFAULT">
                Total: {score} / 100
              </span>
            )}
          </div>

          {/* 1. Location Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-400" /> Location & Travel Radius (40%)
              </span>
              <span className="font-mono text-gold-300">
                {loc?.score !== undefined ? `${loc.score} / ${loc.maxScore || 40} pts` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/60 pl-4">
              {loc?.summary || "Location distance calculation completed."}
            </p>
          </div>

          {/* 2. Care Type Details */}
          <div className="space-y-1 pt-1 border-t border-gold-300/5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-blue-400" /> Care Specialization & Needs (40%)
              </span>
              <span className="font-mono text-gold-300">
                {care?.score !== undefined ? `${care.score} / ${care.maxScore || 40} pts` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/60 pl-4">
              {care?.summary || "Specialties aligned with care requirements."}
            </p>
            {care?.matched && care.matched.length > 0 && (
              <div className="flex flex-wrap gap-1 pl-4 pt-0.5">
                {care.matched.map((m, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. Availability Details */}
          <div className="space-y-1 pt-1 border-t border-gold-300/5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Availability & Schedule (20%)
              </span>
              <span className="font-mono text-gold-300">
                {avail?.score !== undefined ? `${avail.score} / ${avail.maxScore || 20} pts` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/60 pl-4">
              {avail?.summary || "Schedule availability aligned."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
