import EmergencyCareForm from "@/components/forms/EmergencyCareForm";
import { Clock, ShieldCheck, Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Urgent Live In Care | Grace & Goodwill",
  description:
    "Arrange rapid-response priority care placements within 24-48 hours.",
};

export default function EmergencyCarePage() {
  return (
    <main className="bg-navy-950 py-12 md:py-16 text-gold-100 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="container-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Urgent Content & Priority Assistance */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-200 border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Priority Response Flow</span>
            </div>

            {/* Dynamic Heading & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-gold-50 sm:text-5xl">
                Urgent Live In Care Support When You Need It Most
              </h1>
              <p className="text-gold-200/80 leading-relaxed text-base">
                Our team is here to help families arrange urgent care support
                quickly, professionally, and with compassion. Facing a sudden
                change in health, a hospital discharge schedule, or a carer
                emergency is highly stressful. We coordinate rapid-response
                placements with absolute integrity and speed.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300">
                  <Clock className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-200">
                    24–48 Hour Deploys
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    Rapid scheduling matching ensures trained professional
                    carers are deployed within 24 to 48 hours UK-wide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-gold-muted/5 border border-gold-muted/10">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
                  <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Duty Placement Desk
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    Our critical operations office organizes complete,
                    structured, and clinically sound carers handovers.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Priority Contact Card */}
            <div className="p-6 rounded-[1.75rem] border border-amber-500/20 bg-amber-500/5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-amber-200">
                  Priority Hotline
                </h3>
                <p className="text-xs text-amber-100/60 mt-1">
                  Connect instantly with our Duty Coordinator on call 24 hours a
                  day.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+442045781269"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#b59469] text-navy-950 text-xs font-bold hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)] transition-all duration-300 transform active:translate-y-0 active:shadow-none"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  Priority Line: 020 4578 1269
                </a>

                <a
                  href="https://wa.me/447700000000?text=URGENT%3A%20I%20need%20to%20chat%20about%20an%20immediate%20live%20in%20care%20placement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-emerald-300 text-xs font-bold hover:bg-emerald-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium glassmorphic priority form card */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-amber-500/20 bg-navy-900/50 p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(245,158,11,0.05)] backdrop-blur-xl space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h2 className="text-xl font-bold text-amber-200">
                  Emergency Placement Request
                </h2>
                <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
                  This form routes directly to our critical placement queue. A
                  duty officer will review details immediately.
                </p>
              </div>
              <EmergencyCareForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
