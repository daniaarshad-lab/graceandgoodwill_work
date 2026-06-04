import Link from "next/link";
import Button from "@/components/Button";
import {
  BadgeCheck,
  Users,
  BookOpen,
  Bell,
  FileText,
  Star,
} from "lucide-react";

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
      <BadgeCheck
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
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
      <Users
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
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
      <BookOpen
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
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
      <Bell
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
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
      <FileText
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
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
      <Star
        className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />
    ),
  },
];

export default function TrainingPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-20 text-gold-100/90">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-10 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />

      <div className="container-wrapper">
        {/* Header Section */}
        <section className="mb-20 text-center">        

             <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-gold-darker">
                   Premium Training & Support for Carers</h1>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>

          
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            A flexible learning and compliance system built for professional
            care organizations. Empower your team with mandatory courses,
            interactive e-learning, and certificate verification.
          </p>
        </section>

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
                <Button variant="ghost-gold" size="sm" fullWidth>
                  {m.cta}
                </Button>
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
              prefetch={true}
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-elegant transition duration-300 hover:bg-gold-400 hover:scale-[1.02]"
            >
              Contact Sales
            </Link>
            <Link
              href="/how-it-works"
              prefetch={true}
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
