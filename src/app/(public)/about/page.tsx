import Image from "next/image";
import ceoImage from "@/assets/auth/ceo-image.jpeg";
import aboutUsFirstImg from "@/assets/open/AboutUs-first-img.jpeg";
import aboutUsSecondImg from "@/assets/open/AboutUs-second-img.jpeg";
import aboutUsThirdImg from "@/assets/open/AboutUs-third-img.jpeg";

// ─── Value card data ──────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="container-wrapper flex min-h-screen flex-col gap-10 py-16">
      {/* ── REDESIGNED HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-950 to-navy-900 text-gold-50 shadow-elegant ring-1 ring-gold-400/10 px-6 py-12 sm:px-12 sm:py-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-800/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight text-gold-100">
              About Grace &amp; Goodwill
            </h1>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>

          <div className="space-y-5 text-base sm:text-lg text-gold-200/90 leading-relaxed max-w-3xl">
            <p className="text-sm sm:text-base text-gold-200/70">
              Grace &amp; Goodwill was created from real experience and a belief
              that support should feel reassuring from the very beginning. We
              understand families are not simply searching for availability they
              are searching for somebody they can trust and a process that feels
              calm, personal, and dependable. Our role is to connect people with
              carefully selected support while maintaining clear
              communication, and meaningful human connection.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 1 · MEET OUR FOUNDER ────────────────────────────────────── */}
      <section className="w-full text-gold-50">
        <div className="max-w-[1400px] mx-auto pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Meet Aurea Neto, Our Founder
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
          </div>

          {/* Photo — Centered Portrait */}
          <div className="relative mx-auto w-full max-w-sm mb-14">
            <div className="relative rounded-t-[4rem] rounded-b-xl overflow-hidden border border-gold-400/20 shadow-2xl bg-navy-950 p-2.5 group">
              <div className="relative rounded-t-[3.5rem] rounded-b-lg overflow-hidden">
                <Image
                  src={ceoImage}
                  alt="Aurea Neto, Founder of Grace &amp; Goodwill"
                  width={400}
                  height={500}
                  className="w-full aspect-[4/5] object-cover filter contrast-[1.02] transition-transform duration-1000 group-hover:scale-105"
                  style={{ color: "transparent", objectPosition: "19% 35%", objectFit: "cover" }}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-gold-400/10 rounded-t-[3.5rem] rounded-b-lg pointer-events-none" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-gold-400/30 rounded-br-2xl pointer-events-none transition-all duration-700 group-hover:-bottom-5 group-hover:-right-5" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-gold-400/30 rounded-tl-[3.5rem] pointer-events-none transition-all duration-700 group-hover:-top-5 group-hover:-left-5" />
          </div>

          {/* Featured pull quote — beautifully centered */}
          <div className="relative text-center mb-14 px-4">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 sm:-top-10 left-0 right-0 mx-auto text-[4rem] sm:text-[6rem] leading-none text-gold-400/50 font-serif select-none"
            >
              &ldquo;
            </span>
            <p className="relative text-xl sm:text-2xl italic text-gold-200 leading-relaxed font-serif">
              I founded Grace &amp; Goodwill because I believe care should never
              feel like a transaction. It should feel human.
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base text-gold-100/90 leading-relaxed font-light">
            <p>
              Throughout my life, I have been drawn to helping others, whether through
              supporting vulnerable people professionally, caring for family members, or
              standing alongside those facing difficult moments in life. I have always
              believed that every person deserves to be treated with dignity, kindness,
              compassion, and genuine respect.
            </p>

            <p>
              After spending years working within the Probation Service, I realised that
              my purpose was not simply to work within a system, but to create something
              that could make a lasting difference in people&apos;s lives. Grace &amp;
              Goodwill was founded on the belief that families deserve honesty, carers
              deserve respect, and those receiving support deserve a trusted match, and
              meaningful human connection.
            </p>

            <div className="relative mx-auto w-full max-w-2xl my-8 sm:my-12">
              <div className="relative rounded-2xl overflow-hidden border border-gold-400/20 shadow-2xl bg-navy-950 p-2 sm:p-3 group">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={aboutUsFirstImg}
                    alt="Aurea and Erica"
                    className="w-full h-auto object-cover filter contrast-[1.02] transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold-400/10 rounded-xl pointer-events-none" />
                </div>
              </div>
            </div>

            <p>
              My sister Erica has been one of my greatest teachers in life. Supporting
              and caring for her over the years gave me first-hand insight into how
              important dignity, patience, consistency, and genuine human connection are
              to a person&apos;s wellbeing. She showed me the difference that the right
              support can make, not only for the individual receiving care, but also for
              the people who love them. This experience, together with my professional background supporting
              vulnerable people, continues to shape every decision we make at Grace &amp;
              Goodwill.
            </p>


            <div className="relative mx-auto w-full max-w-2xl my-8 sm:my-12">
              <div className="relative rounded-2xl overflow-hidden border border-gold-400/20 shadow-2xl bg-navy-950 p-2 sm:p-3 group">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={aboutUsSecondImg}
                    alt="Aurea and Erica holding hands"
                    className="w-full h-auto object-cover filter contrast-[1.02] transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold-400/10 rounded-xl pointer-events-none" />
                </div>
              </div>
            </div>

            <p className="italic text-lg sm:text-xl text-gold-300/90 font-serif leading-relaxed text-center">
              At the heart of Grace &amp; Goodwill is a simple belief: when people feel seen, valued, respected and genuinely cared for, lives change. Our mission is to build trusted relationships and leave the world a little better than we found it, one person and one family at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 · OUR STORY ──────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-950 to-navy-900 text-gold-50 shadow-elegant ring-1 ring-gold-400/10 px-6 py-12 sm:px-12 sm:py-20 lg:p-24 mb-24 max-w-[1400px] mx-auto">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-800/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Inner subtle premium glow to add visual depth to the story content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-400/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-gold-400/50" />
              <h2 className="text-3xl sm:text-4xl font-serif text-gold-50 tracking-wide">
                Our Story
              </h2>
              <div className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-gold-400/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Image */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0">
              <div className="relative rounded-2xl overflow-hidden border border-gold-400/20 shadow-2xl bg-navy-950 p-2 sm:p-3 group">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={aboutUsThirdImg}
                    alt="Holding hands close up"
                    className="w-full h-auto object-cover filter contrast-[1.02] transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold-400/10 rounded-xl pointer-events-none" />
                </div>
              </div>
              {/* Decorative corners */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-gold-400/20 rounded-br-3xl pointer-events-none hidden sm:block" />
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-gold-400/20 rounded-tl-3xl pointer-events-none hidden sm:block" />
            </div>

            {/* Right Column: Text */}
            <div className="space-y-6 text-base text-gold-100/80 leading-relaxed font-light">
              <p>
                Grace &amp; Goodwill was created because too many families are left feeling overwhelmed when trying to find care they can genuinely trust, while many exceptional carers struggle to find ethical opportunities where they are respected, valued and treated fairly.
              </p>
              <p>
                We believe outstanding care starts with people. Skills and experience matter, but kindness, trust and genuine human connection matter just as much. Every family has a unique story, every carer brings something valuable, and every care journey deserves to be met with dignity, compassion and respect.
              </p>
              <p>
                For me, care has never been just a profession. My sister, Erica, has been one of my greatest teachers. Through supporting and advocating for her, I learned that dignity, patience, consistency and genuine human connection aren&apos;t just ideals—they are the foundation of exceptional care. It showed me the profound difference the right support can make, not only for the person receiving care, but for the family who loves them.
              </p>
              <p>
                Combined with my years of professionally supporting vulnerable people, those experiences continue to shape every decision we make at Grace &amp; Goodwill and the standards we expect from every carer we introduce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 · BBC / FEATURED IN — temporarily hidden ───────────────────────────────────── */}
      {/*
      <section className="rounded-2xl bg-navy-950 text-gold-50 shadow-lg ring-1 ring-navy-900/40 p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-400 font-semibold mb-2">
          Credibility &amp; Recognition
        </p>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-gold-400/40 to-transparent" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-gold-50 whitespace-nowrap">
            As Featured On
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-gold-400/40 to-transparent" />
        </div>

        <p className="text-sm text-gold-200/70 leading-relaxed max-w-2xl mx-auto text-center mb-10">
          Aurea&apos;s mission to bring integrity and human-first compassion into
          the live-in care sector has been recognised by major regional
          broadcasters and press.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="group rounded-2xl border border-gold-300/10 bg-navy-900/60 overflow-hidden hover:border-gold-300/25 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden">
              <Image
                src="/bbc_interview_thumbnail.png"
                alt="BBC Radio Newcastle – Aurea Neto interview"
                width={800}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gold-400/90 flex items-center justify-center shadow-elegant transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-300">
                  <Play className="w-5 h-5 fill-navy-950 text-navy-950 ml-0.5" />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-600/90 text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  BBC Sounds
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
              <div>
                <h3 className="text-base font-bold text-gold-100 group-hover:text-gold-50 transition-colors mb-1.5">
                  Specialist Live-In Care Interview
                </h3>
                <p className="text-sm text-gold-200/60 leading-relaxed">
                  Listen to Aurea&apos;s BBC Radio Newcastle interview — a candid
                  conversation about how Grace &amp; Goodwill is raising the bar
                  in live-in care through integrity and genuine human connection.
                </p>
              </div>

              <div className="h-8 flex items-end gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
                {[0.4, 0.75, 0.3, 0.85, 0.5, 0.95, 0.6, 0.45, 0.7, 0.35, 0.8, 0.65].map(
                  (h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h * 100}%` }}
                      className="w-1 bg-gradient-to-t from-gold-600 to-gold-300 rounded-full"
                    />
                  )
                )}
              </div>

              <div className="mt-auto">
                <Button asChild variant="primary" size="sm" fullWidth>
                  <a
                    href="https://www.bbc.co.uk/sounds/play/p0m85mv7?partner=uk.co.bbc&origin=share-mobile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Listen on BBC Sounds
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-gold-300/10 bg-navy-900/60 overflow-hidden hover:border-gold-300/25 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
            <div className="relative h-44 bg-gradient-to-br from-navy-900 to-navy-950 border-b border-gold-300/8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-center gap-3 px-8 opacity-20 pointer-events-none">
                {[75, 90, 60, 80, 50].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 bg-gold-300/50 rounded-full"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="relative z-10 text-center px-8 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold-400/70">
                  Press Feature
                </p>
                <p className="text-gold-50 font-bold text-base leading-snug">
                  Redefining Care Standards
                </p>
                <p className="text-gold-300/50 text-xs">
                  NE Business &amp; Innovation Centre
                </p>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-300/10 text-gold-200 border border-gold-300/20">
                  Press Feature
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
              <div>
                <h3 className="text-base font-bold text-gold-100 group-hover:text-gold-50 transition-colors mb-1.5">
                  Aurea Launches Compassionate Care Company
                </h3>
                <p className="text-sm text-gold-200/60 leading-relaxed">
                  Read the NE BIC customer story documenting how Aurea launched
                  Grace &amp; Goodwill — shaped by lived experience and a
                  commitment to raising standards in client-centred live-in care.
                </p>
              </div>

              <blockquote className="border-l-2 border-gold-400/30 pl-4 text-sm italic text-gold-300/65 leading-relaxed">
                &ldquo;Shaped by lived experience — a story of purpose, resilience,
                and compassionate leadership.&rdquo;
              </blockquote>

              <div className="mt-auto">
                <Button asChild variant="secondary" size="sm" fullWidth>
                  <a
                    href="https://www.ne-bic.co.uk/customer-stories/aurea-launches-compassionate-care-company-shaped-by-lived-experience/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Full Article
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-5xl mx-auto rounded-xl border border-gold-300/8 bg-navy-900/30 px-6 py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <Mic className="w-7 h-7 text-gold-400/50 flex-shrink-0" />
          <p className="text-sm text-gold-200/55 text-center sm:text-left leading-relaxed">
            <span className="text-gold-200/80 font-semibold">Recognised expertise.</span>{" "}
            Aurea&apos;s story has been shared across regional broadcasting and
            business press as an example of purpose-led entrepreneurship in the
            care sector — built not from a business case, but from a deeply
            human one.
          </p>
        </div>
      </section>
      */}

    </main>
  );
}
