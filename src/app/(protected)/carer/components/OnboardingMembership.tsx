import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Check, Star, Shield, Zap, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface OnboardingMembershipProps {
  onComplete: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function OnboardingMembership({
  onComplete,
  onBack,
  isSubmitting,
}: OnboardingMembershipProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Basic Node",
      price: "£0",
      period: "forever",
      icon: Shield,
      tagline: "Start your caregiver journey",
      features: [
        "Standard Profile Listing",
        "Public matches matching",
        "Direct chat with clients",
        "Basic document storage",
      ],
      buttonText: "Continue Without a Paid Subscription \u2192",
      popular: false,
    },
    {
      name: "Premium Node",
      price: "£19.99",
      period: "month",
      icon: Star,
      tagline: "Boost your listings and matching",
      features: [
        "Priority Profile Listing Badge",
        "Immediate match notifications",
        "Profile view analytics",
        "Priority live chat support",
      ],
      buttonText: "Get Premium",
      popular: true,
    },
    {
      name: "Elite Node",
      price: "£39.99",
      period: "month",
      icon: Zap,
      tagline: "Dedicated manager and resources",
      features: [
        "Dedicated carer manager",
        "Featured carer spot on home page",
        "Unlimited document storage",
        "Express compliance verification",
      ],
      buttonText: "Get Elite",
      popular: false,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionCard className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 md:p-10 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gold-50">
          Choose Your Service Option
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed">
          Select the node tier that fits your professional schedule. You can upgrade, downgrade, or cancel at any time.
        </p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isSelected = selectedPlan === plan.name;
          return (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 sm:p-8 transition-all duration-300 group cursor-pointer ${
                isSelected
                  ? "border-gold-200 shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-gradient-to-b from-gold-900/40 via-navy-900/60 to-navy-950/80 -translate-y-2 ring-1 ring-gold-200"
                  : plan.popular
                  ? "border-gold-200/40 shadow-[0_0_30px_rgba(245,212,160,0.1)] hover:shadow-[0_0_40px_rgba(245,212,160,0.15)] bg-gradient-to-b from-gold-200/5 via-navy-900/40 to-navy-950/60 hover:-translate-y-1"
                  : "border-gold-300/10 hover:border-gold-300/30 bg-navy-900/30 hover:bg-navy-900/50 hover:-translate-y-1"
              } backdrop-blur-sm`}
            >
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gold-200 text-navy-950 rounded-full flex items-center justify-center shadow-lg border-2 border-navy-950 z-10">
                   <Check className="w-5 h-5 font-bold" />
                </div>
              )}
              {plan.popular && !isSelected && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-200 to-gold-200/80 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-950 shadow-[0_2px_10px_rgba(245,212,160,0.2)]">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-lg font-bold tracking-wide ${plan.popular ? "text-gold-200" : "text-gold-50"}`}>
                      {plan.name}
                    </h4>
                    <IconComponent className={`w-5 h-5 ${plan.popular ? "text-gold-200" : "text-gold-200/60"}`} />
                  </div>
                  <p className="text-[11px] text-gold-100/50 font-medium tracking-wide leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline space-x-1 py-4 border-y border-gold-300/10 my-2">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.popular ? "text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-100" : "text-gold-100"}`}>
                    {plan.price}
                  </span>
                  <span className="text-xs text-gold-100/40 font-medium uppercase tracking-widest">
                    /{plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 pt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-gold-200" : "text-gold-200/40"}`} />
                      <span className="text-[12px] text-gold-100/80 leading-snug font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.name);
                  }}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-2 rounded-xl font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 ${
                    plan.name === "Basic Node" ? "text-[11px] whitespace-normal leading-snug" : "text-[13px]"
                  } ${
                    isSelected
                      ? "bg-gradient-to-b from-gold-200 to-gold-100 text-navy-950 shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                      : plan.popular
                      ? "bg-gradient-to-b from-gold-200 to-gold-200/80 text-navy-950 shadow-[0_4px_15px_rgba(245,212,160,0.15)] hover:shadow-[0_6px_20px_rgba(245,212,160,0.25)] hover:-translate-y-0.5 border border-gold-200/20"
                      : "bg-navy-800/50 text-gold-100/90 border border-gold-300/10 hover:bg-navy-800 hover:border-gold-300/30 hover:text-gold-50 hover:-translate-y-0.5"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSelected ? `${plan.name.split(" ")[0]} Selected` : plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>

    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 max-w-5xl mx-auto w-full">
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
          text={isSubmitting ? "Submitting..." : "Submit Profile for Verification"}
          onClick={onComplete} 
          disabled={isSubmitting || !selectedPlan}
        />
      </div>
    </div>
  );
}
