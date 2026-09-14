"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, CheckCircle2, Star, ChevronRight } from "lucide-react";
import olderPeopleImg from "@/assets/blog/blog-blog-Older People.jpeg";
import communicationImg from "@/assets/blog/blog-communication.png";

interface Props {
  townName: string;
  countyName: string;
  regionName: string;
  countySlug: string;
}

export default function TownPageClient({ townName, countyName, regionName, countySlug }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "I'm looking for care" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen bg-navy-950 text-gold-100 overflow-x-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[800px] rounded-full bg-gold-500/5 blur-[160px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-40 right-0 h-[500px] w-[600px] rounded-full bg-navy-800/30 blur-[120px]" />



      {/* ── Hero + Form ── */}
      <section className="relative bg-[#FDF8EC] w-full pt-16 pb-28 lg:pt-24 lg:pb-36 mb-12">
        {/* Elegant, soft asymmetric curve at the bottom to transition into navy */}
        <svg
          className="absolute bottom-0 left-0 w-full text-navy-950 translate-y-[1px]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,120 C320,40 820,120 1440,20 V120 H0 Z" />
        </svg>

        <div className="container-wrapper relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — hero copy */}
            <div className="space-y-6 pt-6">
              <div className="space-y-1">
                <h1 className="font-['Cinzel'] text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1F2937] leading-[1.15] tracking-tight">
                  Live in Care in {townName}
                </h1>
                {/* Wave underline */}
                <div className="w-14 h-2 mt-2">
                  <svg viewBox="0 0 60 10" fill="none"><path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#C2A476" strokeWidth="2" fill="transparent" /></svg>
                </div>
              </div>

              <p className="text-base text-[#4B5563] leading-relaxed max-w-lg">
                At Grace &amp; Goodwill, we help families in {townName} find experienced, compassionate live-in carers who provide one-to-one support in the comfort of your own home. Explore our options below.
              </p>
              
              <div className="relative mt-12 w-full max-w-lg z-10 lg:ml-4">
                {/* Top-left blueish background shape */}
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-full h-full bg-[#172554]/25 border border-[#172554]/50 rounded-[2.5rem] -z-10" />
                
                {/* Bottom-right blueish background shape */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-full h-full bg-[#172554]/25 border border-[#172554]/50 rounded-[2.5rem] -z-10" />
                
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#172554]/50">
                  <Image
                    src={communicationImg}
                    alt={`Live-in care consultation in ${townName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          {/* Right — callback form */}
          <div className="rounded-xl border border-gold-400/10 bg-navy-900 p-7 sm:p-9">
            <div className="mb-6">
              <h2 className="font-['Cinzel'] text-xl font-semibold text-white mb-1">Request a Call Back</h2>
              <p className="text-sm text-gold-100/50">We will be in touch within 1 working day.</p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-[#D4AF7A]" />
                <p className="font-semibold text-white text-lg">Thank you, {form.name}!</p>
                <p className="text-gold-100/60 text-sm max-w-xs">One of our care advisors will call you back within 1 working day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gold-100/80 mb-1.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-navy-950/40 border border-gold-400/20 rounded-md px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF7A]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gold-100/80 mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="youremail@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-navy-950/40 border border-gold-400/20 rounded-md px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF7A]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gold-100/80 mb-1.5">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+44"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-navy-950/40 border border-gold-400/20 rounded-md px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF7A]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gold-100/80 mb-1.5">I am a *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-navy-950/40 border border-gold-400/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF7A]/60 transition-colors appearance-none"
                  >
                    <option>I'm looking for care</option>
                    <option>I'm a carer looking for work</option>
                    <option>I'm a professional referrer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#D4AF7A] text-navy-950 font-semibold text-sm hover:bg-[#e8c98a] transition-colors mt-2"
                >
                  Request Callback
                </button>
              </form>
            )}


          </div>
        </div>
        </div>
      </section>

      {/* ── About live-in care in this town ── */}
      <section className="py-16 lg:py-24 relative">
        <div className="container-wrapper">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Image Side */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[550px] z-10 lg:pl-6 pt-6 lg:pt-0">
                {/* Top-left asymmetric offset background shape */}
                <div className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 w-full h-full bg-[#C2A476]/10 border border-[#C2A476]/20 rounded-full -z-10" />
                
                {/* Bottom-right asymmetric offset background shape */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-full h-full bg-[#C2A476]/10 border border-[#C2A476]/20 rounded-full -z-10" />
                
                <div className="relative w-full aspect-[5/4] rounded-[2rem] overflow-hidden border border-gold-400/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                  <Image
                    src={olderPeopleImg}
                    alt={`Live-in care in ${townName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Text Side */}
            <div className="space-y-6">
              <h2 className="font-['Cinzel'] text-3xl font-semibold text-white leading-snug">
                24 Hour Care at Home in {townName}
              </h2>
              
              <div className="space-y-4 text-base text-gold-100/75 leading-relaxed">
                <p>
                  Our wonderful live-in carers in {townName} have years of experience providing one-to-one care at home. We always take the time to understand your individual needs and situation to provide you and your loved one with a professional, individualised service.
                </p>
                <p>
                  We methodically match our clients with skilled, hard-working live-in carers who provide care in the comfort of their {townName} home. Our trained carers can support any needs such as 24-hour dementia care, spinal care, young adult live in care or even respite live in care.
                </p>
                <p>
                  All of our full-time carers in {townName} have been thoroughly interviewed, DBS checked and reference checked.
                </p>
              </div>

              {/* Call to action section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 pt-6">
                <div>
                  <p className="text-xs text-gold-100/50 uppercase tracking-widest mb-1.5">For enquiries call</p>
                  <a href="tel:02045240108" className="text-3xl font-semibold text-white hover:text-[#D4AF7A] transition-colors">
                    020 4524 0108
                  </a>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-xs text-gold-100/50">Operators available now</p>
                  </div>
                </div>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#D4AF7A] text-[#D4AF7A] font-semibold text-sm hover:bg-[#D4AF7A]/10 transition-colors"
                >
                  Request a callback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 border-t border-gold-400/10">
        <div className="container-wrapper text-center space-y-4">
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-semibold text-white">Ready to Find a Carer in {townName}?</h2>
          <p className="text-gold-100/50 max-w-md mx-auto text-sm">
            Speak to one of our friendly care advisors today. We&apos;re here 9am – 7pm, 7 days a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href="tel:02045240108" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#b59469] text-navy-950 font-semibold text-sm hover:bg-[#a08054] transition-all duration-300 shadow-lg">
              <Phone className="w-4 h-4" /> 020 4524 0108
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gold-400/30 text-gold-100 font-semibold text-sm hover:border-gold-400/60 hover:bg-gold-400/10 transition-all duration-300">
              Send a Message <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
