import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Gateshead | Grace & Goodwill",
  description:
    "Professional live-in care in Gateshead. Grace & Goodwill connects families with trusted, vetted independent carers across Gateshead and the surrounding Tyne & Wear area.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/gateshead" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/gateshead",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Gateshead | Grace & Goodwill",
    description:
      "Expert independent carers across Gateshead and the wider Tyne & Wear region.",
  },
};

const towns = [
  "Low Fell", "Whickham", "Blaydon", "Birtley", "Felling",
  "Pelaw", "Winlaton", "Rowlands Gill", "Chopwell", "High Spen",
  "Sheriff Hill", "Deckham", "Bensham",
];

export default function GatesheadPage() {
  return (
    <CountyPageClient
      countyName="Gateshead"
      regionName="North East"
      countySlug="gateshead"
      towns={towns}
    />
  );
}
