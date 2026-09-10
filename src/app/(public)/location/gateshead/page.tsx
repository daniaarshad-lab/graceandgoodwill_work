import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

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

const data = {
  city: "Gateshead",
  region: "North East",
  slug: "gateshead",
  headline: "Live-in Care in Gateshead",
  intro: [
    "Gateshead is a thriving town on the south bank of the Tyne, with a close-knit community and a proud sense of identity. For families seeking care, keeping a loved one in their own Gateshead home — with their own routines and memories intact — is often the most compassionate choice. Grace & Goodwill delivers live-in care that makes this possible.",
    "From Low Fell to Blaydon, our independent carers serve Gateshead and its surrounding communities. Each carer is matched carefully to their client, ensuring compatibility, trust, and continuity of care — the foundations of a truly supportive live-in relationship.",
  ],
  stats: [
    { label: "Areas Covered", value: "All", sub: "Gateshead & surrounds" },
    { label: "Care Specialisms", value: "10+", sub: "Dementia, Parkinson's & more" },
    { label: "Average Match Time", value: "48h", sub: "Or same-day for emergencies" },
  ],
  services: [
    "Dementia Care",
    "Parkinson's Disease Care",
    "Post-Surgical Recovery",
    "Respite Care",
    "Stroke Rehabilitation Support",
    "Long-term Live-in Care",
    "Companionship & Wellbeing",
    "Palliative Care",
    "Physical Disability Support",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "What is live-in care and how does it work in Gateshead?",
      answer:
        "Live-in care means a professional carer moves into your Gateshead home and provides around-the-clock support. They assist with daily tasks, personal care, medication, meals, and companionship — all at home.",
    },
    {
      question: "Which areas of Gateshead does Grace & Goodwill cover?",
      answer:
        "We cover the full Gateshead metropolitan borough including Low Fell, Whickham, Blaydon, Birtley, Felling, Pelaw, Winlaton, Rowlands Gill, and all surrounding areas.",
    },
    {
      question: "How much does live-in care cost in Gateshead?",
      answer:
        "Live-in care through Grace & Goodwill typically ranges from £900 to £1,400 per week in the Gateshead area, depending on the level and complexity of care required.",
    },
    {
      question: "Is live-in care suitable for someone with dementia in Gateshead?",
      answer:
        "Yes. Live-in care is particularly beneficial for people with dementia because it maintains the familiar home environment, existing routines, and one-to-one attention — all of which support better outcomes and quality of life.",
    },
    {
      question: "How do I arrange live-in care in Gateshead through Grace & Goodwill?",
      answer:
        "Simply call us on 020 4524 0108 or fill in our contact form. A care advisor will discuss your needs, answer your questions, and begin the matching process — with no obligation.",
    },
  ],
  nearbyAreas: [
    "Low Fell", "Whickham", "Blaydon", "Birtley", "Felling",
    "Pelaw", "Winlaton", "Rowlands Gill", "Chopwell", "High Spen",
    "Sheriff Hill", "Deckham", "Bensham",
  ],
};

export default function GatesheadPage() {
  return <LocationPageTemplate data={data} />;
}
