import { ReactNode } from "react";
import Image from "next/image";

interface AuthSplitLayoutProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroPosition?: string;
  children: ReactNode;
}

function AuthSplitLayoutContent({
  title,
  subtitle,
  heroImage,
  heroPosition,
  option = "2",
  children,
}: AuthSplitLayoutProps & { option?: string }) {
  // Choose correct image asset for each option
  const defaultHero = option === "1" ? "/login_option1.jpg" : "/sample.png";
  const heroSrc = heroImage ?? defaultHero;

  // Custom positioning per option after mirroring to keep both caregiver and boy perfectly visible
  const defaultPosition = option === "1" ? "45% center" : "50% center";
  const finalPosition = heroPosition ?? defaultPosition;

  return (
    <div className="asl-root">
      <div className="asl-bg" aria-hidden="true">
        {/* We use a solid navy background here to match the desired look outside the card */}
        <div className="absolute inset-0 bg-[#0a1128]" />
      </div>

      <div className="asl-wrapper">
        <div className="asl-card">
          <div
            className="asl-left relative overflow-hidden"
            aria-hidden="true"
            style={{ backgroundColor: "#0a1128" }}
          >
            {/* Blurred background image with ambient texture */}
            <Image
              src={heroSrc}
              alt=""
              fill
              className="asl-left-img object-cover"
              style={{
                objectPosition: finalPosition,
                transform: "scaleX(-1)",
                filter: "blur(16px) brightness(0.35) saturate(0.7)",
                opacity: 0.55,
              }}
            />
            {/* Brand colorized navy and gold gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1128]/95 via-[#0a1128]/72 to-[#A08054]/22" />

            {/* Sharp original foreground image with mask fading smoothly into the brand background */}
            <Image
              src={heroSrc}
              alt="Caregiver with client"
              fill
              className="asl-left-img object-cover"
              style={{
                // objectPosition: finalPosition,
                // transform: "scaleX(-1)",
                maskImage:
                  "radial-gradient(circle at 41% 35%, black 45%, transparent 75%)",
                // WebkitMaskImage: "radial-gradient(circle at 60% 10%, black 35%, transparent 75%)",
                filter: "sepia(0.08) saturate(1.05) brightness(0.95)",
              }}
            />
            <div className="asl-left-overlay" />
          </div>

          <div className="asl-right relative">
            {/* Mobile-only background image inside the form card */}
            <div className="absolute top-0 left-0 right-0 h-[65%] z-0 block lg:hidden">
              <Image
                src={heroSrc}
                alt=""
                fill
                className="object-cover"
                style={{
                  objectPosition: "center top",
                  filter: "sepia(0.05) saturate(1.05) brightness(0.65)",
                  maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[#0a1128]/30" />
            </div>

            <div className="asl-header relative z-10">
              <h1 className="asl-title">{title}</h1>
              {subtitle && <p className="asl-subtitle">{subtitle}</p>}
            </div>
            <div className="asl-body relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthSplitLayout(
  props: AuthSplitLayoutProps & { option?: string },
) {
  return <AuthSplitLayoutContent {...props} />;
}
