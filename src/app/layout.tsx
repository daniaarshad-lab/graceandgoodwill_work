import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <html lang="en">
      <body className="bg-navy-950 text-gold-100 flex flex-col min-h-screen">
        <AuthProvider>
          <SiteHeader />
          <div className="flex-grow">{children}</div>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
