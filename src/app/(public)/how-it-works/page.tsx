import Button from "@/components/Button";
import Link from "next/link";
import { MapPin, Search, BadgeCheck, HeartHandshake } from "lucide-react";
import { AUTH_ROUTES } from "@/lib/auth-routes";

const steps = [
  {
    number: "01",
    title: "Make an enquiry",
    description:
      "Contact us by phone, WhatsApp or email and tell us about the type of live-in support you’re looking for.",
    icon: (
      <MapPin
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    number: "02",
    title: "Learn how the platform works",
    description:
      "We’ll explain how our platform works and show you how to browse and compare available live-in carers.",
    icon: (
      <Search
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    number: "03",
    title: "Choose your preferred carer",
    description:
      "View carer profiles, including their photo, introductory video, experience, hobbies, qualifications and availability, then choose the carer you feel best matches your needs and preferences.",
    icon: (
      <BadgeCheck
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
  {
    number: "04",
    title: "Begin your live-in arrangement",
    description:
      "Once you’ve chosen your preferred carer and you both agree to proceed, your live-in care arrangement can begin.",
    icon: (
      <HeartHandshake
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      {/* Decorative Brand Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[300px] w-[500px] rounded-full bg-gold-600/5 blur-[100px]" />

      <div className="mx-auto max-w-5xl">
        <section className="mb-20 text-center">
          {/* <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Our Process
          </p>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-gold-50 sm:text-5xl md:text-6xl">
            Simple to begin.{" "}
            <span className="font-semibold text-gold-DEFAULT">
              Supportive throughout.
            </span>
          </h1> */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight text-gold-100">
              Simple to begin,supportive throughout
            </h1>
            <div className="h-px w-10 bg-gradient-to-l from-transparent text-gold-100" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Make finding the right self-employed live-in carer simple. Our
            introduction platform gives you the freedom to choose the carer that
            best suits your needs, personality and preferences, at your own
            pace.
          </p>
        </section>

        <section className="relative">
          {/* Vertical central timeline guide for desktop */}
          <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-gold-500/10 via-gold-500/40 to-gold-500/10 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.title}
                  className={`group relative flex flex-col md:flex-row md:items-center ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  <div className="absolute left-8 top-8 z-10 flex h-0.5 w-0.5 items-center justify-center md:left-1/2 md:top-1/2">
                    <div className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300 bg-navy-950 shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-125 group-hover:border-gold-200 transition-all duration-300" />
                  </div>

                  <div
                    className={`ml-16 w-auto rounded-[24px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] md:ml-0 md:w-[calc(50%-40px)] ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left: Icon and Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                            {step.icon}
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                              Step {step.number}
                            </span>
                            <h2 className="text-xl font-semibold text-gold-50 tracking-wide mt-0.5">
                              {step.title}
                            </h2>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gold-200/70 sm:text-base">
                          {step.description}
                        </p>
                      </div>

                      {/* Right: Large Transparent Step Number */}
                      <div className="hidden text-right sm:block">
                        <span className="select-none text-5xl font-extralight tracking-tighter text-gold-300/10 group-hover:text-gold-300/20 transition-colors duration-300">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-6 sm:p-8 md:p-12 text-center backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            Ready to find trusted support?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            We help families find trusted live-in carers through a carefully
            considered matching process, giving you the confidence to choose the
            right person for your needs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="navy">
              {/* This CTA sits under family-facing copy, so it is explicitly
                  the client journey rather than relying on the default. */}
              <Link href={AUTH_ROUTES.register.client} prefetch={false}>
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq" prefetch={false}>
                Read FAQs
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
