"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Button from "./Button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout as logoutThunk } from "@/store/slices/authSlice";
import { showSuccessToast } from "@/utils/toast";
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

function SiteHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
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
    await dispatch(logoutThunk());
    setIsMobileMenuOpen(false);
    showSuccessToast("Logged out successfully");
    router.push("/login");
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
    <header className="sticky top-0 z-50 w-full h-20 border-b border-navy-800 bg-navy-950/95 backdrop-blur flex items-center">
      <div className="container-wrapper flex items-center justify-between py-4">
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
            <div className="flex items-center gap-2 sm:gap-3 mt-0.5">
              <div className="h-[1px] w-4 sm:w-8 lg:w-12 bg-gradient-to-r from-transparent to-[#c7ae85]/70"></div>
              <span className="text-[9px] sm:text-[10px] font-medium text-[#c7ae85] font-sans tracking-[0.15em] sm:tracking-[0.25em] uppercase whitespace-nowrap">
                Care Defined By Integrity
              </span>
              <div className="h-[1px] w-4 sm:w-8 lg:w-12 bg-gradient-to-l from-transparent to-[#c7ae85]/70"></div>
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

          {mounted && portalLink && !pathname.startsWith(portalLink.href) && (
            <Link
              href={portalLink.href}
              prefetch={false}
              className="text-[13px] lg:text-sm font-semibold text-gold-DEFAULT transition hover:text-gold-200"
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
          )}
        </nav>
      </div>

      {/* Mobile Navigation Overlay + Slide-over Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-navy-950 border-l border-navy-800 shadow-2xl z-50 flex flex-col p-6 overflow-y-auto animate-slide-in">
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in {
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>
            
            <div className="flex items-center justify-between pb-6 border-b border-navy-800 mb-6">
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-widest">
                Navigation
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gold-200 hover:text-gold-50 transition p-2 -mr-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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

              {mounted && portalLink && !pathname.startsWith(portalLink.href) && (
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
                  <Button asChild variant="primary" size="md" fullWidth>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

export default React.memo(SiteHeader);
