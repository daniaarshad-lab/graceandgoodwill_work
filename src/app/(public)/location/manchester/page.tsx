import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Manchester | Grace & Goodwill",
  description:
    "Expert live-in care across Greater Manchester. Grace & Goodwill matches families with trusted, vetted independent carers for compassionate home-based support in Manchester.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/manchester" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/manchester",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Manchester | Grace & Goodwill",
    description:
      "Professional live-in carers across all Greater Manchester boroughs. Compassionate, expert care in your own home.",
  },
};

const towns = [
  "Salford", "Trafford", "Stockport", "Tameside", "Oldham",
  "Rochdale", "Bury", "Bolton", "Wigan", "Didsbury",
  "Chorlton", "Withington", "Prestwich", "Eccles", "Stretford",
];

export default function ManchesterPage() {
  return (
    <CountyPageClient
      countyName="Manchester"
      regionName="North West"
      countySlug="manchester"
      towns={towns}
    />
  );
}
