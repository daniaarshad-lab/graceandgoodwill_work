import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/attendance-allowance-care-costs`,
  },
  title: "Attendance Allowance & Help With Care Costs UK | Grace & Goodwill",
  description: "Learn about Attendance Allowance, current DWP payment rates and other financial help that may contribute towards care at home and live-in care costs.",
};

export default function AttendanceAllowanceCareCostsPage() {
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
            Attendance Allowance & Help With Care Costs
          </h1>
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What is Attendance Allowance?</h3>
            <div className="page-supporting-text space-y-4">
              <p>Attendance Allowance is a benefit for people who have reached State Pension age and need help or supervision because of a health condition or disability.</p>
              <p>It is not means-tested, so income and savings do not affect entitlement. Eligibility is based on the level of help or supervision the person needs.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">How much is Attendance Allowance?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>According to the Department for Work and Pensions (DWP), the confirmed 2026/27 weekly rates are:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "£76.70 per week at the lower rate",
                "£114.60 per week at the higher rate"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>The rate awarded depends on the level of help or supervision required.</p>
              <p>The lower rate generally applies where someone needs frequent help or supervision during the day, or supervision at night.</p>
              <p>The higher rate generally applies where someone needs help or supervision during both the day and night, or where special rules apply because the person is nearing the end of life.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Can Attendance Allowance help with live-in care costs?</h3>
            <div className="page-supporting-text space-y-4">
              <p>Yes. Attendance Allowance can form part of the wider budget a person uses towards care and everyday support.</p>
              <p>It will not usually cover the full cost of live-in care, but it can help contribute towards the overall cost where someone is arranging care privately.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Who may be eligible?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>A person may be able to claim Attendance Allowance if they:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "have reached State Pension age",
                "have a physical or mental health condition or disability",
                "need help with personal care or supervision for safety",
                "have usually needed that help for at least 6 months"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">Different rules can apply for people who are nearing the end of life.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Other help with care costs</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Depending on individual circumstances, families may also wish to check whether other financial support is available, including:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "local authority care funding",
                "NHS Continuing Healthcare",
                "Pension Credit",
                "Council Tax Reduction",
                "other benefits or financial support linked to disability or care needs"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Receiving Attendance Allowance may also affect entitlement to certain other benefits, so it can be helpful to check the wider financial picture.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Funding information</h3>
            <div className="page-supporting-text space-y-4">
              <p>Grace & Goodwill can provide general information about live-in care costs and help families understand which funding routes may be relevant to explore.</p>
              <p>We do not assess benefit entitlement, determine eligibility or make decisions on behalf of the DWP, NHS or local authority.</p>
              <p className="font-medium text-gold-200">Where funding or benefits are relevant, families should confirm their entitlement directly with the appropriate body.</p>
            </div>
            
            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Funding Live-in Care", href: "/funding-live-in-care" },
                  { text: "Live-in Care Costs", href: "/live-in-care-costs" },
                  { text: "NHS Continuing Healthcare", href: "/nhs-continuing-healthcare" },
                  { text: "Local Authority Care Funding", href: "/local-authority-care-funding" },
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Find a Live-in Carer</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>If you are exploring care options and understand your budget, Grace & Goodwill can help you find experienced, independent carers who suit your needs.</p>
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
