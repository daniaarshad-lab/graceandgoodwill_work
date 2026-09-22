import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  alternates: {
    canonical: `/hospital-discharge-live-in-care`,
  },
  title: "Live-in Care After Hospital Discharge UK | Grace & Goodwill",
  description: "Find live-in care after hospital discharge with Grace & Goodwill. Explore available carers for practical support, mobility, meals, routines and recovery at home.",
};

const pageFaqs = [
  {
    question: "Can I arrange live-in care before someone leaves hospital?",
    answer: "Yes. Families can begin exploring available live-in carer profiles while discharge plans are being discussed so that arrangements may be ready when the person returns home."
  },
  {
    question: "Can Grace & Goodwill help if discharge is very soon?",
    answer: "Yes. Grace & Goodwill supports urgent live-in carer searches. Where a suitable carer is immediately available, arrangements may sometimes be made quickly, subject to the required checks, agreement and placement arrangements."
  },
  {
    question: "Is live-in care after hospital always long term?",
    answer: "No. It can be arranged on a short-term or longer-term basis depending on the person’s circumstances and the availability of a suitable carer."
  },
  {
    question: "Can a live-in carer provide physiotherapy or nursing care?",
    answer: "A live-in carer can provide the practical support agreed directly with the client. Physiotherapy, nursing, occupational therapy, rehabilitation and other clinical services should continue to be provided by appropriately qualified healthcare professionals where required."
  },
  {
    question: "Can I choose the carer?",
    answer: "Yes. Grace & Goodwill allows clients and families to explore available profiles and remain involved in deciding who they would like to speak with and ultimately choose."
  },
  {
    question: "Can I find someone with experience relevant to the hospital admission?",
    answer: "Carer profiles include information about experience and skills, allowing families to consider carers whose background may be relevant to the person’s current needs."
  }
];

