import { Newspaper, ExternalLink, HandHeart, ChevronRight, CheckCircle2, Calendar, Activity, Clock, ArrowRight } from "lucide-react";
import happySeniorCouple from "@/assets/open/happy_senior_couple.png";
import bbcImage2 from "@/assets/open/bbc-image2.jpg";
import bbcImage3 from "@/assets/open/bbc-image3.jpg";
import publicImg2 from "@/assets/open/public-img2.jpeg";
import publicImg3 from "@/assets/open/public-img3.jpeg";
import partnershipLogo1 from "@/assets/partnership-logo/partnership-logo1.webp";
import partnershipLogo2 from "@/assets/partnership-logo/partnership-logo2.webp";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import EmergencyButton from "@/components/EmergencyButton";
import PartnersCarousel from "@/components/PartnersCarousel";
import { faqs } from "@/data/faqData";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata = {
  alternates: {
    canonical: "/",
  },
  title: "Independent Live-In Care Agency UK | Grace & Goodwill",
  description: "Find trusted independent live-in carers across the UK with Grace & Goodwill. Get personalised support and find the right live-in carer for your care needs.",
};

const homepageFaqQuestions = [
  "What is live-in care?",
  "Can I choose my own live-in carer?",
  "Can Grace & Goodwill help me find suitable profiles?",
  "Can I see which carers are available?",
  "Can I arrange a live-in carer within 24 hours?",
  "Can Grace & Goodwill help with hospital discharge?",
  "Can I find a live-in carer after a stroke?",
  "Can I arrange temporary respite care?",
  "Does Grace & Goodwill operate across the UK?",
  "How much does live-in care cost?",
  "Can I get help paying for live-in care?",
];

const BBCAudioCard = dynamic(() => import("@/components/BBCAudioCard"));

