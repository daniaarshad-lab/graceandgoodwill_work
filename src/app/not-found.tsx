import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Grace & Goodwill",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-navy-950 flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] rounded-full bg-gold-500/5 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-1/4 h-[400px] w-[600px] rounded-full bg-navy-800/40 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-24">
        {/* Large 404 number */}
        <div className="relative mb-6 select-none">
          <span
            className="font-['Cinzel'] text-[120px] sm:text-[160px] lg:text-[200px] font-bold leading-none"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,122,0.15) 0%, rgba(212,175,122,0.4) 50%, rgba(212,175,122,0.15) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          {/* Decorative gold line under 404 */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        </div>

        {/* Heading */}
        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 tracking-tight">
          Page Not Found
        </h1>

        {/* Wave underline */}
        <div className="w-14 h-2 mb-6 mx-auto">
          <svg viewBox="0 0 60 10" fill="none">
            <path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#C2A476" strokeWidth="2" fill="transparent" />
          </svg>
        </div>

        {/* Description */}
        <p className="text-gold-100/60 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
          Sorry, we couldn&apos;t find the page you were looking for. It may have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF7A] via-[#e8c98a] to-[#D4AF7A] text-navy-950 font-semibold text-[15px] hover:opacity-90 hover:shadow-[0_0_20px_rgba(212,175,122,0.35)] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-gold-400/30 text-gold-100/70 font-medium text-[15px] hover:border-gold-400/60 hover:text-gold-100 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-14 pt-8 border-t border-gold-400/10 w-full">
          <p className="text-gold-100/40 text-xs uppercase tracking-widest mb-5 font-medium">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Live-in Care", href: "/live-in-care" },
              { label: "Our Locations", href: "/location" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "Pricing", href: "/pricing" },
              { label: "Join as a Carer", href: "/join-as-carer" },
              { label: "FAQ", href: "/faq" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full border border-gold-400/15 text-gold-100/50 text-[13px] hover:border-gold-400/40 hover:text-gold-200 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
