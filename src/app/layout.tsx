import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Grace & Goodwill",
  description:
    "Grace & Goodwill care platform: elegant, trustworthy care coordination.",
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
        className={`bg-navy-950 text-gold-100 flex flex-col min-h-screen font-sans ${poppins.variable}`}
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
