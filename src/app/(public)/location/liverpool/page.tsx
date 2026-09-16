import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Liverpool | Grace & Goodwill",
  description:
    "Compassionate live-in care across Liverpool and Merseyside. Grace & Goodwill connects families with trusted, vetted independent carers for expert home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/liverpool" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/liverpool",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Liverpool | Grace & Goodwill",
    description:
      "Expert live-in carers across Liverpool and the wider Merseyside area. Compassionate, person-centred care at home.",
  },
};

const towns = [
  "Aigburth", "Crosby", "Waterloo", "Bootle", "Huyton",
  "Garston", "Allerton", "Wavertree", "West Derby", "Woolton",
  "Southport", "Birkenhead", "Wallasey", "Bebington", "Heswall",
];

export default function LiverpoolPage() {
  return (
    <CountyPageClient
      countyName="Liverpool"
      regionName="North West"
      countySlug="liverpool"
      towns={towns}
    />
  );
}
