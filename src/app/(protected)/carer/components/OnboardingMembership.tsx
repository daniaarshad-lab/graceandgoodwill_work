import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Check, Star, Shield, Award, ShieldCheck, X, Sparkles, Medal } from "lucide-react";

interface OnboardingMembershipProps {
  selectedPlan: string | null;
  setSelectedPlan: (plan: string | null) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function OnboardingMembership({
  selectedPlan,
  setSelectedPlan,
  onNext,
  onBack,
  isSubmitting,
}: OnboardingMembershipProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = [
    {
      name: "Free Membership",
      price: "£0",
      period: "Forever",
      icon: Shield,
      tagline: "Join the Grace & Goodwill network and apply for placements without any membership fee.",
      features: [
        "Placement alerts by email",
        "Basic carer profile",
        "Ability to apply for placements",
        "Access to discounted face-to-face training rates",
        "Access to discounted e-learning rates",
      ],
      highlights: [
        "No bank details required",
        "No membership fees",
        "Apply for placements after approval",
      ],
      buttonText: "Create Free Profile",
      badge: "RECOMMENDED ENTRY",
      isFree: true,
      footerText: "No bank details are needed and you will never be charged for this membership.\nYour profile and compliance will be reviewed before approval."
    },
    {
      name: "Gold Elite Membership",
      price: "£29.99",
      period: "month",
      icon: Star,
      tagline: "Premium tier for active professionals seeking first access to placements.",
      features: [
        "Priority placement alerts",
        "First access to premium placements",
        "Emergency placement priority",
        "Featured profile",
        "Certificate storage",
        "Compliance expiry reminders",
        "Professional profile enhancement",
        "Priority compliance review",
        "Enhanced placement opportunities",
        "Advanced training discounts",
        "End of Life Care Pathway",
        "DBS support and guidance",
      ],
      buttonText: "Join Gold Elite",
      badge: "MOST POPULAR",
      isFeatured: true,
    },
    {
      name: "Grace & Goodwill Verified Professional™",
      price: "Additional £10",
      period: "month",
      totalPrice: "£39.99",
      icon: Award,
      tagline: "Requires Gold Elite Membership",
      isVerifiedProfessional: true,
      description: "An earned mark of trust, professionalism and reliability reserved for carers who consistently demonstrate the values of Grace & Goodwill.",
      eligibility: [
        "Active Gold Elite Membership",
        "Minimum 3 consecutive months of active Gold Elite Membership",
        "DBS verified",
        "References verified",
        "Right to Work verified",
        "Mandatory training verified",
        "Compliance review completed",
        "Virtual interview completed",
        "Minimum 3 successful placements completed through Grace & Goodwill",
      ],
      benefits: [
        "Grace & Goodwill Verified Professional™ badge",
        "Contacted first for premium placements",
        "Priority phone calls for suitable placements",
        "Priority email alerts",
        "Priority WhatsApp placement alerts where available",
        "Priority matching opportunities",
        "Appear before all other carers in search results",
        "Featured in client searches",
        "Featured in emergency placements",
        "Priority access to enhanced-rate emergency placements where available",
        "Premium profile highlight with verified frame",
        "Increased visibility across platform",
        "All Gold Elite Membership benefits included",
      ],
      buttonText: "View Requirements & Benefits",
      badge: "Verified Professional™",
      isPremium: true,
    },
  ];

  const comparisonRows = [
    { name: "Apply for placements", free: true, gold: true, verified: true },
    { name: "Premium placements", free: false, gold: true, verified: true },
    { name: "Priority matching", free: false, gold: true, verified: true },
    { name: "Verified badge", free: false, gold: false, verified: true },
    { name: "Featured profile", free: false, gold: true, verified: true },
    { name: "Emergency priority", free: false, gold: true, verified: true },
  ];

  return (
    <div className="space-y-12">
      <SectionCard className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 md:p-8 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
        {/* Page Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h3 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Select Your Professional Path
            </h3>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>
          <p className="text-xs text-gold-100/60 leading-relaxed font-light">
            Select the professional path that fits your career goals. You can upgrade, downgrade, or cancel at any time.
          </p>
        </div>

        {/* 3-Column Membership Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 pt-4 items-stretch">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.name;

            // Common premium button classes
            const getButtonStyles = () => {
              if (isSelected) {
                return "bg-gold-200 text-navy-950 border border-gold-400/40 shadow-[0_4px_15px_rgba(245,212,160,0.25)] hover:bg-gold-100 hover:border-gold-300 hover:shadow-[0_6px_20px_rgba(245,212,160,0.35)] hover:-translate-y-0.5";
              }
              if (plan.isFeatured) {
                return "bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 shadow-[0_4px_15px_rgba(245,212,160,0.2)] hover:shadow-[0_6px_20px_rgba(245,212,160,0.35)] hover:-translate-y-0.5 border border-gold-200/20";
              }
              if (plan.isPremium) {
                return "bg-navy-900 text-gold-200 border border-gold-400/30 hover:border-gold-300 hover:text-gold-100 hover:bg-navy-850 hover:-translate-y-0.5 shadow-md";
              }
              return "bg-navy-800/50 text-gold-100/90 border border-gold-300/10 hover:bg-navy-800 hover:border-gold-300/30 hover:text-gold-50 hover:-translate-y-0.5";
            };

            // Styled Card Treatment
            const getCardStyles = () => {
              if (isSelected) {
                return "border-gold-300 bg-gradient-to-b from-gold-950/20 via-navy-900/60 to-navy-950/80 shadow-[0_0_25px_rgba(212,175,55,0.25)] -translate-y-2 ring-1 ring-gold-200/30";
              }
              if (plan.isFeatured) {
                return "border-gold-400/40 shadow-[0_15px_40px_rgba(212,175,55,0.08)] ring-1 ring-gold-muted/20 scale-[1.02] z-10 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-gold-400/60";
              }
              if (plan.isPremium) {
                return "border-gold-300/20 shadow-xl shadow-navy-950/50 scale-100 opacity-95 hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-400/40 hover:shadow-[0_12px_40px_rgba(212,175,55,0.08)]";
              }
              return "border-gold-muted/15 shadow-md scale-100 opacity-80 hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-muted/30 hover:shadow-[0_12px_40px_rgba(160,128,84,0.06)]";
            };

            const getCardBg = () => {
              if (plan.isFeatured) {
                return "linear-gradient(145deg, rgba(20,33,61,0.95) 0%, rgba(10,17,40,0.98) 100%)";
              }
              if (plan.isPremium) {
                return "linear-gradient(145deg, rgba(16,24,46,0.95) 0%, rgba(10,17,40,0.95) 100%)";
              }
              return "rgba(10,17,40,0.5)";
            };

            return (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group cursor-pointer ${getCardStyles()}`}
                style={{ background: getCardBg() }}
              >
                {/* Radial Glow on Gold / Premium Cards */}
                {(plan.isPremium || plan.isFeatured) && (
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                    style={{
                      background: "radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 60%)",
                    }}
                  />
                )}

                {/* Card Top Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md text-navy-950 border ${
                        plan.isPremium
                          ? "border-gold-300/40 shadow-[0_0_15px_rgba(212,175,55,0.25)] text-navy-950"
                          : "border-gold-300/30"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #e8ba7a 0%, #d4af37 100%)",
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="space-y-4">
                    <div className="text-center pt-2">
                      {plan.isPremium ? (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-widest text-gold-200/60 font-semibold block">
                            Grace & Goodwill
                          </span>
                          <h3 className="text-2xl font-serif tracking-wide text-gold-50">
                            Verified Professional™
                          </h3>
                          <span className="text-[10px] text-gold-300/80 font-medium uppercase tracking-wider block bg-gold-500/10 border border-gold-400/25 px-2 py-0.5 rounded-md max-w-fit mx-auto mt-2">
                            Earned Trust Status
                          </span>
                        </div>
                      ) : (
                        <h3 className="text-2xl font-serif tracking-wide text-gold-50">
                          {plan.name}
                        </h3>
                      )}

                      <p className="mt-3 text-xs text-gold-200/60 leading-relaxed font-light min-h-[40px] px-1">
                        {plan.isPremium ? plan.description : plan.tagline}
                      </p>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

                    {/* Pricing Display */}
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <span className="text-4xl font-bold tracking-tight leading-none text-gold-50 font-serif">
                        {plan.price}
                      </span>
                      <span className="text-xs font-medium text-gold-200/50 uppercase tracking-widest">
                        /{plan.period}
                      </span>
                      {plan.isPremium && (
                        <span className="text-[10px] font-bold text-gold-200/80 uppercase tracking-wider bg-gold-400/10 px-2.5 py-0.5 rounded-full border border-gold-400/15 mt-1.5">
                          Total Value: {plan.totalPrice}/month (VAT Inc.)
                        </span>
                      )}
                    </div>

                    {plan.isPremium && (
                      <div className="p-3 bg-gold-500/5 border border-gold-400/15 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-gold-200 uppercase tracking-wider block">
                          Notice:
                        </span>
                        <span className="text-[11px] text-gold-100/80 font-light block leading-snug">
                          Requires active Gold Elite membership.
                        </span>
                      </div>
                    )}

                    {/* Features checklist */}
                    <div className="pt-2">
                      <ul className="flex flex-col space-y-4">
                        {plan.isFree ? (
                          <>
                            {plan.highlights?.map((highlight) => (
                              <li key={highlight} className="flex items-start gap-3.5 text-xs text-gold-100/85 leading-relaxed font-light">
                                <span className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/15">
                                  <Check className="h-3 w-3 text-gold-DEFAULT" strokeWidth={2.5} />
                                </span>
                                <span className="font-semibold text-gold-200">{highlight}</span>
                              </li>
                            ))}
                            <div className="h-px bg-gold-300/5 my-2" />
                            {plan.features?.map((feature) => (
                              <li key={feature} className="flex items-start gap-3.5 text-xs text-gold-100/85 leading-relaxed font-light">
                                <span className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/10">
                                  <Check className="h-2.5 w-2.5 text-gold-DEFAULT/70" strokeWidth={2.5} />
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </>
                        ) : plan.isPremium ? (
                          <div className="text-center py-4 space-y-3">
                            <p className="text-[11px] text-gold-100/50 leading-relaxed font-light max-w-[220px] mx-auto">
                              This status requires a consecutive active history, DBS check, and verification.
                            </p>
                          </div>
                        ) : (
                          plan.features?.map((feature) => (
                            <li key={feature} className="flex items-start gap-3.5 text-xs text-gold-100/85 leading-relaxed font-light">
                              <span className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/15">
                                <Check className="h-3 w-3 text-gold-DEFAULT" strokeWidth={2.5} />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-6 mt-auto">
                    {plan.isFree && plan.footerText && (
                      <div className="text-[10px] text-gold-100/50 leading-relaxed font-light text-center mb-4 whitespace-pre-line border-t border-gold-300/5 pt-3">
                        {plan.footerText}
                      </div>
                    )}

                    {plan.isPremium ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.name);
                          setIsModalOpen(true);
                        }}
                        className={`w-full py-3.5 px-3 rounded-xl font-bold tracking-wide transition-all duration-300 focus:outline-none text-[13px] ${getButtonStyles()}`}
                      >
                        {isSelected ? "✓ Selected" : plan.buttonText}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.name);
                        }}
                        className={`w-full py-3.5 px-3 rounded-xl font-bold tracking-wide transition-all duration-300 focus:outline-none text-[13px] ${getButtonStyles()}`}
                      >
                        {isSelected ? "✓ Selected" : plan.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Optional Premium Section: Comparison Table */}
      <div className="max-w-6xl mx-auto space-y-6 mt-16 px-4">
        <div className="text-center space-y-2 mb-8">
          <h4 className="text-xl font-serif text-gold-50 tracking-wide">
            Detailed Feature Comparison
          </h4>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto" />
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gold-300/10 bg-navy-900/30 backdrop-blur-md shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-300/10 bg-navy-950/50">
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-widest text-gold-200">Feature</th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-widest text-gold-200 text-center w-1/4">Free</th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-widest text-gold-200 text-center w-1/4">Gold Elite</th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-widest text-gold-200 text-center w-1/4">Verified Professional™</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.name}
                  className={`border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-navy-950/20"
                  }`}
                >
                  <td className="p-4 md:p-5 text-xs text-gold-100 font-medium">{row.name}</td>
                  <td className="p-4 md:p-5 text-center">
                    {row.free ? (
                      <Check className="w-4 h-4 text-gold-DEFAULT mx-auto" strokeWidth={3} />
                    ) : (
                      <span className="text-gold-200/20 font-bold block text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    {row.gold ? (
                      <Check className="w-4 h-4 text-gold-DEFAULT mx-auto" strokeWidth={3} />
                    ) : (
                      <span className="text-gold-200/20 font-bold block text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    {row.verified ? (
                      <Check className="w-4 h-4 text-gold-DEFAULT mx-auto" strokeWidth={3} />
                    ) : (
                      <span className="text-gold-200/20 font-bold block text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation flow buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 max-w-7xl mx-auto w-full px-4">
        <Button
          type="button"
          variant="ghost-gold"
          onClick={onBack}
          disabled={isSubmitting}
          text="Back"
        />
        <Button
          type="button"
          variant="primary"
          text="Continue to Declaration"
          onClick={onNext}
          disabled={isSubmitting || !selectedPlan}
        />
      </div>

      {/* Premium Trust Overlay Modal Details (Option A) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-gold-400/30 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 text-gold-100 shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all duration-300">
            {/* Close Cross */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gold-200/60 hover:text-gold-200 transition-colors p-1.5 rounded-full hover:bg-gold-400/10 focus:outline-none z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content body */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 pb-6 scrollbar-thin">
              {/* Modal Header */}
              <div className="text-center space-y-2 mb-6 pt-2">
                <span className="text-[11px] font-bold text-gold-200 uppercase tracking-widest block bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full max-w-fit mx-auto">
                  Verification Details
                </span>
                <h4 className="text-xl sm:text-2xl font-serif text-gold-100 leading-tight">
                  Verified Professional™ Details
                </h4>
                <p className="text-xs text-gold-100/60 leading-relaxed font-light max-w-md mx-auto">
                  Review requirements, benefits, and instructions on how to attain this earned trust badge status.
                </p>
              </div>

              <div className="space-y-6">
                {/* How to Become Verified (5 step list) */}
                <div className="space-y-3 p-4 rounded-2xl bg-gold-500/5 border border-gold-400/15">
                  <h5 className="text-[12px] font-bold uppercase tracking-wider text-gold-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> How to Become Verified™
                  </h5>
                  <ol className="space-y-2.5 text-xs text-gold-100/80 font-light">
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-navy-950 font-bold shrink-0 text-[10px]">1</span>
                      <span>Join <strong>Gold Elite Membership</strong> during checkout or from your dashboard.</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-navy-950 font-bold shrink-0 text-[10px]">2</span>
                      <span>Maintain an active membership status for a minimum of <strong>3 consecutive months</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-navy-950 font-bold shrink-0 text-[10px]">3</span>
                      <span>Complete full <strong>compliance verification</strong> (DBS, references, Right to Work, training).</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-navy-950 font-bold shrink-0 text-[10px]">4</span>
                      <span>Complete a minimum of <strong>3 successful placements</strong> through Grace & Goodwill.</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-navy-950 font-bold shrink-0 text-[10px]">5</span>
                      <span>Pass a virtual interview and achieve your **Verified Professional™ status**.</span>
                    </li>
                  </ol>
                </div>

                {/* Grid: Eligibility and Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Eligibility */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gold-200 border-b border-gold-300/10 pb-1.5">
                      Eligibility Checklist
                    </h5>
                    <ul className="space-y-2">
                      {plans[2].eligibility?.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[11px] text-gold-100/80 leading-relaxed font-light">
                          <span className="mt-0.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/15">
                            <Check className="h-2 w-2 text-gold-DEFAULT" strokeWidth={3} />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gold-200 border-b border-gold-300/10 pb-1.5">
                      Verified Benefits
                    </h5>
                    <ul className="space-y-2">
                      {plans[2].benefits?.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[11px] text-gold-100/90 leading-relaxed font-light">
                          <span className="mt-0.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/15">
                            <Check className="h-2 w-2 text-gold-DEFAULT" strokeWidth={3} />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-4 md:px-8 md:py-4 border-t border-gold-400/20 bg-navy-950/90 backdrop-blur-md rounded-b-3xl sticky bottom-0 z-20">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-gold-200 border border-gold-400/30 hover:border-gold-300 hover:text-gold-100 hover:bg-gold-400/5 transition-colors focus:outline-none"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  setSelectedPlan("Grace & Goodwill Verified Professional™");
                  setIsModalOpen(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gold-200 text-navy-950 border border-gold-400/40 shadow-[0_4px_15px_rgba(245,212,160,0.25)] hover:bg-gold-100 hover:border-gold-300 hover:-translate-y-0.5 transition-all focus:outline-none"
              >
                Select Verified Professional & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
