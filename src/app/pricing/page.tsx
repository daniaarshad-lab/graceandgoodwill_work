import Link from "next/link";
import { Check } from "lucide-react";
import Button from "@/components/Button";

const plans = [
  {
    name: "Starter",
    price: "£29",
    period: "/ month",
    tagline: "Ideal for small care teams getting started.",
    features: [
      "Up to 5 active clients",
      "Basic care coordination tools",
      "Secure document storage",
      "Email support",
      "Compliance checklist",
    ],
    cta: "Get Started",
    href: "/contact",
    featured: false,
  },
  {
    name: "Growth",
    price: "£79",
    period: "/ month",
    tagline: "Advanced workflows for growing care organisations.",
    features: [
      "Up to 30 active clients",
      "Full care workflow automation",
      "Advanced compliance reporting",
      "Priority phone & email support",
      "Team collaboration tools",
      "Custom care plan templates",
    ],
    cta: "Start Free Trial",
    href: "/contact",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Tailored for large or complex care programmes.",
    features: [
      "Unlimited clients",
      "Dedicated account manager",
      "Custom integrations & API access",
      "White-label options",
      "On-site training & onboarding",
      "SLA-backed support",
    ],
    cta: "Talk to Sales",
    href: "/contact",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 text-gold-100 pb-24">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-20 pb-16">

        {/* Radial ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div
          className="h-[480px] w-[900px] rounded-full opacity-[0.09] blur-[140px]"
            style={{ background: "radial-gradient(ellipse, #A08054 0%, transparent 70%)" }}
          />
        </div>

        <div className="container-wrapper relative z-10 text-center">

          {/* Eyebrow label */}
          <p className="text-xs uppercase tracking-[0.45em] text-gold-400 mb-4">
            Grace &amp; Goodwill · Membership Plans
          </p>

          {/* Gold accent line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-muted/60" />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#d4af37" }}
            />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-muted/60" />
          </div>

          <h1
            className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
            style={{ color: "#A08054" }}
          >
            Transparent Pricing for Premium Care Management
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gold-200/70 sm:text-lg">
            Every plan includes secure case management, team workflows, compliance
            tools, and live support. No hidden fees. Cancel any time.
          </p>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="container-wrapper pt-8 pb-2">
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex flex-col rounded-2xl p-8",
                "border backdrop-blur-sm",
                plan.featured
                  ? "border-gold-muted/50 shadow-elegant pg-card--featured"
                  : "border-gold-muted/20 pg-card",
              ].join(" ")}
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, rgba(15,26,51,0.98) 0%, rgba(10,17,40,0.98) 100%)"
                  : "rgba(10,17,40,0.72)",
                boxShadow: plan.featured
                  ? "0 0 0 1px rgba(212,175,55,0.22), 0 24px 60px rgba(0,0,0,0.38), 0 0 80px rgba(212,175,55,0.07)"
                  : "0 0 0 1px rgba(160,128,84,0.12), 0 8px 32px rgba(0,0,0,0.20)",
              }}
            >
              {/* Recommended badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-navy-950"
                    style={{ background: "#d4af37" }}
                  >
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan name & tagline */}
              <div className="mb-6">
                <h2
                  className="text-lg font-semibold tracking-wide"
                  style={{ color: plan.featured ? "#d4af37" : "#e8ba7a" }}
                >
                  {plan.name}
                </h2>
                <p className="mt-1.5 text-sm text-gold-200/55 leading-relaxed">
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-7 flex items-end gap-1.5">
                <span
                  className="text-5xl font-bold tracking-tight leading-none"
                  style={{ color: plan.featured ? "#d4af37" : "#e8ba7a" }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="mb-1.5 text-sm text-gold-200/50">
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div
                className="mb-6 h-px w-full"
                style={{
                  background: plan.featured
                    ? "linear-gradient(to right, transparent, rgba(212,175,55,0.30), transparent)"
                    : "linear-gradient(to right, transparent, rgba(160,128,84,0.18), transparent)",
                }}
              />

              {/* Feature list */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gold-200/75 leading-snug"
                  >
                    <span
                      className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: plan.featured
                          ? "rgba(212,175,55,0.15)"
                          : "rgba(160,128,84,0.10)",
                      }}
                    >
                      <Check
                        className="h-2.5 w-2.5"
                        style={{ color: plan.featured ? "#d4af37" : "#A08054" }}
                      />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                asChild
                variant={plan.featured ? "navy" : "ghost-gold"}
                fullWidth
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wrapper mt-14 text-center">
        <p className="text-xs tracking-wide" style={{ color: "rgba(160,128,84,0.42)" }}>
          14-day free trial &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Cancel any time
        </p>
      </section>
    </main>
  );
}
