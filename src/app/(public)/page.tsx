import { Newspaper, ExternalLink, MessageCircle } from "lucide-react";
import happySeniorCouple from "@/assets/open/happy_senior_couple.png";
import bbcImage2 from "@/assets/open/bbc-image2.jpg";
import bbcImage3 from "@/assets/open/bbc-image3.jpg";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import EmergencyButton from "@/components/EmergencyButton";

const BBCAudioCard = dynamic(() => import("@/components/BBCAudioCard"));

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-[calc(100vh-80px)] bg-navy-950 pt-6 md:pt-10 lg:pt-20 pb-16 md:pb-24 text-gold-100">
      <section className="container-wrapper relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between pb-16">

        {/* As Seen In Media Badge (Top Right) */}
        <div className="relative lg:absolute lg:-top-8 lg:right-0 2xl:-top-16 2xl:-right-16 z-30 inline-flex self-start lg:self-auto items-center gap-3 bg-navy-900 border border-gold-muted/30 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md hover:border-gold-400/50 hover:shadow-[0_0_15px_rgba(247,215,116,0.15)] transition-all cursor-default">
          <span className="text-[10px] sm:text-xs font-semibold text-gold-200 uppercase tracking-widest hidden sm:inline-block">
            As Seen On
          </span>
          <div className="flex items-center gap-1.5">
            {/* BBC Logo Blocks */}
            <div className="flex gap-0.5">
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">B</span>
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">B</span>
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">C</span>
            </div>
            <span className="text-white font-bold tracking-[0.2em] text-xs sm:text-sm">
              RADIO
            </span>
          </div>
        </div>

        <div className="max-w-2xl lg:flex-1 xl:flex-none space-y-6 -mt-4 lg:mt-0">


          <h1 className="font-serif font-medium leading-[1.2] tracking-tight drop-shadow-md">
            <span className="text-3xl sm:text-4xl lg:text-[2.5rem] text-white">
              Live In Care Services
            </span><br />
            <span className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#E6C35C] inline-block mt-2">
              Across The UK
            </span>
          </h1>

          <div className="max-w-xl text-gold-100/80 space-y-4 text-lg sm:text-xl leading-relaxed font-light">
            <p>
              Helping families across the UK find trusted live in care with
              compassion, continuity, and genuine human support.
            </p>
            <p className="text-base sm:text-lg opacity-80">
              At Grace & Goodwill, we carefully match families with professional
              carers to provide safe, personal, and dependable care at home.
            </p>
            <p className="text-base sm:text-lg opacity-80">
              From everyday support to urgent care needs, our team is here to
              guide families with integrity, reassurance, and a truly personal
              approach.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 flex-wrap xl:flex-nowrap w-full max-w-[100%] overflow-visible">
            <Button
              asChild
              variant="goldDarker"
              fullWidth={false}
              className="h-14 px-6 w-full xl:w-max shrink-0"
            >
              <Link href="/contact" prefetch={false}>
                Request Care
              </Link>
            </Button>
            <EmergencyButton className="w-full xl:w-max" />
            <Button
              asChild
              variant="whatsapp"
              fullWidth={false}
              className="h-14 px-6 w-full xl:w-max shrink-0 gap-2 group"
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

        <div className="relative flex items-center justify-center mt-0 sm:mt-8 lg:mt-0 w-full lg:flex-1 xl:flex-none lg:max-w-xl h-[380px] sm:h-[450px] overflow-visible">
          {/* Glowing concentric radiating gold rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[260px] sm:w-[280px] h-[260px] sm:h-[280px] rounded-full border-2 border-gold-400 animate-ring-pulse-1" />
            <div className="absolute w-[300px] sm:w-[360px] lg:w-[320px] xl:w-[360px] h-[300px] sm:h-[360px] lg:h-[320px] xl:h-[360px] rounded-full border-2 border-gold-400 animate-ring-pulse-2" />
            <div className="absolute w-[340px] sm:w-[440px] lg:w-[380px] xl:w-[440px] h-[340px] sm:h-[440px] lg:h-[380px] xl:h-[440px] rounded-full border-2 border-gold-400 animate-ring-pulse-3" />
            <div className="absolute w-[380px] sm:w-[520px] lg:w-[440px] xl:w-[520px] max-w-[95vw] lg:max-w-none h-[380px] sm:h-[520px] lg:h-[440px] xl:h-[520px] max-h-[95vw] lg:max-h-none rounded-full border-2 border-gold-400 animate-ring-pulse-4" />
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
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 xl:bottom-6 xl:-left-12 xl:translate-x-0 bg-navy-900/90 border border-gold-muted/30 shadow-elegant rounded-2xl p-3 sm:p-4 w-[260px] max-w-[90vw] sm:w-auto sm:max-w-[280px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col gap-1 z-10">
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
          <div className="text-center mb-10 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              In the Media
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Our mission to bring integrity, continuity, and human-first
            compassion into the live-in care sector has been recognised by
            regional broadcasters and media outlets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 2: BBC Audio Feature */}
          <BBCAudioCard />
          {/* Card 1: BDaily Press Feature */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="relative w-full flex-grow flex flex-col justify-between p-6 sm:p-8 min-h-[340px] group/media">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-navy-950/20 mix-blend-multiply z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 via-40% to-transparent z-10 pointer-events-none transition-opacity duration-500" />
                <Image
                  src={bbcImage2}
                  alt="BDaily Press Feature"
                  fill
                  className="object-cover object-top filter contrast-[1.05] brightness-[0.95] group-hover/media:scale-101 transition-transform duration-700"
                />
              </div>

              <div className="relative z-20 flex justify-center items-center w-full">
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-navy-950/70 backdrop-blur-md text-gold-300 border border-gold-400/20 flex items-center gap-1.5 shadow-sm">
                  <Newspaper className="w-3.5 h-3.5 text-gold-300/80" />
                  BDaily Press Feature
                </span>
              </div>

              <div className="relative z-20 flex flex-col space-y-2 mt-auto mb-0 pt-16">
                <h3 className="text-lg font-bold text-gold-100 group-hover:text-gold-50 transition-colors drop-shadow-md leading-tight">
                  Gateshead Care Firm Grows From Lived Experience
                </h3>
                <p className="text-xs text-gold-100/80 leading-relaxed drop-shadow-md">
                  Read how Grace & Goodwill expands its impact by drawing on
                  personal, lived experiences to deliver high-quality,
                  compassionate live-in care support.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 bg-gradient-to-b from-navy-950/95 to-navy-900/90 relative z-10 shrink-0">
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
          </div>

          {/* Card 3: Regional Press Feature */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="relative w-full flex-grow flex flex-col justify-between p-6 sm:p-8 min-h-[340px] group/media">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-navy-950/20 mix-blend-multiply z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 via-40% to-transparent z-10 pointer-events-none transition-opacity duration-500" />
                <Image
                  src={bbcImage3}
                  alt="Press Feature"
                  fill
                  className="object-cover object-top filter contrast-[1.05] brightness-[0.95] group-hover/media:scale-101 transition-transform duration-700"
                />
              </div>

              <div className="relative z-20 flex justify-center items-center w-full">
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-navy-950/70 backdrop-blur-md text-gold-300 border border-gold-400/20 flex items-center gap-1.5 shadow-sm">
                  <Newspaper className="w-3.5 h-3.5 text-gold-300/80" />
                  BIC Press Feature
                </span>
              </div>

              <div className="relative z-20 flex flex-col space-y-2 mt-auto mb-0 pt-16">
                <h3 className="text-lg font-bold text-gold-100 group-hover:text-gold-50 transition-colors drop-shadow-md leading-tight">
                  Redefining Care Standards
                </h3>
                <p className="text-xs text-gold-100/80 leading-relaxed drop-shadow-md">
                  Review the media publication documenting the launch of Grace &
                  Goodwill&apos;s client-centric alignment framework and our
                  dedication to continuity of support.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 bg-gradient-to-b from-navy-950/95 to-navy-900/90 relative z-10 shrink-0">
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
        </div>
      </section>
    </main>
  );
}
