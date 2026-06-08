"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full h-20 border-b border-navy-800 bg-navy-950/95 backdrop-blur flex items-center">
      <div className="container-wrapper flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 text-white group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/website_logo.png"
            alt="Grace & Goodwill logo"
            width={48}
            height={48}
            className="h-8 w-8 sm:h-12 sm:w-12 object-contain drop-shadow-elegant transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className="
          font-['Cinzel']
          text-[14px]
          sm:text-[20px]
          font-medium
          tracking-[0.15em]
          sm:tracking-[0.25em]
          uppercase
          text-[#D4AF7A]
          transition-colors
          group-hover:text-[#E5C79A]
        "
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            GRACE & GOODWILL
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center text-gold-200 hover:text-gold-50 transition p-2 -mr-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <nav className="hidden items-center gap-4 lg:gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`text-[13px] lg:text-sm font-medium transition hover:text-gold-50 ${
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
              className={`text-[13px] lg:text-sm font-semibold hover:text-gold-50 ${
                pathname === "/login" ? "text-gold-50" : "text-gold-200"
              }`}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-navy-950 border-b border-navy-800 shadow-xl md:hidden overflow-y-auto max-h-[calc(100vh-80px)]">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition py-2 border-b border-gold-300/10 hover:text-gold-50 ${
                    isActive ? "text-gold-50" : "text-gold-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 pb-2">
              <Link
                href="/login"
                prefetch={false}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-full bg-gold-DEFAULT px-6 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-gold-400"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default React.memo(StaticSiteHeader);
