import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Bristol | Grace & Goodwill",
  description:
    "Expert live-in care across Bristol and the South West. Grace & Goodwill matches families with trusted, vetted independent carers for compassionate, person-centred home care.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/bristol" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/bristol",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Bristol | Grace & Goodwill",
    description:
      "Professional live-in carers across Bristol and the wider South West. Compassionate, expert care in your own home.",
  },
};

const towns = [
  "Clifton", "Redland", "Bishopston", "Horfield", "Filton",
  "Stoke Bishop", "Westbury-on-Trym", "Henleaze", "Kingswood",
  "Southville", "Bedminster", "Brislington", "Knowle", "Fishponds",
  "Staple Hill", "Bath", "Weston-super-Mare", "Clevedon", "Portishead",
];

export default function BristolPage() {
  return (
    <CountyPageClient
      countyName="Bristol"
      regionName="South West"
      countySlug="bristol"
      towns={towns}
    />
  );
}
