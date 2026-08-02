import { EmergencyCareContent } from "@/components/emergency/EmergencyCareContent";
import EmergencyCareForm from "@/components/forms/EmergencyCareForm";
import {
  AlertCircle,
  Clock,
  HeartPulse,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Urgent Live In Care | Grace & Goodwill",
  description:
    "Arrange rapid-response priority care placements within 24-48 hours.",
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

export default function EmergencyCarePage() {
  return (
    <main className="bg-navy-950 text-gold-100 min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gold-400/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-800/20 rounded-full blur-[120px] pointer-events-none" />

      {/* ── HERO — Compact top section ──────────────────────────────────── */}
      <section className="relative z-10 pt-10 pb-6 md:pt-14 md:pb-8">
        <div className="container-wrapper">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Heading */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="hidden sm:block h-px w-12 lg:w-16 bg-gradient-to-r from-transparent to-gold-400/50" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gold-50 leading-[1.15] tracking-tight text-center max-w-2xl">
                Urgent Live-in Care Matching{" "}
                <span className="text-gold-300 ml-1.5 font-light">
                  When You Need It Most
                </span>
              </h1>
              <div className="hidden sm:block h-px w-12 lg:w-16 bg-gradient-to-l from-transparent to-gold-400/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <section className="relative z-10 pb-16 md:pb-24">
        <div className="container-wrapper space-y-8">
          {/* ── FORM CARD (full width, centered) ───────────────────────── */}
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-gold-400/15 bg-navy-900/50 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400/[0.03] via-transparent to-transparent pointer-events-none" />

              {/* Card header */}
              <div className="relative z-10 px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-6 border-b border-gold-400/10">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 text-gold-300 ring-1 ring-gold-400/15 flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-50">
                      Urgent Care Matching Request
                    </h2>
                    <p className="text-sm text-gold-200/60 leading-relaxed font-light max-w-3xl">
                      Complete this form and our Urgent Matching Team will
                      review your requirements as quickly as possible. We will
                      begin identifying suitable independent self-employed
                      carers and contact you to discuss available introductions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
                <EmergencyCareForm />
              </div>
            </div>
          </div>

          {/* ── TWO CARDS SIDE BY SIDE below the form ──────────────────── */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Hotline */}
            <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-b from-navy-900/70 to-navy-950/70 p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 text-gold-300 ring-1 ring-gold-400/15 flex-shrink-0">
                    <Phone className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gold-50">
                      Priority Hotline
                    </h3>
                    <p className="text-xs text-gold-200/50 font-light mt-0.5">
                      Connect instantly with our Urgent Matching Team on call 24
                      hours a day
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gold-400/10" />

                <div className="space-y-2.5">
                  <a
                    href="tel:+442045781269"
                    className="group flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl bg-[#b59469] text-navy-950 text-sm font-bold hover:bg-[#a3835a] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 group-hover:animate-pulse" />
                    020 4578 1269
                  </a>
                  <a
                    href="https://wa.me/4402045781269?text=URGENT%3A%20I%20need%20to%20chat%20about%20an%20immediate%20live%20in%20care%20placement."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/10 hover:text-emerald-200 hover:-translate-y-[1px] transition-all duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="rounded-2xl border border-gold-400/10 bg-gradient-to-b from-navy-900/40 to-navy-950/40 p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold-300/60 mb-5">
                What happens next
              </h4>

              <div className="relative">
                <div className="absolute left-[14px] top-4 bottom-4 w-px bg-gradient-to-b from-gold-400/20 via-gold-400/10 to-transparent" />

                <div className="space-y-5">
                  <div className="flex gap-4 items-start relative">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/20 text-xs font-bold z-10">
                      1
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-semibold text-gold-100/80">
                        Urgent Matching Team
                      </p>
                      <p className="text-xs text-gold-100/50 leading-relaxed mt-0.5 font-light">
                        Our Urgent Matching Team reviews urgent enquiries,
                        identifies suitable independent self-employed carers and
                        facilitates introductions as quickly as possible.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/20 text-xs font-bold z-10">
                      2
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-semibold text-gold-100/80">
                        24–48 Hour Matching
                      </p>
                      <p className="text-xs text-gold-100/50 leading-relaxed mt-0.5 font-light">
                        Where suitable carers are available, we aim to introduce
                        independent self-employed live-in carers within 24 to 48
                        hours across the UK. Times may vary depending on
                        location, availability and individual requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators (moved from hero) */}
          <div className="max-w-6xl mx-auto pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-gold-200/60 bg-navy-900/30 rounded-full py-4 border border-gold-400/10 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400/80" strokeWidth={1.5} />
                <span>24 Hour Deploys</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gold-400/20" />
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  className="w-4 h-4 text-gold-400/80"
                  strokeWidth={1.5}
                />
                <span>Professional Handovers</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gold-400/20" />
              <div className="flex items-center gap-2.5">
                <HeartPulse
                  className="w-4 h-4 text-gold-400/80"
                  strokeWidth={1.5}
                />
                <span>DBS-Checked Carers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
