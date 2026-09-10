import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

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

const data = {
  city: "Nottingham",
  region: "East Midlands",
  slug: "nottingham",
  headline: "Live-in Care in Nottingham",
  intro: [
    "Nottingham sits at the heart of the East Midlands, and Grace & Goodwill is proud to serve the families of this historic city. We provide live-in care throughout Nottingham city and the wider Nottinghamshire county, matching clients with experienced, thoroughly vetted independent carers who provide compassionate, one-to-one support at home.",
    "Our Nottingham carers are experienced across a broad range of care needs — from specialist dementia and Parkinson's care to post-surgical recovery and complex physical disability support. We handle the entire matching and compliance process, so families can focus on what matters most.",
  ],
  stats: [
    { label: "City & County Coverage", value: "Full", sub: "Nottingham & Nottinghamshire" },
    { label: "Care Specialisms", value: "10+", sub: "Specialist & everyday support" },
    { label: "Match Time", value: "48h", sub: "Or same-day for urgent care" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Care",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Companionship Care",
    "Young Adult Live-in Support",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "What is live-in care and how does it work in Nottingham?",
      answer:
        "A live-in carer moves into your Nottingham home and provides dedicated, round-the-clock support. This covers personal care, medication management, meal preparation, household assistance, and meaningful companionship — all built around the client's own routine.",
    },
    {
      question: "Which areas of Nottingham and Nottinghamshire do you cover?",
      answer:
        "We cover Nottingham city and the wider county, including West Bridgford, Arnold, Beeston, Long Eaton, Hucknall, Clifton, Gedling, Carlton, Radcliffe on Trent, Newark-on-Trent, Mansfield, and surrounding areas.",
    },
    {
      question: "How much does live-in care in Nottingham cost?",
      answer:
        "Live-in care in Nottingham typically costs between £875 and £1,350 per week, depending on care complexity. This provides full-time, one-to-one care at home and is often comparable to — or less expensive than — residential care home fees in the Nottingham area.",
    },
    {
      question: "Can Grace & Goodwill arrange urgent live-in care in Nottingham?",
      answer:
        "Yes. We can often arrange same-day or next-day emergency care in Nottingham. Please contact us as soon as possible so we can prioritise your request.",
    },
    {
      question: "What makes live-in care better than a care home for someone in Nottingham?",
      answer:
        "Live-in care provides dedicated, one-to-one attention in a familiar home environment. This supports better outcomes for many conditions, particularly dementia, where routine and familiarity are critical to wellbeing. It also allows the person to remain close to their own community and family.",
    },
  ],
  nearbyAreas: [
    "West Bridgford", "Arnold", "Beeston", "Long Eaton", "Hucknall",
    "Clifton", "Gedling", "Carlton", "Radcliffe on Trent", "Bingham",
    "Newark-on-Trent", "Mansfield", "Eastwood", "Ilkeston", "Stapleford",
  ],
};

export default function NottinghamPage() {
  return <LocationPageTemplate data={data} />;
}
