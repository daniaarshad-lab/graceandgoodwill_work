import type { BlogPost } from "@/types/blog.types";

/**
 * Seed articles for the Blog.
 *
 * On the server this array IS the database — it is what renders at build time
 * and what `generateStaticParams` and `sitemap.ts` read. In the browser the
 * mock service copies it into localStorage on first run so admin edits persist.
 *
 * TODO(backend): delete this file once `GET /blog/posts` exists.
 */

const AUTHOR_CLINICAL = {
  name: "Eleanor Whitfield",
  role: "Head of Care Standards",
};
const AUTHOR_PLACEMENT = {
  name: "Marcus Adeyemi",
  role: "Placement Lead",
};
const AUTHOR_COMMS = {
  name: "Grace & Goodwill",
  role: "Editorial Team",
};

export const blogSeedPosts: BlogPost[] = [
  {
    id: "post-choosing-live-in-carer",
    slug: "how-to-choose-the-right-live-in-carer",
    title: "How to Choose the Right Live-In Carer",
    excerpt:
      "Choosing someone to share your home is as much about temperament as it is about training. Here is how families can weigh both with confidence.",
    content: `<p>Choosing a live-in carer is rarely a decision made calmly. It usually arrives after a fall, a diagnosis, or a slow accumulation of small worries that finally becomes impossible to ignore. Families often tell us they felt they were choosing in a hurry, with incomplete information, at the worst possible moment.</p>
<p>It does not have to be that way. The families who look back on the decision with confidence tend to have asked the same handful of questions.</p>
<h2>Start with the day, not the diagnosis</h2>
<p>Care agencies naturally lead with credentials. Those matter, but they describe capability rather than fit. Before reviewing a single profile, write down what an ordinary Tuesday actually looks like: when your relative wakes, what they eat, what they enjoy, what unsettles them, and where they need a hand.</p>
<p>That single page will tell you more about the right match than any list of qualifications. A carer who is wonderful with early-stage dementia may not be the right person for someone whose principal need is companionship and confidence after a hip replacement.</p>
<h2>Verify the non-negotiables</h2>
<p>Some things should never be taken on trust. Before anyone moves in, confirm each of the following in writing:</p>
<ul>
<li>An enhanced DBS check, issued within the last twelve months</li>
<li>The right to work in the UK</li>
<li>At least two references that have actually been spoken to, not merely collected</li>
<li>Training relevant to your relative's specific needs</li>
<li>Insurance, and clarity on who holds it</li>
</ul>
<p>A reputable agency will offer this before you ask. If you find yourself chasing it, treat that as information about how the rest of the relationship will go.</p>
<h2>Meet more than once</h2>
<p>A first meeting shows you someone's best behaviour. A second shows you their manner. Wherever possible, arrange for the second conversation to happen in the home, doing something ordinary — making tea, looking at photographs, walking to the end of the road.</p>
<blockquote>The question is not "is this person qualified?" but "can I picture them here on a difficult afternoon in February?"</blockquote>
<h2>Agree what happens when it is not working</h2>
<p>Even good matches sometimes fail, and the arrangements that survive difficulty are the ones where everybody agreed in advance how difficulty would be handled. Ask directly: what is the notice period, who covers illness and annual leave, and who do I call at nine o'clock on a Sunday evening?</p>
<p>Knowing the answers in advance removes most of the fear from the decision. It is also, quietly, the clearest signal of whether an agency has thought properly about the families it serves.</p>`,
    featuredImageUrl: "/login_option1.jpg",
    featuredImageAlt:
      "A carer and an older woman sitting together at a kitchen table",
    categorySlug: "care-and-support",
    tags: ["live-in care", "choosing care", "family guidance"],
    status: "PUBLISHED",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 6,
    publishedAt: "2026-07-28T09:00:00.000Z",
    createdAt: "2026-07-24T11:12:00.000Z",
    updatedAt: "2026-07-28T09:00:00.000Z",
    seoTitle: "How to Choose the Right Live-In Carer",
    seoDescription:
      "A practical guide for families choosing a live-in carer: what to verify, what to ask, and how to judge fit as well as qualifications.",
    isFeatured: true,
  },
  {
    id: "post-conversation-with-parent",
    slug: "starting-the-care-conversation-with-a-parent",
    title: "Starting the Care Conversation With a Parent",
    excerpt:
      "The hardest part of arranging care is often the first conversation. A few small changes in how it is opened make a substantial difference.",
    content: `<p>Most families delay this conversation far longer than they intend to. It is not avoidance so much as a reasonable fear of causing hurt — of implying that someone is no longer capable in their own home.</p>
<h2>Choose the moment deliberately</h2>
<p>Raise it when nothing is wrong. A conversation that begins immediately after a fall reads as a verdict; the same conversation on an unremarkable afternoon reads as planning. Parents are far more willing to discuss support in the abstract than under the shadow of a recent crisis.</p>
<h2>Lead with what stays, not what changes</h2>
<p>The fear underneath most resistance is not about help. It is about losing authority in one's own house. Beginning with what will not change — the routine, the chair, the decisions that remain theirs — makes the rest of the conversation possible.</p>
<ul>
<li>"You would still do the shopping list, someone would just carry the bags."</li>
<li>"It would be your home, with your rules. Somebody else would just be there overnight."</li>
</ul>
<h2>Let it take several conversations</h2>
<p>Almost nobody agrees to live-in care the first time it is mentioned, and treating the first conversation as a negotiation to be won usually sets the whole process back. Raise it, let it sit, and return to it. Families who allow weeks rather than hours generally arrive at a better arrangement — and one their relative actually agreed to.</p>
<h2>Bring the practical detail early</h2>
<p>Vagueness invites worst-case imagination. Concrete answers about cost, about who the person would be, about what happens on holidays, tend to shrink the fear considerably. If you do not know the answers yet, say so, and go and find them together.</p>`,
    featuredImageUrl: "/login_option2.jpg",
    featuredImageAlt: "Two people talking together on a sofa in a bright room",
    categorySlug: "family-care",
    tags: ["family guidance", "difficult conversations"],
    status: "PUBLISHED",
    author: AUTHOR_PLACEMENT,
    readingTimeMinutes: 4,
    publishedAt: "2026-07-14T08:30:00.000Z",
    createdAt: "2026-07-11T15:44:00.000Z",
    updatedAt: "2026-07-14T08:30:00.000Z",
    seoDescription:
      "How to raise the subject of live-in care with a parent without causing distress — timing, framing and pacing that actually work.",
  },
  {
    id: "post-funding-live-in-care",
    slug: "understanding-the-cost-of-live-in-care",
    title: "Understanding the Cost of Live-In Care",
    excerpt:
      "Live-in care is often assumed to be the most expensive option. Compared honestly against residential care, the picture is more nuanced.",
    content: `<p>Families frequently rule out live-in care before pricing it, on the assumption that one-to-one support in the home must cost more than a room in a care home. For a single person the two are often closer than expected, and for couples live-in care is frequently the less expensive of the two.</p>
<h2>Compare like with like</h2>
<p>A residential fee is quoted per person. A live-in arrangement covers the household. Where two people both need support, one carer can frequently meet both sets of needs, and the comparison shifts sharply.</p>
<p>Be careful, too, about what each quoted figure includes. Residential fees often exclude chiropody, hairdressing, escorted appointments and personal laundry. Live-in quotes usually exclude the carer's food and the household's ordinary running costs.</p>
<h2>What sits outside the headline figure</h2>
<ul>
<li>Household bills continue in a live-in arrangement, and the property is retained</li>
<li>The carer requires their own room and reasonable break cover</li>
<li>Respite or holiday cover may be charged separately</li>
<li>Overnight waking care is priced differently from sleeping nights</li>
</ul>
<h2>Support you may be entitled to</h2>
<p>Attendance Allowance is not means-tested and is frequently unclaimed. NHS Continuing Healthcare may apply where needs are primarily clinical. A local authority needs assessment is free and worth requesting regardless of whether you expect to fund privately, because it establishes a documented record of need.</p>
<p>We would always suggest speaking to an independent financial adviser who specialises in later-life planning before committing to a long-term arrangement. It is a modest cost against a decision of this size.</p>`,
    featuredImageUrl: "/login_option3.png",
    featuredImageAlt:
      "Paperwork and a calculator on a table beside a cup of tea",
    categorySlug: "care-and-support",
    tags: ["funding", "costs", "planning"],
    status: "PUBLISHED",
    author: AUTHOR_PLACEMENT,
    readingTimeMinutes: 5,
    publishedAt: "2026-06-30T10:15:00.000Z",
    createdAt: "2026-06-26T09:05:00.000Z",
    updatedAt: "2026-07-02T14:20:00.000Z",
    seoDescription:
      "An honest comparison of live-in care and residential care costs, what sits outside the headline figure, and the funding support families miss.",
  },
  {
    id: "post-dementia-routine",
    slug: "building-a-routine-that-supports-memory",
    title: "Building a Routine That Supports Memory",
    excerpt:
      "For someone living with dementia, a predictable day does more good than almost any other intervention. Here is how to build one.",
    content: `<p>When memory becomes unreliable, routine does the remembering. A day that unfolds in the same order, in the same places, at roughly the same times, removes an enormous amount of daily effort — and with it, a great deal of anxiety.</p>
<h2>Anchor the day at three points</h2>
<p>Rather than scheduling every hour, fix three reliable anchors: waking and breakfast, the main meal, and the evening wind-down. Everything else can flex around them. Too rigid a timetable becomes a source of stress for everyone; too loose a one removes the benefit entirely.</p>
<h2>Keep the environment doing the work</h2>
<ul>
<li>Leave frequently used items visible rather than tidied away</li>
<li>A large-face clock showing day and date reduces repeated questioning</li>
<li>Consistent lighting levels help distinguish afternoon from evening</li>
<li>Contrasting colours on plates and handrails aid depth perception</li>
</ul>
<h2>Protect the late afternoon</h2>
<p>Increased confusion and restlessness in the late afternoon is common enough to have its own name. Plan the demanding parts of the day — appointments, visitors, bathing — for the morning, and keep the hours before dusk calm, well-lit and familiar.</p>
<blockquote>A good routine is not a schedule imposed on someone. It is the shape of their own life, protected.</blockquote>
<h2>Write it down for everyone</h2>
<p>Where several people share care, an agreed written routine prevents the small inconsistencies that accumulate into distress. It should live somewhere visible in the home, and it should be revised openly whenever it stops working.</p>`,
    featuredImageUrl: "/happy_senior_couple.png",
    featuredImageAlt: "An older couple sitting together in a sunlit room",
    categorySlug: "health-and-wellbeing",
    tags: ["dementia", "routine", "wellbeing"],
    status: "PUBLISHED",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 4,
    publishedAt: "2026-06-18T07:45:00.000Z",
    createdAt: "2026-06-15T12:30:00.000Z",
    updatedAt: "2026-06-18T07:45:00.000Z",
    seoDescription:
      "Practical guidance on building a daily routine that supports someone living with dementia, including environment and late-afternoon planning.",
  },
  {
    id: "post-carer-boundaries",
    slug: "setting-boundaries-as-a-live-in-carer",
    title: "Setting Boundaries as a Live-In Carer",
    excerpt:
      "Living where you work makes boundaries harder and more important. Practical guidance for carers on protecting their own time.",
    content: `<p>Live-in work collapses the distance between the job and the rest of life. There is no commute to mark the end of a shift, and the person you support is also, in a real sense, your host. Carers who sustain long careers in this work are almost always the ones who established clear boundaries early.</p>
<h2>Take your break away from the room</h2>
<p>A break taken in the same chair, within earshot, is not a break. Where the arrangement allows it, leave the house. A walk of even twenty minutes resets the day in a way that sitting quietly upstairs does not.</p>
<h2>Be explicit at the start, not after the problem</h2>
<p>Agreeing your hours, your break times and your private space in the first week is straightforward. Raising it in the sixth week, after a pattern has formed, is a difficult conversation. Put the arrangement in writing, and share it with the family as well as the client.</p>
<h2>Watch for the drift</h2>
<ul>
<li>Tasks that were never part of the agreed plan appearing gradually</li>
<li>Breaks that get shorter without being discussed</li>
<li>Being contacted during your time off for non-urgent matters</li>
<li>Family members treating you as the route to every decision</li>
</ul>
<p>None of these are dramatic on their own. Together, over months, they are the most common reason good carers leave placements they otherwise valued.</p>
<h2>Escalate early</h2>
<p>Raising a concern with your agency is not a complaint about the client, and it does not put a placement at risk. It is far easier to adjust an arrangement at the point of mild discomfort than at the point of exhaustion. If your agency treats early escalation as a problem, that tells you something important.</p>`,
    featuredImageUrl: "/sample.png",
    featuredImageAlt: "A carer taking a quiet moment with a cup of tea",
    categorySlug: "carer-advice",
    tags: ["carer wellbeing", "boundaries", "professional practice"],
    status: "PUBLISHED",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 4,
    publishedAt: "2026-06-04T09:20:00.000Z",
    createdAt: "2026-06-01T16:10:00.000Z",
    updatedAt: "2026-06-04T09:20:00.000Z",
    seoDescription:
      "How live-in carers can set and hold boundaries around hours, breaks and private space — and why raising concerns early protects placements.",
  },
  {
    id: "post-staying-independent",
    slug: "small-changes-that-keep-a-home-independent",
    title: "Small Changes That Keep a Home Independent",
    excerpt:
      "Independence is usually lost to a series of small obstacles rather than a single event. Most of them are inexpensive to remove.",
    content: `<p>When families first consider care, they often picture major adaptations — stairlifts, wet rooms, structural work. In practice, the things that most often erode independence are far smaller, and far cheaper to address.</p>
<h2>Start by watching an ordinary morning</h2>
<p>Spend one morning simply observing, without helping. The points where someone hesitates, steadies themselves, or gives up on a task are the ones worth addressing. They are rarely the ones a family would have guessed.</p>
<h2>The changes that repay themselves fastest</h2>
<ul>
<li>Raising the height of a favourite chair by 5cm, which often removes the need for help standing</li>
<li>Replacing twist taps with lever handles</li>
<li>Removing loose rugs and trailing flexes from the routes walked most often</li>
<li>Motion-activated lighting on the landing and in the hallway</li>
<li>A second bannister rail on the stairs</li>
<li>Moving daily-use crockery from high cupboards to worktop height</li>
</ul>
<h2>Request an occupational therapy assessment</h2>
<p>Local authorities provide these free of charge, and an occupational therapist will spot things a family cannot. Minor adaptations are frequently funded outright. The waiting list is worth joining early rather than at the point of crisis.</p>
<h2>Change one thing at a time</h2>
<p>A home reorganised all at once can become unfamiliar, which is counterproductive — particularly where memory is affected. Introduce changes singly, keep what works, and reverse what does not.</p>`,
    featuredImageUrl: "/login_option2.jpg",
    featuredImageAlt: "A bright, uncluttered hallway with a handrail",
    categorySlug: "living-well",
    tags: ["independence", "home adaptations", "safety"],
    status: "PUBLISHED",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 3,
    publishedAt: "2026-05-21T11:00:00.000Z",
    createdAt: "2026-05-18T10:00:00.000Z",
    updatedAt: "2026-05-21T11:00:00.000Z",
    seoDescription:
      "Low-cost changes that preserve independence at home, and how to get a free occupational therapy assessment.",
  },
  {
    id: "post-nutrition-later-life",
    slug: "eating-well-when-appetite-fades",
    title: "Eating Well When Appetite Fades",
    excerpt:
      "Reduced appetite in later life is common and frequently misread. What helps is usually presentation and timing rather than portion size.",
    content: `<p>A shrinking appetite worries families more than almost any other change, and the instinctive response — serving more, encouraging harder — tends to make matters worse. Larger plates are more often abandoned than finished.</p>
<h2>Why appetite changes</h2>
<p>Taste and smell both diminish with age, medications frequently suppress hunger, and reduced activity lowers energy requirements genuinely. Dental discomfort and difficulty swallowing are also common and easily missed, because people rarely volunteer them.</p>
<h2>What tends to help</h2>
<ul>
<li>Smaller plates with smaller portions, offered more often</li>
<li>Stronger flavours and more contrast, since blandness registers as nothing at all</li>
<li>Fortifying food rather than increasing it — full-fat milk, cream in soup, cheese, nut butters</li>
<li>Eating together, which reliably increases intake more than any encouragement does</li>
<li>Making the largest meal the one at the time of day when appetite is strongest, which is often the morning</li>
</ul>
<h2>When to seek advice</h2>
<p>Unintended weight loss, coughing during meals, or a sustained refusal of food should be raised with a GP promptly rather than monitored at home. These are clinical signs, not preferences, and there are effective interventions for all three.</p>`,
    featuredImageUrl: "/login_option1.jpg",
    featuredImageAlt: "A simple, colourful meal laid out on a small plate",
    categorySlug: "health-and-wellbeing",
    tags: ["nutrition", "wellbeing", "practical care"],
    status: "PUBLISHED",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 3,
    publishedAt: "2026-05-07T08:00:00.000Z",
    createdAt: "2026-05-04T13:25:00.000Z",
    updatedAt: "2026-05-07T08:00:00.000Z",
    seoDescription:
      "Why appetite fades in later life and the practical changes — fortifying, timing, company — that help more than larger portions.",
  },
  {
    id: "post-companionship",
    slug: "why-companionship-is-not-an-optional-extra",
    title: "Why Companionship Is Not an Optional Extra",
    excerpt:
      "Loneliness carries a measurable health cost. In live-in care, companionship is not a courtesy added to the work — it is much of the work.",
    content: `<p>Care plans are written in tasks: personal care, medication prompts, meal preparation, mobility support. Companionship rarely appears, because it is difficult to specify and impossible to time. Yet ask any family a year into an arrangement what has changed most, and it is almost never the tasks they mention.</p>
<h2>The health case</h2>
<p>Sustained loneliness is associated with elevated risks across cardiovascular health, cognitive decline and depression. It also reliably reduces appetite and activity, which compounds into physical decline. Treating companionship as a pleasant extra misunderstands what it does.</p>
<h2>What good companionship actually looks like</h2>
<p>It is not constant conversation, and it is certainly not entertainment. Mostly it is shared ordinary activity — preparing a meal together rather than serving one, going to the shop rather than fetching from it, sitting in the same room with the radio on.</p>
<blockquote>The aim is a household with two people living in it, not one person being attended to by another.</blockquote>
<h2>Protecting the outside world</h2>
<p>A live-in carer should widen someone's world rather than replace it. Maintaining existing friendships, clubs, services and family visits matters more than anything happening inside the house, and it is a reasonable thing for families to ask about explicitly when arranging care.</p>`,
    featuredImageUrl: "/happy_senior_couple.png",
    featuredImageAlt: "Two people laughing together over a shared activity",
    categorySlug: "living-well",
    tags: ["companionship", "loneliness", "wellbeing"],
    status: "PUBLISHED",
    author: AUTHOR_COMMS,
    readingTimeMinutes: 3,
    publishedAt: "2026-04-23T09:30:00.000Z",
    createdAt: "2026-04-20T14:00:00.000Z",
    updatedAt: "2026-04-23T09:30:00.000Z",
    seoDescription:
      "Loneliness carries a measurable health cost. What genuine companionship looks like in a live-in care arrangement, and how to protect it.",
  },
  {
    id: "post-carer-development",
    slug: "building-a-career-in-live-in-care",
    title: "Building a Career in Live-In Care",
    excerpt:
      "Live-in care is too often treated as temporary work. For carers who approach it as a profession, the progression is real.",
    content: `<p>Many people arrive in live-in care sideways — through a family situation, a career change, or a period between other work. A significant number then stay for decades, and the ones who build genuine careers tend to be deliberate about it from early on.</p>
<h2>Specialise rather than generalise</h2>
<p>Broad availability feels like an advantage and rarely is. Carers with recognised depth in a particular area — dementia, Parkinson's, stroke recovery, end-of-life care — are requested by name, placed faster, and paid accordingly.</p>
<h2>Keep a proper record</h2>
<ul>
<li>Every certificate, with dates, in one place</li>
<li>A short written summary of each placement and what it involved</li>
<li>References collected at the end of a placement, not years later</li>
<li>A note of any specialist equipment or clinical tasks you are competent in</li>
</ul>
<p>This sounds administrative, and it is. It is also the single clearest difference between carers whose experience is visible and carers whose experience has to be taken on trust.</p>
<h2>Treat supervision as development</h2>
<p>Regular supervision is often experienced as a check on performance. Used properly it is the most reliable route to better placements: it is where you raise what you would like to learn, where gaps get identified, and where training gets agreed.</p>`,
    featuredImageUrl: "/sample.png",
    featuredImageAlt: "A carer reviewing training notes at a desk",
    categorySlug: "carer-advice",
    tags: ["career", "training", "professional practice"],
    status: "PUBLISHED",
    author: AUTHOR_PLACEMENT,
    readingTimeMinutes: 3,
    publishedAt: "2026-04-09T10:45:00.000Z",
    createdAt: "2026-04-06T09:15:00.000Z",
    updatedAt: "2026-04-09T10:45:00.000Z",
    seoDescription:
      "How live-in carers build long careers: specialising, keeping a professional record, and using supervision for development.",
  },
  {
    id: "post-gg-standards-update",
    slug: "our-carer-verification-standards-explained",
    title: "Our Carer Verification Standards, Explained",
    excerpt:
      "Every carer introduced by Grace & Goodwill passes the same checks. Here is exactly what those are, and why we publish them.",
    content: `<p>Families are asked to take a great deal on trust when they arrange care. We think the least an introductory agency can do is set out plainly what it checks, so that the standard can be held to.</p>
<h2>What every carer must evidence</h2>
<ul>
<li>An enhanced DBS certificate, verified directly rather than accepted as a copy</li>
<li>Documented right to work in the UK</li>
<li>Two references, both taken up by telephone and recorded</li>
<li>A full employment history with any gaps accounted for</li>
<li>Current training appropriate to the placements they are put forward for</li>
<li>An interview with a member of our care standards team</li>
</ul>
<h2>What we re-check, and when</h2>
<p>Verification is not a one-off. DBS certificates are reviewed annually, training currency is checked before each new placement, and we hold a documented review after the first month of every arrangement.</p>
<h2>What we are not</h2>
<p>Grace &amp; Goodwill is an introductory agency. We introduce independent carers to families; we do not employ them, and we do not provide regulated care services. That distinction matters, and we would rather state it clearly than let it be assumed either way. It shapes who holds the contract, who directs the work, and who is responsible for what.</p>
<p>If anything set out here is ever not true of a carer we have introduced to you, we would like to hear about it directly.</p>`,
    featuredImageUrl: "/website_logo.jpeg",
    featuredImageAlt: "The Grace & Goodwill brand mark",
    categorySlug: "grace-and-goodwill-news",
    tags: ["standards", "verification", "transparency"],
    status: "PUBLISHED",
    author: AUTHOR_COMMS,
    readingTimeMinutes: 3,
    publishedAt: "2026-03-26T08:15:00.000Z",
    createdAt: "2026-03-23T11:40:00.000Z",
    updatedAt: "2026-03-26T08:15:00.000Z",
    seoDescription:
      "The checks every Grace & Goodwill carer must pass, how often they are repeated, and what an introductory agency is and is not.",
  },
  {
    id: "post-respite-draft",
    slug: "planning-respite-without-guilt",
    title: "Planning Respite Without Guilt",
    excerpt:
      "Family carers postpone respite until they cannot continue. Planning it in advance produces better outcomes for everyone involved.",
    content: `<p>Almost every family carer we speak to has postponed a break. The reasons are consistent: it feels like abandonment, the arrangements seem complicated, and there is a sense that nobody else will do it properly.</p>
<h2>Book it before you need it</h2>
<p>Respite arranged in advance is calm and chosen. Respite arranged during a crisis is whatever happens to be available. The difference in quality is considerable, and so is the difference in cost.</p>
<h2>Introduce the replacement carer early</h2>
<p>A short overlap — even a single afternoon — transforms how a respite placement begins. It allows the routine to be handed over in person rather than on paper, and it lets everyone meet under no pressure.</p>
<p>This article is still being drafted and is not yet ready to publish.</p>`,
    featuredImageUrl: "/login_option3.png",
    featuredImageAlt: "An empty armchair beside a window",
    categorySlug: "family-care",
    tags: ["respite", "family carers", "planning"],
    status: "DRAFT",
    author: AUTHOR_PLACEMENT,
    readingTimeMinutes: 2,
    publishedAt: null,
    createdAt: "2026-08-05T09:00:00.000Z",
    updatedAt: "2026-08-09T16:30:00.000Z",
  },
  {
    id: "post-winter-draft",
    slug: "preparing-a-home-for-winter",
    title: "Preparing a Home for Winter",
    excerpt:
      "Cold weather raises risk considerably for older people living alone. A short seasonal checklist covers most of it.",
    content: `<p>Winter reliably produces the sharpest rise in falls, admissions and illness among older people living at home. Most of the contributing factors are known well in advance, which makes them unusually preventable.</p>
<h2>Heating and warmth</h2>
<p>The main living room should reach 21°C, and the rest of the home at least 18°C. Service the boiler before the cold arrives rather than during it, and check that the thermostat is one the household can actually operate.</p>
<p>Draft in progress — checklist and funding links still to be added.</p>`,
    featuredImageUrl: "/login_option1.jpg",
    featuredImageAlt: "A warm living room with the curtains drawn",
    categorySlug: "health-and-wellbeing",
    tags: ["winter", "safety", "seasonal"],
    status: "DRAFT",
    author: AUTHOR_CLINICAL,
    readingTimeMinutes: 2,
    publishedAt: null,
    createdAt: "2026-08-11T14:20:00.000Z",
    updatedAt: "2026-08-12T10:05:00.000Z",
  },
];
