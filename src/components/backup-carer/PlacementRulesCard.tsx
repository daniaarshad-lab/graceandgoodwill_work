"use client";

import { CheckCircle2, AlertTriangle, XCircle, PhoneCall, ShieldAlert } from "lucide-react";

export default function PlacementRulesCard({ className = "" }: { className?: string }) {
  const allowedRules = [
    "You can accept or decline a relief placement offer independently.",
    "You can withdraw through the platform up to 3 days before the start date.",
    "You can be a preferred relief/backup carer for more than one client.",
    "You can become the primary carer if the current primary permanently withdraws (subject to client agreement and availability).",
    "You will only be offered relief dates when you are free (the system checks your calendar).",
    "No extra charge to the client for designating a preferred backup carer.",
  ];

  const restrictedRules = [
    "You cannot withdraw within 3 days of the start date. Please contact Grace & Goodwill directly.",
    "You cannot resign or withdraw once the placement has commenced. Please contact Grace & Goodwill directly.",
    "You will not be offered relief placements if you are already on another live-in placement during those dates.",
  ];

  return (
    <div
      className={`rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 p-6 shadow-xl space-y-6 ${className}`}
    >
      <div className="border-b border-gold-300/10 pb-3">
        <h4 className="text-base font-bold text-gold-200">
          Placement Rules & Guidelines
        </h4>
        <p className="text-xs text-gold-100/60 mt-0.5">
          Clear guidance for carers to ensure client safety and seamless relief coordination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What You Can Do */}
        <div className="space-y-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>What You Can Do</span>
          </div>

          <ul className="space-y-2.5">
            {allowedRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gold-100/90 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Restrictions */}
        <div className="space-y-3 p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Important Guardrails</span>
          </div>

          <ul className="space-y-2.5">
            {restrictedRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-rose-200/90 leading-relaxed">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[11px] text-rose-300/80">
            <span>Direct phone support:</span>
            <a
              href="tel:+442031234567"
              className="inline-flex items-center gap-1 font-bold text-rose-300 hover:text-white underline"
            >
              <PhoneCall className="w-3 h-3" /> +44 20 3123 4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
