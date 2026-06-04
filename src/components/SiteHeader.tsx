"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Button from "./Button";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/training", label: "Training" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
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

  return (
    <header className="sticky top-0 z-30 w-full h-20 border-b border-navy-800 bg-navy-950/95 backdrop-blur flex items-center">
      <div className="container-wrapper flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-white group">
          <img
            src="/website_logo.png"
            alt="Grace & Goodwill logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-elegant transition-transform duration-300 group-hover:scale-105"
          />
              <span
        className="
          font-['Cinzel']
          text-[20px]
          font-medium
          tracking-[0.25em]
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

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="body-small font-medium text-gold-200 transition hover:text-gold-50"
            >
              {link.label}
            </Link>
          ))}

          {/* Dynamic Portal Link */}
          {portalLink && (
            <Link
              href={portalLink.href}
              className="body-small font-semibold text-gold-DEFAULT transition hover:text-gold-200"
            >
              {portalLink.label}
            </Link>
          )}

          {/* Authentication Actions */}
          {isAuthenticated ? (
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
                className="body-small font-semibold text-gold-200 hover:text-gold-50"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
