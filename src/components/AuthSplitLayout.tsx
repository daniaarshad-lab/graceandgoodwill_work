import { ReactNode } from "react";
import Image from "next/image";
import authHero from "@/assets/auth/auth-hero.png";
import authBg from "@/assets/auth/auth-bg.png";

interface AuthSplitLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthSplitLayout({
  title,
  subtitle,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="asl-root">
      <div className="asl-bg" aria-hidden="true">
        <Image
          src={authBg}
          alt=""
          fill
          className="asl-bg-img"
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        <div className="asl-bg-overlay" />
      </div>

      <div className="asl-wrapper">
        <div className="asl-card">
          <div className="asl-left" aria-hidden="true">
            <Image
              src={authHero}
              alt="Caregiver with client"
              fill
              className="asl-left-img"
              priority
              sizes="(max-width: 768px) 0vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
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
