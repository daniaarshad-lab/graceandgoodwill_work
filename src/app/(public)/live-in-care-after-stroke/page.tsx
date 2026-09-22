import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/live-in-care-after-stroke`,
  },
  title: "Live-in Care After a Stroke UK | Stroke Support at Home | Grace & Goodwill",
  description: "Explore live-in care after a stroke with Grace & Goodwill. Find experienced carers for practical support, mobility, personal care and everyday independence at home.",
};

export default function StrokeLiveInCarePage() {
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
            Live-in Care After a Stroke
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Support at home following a stroke
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>A stroke can change everyday life very suddenly.</p>
            <p>Someone who was previously independent may return home needing additional help with mobility, personal care, meals, communication, daily routines or simply the confidence to manage at home again.</p>
            <p>The effects of stroke vary considerably from person to person. Some people recover relatively quickly, while others experience longer-term changes affecting movement, speech, swallowing, vision, memory, concentration, mood or fatigue. Recovery may continue for months or longer and often involves an individual rehabilitation plan led by healthcare professionals.</p>
            <p>Live-in care can provide consistent practical support around everyday life while someone continues their recovery in familiar surroundings.</p>
            <p>Grace & Goodwill helps individuals and families explore available live-in carer profiles, including carers with experience supporting people following a stroke.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md">
              <Link href="/carers">Find a Live-in Carer</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/blog/live-in-care-after-stroke">Read Our Stroke Support Guide</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Returning home after a stroke</h3>
            <div className="page-supporting-text space-y-4">
              <p>Leaving hospital can be an important milestone, but it can also bring understandable uncertainty.</p>
              <p>Families may be asking:</p>
              <ul className="list-disc pl-5 space-y-2 text-gold-100/90 font-medium my-4">
                <li>Will Mum or Dad be safe at home?</li>
                <li>Who will help with everyday routines?</li>
                <li>What happens when relatives cannot be there?</li>
                <li>Will they feel confident being at home again?</li>
              </ul>
              <p>Following discharge, NHS stroke rehabilitation may continue at home and can involve professionals including physiotherapists, occupational therapists, speech and language therapists and other members of the stroke team.</p>
              <p className="font-medium text-gold-200">A live-in carer does not replace those clinical professionals.</p>
              <p>Instead, the chosen carer can provide the agreed practical and personal support around day-to-day life while rehabilitation and medical care continue separately where required.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">How can a live-in carer support someone after a stroke?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Every person’s circumstances are different, so the support required should reflect their individual abilities, routines and preferences.</p>
              <p>Depending on the arrangement agreed directly with the chosen carer, live-in support may include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "help getting washed and dressed",
                "support with everyday personal care",
                "assistance moving safely around the home",
                "preparing meals and drinks",
                "shopping and light household tasks",
                "companionship and reassurance",
                "attending appointments",
                "supporting established daily routines",
                "helping someone continue hobbies and social activities where appropriate",
                "practical prompts and reminders",
                "accompanying someone outside the home",
                "other agreed everyday support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p className="font-medium text-gold-200">The aim is to provide the level of assistance needed without unnecessarily taking over tasks the person can still manage independently.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Supporting independence after a stroke</h3>
            <div className="page-supporting-text space-y-4">
              <p>Recovery after stroke is not only about what somebody needs help with.</p>
              <p>It is also about recognising what they can still do for themselves.</p>
              <p>For many people, maintaining independence may mean continuing to make their own choices, following familiar routines and remaining involved in everyday decisions even when additional physical support is needed.</p>
              <p>A live-in care arrangement can be shaped around that principle.</p>
              <p>The chosen carer can provide support where needed while allowing the individual the time, space and encouragement to continue doing things independently wherever possible.</p>
              <p>This can be particularly important as confidence gradually returns following a hospital stay.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Mobility and changes around the home</h3>
            <div className="page-supporting-text space-y-4">
              <p>Stroke can affect balance, coordination, strength and movement, sometimes on one side of the body.</p>
              <p>Before or after discharge, healthcare professionals may recommend equipment or changes to the home to support safer movement and greater independence.</p>
              <p>A live-in carer can work around those arrangements and provide the practical assistance agreed with the client, while physiotherapy, occupational therapy and rehabilitation goals remain under the direction of the relevant healthcare professionals.</p>
              <p className="font-medium text-gold-200">Where mobility has changed significantly, families should make sure potential carers understand the person’s current abilities and any equipment or techniques advised by their clinical team.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Communication, patience and familiarity</h3>
            <div className="page-supporting-text space-y-4">
              <p>The effects of stroke are not always immediately visible.</p>
              <p>Some people may experience difficulties with speech, understanding language, memory, concentration or processing information. Others may become tired more quickly or need additional time to complete everyday tasks.</p>
              <p>That makes the relationship with a live-in carer particularly important.</p>
              <p>Patience, communication style and personality can matter just as much as practical experience.</p>
              <p>Grace & Goodwill allows families to consider these personal factors alongside a carer’s experience and skills before deciding who they would like to speak with.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Choosing a live-in carer with relevant experience</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>When exploring carers after a stroke, families may wish to consider experience relating to areas such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "stroke support",
                "reduced mobility",
                "personal care",
                "moving and handling",
                "communication difficulties",
                "meal preparation",
                "neurological conditions",
                "supporting older adults",
                "hospital discharge",
                "companionship",
                "supporting established rehabilitation routines",
                "helping people maintain independence at home"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Depending on the profile, families can also consider information such as the carer’s biography, skills and training, interests, languages, driving status, availability and introductory video.</p>
              <p>Grace & Goodwill can also support families in identifying potentially suitable available profiles based on the information and preferences they provide.</p>
              <p className="font-medium text-gold-200">The final choice of carer remains with the client.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Short-term or longer-term support</h3>
            <div className="page-supporting-text space-y-4 text-left max-w-3xl mx-auto mb-8">
              <p>Not everyone requires the same level of support indefinitely.</p>
              <p>Some people may need live-in care for a shorter period after leaving hospital while they recover strength, adapt to changes or establish a new routine.</p>
              <p>Others may have longer-term support needs following their stroke.</p>
              <p>Grace & Goodwill supports searches for both short-term and ongoing live-in care, subject to suitable carer availability and both parties agreeing to the placement.</p>
              <p>If needs change over time, families can return to the platform and consider other available carers whose experience may be more suitable for the person’s current circumstances.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="outline" size="md">
                <Link href="/respite-live-in-care">Explore Respite Live-in Care</Link>
              </Button>
              <Button asChild variant="outline" size="md">
                <Link href="/long-term-live-in-care">Explore Long-Term Live-in Care</Link>
              </Button>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Supporting families as well as the individual</h3>
            <div className="page-supporting-text space-y-4">
              <p>A stroke can affect the whole family.</p>
              <p>Relatives often want to help but may also be balancing work, children, distance and other responsibilities.</p>
              <p>The NHS recognises that supporting someone after stroke can place significant demands on family carers and that carers themselves may need appropriate support.</p>
              <p>Having a live-in carer can provide additional practical continuity at home without requiring relatives to manage every aspect of everyday support themselves.</p>
              <p>Families can remain involved while knowing somebody is present to provide the agreed day-to-day assistance.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Live-in care alongside stroke rehabilitation</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Live-in care and stroke rehabilitation have different roles.</p>
              <p>Clinical stroke recovery may involve:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "physiotherapy",
                "occupational therapy",
                "speech and language therapy",
                "cognitive rehabilitation",
                "psychological support",
                "medical reviews",
                "specialist nursing or other clinical services"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>These should continue to be provided by the relevant qualified healthcare professionals. NHS stroke services may continue rehabilitation in the person’s own home following discharge.</p>
              <p>The live-in carer provides the practical everyday support agreed directly with the client and can help the person maintain routines around the professional treatment and rehabilitation they are receiving.</p>
            </div>
          </section>

          {/* Contact Info */}
          <div className="mt-16 bg-navy-900/40 p-8 sm:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Finding support after a stroke</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>Choosing somebody to live in the home following a stroke is a significant decision.</p>
              <p>Relevant experience matters, but so do patience, communication, personality and the way the person feels around the carer.</p>
              <p>Grace & Goodwill gives individuals and families greater visibility over available live-in carers so they can consider both practical experience and personal compatibility before making their decision.</p>
              <p>Whether support is needed following hospital discharge, for a period of recovery or on a longer-term basis, the aim is to help the individual continue living at home with the level of support they choose.</p>
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
