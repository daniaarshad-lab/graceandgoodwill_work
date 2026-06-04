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

const coreServices = [
  {
    title: "Live in support introductions",
    description:
      "Personalized introductions to highly vetted, professional live-in carers who reside in your home, providing 24/7 care, reassurance, and dedicated support.",
    icon: (
      <Home
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Companionship focused support",
    description:
      "Help with daily routines, sharing hobbies, preparing fresh meals, and warm social connection designed to keep minds active and lives socially rich.",
    icon: (
      <Users
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Dementia focused support",
    description:
      "Reassuring, structured support tailored for individuals living with memory-related needs, focusing on safety, validation, and cognitive comfort.",
    icon: (
      <Award
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Recovery after hospital discharge",
    description:
      "Support during the critical transition back home, assisting with post-operative exercises, medication management, and therapy plans.",
    icon: (
      <BadgeCheck
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Respite arrangements",
    description:
      "Temporary, flexible cover allowing primary family caregivers to take a necessary, restorative break while ensuring the client remains in familiar comfort.",
    icon: (
      <Sun
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: "Couples support",
    description:
      "Customized care programs allowing couples to continue sharing life together under one roof, respecting their shared history and distinct needs.",
    icon: (
      <Heart
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
];

export default function ServicesPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-20 text-gold-100/90">
      <div className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[600px] rounded-full bg-gold-500/5 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[450px] w-[600px] rounded-full bg-navy-800/30 blur-[130px]" />

      <div className="container-wrapper">
        {/* Header Section */}
        <section className="mb-20 text-center">        

             <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-gold-darker">
                  Support designed around real lives</h1>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>
          
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            Every family is unique, and so is our support. Explore our core
            services structured around dignity, continuity, and warm human
            connection.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold text-gold-50 tracking-wide">
                {service.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gold-200/70">
                {service.description}
              </p>
            </div>
          ))}
        </section>

        {/* 7th Service Featured Wide Panel */}
        <section className="mt-8">
          <div className="group relative overflow-hidden rounded-[32px] border border-gold-300/15 bg-gradient-to-r from-navy-900/70 to-navy-900/40 p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:border-gold-300/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] md:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
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
                    <h2 className="text-2xl font-semibold text-gold-50 tracking-wide mt-0.5">
                      Continuity support and replacement coordination
                    </h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gold-200/75 sm:text-base">
                  We understand that care requirements can adapt, and
                  consistency is crucial. Our operations team manages carer
                  handovers, covers sickness, and handles coordinate
                  transitions, guaranteeing replacement coordination with zero
                  gap in your support coverage.
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center justify-start lg:justify-end">
                <div className="rounded-2xl border border-gold-300/10 bg-navy-950/60 px-6 py-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-300 font-medium">
                    Care Standard
                  </p>
                  <p className="text-2xl font-semibold text-gold-50 mt-1">
                    100% Continuity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-light text-gold-50 sm:text-3xl">
            Let&apos;s discuss how we can{" "}
            <span className="font-semibold text-gold-DEFAULT">
              support you.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Reach out to our care matching experts to discuss your requirements,
            answer your questions, and design a supportive care arrangement.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="primary"
              size="md"
              fullWidth={false}
              className="px-8 py-3.5"
            >
              <Link href="/contact" prefetch={true}>
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
              <Link href="/about" prefetch={true}>
                About Our Care
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
