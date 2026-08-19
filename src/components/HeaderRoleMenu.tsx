"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface RoleMenuItem {
  href: string;
  label: string;
  description: string;
}

interface HeaderRoleMenuProps {
  label: string;
  items: RoleMenuItem[];
  /** Renders the trigger as a filled gold button rather than a text link. */
  variant?: "link" | "button";
  isActive?: boolean;
}

/**
 * Desktop-only Login / Register menu that forces an explicit Client-or-Carer
 * choice before entering either journey.
 *
 * Opens on hover (per the client's request) and on click/keyboard, so it works
 * for pointer, touch-on-desktop and keyboard users alike. Escape closes and
 * returns focus to the trigger; an outside click closes it.
 */
export default function HeaderRoleMenu({
  label,
  items,
  variant = "link",
  isActive = false,
}: HeaderRoleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  const triggerClasses =
    variant === "button"
      ? `inline-flex items-center gap-1.5 rounded-xl bg-[#b59469] px-4 py-2 text-[13px] lg:text-sm font-semibold text-navy-950 transition-all duration-300 hover:bg-[#c9a67d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 whitespace-nowrap`
      : `inline-flex items-center gap-1 text-[13px] lg:text-sm font-semibold transition hover:text-gold-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 rounded-sm whitespace-nowrap ${
          isActive || isOpen ? "text-gold-50" : "text-gold-200"
        }`;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={close}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className={triggerClasses}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          /* pt-3 keeps a hoverable bridge between trigger and panel */
          className="absolute right-0 top-full z-50 pt-3"
        >
          <div className="w-64 rounded-2xl border border-gold-400/20 bg-navy-950/95 p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md animate-fade-in-fast">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                role="menuitem"
                onClick={close}
                className="group flex flex-col gap-0.5 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-gold-400/10 focus:bg-gold-400/10 focus:outline-none"
              >
                <span className="text-[13px] font-semibold text-gold-50 transition-colors group-hover:text-gold-300">
                  {item.label}
                </span>
                <span className="text-[11px] leading-snug text-gold-200/50 transition-colors group-hover:text-gold-200/70">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
