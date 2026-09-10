import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

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

const data = {
  city: "Bristol",
  region: "South West",
  slug: "bristol",
  headline: "Live-in Care in Bristol",
  intro: [
    "Bristol is one of the UK's most vibrant and beloved cities — and for its residents, the idea of remaining at home for as long as possible, surrounded by the city they love, resonates deeply. Grace & Goodwill provides professional live-in care across Bristol and the wider South West, matching families with skilled, compassionate independent carers.",
    "Whether your loved one lives in Clifton, Redland, Bishopston, or Filton, our carers bring expert, personalised support directly to the home. From specialist dementia care and stroke recovery to long-term support and respite cover, we handle every aspect of the matching and compliance process so you can focus on family.",
  ],
  stats: [
    { label: "Bristol Coverage", value: "Full", sub: "All BS postcodes & beyond" },
    { label: "Care Specialisms", value: "12+", sub: "From dementia to palliative" },
    { label: "Client Satisfaction", value: "4.9★", sub: "Excellent on Trustpilot" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Support",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative & End-of-Life Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Companionship Care",
    "Multiple Sclerosis Care",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "How does live-in care work in Bristol?",
      answer:
        "A professionally vetted independent carer moves into your Bristol home and provides round-the-clock, one-to-one support. Services include personal care, medication management, meal preparation, household tasks, and daily companionship — all built around your loved one's existing routine.",
    },
    {
      question: "Which areas of Bristol do you cover?",
      answer:
        "We cover all Bristol postcodes and surrounding areas including Clifton, Redland, Bishopston, Horfield, Filton, Stoke Bishop, Westbury-on-Trym, Henleaze, Kingswood, Southville, Bedminster, Brislington, Knowle, and extending into South Gloucestershire and North Somerset.",
    },
    {
      question: "How much does live-in care in Bristol cost?",
      answer:
        "Live-in care in Bristol typically costs between £900 and £1,400 per week, depending on care needs and complexity. This provides dedicated, one-to-one support throughout the day and night, and is often comparable in cost to a quality residential care home in the Bristol area.",
    },
    {
      question: "Can I arrange emergency live-in care in Bristol?",
      answer:
        "Yes. We can arrange emergency live-in care placements in Bristol, often within 24 hours. Contact our team on 020 4524 0108 and we will prioritise your request.",
    },
    {
      question: "Why choose live-in care over a care home in Bristol?",
      answer:
        "Live-in care allows your loved one to remain in their own Bristol home, maintaining their independence, familiar routines, and connection to their community. Unlike a care home, they benefit from dedicated one-to-one attention 24 hours a day, which many families and professionals regard as superior care.",
    },
    {
      question: "Are Grace & Goodwill carers in Bristol DBS checked?",
      answer:
        "Yes. Every carer we introduce in Bristol is subject to an enhanced DBS check, thorough reference verification, and review of qualifications and care experience before being introduced to any client.",
    },
  ],
  nearbyAreas: [
    "Clifton", "Redland", "Bishopston", "Horfield", "Filton",
    "Stoke Bishop", "Westbury-on-Trym", "Henleaze", "Kingswood",
    "Southville", "Bedminster", "Brislington", "Knowle", "Fishponds",
    "Staple Hill", "Bath", "Weston-super-Mare", "Clevedon", "Portishead",
  ],
};

export default function BristolPage() {
  return <LocationPageTemplate data={data} />;
}
