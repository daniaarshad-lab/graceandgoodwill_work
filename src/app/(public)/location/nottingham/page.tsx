import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Nottingham | Grace & Goodwill",
  description:
    "Professional live-in care in Nottingham and Nottinghamshire. Grace & Goodwill connects families with trusted, expert independent carers for compassionate home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/nottingham" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/nottingham",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Nottingham | Grace & Goodwill",
    description:
      "Expert live-in carers across Nottingham city and Nottinghamshire. Compassionate, person-centred care at home.",
  },
};

const towns = [
  "West Bridgford", "Arnold", "Beeston", "Long Eaton", "Hucknall",
  "Clifton", "Gedling", "Carlton", "Radcliffe on Trent", "Bingham",
  "Newark-on-Trent", "Mansfield", "Eastwood", "Ilkeston", "Stapleford",
];

export default function NottinghamPage() {
  return (
    <CountyPageClient
      countyName="Nottingham"
      regionName="East Midlands"
      countySlug="nottingham"
      towns={towns}
    />
  );
}
