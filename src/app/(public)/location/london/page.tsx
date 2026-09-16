import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in London | Grace & Goodwill",
  description:
    "Professional live-in care across all London boroughs. Grace & Goodwill matches you with trusted, vetted independent carers who provide compassionate support in your own home.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/london" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/london",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in London | Grace & Goodwill",
    description:
      "Trusted live-in care across all 32 London boroughs. Expert independent carers matched to your needs.",
  },
};

const towns = [
  "Westminster", "Kensington", "Camden", "Islington", "Hackney",
  "Tower Hamlets", "Greenwich", "Lewisham", "Southwark", "Lambeth",
  "Wandsworth", "Richmond", "Kingston", "Bromley", "Croydon",
  "Enfield", "Haringey", "Barnet", "Ealing", "Hounslow",
];

export default function LondonPage() {
  return (
    <CountyPageClient
      countyName="London"
      regionName="South East"
      countySlug="london"
      towns={towns}
    />
  );
}
