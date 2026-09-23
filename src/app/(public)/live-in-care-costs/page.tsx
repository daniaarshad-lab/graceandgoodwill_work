import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/live-in-care-costs`,
  },
  title: "Live-in Care Costs UK | How Much Does Live-in Care Cost? | Grace & Goodwill",
  description: "Understand live-in care costs in the UK, what may affect the price and what live-in care can include. Speak to Grace & Goodwill for clear pricing information.",
};

export default function LiveInCareCostsPage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="text-center mb-12">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Live-in Care Costs
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Understanding the cost of live-in care
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>One of the first questions families often ask is:</p>
            <p className="text-xl font-semibold text-gold-50 italic">How much does live-in care cost?</p>
            <p>The cost of live-in care will depend on the support required and the individual circumstances of the person receiving care.</p>
            <p>Grace & Goodwill provides clear pricing information before a family decides whether they would like to proceed, helping clients understand the expected cost of their live-in care arrangement from the outset.</p>
            <p>Live-in care is generally arranged on a weekly basis, providing dedicated support in the comfort and familiarity of the person’s own home.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md">
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What can affect the cost of live-in care?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Every person has different needs, which is why it is important to understand the support required before confirming the appropriate arrangement.</p>
              <p>Factors that may be considered can include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "the level of everyday support required",
                "personal care needs",
                "mobility and moving and handling requirements",
                "dementia or cognitive support needs",
                "experience required for a particular condition",
                "overnight support requirements",
                "whether support is required for one person or a couple",
                "any additional requirements identified during the initial discussion"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">Grace & Goodwill will discuss these circumstances with the client or family before providing clear pricing information.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What is included in live-in care?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Live-in care provides one-to-one support in the person’s own home, with the exact day-to-day arrangement shaped around their needs, routines and preferences.</p>
              <p>Depending on the individual circumstances, support may include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "personal care",
                "dressing and washing",
                "preparing meals and drinks",
                "shopping",
                "mobility support",
                "help with everyday routines",
                "companionship",
                "attending appointments",
                "light household tasks",
                "support with hobbies and activities",
                "reassurance throughout the day",
                "support maintaining independence at home"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">The purpose of live-in care is to provide the right level of assistance while helping the individual continue living as independently and comfortably as possible.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Why live-in care costs can differ between families</h3>
            <div className="page-supporting-text space-y-4">
              <p>Two people looking for live-in care may require very different levels of support.</p>
              <p>One person may primarily need companionship, meals and help with everyday routines.</p>
              <p>Another may need support with personal care, reduced mobility, dementia or more involved daily assistance.</p>
              <p>This is why live-in care should not be treated as a one-size-fits-all arrangement.</p>
              <p className="font-medium text-gold-200">Grace & Goodwill takes time to understand what support is required so that families receive clear information about the appropriate cost before making a decision.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What does live-in care provide compared with hourly care?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Hourly home care can work well when someone only needs support at particular times of the day.</p>
              <p>Live-in care may be more appropriate when someone needs:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "more consistent support throughout the day",
                "greater reassurance at home",
                "help with several daily routines",
                "regular companionship",
                "support that cannot easily be divided into short visits",
                "continuity from a familiar carer"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Rather than focusing only on an hourly or weekly figure, families may find it more helpful to consider how much support the person actually needs across a typical day and week.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Live-in care compared with residential care</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Families considering live-in care often also look at residential or nursing-home options.</p>
              <p>The two models are very different.</p>
              <p>Live-in care allows the person to remain in their own home, surrounded by familiar possessions, routines, neighbours, pets and community. They can receive dedicated support while continuing to live in the environment they already know.</p>
              <p>Residential care provides accommodation and support within a communal setting.</p>
              <p>The right choice will depend on the individual’s needs, preferences, circumstances and finances.</p>
              <p>Cost is important, but families may also wish to consider:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "independence",
                "familiarity",
                "continuity",
                "privacy",
                "one-to-one support",
                "lifestyle preferences",
                "proximity to family and community",
                "the person’s own wishes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">Grace & Goodwill does not assume that one option is right for everyone.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Costs for couples</h3>
            <div className="page-supporting-text space-y-4">
              <p>Live-in care can also be considered where two people living in the same household both require support.</p>
              <p>For some couples, remaining together at home is extremely important.</p>
              <p>The amount and type of support required by each person would need to be discussed so that Grace & Goodwill can provide the appropriate pricing information for their circumstances.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Additional expenses</h3>
            <div className="page-supporting-text space-y-4">
              <p>Where any additional costs may apply to an arrangement, these will be discussed with the client or family in advance wherever possible.</p>
              <p>Grace & Goodwill aims to keep pricing clear so that clients understand the expected costs before proceeding.</p>
              <p>Families should always feel comfortable asking questions about what is included within the proposed arrangement.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Can financial support be available for live-in care?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Some individuals may be eligible for financial assistance towards the cost of care depending on their health needs, financial circumstances and eligibility.</p>
              <p>Possible sources of support can include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "NHS Continuing Healthcare",
                "local authority care funding",
                "Attendance Allowance",
                "other relevant benefits or financial support",
                "temporary discharge or reablement support where available"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Eligibility is determined by the relevant NHS body, local authority or other responsible organisation.</p>
              <p className="font-medium text-gold-200">Grace & Goodwill can provide general information and signposting where appropriate, but does not determine whether somebody qualifies for public funding.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Understanding your live-in care options</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Cost is only one part of choosing live-in care.</p>
              <p>Families should also feel confident about:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "the type of support being arranged",
                "the experience required",
                "the person who will be providing the support",
                "how the arrangement will work in the home",
                "what is included in the price",
                "who to contact if circumstances change"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">Grace & Goodwill provides clear information throughout the process so that clients can make an informed decision without feeling pressured.</p>
            </div>
            
            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Funding Live-in Care", href: "/funding-live-in-care" },
                  { text: "Long-Term Live-in Care", href: "/long-term-live-in-care" },
                  { text: "Respite Live-in Care", href: "/respite-live-in-care" },
                  { text: "How It Works", href: "/how-it-works" },
                  { text: "Contact", href: "/contact" }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} className="text-[13px] font-medium text-gold-100/70 hover:text-gold-300 bg-navy-950/50 px-3 py-1.5 rounded-full border border-gold-400/10 transition-colors">
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <div className="mt-16 bg-navy-900/40 p-8 sm:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Speak to Grace & Goodwill about live-in care costs</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>If you are considering live-in care for yourself or someone you love, the first step is simply to discuss the support required.</p>
              <p>Grace & Goodwill can explain the available options and provide clear pricing information based on the individual circumstances.</p>
              <p className="font-medium text-gold-200">There is no obligation to proceed simply because you have made an enquiry.</p>
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
