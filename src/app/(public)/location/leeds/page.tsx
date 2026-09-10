import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

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

const data = {
  city: "Leeds",
  region: "Yorkshire",
  slug: "leeds",
  headline: "Live-in Care in Leeds",
  intro: [
    "Leeds is one of the UK's fastest-growing cities, with a large and diverse population of older adults and their families. When care is needed, keeping a loved one at home — in their own familiar environment — offers the comfort, dignity and independence that matters most. Grace & Goodwill provides live-in care across Leeds and the surrounding West Yorkshire area.",
    "Our carers bring specialist expertise across conditions including dementia, Parkinson's, stroke recovery, and complex care needs. From Chapel Allerton to Headingley and Moortown to Garforth, we carefully match each client with a carer who understands their situation and personality.",
  ],
  stats: [
    { label: "West Yorkshire Coverage", value: "Full", sub: "Leeds city & surrounds" },
    { label: "Care Specialisms", value: "12+", sub: "Specialist & general care" },
    { label: "Carer Placement Speed", value: "48h", sub: "Fast, expert introductions" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Support",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Companionship Care",
    "Young Adult Care",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "How does live-in care work in Leeds?",
      answer:
        "A vetted, independent carer moves into your home in Leeds and provides round-the-clock support. Services include personal care, medication management, meal preparation, light household tasks, and meaningful companionship.",
    },
    {
      question: "Which areas of Leeds do you cover?",
      answer:
        "We cover all areas of Leeds including Leeds city centre, Chapel Allerton, Headingley, Roundhay, Moortown, Garforth, Horsforth, Guiseley, Morley, Rothwell, and surrounding West Yorkshire communities.",
    },
    {
      question: "How much does live-in care cost in Leeds?",
      answer:
        "Live-in care in Leeds typically costs between £900 and £1,350 per week, depending on the complexity of care required. This provides dedicated, one-to-one support and is often comparable to residential care home fees.",
    },
    {
      question: "Can I get a live-in carer in Leeds quickly in an emergency?",
      answer:
        "Yes. We can often arrange emergency live-in care in Leeds within 24 hours. Please call our team on 020 4524 0108 and we will prioritise your request.",
    },
    {
      question: "Are there carers in Leeds who specialise in dementia care?",
      answer:
        "Yes. We have a number of carers based in and around Leeds with specialist dementia and Alzheimer's experience. Live-in care is particularly well-suited to dementia, as it preserves familiar routines and surroundings.",
    },
  ],
  nearbyAreas: [
    "Chapel Allerton", "Headingley", "Roundhay", "Moortown", "Garforth",
    "Horsforth", "Guiseley", "Morley", "Rothwell", "Pudsey",
    "Wetherby", "Otley", "Bramhope", "Yeadon", "Boston Spa",
  ],
};

export default function LeedsPage() {
  return <LocationPageTemplate data={data} />;
}
