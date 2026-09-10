import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

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

const data = {
  city: "Newcastle upon Tyne",
  region: "North East",
  slug: "newcastle-upon-tyne",
  headline: "Live-in Care in Newcastle upon Tyne",
  intro: [
    "Newcastle upon Tyne is a vibrant, proud city with a strong sense of community. When a family member needs care, the desire to keep them at home — surrounded by familiar streets, friends and family — is understandable. Grace & Goodwill provides professional live-in care across Newcastle and the wider Tyne & Wear region, helping people maintain their independence at home.",
    "Our independent carers bring specialist skills across dementia, post-surgical recovery, Parkinson's care and more. We carefully match each client with a carer who fits their personality, routine, and needs — ensuring a comfortable, trusting relationship from the very first day.",
  ],
  stats: [
    { label: "Tyne & Wear Coverage", value: "Full", sub: "All areas of Newcastle & surrounds" },
    { label: "Care Types Supported", value: "12+", sub: "Specialist & general care" },
    { label: "Client Satisfaction", value: "4.9★", sub: "Rated excellent on Trustpilot" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Care",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Companionship Care",
    "Complex Needs Support",
    "Palliative Care",
    "Physical Disability Support",
  ],
  faqs: [
    {
      question: "How does live-in care work in Newcastle upon Tyne?",
      answer:
        "A live-in carer moves into your home and provides full-time, one-to-one support. This includes personal care, medication reminders, meal preparation, household tasks, and companionship — all tailored to your routine.",
    },
    {
      question: "What areas of Newcastle do you cover?",
      answer:
        "We cover Newcastle upon Tyne city centre and all surrounding areas including Jesmond, Gosforth, Heaton, Byker, Fenham, Walker, Scotswood, and the wider Tyne & Wear metropolitan area.",
    },
    {
      question: "How is live-in care different from a care home in Newcastle?",
      answer:
        "Live-in care allows your loved one to remain in their own home with dedicated, one-to-one attention, rather than sharing staff time with multiple residents in a care home. It preserves independence, routine and familiar surroundings.",
    },
    {
      question: "Can Grace & Goodwill help with emergency care in Newcastle?",
      answer:
        "Yes. We have a network of carers available for emergency placements across Newcastle upon Tyne and can often arrange same-day or next-day introductions for urgent care situations.",
    },
    {
      question: "Are your carers in Newcastle vetted?",
      answer:
        "All carers introduced through Grace & Goodwill are thoroughly vetted — including enhanced DBS checks, reference verification, and review of qualifications and experience — before being introduced to any client.",
    },
  ],
  nearbyAreas: [
    "Jesmond", "Gosforth", "Heaton", "Byker", "Fenham", "Walker",
    "Scotswood", "Benwell", "Elswick", "Kenton", "Denton Burn",
    "Kingston Park", "Whorlton", "Westerhope",
  ],
};

export default function NewcastlePage() {
  return <LocationPageTemplate data={data} />;
}
