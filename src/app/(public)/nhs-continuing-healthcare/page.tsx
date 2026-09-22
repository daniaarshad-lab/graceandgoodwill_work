import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/nhs-continuing-healthcare`,
  },
  title: "NHS Continuing Healthcare Funding | NHS CHC Care at Home | Grace & Goodwill",
  description: "Learn about NHS Continuing Healthcare, eligibility, the CHC assessment process and how NHS funding may support care at home.",
};

export default function NHSContinuingHealthcarePage() {
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
            NHS Continuing Healthcare
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What is NHS Continuing Healthcare?</h3>
            <div className="page-supporting-text space-y-4">
              <p>NHS Continuing Healthcare, often called NHS CHC, is a package of care for adults aged 18 or over that is arranged and funded solely by the NHS where the person is assessed as having a primary health need. Eligibility is based on the nature and complexity of the person’s needs, not simply on having a particular diagnosis.</p>
              <p>For some people, NHS CHC funding can support care in their own home, depending on the care package agreed by the relevant Integrated Care Board.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">How does the assessment work?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>The process usually begins with an NHS Continuing Healthcare Checklist completed by a trained health or social care professional.</p>
              <p>If the checklist indicates that a full assessment is needed, a multidisciplinary team will assess the person’s needs in more detail using the NHS Decision Support Tool.</p>
              <p>The assessment considers areas including:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "mobility",
                "communication",
                "cognition",
                "behaviour",
                "nutrition",
                "continence",
                "skin",
                "medication",
                "breathing",
                "psychological and emotional needs",
                "altered states of consciousness",
                "other significant care needs"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">A positive checklist does not automatically mean NHS CHC will be awarded. It means the person should proceed to a full assessment.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Can NHS Continuing Healthcare fund care at home?</h3>
            <div className="page-supporting-text space-y-4">
              <p>Yes. Where someone is eligible for NHS Continuing Healthcare, the NHS may fund an agreed package of care in the person’s own home. The way that package is arranged depends on the individual’s personalised care and support plan and the relevant Integrated Care Board.</p>
              <p>Grace & Goodwill can provide general information and signposting and help families understand available live-in care options. We do not assess eligibility for NHS Continuing Healthcare, make funding decisions or provide clinical services. Families should confirm directly with their NHS team whether their proposed care arrangement can be funded through their personal health budget.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What if someone is not eligible?</h3>
            <div className="page-supporting-text space-y-4">
              <p>If NHS Continuing Healthcare is not awarded, the person may still be able to receive support through their local authority or other funding routes, depending on their circumstances.</p>
              <p>Families can also consider private live-in care if they wish to arrange additional support independently.</p>
            </div>

            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Funding Live-in Care", href: "/funding-live-in-care" },
                  { text: "Live-in Care Costs", href: "/live-in-care-costs" },
                  { text: "Local Authority Care Funding", href: "/local-authority-care-funding" },
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
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Understanding your options</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>If you believe NHS Continuing Healthcare may be relevant, you can speak with the person’s healthcare team or local Integrated Care Board about the assessment process.</p>
              <p>Once the funding position is clearer, Grace & Goodwill can explain the available live-in care options and relevant pricing.</p>
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
