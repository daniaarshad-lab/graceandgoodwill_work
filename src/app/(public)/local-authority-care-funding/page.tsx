import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/local-authority-care-funding`,
  },
  title: "Local Authority Care Funding UK | Council Help With Care Costs | Grace & Goodwill",
  description: "Learn how local authority care funding works, including needs assessments, financial assessments, personal budgets and direct payments for care at home.",
};

export default function LocalAuthorityCareFundingPage() {
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
            Local Authority Care Funding
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Help with the cost of care at home
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Some people may be eligible for financial support from their local council towards the cost of care and support at home.</p>
            <p>In England, the process usually starts with a care needs assessment carried out by the local authority. This looks at the person’s care and support needs, how those needs affect everyday life and what outcomes they want to achieve. The assessment is based on need, not on the person’s finances.</p>
            <p className="font-medium text-gold-200">If eligible needs are identified, the council may then carry out a financial assessment, sometimes called a means test, to decide whether the person should contribute towards the cost of their support and how much the council may contribute.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md">
              <Link href="/funding-live-in-care">Funding Options</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">How much can the council contribute?</h3>
            <div className="page-supporting-text space-y-4">
              <p>For 2026/27 in England, the upper capital limit remains £23,250 and the lower capital limit £14,250. These figures are used as part of the financial assessment process.</p>
              <p>The amount of support available will depend on the individual’s assessed needs and financial circumstances.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Personal budgets and direct payments</h3>
            <div className="page-supporting-text space-y-4">
              <p>Where a local authority agrees to contribute towards eligible care needs, the person may receive a personal budget.</p>
              <p>In some circumstances, this can be provided as a direct payment, giving the individual more choice over how the agreed budget is used, provided it meets the care and support plan agreed with the council.</p>
              <p className="font-medium text-gold-200">Families considering live-in care should confirm directly with the local authority whether their proposed arrangement can be supported using the personal budget or direct payment available to them.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Can local authority funding support live-in care?</h3>
            <div className="page-supporting-text space-y-4">
              <p>Potentially, depending on the individual assessment, the care and support plan and the funding arrangement agreed by the local authority.</p>
              <p>Grace & Goodwill can provide general information about live-in care options and signpost families towards relevant funding routes, but we do not carry out care needs assessments, financial assessments or make local authority funding decisions.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What if the council does not cover the full cost?</h3>
            <div className="page-supporting-text space-y-4">
              <p>Some people may be expected to contribute towards their care, while others may need to pay the full cost themselves.</p>
              <p>The council should explain what it has agreed to fund, any contribution required from the individual and how the personal budget will be managed.</p>
              <p>Once the funding position is clear, Grace & Goodwill can explain the relevant live-in care pricing and available options.</p>
            </div>
            
            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Funding Live-in Care", href: "/funding-live-in-care" },
                  { text: "Live-in Care Costs", href: "/live-in-care-costs" },
                  { text: "NHS Continuing Healthcare", href: "/nhs-continuing-healthcare" },
                  { text: "Attendance Allowance & Help With Care Costs", href: "/attendance-allowance-care-costs" },
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Speak to our team today</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>Once your funding position is clear, contact Grace & Goodwill to explore independent live-in carers who match your needs.</p>
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
