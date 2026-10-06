"use client";

import { Plane, Bell, FileText, CheckCircle2, Calendar } from "lucide-react";

const TIMELINE_STEPS = [
  {
    step: 1,
    title: "Primary carer books holiday",
    description: "Primary carer enters unavailable dates / holiday in their portal.",
    icon: Plane,
    color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
  },
  {
    step: 2,
    title: "Admin is notified",
    description: "Our coordination team reviews the designated preferred relief/backup carer.",
    icon: Bell,
    color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
  },
  {
    step: 3,
    title: "Relief opportunity offered",
    description: "You receive the placement opportunity and can accept or decline independently.",
    icon: FileText,
    color: "from-gold/20 to-gold/5 text-gold-300 border-gold/30",
  },
  {
    step: 4,
    title: "Carer accepts",
    description: "Once accepted and agreements signed, you become the Active Relief Carer for those dates.",
    icon: CheckCircle2,
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
  },
  {
    step: 5,
    title: "Relief placement begins",
    description: "You arrive and provide quality live-in care for the agreed dates.",
    icon: Calendar,
    color: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30",
  },
];

export default function PlacementTimeline({
  currentStep = 3,
  className = "",
}: {
  currentStep?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gold-300/20 bg-navy-900/60 p-6 shadow-lg space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
        <div>
          <h4 className="text-sm font-bold text-gold-200 uppercase tracking-wider">
            Placement Process Timeline
          </h4>
          <p className="text-xs text-gold-100/60 mt-0.5">
            How a carer’s status transitions through the relief workflow
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Continuous timeline line */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-500 via-gold to-emerald-500 z-0 opacity-30" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {TIMELINE_STEPS.map((item) => {
            const Icon = item.icon;
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <div
                key={item.step}
                className="flex md:flex-col items-start md:items-center text-left md:text-center gap-3.5 p-3 rounded-xl bg-navy-950/40 border border-gold-300/5 hover:border-gold-300/20 transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-md bg-gradient-to-b ${item.color} ${
                    isCurrent ? "ring-2 ring-gold shadow-gold/20" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 md:justify-center">
                    <span className="text-[10px] font-bold text-gold-300/80 bg-gold-300/10 px-1.5 py-0.2 rounded">
                      Step {item.step}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white leading-snug">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-gold-100/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
