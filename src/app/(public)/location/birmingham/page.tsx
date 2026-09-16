import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Birmingham | Grace & Goodwill",
  description:
    "Professional live-in care throughout Birmingham and the West Midlands. Grace & Goodwill matches families with expert, vetted independent carers for home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/birmingham" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/birmingham",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Birmingham | Grace & Goodwill",
    description:
      "Trusted live-in carers across Birmingham city and the wider West Midlands region.",
  },
};

const towns = [
  "Edgbaston", "Moseley", "Kings Heath", "Harborne", "Sutton Coldfield",
  "Erdington", "Handsworth", "Selly Oak", "Northfield", "Solihull",
  "Walsall", "Wolverhampton", "West Bromwich", "Dudley", "Smethwick",
];

export default function BirminghamPage() {
  return (
    <CountyPageClient
      countyName="Birmingham"
      regionName="West Midlands"
      countySlug="birmingham"
      towns={towns}
    />
  );
}
