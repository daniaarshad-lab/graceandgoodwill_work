import type { Metadata } from "next";
import { Poppins, Playfair_Display, Jost, Montserrat } from "next/font/google";
import ToastProvider from "@/components/Providers/ToastProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import ReduxProvider from "@/store/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-family-poppins",
  display: "swap",
});

/* Footer value titles and taglines only — matches the supplied artwork.
   Nothing else in the app uses these two families. */
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-family-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-family-jost",
  display: "swap",
});

/* Logo strapline only, matching the logo designer artwork. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-family-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://graceandgoodwill.co.uk"),
  title: "Grace & Goodwill",
  description:
    "Grace & Goodwill care platform: elegant, trustworthy care coordination.",
  openGraph: {
    url: "https://graceandgoodwill.co.uk",
    siteName: "Grace & Goodwill",
    type: "website",
  },
  verification: {
    google: "lK8_u-IHT7cNSuFxyLTA3Gktl4HkPOFPaV_2rxwweVE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Grace & Goodwill",
              url: "https://graceandgoodwill.co.uk",
              logo: "https://graceandgoodwill.co.uk/logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Gateshead",
                addressCountry: "UK"
              },
              areaServed: "UK"
            })
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`bg-navy-950 text-gold-100 flex flex-col min-h-screen font-sans ${poppins.variable} ${playfairDisplay.variable} ${jost.variable} ${montserrat.variable}`}
      >
        <ReduxProvider>
          <AuthProvider>
            {children}
            <CookieConsentBanner />
            <ToastProvider />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
