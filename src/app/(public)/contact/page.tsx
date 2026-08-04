import React from "react";
import Button from "@/components/Button";
import ContactForm from "@/components/forms/ContactForm";
import { Heart, CheckCircle, Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact | Grace & Goodwill",
  description:
    "Get in touch with our team for compassionate live-in care support.",
};
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
  </svg>
);

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
              <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                All our professional carers undergo rigorous vetting and
                comprehensive background checks.
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
                020 4578 1269
              </a>
            </Button>

            <Button asChild variant="whatsapp" size="sm" fullWidth>
              <a
                href="https://wa.me/4402045781269?text=Hi%2C%20I'd%20like%20to%20chat%20about%20your%20care%20solutions."
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Message us on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
