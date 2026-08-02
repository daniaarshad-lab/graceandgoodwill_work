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
      <div className="container-wrapper max-w-4xl mx-auto space-y-12">
        {/* Header Heading & Description */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight text-gold-100">
            Trusted Live In Care Support Across The UK
          </h1>

          <p className="text-gold-200/80 leading-relaxed text-base mx-auto mt-6 max-w-2xl">
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
            <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
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
              <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                We carefully select and match carers based on personality,
                skills, and medical experience.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-gold-muted/5 border border-gold-muted/10 items-start">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
              <CheckCircle className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gold-200">
                Regulatory & Vetting Standards
              </h4>
              <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                All professional carers undergo vetting, complete background
                checks.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Speak Directly With Us below the grid */}
        <div className="p-6 rounded-[1.75rem] border border-gold-300/10 bg-navy-900/40 text-center space-y-4 max-w-2xl mx-auto w-full">
          <div>
            <h3 className="text-base font-semibold text-gold-100">
              Speak Directly With Us
            </h3>
            <p className="text-xs text-gold-100/50 mt-1">
              Have simple questions before submitting? Call our friendly support
              desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button asChild variant="primary" size="sm" fullWidth>
              <a href="tel:+442045781269" className="gap-2">
                <Phone className="w-4 h-4 fill-current" />
                Call Us: 020 4578 1269
              </a>
            </Button>

            <Button asChild variant="whatsapp" size="sm" fullWidth>
              <a
                href="https://wa.me/4402045781269?text=Hi%2C%20I'd%20like%20to%20chat%20about%20your%20care%20solutions."
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
    </main>
  );
}
