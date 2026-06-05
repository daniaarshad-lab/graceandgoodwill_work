import Link from "next/link";
import { Check } from "lucide-react";
import dynamic from "next/dynamic";
import Button from "@/components/Button";

const ContactSalesForm = dynamic(() => import("@/components/ContactSalesForm"));
const NewsletterForm = dynamic(() => import("@/components/NewsletterForm"));

const carerPlans = [
  {
    name: "Bronze",
    price: "£9.99",
    period: "per month + VAT",
    tagline: "Essential membership for independent professional carers.",
    features: [
      "Placement alerts by email",
      "15% discount on mandatory care training",
    ],
    cta: "Join Bronze",
    href: "/register",
    featured: false,
    premium: false,
    badge: "",
  },
  {
    name: "Platinum",
    price: "£19.99",
    period: "per month + VAT",
    tagline: "Advanced tools and premium support for active carers.",
    features: [
      "Priority placement alerts",
      "25% discount on mandatory care training",
      "Early access to new placements",
      "Reduced compliance package fees",
    ],
    cta: "Join Platinum",
    href: "/register",
    featured: true,
    premium: false,
    badge: "Most Popular",
  },
  {
    name: "Gold Elite",
    price: "£29.99",
    period: "per month + VAT",
    tagline: "The ultimate membership for established care professionals.",
    features: [
      "Emergency placements with enhanced rates priority",
      "First access to higher paying placements",
      "50% discount on mandatory care training",
      "Priority DBS and compliance processing",
      "Featured carer profile",
    ],
    cta: "Join Gold Elite",
    href: "/register",
    featured: false,
    premium: true,
    badge: "Premium",
  },
];

