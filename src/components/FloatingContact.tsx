"use client";

import React, { useState, useRef } from "react";
import { Phone } from "lucide-react";

export default function FloatingContact() {
  const [isHovered, setIsHovered] = useState(false);
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const initialPointer = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
    isDraggingRef.current = true;
    setIsCurrentlyDragging(true);
    hasMoved.current = false;
    
    initialPointer.current = { x: e.clientX, y: e.clientY };
    dragStart.current = {
      x: e.clientX - currentPos.current.x,
      y: e.clientY - currentPos.current.y,
    };
    
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    if (!hasMoved.current) {
      const dist = Math.sqrt(
        Math.pow(e.clientX - initialPointer.current.x, 2) + 
        Math.pow(e.clientY - initialPointer.current.y, 2)
      );
      if (dist > 5) {
        hasMoved.current = true;
      }
    }

    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    currentPos.current = { x: newX, y: newY };
    
    // Apply transform directly to the DOM for 60fps butter-smooth dragging
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsCurrentlyDragging(false);
    
    if (e.currentTarget.releasePointerCapture) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex items-center justify-end h-[40px] md:h-[50px] will-change-transform"
    >
      <div 
        className="relative touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Continuous soft pulse ring for the circular state */}
        <div 
          className={`absolute right-0 top-0 h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full bg-[#d1b481] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none transition-opacity duration-300 ${isHovered || isCurrentlyDragging ? 'opacity-0' : 'opacity-40'}`} 
        />
        
        {/* Tooltip popup */}
        <div 
          className={`absolute bottom-full right-0 mb-2.5 md:mb-3 px-4 py-2 md:px-5 md:py-3 bg-navy-950 text-gold-50 text-[12px] md:text-[14px] font-medium rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] border border-gold-300/20 whitespace-nowrap pointer-events-none transition-all duration-300 origin-bottom-right ${
            isHovered && !isCurrentlyDragging ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          Click to call. Drag to move.
          {/* Tooltip arrow */}
          <div className="absolute top-full right-[15px] md:right-[19px] w-2.5 h-2.5 md:w-3 md:h-3 bg-navy-950 border-b border-r border-gold-300/20 rotate-45 transform -translate-y-[6px] md:-translate-y-[7px]"></div>
        </div>
        
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative flex items-center bg-gradient-to-r from-[#e8ba7a] to-[#d1b481] text-navy-950 rounded-full shadow-[0_8px_30px_rgba(209,180,129,0.3)] hover:shadow-[0_12px_40px_rgba(209,180,129,0.5)] overflow-hidden h-[40px] md:h-[50px] ${
            isHovered && !isCurrentlyDragging 
              ? "w-[144px] md:w-[168px] transition-all duration-300 ease-out" 
              : "w-[40px] md:w-[50px] transition-all duration-300 ease-out"
          } ${isCurrentlyDragging ? '!transition-none' : ''}`}
        >
          {/* Drag Handle & Clickable Icon area */}
          <a 
            href="tel:02045240108"
            onClick={(e) => {
              if (hasMoved.current) {
                e.preventDefault();
                return;
              }
              if (typeof window !== "undefined" && window.innerWidth >= 768) {
                e.preventDefault();
                alert("Call us on: 020 4524 0108");
              }
            }}
            className="absolute right-0 top-0 h-[40px] w-[40px] md:h-[50px] md:w-[50px] cursor-grab flex items-center justify-center text-black hover:text-white transition-colors duration-300"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.25} />
          </a>
          
          {/* Clickable Phone Number */}
          <a
            href="tel:02045240108"
            onClick={(e) => {
              if (hasMoved.current) {
                e.preventDefault();
                return;
              }
              if (typeof window !== "undefined" && window.innerWidth >= 768) {
                e.preventDefault();
                alert("Call us on: 020 4524 0108");
              }
            }}
            className={`absolute right-[36px] md:right-[48px] whitespace-nowrap font-medium text-[13px] md:text-[14px] tracking-wide transition-all duration-300 cursor-pointer text-black hover:text-white ${
              isHovered && !isCurrentlyDragging ? "opacity-100 delay-100" : "opacity-0 duration-100 pointer-events-none"
            }`}
          >
            020 4524 0108
          </a>
        </div>
      </div>
    </div>
  );
}
