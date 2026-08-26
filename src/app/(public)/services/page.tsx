import Link from "next/link";
import Button from "@/components/Button";
import {
  Home,
  Users,
  Award,
  BadgeCheck,
  Sun,
  Heart,
  RefreshCw,
} from "lucide-react";
import { faqs } from "@/data/faqData";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata = {
  title: "Live-in Care Services Across the UK | Grace & Goodwill",
  description: "Explore live-in care across the UK including dementia, stroke, respite, disability, hospital discharge, neurological support and urgent live-in carer matching.",
};

const servicesFaqQuestions = [
  "What types of live-in care can I search for?",
  "Can I search for someone with experience relevant to a particular condition?",
  "Can I arrange temporary live-in care?",
  "Can live-in support help someone returning from hospital?",
  "Can I find support following a stroke?",
  "Can younger adults use live-in care?",
  "Does Grace & Goodwill provide clinical rehabilitation?"
];

const coreServices = [
  {
    title: "Live-in Care Matching",
    description:
      "We introduce families to carefully vetted, independent self-employed live-in carers who can provide personalised support within the client’s home. Grace & Goodwill supports the matching and introduction process while the client remains in control of selecting their preferred carer and agreeing care arrangements directly with them.",
    icon: (
      <Home
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Companionship Support",
    description:
      "Find independent self-employed carers who can provide companionship, assistance with daily routines, meal preparation, hobbies and meaningful social interaction tailored to individual preferences and requirements.",
    icon: (
      <Users
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Dementia Support",
    description:
      "We introduce families to independent self-employed carers with experience supporting people living with dementia, helping families find compassionate, person-centred support suited to their needs.",
    icon: (
      <Award
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Recovery After Hospital Discharge",
    description:
      "We introduce families to independent, self-employed carers who can support individuals following hospital discharge. Depending on the client’s requirements, support may include assistance with daily routines, mobility, meal preparation and encouraging independence during recovery. Grace & Goodwill does not provide nursing or clinical services.",
    icon: (
      <BadgeCheck
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Respite Arrangements",
    description:
      "We introduce families to independent, self-employed carers who can provide temporary live-in support, allowing primary family carers to take a planned or emergency break while maintaining continuity and familiarity at home.",
    icon: (
      <Sun
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Couples Support",
    description:
      "We introduce experienced self-employed live-in carers who can support couples wishing to remain together in their own home, with care arrangements tailored to each person’s individual needs.",
    icon: (
      <Heart
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
];

export default function ServicesPage() {
  const servicesFaqs = faqs.filter(faq => servicesFaqQuestions.includes(faq.question));

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-20 text-gold-100/90">
      <div className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[600px] rounded-full bg-gold-500/5 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[450px] w-[600px] rounded-full bg-navy-800/30 blur-[130px]" />

      <div className="container-wrapper">
        {/* Header Section */}
        <section className="mb-20 text-center">
          <div className="page-strapline">Services</div>

          <h1 className="main-page-heading">
            Live-in Care and Support for Different Needs Across the UK
          </h1>

          <p className="page-supporting-text mx-auto mt-6 max-w-2xl">
            Grace & Goodwill is an introductory platform that connects families
            with carefully vetted, independent, self-employed live-in carers
            across the UK. Grace & Goodwill does not directly provide or manage
            care. Clients choose their preferred carer and enter into a separate
            agreement directly with that carer.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold text-gold-50 tracking-wide">
                {service.title}
              </h2>
              <p className="page-supporting-text mt-4">
                {service.description}
              </p>
            </div>
          ))}
        </section>

        {/* 7th Service Featured Wide Panel */}
        <section className="mt-8">
          <div className="group relative overflow-hidden rounded-[32px] border border-gold-300/15 bg-gradient-to-r from-navy-900/70 to-navy-900/40 p-6 pb-6 sm:p-8 sm:pb-8 md:px-12 md:pt-12 md:pb-10 shadow-elegant backdrop-blur-md transition-all duration-300 hover:border-gold-300/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                    <RefreshCw
                      className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                      Guaranteed Coverage
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
                      Rapid Replacement Introductions
                    </h2>
                  </div>
                </div>
                <p className="page-supporting-text">
                  If your chosen self-employed live-in carer becomes
                  unavailable, Grace & Goodwill will make every reasonable
                  effort to introduce suitable replacement carers from our
                  nationwide network as quickly as possible. The client remains
                  responsible for selecting and engaging their preferred carer
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center justify-start lg:justify-end">
                <div className="rounded-2xl border border-gold-300/10 bg-navy-950/60 px-6 py-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-300 font-medium">
                    Care Standard
                  </p>
                  <p className="text-xl font-semibold text-gold-50 mt-1">
                    Rapid Replacement Introductions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-6 sm:p-8 md:p-12 text-center backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            Let&apos;s Discuss How We Can Support You.
          </h2>
          <p className="page-supporting-text mx-auto mt-4 max-w-xl">
            Speak with our care matching specialists to discuss your
            requirements. We’ll help you find and introduce suitable
            independent, self-employed carers based on your individual needs and
            preferences.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="primary"
              size="md"
              fullWidth={false}
              className="px-8 py-3.5"
            >
              <Link href="/contact" prefetch={false} id="btn-services-contact">
                Get In Touch
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="md"
              fullWidth={false}
              className="px-8 py-3.5"
            >
              <Link href="/about" prefetch={false} id="btn-services-about">
                About Our Care
              </Link>
            </Button>
          </div>
        </section>

        {/* SERVICES FAQ */}
        <section className="mt-20">
          <div className="max-w-4xl mx-auto bg-navy-900/40 p-8 md:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="section-heading">Frequently Asked Questions</h2>
            </div>
            <FAQAccordion faqsList={servicesFaqs} groupByCategory={false} />
          </div>
        </section>
      </div>
    </main>
  );
}
