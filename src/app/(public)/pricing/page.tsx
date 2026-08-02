import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Button from "@/components/Button";

const ContactSalesForm = dynamic(() => import("@/components/ContactSalesForm"));
const NewsletterForm = dynamic(() => import("@/components/NewsletterForm"));

const carerPlans = [
  {
    name: "Submit Profile for Review",
    price: "",
    period: "",
    tagline: "Join the Grace & Goodwill network and connect with clients.",
    highlights: [],
    features: [
      "Apply for placements after approval",
      "Placement alerts by email",
      "Basic carer profile",
      "Ability to apply for placements",
      "Access to discounted face-to-face training rates",
      "Access to discounted e-learning rates",
    ],
    cta: "Submit Profile for Review",
    href: "/register",
    featured: false,
    premium: false,
    badge: "",
    footerText: "Your profile and compliance will be reviewed before approval.",
  },
  /*
  {
    name: "Gold Elite Membership",
    price: "£29.99",
    period: "per month (VAT Included)",
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
    cta: "Join Gold Elite",
    href: "/register",
    featured: true,
    premium: false,
    badge: "Most Popular",
  },
  {
    name: "Grace & Goodwill Verified Professional™",
    price: "Additional £10",
    period: "per month (VAT Included)",
    tagline: "Earned status reserved for carers demonstrating excellence, trust and values.",
    features: [
      "Grace & Goodwill Verified Professional™ badge",
      "Contacted first for premium placements",
      "Priority phone calls for suitable placements",
      "Priority email alerts for suitable placements",
      "Priority WhatsApp placement alerts where available",
      "Priority matching opportunities",
      "Appear before all other carers in search results",
      "Featured in client searches",
      "Featured in emergency placements",
      "Priority access to enhanced-rate emergency placements where available",
      "Premium profile highlight with a bold verified frame",
      "Increased visibility across the platform",
      "All Gold Elite Membership benefits included",
    ],
    cta: "Join Gold Elite + Verification",
    href: "/register",
    featured: false,
    premium: true,
    badge: "Verified Professional™",
  },
  */
];

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 text-gold-100 pb-24">
      {/* ── Hero Section ── */}
      {/* <section className="relative overflow-hidden pt-20 pb-16">
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
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight text-gold-100">
              Membership plans
            </h1>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Flexible membership options for professional carers.
          </p>
        </div>
      </section> */}

      {/* ── Carer Memberships ── */}
      {/* <section className="container-wrapper pt-8 pb-20">
        <div className="text-center mb-16 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            Carer Memberships
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
        </div>
        <div className="flex justify-center pt-4">
          <div className="w-full max-w-[420px]">
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
                {plan.premium && (
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 60%)",
                    }}
                  />
                )}

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

                  {plan.price !== "" && (
                    <>
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

                      <div className="mb-6 flex flex-col items-center gap-1 min-h-[76px] justify-center">
                        {plan.premium ? (
                          <>
                            <span className="text-3xl font-bold tracking-tight leading-none transition-colors duration-500 font-serif text-gold-50 group-hover:text-white">
                              Earned Status
                            </span>
                            <span className="text-[11px] font-bold text-gold-200/80 uppercase tracking-wider bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/15 mt-3">
                              +£10/Month • Total Value £39.99/Month
                            </span>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </>
                  )}

                  <div className="mb-10 flex-1 flex flex-col justify-center min-h-[220px]">
                    <ul className="flex flex-col space-y-4">
                      {(plan as any).highlights?.map((highlight: string) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-4 text-sm text-gold-100/85 leading-relaxed font-light"
                        >
                          <span
                            className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
                            style={{ background: "rgba(160,128,84,0.10)" }}
                          >
                            <Check
                              className="h-3 w-3"
                              style={{ color: "#A08054" }}
                              strokeWidth={2.5}
                            />
                          </span>
                          <span className="font-semibold text-gold-200">{highlight}</span>
                        </li>
                      ))}

                      {(plan as any).highlights && (
                        <div className="h-px w-full bg-gold-400/10 my-4" />
                      )}

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

                  <div className="mt-auto">
                    {(plan as any).footerText && (
                      <div className="mb-4 text-[10px] text-gold-100/50 leading-relaxed font-light text-center whitespace-pre-line border-t border-gold-300/5 pt-3">
                        {(plan as any).footerText}
                      </div>
                    )}
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
                      <Link href={plan.href} prefetch={false}>
                        {plan.cta}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Membership Conditions ── */}
      {/* <section className="container-wrapper pt-12 pb-24 border-t border-gold-muted/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide mb-4">
              Membership Conditions
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6 bg-navy-900/40 p-8 rounded-2xl border border-gold-muted/5">
              <h3 className="text-xl font-serif text-gold-100 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-400/50" />
                General Policy
              </h3>
              <ul className="space-y-4 text-sm text-gold-200/80">
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>All memberships are cancellable at any time.</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>Approved carers can apply for placements immediately once approved.</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>Approved carers can begin working immediately after profile activation.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6 bg-navy-900/40 p-8 rounded-2xl border border-gold-muted/5">
              <h3 className="text-xl font-serif text-gold-100 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold-400/50" />
                Premium Benefit Terms
              </h3>
              <p className="text-xs text-gold-100/60 leading-relaxed font-light mb-3">
                Premium placement priority, enhanced opportunities, advanced discounts, and Verified Professional eligibility require:
              </p>
              <ul className="space-y-3 text-sm text-gold-200/80">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span className="text-gold-50 font-medium">Active Gold Elite Membership</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span className="text-gold-50 font-medium">Minimum 3 consecutive months active membership</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span className="text-gold-50 font-medium">Completion of verification requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── Contact Sales Form ── */}
      <section className="bg-navy-900/50 py-24 relative overflow-hidden border-y border-gold-muted/10">
        <div className="container-wrapper space-y-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-gold-400/15 bg-navy-900/50 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400/[0.03] via-transparent to-transparent pointer-events-none" />

              {/* Card header */}
              <div className="relative z-10 px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-6 border-b border-gold-400/10">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 text-gold-300 ring-1 ring-gold-400/15 flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-50">
                      Contact Sales
                    </h2>
                    <p className="text-sm text-gold-200/60 leading-relaxed font-light max-w-3xl">
                      Have questions about our pricing plans or want to discuss
                      a custom arrangement? Leave your details and a member of
                      our partnership team will reach out.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
                <ContactSalesForm />
              </div>
            </div>
          </div>
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
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide mb-4">
            Stay Connected
          </h2>
          <p className="text-sm leading-relaxed text-gold-200/80 sm:text-base mb-8">
            Receive care advice, family resources, training opportunities,
            events and updates from Grace & Goodwill.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
