import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import type { Metadata } from "next";

import youngAdultImg from "@/assets/open/young-adult-one.jpeg";
import youngAdultImg2 from "@/assets/open/young-adult-two.jpeg";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export const metadata: Metadata = {
  alternates: {
    canonical: `/young-adult-live-in-care`,
  },
  title: "Young Adult Live-in Care UK | Disability Support at Home | Grace & Goodwill",
  description: "Live-in care for adults aged 18 and over. Explore carers for disability, mobility, neurological support and independent living at home.",
};

export default function YoungAdultLiveInCarePage() {
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
            Young Adult Live-in Care
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Live-in support for adults aged 18 and over
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Live-in care is not only for older people.</p>
            <p>Grace & Goodwill supports adults aged 18 and over who may need practical help at home because of a physical disability, neurological condition, acquired injury or other long-term support need.</p>
            <p>For many younger adults, the priority is not simply receiving help. It is being able to continue living with choice, independence, privacy and control over everyday life.</p>
            <p>Grace & Goodwill helps individuals and families explore available live-in carer profiles based on experience, personality, interests, availability and compatibility.</p>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full max-w-4xl mx-auto mb-16 px-4 py-4 md:px-8 md:py-8">
          <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 border-t border-l border-gold-300/40 rounded-tl-[3rem] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 border-b border-r border-gold-300/40 rounded-br-[3rem] pointer-events-none"></div>
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group aspect-[16/9]">
            <div className="absolute inset-0 z-0">
              <Image
                src={youngAdultImg}
                alt="Background"
                className="w-full h-full object-cover blur-xl opacity-50 scale-110"
                placeholder="blur"
              />
            </div>
            <Image
              src={youngAdultImg}
              alt="Young Adult Live-in Care"
              className="relative z-10 w-full h-full object-contain transform transition-transform duration-[2s] group-hover:scale-105"
              placeholder="blur"
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-navy-950/80 via-navy-950/5 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="space-y-10">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What can live-in support include?</h3>
            <p className="page-supporting-text mb-4">Depending on the individual arrangement, a live-in carer may provide support with:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "personal care",
                "dressing",
                "mobility assistance",
                "meal preparation",
                "shopping",
                "light household tasks",
                "attending appointments",
                "going out",
                "social activities",
                "hobbies and interests",
                "work, study or community routines",
                "companionship",
                "other agreed practical day-to-day support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug capitalize">{item}</span>
                </li>
              ))}
            </ul>
            <p className="page-supporting-text font-medium text-gold-200">The aim is to provide support around the person’s life, not to take it over.</p>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Independence, lifestyle and compatibility</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>For a younger adult, compatibility can be especially important.</p>
              <p>The person providing support may be present during everyday routines, social activities, appointments and time at home, so personality and communication style matter alongside practical experience.</p>
              <p>Clients can consider information such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "biography",
                "care experience",
                "skills and training",
                "hobbies and interests",
                "languages",
                "driving status",
                "availability",
                "introductory video",
                "preferred placements"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug capitalize">{item}</span>
                </li>
              ))}
            </ul>
            <p className="page-supporting-text">This can help the individual choose someone they feel comfortable welcoming into their home and everyday life.</p>
          </section>

          {/* Styled Secondary Image Section */}
          <div className="relative w-full max-w-4xl mx-auto px-4 py-4 md:px-8 md:py-8">
            {/* Decorative Offset Wireframe Corners */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 border-t border-l border-gold-300/40 rounded-tl-[3rem] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 border-b border-r border-gold-300/40 rounded-br-[3rem] pointer-events-none"></div>

            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group aspect-[16/9]">
              <div className="absolute inset-0 z-0">
                <Image
                  src={youngAdultImg2}
                  alt="Background"
                  className="w-full h-full object-cover blur-xl opacity-50 scale-110"
                  placeholder="blur"
                />
              </div>
              <Image
                src={youngAdultImg2}
                alt="Young Adult Support at Home"
                className="relative z-10 w-full h-full object-contain transform transition-transform duration-[2s] group-hover:scale-105"
                placeholder="blur"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-navy-950/80 via-navy-950/5 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Support that can change over time</h3>
            <div className="page-supporting-text space-y-4">
              <p>Needs may change as circumstances, health, mobility, work, study or living arrangements change.</p>
              <p>Some adults may need ongoing live-in support, while others may require short-term help following illness, injury, hospital treatment or a temporary change in circumstances.</p>
              <p>Grace & Goodwill can support searches for both shorter and longer-term live-in arrangements, subject to suitable availability.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Clinical and rehabilitation support</h3>
            <div className="page-supporting-text space-y-4">
              <p>Grace & Goodwill does not provide clinical, nursing, physiotherapy, occupational therapy or rehabilitation services.</p>
              <p>Independent live-in carers introduced through Grace & Goodwill cannot undertake clinical or rehabilitation treatment.</p>
              <p>Where these services are required, they must be provided separately by the appropriate qualified healthcare professionals.</p>
              <p>The live-in carer’s role is limited to the agreed practical day-to-day support at home and in the community.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Choosing the right live-in carer</h3>
            <div className="page-supporting-text space-y-4">
              <p>When considering live-in support for a younger adult, experience matters, but so does the relationship between the individual and the carer.</p>
              <p>Grace & Goodwill allows clients and families to explore available profiles and consider both practical experience and personal compatibility before deciding who they would like to speak with.</p>
              <p className="font-medium text-gold-200 mt-2">The final choice remains with the client.</p>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-navy-900/40 p-8 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gold-100 mb-3">Discuss Your Requirements</h3>
          <p className="page-supporting-text text-sm mb-8 max-w-lg mx-auto">
            Have simple questions or ready to discuss your care needs? Call our friendly support desk or message us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto">
            <Button asChild variant="primary" size="sm" fullWidth>
              <a href="tel:02045240108" className="gap-2">
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

      </div>
    </main>
  );
}
