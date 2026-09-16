import type { Metadata } from "next";
import CountyPageClient from "../[county]/CountyPageClient";

export const metadata: Metadata = {
  title: "Live-in Care in Newcastle upon Tyne | Grace & Goodwill",
  description:
    "Trusted live-in care in Newcastle upon Tyne. Grace & Goodwill matches families with vetted, compassionate independent carers across Tyne & Wear.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/newcastle-upon-tyne" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/newcastle-upon-tyne",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Newcastle upon Tyne | Grace & Goodwill",
    description:
      "Expert live-in carers across Newcastle upon Tyne and the wider Tyne & Wear region.",
  },
};

const towns = [
  "Jesmond", "Gosforth", "Heaton", "Byker", "Fenham", "Walker",
  "Scotswood", "Benwell", "Elswick", "Kenton", "Denton Burn",
  "Kingston Park", "Whorlton", "Westerhope",
];

export default function NewcastlePage() {
  return (
    <CountyPageClient
      countyName="Newcastle upon Tyne"
      regionName="North East"
      countySlug="newcastle-upon-tyne"
      towns={towns}
    />
  );
}
