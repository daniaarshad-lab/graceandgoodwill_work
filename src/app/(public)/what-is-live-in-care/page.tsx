import Link from "next/link";
import Button from "@/components/Button";
import { CheckCircle2, ChevronRight, Heart, Home, Clock, Users } from "lucide-react";

export const metadata = {
  alternates: {
    canonical: "/what-is-live-in-care",
  },
  title: "What is Live-in Care? | Understanding Live-in Care | Grace & Goodwill",
  description: "Learn what live-in care is, who it is for, and how it can help you or a loved one maintain independence in the comfort of your own home.",
};

export default function WhatIsLiveInCarePage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-20 text-gold-100/90 font-serif">
      {/* Ambient Background Lights */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-navy-800/40 blur-[130px]" />

      <div className="container-wrapper relative z-10">
        
        {/* Hero Section */}
        <section className="mb-20 max-w-6xl mx-auto relative text-center">
          <div className="page-strapline inline-flex items-center justify-center gap-2 mb-6">
            <Home className="w-5 h-5 text-gold-400" />
            <span>Discover the Benefits</span>
          </div>
          
          <h1 className="main-page-heading mb-10">
            Understanding Live-in Care
          </h1>
          
          <div className="bg-navy-900/40 border border-gold-300/10 p-8 sm:p-12 rounded-[2rem] shadow-elegant backdrop-blur-md">
            
            <div className="page-supporting-text space-y-6 max-w-3xl mx-auto text-left sm:text-center">
              <p className="text-lg text-gold-50 font-medium leading-relaxed">
                Live-in care enables a person to remain in their own home while receiving ongoing support from a carer who stays in the home for the agreed placement.
              </p>
              <p className="leading-relaxed max-w-2xl mx-auto">
                For many people, home represents far more than a place to live. It is where their routines, relationships, memories, pets, neighbours and familiar surroundings already exist. Live-in care can make it possible to continue living within that environment rather than moving elsewhere simply because more support is needed.
              </p>
            </div>
          </div>
        </section>

        {/* Support Included Section */}
        <section className="mb-20 max-w-6xl mx-auto">
          <div className="bg-navy-900/40 p-10 sm:p-16 rounded-[2.5rem] border border-gold-300/10 shadow-elegant backdrop-blur-md relative overflow-hidden">
            {/* Subtle corner glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-serif text-gold-50 tracking-wide mb-6">What Does Support Include?</h2>
              <div className="page-supporting-text space-y-4 max-w-5xl mx-auto text-[17px] font-serif">
                <p>The exact arrangement will be different for every individual.</p>
                <p>Depending on what the client and carer agree, support may include:</p>
              </div>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-24 relative z-10 w-fit mx-auto">
              {[
                "Personal care", "Getting dressed", "Meal preparation", 
                "Mobility support", "Household activities", "Shopping", 
                "Attending appointments", "Companionship", 
                "Going out & socialising", 
                "Maintaining established routines", "Other agreed practical support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-gold-400 shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:scale-[1.8] group-hover:shadow-[0_0_12px_rgba(212,175,55,1)] group-hover:bg-gold-300 transition-all duration-300"></div>
                  <span className="text-[15px] text-gold-50/90 font-medium group-hover:text-gold-50 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who May Consider Live-in Care? */}
        <section className="mb-24 max-w-5xl mx-auto relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl font-serif text-gold-50 tracking-wide">Who May Consider Live-in Care?</h2>
            <p className="page-supporting-text mt-4 max-w-2xl mx-auto">
              Live-in care may be considered by people in many different circumstances, including:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {[
              { text: "Older adults who want to remain at home", link: "/long-term-live-in-care" },
              { text: "People living with dementia or Alzheimer’s disease", link: "/dementia-live-in-care" },
              { text: "Adults with physical disabilities", link: "/disability-live-in-support" },
              { text: "People living with neurological conditions", link: "/brain-injury-live-in-care" },
              { text: "People recovering following illness, surgery or hospital treatment", link: "/hospital-discharge-live-in-care" },
              { text: "People living with brain or spinal injuries", link: "/spinal-injury-live-in-care" },
              { text: "People with ongoing or complex support requirements", link: "/complex-needs-live-in-care" },
              { text: "Families needing temporary respite", link: "/respite-live-in-care" },
              { text: "People who require support following an unexpected change in circumstances", link: "/urgent-live-in-care" }
            ].map((item, i) => (
              <Link href={item.link} key={i} className="group flex items-center gap-4 py-3.5 px-5 bg-gradient-to-br from-navy-900/40 to-navy-950/60 border border-gold-300/10 rounded-[1.25rem] hover:border-gold-300/40 hover:bg-navy-800/50 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_30px_rgba(212,175,55,0.08)] backdrop-blur-sm min-h-[5rem] cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-gold-400 shrink-0 group-hover:scale-150 group-hover:shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300"></div>
                <span className="text-[14.5px] font-medium text-gold-100/90 group-hover:text-gold-50 transition-colors leading-snug">{item.text}</span>
              </Link>
            ))}
          </div>
          <p className="page-supporting-text text-center mt-8 italic text-gold-200">
            Some people require long-term support, while others may only need a live-in carer temporarily.
          </p>
        </section>

        {/* Highly Personal & Choosing a Carer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 max-w-[85rem] mx-auto px-4">
          <section className="group bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 xl:p-16 rounded-[3rem] border border-gold-300/15 shadow-elegant hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] transition-shadow duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-6 border-b border-gold-400/10 pb-5">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 group-hover:border-gold-400/40 transition-all duration-500 shrink-0">
                <Heart className="w-6 h-6 text-gold-400" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-serif text-gold-50 tracking-wide leading-tight">Live-In Care Can Be Highly Personal</h2>
            </div>
            
            <div className="page-supporting-text space-y-4">
              <p>
                One of the advantages of a live-in arrangement is that support can be shaped around the individual rather than requiring the individual to fit into the routine of a residential setting.
              </p>
              <p>A client may have preferences around:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {[
                  "Daily routines", "Food and meals", "Hobbies & interests",
                  "Social activities", "Cultural background", "Communication style",
                  "Pets", "Mobility needs", "Sleeping routines", 
                  "Preferred personality traits"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                    <span className="text-sm font-medium text-gold-100/90">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-gold-100 font-medium">
                These details can be particularly important because a live-in carer is sharing the person’s home and everyday life.
              </p>
            </div>
          </section>

          <section className="group bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 xl:p-16 rounded-[3rem] border border-gold-300/15 shadow-elegant hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] transition-shadow duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-6 border-b border-gold-400/10 pb-5">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 group-hover:border-gold-400/40 transition-all duration-500 shrink-0">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-serif text-gold-50 tracking-wide leading-tight">Choosing A Live-In Carer</h2>
            </div>
            <div className="page-supporting-text space-y-4">
              <p>
                Grace & Goodwill gives clients and families access to live-in carer profiles so they can consider more than qualifications alone.
              </p>
              <p>Profiles may include information about a carer’s:</p>
              <ul className="flex flex-wrap gap-2 mt-4">
                {[
                  "Experience", "Skills", "Background", "Interests", 
                  "Availability", "Biography", "Introductory video", 
                  "Relevant experience with particular conditions or support needs"
                ].map((item, i) => (
                  <li key={i} className="px-3 py-1.5 bg-navy-950 border border-gold-400/20 rounded-full text-xs text-gold-200">{item}</li>
                ))}
              </ul>
              <p className="mt-4">
                Clients and families can explore available profiles themselves and decide who they would like to consider. If additional help is needed, Grace & Goodwill can provide matching support based on the individual’s requirements and preferences.
              </p>
              <p className="text-gold-100 font-medium">
                The final decision remains with the client or family, and the carer also decides whether they wish to accept the placement.
              </p>
            </div>
          </section>
        </div>

        {/* Urgent Care Section */}
        <section className="mb-24 max-w-5xl mx-auto relative group">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gold-400/5 blur-3xl rounded-[3rem] transition-opacity duration-700 opacity-50 group-hover:opacity-100 pointer-events-none" />

          <div className="bg-gradient-to-b from-navy-900/80 to-navy-950/90 p-8 sm:p-10 lg:p-12 rounded-[2.5rem] border border-gold-300/20 shadow-[0_20px_50px_rgba(212,175,55,0.1)] backdrop-blur-xl text-center relative z-10">
            <div className="w-12 h-12 mx-auto bg-gradient-to-tr from-gold-500 to-gold-300 rounded-[0.85rem] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-500">
              <Clock className="w-5 h-5 text-navy-950" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl sm:text-[28px] font-serif text-gold-50 tracking-wide mb-4">
              When Live-in Care Is Needed Quickly
            </h2>
            <div className="page-supporting-text space-y-3 max-w-2xl mx-auto text-[15px]">
              <p>Sometimes the need for support develops gradually. In other situations it can happen almost overnight.</p>
              <p>
                A hospital discharge, stroke, fall, sudden deterioration in mobility, family-carer illness or unexpected breakdown of an existing care arrangement can leave a family needing help extremely quickly.
              </p>
              <p>Grace & Goodwill also supports urgent live-in carer searches.</p>
              <p className="text-gold-100 font-medium mt-3">
                Where a suitable carer is available and the necessary arrangements can be completed, a live-in carer may be able to start within 24 hours.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="primary" size="sm" className="px-6 py-2.5 whitespace-nowrap">
                <Link href="/urgent-live-in-care">Need Live-in Care Urgently?</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="px-6 py-2.5 whitespace-nowrap">
                <Link href="/carers">Explore Live-in Carers</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="px-6 py-2.5 whitespace-nowrap">
                <Link href="/how-it-works">How Matching Works</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
