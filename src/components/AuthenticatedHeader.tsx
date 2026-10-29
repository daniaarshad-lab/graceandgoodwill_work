"use client";

import { AUTH_ROUTES } from "@/lib/auth-routes";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  User as UserIcon,
  Settings,
  Key,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutThunk } from "@/store/slices/authSlice";
import HeaderSearch from "./HeaderSearch";
import NotificationBell from "./NotificationBell";
import { useNotificationSSE } from "@/hooks/useNotificationSSE";

export default function AuthenticatedHeader() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clientProfile = useAppSelector((state) => state.client.profile);

  // Start SSE real-time notification stream
  useNotificationSSE(isAuthenticated);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine portal name from pathname
  let portalName = "Portal";
  if (pathname.startsWith("/admin")) portalName = "Admin Portal";
  else if (pathname.startsWith("/client")) portalName = "Client Portal";
  else if (pathname.startsWith("/carer")) portalName = "Carer Portal";

  const isClient = pathname.startsWith("/client") || user?.role?.toUpperCase() === "CLIENT";
  const clientStatus = (clientProfile?.status || (user as any)?.status || "").toUpperCase();
  const isClientPendingOrUnderReview =
    isClient &&
    (clientStatus === "PENDING" ||
      clientStatus === "UNDER_REVIEW" ||
      clientStatus === "PENDING_APPROVAL" ||
      pathname === "/client/onboarding");

  const isAdmin = pathname.startsWith("/admin") || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Role formatting
  const rawRole = user?.role || "User";
  const displayRole =
    rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

  const handleLogout = async () => {
    const rawRole = user?.role?.toUpperCase();

    const isUserAdmin = rawRole === "ADMIN" || rawRole === "SUPER_ADMIN" || pathname.startsWith("/admin");
    const isUserCarer = rawRole === "CARER" || pathname.startsWith("/carer");

    // Tell ProtectedRoute this is an intentional logout so it doesn't
    // store a stale redirect or race with our navigation below.
    sessionStorage.setItem("auth_logging_out", String(Date.now()));
    await dispatch(logoutThunk());

    if (isUserAdmin) {
      router.replace(AUTH_ROUTES.login.admin);
    } else if (isUserCarer) {
      router.replace(AUTH_ROUTES.login.carer);
    } else {
      router.replace(AUTH_ROUTES.login.client);
    }
  };

  const normalizedPathname =
    pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const isCarePlatformFullScreenRoute =
    normalizedPathname === "/admin" ||
    normalizedPathname === "/admin/care-platform" ||
    normalizedPathname === "/admin/master-libraries" ||
    normalizedPathname === "/admin/placements-dashboard" ||
    normalizedPathname === "/admin/carer-accommodation";

  if (isCarePlatformFullScreenRoute) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full shrink-0 min-h-[72px] bg-navy-950/95 backdrop-blur shadow-soft" style={{ top: 0, marginTop: 0 }}>
      <div className="container-wrapper py-4 flex items-center justify-between h-[72px] min-h-[72px] shrink-0">
        {/* Left Side: Branding */}
        <Link href={`/${pathname.split("/")[1]}`} className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 flex-shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/website_logo.png"
            alt="Grace & Goodwill logo"
            width={48}
            height={48}
            className="h-7 w-7 min-[360px]:h-8 min-[360px]:w-8 sm:h-10 sm:w-10 object-contain drop-shadow-elegant"
          />
          <div className="flex flex-col justify-center">
            <span
              className="font-['Cinzel'] text-[12px] min-[360px]:text-[14px] sm:text-[18px] font-medium tracking-[0.1em] min-[360px]:tracking-[0.15em] uppercase text-[#D4AF7A] whitespace-nowrap"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
            >
              GRACE & GOODWILL
            </span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-medium text-gold-200/60 font-sans tracking-[0.1em] min-[360px]:tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5">
              {portalName}
            </span>
          </div>
        </Link>

        {/* Right Side: Profile */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {/* Header Search (Desktop & Mobile) */}
          <HeaderSearch />

          {/* Real-time notification bell */}
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 sm:pr-3 rounded-full border border-gold-300/10 hover:border-gold-300/30 hover:bg-gold-DEFAULT/5 transition-all focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-navy-900 border border-gold-DEFAULT/50 flex items-center justify-center overflow-hidden shrink-0">
                <UserIcon className="w-4 h-4 text-gold-DEFAULT" />
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-gold-100 leading-tight">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[10px] font-medium text-gold-200/60 uppercase tracking-wider leading-tight">
                  {displayRole}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gold-200/60 ml-1 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gold-300/10 bg-navy-900 shadow-elegant overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gold-300/10 sm:hidden">
                  <p className="text-sm font-bold text-gold-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gold-200/60">{displayRole}</p>
                </div>
                {!isAdmin && !isClientPendingOrUnderReview && (
                  <>
                    <Link
                      href={`/${pathname.split("/")[1]}?tab=profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold-100/80 hover:text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Profile
                    </Link>

                    <div className="h-px bg-gold-300/10 my-1"></div>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
