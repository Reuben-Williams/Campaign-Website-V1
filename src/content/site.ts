export type CampaignImage = {
  src: string;
  alt: string;
  focus?: string;
};

export type CampaignPage = {
  slug: string;
  href: string;
  navLabel: string;
  title: string;
  eyebrow?: string;
  summary: string;
  ctaLabel?: string;
  ctaHref?: string;
  images: CampaignImage[];
  sections: Array<{
    title: string;
    body: string;
    kicker?: string;
  }>;
};

export const siteConfig = {
  candidateName: "Carmen Morales",
  campaignName: "Morales for Assembly",
  office: "New Jersey General Assembly",
  district: "Legislative District 34",
  year: "2026",
  email: "info@moralesforassembly.com",
  phone: "(973) 555-0134",
  donationUrl: "/donate",
  volunteerUrl: "/volunteer",
  footerLegal:
    "Paid for by Morales for Assembly. Prepared for campaign website review.",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Issues", href: "/issues" },
  { label: "Events", href: "/events" },
  { label: "Endorsements", href: "/endorsements" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donate" },
];

export const pages: CampaignPage[] = [
  {
    slug: "home",
    href: "/",
    navLabel: "Home",
    title: "Leadership rooted in community. Results built for the future.",
    eyebrow: "Morales for Assembly",
    summary:
      "Carmen Morales is bringing steady public-service leadership, local accountability, and practical problem solving to the campaign for New Jersey's Legislative District 34.",
    ctaLabel: "Join the Campaign",
    ctaHref: "/volunteer",
    images: [
      {
        src: "/images/campaign/carmen-statehouse-leaders.jpg",
        alt: "Carmen Morales standing with state leaders in an official State House setting.",
        focus: "50% 30%",
      },
      {
        src: "/images/campaign/student-champions-assembly.jpg",
        alt: "Students and community leaders recognized inside the Assembly chamber.",
        focus: "50% 42%",
      },
      {
        src: "/images/campaign/community-table-outreach.jpg",
        alt: "Campaign supporters greeting neighbors at an outdoor community table.",
        focus: "50% 32%",
      },
    ],
    sections: [
      {
        kicker: "Public Service",
        title: "A campaign centered on listening first.",
        body:
          "From school communities to small businesses, Carmen's work starts with hearing directly from the people who live with the consequences of every policy decision.",
      },
      {
        kicker: "Momentum",
        title: "A modern campaign presence for a serious local race.",
        body:
          "This site keeps the design polished and editorial while leaving room for the final domain, donation platform, voter tools, and campaign operations.",
      },
    ],
  },
  {
    slug: "about",
    href: "/about",
    navLabel: "About",
    title: "Meet Carmen Morales.",
    summary:
      "Carmen is running to make government more responsive, more transparent, and more connected to families across the district.",
    ctaLabel: "Read the Priorities",
    ctaHref: "/issues",
    images: [
      {
        src: "/images/campaign/carmen-statehouse-leaders.jpg",
        alt: "Carmen Morales meeting with state leaders in a formal office.",
        focus: "50% 30%",
      },
      {
        src: "/images/campaign/carmen-with-community-leaders.jpg",
        alt: "Carmen Morales standing with community leaders at a local gathering.",
        focus: "50% 26%",
      },
      {
        src: "/images/campaign/carmen-family-community.jpg",
        alt: "Carmen Morales kneeling beside a child during a community event.",
        focus: "66% 34%",
      },
    ],
    sections: [
      {
        kicker: "Her Story",
        title: "A public servant shaped by real conversations.",
        body:
          "Carmen's campaign reflects the neighborhoods, parents, students, workers, and civic leaders who want government to focus on everyday quality of life.",
      },
      {
        kicker: "Why She Is Running",
        title: "Trust is earned face to face.",
        body:
          "The campaign is built around showing up consistently, communicating clearly, and turning local priorities into a practical legislative agenda.",
      },
    ],
  },
  {
    slug: "issues",
    href: "/issues",
    navLabel: "Issues",
    title: "A practical agenda for stronger communities.",
    summary:
      "The Morales platform focuses on public education, affordability, safe neighborhoods, accessible healthcare, and local economic opportunity.",
    ctaLabel: "Get Involved",
    ctaHref: "/volunteer",
    images: [
      {
        src: "/images/campaign/education-graduation-continued.jpg",
        alt: "A graduate facing a full stadium with a decorated cap about continuing forward.",
        focus: "50% 24%",
      },
      {
        src: "/images/campaign/roundtable-listening-session.jpg",
        alt: "Residents and organizers gathered for a roundtable listening session.",
        focus: "50% 36%",
      },
      {
        src: "/images/campaign/bloomfield-community-visit.jpg",
        alt: "Carmen Morales visiting with Bloomfield community members outdoors.",
        focus: "50% 34%",
      },
    ],
    sections: [
      {
        kicker: "Education",
        title: "Invest in students, educators, and safe learning environments.",
        body:
          "Every child deserves strong schools, modern supports, and pathways that prepare them for college, careers, and civic life.",
      },
      {
        kicker: "Affordability",
        title: "Make New Jersey more livable for working families.",
        body:
          "Carmen supports responsible budgeting, housing stability, and relief that helps families stay rooted in the communities they love.",
      },
      {
        kicker: "Public Safety",
        title: "Strengthen trust, prevention, and neighborhood partnerships.",
        body:
          "Safer communities come from coordinated services, accountable leadership, and consistent investment in the people closest to the work.",
      },
    ],
  },
  {
    slug: "events",
    href: "/events",
    navLabel: "Events",
    title: "Meet the campaign on the trail.",
    summary:
      "Town halls, community conversations, volunteer briefings, and neighborhood stops keep the campaign close to the people it serves.",
    ctaLabel: "Volunteer for an Event",
    ctaHref: "/volunteer",
    images: [
      {
        src: "/images/campaign/coffee-shop-event.jpg",
        alt: "Community members gathered inside a coffee shop for a campaign event.",
        focus: "50% 38%",
      },
      {
        src: "/images/campaign/podium-events-venue.jpg",
        alt: "A campaign event podium set up inside an event venue.",
        focus: "50% 34%",
      },
      {
        src: "/images/campaign/campaign-office-briefing.jpg",
        alt: "Campaign supporters attending a briefing inside a campaign office.",
        focus: "50% 34%",
      },
    ],
    sections: [
      {
        kicker: "Upcoming",
        title: "Community listening sessions.",
        body:
          "The campaign calendar is ready for upcoming voter-registration events, canvass launches, meet-and-greets, and district town halls.",
      },
      {
        kicker: "Host",
        title: "Bring Carmen to your neighborhood.",
        body:
          "Supporters can host small conversations, invite neighbors, and help the campaign hear from people who are not always in the room.",
      },
    ],
  },
  {
    slug: "endorsements",
    href: "/endorsements",
    navLabel: "Endorsements",
    title: "A growing coalition for accountable leadership.",
    summary:
      "Community leaders, organizers, and neighbors are joining the campaign because they trust Carmen to do the work and stay accessible.",
    ctaLabel: "Endorse Carmen",
    ctaHref: "/contact",
    images: [
      {
        src: "/images/campaign/local-endorsement-team.jpg",
        alt: "Local supporters standing together with campaign signs.",
        focus: "50% 34%",
      },
      {
        src: "/images/campaign/community-supporters-venue.jpg",
        alt: "Community supporters gathered together at a local venue.",
        focus: "50% 34%",
      },
      {
        src: "/images/campaign/carmen-statehouse-leaders.jpg",
        alt: "Carmen Morales standing with state leaders in an official setting.",
        focus: "50% 30%",
      },
    ],
    sections: [
      {
        kicker: "Leaders",
        title: "Support from people who know the district.",
        body:
          "This section is structured to grow into a full endorsement hub with public officials, labor, civic groups, and community voices.",
      },
      {
        kicker: "Organizations",
        title: "Built for future endorsement updates.",
        body:
          "When official endorsement language is ready, the content can move from static cards into structured campaign entries without redesigning the page.",
      },
    ],
  },
  {
    slug: "news",
    href: "/news",
    navLabel: "News",
    title: "Campaign updates and community notes.",
    summary:
      "Follow the latest announcements, field updates, endorsements, and photos from the Morales for Assembly campaign.",
    ctaLabel: "Contact the Campaign",
    ctaHref: "/contact",
    images: [
      {
        src: "/images/campaign/student-champions-assembly.jpg",
        alt: "Student champions and public officials photographed in the Assembly chamber.",
        focus: "50% 42%",
      },
      {
        src: "/images/campaign/community-table-outreach.jpg",
        alt: "Campaign outreach table set up during a neighborhood event.",
        focus: "50% 32%",
      },
      {
        src: "/images/campaign/roundtable-listening-session.jpg",
        alt: "A listening session with residents around a table.",
        focus: "50% 36%",
      },
    ],
    sections: [
      {
        kicker: "Field Notes",
        title: "Listening across the district.",
        body:
          "Campaign updates can highlight voter conversations, issue priorities, event recaps, and behind-the-scenes field momentum.",
      },
      {
        kicker: "Press",
        title: "A ready space for statements and media releases.",
        body:
          "The page is prepared for future campaign news posts and media contact information once the final content calendar is approved.",
      },
    ],
  },
  {
    slug: "contact",
    href: "/contact",
    navLabel: "Contact",
    title: "Get in touch with the campaign.",
    summary:
      "Reach the Morales team with questions, event invitations, press inquiries, volunteer interest, and local concerns.",
    ctaLabel: "Volunteer Today",
    ctaHref: "/volunteer",
    images: [
      {
        src: "/images/campaign/carmen-neighborhood-conversation.jpg",
        alt: "Carmen Morales speaking with neighbors during a community conversation.",
        focus: "50% 30%",
      },
      {
        src: "/images/campaign/carmen-family-community.jpg",
        alt: "Carmen Morales connecting with a family at a community event.",
        focus: "66% 34%",
      },
    ],
    sections: [
      {
        kicker: "Campaign Office",
        title: "A direct line for community questions.",
        body:
          "The contact form is ready for a future database table or email workflow. It presents the final layout without collecting submissions.",
      },
      {
        kicker: "Press",
        title: "Media and event requests.",
        body:
          "Campaign staff can use this area for press contacts, event coordination, and stakeholder outreach once official details are confirmed.",
      },
    ],
  },
  {
    slug: "volunteer",
    href: "/volunteer",
    navLabel: "Volunteer",
    title: "Step forward. Volunteer today.",
    summary:
      "Every conversation matters. Join the field team, help with events, share campaign updates, or host a neighborhood conversation.",
    ctaLabel: "Contact the Team",
    ctaHref: "/contact",
    images: [
      {
        src: "/images/campaign/volunteer-team-morales.jpg",
        alt: "A Morales campaign volunteer recruitment graphic with team photos.",
        focus: "50% 50%",
      },
      {
        src: "/images/campaign/campaign-office-briefing.jpg",
        alt: "Volunteers and organizers gathered for a campaign briefing.",
        focus: "50% 34%",
      },
      {
        src: "/images/campaign/community-table-outreach.jpg",
        alt: "Volunteers speaking with neighbors at a community outreach table.",
        focus: "50% 32%",
      },
    ],
    sections: [
      {
        kicker: "Field",
        title: "Canvass, call, text, and welcome voters.",
        body:
          "The volunteer page is ready to connect with a future signup flow after the campaign chooses its data process.",
      },
      {
        kicker: "Community",
        title: "Host a conversation or bring friends to an event.",
        body:
          "Supporters can help the campaign grow by making introductions, sharing local concerns, and bringing new voices into the work.",
      },
    ],
  },
  {
    slug: "donate",
    href: "/donate",
    navLabel: "Donate",
    title: "Invest in a stronger district.",
    summary:
      "Contributions help the campaign reach voters, organize volunteers, print materials, and keep the message visible across the district.",
    ctaLabel: "Volunteer Instead",
    ctaHref: "/volunteer",
    images: [
      {
        src: "/images/campaign/carmen-officials-chamber.jpg",
        alt: "Carmen Morales with public officials inside a formal chamber.",
        focus: "50% 24%",
      },
      {
        src: "/images/campaign/local-endorsement-team.jpg",
        alt: "Supporters gathered with campaign signs at a local endorsement event.",
        focus: "50% 34%",
      },
    ],
    sections: [
      {
        kicker: "Contribute",
        title: "Fuel voter contact and campaign visibility.",
        body:
          "This page includes the donation layout. The final contribution link can be connected when the campaign selects its compliance-approved payment platform.",
      },
      {
        kicker: "Compliance",
        title: "Prepared for final legal language.",
        body:
          "The footer and contribution content are intentionally easy to update once the campaign treasurer confirms the required disclaimer text.",
      },
    ],
  },
];

export function getPageBySlug(slug: string) {
  return pages.find((page) => page.slug === slug);
}
