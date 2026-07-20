import React from "react";
import Button from "@/components/Button";
import ContactForm from "@/components/forms/ContactForm";
import { Heart, CheckCircle, Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact | Grace & Goodwill",
  description:
    "Get in touch with our team for compassionate live-in care support.",
};

export default function ContactPage() {
  return (
    <main className="bg-navy-950 py-12 md:py-16 text-gold-100 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="container-wrapper">
        <div className="mb-20  text-center">
          {/* LEFT COLUMN: Supportive Content & Guidance */}
          <div className="">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-muted/10 text-gold-200 border border-gold-muted/20">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-DEFAULT" />
              <span>Standard Care Enquiry</span>
            </div> */}

            {/* Dynamic Heading & Description */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight text-gold-100">
                Trusted Live In Care Support Across The UK
              </h1>

              <p className="text-gold-200/80 leading-relaxed text-base mx-auto mt-6 max-w-2xl">
                We help families find compassionate, dependable live in care
                with a personal and supportive approach. Welcoming a carer into
                your home is a major family milestone, and our dedicated team is
                here to guide you every step of the way with warmth, continuity,
                and reassurance.
              </p>
            </div>
          </div>
        </div>

        {/* new section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-2xl bg-gold-muted/5 border border-gold-muted/10">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
                  <Heart className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Compassionate Matchmaking
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    We carefully select and match carers based on personality,
                    skills, and medical experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-gold-muted/5 border border-gold-muted/10">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
                  <CheckCircle className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Regulatory & Vetting Standards
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    All professional carers undergo continuous vetting, complete
                    background checks, and strictly follow CQC code guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Team Contact CTA */}
            <div className="p-6 rounded-[1.75rem] border border-gold-300/10 bg-navy-900/40 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gold-100">
                  Speak Directly With Us
                </h3>
                <p className="text-xs text-gold-100/50 mt-1">
                  Have simple questions before submitting? Call our friendly
                  support desk.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="primary" size="sm" fullWidth>
                  <a href="tel:+442045781269" className="gap-2">
                    <Phone className="w-4 h-4 fill-current" />
                    Call Us: 020 4578 1269
                  </a>
                </Button>

                <Button asChild variant="whatsapp" size="sm" fullWidth>
                  <a
                    href="https://wa.me/447700000000?text=Hi%2C%20I'd%20like%20to%20chat%20about%20your%20care%20solutions."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Quick WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-gold-muted/20 bg-navy-900/50 p-6 sm:p-8 lg:p-10 shadow-elegant backdrop-blur-xl space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h2 className="text-xl font-bold text-gold-200">
                  Care Enquiry Form
                </h2>
                <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
                  Submit details about your support needs, and a specialist will
                  match and verify available carer profiles.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
