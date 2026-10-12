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
  let isValid = false;

  try {
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
            <div style={{ fontSize: "28px", color: "#ffffff", opacity: 0.6, display: "flex" }}>This profile link has expired</div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", display: "flex" }}>graceandgoodwill.co.uk</div>
          </div>
        </div>
      ),
      { ...size, headers: responseHeaders }
    );
  }

  // Fetch background image
  let bgData: ArrayBuffer | null = null;
  try {
    const bgRes = await fetch(`${appUrl}/bg-share-wp.jpeg`, { signal: AbortSignal.timeout(5000) });
    if (bgRes.ok) bgData = await bgRes.arrayBuffer();
  } catch { /* ignore */ }

  // Fetch logo
  let logoData: ArrayBuffer | null = null;
  try {
    const logoRes = await fetch(`${appUrl}/website_logo.png`, { signal: AbortSignal.timeout(5000) });
    if (logoRes.ok) logoData = await logoRes.arrayBuffer();
  } catch { /* ignore */ }

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
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Background image */}
        {bgData ? (
          <img
            src={bgData as any}
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

          {/* Left side */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "720px", padding: "48px 0 0 56px" }}>

            {/* Logo + brand name */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {logoData ? (
                <img src={logoData as any} width={56} height={56} style={{ objectFit: "contain" }} />
              ) : (
                <div style={{ width: "56px", height: "56px", backgroundColor: "rgba(212,159,71,0.2)", borderRadius: "8px", display: "flex" }} />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "22px", color: "#D4A043", fontWeight: "bold", letterSpacing: "3.5px", display: "flex" }}>GRACE &amp; GOODWILL</div>
                <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.7)", letterSpacing: "3px", marginTop: "2px", display: "flex" }}>CARE DEFINED BY INTEGRITY</div>
              </div>
            </div>

            {/* Middle section */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "24px" }}>
              <div style={{ width: "50px", height: "2px", background: "linear-gradient(90deg, #D4A043, rgba(212,159,71,0.3))", marginBottom: "16px", display: "flex" }} />

              <div style={{ fontSize: "16px", color: "rgba(212,159,71,0.75)", letterSpacing: "4px", marginBottom: "20px", display: "flex" }}>CARE YOU CAN TRUST</div>

              <div style={{ fontSize: "68px", color: "#ffffff", fontWeight: "bold", lineHeight: 1.05, marginBottom: "12px", display: "flex" }}>{displayName}</div>

              <div style={{ display: "flex", fontSize: "22px", color: "rgba(255,255,255,0.7)", marginBottom: "18px" }}>
                <span style={{ display: "flex" }}>Professional Live-in Carer with </span>
                <span style={{ color: "#D4A043", fontWeight: "bold", marginLeft: "6px", display: "flex" }}>Grace &amp; Goodwill</span>
              </div>

              <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: "580px", display: "flex" }}>
                View experience, video, skills, spoken languages, availability and more.
              </div>
            </div>

            {/* Bottom: Contact details */}
            <div style={{ display: "flex", alignItems: "center", gap: "40px", marginTop: "24px", paddingBottom: "44px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", display: "flex" }}>Call our office</div>
                <div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600", display: "flex" }}>020 4524 0108</div>
              </div>
              <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(212,159,71,0.3)", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", display: "flex" }}>WhatsApp us</div>
                <div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600", display: "flex" }}>+44 7462 931949</div>
              </div>
              <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(212,159,71,0.3)", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ fontSize: "11px", color: "rgba(212,159,71,0.6)", letterSpacing: "1px", display: "flex" }}>Visit our website</div>
                <div style={{ fontSize: "16px", color: "#D4A043", fontWeight: "600", display: "flex" }}>graceandgoodwill.co.uk</div>
              </div>
            </div>
          </div>

          {/* Right side: Carer photo */}
          <div style={{ display: "flex", width: "480px", height: "100%", justifyContent: "center", alignItems: "center" }}>
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
              {photoUrl ? (
                <img src={photoUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "290px", height: "290px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: "80px", display: "flex" }}>👤</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, headers: responseHeaders }
  );
}
