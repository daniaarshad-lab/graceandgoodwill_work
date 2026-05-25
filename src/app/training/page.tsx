import Link from "next/link";

const modules = [
  {
    title: "Mandatory Training",
    description:
      "Core compliance and safeguarding modules every carer must complete to ensure client safety.",
    bullets: [
      "Safeguarding adults",
      "Health & safety",
      "Medication management",
    ],
    cta: "View mandatory modules",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
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
    title: "Face-to-Face Training",
    description:
      "Practical, interactive workshops delivered by experienced training professionals in local settings.",
    bullets: [
      "Small group sessions",
      "On-site or local venues",
      "Practical skills assessments",
    ],
    cta: "Book a session",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
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
    title: "E-learning",
    description:
      "Self-paced online training courses featuring interactive guides and integrated progress tracking.",
    bullets: [
      "24/7 digital access",
      "Fully mobile responsive",
      "Interactive quizzes & certificates",
    ],
    cta: "Start e-learning",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
  },
  {
    title: "Expiry Reminders",
    description:
      "Automated administrative tracking to ensure certifications remain active with no compliance gaps.",
    bullets: [
      "Configurable warning windows",
      "Direct email & SMS notifications",
      "Manager dashboard tracking",
    ],
    cta: "Configure reminders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
  },
  {
    title: "Certificates & Records",
    description:
      "Secure, encrypted storage of learning history, audit-ready reports, and verified credentials.",
    bullets: [
      "Instant PDF downloads",
      "Audit-ready compliance export",
      "Role-based visibility controls",
    ],
    cta: "View records",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    title: "Subscriber Benefits",
    description:
      "Special access, prioritized slots, and custom development paths for subscribed care organizations.",
    bullets: [
      "Priority workshop booking",
      "Custom career learning pathways",
      "Dedicated advisory support",
    ],
    cta: "See benefits",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499c.195-.39.81-.39.995 0l2.353 4.77 5.263.765c.43.063.602.583.29.896l-3.808 3.712.899 5.241c.078.455-.4.793-.81.577L12 17.25l-4.707 2.477c-.41.216-.889-.122-.81-.577l.899-5.241-3.808-3.712c-.3-.313-.128-.833.29-.896l5.263-.765 2.352-4.77z"
        />
      </svg>
    ),
  },
];

export default function TrainingPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-10 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <section className="mb-20 text-center">
          <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Academy & Compliance
          </p>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-gold-50 sm:text-5xl md:text-6xl">
            Premium Training &{" "}
            <span className="font-semibold text-gold-DEFAULT">
              Support for Carers
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            A flexible learning and compliance system built for professional
            care organizations. Empower your team with mandatory courses,
            interactive e-learning, and certificate verification.
          </p>
        </section>

        {/* Modules Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.title}
              className="group relative flex flex-col justify-between rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]"
            >
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                  {m.icon}
                </div>
                <h2 className="text-xl font-semibold text-gold-50 tracking-wide">
                  {m.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gold-200/70">
                  {m.description}
                </p>

                {m.bullets.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {m.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-center text-xs text-gold-200/60"
                      >
                        <span className="mr-2 text-gold-400">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8">
                <button className="inline-flex w-full items-center justify-center rounded-xl border border-gold-300/20 px-4 py-2.5 text-xs font-semibold text-gold-200 transition duration-300 hover:bg-navy-950 hover:border-gold-300/50">
                  {m.cta}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Banner Call to Action */}
        <section className="mt-24 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-light text-gold-50 sm:text-3xl">
            Want to customize{" "}
            <span className="font-semibold text-gold-DEFAULT">
              training paths?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Configure learning milestones, customized compliance dashboards, and
            group discount structures. Contact our learning advisors to begin.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-elegant transition duration-300 hover:bg-gold-400 hover:scale-[1.02]"
            >
              Contact Sales
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-gold-300/30 px-8 py-3.5 text-sm font-semibold text-gold-200 transition duration-300 hover:bg-navy-900/50 hover:border-gold-300/60"
            >
              How It Works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