const academyPlans = [
  {
    name: "Academy Partner Membership",
    price: "£499",
    period: "per month + VAT",
    tagline: "Up to 5 staff",
    features: [
      "Up to 2 mandatory training sessions per month",
      "Electronic certificates",
      "Training records maintained and securely stored for 18 months",
    ],
    cta: "Become a Partner",
    href: "/contact",
    featured: false,
    badge: "",
  },
  {
    name: "Academy Professional Membership",
    price: "£699",
    period: "per month + VAT",
    tagline: "6–10 staff",
    features: [
      "Up to 2 mandatory training sessions per month",
      "Electronic certificates",
      "Training records maintained and securely stored for 24 months",
      "15% discount on additional training courses such as complex care, stoma care and specialist training",
    ],
    cta: "Become a Professional",
    href: "/contact",
    featured: true,
    badge: "Most Popular",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 text-gold-100 pb-24">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
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

        <div className="container-wrapper relative z-10 text-center flex flex-col items-center">
          {/* Eyebrow label & Gold accent line restored to premium style */}
          {/* <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <p className="text-xs uppercase tracking-[0.4em] text-gold-400 font-bold">
              GRACE &amp; GOODWILL • MEMBERSHIP PLANS
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div> */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-gold-darker">
              Membership  plans</h1>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>
          {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight mb-6 text-gold-100 tracking-wide max-w-4xl">
            Membership Plans
          </h1> */}

          <p className="max-w-2xl text-base sm:text-lg text-gold-200/80 leading-relaxed font-light">
            Flexible membership options for professional carers and care
            providers.
          </p>
        </div>
      </section>

      {/* ── Carer Memberships ── */}
      <section className="container-wrapper pt-8 pb-20">
        <div className="text-center mb-16 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light">
            Carer Memberships
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
        </div>

        {/* Added items-stretch so cards equalize height */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 items-stretch pt-4">
          {carerPlans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex flex-col rounded-3xl p-6 sm:p-8 lg:p-10 border group transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform h-full",
                plan.featured
                  ? "border-gold-400/40 shadow-[0_15px_40px_rgba(212,175,55,0.08)] ring-1 ring-gold-muted/20 scale-[1.02] z-10 md:-translate-y-2 " +
                  "hover:scale-[1.03] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-gold-400/60"
                  : plan.premium
                    ? "border-gold-300/20 shadow-xl shadow-navy-950/50 scale-100 opacity-95 md:-translate-y-0 " +
                    "hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-400/40 hover:shadow-[0_12px_40px_rgba(212,175,55,0.08)]"
                    : "border-gold-muted/15 shadow-md scale-100 opacity-80 md:translate-y-0 " +
                    "hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-muted/30 hover:shadow-[0_12px_40px_rgba(160,128,84,0.06)]",
              ].join(" ")}
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, rgba(20,33,61,0.95) 0%, rgba(10,17,40,0.98) 100%)"
                  : plan.premium
                    ? "linear-gradient(145deg, rgba(16,24,46,0.95) 0%, rgba(10,17,40,0.95) 100%)"
                    : "rgba(10,17,40,0.5)",
              }}
            >
              {/* Premium subtle luxury gold radial background accent */}
              {plan.premium && (
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 60%)",
                  }}
                />
              )}

              {/* Badge positioned completely cleanly above the border */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-md",
                      plan.featured
                        ? "text-navy-950 border border-gold-300/30"
                        : "text-gold-100 border border-gold-400/40 bg-navy-950 shadow-[0_0_15px_rgba(212,175,55,0.15)]",
                    ].join(" ")}
                    style={{
                      background: plan.featured
                        ? "linear-gradient(135deg, #e8ba7a 0%, #d4af37 100%)"
                        : plan.premium
                          ? "linear-gradient(135deg, rgba(20,33,61,1) 0%, rgba(10,17,40,1) 100%)"
                          : undefined,
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Plan name & tagline */}
                <div className="mb-6 text-center">
                  <h3
                    className={[
                      "text-2xl font-serif tracking-wide transition-colors duration-500",
                      plan.featured || plan.premium
                        ? "text-gold-50 group-hover:text-white"
                        : "text-gold-200 group-hover:text-gold-100",
                    ].join(" ")}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-3 text-sm text-gold-200/60 leading-relaxed font-light min-h-[40px]">
                    {plan.tagline}
                  </p>
                </div>

                <div
                  className="mb-6 h-px w-full"
                  style={{
                    background: plan.featured
                      ? "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)"
                      : plan.premium
                        ? "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)"
                        : "linear-gradient(to right, transparent, rgba(160,128,84,0.15), transparent)",
                  }}
                />

                <div className="mb-8 flex flex-col items-center gap-1">
                  <span
                    className={[
                      "text-4xl font-bold tracking-tight leading-none transition-colors duration-500 font-serif",
                      plan.featured || plan.premium
                        ? "text-gold-50 group-hover:text-white"
                        : "text-gold-200 group-hover:text-gold-100",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs font-medium text-gold-200/50 uppercase tracking-widest mt-2">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Feature list with clean whitespace spacing */}
                <div className="mb-10 flex-1 flex flex-col justify-center min-h-[220px]">
                  <ul className="flex flex-col space-y-5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-4 text-sm text-gold-100/85 leading-relaxed font-light"
                      >
                        <span
                          className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
                          style={{
                            background:
                              plan.featured || plan.premium
                                ? "rgba(212,175,55,0.15)"
                                : "rgba(160,128,84,0.10)",
                          }}
                        >
                          <Check
                            className="h-3 w-3"
                            style={{
                              color:
                                plan.featured || plan.premium
                                  ? "#d4af37"
                                  : "#A08054",
                            }}
                            strokeWidth={2.5}
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA button - guaranteed to align at the bottom because of flex-1 above */}
                <div className="mt-auto">
                  <Button
                    asChild
                    variant={
                      plan.featured
                        ? "primary"
                        : plan.premium
                          ? "outline"
                          : "ghost-gold"
                    }
                    fullWidth
                  >
                    <Link href={plan.href} prefetch={true}>
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Care Academy Memberships ── */}
      <section className="container-wrapper pt-12 pb-20">
        <div className="text-center mb-16 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light">
            Care Academy Memberships
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto items-stretch pt-4">
          {academyPlans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex flex-col rounded-3xl p-6 sm:p-8 lg:p-10 border group transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform h-full",
                plan.featured
                  ? "border-gold-400/40 shadow-[0_15px_40px_rgba(212,175,55,0.08)] ring-1 ring-gold-muted/20 scale-[1.02] z-10 md:-translate-y-2 " +
                  "hover:scale-[1.03] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-gold-400/60"
                  : "border-gold-muted/15 shadow-md scale-100 opacity-80 md:translate-y-0 " +
                  "hover:scale-[1.01] hover:-translate-y-1 hover:opacity-100 hover:border-gold-muted/30 hover:shadow-[0_12px_40px_rgba(160,128,84,0.06)]",
              ].join(" ")}
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, rgba(20,33,61,0.95) 0%, rgba(10,17,40,0.98) 100%)"
                  : "rgba(10,17,40,0.5)",
              }}
            >
              {/* Badge positioned completely cleanly above the border */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-md",
                      plan.featured
                        ? "text-navy-950 border border-gold-300/30"
                        : "text-gold-100 border border-gold-400/40 bg-navy-950 shadow-[0_0_15px_rgba(212,175,55,0.15)]",
                    ].join(" ")}
                    style={{
                      background: plan.featured
                        ? "linear-gradient(135deg, #e8ba7a 0%, #d4af37 100%)"
                        : undefined,
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Plan name & tagline */}
                <div className="mb-6 text-center">
                  <h3
                    className={[
                      "text-2xl font-serif tracking-wide transition-colors duration-500",
                      plan.featured
                        ? "text-gold-50 group-hover:text-white"
                        : "text-gold-200 group-hover:text-gold-100",
                    ].join(" ")}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-3 text-sm text-gold-200/60 leading-relaxed font-light min-h-[40px]">
                    {plan.tagline}
                  </p>
                </div>

                <div
                  className="mb-6 h-px w-full"
                  style={{
                    background: plan.featured
                      ? "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)"
                      : "linear-gradient(to right, transparent, rgba(160,128,84,0.15), transparent)",
                  }}
                />

                <div className="mb-8 flex flex-col items-center gap-1">
                  <span
                    className={[
                      "text-4xl font-bold tracking-tight leading-none transition-colors duration-500 font-serif",
                      plan.featured
                        ? "text-gold-50 group-hover:text-white"
                        : "text-gold-200 group-hover:text-gold-100",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs font-medium text-gold-200/50 uppercase tracking-widest mt-2">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Feature list with clean whitespace spacing */}
                <div className="mb-10 flex-1 flex flex-col justify-center min-h-[220px]">
                  <ul className="flex flex-col space-y-5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-4 text-sm text-gold-100/85 leading-relaxed font-light"
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
                            className="h-3 w-3"
                            style={{
                              color: plan.featured ? "#d4af37" : "#A08054",
                            }}
                            strokeWidth={2.5}
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    variant={plan.featured ? "primary" : "ghost-gold"}
                    fullWidth
                  >
                    <Link href={plan.href} prefetch={true}>
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Training Without Membership ── */}
      <section className="container-wrapper pt-12 pb-20">
        <div className="relative rounded-3xl p-10 lg:p-14 overflow-hidden border border-gold-400/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,33,61,0.9) 0%, rgba(10,17,40,0.98) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background:
                "radial-gradient(circle at 0% 100%, #A08054 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 md:max-w-2xl text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light mb-4">
              Training Without Membership
            </h2>
            <p className="text-gold-200/70 leading-relaxed font-light text-lg">
              Access our industry-leading care training modules without a full
              membership commitment.
            </p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
              <span className="text-4xl font-bold tracking-tight text-gold-100 font-serif">
                £99
              </span>
              <span className="text-sm font-medium text-gold-200/50 uppercase tracking-widest max-w-[150px] text-left leading-tight">
                per person per training session + VAT
              </span>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto whitespace-nowrap py-4 px-8 text-lg"
            >
              <Link href="/contact" prefetch={true}>
                Book Training Session
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Membership Conditions ── */}
      <section className="container-wrapper pt-12 pb-24 border-t border-gold-muted/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light mb-4">
              Membership Conditions
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6 bg-navy-900/40 p-8 rounded-2xl border border-gold-muted/5">
              <h3 className="text-xl font-serif text-gold-100 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-400/50" />
                Membership Options
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-gold-50 font-medium mb-1">Option A</h4>
                    <p className="text-sm text-gold-200/60 leading-relaxed font-light">
                      Members may access discounted benefits after maintaining
                      membership for 3 months.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-gold-50 font-medium mb-1">Option B</h4>
                    <p className="text-sm text-gold-200/60 leading-relaxed font-light">
                      Members may pay 3 months upfront and receive benefits
                      immediately.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6 bg-navy-900/40 p-8 rounded-2xl border border-gold-muted/5">
              <h3 className="text-xl font-serif text-gold-100 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-400/50" />
                Upfront Payment Terms
              </h3>
              <ul className="space-y-4">
                {[
                  "3 Months Upfront",
                  "6 Months Upfront",
                  "12 Months Upfront",
                ].map((term) => (
                  <li key={term} className="flex items-center gap-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                    <span className="text-gold-50 font-medium">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Sales Form ── */}
      <section className="bg-navy-900/50 py-24 relative overflow-hidden border-y border-gold-muted/10">
        <div className="container-wrapper max-w-3xl relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light mb-4">
              Contact Sales
            </h2>
          </div>

          <ContactSalesForm />
        </div>
      </section>

      {/* ── Newsletter Section ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-950 z-0" />
        <div
          className="absolute inset-0 opacity-10 z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 60%)",
          }}
        />

        <div className="container-wrapper relative z-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide font-light mb-4">
            Stay Connected
          </h2>
          <p className="text-gold-200/70 font-light mb-8">
            Receive care advice, family resources, training opportunities,
            events and updates from Grace & Goodwill.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
