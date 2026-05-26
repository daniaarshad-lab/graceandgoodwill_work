"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/about", label: "About" },
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
    <header className="sticky top-0 z-30 border-b border-navy-800 bg-navy-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <img
            src="/logo.svg"
            alt="Grace & Goodwill logo"
            className="h-12 w-12 rounded-md border border-gold-400 bg-navy-900 p-1"
          />
          <span className="text-lg font-semibold tracking-[0.08em] text-gold-100">
            Grace & Goodwill
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gold-200 transition hover:text-gold-50"
            >
              {link.label}
            </Link>
          ))}

          {/* Dynamic Portal Link */}
          {portalLink && (
            <Link
              href={portalLink.href}
              className="text-sm font-semibold text-gold-DEFAULT transition hover:text-gold-200"
            >
              {portalLink.label}
            </Link>
          )}

          {/* Authentication Actions */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-transparent text-sm font-semibold text-gold-DEFAULT border border-gold-DEFAULT/30 hover:border-gold-DEFAULT hover:bg-gold-DEFAULT/10 px-4 py-2 rounded-xl transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-gold-200 hover:text-gold-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gold-DEFAULT text-navy-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-elegant hover:bg-gold-300 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
