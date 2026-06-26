import type { Metadata } from "next";
import ToastProvider from "@/components/Providers/ToastProvider";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-navy-950 text-gold-100 flex flex-col min-h-screen">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
