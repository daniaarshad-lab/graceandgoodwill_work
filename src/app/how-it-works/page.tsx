import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Tell us about you",
    description: "Tell us about you and what matters most.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Explore options",
    description: "Explore carefully selected support options.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h.008v.008H9V12zm3 0h.008v.008H12V12zm3 0h.008v.008H15V12z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Choose support",
    description: "Choose the support that feels right.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Receive continuity",
    description: "Receive continuity and ongoing support.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12c-1.5-1.5-3-2.5-4.5-2.5S4.5 10.5 4.5 12s1.5 2.5 3 2.5 3-1 4.5-2.5c1.5-1.5 3-2.5 4.5-2.5s3 1 3 2.5-1.5 2.5-3 2.5-3-1-4.5-2.5z"
        />
      </svg>
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
        {/* Page Header */}
        <section className="mb-20 text-center">
          <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Our Process
          </p>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-gold-50 sm:text-5xl md:text-6xl">
            Simple to begin.{" "}
            <span className="font-semibold text-gold-DEFAULT">
              Supportive throughout.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            At Grace & Goodwill, we bring harmony and clarity to live-in care
            coordination. We make it simple to get started, ensuring your
            choices are respected and supported continuously.
          </p>
        </section>

        {/* Timeline Steps Section */}
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
                  {/* Timeline Intersection Node */}
                  <div className="absolute left-8 top-8 z-10 flex h-0.5 w-0.5 items-center justify-center md:left-1/2 md:top-1/2">
                    <div className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300 bg-navy-950 shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-125 group-hover:border-gold-200 transition-all duration-300" />
                  </div>

                  {/* Step Card */}
                  <div
                    className={`ml-16 w-auto rounded-[24px] border border-gold-300/10 bg-navy-900/40 p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] md:ml-0 md:w-[calc(50%-40px)] ${
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

        {/* Call to Action */}
        <section className="mt-24 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-light text-gold-50 sm:text-3xl">
            Ready to find{" "}
            <span className="font-semibold text-gold-DEFAULT">
              trusted support?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Begin with confidence. We coordinate and support every moment so you
            can focus on what truly matters.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-elegant transition duration-300 hover:bg-gold-400 hover:scale-[1.02]"
            >
              Get Started
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-full border border-gold-300/30 px-8 py-3.5 text-sm font-semibold text-gold-200 transition duration-300 hover:bg-navy-900/50 hover:border-gold-300/60"
            >
              Read FAQs
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
