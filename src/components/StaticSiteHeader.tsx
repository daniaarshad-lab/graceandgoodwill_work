"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HeartHandshake, Menu, X, Calendar } from "lucide-react";
import HeaderRoleMenu, { type RoleMenuItem } from "@/components/HeaderRoleMenu";
import MobileRoleMenu from "@/components/MobileRoleMenu";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";


// Nav links are defined outside the component so they are never recreated.
const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  // { href: "/training", label: "Training" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

/** Exact match, plus nested routes so /blog/[slug] still highlights "Blog". */
const isNavLinkActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

/* The role choice is made here, before either journey starts — the descriptions
   are what stop a carer picking the client option by accident. */
const loginItems: RoleMenuItem[] = [
  {
    href: AUTH_ROUTES.login.client,
    label: "Login as Client",
    description: "I need care for myself or a relative",
  },
  {
    href: AUTH_ROUTES.login.carer,
    label: "Login as Carer",
    description: "I work as an independent live-in carer",
  },
];

const registerItems: RoleMenuItem[] = [
  {
    href: AUTH_ROUTES.register.client,
    label: "Register as Client",
    description: "Find and compare live-in carers",
  },
  {
    href: AUTH_ROUTES.register.carer,
    label: "Register as Carer",
    description: "Join our carer network",
  },
];

function StaticSiteHeader() {
  const rawPathname = usePathname() || "";
  const pathname =
    rawPathname.endsWith("/") && rawPathname !== "/"
      ? rawPathname.slice(0, -1)
      : rawPathname;

  const isPublicCarerProfile =
    pathname.startsWith("/public/carer") ||
    pathname.startsWith("/carer/") ||
    (typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/public/carer") ||
        window.location.pathname.startsWith("/carer/")));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col transition-all">
      {/* Top Contact Bar */}
      {!isPublicCarerProfile && (
      <div className="w-full bg-[#b59469] text-black py-1.5 md:py-2">
        <div className="container-wrapper flex flex-wrap justify-center items-center gap-4 sm:gap-10 md:gap-24 text-[12px] sm:text-[13px] font-medium tracking-wide">
          <a href="tel:02045240108" className="flex items-center gap-2 sm:gap-3 text-black hover:opacity-70 transition-opacity">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
            <span className="text-black">Call our office: 020 4524 0108</span>
          </a>
          <a href="https://wa.me/442045240108" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-3 text-black hover:opacity-70 transition-opacity">
            <WhatsAppIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-black" />
            <span className="text-black">WhatsApp us</span>
          </a>
          <Link href="/contact" className="hidden sm:flex items-center gap-3 text-black hover:opacity-70 transition-opacity">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
            <span className="text-black">Request a callback</span>
          </Link>
        </div>
      </div>
      )}

      <div className="w-full h-20 border-b border-navy-800 bg-navy-950/95 backdrop-blur flex items-center">

        <div className="container-wrapper flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center gap-[2px] sm:gap-3 text-white group flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/website_logo.png"
              alt="Grace & Goodwill logo"
              width={48}
              height={48}
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain drop-shadow-elegant transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col items-center justify-center">
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
              <div className="tagline">
                Care Defined By Integrity
              </div>
            </div>
          </Link>

          {/* Mobile menu button */}
          {!isPublicCarerProfile && (
            <button
              className="xl:hidden flex items-center text-gold-200 hover:text-gold-50 transition p-2 -mr-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}

          {!isPublicCarerProfile && (
          <nav className="hidden items-center gap-4 lg:gap-6 xl:flex">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`text-[13px] lg:text-sm font-medium transition hover:text-[#f5d4A0] whitespace-nowrap ${isActive ? "text-[#f5d4A0]" : "text-white"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Carer recruitment entry point — kept as its own visible link so
                carers arriving from ads or search do not have to hunt for it. */}
            <Link
              href={AUTH_ROUTES.carerRecruitment}
              prefetch={false}
              className={`inline-flex items-center gap-1.5 text-[13px] lg:text-sm font-medium transition hover:text-[#f5d4A0] whitespace-nowrap ${pathname === AUTH_ROUTES.carerRecruitment
                ? "text-[#f5d4A0]"
                : "text-white"
                }`}
            >
              <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              Join as a Carer
            </Link>

            {/* Auth Buttons */}
            <div className="hidden xl:flex items-center gap-3 lg:gap-4 border-l border-navy-800 pl-4 lg:pl-6 ml-2">
              <HeaderRoleMenu
                label="Login"
                items={loginItems}
                isActive={pathname === "/login"}
              />
              <HeaderRoleMenu
                label="Register"
                items={registerItems}
                variant="button"
                isActive={pathname === "/register"}
              />
            </div>
          </nav>
          )}
        </div>


      </div>

      {/* Mobile Navigation Overlay + Slide-over Drawer */}
      {!isPublicCarerProfile && isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 bottom-0 w-[min(85vw,360px)] md:w-[380px] lg:w-[420px] bg-navy-950 border-l border-navy-800 shadow-2xl z-[100] flex flex-col overflow-hidden animate-slide-in">
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in {
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>

            <div className="relative flex items-center justify-between h-[72px] shrink-0 px-4 sm:px-6 border-b border-navy-800 w-full">
              {/* Left: Logo */}
              <div className="flex-shrink-0 z-10 w-8">
                <img
                  src="/website_logo.png"
                  alt="Grace & Goodwill logo"
                  className="h-8 w-8 object-contain drop-shadow-elegant"
                />
              </div>

              {/* Center: Title */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-gold-300 uppercase tracking-widest">
                  Navigation
                </span>
              </div>

              {/* Right: Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gold-200 hover:text-gold-50 transition p-3 -mr-3 z-10 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition py-3 min-h-[44px] flex items-center border-b border-gold-300/5 hover:text-gold-50 ${pathname === "/" ? "text-gold-50" : "text-gold-200"
                    }`}
                >
                  Home
                </Link>
                {navLinks.map((link) => {
                  const isActive = isNavLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-medium transition py-3 min-h-[44px] flex items-center border-b border-gold-300/5 hover:text-gold-50 ${isActive ? "text-gold-50" : "text-gold-200"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Carer recruitment — given its own prominent row so it is
                    not buried among the marketing pages. */}
                <Link
                  href={AUTH_ROUTES.carerRecruitment}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition py-3 min-h-[44px] flex items-center gap-2.5 border-b border-gold-300/5 hover:text-gold-50 ${pathname === AUTH_ROUTES.carerRecruitment
                    ? "text-gold-50"
                    : "text-gold-200"
                    }`}
                >
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  Join as a Carer
                </Link>

                {/* Login / Register, each split by role. The same explicit
                    choice as the desktop dropdowns. */}
                <div className="pt-2">
                  <MobileRoleMenu
                    label="Login"
                    items={loginItems}
                    closeMenu={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileRoleMenu
                    label="Register"
                    items={registerItems}
                    closeMenu={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default React.memo(StaticSiteHeader);
