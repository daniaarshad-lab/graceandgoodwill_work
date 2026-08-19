import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { AUTH_ROUTES, RECRUITMENT_EMAIL } from "@/lib/auth-routes";

export const metadata: Metadata = {
  title: "Join Our Carer Network | Grace & Goodwill",
  description:
    "Grace & Goodwill introduces independent live-in carers to families across the UK. Register as a carer and begin your onboarding.",
  alternates: { canonical: "/join-as-carer" },
  openGraph: {
    type: "website",
    url: "/join-as-carer",
    siteName: "Grace & Goodwill",
    title: "Join Our Carer Network | Grace & Goodwill",
    description:
      "Register as an independent live-in carer with Grace & Goodwill and begin your onboarding.",
  },
};

/* Onboarding stages mirror the real carer stepper in
   src/app/(protected)/carer/components/OnboardingStepper.tsx — grouped, so the
   page stays readable without inventing a different process. */
const onboardingStages = [
  {
    Icon: UserCheck,
    title: "Create your account",
    body: "Register as a carer and accept the platform and introduction terms. This takes a few minutes.",
  },
  {
    Icon: FileCheck2,
    title: "Identity and right to work",
    body: "Provide photo identification, proof of address and evidence of your right to work in the UK.",
  },
  {
    Icon: GraduationCap,
    title: "Training and qualifications",
    body: "Upload your mandatory training certificates, along with any additional qualifications or specialisms you hold.",
  },
  {
    Icon: ShieldCheck,
    title: "Compliance and insurance",
    body: "Supply your enhanced DBS certificate, professional references and insurance documents.",
  },
  {
    Icon: BadgeCheck,
    title: "Declaration and review",
    body: "Complete your declaration and submit your profile. Our care standards team reviews it before you are introduced to families.",
  },
];

/* Document categories taken from the CarerDocument enums in
   src/types/document.types.ts, so this list matches what onboarding
   actually asks for. */
const documentGroups = [
  {
    heading: "Identity and eligibility",
    items: [
      "Passport or driving licence",
      "Proof of address",
      "Right to work in the UK",
      "National Insurance proof",
    ],
  },
  {
    heading: "Compliance",
    items: [
      "Enhanced DBS certificate",
      "CV covering your employment history",
      "Two professional references",
    ],
  },
  {
    heading: "Mandatory training",
    items: [
      "Safeguarding adults",
      "Moving and handling",
      "Medication administration",
      "Basic life support and first aid",
      "Infection prevention and control",
      "Health and safety, fire safety and food hygiene",
      "GDPR and data protection",
    ],
  },
  {
    heading: "Insurance",
    items: [
      "Public liability insurance",
      "Professional indemnity insurance",
      "Business insurance where applicable",
    ],
  },
];

const reasons = [
  {
    title: "Work you choose",
    body: "You remain an independent carer. You decide which placements you take and where you are willing to work.",
  },
  {
    title: "Introductions, not agency shifts",
    body: "We introduce you to families whose needs match your experience and specialisms, rather than filling rotas.",
  },
  {
    title: "Placements nationwide",
    body: "We match live-in carers to families across the UK, so opportunities are not limited to one region.",
  },
  {
    title: "A verified network",
    body: "Every carer completes the same checks, which is what gives families confidence in the people we introduce.",
  },
];

