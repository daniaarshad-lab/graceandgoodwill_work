"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, CheckCircle2, Star, ChevronRight } from "lucide-react";
import olderPeopleImg from "@/assets/blog/blog-blog-Older People.jpeg";
import communicationImg from "@/assets/blog/blog-communication.png";
import Input from "@/components/Input";
import Select from "@/components/Select";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { publicService } from "@/services/public.service";

interface Props {
  townName: string;
  countyName: string;
  regionName: string;
  countySlug: string;
}

export default function TownPageClient({ townName, countyName, regionName, countySlug }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "I'm looking for care" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await publicService.requestCallback({
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          clientOrCarer: form.type === "I'm looking for care" ? "Client" : "Carer",
          location: townName,
          consent: true,
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Failed to submit callback request:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
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
                  Find 24-Hour Live-in Care in {townName}
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
                <div className="relative w-full aspect-video">
                  {/* Top-left elegant corner bracket */}
                  <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-24 h-24 sm:w-32 sm:h-32 border-t border-l border-[#C2A476]/60 rounded-tl-[2.5rem] -z-10 transition-all duration-500" />

                  {/* Bottom-right elegant corner bracket */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 border-b border-r border-[#C2A476]/60 rounded-br-[2.5rem] -z-10 transition-all duration-500" />

                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-[#172554]/50">
                    <Image
                      src={communicationImg}
                      alt={`Live-in care consultation in ${townName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
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
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Input
                    label="Full Name *"
                    required
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    error={errors.name}
                    className="!bg-white/5 !border-[#a08054]/20 !text-[#dcc8aa] focus:!border-[#a08054]/60 placeholder:text-white/20"
                  />
                  <Input
                    label="Email Address *"
                    required
                    type="email"
                    placeholder="youremail@example.com"
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    error={errors.email}
                    className="!bg-white/5 !border-[#a08054]/20 !text-[#dcc8aa] focus:!border-[#a08054]/60 placeholder:text-white/20"
                  />
                  <PhoneInput
                    label="Phone Number *"
                    value={form.phone}
                    onChange={(value) => handleFieldChange("phone", value)}
                    error={errors.phone}
                  />
                  <Select
                    label="I am a *"
                    value={form.type}
                    onChange={(e) => handleFieldChange("type", e.target.value)}
                    options={[
                      { value: "I'm looking for care", label: "I'm looking for care" },
                      { value: "I'm a carer looking for work", label: "I'm a carer looking for work" }
                    ]}
                    className="!bg-white/5 !border-[#a08054]/20 !text-[#dcc8aa] focus:!border-[#a08054]/60 appearance-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-md bg-[#D4AF7A] text-navy-950 font-semibold text-sm hover:bg-[#e8c98a] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Requesting..." : "Request Callback"}
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
                <div className="relative w-full aspect-[3/2]">
                  {/* Top-left asymmetric offset background shape */}
                  <div className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 w-full h-full bg-[#C2A476]/10 border border-[#C2A476]/20 rounded-full -z-10" />

                  {/* Bottom-right asymmetric offset background shape */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-full h-full bg-[#C2A476]/10 border border-[#C2A476]/20 rounded-full -z-10" />

                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-gold-400/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    <Image
                      src={olderPeopleImg}
                      alt={`Live-in care in ${townName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text Side */}
            <div className="space-y-6">
              <h2 className="font-['Cinzel'] text-3xl font-semibold text-white leading-snug">
                Find 24-Hour Live-in Care in {townName}
              </h2>

              <div className="space-y-4 text-base text-gold-100/75 leading-relaxed">
                <p>
                  Find experienced live-in carers in {townName} for personalised one-to-one support in the comfort and familiarity of home.
                </p>
                <p>
                  At Grace & Goodwill, we take the time to understand your individual needs, preferences and circumstances, helping you find suitable live-in carers who match what you are looking for.
                </p>
                <p>
                  Our live-in care matching service gives clients and families greater choice and control when finding support at home. You can consider suitable carer profiles and choose the person you feel is right for you or your loved one.
                </p>
                <p>
                  Live-in carers may provide support with a wide range of needs, including dementia care, spinal injury support, young adult live-in care, companionship, personal care, respite care and more, depending on the individual carer&apos;s experience, skills and availability.
                </p>
                <p>
                  Carers available through Grace & Goodwill complete our onboarding and compliance checks before their profiles are approved, including identity, right-to-work, DBS, references and relevant training checks, where applicable.
                </p>
                <p>
                  Whether you are planning live-in care in advance or need to find suitable support quickly, Grace & Goodwill can help you explore available live-in carers in {townName} and across the UK.
                </p>
              </div>

              {/* Call to action section */}
              <div className="flex flex-col gap-4 pt-6">
                <div className="flex items-center justify-between w-full max-w-[420px]">
                   <p className="text-xs text-gold-100/50 uppercase tracking-widest">For enquiries call</p>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                     <p className="text-[11px] text-gold-100/40">Operators available now</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar pb-1 -ml-1 pl-1">
                  <Button asChild variant="primary" size="sm" className="shrink-0">
                    <a href="tel:02045240108" className="gap-2 whitespace-nowrap">
                      <Phone className="w-4 h-4 fill-current" />
                      020 4524 0108
                    </a>
                  </Button>
                  <Button asChild variant="whatsapp" size="sm" className="shrink-0">
                    <a
                      href="https://wa.me/442045240108"
                      target="_blank"
                      rel="noreferrer"
                      className="gap-2 whitespace-nowrap"
                    >
                      <WhatsAppIcon className="w-4 h-4 shrink-0" />
                      Message Us On WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="ghost-gold" size="sm" className="shrink-0">
                    <Link
                      href="/contact"
                      className="whitespace-nowrap"
                    >
                      Request a callback
                    </Link>
                  </Button>
                </div>
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
            Speak to one of our friendly care advisors today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Button asChild variant="primary" size="md" fullWidth={false} className="w-full sm:w-[260px]">
              <a href="tel:02045240108" className="gap-2 shadow-lg">
                <Phone className="w-4 h-4 fill-current" /> 020 4524 0108
              </a>
            </Button>
            <Button asChild variant="whatsapp" size="md" fullWidth={false} className="w-full sm:w-[260px]">
              <a
                href="https://wa.me/442045240108"
                target="_blank"
                rel="noreferrer"
                className="gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Message Us On WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
