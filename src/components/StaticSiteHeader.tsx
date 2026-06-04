"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Nav links are defined outside the component so they are never recreated.
const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/training", label: "Training" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

function StaticSiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full h-20 border-b border-navy-800 bg-navy-950/95 backdrop-blur flex items-center">
      <div className="container-wrapper flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-white group">
          <Image
            src="/Icon_logo.png"
            alt="Grace & Goodwill logo"
            width={48}
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-elegant transition-transform duration-300 group-hover:scale-105"
          />
          <span className="body-base-medium tracking-[0.08em] text-gold-100 transition-colors group-hover:text-gold-50">
            Grace & Goodwill
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`body-small font-medium transition hover:text-gold-50 ${
                  isActive ? "text-gold-50" : "text-gold-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Authentication Actions - Static fallback for public layout */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              prefetch={false}
              className={`body-small font-semibold hover:text-gold-50 ${
                pathname === "/login" ? "text-gold-50" : "text-gold-200"
              }`}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default React.memo(StaticSiteHeader);