export default function JoinAsCarerPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] overflow-x-hidden bg-navy-950 text-gold-100">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pb-8 pt-16 sm:pb-10 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div
            className="h-[500px] w-[900px] rounded-full opacity-[0.07] blur-[140px]"
            style={{
              background:
                "radial-gradient(ellipse, #d4af37 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="container-wrapper relative z-10 mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-3 flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/40 sm:w-12" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400/70 sm:text-xs">
                Carer Recruitment
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/40 sm:w-12" />
            </div>

            <h1 className="main-page-heading">
              Join Our Carer Network
            </h1>

            <p className="page-supporting-text mx-auto mt-6 max-w-2xl text-center">
              Grace &amp; Goodwill is recruiting experienced independent live-in
              carers nationwide. If you provide live-in care and want to be
              introduced to families who need your skills, we would like to hear
              from you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={AUTH_ROUTES.register.carer}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b59469] px-6 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#c9a67d] hover:text-white hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 sm:w-auto"
              >
                Register as a Carer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={AUTH_ROUTES.login.carer}
                className="inline-flex w-full items-center justify-center rounded-xl border border-gold-300/25 px-6 py-3 text-sm font-semibold text-gold-200 transition-all duration-300 hover:border-gold-300/50 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 sm:w-auto"
              >
                Login as a Carer
              </Link>
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-200/50">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Live-in placements across the United Kingdom
            </p>
          </div>
        </div>
      </section>

      {/* ── Who we are ────────────────────────────────────────────────── */}
      <section className="pb-14 sm:pb-16">
        <div className="container-wrapper mx-auto max-w-4xl">
          <div className="rounded-[1.75rem] border border-gold-400/15 bg-navy-900/40 p-6 shadow-elegant backdrop-blur-xl sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Who We Are
            </h2>
            <div className="mt-4 space-y-4">
              <p className="page-supporting-text">
                Grace &amp; Goodwill is an introductory agency. We introduce
                self-employed live-in carers to families and individuals who
                need support at home, and we do not provide regulated care
                services ourselves.
              </p>
              <p className="page-supporting-text">
                That distinction matters to you as a carer: you are not our
                employee. You remain independent, you agree your own terms with
                the people you support, and you decide which introductions to
                accept. Our role is to verify, match and support the
                relationship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why join ──────────────────────────────────────────────────── */}
      <section className="pb-14 sm:pb-16">
        <div className="container-wrapper mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Why Carers Join Us
            </h2>
            <div
              aria-hidden
              className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
            />
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {reasons.map((reason) => (
              <li
                key={reason.title}
                className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 backdrop-blur-md transition-colors duration-300 hover:border-gold-300/25"
              >
                <h3 className="text-base sm:text-lg font-serif text-gold-50">
                  {reason.title}
                </h3>
                <p className="page-supporting-text mt-2">
                  {reason.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Onboarding ────────────────────────────────────────────────── */}
      <section className="pb-14 sm:pb-16">
        <div className="container-wrapper mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              What Onboarding Involves
            </h2>
            <p className="page-supporting-text mx-auto mt-4 max-w-2xl text-center">
              Registration takes a few minutes. Completing your profile takes
              longer, because every carer we introduce is verified to the same
              standard.
            </p>
          </div>

          <ol className="space-y-4">
            {onboardingStages.map(({ Icon, title, body }, index) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 backdrop-blur-md sm:gap-5 sm:p-6"
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/25 bg-gold-DEFAULT/5">
                    <Icon
                      className="h-4 w-4 text-gold-300"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-mono text-[10px] text-gold-200/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-serif text-gold-50">
                    {title}
                  </h3>
                  <p className="page-supporting-text mt-1.5">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Documents ─────────────────────────────────────────────────── */}
      <section className="pb-14 sm:pb-16">
        <div className="container-wrapper mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Documents You Will Be Asked For
            </h2>
            <p className="page-supporting-text mx-auto mt-4 max-w-2xl text-center">
              Having these ready makes onboarding considerably faster. You can
              upload them as you go and return to finish later.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {documentGroups.map((group) => (
              <div
                key={group.heading}
                className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 backdrop-blur-md"
              >
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400/70">
                  {group.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-gold-200/75"
                    >
                      <FileCheck2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400/60"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="page-supporting-text mx-auto mt-6 max-w-3xl text-center text-gold-200/45">
            Requirements can vary depending on the placement and the specialisms
            you offer. Our team will tell you if anything further is needed for
            a particular introduction.
          </p>
        </div>
      </section>

      {/* ── Recruitment enquiries ─────────────────────────────────────── */}
      <section className="pb-14 sm:pb-16">
        <div className="container-wrapper mx-auto max-w-3xl">
          <div className="rounded-[1.75rem] border border-gold-400/15 bg-navy-900/40 p-6 text-center shadow-elegant backdrop-blur-xl sm:p-10">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/25 bg-gold-DEFAULT/5">
              <Mail className="h-5 w-5 text-gold-300" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Recruitment Enquiries
            </h2>
            <p className="page-supporting-text mx-auto mt-3 max-w-xl">
              If you have a question before registering, or you are unsure
              whether your experience is a fit, contact our recruitment team
              directly.
            </p>
            <a
              href={`mailto:${RECRUITMENT_EMAIL}?subject=Carer%20recruitment%20enquiry`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold-300/25 px-5 py-3 text-sm font-semibold text-gold-200 transition-all duration-300 hover:border-gold-300/50 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {RECRUITMENT_EMAIL}
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="pb-20 sm:pb-24">
        <div className="container-wrapper mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-400/20 bg-navy-900/50 p-8 text-center shadow-elegant backdrop-blur-xl sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-400/[0.06] via-transparent to-transparent"
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide leading-snug">
                Ready To Join Our Carer Network?
              </h2>
              <p className="page-supporting-text mx-auto mt-4 max-w-xl">
                Create your carer account and start your onboarding today. You
                can save your progress and complete it at your own pace.
              </p>
              <Link
                href={AUTH_ROUTES.register.carer}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b59469] px-7 py-3.5 text-sm font-semibold text-navy-950 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#c9a67d] hover:text-white hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 sm:w-auto"
              >
                Register as a Carer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
