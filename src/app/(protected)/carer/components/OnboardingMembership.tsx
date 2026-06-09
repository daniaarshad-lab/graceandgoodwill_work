import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Check, Star, Shield, Zap } from "lucide-react";

interface OnboardingMembershipProps {
  onComplete: () => void;
}

export default function OnboardingMembership({
  onComplete,
}: OnboardingMembershipProps) {
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
      buttonText: "Choose Basic",
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
    <SectionCard className="max-w-5xl mx-auto space-y-8 p-6 md:p-10 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gold-50">
          Choose Your Membership Plan
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed">
          Select the node tier that fits your professional schedule. You can upgrade, downgrade, or cancel at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] bg-navy-950/40 ${
                plan.popular
                  ? "border-gold-DEFAULT shadow-gold bg-gradient-to-b from-gold-DEFAULT/5 to-transparent"
                  : "border-gold-300/10"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-DEFAULT px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-950 shadow-soft">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-gold-100">
                      {plan.name}
                    </h4>
                    <IconComponent className="w-5 h-5 text-gold-DEFAULT" />
                  </div>
                  <p className="text-[10px] text-gold-100/50">{plan.tagline}</p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline space-x-1 py-2 border-y border-gold-300/5">
                  <span className="text-3xl font-bold text-gold-DEFAULT">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gold-100/40">
                    /{plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0 mt-0.5" />
                      <span className="text-[11px] text-gold-100/70 leading-normal">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  onClick={onComplete}
                  variant={plan.popular ? "primary" : "ghost-gold"}
                  size="sm"
                  fullWidth
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-gold-300/10">
        <p className="text-[11px] text-gold-100/50">
          Want to explore the platform first?
        </p>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-gold-DEFAULT hover:underline hover:text-gold-light transition-colors"
        >
          Continue Without Membership &rarr;
        </button>
      </div>
    </SectionCard>
  );
}
