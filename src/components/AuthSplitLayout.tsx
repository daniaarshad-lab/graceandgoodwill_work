import { ReactNode } from "react";
import authHero from "@/assets/auth/auth-hero.png";

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
        <img src={authHero.src} alt="" className="asl-bg-img" />
        <div className="asl-bg-overlay" />
      </div>

      <div className="asl-wrapper">
        <div className="asl-card">
          <div className="asl-left" aria-hidden="true">
            <img
              src={authHero.src}
              alt="Caregiver with client"
              className="asl-left-img"
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
