import Link from "next/link";

const coreServices = [
  {
    title: "Live in support introductions",
    description:
      "Personalized introductions to highly vetted, professional live-in carers who reside in your home, providing 24/7 care, reassurance, and dedicated support.",
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
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    title: "Companionship focused support",
    description:
      "Help with daily routines, sharing hobbies, preparing fresh meals, and warm social connection designed to keep minds active and lives socially rich.",
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
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.097-.407M15 10a4 4 0 11-8 0 4 4 0 018 0zm-5 5.378a4 4 0 00-7.32 0M15 19.143a5.974 5.974 0 00-6.938-4.63M18 10a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Dementia focused support",
    description:
      "Reassuring, structured support tailored for individuals living with memory-related needs, focusing on safety, validation, and cognitive comfort.",
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
          d="M9.813 15.904L9 21l3.582-1.363L16 21l-.813-5.096m0 0a9 9 0 10-5.374 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8.25v1.5m0 3v1.5m-3-3.75h6"
        />
      </svg>
    ),
  },
  {
    title: "Recovery after hospital discharge",
    description:
      "Support during the critical transition back home, assisting with post-operative exercises, medication management, and therapy plans.",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    title: "Respite arrangements",
    description:
      "Temporary, flexible cover allowing primary family caregivers to take a necessary, restorative break while ensuring the client remains in familiar comfort.",
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
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    title: "Couples support",
    description:
      "Customized care programs allowing couples to continue sharing life together under one roof, respecting their shared history and distinct needs.",
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
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
        />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[600px] rounded-full bg-gold-500/5 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[450px] w-[600px] rounded-full bg-navy-800/30 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <section className="mb-20 text-center">
          <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Tailored Care
          </p>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-gold-50 sm:text-5xl md:text-6xl">
            Support designed{" "}
            <span className="font-semibold text-gold-DEFAULT">
              around real lives.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            Every family is unique, and so is our support. Explore our core
            services structured around dignity, continuity, and warm human
            connection.
          </p>
        </section>

        {/* 6-Card Services Grid */}
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
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
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

        {/* Call to Action */}
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
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-elegant transition duration-300 hover:bg-gold-400 hover:scale-[1.02]"
            >
              Get In Touch
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-gold-300/30 px-8 py-3.5 text-sm font-semibold text-gold-200 transition duration-300 hover:bg-navy-900/50 hover:border-gold-300/60"
            >
              About Our Care
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
