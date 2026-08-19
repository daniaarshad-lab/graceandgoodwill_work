"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { RoleMenuItem } from "./HeaderRoleMenu";

interface MobileRoleMenuProps {
  label: string;
  items: RoleMenuItem[];
  closeMenu: () => void;
  variant?: "outline" | "filled";
}

export default function MobileRoleMenu({
  label,
  items,
  closeMenu,
  variant = "outline",
}: MobileRoleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col border-b border-gold-300/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[56px] w-full items-center justify-between py-3 text-base font-medium text-gold-200 transition hover:text-gold-50"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 pb-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 pl-4 border-l border-gold-400/20 ml-2 mb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={closeMenu}
              className="group flex flex-col gap-0.5 rounded-xl px-4 py-3 transition-colors hover:bg-gold-400/10 active:bg-gold-400/10"
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
    </div>
  );
}
