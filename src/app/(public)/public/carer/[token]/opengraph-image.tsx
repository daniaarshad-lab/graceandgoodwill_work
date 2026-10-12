import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const revalidate = 86400;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Image({ params }: Props) {
  try {
    const { token } = await params;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk";

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      `${appUrl}/api`
    )
      .replace(/\/+$/, "")
      .replace(/\/api\/?$/, "");

    let profileRes: Response | undefined;
    let logoRes: Response | undefined;
    let bgRes: Response | undefined;

    await Promise.allSettled([
      fetch(`${apiBase}/api/public/carer/${token}`, { signal: AbortSignal.timeout(5000) })
        .then(res => { profileRes = res; }),
      fetch(`${appUrl}/website_logo.png`, { signal: AbortSignal.timeout(5000) })
        .then(res => { logoRes = res; }),
      fetch(`${appUrl}/bg-share-wp.jpeg`, { signal: AbortSignal.timeout(5000) })
        .then(res => { bgRes = res; }),
    ]);

    let isValid = false;
    let displayName = "";
    let photoUrl: string | null = null;

    if (profileRes && profileRes.ok) {
      const profile = await profileRes.json();
      displayName = profile.displayName || "";
      photoUrl = profile.photoUrl || null;
      isValid = true;
    }

    let logoData: string | null = null;
    if (logoRes && logoRes.ok) {
      const buffer = await logoRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      logoData = `data:image/png;base64,${base64}`;
    }

    let bgData: string | null = null;
    if (bgRes && bgRes.ok) {
      const buffer = await bgRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      bgData = `data:image/jpeg;base64,${base64}`;
    }

    if (!isValid) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "1200px",
              height: "630px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0d1a35",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "24px",
                border: "1.5px solid rgba(212,159,71,0.4)",
                borderRadius: "16px",
                display: "flex",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "52px", color: "#D4A043", fontWeight: "bold", letterSpacing: "6px" }}>
                GRACE & GOODWILL
              </div>
              <div style={{ fontSize: "18px", color: "rgba(212,159,71,0.6)", letterSpacing: "4px", textTransform: "uppercase" }}>
                Care Defined by Integrity
              </div>
              <div style={{ width: "80px", height: "1px", backgroundColor: "rgba(212,159,71,0.4)", margin: "8px 0" }} />
              <div style={{ fontSize: "28px", color: "#ffffff", opacity: 0.6 }}>
                This profile link has expired
              </div>
              <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
                graceandgoodwill.co.uk
              </div>
            </div>
          </div>
        ),
        { ...size }
      );
    }

    let carerPhotoData: string | null = null;
    if (photoUrl) {
      try {
        const res = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const type = res.headers.get("content-type") || "image/jpeg";
          carerPhotoData = `data:${type};base64,${base64}`;
        }
      } catch {
        // ignore
      }
    }

    const firstName = displayName.split(" ")[0] || "Carer";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          {bgData ? (
            <img
              src={bgData}
              width={1200}
              height={630}
              style={{ position: "absolute", top: 0, left: 0, width: "1200px", height: "630px", objectFit: "cover" }}
            />
          ) : (
            <div style={{ position: "absolute", top: 0, left: 0, width: "1200px", height: "630px", background: "linear-gradient(135deg, #0a1628 0%, #0d1e3a 50%, #0a1228 100%)", display: "flex" }} />
          )}

          {/* Dark overlay for text readability on the left side */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "750px", height: "630px", background: "linear-gradient(to right, rgba(10,18,40,0.92) 0%, rgba(10,18,40,0.85) 60%, rgba(10,18,40,0.3) 100%)", display: "flex" }} />

          {/* Content container */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "1200px", height: "630px", display: "flex", flexDirection: "row" }}>

            {/* Left side: Branding and text */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "720px", padding: "48px 0 0 56px" }}>

              {/* Logo + brand name + strapline */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {logoData ? (
                  <img src={logoData} width={56} height={56} style={{ objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "56px", height: "56px", backgroundColor: "rgba(212,159,71,0.2)", borderRadius: "8px", display: "flex" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "22px", color: "#D4A043", fontWeight: "bold", letterSpacing: "3.5px" }}>
                    GRACE & GOODWILL
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.7)", letterSpacing: "3px", textTransform: "uppercase", marginTop: "2px" }}>
                    CARE DEFINED BY INTEGRITY
                  </div>
                </div>
              </div>

              {/* Middle section */}
              <div style={{ display: "flex", flexDirection: "column", marginTop: "24px" }}>
                {/* Decorative gold line */}
                <div style={{ width: "50px", height: "2px", background: "linear-gradient(90deg, #D4A043, rgba(212,159,71,0.3))", marginBottom: "16px", display: "flex" }} />

                {/* "Care You Can Trust" - discreet */}
                <div style={{ fontSize: "16px", color: "rgba(212,159,71,0.75)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "20px" }}>
                  CARE YOU CAN TRUST
                </div>

                {/* Carer name - prominent */}
                <div style={{ fontSize: "68px", color: "#ffffff", fontWeight: "bold", lineHeight: 1.05, marginBottom: "12px", display: "flex" }}>
                  {displayName}
                </div>

                {/* Professional Live-in Carer with G&G */}
                <div style={{ display: "flex", fontSize: "22px", color: "rgba(255,255,255,0.7)", marginBottom: "18px" }}>
                  <span>Professional Live-in Carer with </span>
                  <span style={{ color: "#D4A043", fontWeight: "bold", marginLeft: "6px" }}>Grace & Goodwill</span>
                </div>

                {/* View info */}
                <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: "580px", display: "flex" }}>
                  View experience, video, skills, spoken languages, availability and more.
                </div>
              </div>

              {/* Bottom: Contact details bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "40px", marginTop: "24px", paddingBottom: "44px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>Call our office</div>
                  <div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>020 4524 0108</div>
                </div>
                <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(212,159,71,0.3)", display: "flex" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>WhatsApp us</div>
                  <div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>+44 7462 931949</div>
                </div>
                <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(212,159,71,0.3)", display: "flex" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>Visit our website</div>
                  <div style={{ fontSize: "16px", color: "#D4A043", fontWeight: "600" }}>graceandgoodwill.co.uk</div>
                </div>
              </div>
            </div>

            {/* Right side: Carer photo */}
            <div style={{ display: "flex", width: "480px", height: "100%", justifyContent: "center", alignItems: "center" }}>
              {/* Outer glow ring */}
              <div style={{ position: "absolute", width: "340px", height: "340px", borderRadius: "50%", border: "1px solid rgba(212,159,71,0.15)", display: "flex" }} />

              <div style={{
                width: "290px",
                height: "290px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "4px solid #D4A043",
                backgroundColor: "rgba(255,255,255,0.05)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,159,71,0.15)",
              }}>
                {carerPhotoData ? (
                  <img src={carerPhotoData} width={290} height={290} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                ) : (
                  <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="rgba(212,159,71,0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (err: any) {
    console.error("OG Image Error:", err);
    return new Response(err.stack || "Internal Server Error", { status: 500 });
  }
}