export default function HomePage() {
  const homepageFaqs = faqs.filter(faq => homepageFaqQuestions.includes(faq.question));

  return (
    <main className="overflow-x-hidden min-h-[calc(100vh-80px)] bg-navy-950 pt-6 md:pt-10 lg:pt-20 text-gold-100">
      <section className="container-wrapper relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-12 xl:gap-24 pb-16">
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

        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl lg:flex-1 xl:flex-none space-y-6 -mt-4 lg:mt-0 z-10 relative">
          <h1 className="main-page-heading drop-shadow-md">
            Live-in Care Matching
            <span className="main-page-heading pl-3 text-[#F5D4A0]">
              Across The UK
            </span>
          </h1>

          <div className="max-w-xl space-y-4">
            <p className="page-supporting-text">
              Finding someone to support you or a loved one at home is a deeply personal decision. At Grace & Goodwill, you remain in control of your choices and care arrangements. We believe the right match should bring confidence, reassurance and peace of mind when welcoming someone into your home.
            </p>
            <p className="page-supporting-text">
              Grace & Goodwill brings families and carefully vetted live-in carers together through our online matching platform, where you can explore carer profiles featuring their experience, skills, interests, availability, photo, introductory video and more, helping you find the right live-in carer to match your needs, routines and preferences.
            </p>
            <p className="page-supporting-text">
              Whether care is being planned ahead or needed urgently, we make the matching process simpler and more personal, with ongoing platform support to help maintain continuity when circumstances or care arrangements change.
            </p>
          </div>

          <p className="text-sm sm:text-lg text-gold-100/90 font-medium pt-2 pb-2">
            Choose the option below that best matches your current needs.
          </p>

          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 flex-wrap xl:flex-nowrap w-full max-w-[100%] overflow-visible">
            <Link
              href="/contact"
              prefetch={false}
              id="btn-find-carer-hero"
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
                <span className="text-[#FDF2D5] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm line-clamp-1">
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
              id="btn-chat-hero"
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
                <span className="text-[#E0F8EA] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm line-clamp-1">
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

        <div className="relative flex items-center justify-center mt-0 sm:mt-8 lg:mt-0 w-full lg:flex-1 xl:flex-none lg:max-w-xl h-[380px] sm:h-[450px] overflow-visible lg:-translate-x-4 xl:-translate-x-10">
          {/* Glowing concentric radiating gold rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute shrink-0 w-[260px] sm:w-[290px] lg:w-[320px] h-[260px] sm:h-[290px] lg:h-[320px] rounded-full border-2 border-gold-400 animate-ring-pulse-1" />
            <div className="absolute shrink-0 w-[300px] sm:w-[330px] lg:w-[360px] h-[300px] sm:h-[330px] lg:h-[360px] rounded-full border-2 border-gold-400 animate-ring-pulse-2" />
            <div className="absolute shrink-0 w-[340px] sm:w-[370px] lg:w-[400px] h-[340px] sm:h-[370px] lg:h-[400px] rounded-full border-2 border-gold-400 animate-ring-pulse-3" />
            <div className="absolute shrink-0 w-[380px] sm:w-[410px] lg:w-[440px] max-w-[95vw] lg:max-w-none h-[380px] sm:h-[410px] lg:h-[440px] max-h-[95vw] lg:max-h-none rounded-full border-2 border-gold-400 animate-ring-pulse-4" />
          </div>

          {/* Focal Circular Portrait Container */}
          <div className="relative shrink-0 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-4 border-gold-400 bg-navy-950 shadow-elegant overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-image-pulse">
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


      {/* --- INJECTED CLIENT H2 SECTIONS START --- */}
      <section className="container-wrapper mt-20 space-y-24">
        {/* H2: Live-in Care Matching Built Around the Person */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="section-heading text-left">Live-in Care Matching Built Around The Person</h2>
            <p className="page-supporting-text text-left">
              Finding a live-in carer is about more than experience on paper. The person you choose may become part of everyday life in the home, so personality, communication, lifestyle, routines, interests and compatibility can matter just as much as practical experience.
            </p>
            <p className="page-supporting-text text-left">
              Grace & Goodwill gives clients and families greater visibility before making a decision. This helps families consider both experience and personal compatibility before deciding who they would like to speak with.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gold-400/5 rounded-[2rem] blur-xl group-hover:bg-gold-400/10 transition-colors duration-500"></div>
            <div className="relative bg-navy-900/60 border border-gold-300/15 p-8 sm:p-10 rounded-[2rem] shadow-elegant backdrop-blur-md space-y-6">
              <h3 className="text-lg font-semibold text-gold-100">Depending On The Profile, You Can Explore:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {["Profile photograph", "Introduction video", "Biography", "Care experience", "Skills and training", "Location", "Hobbies and interests", "Languages", "Driving status", "Availability", "Preferred placements", "Other relevant information"].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gold-50/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* H2: What Is Live-in Care? */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-300/15 bg-navy-900/40 p-8 md:p-12 lg:p-16 shadow-elegant backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <h2 className="section-heading">What Is Live-in Care?</h2>
            <p className="page-supporting-text text-lg text-gold-50/90 font-medium">
              Live-in care allows someone to receive support while continuing to live in their own home.
            </p>
            <p className="page-supporting-text">
              The live-in carer stays in the home for the agreed placement and provides the support agreed directly with the client. Depending on the individual arrangement, this may include help with:
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {["Personal care", "Getting dressed", "Meal preparation", "Mobility", "Shopping", "Household tasks", "Attending appointments", "Companionship", "Going out and maintaining social activities", "Everyday routines", "Other agreed practical support"].map((item) => (
                <span key={item} className="px-5 py-2.5 rounded-full border border-gold-300/20 bg-navy-950/60 text-sm font-medium text-gold-100 shadow-sm transition-colors hover:border-gold-300/40 hover:bg-navy-900/80">
                  {item}
                </span>
              ))}
            </div>

            <div className="pt-6 space-y-6">
              <p className="page-supporting-text">
                For many people, remaining at home means staying close to familiar surroundings, family, neighbours, pets, memories and the routines that make everyday life feel like their own.
              </p>
              <p className="page-supporting-text">
                Live-in care may be considered by older adults, people living with dementia, adults with disabilities, people recovering following illness or hospital treatment, people with neurological or physical support needs, and families needing temporary respite or longer-term support.
              </p>
            </div>

            <div className="pt-8 flex justify-center">
              <Button asChild variant="outline" size="md" className="group pr-5">
                <Link href="/what-is-live-in-care" className="flex items-center gap-2">
                  Learn more about live-in care
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Styled Image Section Below the Box */}
        <div className="relative max-w-3xl mx-auto mt-16 px-4 py-4 md:px-8 md:py-8">
          {/* Decorative Offset Wireframe Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 border-t border-l border-gold-300/40 rounded-tl-[3rem] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 border-b border-r border-gold-300/40 rounded-br-[3rem] pointer-events-none"></div>

          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group">
            <Image
              src={publicImg2}
              alt="Live in care support"
              className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105"
              placeholder="blur"
            />
          </div>
        </div>

        {/* H2: Live-in Care for Different Needs and Circumstances */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-heading">Live-in Care for Different Needs and Circumstances</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Long-Term Live-in Care */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Long-Term Live-in Care</h3>
                <p className="page-supporting-text">
                  For people who want ongoing one-to-one support while remaining in their own home. Clients can search live-in carer profiles according to relevant experience, availability and the preferences that matter to them.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/long-term-live-in-care">Explore Long-Term Live-in Care</Link>
                </Button>
              </div>
            </div>

            {/* Dementia and Alzheimer's */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Dementia and Alzheimer&apos;s Live-in Care</h3>
                <p className="page-supporting-text">
                  Familiar surroundings and established routines can be particularly valuable for someone living with dementia or Alzheimer&apos;s disease. Families can browse live-in carers with relevant dementia experience and compare profile information, communication style, interests and availability before deciding who they would like to consider.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/dementia-live-in-care">Explore Dementia Live-in Care</Link>
                </Button>
              </div>
            </div>

            {/* Respite Live-in Care */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Respite Live-in Care</h3>
                <p className="page-supporting-text">
                  Live-in care does not always need to be long term. Grace & Goodwill can support families looking for short-term live-in care when a main family carer needs: a holiday, a weekend away, time to rest and recover, time to attend to other family responsibilities, cover following an unexpected emergency, or temporary support while another carer is unavailable. Respite arrangements can range from short stays of as little as 2 days through to longer temporary placements.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/respite-live-in-care">Explore Respite Live-in Care</Link>
                </Button>
              </div>
            </div>

            {/* Disability and Young Adult */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Disability and Young Adult Live-in Support</h3>
                <p className="page-supporting-text">
                  Live-in care is not only for older people. Grace & Goodwill helps adults living with physical disabilities and other long-term support needs find carers who can support everyday life while respecting independence, routines, relationships and personal preferences.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/disability-live-in-support">Explore Disability Support</Link>
                </Button>
              </div>
            </div>

            {/* Brain Injury and Neurological */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Brain Injury and Neurological Support</h3>
                <p className="page-supporting-text">
                  People living with acquired brain injury or neurological conditions may have very different support requirements depending on how their mobility, memory, communication or everyday independence has been affected. Clients can search profiles for carers with relevant experience and choose who they would like to consider.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/brain-injury-live-in-care">Explore Neurological and Brain Injury Support</Link>
                </Button>
              </div>
            </div>

            {/* Spinal Injury and Mobility */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)]">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Spinal Injury and Mobility Support</h3>
                <p className="page-supporting-text">
                  Grace & Goodwill supports individuals looking for live-in carers with experience relevant to spinal injury, physical disability, reduced mobility and independent living. The emphasis remains on helping the individual continue living their life at home with the support they choose.
                </p>
              </div>
              <div className="pt-8 mt-auto">
                <Button asChild variant="outline" size="sm" fullWidth>
                  <Link href="/spinal-injury-live-in-care">Explore Spinal Injury Support</Link>
                </Button>
              </div>
            </div>

            {/* Companionship and Everyday Support */}
            <div className="flex flex-col h-full group rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] md:col-span-2 lg:col-span-3 lg:max-w-2xl lg:mx-auto w-full">
              <div className="flex-1 space-y-4 text-center">
                <h3 className="text-xl font-semibold text-gold-50 tracking-wide">Companionship and Everyday Support</h3>
                <p className="page-supporting-text">
                  Not everyone searching for a live-in carer has a specific diagnosis. Someone may live alone, feel increasingly isolated, need more practical help or simply feel less confident managing everyday life without support. Live-in companionship can be combined with agreed practical assistance while helping someone continue enjoying their home, interests, routines and community.
                </p>
              </div>
              <div className="pt-8 mt-auto flex justify-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/live-in-companionship">Explore Companionship Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* H2: Need a Live-in Carer Urgently? & Hospital Discharge */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-gold-300/15 bg-navy-900/40 p-8 md:p-10 shadow-elegant backdrop-blur-md transition-all duration-300 hover:border-gold-300/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] flex flex-col justify-between">
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/20 bg-navy-950 shadow-inner">
                  <Clock className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif font-medium text-gold-50 text-xl lg:text-[22px] xl:text-2xl leading-tight tracking-wide m-0">Need a Live-in Carer Urgently?</h2>
              </div>

              <div className="space-y-4">
                <p className="page-supporting-text">
                  Sometimes care needs change with almost no warning. A person may be medically ready to leave hospital sooner than expected. Someone may have experienced a stroke, serious fall, fracture or sudden change in mobility. A family carer may become unwell or exhausted. An existing carer may leave unexpectedly. A family may suddenly realise that the person they love can no longer safely manage at home without additional support.
                </p>
                <p className="page-supporting-text font-medium text-gold-200">
                  Grace & Goodwill can support urgent live-in carer searches, including situations where a family is hoping to find someone who may be able to start within 24 hours.
                </p>
                <p className="page-supporting-text text-sm opacity-80">
                  This is always subject to suitable carer availability, the required arrangements being completed and both the client and carer agreeing to proceed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 rounded-2xl border border-gold-300/10 bg-navy-900/20">
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Hospital discharge at short notice</div>
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Returning home following a stroke</div>
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Sudden reduction in mobility</div>
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> A serious fall or fracture</div>
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Family carer illness or exhaustion</div>
                <div className="flex items-center gap-2 text-sm text-gold-100/80"><CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" /> Existing carer leaving unexpectedly</div>
              </div>
            </div>
            <div className="pt-8">
              <Button asChild variant="primary" size="md">
                <Link href="/urgent-live-in-care">I Need a Live-in Carer Urgently</Link>
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2.5rem] border border-gold-300/15 bg-navy-900/40 p-8 md:p-10 shadow-elegant backdrop-blur-md transition-all duration-300 hover:border-gold-300/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] flex flex-col justify-between">
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/20 bg-navy-950 shadow-inner">
                  <Activity className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif font-medium text-gold-50 text-xl lg:text-[22px] xl:text-2xl leading-tight tracking-wide m-0">Hospital Discharge and Returning Home</h2>
              </div>

              <div className="space-y-4">
                <p className="page-supporting-text">
                  Being told that Mum, Dad, a partner or another loved one is ready to leave hospital can sometimes happen very quickly.
                </p>

                <div className="p-6 rounded-2xl border border-gold-300/10 bg-navy-900/20 space-y-3">
                  <p className="text-sm font-serif italic text-gold-200">“My dad is being discharged tomorrow and needs a carer.”</p>
                  <p className="text-sm font-serif italic text-gold-200">“My mum has had a stroke and cannot manage alone at home.”</p>
                  <p className="text-sm font-serif italic text-gold-200">“We need someone to stay with Dad after hospital discharge.”</p>
                  <p className="text-sm font-serif italic text-gold-200">“How do I arrange care at home after a stroke?”</p>
                </div>

                <p className="page-supporting-text">
                  Grace & Goodwill can help families search available live-in carer profiles for people returning home following hospital treatment. Depending on the individual circumstances and the carer chosen, live-in support may help with everyday routines, mobility, meals, companionship, appointments and other practical needs while the person adjusts to being home again.
                </p>
                <p className="page-supporting-text text-sm opacity-80">
                  Where rehabilitation, nursing, physiotherapy, occupational therapy or other clinical input is required, those services should continue to be provided by the relevant healthcare professionals.
                </p>
              </div>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" size="md" className="whitespace-nowrap">
                <Link href="/hospital-discharge-live-in-care">Live-in Care After Hospital Discharge</Link>
              </Button>
              <Button asChild variant="outline" size="md" className="whitespace-nowrap">
                <Link href="/live-in-care-after-stroke">Live-in Care After a Stroke</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* H2: Access to Carers' Immediate Availability */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-300/15 bg-navy-900/40 p-8 md:p-12 lg:p-16 shadow-elegant backdrop-blur-sm max-w-5xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-24 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 pb-10">
            <div className="flex justify-center mb-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/20 bg-navy-950 shadow-inner">
                <Calendar className="h-8 w-8 text-gold-300" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="section-heading">Access to Carers&apos; Immediate Availability</h2>
            <p className="page-supporting-text text-lg text-gold-50/90 font-medium">
              Availability is especially important when live-in care is needed quickly.
            </p>
            <div className="space-y-4 pt-4">
              <p className="page-supporting-text">
                Grace & Goodwill&apos;s platform allows families to explore live-in carer profiles, where carers provide information about their experience, skills, interests and availability.
              </p>
              <p className="page-supporting-text">
                Families can explore profiles themselves or ask the Grace & Goodwill team for support with matching based on their individual needs, preferences and required start date.
              </p>
              <p className="page-supporting-text">
                Need care urgently? Our team is available 24 hours a day, and our rapid care service can support urgent requests, with a suitable live-in carer able to start within 24 hours, subject to availability and the necessary arrangements.
              </p>
            </div>
          </div>

          {/* Styled Image Section Inside the Box */}
          <div className="relative max-w-3xl mx-auto mt-4 px-4 py-4 md:px-8 md:py-8">
            {/* Decorative Offset Wireframe Corners */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 border-t border-l border-gold-300/40 rounded-tl-[3rem] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 border-b border-r border-gold-300/40 rounded-br-[3rem] pointer-events-none"></div>

            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group">
              <Image
                src={publicImg3}
                alt="Available live in carers"
                className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105"
                placeholder="blur"
              />
            </div>
          </div>
        </div>

        {/* H2: How Grace & Goodwill Works */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-heading">How Grace & Goodwill Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 max-w-7xl mx-auto relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gold-400/10 z-0"></div>

            {[
              {
                step: 1,
                title: "Tell Us What You Are Looking For",
                desc: "Share the location, preferred start date, type of support required, routines, preferences and anything else that may help."
              },
              {
                step: 2,
                title: "Browse Live-in Carer Profiles",
                desc: "Explore available profiles including experience, skills, interests, introduction videos and availability."
              },
              {
                step: 3,
                title: "Get Matching Support",
                desc: "Use the platform independently or ask Grace & Goodwill to help identify potentially suitable available profiles."
              },
              {
                step: 4,
                title: "Speak With Carers",
                desc: "Learn more about the people you are considering before deciding whether you would like to proceed."
              },
              {
                step: 5,
                title: "Choose Your Carer",
                desc: "The client makes the final choice. Once agreed, the relevant placement arrangements and administration can be completed."
              }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                <div className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl border border-gold-400/30 bg-navy-950 shadow-elegant text-xl lg:text-2xl font-serif font-bold text-gold-300 mb-5 transition-transform group-hover:-translate-y-1 duration-300">
                  {item.step}
                </div>
                <div className="bg-navy-900/40 border border-gold-300/10 p-5 lg:p-6 rounded-2xl w-full flex-1 flex flex-col shadow-sm transition-all duration-300 group-hover:bg-navy-900/60 group-hover:border-gold-300/30 backdrop-blur-sm">
                  <h3 className="text-sm lg:text-[15px] font-semibold text-gold-50 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-[13px] text-gold-100/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* H2: Why Families Choose Grace & Goodwill */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-heading">Why Families Choose Grace & Goodwill</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "Choice and Control",
                desc: "Browse available profiles and remain directly involved in deciding who enters your home."
              },
              {
                title: "Compatibility",
                desc: "Consider experience alongside personality, communication, interests, availability and everyday preferences."
              },
              {
                title: "Carefully Reviewed Profiles",
                desc: "Carers complete the Grace & Goodwill onboarding and compliance review before their profiles are approved for use on the platform."
              },
              {
                title: "Nationwide Matching",
                desc: "Grace & Goodwill supports live-in care matching for placements across the UK."
              },
              {
                title: "Urgent Matching Support",
                desc: "Where circumstances change quickly, clients can search current availability and request additional platform and matching support."
              },
              {
                title: "Continuity",
                desc: "If an existing arrangement changes, Grace & Goodwill can help clients return to the platform and identify other potentially suitable available profiles."
              },
              {
                title: "Practical Support",
                desc: "Grace & Goodwill supports the matching platform, onboarding and compliance processes, payment administration and other relevant placement administration."
              }
            ].map((item) => (
              <div key={item.title} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative overflow-hidden rounded-[2rem] border border-gold-300/15 bg-navy-900/40 p-8 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] flex flex-col">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-gold-400/10 rounded-full blur-2xl opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-navy-950 shadow-inner">
                    <CheckCircle2 className="w-5 h-5 text-gold-300" strokeWidth={2} />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-gold-50 tracking-wide mt-1.5">{item.title}</h3>
                </div>
                <p className="text-sm text-gold-100/80 leading-relaxed flex-1 pl-14">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* H2: Paying for Live-in Care and Finding Financial Support */}
        <div className="relative overflow-hidden max-w-5xl mx-auto rounded-[2.5rem] border border-gold-300/15 bg-navy-900/40 p-10 md:p-14 text-center shadow-elegant backdrop-blur-sm mb-16 lg:mb-24">
          <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <h2 className="section-heading mb-6">Paying for Live-in Care and Finding Financial Support</h2>
            <p className="page-supporting-text text-lg mb-10 max-w-3xl mx-auto">
              Families often begin looking for care before they know exactly how it will be funded. Depending on personal circumstances, possible routes may include:
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-[15px] text-gold-100/90 text-left max-w-4xl mx-auto mb-10 bg-navy-950/50 p-8 md:p-10 rounded-3xl border border-gold-300/10 shadow-inner">
              <div className="flex-1 space-y-5">
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Self-funding</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Local authority financial support following assessment</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>NHS Continuing Healthcare</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>NHS-funded nursing care where applicable</span></div>
              </div>
              <div className="flex-1 space-y-5">
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Attendance Allowance</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Other eligible benefits</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Short-term discharge or reablement support where available</span></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /> <span>Independent financial planning for longer-term care</span></div>
              </div>
            </div>

            <p className="page-supporting-text text-sm opacity-80 max-w-3xl mx-auto mb-10">
              Grace & Goodwill can provide general information and signposting, but eligibility for public funding is determined by the relevant authority or healthcare body.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-12 pb-4">
              <Link href="/live-in-care-costs" className="group inline-flex items-center gap-2 rounded-full bg-navy-950/60 border border-gold-400/20 px-6 py-2.5 text-sm font-medium text-gold-200/90 transition-all duration-300 ease-out hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-50">
                Live-in Care Costs
                <ArrowRight className="w-4 h-4 text-gold-400/50 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
              <Link href="/funding-live-in-care" className="group inline-flex items-center gap-2 rounded-full bg-navy-950/60 border border-gold-400/20 px-6 py-2.5 text-sm font-medium text-gold-200/90 transition-all duration-300 ease-out hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-50">
                Funding Live-in Care
                <ArrowRight className="w-4 h-4 text-gold-400/50 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
              <Link href="/nhs-continuing-healthcare" className="group inline-flex items-center gap-2 rounded-full bg-navy-950/60 border border-gold-400/20 px-6 py-2.5 text-sm font-medium text-gold-200/90 transition-all duration-300 ease-out hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-50">
                NHS Continuing Healthcare
                <ArrowRight className="w-4 h-4 text-gold-400/50 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
              <Link href="/local-authority-care-funding" className="group inline-flex items-center gap-2 rounded-full bg-navy-950/60 border border-gold-400/20 px-6 py-2.5 text-sm font-medium text-gold-200/90 transition-all duration-300 ease-out hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-50">
                Local Authority Care Funding
                <ArrowRight className="w-4 h-4 text-gold-400/50 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
              <Link href="/attendance-allowance" className="group inline-flex items-center gap-2 rounded-full bg-navy-950/60 border border-gold-400/20 px-6 py-2.5 text-sm font-medium text-gold-200/90 transition-all duration-300 ease-out hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-50">
                Attendance Allowance & Help With Care Costs
                <ArrowRight className="w-4 h-4 text-gold-400/50 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* --- INJECTED CLIENT H2 SECTIONS END --- */}

      <section className="container-wrapper mt-24 pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-center mb-10 space-y-5">
            <h2 className="section-heading">Media Presence</h2>
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

      {/* HOMEPAGE FAQ */}
      <section className="container-wrapper mt-20 pt-10">
        <div className="max-w-4xl mx-auto bg-navy-900/40 p-8 md:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant">
          <div className="text-center mb-8">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion faqsList={homepageFaqs} groupByCategory={false} />
        </div>
      </section>
      {/* --- PARTNERSHIP LOGOS SECTION --- */}
      <section className="w-full bg-navy-950 pt-10 pb-8 mt-20 relative z-10 border-t border-gold-300/10 overflow-hidden">
        {/* Heading stays centred in the container */}
        <div className="px-4 flex flex-col items-center justify-center mb-8">
          <h2 className="font-serif text-[22px] md:text-3xl font-bold text-gold-50 text-center tracking-wide">
            Our Featured Partners
          </h2>
        </div>

        {/* Marquee is full-viewport-width — no container constraint */}
        <PartnersCarousel />
      </section>
    </main>
  );
}
