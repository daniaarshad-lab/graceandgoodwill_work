import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Leeds | Grace & Goodwill",
  description:
    "Expert live-in care across Leeds and West Yorkshire. Grace & Goodwill connects families with trusted, vetted independent carers for compassionate home-based support in Leeds.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/leeds" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/leeds",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Leeds | Grace & Goodwill",
    description:
      "Professional live-in carers across Leeds and West Yorkshire. Compassionate, expert care in your own home.",
  },
};

const towns = [
  "Chapel Allerton", "Headingley", "Roundhay", "Moortown", "Garforth",
  "Horsforth", "Guiseley", "Morley", "Rothwell", "Pudsey",
  "Wetherby", "Otley", "Bramhope", "Yeadon", "Boston Spa",
];

export default function LeedsPage() {
  return (
    <CountyPageClient
      countyName="Leeds"
      regionName="Yorkshire"
      countySlug="leeds"
      towns={towns}
    />
  );
}
