import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
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
            style={{
              background:
                "radial-gradient(ellipse, #A08054 0%, transparent 70%)",
            }}
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
            Every plan includes secure case management, team workflows,
            compliance tools, and live support. No hidden fees. Cancel any time.
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
                "relative flex flex-col rounded-3xl p-8 border group transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform",
                plan.featured
                  ? "border-gold/50 shadow-[0_20px_50px_rgba(212,175,55,0.15)] ring-1 ring-gold-muted/20 scale-[1.02] z-10 md:-translate-y-3 " +
                    "hover:scale-[1.04] hover:-translate-y-4 hover:shadow-[0_30px_70px_rgba(212,175,55,0.28)] hover:border-gold"
                  : "border-gold-muted/15 shadow-md scale-100 opacity-80 md:translate-y-0 " +
                    "hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-muted/40 hover:shadow-[0_12px_40px_rgba(160,128,84,0.08)]",
              ].join(" ")}
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, rgba(20,33,61,0.99) 0%, rgba(10,17,40,0.99) 100%)"
                  : "rgba(10,17,40,0.65)",
              }}
            >
              {/* Recommended badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span
                    className="inline-flex items-center rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-navy-950 shadow-[0_0_20px_rgba(212,175,55,0.3)] border border-gold-300/30"
                    style={{
                      background:
                        "linear-gradient(135deg, #e8ba7a 0%, #d4af37 100%)",
                    }}
                  >
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan name & tagline */}
              <div className="mb-6">
                <h2
                  className={[
                    "text-lg font-bold tracking-wide transition-colors duration-500",
                    plan.featured
                      ? "text-gold-100 group-hover:text-white"
                      : "text-gold-300 group-hover:text-gold-200",
                  ].join(" ")}
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
                  className={[
                    "text-5xl font-bold tracking-tight leading-none transition-colors duration-500",
                    plan.featured
                      ? "text-gold-100 group-hover:text-white"
                      : "text-gold-300 group-hover:text-gold-200",
                  ].join(" ")}
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
                variant={plan.featured ? "primary" : "ghost-gold"}
                fullWidth
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wrapper mt-12 mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold-muted/20 bg-gold-muted/5 backdrop-blur-sm shadow-md">
          {/* Shield Check Icon */}
          <ShieldCheck className="h-4 w-4 shrink-0 text-gold-DEFAULT/80" />
          <span className="text-xs font-medium tracking-wide text-gold-200/80">
            14-day free trial &nbsp;·&nbsp; No credit card required
            &nbsp;·&nbsp; Cancel any time
          </span>
        </div>
      </section>
    </main>
  );
}
