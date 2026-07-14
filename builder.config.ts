type BuilderRegionKind = "text" | "richText" | "image" | "link" | "sections";

type BuilderRegion = {
  id: string;
  kind: BuilderRegionKind;
  label?: string;
  required?: boolean;
};

function defineBuilderSite<const TConfig>(config: TConfig) {
  return config;
}

const siteChromeRegions: BuilderRegion[] = [
  { id: "site.header.brandText", kind: "text", label: "Header brand text" },
  { id: "site.header.volunteerCta", kind: "link", label: "Header volunteer button" },
  { id: "site.header.donateCta", kind: "link", label: "Header donate button" },
  { id: "site.footer.brandText", kind: "text", label: "Footer brand text" },
  { id: "site.footer.legal", kind: "text", label: "Footer legal copy" },
  ...["home", "about", "issues", "events", "news", "contact", "endorsements", "volunteer", "donate"].flatMap(
    (label) => [
      { id: `site.footer.nav.${label}`, kind: "link" as const, label: `Footer ${label} link` },
      ...(label === "endorsements" || label === "volunteer" || label === "donate"
        ? []
        : [{ id: `site.header.nav.${label}`, kind: "link" as const, label: `Header ${label} link` }]),
    ],
  ),
];

const heroRegions = (slug: string): BuilderRegion[] => [
  { id: `${slug}.hero.kicker`, kind: "text", label: "Hero kicker" },
  { id: `${slug}.hero.title`, kind: "text", label: "Hero title", required: true },
  { id: `${slug}.hero.summary`, kind: "text", label: "Hero summary" },
  { id: `${slug}.hero.image`, kind: "image", label: "Hero image" },
  { id: `${slug}.hero.primaryCta`, kind: "link", label: "Hero primary button" },
];

export default defineBuilderSite({
  siteId: "campaign-website-v1",
  adapter: "supabase",
  editor: { path: "/admin/editor", protected: true },
  pages: [
    {
      path: "/",
      label: "Home",
      regions: [
        ...siteChromeRegions,
        ...heroRegions("home"),
        { id: "home.hero.donateCta", kind: "link", label: "Hero donate button" },
        { id: "home.hero.volunteerCta", kind: "link", label: "Hero volunteer button" },
        { id: "home.mission.kicker", kind: "text", label: "Mission kicker" },
        { id: "home.mission.title", kind: "text", label: "Mission title" },
        { id: "home.mission.summary", kind: "text", label: "Mission summary" },
        { id: "home.mission.leaderImage", kind: "image", label: "Leader card image" },
        { id: "home.mission.leaderTitle", kind: "text", label: "Leader card title" },
        { id: "home.mission.leaderSummary", kind: "text", label: "Leader card summary" },
        { id: "home.mission.leaderLink", kind: "link", label: "Leader card link" },
        { id: "home.issues.kicker", kind: "text", label: "Issues kicker" },
        { id: "home.issues.title", kind: "text", label: "Issues title" },
        { id: "home.issues.viewAllLink", kind: "link", label: "View all issues link" },
        { id: "home.issues.featuredImage", kind: "image", label: "Featured issue image" },
        { id: "home.issues.featuredKicker", kind: "text", label: "Featured issue kicker" },
        { id: "home.issues.featuredTitle", kind: "text", label: "Featured issue title" },
        { id: "home.issues.featuredSummary", kind: "text", label: "Featured issue summary" },
        ...["integrity", "economy"].flatMap((key) => [
          { id: `home.mission.${key}.title`, kind: "text" as const },
          { id: `home.mission.${key}.summary`, kind: "text" as const },
        ]),
        ...["accessibleCare", "tomorrow"].flatMap((key) => [
          { id: `home.issues.${key}.image`, kind: "image" as const },
          { id: `home.issues.${key}.kicker`, kind: "text" as const },
          { id: `home.issues.${key}.title`, kind: "text" as const },
          { id: `home.issues.${key}.summary`, kind: "text" as const },
        ]),
        { id: "home.signup.title", kind: "text", label: "Signup title" },
        { id: "home.signup.body", kind: "text", label: "Signup body" },
        { id: "home.signup.button", kind: "link", label: "Signup button" },
      ],
    },
    ...["about", "issues", "events", "endorsements", "news", "contact", "volunteer", "donate"].map((slug) => ({
      path: `/${slug}`,
      label: slug[0].toUpperCase() + slug.slice(1),
      regions: [
        ...siteChromeRegions,
        ...heroRegions(slug),
        { id: `${slug}.signup.title`, kind: "text" as const },
        { id: `${slug}.signup.body`, kind: "text" as const },
        { id: `${slug}.signup.button`, kind: "link" as const },
      ],
    })),
  ],
  sections: {},
});
