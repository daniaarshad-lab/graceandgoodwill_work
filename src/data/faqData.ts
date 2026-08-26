export interface FAQItem {
  question: string;
  answer: string;
  category: "Finding and Choosing a Carer" | "Urgent and Short-Notice Care" | "Conditions and Circumstances" | "Costs and Funding" | "How Grace & Goodwill Works";
}

export const faqs: FAQItem[] = [
  // Finding and Choosing a Carer
  {
    category: "Finding and Choosing a Carer",
    question: "Can I choose my own live-in carer?",
    answer: "Yes. Grace & Goodwill gives you complete choice and control over who supports you. You can browse available carer profiles, view their introduction videos, explore their experience and interests, and decide who you would like to speak with before making a decision."
  },
  {
    category: "Finding and Choosing a Carer",
    question: "Can I see which carers are available?",
    answer: "Yes. Each carer profile includes information about their availability, helping you find someone whose schedule matches the dates or ongoing support you require."
  },
  {
    category: "Finding and Choosing a Carer",
    question: "Does Grace & Goodwill operate across the UK?",
    answer: "Yes. Grace & Goodwill is a nationwide platform introducing families to independent live-in carers right across the UK."
  },
  {
    category: "Finding and Choosing a Carer",
    question: "What types of live-in care can I search for?",
    answer: "You can search profiles for carers with experience in long-term support, urgent care, hospital discharge, stroke and neurological support, convalescence, dementia and Alzheimer’s care, temporary respite, brain injury support, spinal injury support, multiple sclerosis, young adult and disability support, and companionship."
  },

  // Urgent and Short-Notice Care
  {
    category: "Urgent and Short-Notice Care",
    question: "Can I arrange a live-in carer within 24 hours?",
    answer: "Yes. Our platform includes carers who are immediately available. If you need support following a hospital discharge, stroke, unexpected illness, or emergency respite, you can search for available carers or request our urgent matching support to help find suitable profiles quickly."
  },
  {
    category: "Urgent and Short-Notice Care",
    question: "Can Grace & Goodwill help with hospital discharge?",
    answer: "Yes. We regularly introduce families to carers who can provide support when someone is returning home from hospital. This can help facilitate a faster discharge and ensure practical support is in place while recovering."
  },
  {
    category: "Urgent and Short-Notice Care",
    question: "Can I arrange temporary respite care?",
    answer: "Yes. Live-in care does not always need to be long term. Respite arrangements can range from short stays of as little as 2 days to cover a family holiday, weekend away, or emergency situation, through to longer temporary placements."
  },
  {
    category: "Urgent and Short-Notice Care",
    question: "Can I arrange temporary live-in care?",
    answer: "Yes. Respite and short-term placements can be arranged from as little as 2 days to support families needing a break, covering unexpected emergencies, or providing temporary assistance."
  },

  // Conditions and Circumstances
  {
    category: "Conditions and Circumstances",
    question: "What is live-in care?",
    answer: "Live-in care allows someone to receive support while continuing to live in their own home. The live-in carer stays in the home for the agreed placement and provides the support agreed directly with the client, helping them maintain their routines and independence in familiar surroundings."
  },
  {
    category: "Conditions and Circumstances",
    question: "Can I find a live-in carer after a stroke?",
    answer: "Yes. You can search for live-in carers who have experience supporting people during their recovery and rehabilitation following a stroke."
  },
  {
    category: "Conditions and Circumstances",
    question: "Can I search for someone with experience relevant to a particular condition?",
    answer: "Yes. Our matching platform allows you to review carer profiles to see their specific experience, including dementia, Alzheimer’s, Parkinson’s, stroke recovery, brain injury, spinal injury, and other physical or neurological conditions."
  },
  {
    category: "Conditions and Circumstances",
    question: "Can live-in support help someone returning from hospital?",
    answer: "Yes. Live-in carers can provide essential support following hospital discharge, helping with mobility, meal preparation, personal care, and maintaining safety during convalescence at home."
  },
  {
    category: "Conditions and Circumstances",
    question: "Can I find support following a stroke?",
    answer: "Yes. You can search for carers with experience in stroke recovery who can provide practical assistance, mobility support, and encouragement alongside any external rehabilitation programs."
  },
  {
    category: "Conditions and Circumstances",
    question: "Can younger adults use live-in care?",
    answer: "Yes. Live-in care is not just for older adults. Grace & Goodwill helps young adults living with physical disabilities and long-term support needs find carers who can assist with everyday life while respecting their independence and routines."
  },
  {
    category: "Conditions and Circumstances",
    question: "Does Grace & Goodwill provide clinical rehabilitation?",
    answer: "No. Grace & Goodwill introduces independent carers who provide practical assistance, personal care, and companionship. While they can support and encourage a client’s recovery at home, clinical rehabilitation such as physiotherapy must be arranged separately with qualified medical professionals."
  },

  // Costs and Funding
  {
    category: "Costs and Funding",
    question: "How much does live-in care cost?",
    answer: "Costs vary depending on the individual carer’s rates and the level of support required. Because you agree arrangements directly with the independent carer, this can often be more cost-effective than traditional agency managed services or residential care."
  },
  {
    category: "Costs and Funding",
    question: "Can I get help paying for live-in care?",
    answer: "You may be eligible for financial support toward care costs depending on your needs and circumstances. This could include NHS Continuing Healthcare, Local Authority Funding, or Attendance Allowance."
  },

  // How Grace & Goodwill Works
  {
    category: "How Grace & Goodwill Works",
    question: "Can Grace & Goodwill help me find suitable profiles?",
    answer: "Yes. While you can browse profiles independently, our team is also available to help identify potentially suitable available profiles based on the specific information, preferences, and care requirements you provide. You remain in complete control of who you choose."
  }
];
