import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Sheffield | Grace & Goodwill",
  description:
    "Trusted live-in care across Sheffield and South Yorkshire. Grace & Goodwill matches families with vetted, compassionate independent carers for expert home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/sheffield" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/sheffield",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Sheffield | Grace & Goodwill",
    description:
      "Expert independent carers across Sheffield and South Yorkshire. Compassionate, person-centred live-in care.",
  },
};

const towns = [
  "Broomhill", "Fulwood", "Hillsborough", "Walkley", "Ecclesall",
  "Nether Edge", "Sharrow", "Crookes", "Dore", "Totley",
  "Chapeltown", "Mosborough", "Handsworth", "Gleadless", "Woodseats",
];

export default function SheffieldPage() {
  return (
    <CountyPageClient
      countyName="Sheffield"
      regionName="Yorkshire"
      countySlug="sheffield"
      towns={towns}
    />
  );
}
