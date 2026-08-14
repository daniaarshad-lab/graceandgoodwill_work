"use client";

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
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutThunk } from "@/store/slices/authSlice";
import HeaderSearch from "./HeaderSearch";

export default function AuthenticatedHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

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

  // Role formatting
  const rawRole = user?.role || "User";
  const displayRole =
    rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shrink-0 min-h-[72px] bg-navy-950/95 backdrop-blur shadow-soft">
      <div className="container-wrapper py-4 flex items-center justify-between h-[72px] min-h-[72px] shrink-0">
        {/* Left Side: Branding */}
        <Link href={`/${pathname.split("/")[1]}`} className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/website_logo.png"
            alt="Grace & Goodwill logo"
            width={48}
            height={48}
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-elegant"
          />
          <div className="flex flex-col justify-center">
            <span
              className="font-['Cinzel'] text-[14px] sm:text-[18px] font-medium tracking-[0.15em] uppercase text-[#D4AF7A]"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
            >
              GRACE & GOODWILL
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium text-gold-200/60 font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5">
              {portalName}
            </span>
          </div>
        </Link>

        {/* Right Side: Profile */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Header Search (Desktop & Mobile) */}
          <HeaderSearch />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-gold-300/10 hover:border-gold-300/30 hover:bg-gold-DEFAULT/5 transition-all focus:outline-none"
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
                <Link
                  href={`/${pathname.split("/")[1]}?tab=profile`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold-100/80 hover:text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile
                </Link>

                <div className="h-px bg-gold-300/10 my-1"></div>

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
