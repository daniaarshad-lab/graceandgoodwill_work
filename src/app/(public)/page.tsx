import { Newspaper, ExternalLink, MessageCircle } from "lucide-react";
import happySeniorCouple from "@/assets/open/happy_senior_couple.png";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

const BBCAudioCard = dynamic(() => import("@/components/BBCAudioCard"));

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-[calc(100vh-80px)] bg-navy-950 pt-12 pb-16 md:pt-20 md:pb-24 text-gold-100">
      <section className="container-wrapper flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between pb-16">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-white">
            Live In Care Services Across The UK
          </h1>
          <p
            className=" text-base font-medium  text-gold-muted tracking-wide"
            style={{ letterSpacing: "-0.01em" }}
          >
            Care Defined By Integrity
          </p>

          <div className="prose max-w-xl text-gold-200 space-y-2">
            <p>
              Helping families across the UK find trusted live in care with
              compassion, continuity, and genuine human support.
            </p>
            <p>
              At Grace & Goodwill, we carefully match families with professional
              carers to provide safe, personal, and dependable care at home.
            </p>
            <p>
              From everyday support to urgent care needs, our team is here to
              guide families with integrity, reassurance, and a truly personal
              approach.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              variant="goldDarker"
              fullWidth={false}
              className="w-full sm:w-auto"
            >
              <Link href="/contact" prefetch={false}>
                Request Care
              </Link>
            </Button>
            <Button
              asChild
              variant="goldBrown"
              fullWidth={false}
              className="w-full sm:w-auto"
            >
              <Link href="/emergency-care" prefetch={false}>
                Emergency Care
              </Link>
            </Button>
            <Button
              asChild
              variant="whatsapp"
              fullWidth={false}
              className="w-full sm:w-auto gap-2 group"
            >
              <a
                href="https://wa.me/447700000000?text=Hello%2C%20I'd%20like%20to%20enquire%20about%20live%20in%20care%20services%20from%20Grace%20%26%20Goodwill."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 fill-current text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                Speak To Our Team
              </a>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full lg:max-w-xl h-[380px] sm:h-[450px] overflow-visible">
          {/* Glowing concentric radiating gold rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[260px] sm:w-[280px] h-[260px] sm:h-[280px] rounded-full border-2 border-gold-400 animate-ring-pulse-1" />
            <div className="absolute w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] rounded-full border-2 border-gold-400 animate-ring-pulse-2" />
            <div className="absolute w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full border-2 border-gold-400 animate-ring-pulse-3" />
            <div className="absolute w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full border-2 border-gold-400 animate-ring-pulse-4" />
          </div>

          {/* Focal Circular Portrait Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-4 border-gold-400 bg-navy-950 shadow-elegant overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-image-pulse">
            <Image
              src={happySeniorCouple}
              alt="Reassured senior couple supported by Grace & Goodwill live in care"
              className="w-full h-full object-cover scale-[1.05] hover:scale-[1.10] transition-transform duration-700 object-center"
              placeholder="blur"
            />
            {/* Visual decorative gold overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Testimonial Quote Bubble overlapping the circle */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 sm:bottom-6 sm:-left-12 sm:translate-x-0 bg-navy-900/90 border border-gold-muted/30 shadow-elegant rounded-2xl p-3 sm:p-4 w-[260px] max-w-[90vw] sm:w-auto sm:max-w-[280px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col gap-1 z-10">
            <span className="text-2xl sm:text-3xl font-serif text-gold-300/70 leading-none h-3 sm:h-4">
              “
            </span>
            <p className="text-[10px] sm:text-[11px] text-gold-100/80 leading-relaxed">
              Grace & Goodwill has been a true blessing, giving us total peace
              of mind with their reliable, highly compassionate live-in care
              support right at home.
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-gold-400 mt-1 self-end">
              — The Harrison Family
            </p>
          </div>
        </div>
      </section>

      {/* Premium Trust & Media Section */}
      <section className="container-wrapper border-t border-gold-300/10 mt-24 pt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-400 font-semibold">
            Trust & Credibility
          </p>
          <h2 className="text-3xl font-semibold text-gold-50 sm:text-4xl">
            As Featured On BBC Radio Newcastle
          </h2>
          <p className="text-sm text-gold-200/70 leading-relaxed">
            Our mission to bring integrity, continuity, and human-first
            compassion into the live-in care sector has been recognized by major
            regional broadcasters and media outlets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: BDaily Press Feature */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 p-8 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Card Header & Badge */}
              <div className="flex justify-between items-center">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-muted/10 text-gold-200 border border-gold-muted/20">
                  BDaily
                </span>

                <Newspaper className="w-5 h-5 text-gold-300/40 group-hover:text-gold-300 transition-colors" />
              </div>

              {/* Graphic Element: Premium CSS Gradient Block */}
              <div className="h-32 rounded-2xl relative overflow-hidden border border-gold-300/10 group-hover:border-gold-300/30 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/20 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-4xl font-serif text-gold-100/10 font-bold tracking-[0.3em] group-hover:scale-110 group-hover:text-gold-100/20 transition-all duration-700 select-none">
                    BDAILY
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gold-100 group-hover:text-gold-50 transition-colors">
                  Gateshead Care Firm Grows From Lived Experience
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed">
                  Read how Grace & Goodwill expands its impact by drawing on
                  personal, lived experiences to deliver high-quality,
                  compassionate live-in care support.
                </p>
              </div>
            </div>

            <Button asChild variant="secondary" size="sm" fullWidth>
              <a
                href="https://bdaily.co.uk/articles/2025/08/17/gateshead-care-firm-grows-from-lived-experience"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Read Article
              </a>
            </Button>
          </div>
          {/* Card 2: BBC Audio Feature */}
          <BBCAudioCard />
          {/* Card 3: Regional Press Feature */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 p-8 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Card Header & Badge */}
              <div className="flex justify-between items-center">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-muted/10 text-gold-200 border border-gold-muted/20">
                  Press Feature
                </span>

                <Newspaper className="w-5 h-5 text-gold-300/40 group-hover:text-gold-300 transition-colors" />
              </div>

              {/* Graphic Element: Premium CSS Gradient Block */}
              <div className="h-32 rounded-2xl relative overflow-hidden border border-gold-300/10 group-hover:border-gold-300/30 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold-500/20 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-4xl font-serif text-gold-100/10 font-bold tracking-[0.3em] group-hover:scale-110 group-hover:text-gold-100/20 transition-all duration-700 select-none">
                    PRESS
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gold-100 group-hover:text-gold-50 transition-colors">
                  Redefining Care Standards
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed">
                  Review the media publication documenting the launch of Grace &
                  Goodwill&apos;s client-centric alignment framework and our
                  dedication to continuity of support.
                </p>
              </div>
            </div>

            <Button asChild variant="secondary" size="sm" fullWidth>
              <a
                href="https://www.ne-bic.co.uk/customer-stories/aurea-launches-compassionate-care-company-shaped-by-lived-experience/"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Read Article
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
