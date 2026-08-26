import React from "react";
import Button from "@/components/Button";
import ContactForm from "@/components/forms/ContactForm";
import { Heart, CheckCircle, Phone, MessageCircle, MapPin } from "lucide-react";

export const metadata = {
  alternates: {
    canonical: "/contact",
  },
  title: "Discuss Your Live-in Care Needs With Our Care Advisors",
  description: "Talk to our experienced care advisors about your live-in care needs. Get personalised guidance and find the right care and support for you or your family.",
};
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function ContactPage() {
  return (
    <main className="bg-navy-950 py-12 md:py-16 text-gold-100 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="container-wrapper max-w-4xl mx-auto space-y-12">
        {/* Header Heading & Description */}
        <div className="text-center space-y-4">
          <div className="page-strapline">Contact</div>

          <h1 className="main-page-heading">
            Trusted Live In Care Support Across The UK
          </h1>

          <p className="page-supporting-text mx-auto mt-6 max-w-2xl">
            We help families find compassionate, dependable live in care with a
            personal and supportive approach. Welcoming a carer into your home
            is a major family milestone, and our dedicated team is here to guide
            you every step of the way with warmth, careful matching, and
            reassurance.
          </p>
        </div>

        {/* 1. Contact Us Form Card */}
        <div className="rounded-[2rem] border border-gold-muted/20 bg-navy-900/50 p-6 sm:p-8 lg:p-10 shadow-elegant backdrop-blur-xl space-y-6">
          <div className="border-b border-gold-300/10 pb-4">
            <h2 className="text-xl font-bold text-gold-200">Contact Us</h2>
            <p className="page-supporting-text text-gold-100/60 mt-1">
              Have a question or need assistance? Send us a message and our team
              will get back to you as soon as possible.
            </p>
          </div>
          <ContactForm />
        </div>

        {/* 2. Grid of trust badges below the Contact Us Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-5 rounded-2xl bg-gold-muted/5 border border-gold-muted/10 items-start">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
              <Heart className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gold-200">
                Compassionate Matchmaking
              </h4>
              <p className="page-supporting-text text-gold-100/60 mt-1">
                We carefully select and match carers based on personality,
                skills, and professional care experience.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-gold-muted/5 border border-gold-muted/10 items-start">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
              <CheckCircle className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gold-200">
                Strict Vetting Standards
              </h4>
              <p className="page-supporting-text text-gold-100/60 mt-1">
                All our professional carers undergo and background checks.
              </p>
            </div>
          </div>
        </div>

        {/* 3 & 4. Additional Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3. Speak Directly With Us */}
          <div className="p-6 rounded-[1.75rem] border border-gold-300/10 bg-navy-900/40 text-center flex flex-col justify-center space-y-4 w-full h-full">
            <div>
              <h3 className="text-base font-semibold text-gold-100">
                Speak Directly With Us
              </h3>
              <p className="text-xs text-gold-100/50 mt-1">
                Have simple questions before submitting? Call our friendly support
                desk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto">
              <Button asChild variant="primary" size="sm" fullWidth>
                <a href="tel:+442045240108" className="gap-2">
                  <Phone className="w-4 h-4 fill-current" />
                  020 4524 0108
                </a>
              </Button>

              <Button asChild variant="whatsapp" size="sm" fullWidth>
                <a
                  href="https://wa.me/447462931949?text=Hi%2C%20I'd%20like%20to%20chat%20about%20your%20care%20solutions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Message Us On WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* 4. Registered Office */}
          <div className="p-6 rounded-[1.75rem] border border-gold-300/10 bg-navy-900/40 text-center flex flex-col justify-center space-y-4 w-full h-full">
            <div className="flex flex-col items-center w-full">
              <div className="mb-5 flex w-[92%] items-center justify-center gap-3 text-gold-200 font-black text-base bg-gradient-to-r from-gold-DEFAULT/5 via-gold-DEFAULT/15 to-gold-DEFAULT/5 px-4 py-2.5 rounded-2xl border border-gold-DEFAULT/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <MapPin className="w-5 h-5 text-gold-DEFAULT shrink-0" strokeWidth={2.5} />
                <span className="tracking-widest text-center whitespace-nowrap">Nationwide Live-In Care Matching</span>
              </div>
              <h3 className="text-xs font-medium text-gold-100/80 uppercase tracking-wider">
                Registered Office
              </h3>
              <address className="text-xs text-gold-100/60 leading-relaxed mt-2 not-italic">
                Hypoint,<br />
                Saltmeadows Road,<br />
                Gateshead, NE8 3AH,<br />
                United Kingdom
              </address>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
