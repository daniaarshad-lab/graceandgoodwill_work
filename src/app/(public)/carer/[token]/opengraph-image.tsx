import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Image({ params }: Props) {
  const { token } = await params;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://graceandgoodwill.co.uk";

  let displayName = "";
  let photoUrl: string | null = null;
  let experienceYears: number | null = null;
  let isValid = false;

  try {
    // NEXT_PUBLIC_API_URL is e.g. https://graceandgoodwill.co.uk/api
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://graceandgoodwill.co.uk/api"
    ).replace(/\/+$/, "");

    const profileUrl = apiBase.endsWith("/api")
      ? `${apiBase}/public/carer/${token}`
      : `${apiBase}/api/public/carer/${token}`;

    const res = await fetch(profileUrl, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const profile = await res.json();
      displayName = profile.displayName || "";
      photoUrl = profile.photoUrl || null;
      experienceYears = profile.experienceYears ?? null;
      isValid = true;
    }
  } catch {
    isValid = false;
  }

  const responseHeaders = {
    "Content-Type": "image/png",
    "Cache-Control":
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
  };

  if (!isValid) {
    return new ImageResponse(
      (
        <div style={{ width: "1200px", height: "630px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a35 50%, #0a1228 100%)", fontFamily: "Georgia, serif" }}>
          <div style={{ position: "absolute", inset: "24px", border: "1.5px solid rgba(212,159,71,0.4)", borderRadius: "16px", display: "flex" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "52px", color: "#D4A043", fontWeight: "bold", letterSpacing: "6px", display: "flex" }}>GRACE &amp; GOODWILL</div>
            <div style={{ fontSize: "18px", color: "rgba(212,159,71,0.6)", letterSpacing: "4px", display: "flex" }}>Care Defined by Integrity</div>
            <div style={{ fontSize: "28px", color: "#ffffff", opacity: 0.6, display: "flex" }}>Professional Live-In Carer Profile</div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", display: "flex" }}>graceandgoodwill.co.uk</div>
          </div>
        </div>
      ),
      { ...size, headers: responseHeaders }
    );
  }

  const expLabel = experienceYears ? `${experienceYears}+ Years Experience` : "Professional Live-In Carer";

  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", position: "relative", overflow: "hidden", fontFamily: "Georgia, serif", background: "linear-gradient(145deg, #061410 0%, #091c13 30%, #0c2418 55%, #0e2d1e 75%, #071812 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(212,159,71,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", display: "flex" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 50%, rgba(10,60,35,0.45) 0%, transparent 65%)", display: "flex" }} />
        <div style={{ position: "absolute", inset: "20px", border: "1.5px solid rgba(212,159,71,0.45)", borderRadius: "16px", display: "flex" }} />
        <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", height: "4px", background: "linear-gradient(90deg, transparent, #D4A043, #F8E090, #D4A043, transparent)", borderRadius: "2px", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px 52px 52px", flex: 1, zIndex: 2 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "34px", fontWeight: "bold", color: "#D4A043", letterSpacing: "3px", display: "flex" }}>GRACE &amp; GOODWILL</div>
            <div style={{ fontSize: "13px", color: "rgba(212,159,71,0.65)", letterSpacing: "3.5px", display: "flex" }}>CARE DEFINED BY INTEGRITY</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "66px", fontWeight: "bold", color: "#ffffff", lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
              <span style={{ display: "flex" }}>CARE YOU</span>
              <span style={{ display: "flex" }}>CAN TRUST</span>
            </div>
            <div style={{ fontSize: "19px", color: "rgba(255,255,255,0.55)", display: "flex" }}>Live-in Care Matching Across the UK</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, #D4A043, transparent)", display: "flex", marginBottom: "3px" }} />
            <div style={{ fontSize: "26px", fontWeight: "bold", color: "#F8E090", display: "flex" }}>{displayName}</div>
            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", display: "flex" }}>{expLabel} · graceandgoodwill.co.uk</div>
          </div>
        </div>
        <div style={{ width: "340px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px 40px 0", zIndex: 2 }}>
          {photoUrl ? (
            <div style={{ width: "265px", height: "265px", borderRadius: "50%", overflow: "hidden", border: "4px solid #D4A043", boxShadow: "0 0 50px rgba(212,159,71,0.45)", display: "flex" }}>
              <img src={photoUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{ width: "265px", height: "265px", borderRadius: "50%", border: "4px solid rgba(212,159,71,0.5)", background: "rgba(212,159,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "80px", display: "flex" }}>👤</div>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px", height: "4px", background: "linear-gradient(90deg, transparent, #D4A043, #F8E090, #D4A043, transparent)", borderRadius: "2px", display: "flex" }} />
      </div>
    ),
    { ...size, headers: responseHeaders }
  );
}

