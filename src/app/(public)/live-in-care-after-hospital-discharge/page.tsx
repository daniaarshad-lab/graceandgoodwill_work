import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Stethoscope, CalendarCheck, Clock, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/live-in-care-after-hospital-discharge`,
  },
  title: "Live-in Care After Hospital Discharge | Grace & Goodwill",
  description: "Temporary or ongoing live-in care to assist with recovery at home following a hospital stay, surgery, or illness.",
};

export default function PostHospitalLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Link href="/" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="main-page-heading mb-5">
            Live-in Care After Hospital Discharge
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Being medically ready to leave hospital does not always mean somebody immediately feels confident or safe managing alone at home.</p>
            <p>Following illness, surgery, a fall, fracture, stroke or a lengthy hospital stay, everyday activities that were previously straightforward may temporarily become much more difficult.</p>
            <p>Live-in support can provide additional practical assistance while the person recovers within familiar surroundings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <CalendarCheck className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Planning Before Discharge</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed space-y-4">
              <p>Families do not necessarily need to wait until the person has already returned home before beginning their search.</p>
              <p>If the likely discharge date is known, Grace & Goodwill can help the family begin exploring potentially suitable carers in advance.</p>
              <p>This can be particularly important where discharge is approaching quickly.</p>
            </div>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Stethoscope className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Support During Recovery</h2>
            </div>
            
            <p className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              Depending on the individual arrangement, a live-in carer may assist with:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 mt-auto">
              {[
                "Preparing meals", "Personal care & dressing", "Mobility", 
                "Household activities", "Shopping", "Attending appointments", 
                "Maintaining rehabilitation routines", "Companionship & reassurance", 
                "Gradually rebuilding routines"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[14.5px] text-gold-100/80 font-light font-serif italic mt-auto border-t border-gold-400/10 pt-6">
                The carer does not replace the person&apos;s medical, nursing, therapy or rehabilitation professionals.
              </p>
          </section>
        </div>

        {/* Urgent Recovery / Post-Hospital Box */}
        <section className="max-w-4xl mx-auto bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg">
          <Clock className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-gold-50 mb-6">Hospital Discharge at Short Notice</h2>
          
          <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed max-w-2xl mx-auto">
            <p>Hospital discharge dates can sometimes change unexpectedly.</p>
            <p>If somebody is due to return home quickly and support needs to be found urgently, Grace & Goodwill can assist with an urgent carer search.</p>
            <p className="text-gold-100 font-medium pt-2">
              Subject to suitable carer availability and completion of the necessary arrangements, somebody may be able to start within 24 hours.
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="md" fullWidth={false} className="px-8 whitespace-nowrap">
              <Link href="/carers">Find Post-Hospital Live-in Support</Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth={false} className="px-8 whitespace-nowrap bg-navy-950/50 hover:bg-navy-900/80">
              <Link href="/urgent-live-in-care">Need a Carer Urgently?</Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
