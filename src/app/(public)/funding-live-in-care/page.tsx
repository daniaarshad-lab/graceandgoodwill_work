import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/funding-live-in-care`,
  },
  title: "Funding Live-in Care UK | Help With Live-in Care Costs | Grace & Goodwill",
  description: "Learn about funding live-in care in the UK, including local authority support, NHS Continuing Healthcare, direct payments, Attendance Allowance and self-funding.",
};

export default function FundingLiveInCarePage() {
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
            Funding Live-in Care
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Understanding your options for paying for live-in care
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Paying for care can feel complicated, particularly when a family is already dealing with a change in health, mobility or independence.</p>
            <p>Some people fund live-in care privately.</p>
            <p>Others may be eligible for financial support from their local authority, the NHS or through benefits.</p>
            <p>The right route depends on the individual’s needs, finances and circumstances.</p>
            <p className="font-medium text-gold-200">Grace & Goodwill can provide general information and signposting, but decisions about public funding are made by the relevant local authority, NHS body or government department.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md">
              <Link href="/live-in-care-costs">Live-in Care Costs</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Self-funding live-in care</h3>
            <div className="page-supporting-text space-y-4">
              <p>Some individuals choose to pay privately for their care.</p>
              <p>This may be because they are not eligible for public funding, prefer to arrange care independently or want greater flexibility over their care arrangements.</p>
              <p>Even if someone expects to self-fund, they can still ask their local authority for a free needs assessment to help identify what support may be appropriate.</p>
              <p>Self-funding can allow families to begin arranging support without waiting for a funding decision, while still exploring whether any benefits or other financial assistance may be available.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Local authority support</h3>
            <div className="page-supporting-text space-y-4">
              <p>Local authorities may contribute towards the cost of social care for people who meet the relevant eligibility and financial criteria.</p>
              <p>The usual process begins with a care needs assessment.</p>
              <p>If eligible care needs are identified, the council may then carry out a financial assessment, sometimes called a means test, to decide whether the person should contribute towards the cost of their care and how much support the council may provide.</p>
              <p>The amount available and the way support is arranged will depend on the individual assessment.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Personal budgets and direct payments</h3>
            <div className="page-supporting-text space-y-4">
              <p>Where a local authority agrees to fund or contribute towards care, the individual may receive a personal budget.</p>
              <p>A personal budget represents the amount the council has agreed towards meeting eligible care and support needs.</p>
              <p>In some circumstances, this can be provided as a direct payment, giving the person greater choice over how their agreed care budget is used, provided the spending meets the care and support plan agreed with the council.</p>
              <p className="font-medium text-gold-200">Families considering this route should discuss their preferred care arrangement with the local authority before making commitments, because councils may have specific requirements around how direct payments can be used.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">NHS Continuing Healthcare</h3>
            <div className="page-supporting-text space-y-4">
              <p>Some adults with significant ongoing health needs may qualify for NHS Continuing Healthcare, often referred to as NHS CHC.</p>
              <p>This is NHS-funded care for people whose main need for care is considered to be health-related.</p>
              <p>Eligibility is based on an assessment of the person’s needs rather than simply on a particular diagnosis.</p>
              <p>Where someone qualifies, NHS Continuing Healthcare can fund an agreed package of care, which may in some cases be provided in the person’s own home.</p>
              <p>Anyone who believes they may have substantial ongoing health needs can ask the relevant healthcare team or Integrated Care Board about the assessment process.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Attendance Allowance</h3>
            <div className="page-supporting-text space-y-4">
              <p>Attendance Allowance is a benefit for people who have reached State Pension age and need help or supervision because of a disability or health condition.</p>
              <p>It is not means-tested, which means savings and income do not determine eligibility.</p>
              <p>For 2026/27, Attendance Allowance is paid at either £76.70 or £114.60 per week, depending on the level of help or supervision required.</p>
              <p>Attendance Allowance does not usually cover the full cost of live-in care, but eligible individuals can use the benefit towards their wider care costs.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Other benefits and financial support</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Depending on age and circumstances, other benefits may also help with the wider costs associated with disability, illness or care.</p>
              <p>Families may wish to check whether the person is receiving all the financial support they are entitled to.</p>
              <p>This can be particularly important when needs have recently changed following:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "a hospital stay",
                "a stroke",
                "a diagnosis",
                "reduced mobility",
                "an increase in personal care needs",
                "deterioration in an existing condition"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Independent benefits advice may be helpful where eligibility is unclear.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Short-term support following illness or hospital discharge</h3>
            <div className="page-supporting-text space-y-4">
              <p>Some people may receive temporary support after leaving hospital or following an illness.</p>
              <p>This can include services such as reablement, which are designed to help someone regain independence after a period of illness or reduced ability.</p>
              <p>Availability and eligibility differ according to local arrangements and individual circumstances.</p>
              <p>Families should speak with the hospital discharge team or local authority to understand what short-term support may be available before arranging longer-term care.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Can public funding be used for live-in care?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Potentially, but this depends entirely on the funding route and the individual decision made by the relevant authority.</p>
              <p>A local authority or NHS body may agree funding towards care at home where the assessed needs and funding criteria are met.</p>
              <p>However, approval for funding does not automatically mean that every type of care arrangement will be funded.</p>
              <p>Before relying on public funding for a Grace & Goodwill placement, families should confirm directly with the relevant funding body:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "whether the individual is eligible",
                "the amount of funding available",
                "what type of care the funding can be used for",
                "whether any contribution is required from the individual",
                "whether there are conditions attached to the funding",
                "how payments will be administered"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What happens if funding does not cover the full cost?</h3>
            <div className="page-supporting-text space-y-4">
              <p>In some cases, public funding may cover only part of the cost of the support an individual wishes to arrange.</p>
              <p>Families may then need to consider whether they can privately fund the remaining amount or whether a different arrangement would be more appropriate.</p>
              <p>The funding body should explain what it has agreed to pay and any contribution expected from the individual.</p>
              <p>Grace & Goodwill can then explain the relevant live-in care pricing so that the family can understand the overall position before deciding whether to proceed.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Planning ahead for care costs</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Where possible, it can be helpful to consider care funding before support becomes urgent.</p>
              <p>Families may wish to think about:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "current savings and income",
                "possible benefit entitlement",
                "whether a local authority assessment has been completed",
                "whether NHS Continuing Healthcare may be relevant",
                "how long support may be needed",
                "whether needs are likely to change",
                "what level of financial commitment is sustainable"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>For larger or longer-term financial decisions, families may also wish to seek independent financial advice from somebody experienced in later-life or care-fee planning.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Funding decisions remain independent</h3>
            <div className="page-supporting-text space-y-4">
              <p>Grace & Goodwill does not assess eligibility for NHS funding, local authority support or government benefits.</p>
              <p>We can provide general information and help families understand which routes they may wish to explore, but all funding decisions remain with the relevant authority or organisation.</p>
            </div>
            
            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Live-in Care Costs", href: "/live-in-care-costs" },
                  { text: "Hospital Discharge Support", href: "/hospital-discharge-live-in-care" },
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Understanding your next steps</h3>
            <div className="page-supporting-text space-y-4 text-left max-w-3xl mx-auto mb-8">
              <p>If you are unsure how live-in care might be funded, it can help to establish the following first:</p>
              <ul className="list-disc pl-5 space-y-2 text-gold-100/90 font-medium my-4">
                <li>What care and support does the person currently need?</li>
                <li>Has a local authority needs assessment been requested?</li>
                <li>Has NHS Continuing Healthcare been considered where there are significant health needs?</li>
                <li>Is the person receiving all benefits they may be entitled to?</li>
                <li>If public funding is not available, what private budget is realistic?</li>
              </ul>
              <p>Once these points are clearer, Grace & Goodwill can explain the relevant live-in care options and pricing.</p>
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
                <Link href="/how-it-works">Learn How It Works</Link>
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