export default function HospitalDischargeLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="text-center mb-12">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Live-in Care After Hospital Discharge
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Support at home when leaving hospital
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Being told that you, a parent, partner or other loved one is ready to leave hospital can sometimes happen very quickly.</p>
            <p>The relief of going home can be mixed with practical questions:</p>
            <ul className="list-disc pl-5 space-y-2 text-gold-100/90 font-medium">
              <li>Who will be there when they arrive home?</li>
              <li>Will they be able to manage meals, mobility and everyday routines?</li>
              <li>What happens if family cannot provide support around the clock?</li>
            </ul>
            <p>For some people, live-in care can provide practical, one-to-one support at home while they recover, regain confidence and adjust to everyday life following a hospital stay.</p>
            <p>Grace & Goodwill helps individuals and families explore available live-in carer profiles according to experience, availability, personality, interests and the support required at home.</p>
          </div>
          <div className="mt-8">
            <Button asChild variant="primary" size="md">
              <Link href="/carers">Find Live-in Care After Hospital Discharge</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">When might live-in care be considered after hospital?</h3>
            <p className="page-supporting-text mb-4">Hospital discharge support may be considered following:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "surgery or a planned hospital stay",
                "a fall or fracture",
                "a stroke",
                "illness or infection",
                "reduced mobility",
                "a period of weakness or deconditioning",
                "a change in confidence following admission",
                "a temporary increase in everyday support needs",
                "discharge where family members cannot provide ongoing support",
                "an unexpected change in circumstances"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Every discharge is different.</p>
              <p className="font-medium text-gold-200">Some people may only need short-term practical help while they regain strength, while others may decide that ongoing live-in support would provide greater reassurance at home.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Practical support after returning home</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>The exact support provided is agreed directly between the client and the chosen live-in carer.</p>
              <p>Depending on the person’s circumstances and the carer selected, this may include support with:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "preparing meals and drinks",
                "shopping and household tasks",
                "getting dressed",
                "personal care",
                "mobility around the home",
                "attending appointments",
                "companionship and reassurance",
                "maintaining everyday routines",
                "going out when appropriate",
                "collecting essential items",
                "helping the person settle back into their home environment",
                "other agreed practical support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>For many people, returning to familiar surroundings can make the transition from hospital feel less overwhelming.</p>
              <p className="font-medium text-gold-200">Live-in support can help provide continuity while the individual gradually returns to the routines and activities that are important to them.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Returning home safely and with confidence</h3>
            <div className="page-supporting-text space-y-4">
              <p>Leaving hospital does not always mean somebody immediately feels back to normal.</p>
              <p>They may feel tired, less steady on their feet, uncertain about managing everyday tasks or nervous about being alone.</p>
              <p>For families, this can also be an anxious period, particularly when relatives live further away or have work and other responsibilities.</p>
              <p>Having a live-in carer in the home can provide practical support and companionship during this transition, while helping the individual remain involved in decisions about how they want to live.</p>
              <p className="text-sm border-t border-gold-400/20 pt-4 mt-4 italic text-gold-100/70">
                Hospital teams remain responsible for determining when a person is medically ready for discharge, and clinical rehabilitation, nursing, physiotherapy, occupational therapy and other healthcare input should continue to be provided by the relevant professionals where required.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Finding a carer at short notice</h3>
            <div className="page-supporting-text space-y-4 text-left mb-6">
              <p>Hospital discharge dates can sometimes change quickly.</p>
              <p>A family may receive confirmation that someone can return home sooner than expected, leaving little time to arrange support.</p>
              <p>Grace & Goodwill can support urgent searches for available live-in carers, including situations where a family is hoping to arrange support at short notice.</p>
              <p>Carer profiles may include information such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
              {[
                "profile photograph",
                "introduction video",
                "biography",
                "care experience",
                "skills and training",
                "relevant hospital discharge or recovery experience",
                "mobility support experience",
                "interests and personality",
                "languages",
                "driving status",
                "availability",
                "preferred placements"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4 text-left mb-8">
              <p>Families can explore profiles independently or ask Grace & Goodwill for support identifying potentially suitable available carers.</p>
              <p className="font-medium text-gold-200">The client remains in control of who they choose.</p>
              <p className="text-sm border-t border-gold-400/20 pt-4 italic text-gold-100/70">
                Where urgent support is required, availability and start dates remain subject to a suitable carer being available, the necessary arrangements being completed and both the client and carer agreeing to proceed.
              </p>
            </div>
            <Button asChild variant="primary" size="md">
              <Link href="/urgent-live-in-care">I Need a Live-in Carer Urgently</Link>
            </Button>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Short-term support or longer-term care</h3>
            <div className="page-supporting-text space-y-4 text-left max-w-3xl mx-auto mb-8">
              <p>Live-in care after hospital does not necessarily need to become a permanent arrangement.</p>
              <p>Some people may only require support for a short period while recovering, rebuilding confidence or waiting for longer-term plans to become clearer.</p>
              <p>Others may discover that continuing with live-in care provides the level of support, companionship and reassurance they prefer.</p>
              <p>Grace & Goodwill supports both short-term and longer-term live-in care searches, allowing families to consider the arrangement that best reflects the person’s circumstances.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="outline" size="md">
                <Link href="/respite-live-in-care">Explore Short-Term / Respite Live-in Care</Link>
              </Button>
              <Button asChild variant="outline" size="md">
                <Link href="/long-term-live-in-care">Explore Long-Term Live-in Care</Link>
              </Button>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Preparing for the return home</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Before discharge, families may find it helpful to discuss practical arrangements with the hospital team.</p>
              <p>Depending on the individual situation, this may include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "expected discharge date",
                "transport home",
                "medication and prescriptions",
                "mobility equipment",
                "follow-up appointments",
                "rehabilitation or therapy arrangements",
                "changes in mobility or everyday function",
                "dietary requirements",
                "any temporary restrictions",
                "what support may be required at home"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>These details can also help when considering live-in carer profiles, because they provide a clearer picture of the practical support that may be required once the person returns home.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Choosing the right live-in carer after hospital</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Experience is important, but so is compatibility.</p>
              <p>Someone recovering from a hospital stay may be spending a significant amount of time with the person supporting them, so communication, patience, personality and approach can all matter.</p>
              <p>Grace & Goodwill allows families to consider practical experience alongside personal compatibility before deciding who they would like to speak with.</p>
              <p>Where relevant, you may wish to look for carers with experience in areas such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "reduced mobility",
                "falls recovery",
                "stroke recovery",
                "post-operative support",
                "older adult care",
                "neurological conditions",
                "personal care",
                "companionship",
                "rehabilitation-focused routines",
                "supporting people returning home after treatment"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">The final decision remains with the client.</p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-8 text-center">Frequently asked questions</h3>
            <FAQAccordion faqsList={pageFaqs} groupByCategory={false} />
          </section>

          {/* Contact Info */}
          <div className="mt-16 bg-navy-900/40 p-8 sm:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Support for the transition home</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>Coming home from hospital should feel like a step forward.</p>
              <p>Whether support is needed for a few days, several weeks or longer, Grace & Goodwill helps families explore available live-in carers and choose somebody they feel comfortable welcoming into the home.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gold-100/80 mb-8">
              <a href="tel:02045240108" className="hover:text-gold-200 transition-colors">
                <strong>Telephone:</strong> 020 4524 0108
              </a>
              <span className="hidden sm:inline text-gold-300/30">|</span>
              <a href="https://wa.me/447462931949" target="_blank" rel="noopener noreferrer" className="hover:text-gold-200 transition-colors">
                <strong>WhatsApp:</strong> +44 7462 931949
              </a>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="primary" size="md">
                <Link href="/carers">Find a Live-in Carer</Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <Link href="/contact">Speak to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
