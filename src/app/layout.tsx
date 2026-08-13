import type { Metadata } from "next";
import { Poppins, Playfair_Display, Jost } from "next/font/google";
import ToastProvider from "@/components/Providers/ToastProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://graceandgoodwill.co.uk"),
  title: "Grace & Goodwill",
  description:
    "Grace & Goodwill care platform: elegant, trustworthy care coordination.",
  alternates: {
    canonical: "https://graceandgoodwill.co.uk",
  },
  openGraph: {
    url: "https://graceandgoodwill.co.uk",
    siteName: "Grace & Goodwill",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body
        suppressHydrationWarning
        className={`bg-navy-950 text-gold-100 flex flex-col min-h-screen font-sans ${poppins.variable} ${playfairDisplay.variable} ${jost.variable}`}
      >
        <ReduxProvider>
          <AuthProvider>
            {children}
            <CookieConsentBanner />
            <ToastProvider />
          </AuthProvider>
        </ReduxProvider>
        {/* Site-wide GA4 tag; self-gates on the analytics cookie consent. */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
