import { ImageResponse } from "next/og";

export const runtime = "edge";

interface Props {
  params: Promise<{ token: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { token } = await params;
  const size = { width: 1200, height: 630 };

  let displayName = "Our Carer";
  let photoUrl: string | null = null;
  let experienceYears: number | null = null;
  let isValid = false;

  try {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk"
    )
      .replace(/\/+$/, "")
      .replace(/\/api\/?$/, "");

    const res = await fetch(`${apiBase}/api/public/carer/${token}`, {
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
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

  // Privacy Logic: only First Name + Last Initial
  const nameParts = displayName ? displayName.split(/\s+/).filter(Boolean) : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : "Our Carer";
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
  const safeName = lastInitial && !firstName.endsWith(".") ? `${firstName} ${lastInitial}.` : firstName;
  const initialLetter = safeName.charAt(0).toUpperCase() || "O";

  const responseHeaders = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
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

  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", position: "relative", overflow: "hidden", fontFamily: "sans-serif", background: "#060A16" }}>
        {/* Subtle background gradient / noise */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(20,30,60,0.8) 0%, transparent 70%)", display: "flex" }} />
        
        {/* Thin Gold Line Accent at Top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "linear-gradient(90deg, #D8A93E, #F8E090, #B8851E)", display: "flex" }} />

        {/* Outer Border */}
        <div style={{ position: "absolute", inset: "24px", border: "1px solid rgba(216,169,62,0.3)", borderRadius: "12px", display: "flex" }} />

        {/* Content Container */}
        <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", padding: "60px 50px", zIndex: 2 }}>
          
          {/* Left Column: Branding and Text */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
            
            {/* Top Left: Logo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#ECCB76", letterSpacing: "3px", display: "flex" }}>
                GRACE &amp; GOODWILL
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(236,203,118,0.7)", letterSpacing: "2px", display: "flex" }}>
                CARE DEFINED BY INTEGRITY
              </div>
            </div>

            {/* Middle Left: Hero Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "-20px" }}>
              <div style={{ fontSize: "72px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, display: "flex", flexDirection: "column" }}>
                <span style={{ display: "flex" }}>CARE YOU</span>
                <span style={{ display: "flex" }}>CAN TRUST</span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: 500, color: "rgba(255,255,255,0.7)", display: "flex" }}>
                Live-in Care Matching Across the UK
              </div>
            </div>

            {/* Bottom Left: Carer Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ width: "80px", height: "3px", background: "#D8A93E", display: "flex", marginBottom: "8px" }} />
              <div style={{ fontSize: "36px", fontWeight: 700, color: "#ECCB76", display: "flex" }}>
                {safeName}
              </div>
              <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", display: "flex" }}>
                Professional Live-In Carer Profile
              </div>
            </div>
          </div>

          {/* Right Column: Photo and Tagline */}
          <div style={{ display: "flex", flexDirection: "column", width: "450px", alignItems: "flex-end", justifyContent: "space-between" }}>
            
            {/* Top Right: Empty space to balance */}
            <div style={{ display: "flex", height: "40px" }} />

            {/* Middle Right: Large Portrait */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "-40px" }}>
              {photoUrl ? (
                <div style={{ width: "380px", height: "380px", borderRadius: "190px", overflow: "hidden", border: "6px solid #D8A93E", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <img src={photoUrl} alt={safeName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: "380px", height: "380px", borderRadius: "190px", border: "6px solid #D8A93E", background: "rgba(216,169,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ fontSize: "140px", fontWeight: 700, color: "#D8A93E", display: "flex" }}>
                    {initialLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Right: Italic Tagline */}
            <div style={{ fontSize: "22px", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.8)", display: "flex" }}>
              People Make Brighter Tomorrows
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, headers: responseHeaders }
  );
}

