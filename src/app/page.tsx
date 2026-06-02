import { Mic, Play, Newspaper, ExternalLink } from "lucide-react";
import happySeniorCouple from "@/assets/open/happy_senior_couple.png";
import Button from "@/components/Button";
import BBCAudioCard from "@/components/BBCAudioCard";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 pt-12 pb-16 md:pt-20 md:pb-24 text-gold-100">
      <section className="container-wrapper flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between pb-16">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-gold-200">
            Grace & Goodwill
          </p>
          <h2>Live In Care Services Across The UK</h2>
          <h5>Care Defined By Integrity</h5>
          <p className="text-lg text-gold-200 max-w-3xl">
            Helping families across the UK find trusted live in care with
            compassion, continuity, and genuine human support.
          </p>

          <div className="prose max-w-xl text-gold-200">
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
              variant="navy"
              fullWidth={false}
              className="w-full sm:w-auto"
            >
              <a href="/contact">Request Care</a>
            </Button>
            <Button
              asChild
              variant="goldDarker"
              fullWidth={false}
              className="w-full sm:w-auto"
            >
              <a href="/emergency-care">Emergency Care</a>
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
                <svg
                  className="w-5 h-5 fill-current text-emerald-400 group-hover:text-emerald-300 transition-colors"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Speak To Our Team
              </a>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full lg:max-w-xl h-[450px] overflow-visible">
          {/* Glowing concentric radiating gold rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[280px] h-[280px] rounded-full border border-gold-300/5 animate-[pulse_3s_infinite_ease-in-out]" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-gold-300/5 animate-[pulse_4s_infinite_ease-in-out_1s]" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-gold-300/3 animate-[pulse_5s_infinite_ease-in-out_2s]" />
            <div className="absolute w-[520px] h-[520px] rounded-full border border-gold-300/2 animate-[pulse_6s_infinite_ease-in-out_3s]" />
          </div>

          {/* Focal Circular Portrait Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-gold-400 bg-navy-950 shadow-elegant overflow-hidden transition-all duration-500 hover:scale-[1.02]">
            <img
              src={happySeniorCouple.src}
              alt="Reassured senior couple supported by Grace & Goodwill live in care"
              className="w-full h-full object-cover scale-[1.05] hover:scale-[1.10] transition-transform duration-700 object-center"
            />
            {/* Visual decorative gold overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Testimonial Quote Bubble overlapping the circle */}
          <div className="absolute bottom-6 -left-4 sm:-left-12 bg-navy-900/90 border border-gold-muted/30 shadow-elegant rounded-2xl p-4 max-w-[260px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col gap-1 z-10">
            <span className="text-3xl font-serif text-gold-300/70 leading-none h-4">
              “
            </span>
            <p className="text-[11px] text-gold-100/80 leading-relaxed">
              Grace & Goodwill has been a true blessing, giving us total peace
              of mind with their reliable, highly compassionate live-in care
              support right at home.
            </p>
            <p className="text-[10px] font-semibold text-gold-400 mt-1 self-end">
              — The Harrison Family
            </p>
          </div>
        </div>
      </section>

      {/* Premium Trust & Media Section */}
      <section className="container-wrapper border-t border-gold-300/10 mt-24 pt-20">
        {/* Section Header */}
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

        {/* Media Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: BBC Sounds Broadcast */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 p-8 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Card Header & Badge */}
              <div className="flex justify-between items-center">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  BBC Sounds Broadcast
                </span>

                <Mic className="w-5 h-5 text-gold-300/40 group-hover:text-gold-300 transition-colors" />
              </div>

              {/* Graphic Element: Simulated Equalizer Wave */}
              <div className="h-20 rounded-2xl bg-navy-950/60 border border-gold-300/5 flex items-center justify-center gap-1.5 px-6 overflow-hidden">
                {[
                  0.4, 0.75, 0.3, 0.85, 0.5, 0.95, 0.6, 0.45, 0.7, 0.35, 0.8,
                  0.65, 0.9, 0.55, 0.4,
                ].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height * 100}%` }}
                    className="w-1 bg-gradient-to-t from-gold-600 to-gold-300 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-500 origin-bottom"
                  />
                ))}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gold-100 group-hover:text-gold-50 transition-colors">
                  Specialist Live-In Care Interview
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed">
                  Listen to the exclusive discussion covering how Grace &
                  Goodwill connects families with vetted, highly trained carer
                  matches, re-establishing high-quality standards.
                </p>
              </div>
            </div>

            {/* Button Link */}
            <Button asChild variant="primary" size="sm" fullWidth>
              <a
                href="https://www.bbc.co.uk/sounds/play/p0m85mv7?partner=uk.co.bbc&origin=share-mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Listen Now (BBC sounds)
              </a>
            </Button>
          </div>

          {/* Card 2: Regional Press Feature */}
          <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 p-8 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Card Header & Badge */}
              <div className="flex justify-between items-center">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-muted/10 text-gold-200 border border-gold-muted/20">
                  Press Feature
                </span>

                <Newspaper className="w-5 h-5 text-gold-300/40 group-hover:text-gold-300 transition-colors" />
              </div>

              {/* Graphic Element: Newspaper Column Visuals */}
              <div className="h-20 rounded-2xl bg-navy-950/60 border border-gold-300/5 flex flex-col justify-center gap-2 px-6">
                <div className="h-2 w-3/4 bg-gold-300/15 rounded-full" />
                <div className="h-2 w-5/6 bg-gold-300/10 rounded-full" />
                <div className="h-2 w-2/3 bg-gold-300/10 rounded-full" />
              </div>

              {/* Title & Description */}
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

            {/* Button Link */}
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

          {/* Card 3: BBC Audio Feature */}
          <BBCAudioCard />
        </div>
      </section>
    </main>
  );
}
