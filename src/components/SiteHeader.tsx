"use client";

import { AUTH_ROUTES } from "@/lib/auth-routes";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Button from "./Button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout as logoutThunk } from "@/store/slices/authSlice";
import { showSuccessToast } from "@/utils/toast";
import { Menu, X, Phone } from "lucide-react";

const CallCapsule = ({ className = "" }: { className?: string }) => (
  <a 
    href="tel:02045240108"
    className={`group flex items-center gap-3 rounded-full bg-[#b59469] px-4 py-1.5 text-navy-950 shadow-md transition-all hover:scale-105 hover:shadow-lg hover:text-white ${className}`}
  >
    <Phone className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12" fill="currentColor" />
    <div className="flex flex-col items-start leading-tight">
      <span className="text-[13px] font-bold tracking-wide">020 4524 0108</span>
      <span className="text-[10px] font-semibold opacity-80 uppercase tracking-wider">Call us today</span>
    </div>
  </a>
);

// Nav links are defined outside the component so they are never recreated.
const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  // { href: "/training", label: "Training" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

function SiteHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rawPathname = usePathname() || "";
  const pathname =
    rawPathname.endsWith("/") && rawPathname !== "/"
      ? rawPathname.slice(0, -1)
      : rawPathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleLogout = async () => {
    const rawRole = user?.role?.toUpperCase();
    const isUserAdmin = rawRole === "ADMIN" || rawRole === "SUPER_ADMIN" || pathname.startsWith("/admin");
    const isUserCarer = rawRole === "CARER" || pathname.startsWith("/carer");

    await dispatch(logoutThunk());
    setIsMobileMenuOpen(false);
    showSuccessToast("Logged out successfully");

    if (isUserAdmin) {
      router.push(AUTH_ROUTES.login.admin);
    } else if (isUserCarer) {
      router.push(AUTH_ROUTES.login.carer);
    } else {
      router.push(AUTH_ROUTES.login.client);
    }
  };

  const getPortalLink = () => {
    if (!user || !user.role) return null;
    const role = user.role.toLowerCase();
    if (role === "carer") return { href: "/carer", label: "Carer Portal" };
    if (role === "admin") return { href: "/admin", label: "Admin Portal" };
    if (role === "client") return { href: "/client", label: "Client Portal" };
    return null;
  };

  const portalLink = getPortalLink();

  const toggleMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-navy-950/95 backdrop-blur flex flex-col shadow-sm border-b border-navy-800/50 transition-all">
        <div className="container-wrapper flex items-center justify-between min-h-[80px] py-2">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-white group flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
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
              <div className="tagline mt-0.5">
                Care Defined By Integrity
              </div>
            </div>
          </Link>

          {/* Mobile menu button */}
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

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 lg:gap-6 xl:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`text-[13px] lg:text-sm font-medium transition hover:text-gold-50 whitespace-nowrap ${
                    isActive ? "text-gold-50" : "text-gold-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Actions */}
            <div className="flex flex-col items-end gap-1.5 border-l border-navy-800 pl-4 lg:pl-6 ml-2 justify-center py-1">
              <CallCapsule className="hidden xl:flex mb-1" />

              <div className="flex items-center gap-4 mr-1">
                {mounted &&
                  portalLink &&
                  !pathname.startsWith(portalLink.href) && (
                    <Link
                      href={portalLink.href}
                      prefetch={false}
                      className="text-[12px] font-semibold text-gold-DEFAULT transition hover:text-gold-200 whitespace-nowrap"
                    >
                      {portalLink.label}
                    </Link>
                  )}

                {mounted && isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost-gold"
                    size="sm"
                    fullWidth={false}
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      prefetch={false}
                      className={`text-[12px] font-semibold hover:text-gold-50 whitespace-nowrap ${
                        pathname === "/login" ? "text-gold-50" : "text-gold-200"
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      prefetch={false}
                      className="text-[12px] font-bold bg-gradient-to-r from-gold-300 to-gold-200 text-navy-950 px-4 py-1.5 rounded-full hover:scale-105 transition-transform"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Call Capsule - sticky under header */}
        <div className="xl:hidden w-full px-4 pb-3 pt-1">
          <CallCapsule className="w-full justify-center py-2" />
        </div>
      </header>

      {/* Mobile Navigation Overlay + Slide-over Drawer */}
      {isMobileMenuOpen && (
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
                  className={`text-base font-medium transition py-3 min-h-[44px] flex items-center border-b border-gold-300/5 hover:text-gold-50 ${
                    pathname === "/" ? "text-gold-50" : "text-gold-200"
                  }`}
                >
                  Home
                </Link>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-medium transition py-3 min-h-[44px] flex items-center border-b border-gold-300/5 hover:text-gold-50 ${
                        isActive ? "text-gold-50" : "text-gold-200"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {mounted &&
                  portalLink &&
                  !pathname.startsWith(portalLink.href) && (
                    <Link
                      href={portalLink.href}
                      prefetch={false}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-semibold text-gold-DEFAULT transition py-3 min-h-[44px] flex items-center border-b border-gold-300/5 hover:text-gold-200"
                    >
                      {portalLink.label}
                    </Link>
                  )}

                <div className="pt-6">
                  {mounted && isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="md"
                      fullWidth
                    >
                      Logout
                    </Button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full rounded-xl bg-[#b59469] px-5 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:bg-[#a08054] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)]"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default React.memo(SiteHeader);
