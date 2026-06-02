import { ReactNode, useState, useEffect } from "react";
import authHero from "@/assets/auth/auth-hero.png";

interface AuthSplitLayoutProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroPosition?: string;
  children: ReactNode;
}

export default function AuthSplitLayout({
  title,
  subtitle,
  heroImage,
  heroPosition,
  children,
}: AuthSplitLayoutProps) {
  const [option, setOption] = useState<"1" | "2">("2"); // Default to Option 2

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const opt = params.get("option");
    if (opt === "1") {
      setOption("1");
    } else if (opt === "2") {
      setOption("2");
    }
  }, []);

  const bgSrc = authHero.src;
  
  // Choose correct image asset for each option
  const defaultHero = option === "1" ? "/login_option1.jpg" : "/login_option2.jpg";
  const heroSrc = heroImage ?? defaultHero;

  // Custom positioning per option after mirroring to keep both caregiver and boy perfectly visible
  const defaultPosition = option === "1" ? "53% center" : "84% center";
  const finalPosition = heroPosition ?? defaultPosition;

  return (
    <div className="asl-root">
      <div className="asl-bg" aria-hidden="true">
        <img src={bgSrc} alt="" className="asl-bg-img" />
        <div className="asl-bg-overlay" />
      </div>

      <div className="asl-wrapper">
        <div className="asl-card">
          <div className="asl-left relative overflow-hidden" aria-hidden="true" style={{ backgroundColor: "#0a1128" }}>
            {/* Blurred background image with ambient texture */}
            <img
              src={heroSrc}
              alt=""
              className="asl-left-img absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: finalPosition,
                transform: "scaleX(-1)",
                filter: "blur(16px) brightness(0.35) saturate(0.7)",
                opacity: 0.55
              }}
            />
            {/* Brand colorized navy and gold gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1128]/95 via-[#0a1128]/72 to-[#A08054]/22" />

            {/* Sharp original foreground image with mask fading smoothly into the brand background */}
            <img
              src={heroSrc}
              alt="Caregiver with client"
              className="asl-left-img absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: finalPosition,
                transform: "scaleX(-1)",
                maskImage: "radial-gradient(circle at 45% 45%, black 35%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at 45% 45%, black 35%, transparent 75%)",
                filter: "sepia(0.08) saturate(1.05) brightness(0.95)"
              }}
            />
            <div className="asl-left-overlay" />
          </div>

          <div className="asl-right">
          
            <div className="asl-header">
              <h1 className="asl-title">{title}</h1>
              {subtitle && <p className="asl-subtitle">{subtitle}</p>}
            </div>
            <div className="asl-body">{children}</div>
          </div>
        </div>
      </div>

    
    </div>
  );
}
