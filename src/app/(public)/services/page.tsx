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
import Image from "next/image";
import serviceImg1 from "@/assets/open/service-img1.jpeg";
import serviceImg2 from "@/assets/open/service-img2.jpeg";

export const metadata = {
  alternates: {
    canonical: "/services",
  },
  title: "Personalised Live-In Care Services UK | Grace & Goodwill",
  description: "Explore Grace & Goodwill's live-in care services across UK, including dementia care, companionship, respite & post-hospital recovery and aged couples support.",
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
      "Explore carefully vetted live-in carer profiles and find someone whose experience, personality and availability suit your individual needs. Grace & Goodwill supports the matching process while you remain in control of choosing your preferred carer and agreeing arrangements directly with them.",
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
      "Find carers who can provide companionship and support with daily routines, meal preparation, hobbies and meaningful social interaction, tailored to individual preferences and requirements.",
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
      "Browse carers with experience supporting people living with dementia and find compassionate, person-centred support suited to the individual’s routines, preferences and needs.",
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
      "Find carers who can support individuals following hospital discharge with daily routines, mobility, meal preparation and maintaining independence during recovery. Grace & Goodwill does not provide nursing or clinical services.",
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
      "Access carers who can provide temporary live-in support, giving family carers the opportunity to take a planned or emergency break while helping maintain continuity and familiarity at home.",
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
      "Find experienced live-in carers who can support couples wishing to remain together in their own home, with support tailored to each person’s individual needs and preferences.",
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
            Grace & Goodwill is a nationwide live-in care matching platform that helps families find carefully vetted carers across the UK. Clients can explore carer profiles, consider the options available and choose the person they feel is best suited to their needs. Grace & Goodwill supports the matching process and platform experience while clients remain in control of their care arrangements.
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

            <div className="mx-auto max-w-2xl space-y-6 flex flex-col items-center text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner shrink-0">
                  <RefreshCw
                    className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-1">
                    Guaranteed Coverage
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
                    Rapid Replacement Support
                  </h2>
                </div>
              </div>
              <p className="page-supporting-text max-w-xl">
                If your chosen live-in carer becomes
                unavailable, Grace & Goodwill will make every reasonable
                effort to find suitable replacement carers from our
                nationwide network as quickly as possible. The client remains
                responsible for selecting and engaging their preferred carer
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-6 sm:p-8 md:p-12 text-center backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            Let&apos;s Discuss How We Can Support You.
          </h2>
          <p className="page-supporting-text mx-auto mt-4 max-w-xl">
            Speak with our care matching specialists to discuss your
            requirements. We’ll help you find and connect you with suitable
            carers based on your individual needs and preferences.
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

        {/* Styled Image Section 1 */}
        <div className="relative max-w-4xl mx-auto mt-20 mb-8 px-4 py-4 md:px-8 md:py-8">
          {/* Decorative Offset Wireframe Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 border-t border-l border-gold-300/40 rounded-tl-[3rem] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 border-b border-r border-gold-300/40 rounded-br-[3rem] pointer-events-none"></div>

          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group">
            <Image
              src={serviceImg1}
              alt="Grace and Goodwill Live-in Care Services"
              className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105 object-cover"
              placeholder="blur"
            />
            {/* Visual decorative gold overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>


        {/* NEW CLIENT CONTENT */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-gold-50 tracking-wide mb-6">
              You remain in control of the final choice.
            </h2>
            <div className="page-supporting-text mx-auto max-w-3xl space-y-4">
              <p>Grace & Goodwill helps individuals and families find live-in carers for a wide range of circumstances.</p>
              <p>Browse available profiles yourself or ask for additional matching support where needed.</p>
              <p>You can compare relevant experience, skills, interests, videos and availability before deciding who you would like to consider.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Long-Term Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Ongoing live-in care can support people who want to remain in their own home while receiving more consistent everyday assistance.</p>
                <p>Depending on the arrangement agreed with the carer, support may include personal care, meals, mobility, companionship, household activities, shopping, appointments and established daily routines.</p>
              </div>
              <Link href="/live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Learn More About Long-Term Live-in Care
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Urgent Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>When circumstances change suddenly, families may need someone quickly.</p>
                <p>Grace & Goodwill can support urgent live-in carer searches where a suitable available carer may be able to begin within 24 hours.</p>
                <p>This may include hospital discharge, a stroke, sudden mobility changes, family emergencies, an existing carer leaving unexpectedly or urgent respite.</p>
              </div>
              <Link href="/urgent-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Urgent Live-in Care
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Hospital Discharge Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Someone returning home following hospital treatment may temporarily or permanently need more support than before.</p>
                <p>Grace & Goodwill helps families search available live-in carers for support following hospital discharge, including short-notice arrangements where possible.</p>
              </div>
              <Link href="/hospital-discharge-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Hospital Discharge Support
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Stroke and Neurological Support
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>A stroke or neurological condition can affect mobility, communication, confidence and everyday independence differently for every person.</p>
                <p>Clients can search for live-in carers with relevant experience and compare profiles before choosing who they would like to speak with.</p>
                <p>This can sit alongside rehabilitation or clinical services provided by the appropriate healthcare professionals.</p>
              </div>
              <Link href="/live-in-care-after-stroke" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Live-in Care After Stroke
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Convalescent and Recovery Support at Home
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Some people need temporary help while recovering following:</p>
                <ul className="space-y-1 pl-4">
                  <li className="list-disc">Surgery
                    • Illness
                    • Hospital treatment
                    • A fracture
                    • A serious fall
                    • Reduced mobility
                    • A period of physical weakness</li>
                </ul>
                <p>A temporary live-in arrangement may provide practical everyday support while the person recovers at home.</p>
              </div>
              <Link href="/convalescent-care-at-home" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Recovery Support at Home
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Dementia and Alzheimer’s Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>For someone living with dementia, familiar surroundings and routines may be particularly important.</p>
                <p>Families can browse carers with relevant dementia experience and decide who they would like to consider.</p>
              </div>
              <Link href="/dementia-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Dementia Live-in Care
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Respite Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Respite care provides temporary support when a family carer needs a break or cannot provide their usual support.</p>
                <p>Grace & Goodwill can help families search for carers for short placements beginning from approximately 2 days, as well as longer temporary arrangements.</p>
              </div>
              <Link href="/respite-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Respite Live-in Care
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Brain Injury Live-in Support
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Acquired or traumatic brain injury can affect people in very different ways.</p>
                <p>Clients can search for carers with relevant experience supporting mobility, memory, communication, routines and everyday independence.</p>
              </div>
              <Link href="/brain-injury-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Brain Injury Support
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Spinal Injury Live-in Support
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Live-in support can help people with spinal injuries or physical disabilities continue living within their own home and maintaining independence.</p>
                <p>Search profiles according to relevant experience, availability and personal preferences.</p>
              </div>
              <Link href="/spinal-injury-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Spinal Injury Support
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Multiple Sclerosis Live-in Support
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Multiple sclerosis can affect mobility, fatigue and independence differently over time.</p>
                <p>Clients can search profiles for carers with relevant experience and availability that may suit their circumstances.</p>
              </div>
              <Link href="/multiple-sclerosis-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Multiple Sclerosis Support
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Young Adult and Disability Live-in Support
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>Younger adults who require support should not automatically be treated as though they are receiving traditional elderly care.</p>
                <p>Grace & Goodwill helps adults find carers who can fit around their routines, social lives, interests and individual preferences.</p>
              </div>
              <Link href="/young-adult-live-in-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Young Adult Live-in Support
              </Link>
            </div>
            <div className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <h3 className="text-xl font-semibold text-gold-50 tracking-wide mb-4">
                Companionship Live-in Care
              </h3>
              <div className="page-supporting-text space-y-4 mb-8 flex-grow">
                <p>For people who need companionship alongside everyday practical support, live-in care can provide greater consistency while allowing the person to remain in familiar surroundings.</p>
              </div>
              <Link href="/live-in-companionship-care" className="inline-flex w-full justify-center items-center rounded-xl bg-gold-400/10 border border-gold-400/30 px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-400/20 hover:text-gold-100">
                Companionship Care
              </Link>
            </div>


            <div className="md:col-span-2 lg:col-span-3 group relative flex flex-col rounded-[28px] border border-gold-300/15 bg-gradient-to-br from-navy-900/60 to-navy-900/40 p-8 md:p-12 shadow-elegant backdrop-blur-md mt-6">
              <h3 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide mb-6 text-center">
                Live-in Care Costs and Funding
              </h3>
              <p className="page-supporting-text text-center max-w-3xl mx-auto mb-8 text-lg">
                Families can also access information about:
              </p>

              {/* Graceful Banner Image Inside Card */}
              <div className="relative w-full max-w-xl mx-auto mb-10 px-4 py-4 md:px-6 md:py-6">
                {/* Decorative Offset Wireframe Corners */}
                <div className="absolute top-0 left-0 w-20 h-20 md:w-28 md:h-28 border-t border-l border-gold-300/40 rounded-tl-[2.5rem] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 md:w-28 md:h-28 border-b border-r border-gold-300/40 rounded-br-[2.5rem] pointer-events-none"></div>

                <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group">
                  <Image
                    src={serviceImg2}
                    alt="Grace and Goodwill Personalised Care"
                    className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105"
                    placeholder="blur"
                  />
                  {/* Visual decorative gold overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/10 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px] text-gold-100/90 text-left max-w-4xl mx-auto mb-10 bg-navy-950/50 p-8 rounded-3xl border border-gold-300/10 shadow-inner w-full">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Live-in care costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Self-funding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Local authority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>NHS Continuing Healthcare</span>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Attendance Allowance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Funding after hospital discharge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Benefits and other possible sources of support</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  variant="primary"
                  size="md"
                  fullWidth={false}
                  className="px-8 py-3.5 w-full sm:w-auto"
                >
                  <Link href="/live-in-care-costs" prefetch={false}>
                    Live-in Care Costs
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="md"
                  fullWidth={false}
                  className="px-8 py-3.5 w-full sm:w-auto"
                >
                  <Link href="/funding-live-in-care" prefetch={false}>
                    Funding Live-in Care
                  </Link>
                </Button>
              </div>
            </div>
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
