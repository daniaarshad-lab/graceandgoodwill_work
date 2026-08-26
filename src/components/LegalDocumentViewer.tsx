"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft, Printer, CheckCircle2, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalDocumentViewerProps {
  documentTitle: string;
  documentSubtitle: string;
  lastUpdated: string;
  companyName?: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalDocumentViewer({
  documentTitle,
  documentSubtitle,
  lastUpdated,
  companyName = "Grace & Goodwill Ltd",
  sections,
  children,
}: LegalDocumentViewerProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200">
      {/* ── Top Hero Header ────────────────────────────────────────────── */}
      <div className="relative bg-navy-950 py-5 md:py-6 overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div
            className="h-[400px] w-[800px] rounded-full opacity-[0.06] blur-[120px]"
            style={{
              background: "radial-gradient(ellipse, #d4af37 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="absolute top-6 left-0 z-20 w-full px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold-200/70 hover:text-gold-200 hover:underline underline-offset-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-gold-400/20 text-sm font-medium text-gold-100 hover:bg-gold-500/10 transition-colors shadow-elegant"
          >
            <Printer className="w-4 h-4" />
            Print Document
          </button>
        </div>

        <div className="container-wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-0">
          <div className="max-w-4xl text-center mx-auto space-y-4 pt-8 sm:pt-4">
            <div className="page-strapline">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Official Legal Policy
              </span>
            </div>

            <h1 className="text-[13px] sm:text-sm lg:text-[15px] font-medium tracking-wide text-gold-200 uppercase max-w-4xl mx-auto px-4">
              {documentTitle}
            </h1>
            
            {documentSubtitle && (
              <p className="text-xs sm:text-sm text-gold-200/80 max-w-2xl mx-auto uppercase tracking-wider font-medium">
                {documentSubtitle}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-gold-200/50 mt-2">
              <span>{companyName}</span>
              <span>•</span>
              <span>Company No. 16011465</span>
              <span>•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="container-wrapper max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Table of Contents Sidebar */}
          {sections.length > 0 && (
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 rounded-2xl bg-navy-900/60 border border-navy-800 p-5 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-300 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-400" />
                  Table of Contents
                </h3>
                <nav className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`group flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                        activeSection === sec.id
                          ? "bg-gold-500/15 text-gold-200 font-semibold border-l-2 border-gold-400 pl-2.5"
                          : "text-slate-400 hover:text-slate-200 hover:bg-navy-800/50"
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Document Content */}
          <main className={sections.length > 0 ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12"}>
            <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-headings:text-slate-100 prose-h2:font-sans prose-h2:font-medium prose-h2:border-b prose-h2:border-navy-800 prose-h2:pb-2 prose-h2:mt-8 prose-h2:text-base prose-h3:font-sans prose-h3:font-medium prose-h3:text-sm prose-h3:text-gold-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-slate-100">
              {children}
            </div>

            {/* Bottom Affirmation Banner */}
            <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-gold-400/20 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
              <div>
                <h4 className="text-base font-semibold text-slate-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-400" />
                  Legal Binding Agreement
                </h4>
                <p className="text-xs text-slate-400">
                  By accessing or registering on Grace &amp; Goodwill, you acknowledge having read and accepted these terms.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold tracking-wide transition-colors whitespace-nowrap"
              >
                Contact Legal Team
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
