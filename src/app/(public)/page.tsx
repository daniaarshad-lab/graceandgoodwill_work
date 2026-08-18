import { Newspaper, ExternalLink, HandHeart, ChevronRight } from "lucide-react";
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
        <a
          href="https://www.bbc.co.uk/programmes/p0m85mv7"
          target="_blank"
          rel="noopener noreferrer"
          className="relative lg:absolute lg:-top-8 lg:right-[calc(-50vw+50%+2rem)] 2xl:-top-16 2xl:right-[calc(-50vw+50%+4rem)] z-30 inline-flex self-start lg:self-auto items-center gap-3 bg-navy-900 border border-gold-muted/30 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md hover:border-gold-400/50 hover:shadow-[0_0_15px_rgba(247,215,116,0.15)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span className="text-[10px] sm:text-xs font-semibold text-gold-200 uppercase tracking-widest inline-block">
            As Featured on
          </span>
          <div className="flex items-center gap-1.5">
            {/* BBC Logo Blocks */}
            <div className="flex gap-0.5">
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">
                B
              </span>
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">
                B
              </span>
              <span className="bg-white text-black text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded-sm leading-none">
                C
              </span>
            </div>
            <span className="text-white font-bold tracking-[0.2em] text-xs sm:text-sm">
              RADIO
            </span>
          </div>
        </a>

        <div className="max-w-4xl lg:flex-1 xl:flex-none space-y-6 -mt-4 lg:mt-0">
          <h1 className="main-page-heading drop-shadow-md ombre-text">
            Live-in Care Matching Across The UK
          </h1>

          <div className="max-w-xl space-y-4">
            <p className="page-supporting-text">
              Finding someone to support you or a loved one at home is a deeply
              personal decision. At Grace & Goodwill, you remain in control of
              your choices and care arrangements. We believe the right match
              should bring confidence, reassurance and peace of mind when
              welcoming someone into your home.
            </p>
            <p className="page-supporting-text">
              Grace & Goodwill brings families and carefully vetted live-in
              carers together through our online matching platform, where you
              can explore carer profiles featuring their experience, skills,
              interests, availability, photo, introductory video and more,
              helping you find the right live-in carer to match your needs,
              routines and preferences.
            </p>
            <p className="page-supporting-text">
              Whether care is being planned ahead or needed urgently, we make
              the matching process simpler and more personal, with ongoing
              platform support to help maintain continuity when circumstances or
              care arrangements change.
            </p>
          </div>

          <p className="text-base sm:text-lg text-gold-100/90 font-medium pt-2 pb-2">
            Choose the option below that best matches your current needs.
          </p>

          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 flex-wrap xl:flex-nowrap w-full max-w-[100%] overflow-visible">
            <Link
              href="/contact"
              prefetch={false}
              className="group relative flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl bg-[#5C441D] shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:bg-[#6E5223] w-full xl:w-max"
            >
              <div className="flex items-center gap-2 sm:gap-3 text-left z-10">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(247,215,116,0.15)_0%,_transparent_70%)] blur-sm"></div>
                  <HandHeart
                    className="w-8 h-8 text-[#F7D774] relative z-10 drop-shadow-sm"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[#FDF2D5] font-bold text-[13px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm line-clamp-1">
                  FIND A LIVE-IN CARER
                </span>
              </div>
              <ChevronRight
                strokeWidth={3}
                className="text-[#FDF2D5]/70 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 z-10"
              />
            </Link>

            <EmergencyButton className="w-full xl:w-max" />

            <a
              href="https://wa.me/447462931949?text=Hello%2C%20I'd%20like%20to%20enquire%20about%20live%20in%20care%20services%20from%20Grace%20%26%20Goodwill."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl bg-[#063D24] shrink-0 shadow-[0_0_15px_rgba(0,198,83,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,198,83,0.2)] hover:bg-[#085230] w-full xl:w-max"
            >
              <div className="flex items-center gap-2 sm:gap-3 text-left z-10">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(0,198,83,0.15)_0%,_transparent_70%)] blur-sm"></div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-[#00C653] relative z-10 drop-shadow-sm"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <span className="text-[#E0F8EA] font-bold text-[13px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm line-clamp-1">
                  CHAT TO OUR TEAM
                </span>
              </div>
              <ChevronRight
                strokeWidth={3}
                className="text-[#00C653]/70 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 z-10"
              />
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center mt-0 sm:mt-8 lg:mt-0 w-full lg:flex-1 xl:flex-none lg:max-w-xl h-[380px] sm:h-[450px] overflow-visible">
          {/* Glowing concentric radiating gold rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[260px] sm:w-[290px] lg:w-[320px] h-[260px] sm:h-[290px] lg:h-[320px] rounded-full border-2 border-gold-400 animate-ring-pulse-1" />
            <div className="absolute w-[300px] sm:w-[330px] lg:w-[360px] h-[300px] sm:h-[330px] lg:h-[360px] rounded-full border-2 border-gold-400 animate-ring-pulse-2" />
            <div className="absolute w-[340px] sm:w-[370px] lg:w-[400px] h-[340px] sm:h-[370px] lg:h-[400px] rounded-full border-2 border-gold-400 animate-ring-pulse-3" />
            <div className="absolute w-[380px] sm:w-[410px] lg:w-[440px] max-w-[95vw] lg:max-w-none h-[380px] sm:h-[410px] lg:h-[440px] max-h-[95vw] lg:max-h-none rounded-full border-2 border-gold-400 animate-ring-pulse-4" />
          </div>

          {/* Focal Circular Portrait Container */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-4 border-gold-400 bg-navy-950 shadow-elegant overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-image-pulse">
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
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 xl:-bottom-2 xl:left-auto xl:-right-12 xl:translate-x-0 bg-navy-900/90 border border-gold-muted/30 shadow-elegant rounded-2xl p-3 sm:p-4 w-[260px] max-w-[90vw] sm:w-auto sm:max-w-[280px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col gap-1 z-10">
            <span className="text-2xl sm:text-3xl font-serif text-gold-300/70 leading-none h-3 sm:h-4">
              “
            </span>
            <p className="page-supporting-text text-[10px] sm:text-[11px]">
              Grace & Goodwill has been a true blessing, giving us total peace
              of mind with their reliable, highly compassionate live-in care
              support right at home.
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-gold-400 mt-1 self-end">
              — The Harrison Family
            </p>
          </div>
        </div>

        {/* <div className="relative flex items-center justify-center mt-0 sm:mt-8 lg:mt-0 w-full lg:flex-1 xl:flex-none lg:max-w-xl h-[380px] sm:h-[450px] overflow-visible">

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[260px] sm:w-[290px] lg:w-[320px] h-[260px] sm:h-[290px] lg:h-[320px] rounded-full border-2 border-gold-400 animate-ring-pulse-1" />
            <div className="absolute w-[300px] sm:w-[330px] lg:w-[360px] h-[300px] sm:h-[330px] lg:h-[360px] rounded-full border-2 border-gold-400 animate-ring-pulse-2" />
            <div className="absolute w-[340px] sm:w-[370px] lg:w-[400px] h-[340px] sm:h-[370px] lg:h-[400px] rounded-full border-2 border-gold-400 animate-ring-pulse-3" />
            <div className="absolute w-[380px] sm:w-[410px] lg:w-[440px] max-w-[95vw] lg:max-w-none h-[380px] sm:h-[410px] lg:h-[440px] max-h-[95vw] lg:max-h-none rounded-full border-2 border-gold-400 animate-ring-pulse-4" />
          </div>


          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-4 border-gold-400 bg-navy-950 shadow-elegant overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-image-pulse">
            <Image
              src={happySeniorCouple}
              alt="Reassured senior couple supported by Grace & Goodwill live in care"
              className="w-full h-full object-cover scale-[1.05] hover:scale-[1.10] transition-transform duration-700 object-center"
              placeholder="blur"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 via-transparent to-transparent pointer-events-none" />
          </div>


          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 xl:-bottom-2 xl:left-auto xl:-right-12 xl:translate-x-0 bg-navy-900/90 border border-gold-muted/30 shadow-elegant rounded-2xl p-3 sm:p-4 w-[260px] max-w-[90vw] sm:w-auto sm:max-w-[280px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col gap-1 z-10">
            <span className="text-2xl sm:text-3xl font-serif text-gold-300/70 leading-none h-3 sm:h-4">
              “
            </span>
            <p className="page-supporting-text text-[10px] sm:text-[11px]">
              Grace & Goodwill has been a true blessing, giving us total peace
              of mind with their reliable, highly compassionate live-in care
              support right at home.
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-gold-400 mt-1 self-end">
              — The Harrison Family
            </p>
          </div>
        </div> */}
      </section>


      <section className="container-wrapper border-t border-gold-300/10 mt-24 pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-center mb-10 space-y-5">
            <h2 className="section-heading">Media presence</h2>
          </div>
          <p className="page-supporting-text mx-auto mt-4 max-w-xl">
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
                <h3 className="card-heading drop-shadow-md leading-tight">
                  Gateshead Care Firm Grows From Lived Experience
                </h3>
                <p className="page-supporting-text drop-shadow-md">
                  Read how Grace & Goodwill expands its impact by drawing on
                  personal, lived experiences to introduce families to
                  high-quality, compassionate independent live-in carers.
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
                <h3 className="card-heading drop-shadow-md leading-tight">
                  Redefining Care Standards
                </h3>
                <p className="page-supporting-text drop-shadow-md">
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
