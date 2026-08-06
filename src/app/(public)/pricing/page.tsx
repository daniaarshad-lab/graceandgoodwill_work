import { Check, Phone, Shield, Heart, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Button from "@/components/Button";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const ContactSalesForm = dynamic(() => import("@/components/ContactSalesForm"));
const NewsletterForm = dynamic(() => import("@/components/NewsletterForm"));

const includedItems = [
  "Personalised consultation",
  "Individual assessment",
  "Carefully matched independent live-in carers",
  "Essential compliance checks",
  "Support using the Grace & Goodwill platform",
  "Replacement support where required",
  "Nationwide matching service",
];

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 text-gold-100 overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────── */}
      {/* HERO: Heading + CTA Buttons                                   */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 sm:pt-20 pb-14 sm:pb-16">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div
            className="h-[500px] w-[900px] rounded-full opacity-[0.07] blur-[140px]"
            style={{
              background:
                "radial-gradient(ellipse, #d4af37 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="container-wrapper relative z-10 max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-400/40" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gold-400/70">
                Pricing
              </span>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-400/40" />
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif font-medium leading-[1.2] text-gold-50 tracking-tight">
              Clear, Fair Pricing with No Hidden Costs
            </h1>
          </div>

          {/* Contact CTA Card */}
          <div className="rounded-[1.75rem] border border-gold-400/15 bg-navy-900/40 shadow-elegant backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold-400/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
              <div className="text-center space-y-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 text-gold-300 ring-1 ring-gold-400/15 mx-auto">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-serif text-gold-50">
                  Speak With Our Support Team
                </h2>

                <div className="max-w-2xl mx-auto space-y-3">
                  <p className="text-sm sm:text-[15px] text-gold-200/75 leading-relaxed font-light">
                    Sometimes it&rsquo;s easier to speak with someone than
                    complete an online form, especially when you&rsquo;re
                    looking for support during a difficult or uncertain time.
                  </p>
                  <p className="text-sm sm:text-[15px] text-gold-200/75 leading-relaxed font-light">
                    Our experienced Family Support Advisors are here to answer
                    your questions, explain how our introduction service works
                    and help you understand the next steps.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex justify-center pt-3 w-full">
                  <Button asChild variant="whatsapp" size="md" className="w-full md:w-1/2 lg:w-1/3">
                    <a
                      href="https://wa.me/447462931949"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2.5 justify-center"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      WhatsApp us
                    </a>
                  </Button>
                </div>

                <p className="text-xs sm:text-sm text-gold-200/50 leading-relaxed font-light pt-1">
                  Prefer to send an enquiry instead? Simply complete the form
                  below and a member of our Support Team will get back to you as
                  soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* CONTENT: Introduction + Unique + Included — Compact Layout     */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-14 sm:pt-16 pb-6 sm:pb-8">
        {/* Subtle ambient */}
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gold-500/3 blur-[120px]" />

        <div className="container-wrapper max-w-5xl mx-auto relative z-10">
          {/* Two-column layout: Left = intro text, Right = included list */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Left Column — Introduction + Every Care Arrangement (3/5) */}
            <div className="lg:col-span-3 space-y-10">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gold-100 leading-relaxed font-light">
                  Every family&rsquo;s circumstances are different.
                </p>
                <p className="text-sm sm:text-[15px] text-gold-200/75 leading-[1.8] font-light">
                  The cost of introducing a live-in carer depends on the level
                  of support required, the complexity of your circumstances,
                  mobility needs and the experience required from the carer.
                </p>
                <p className="text-sm sm:text-[15px] text-gold-200/75 leading-[1.8] font-light">
                  Rather than offering one-size-fits-all pricing, we take the
                  time to understand your situation first. This allows us to
                  provide a clear, fair quotation, ensuring you only pay for the
                  support you genuinely need, never more and never less.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-gold-400/15 via-gold-400/8 to-transparent" />

              {/* Every Care Arrangement is Unique */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-serif text-gold-50 tracking-wide flex items-center gap-3">
                  <span className="w-7 h-px bg-gold-400/40" />
                  Every Care Arrangement is Unique
                </h2>
                <p className="text-sm sm:text-[15px] text-gold-200/75 leading-[1.8] font-light">
                  Live-in care is never a one-size-fits-all service.
                </p>
                <p className="text-sm sm:text-[15px] text-gold-200/75 leading-[1.8] font-light">
                  Before providing a quotation, we take the time to understand
                  your individual circumstances, daily routine, support
                  requirements and preferences. This allows us to introduce you
                  to the most suitable independent live-in carer while ensuring
                  our pricing remains fair, transparent and appropriate to your
                  needs.
                </p>
              </div>
            </div>

            {/* Right Column — Included With Every Introduction (2/5) */}
            <div className="lg:col-span-2">
              <div className="rounded-[1.5rem] border border-gold-400/12 bg-navy-900/40 p-6 sm:p-8 backdrop-blur-sm sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/10">
                    <Shield className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-gold-50">
                    Included With Every Introduction
                  </h3>
                </div>

                <ul className="space-y-3.5">
                  {includedItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gold-100/80 leading-relaxed font-light"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "rgba(212,175,55,0.12)" }}
                      >
                        <Check
                          className="h-3 w-3"
                          style={{ color: "#d4af37" }}
                          strokeWidth={3}
                        />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ENQUIRY FORM                                                   */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-8 pb-16 sm:pb-20">
        {/* Ambient */}
        <div className="pointer-events-none absolute left-1/4 bottom-0 h-[350px] w-[500px] rounded-full bg-gold-500/3 blur-[120px]" />

        <div className="container-wrapper max-w-4xl mx-auto relative z-10">
          <div className="rounded-[2rem] border border-gold-muted/20 bg-navy-900/50 p-8 sm:p-10 shadow-elegant backdrop-blur-xl">
            {/* Card header */}
            <div className="relative z-10 pb-8 border-b border-gold-muted/10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold-muted/5 text-gold-300 border border-gold-muted/10 flex-shrink-0">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-serif text-gold-50">
                    Request Your Personalised Quote
                  </h2>
                  <div className="space-y-1.5 max-w-2xl">
                    <p className="text-xs sm:text-sm text-gold-200/60 leading-relaxed font-light">
                      Finding the right live-in carer starts with understanding
                      your individual needs.
                    </p>
                    <p className="text-xs sm:text-sm text-gold-200/60 leading-relaxed font-light">
                      Complete the short enquiry form below and a member of our
                      Support Team will contact you to discuss your
                      circumstances, answer any questions and provide a
                      personalised quotation.
                    </p>
                    <p className="text-xs sm:text-sm text-gold-200/60 leading-relaxed font-light">
                      There is absolutely no obligation to proceed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="relative z-10 pt-8">
              <ContactSalesForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* NEWSLETTER                                                     */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-950 z-0" />
        <div
          className="absolute inset-0 opacity-10 z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 60%)",
          }}
        />

        <div className="container-wrapper relative z-20 text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-gold-50 tracking-wide mb-3">
            Stay Connected
          </h2>
          <p className="text-sm leading-relaxed text-gold-200/80 sm:text-base mb-8">
            Receive care advice, family resources, training opportunities,
            events and updates from Grace & Goodwill.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
