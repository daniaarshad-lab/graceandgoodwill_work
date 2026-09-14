import type { Metadata } from "next";
import LocationClientPage from "./LocationClientPage";

export const metadata: Metadata = {
  title: "Live-in Care Locations Across the UK | Grace & Goodwill",
  description:
    "Grace & Goodwill provides professional live-in care across the UK. Find expert carers in London, Manchester, Birmingham, Bristol and more. Compassionate, independent carers matched to your needs.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location",
    siteName: "Grace & Goodwill",
    title: "Live-in Care Locations Across the UK | Grace & Goodwill",
    description:
      "Professional live-in care available in every region of the UK. Trusted independent carers in London, Manchester, Birmingham, Bristol and beyond.",
  },
};

export default function LocationIndexPage() {
  return <LocationClientPage />;
}
