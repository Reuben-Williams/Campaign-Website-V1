"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, ElementType } from "react";
import type { CampaignImage, CampaignPage } from "@/content/site";
import { siteConfig } from "@/content/site";
import { useI18n } from "@/components/language-provider";
import { translateCampaignPage } from "@/lib/i18n";
import { withBasePath } from "@/lib/paths";

type CampaignPageViewProps = {
  page: CampaignPage;
  variant?: "home" | "standard";
};

type EditableValue =
  | { type: "text"; value: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "link"; href: string; label: string };

type PageContent = {
  regions: Record<string, EditableValue>;
};

function EditableText({
  id,
  fallback,
  as: Component = "span",
  className,
}: {
  id: string;
  fallback: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component className={className} {...stableRegionProps(id, "text")}>
      {fallback}
    </Component>
  );
}

function EditableLink({
  className,
  id,
  fallbackHref,
  fallbackLabel,
}: {
  className?: string;
  id: string;
  fallbackHref: string;
  fallbackLabel: string;
}) {
  return (
    <Link className={className} href={fallbackHref} {...stableRegionProps(id, "link")}>
      {fallbackLabel}
    </Link>
  );
}

type EditableImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  id: string;
  fallback: string;
  alt: string;
};

function EditableImage({ id, fallback, alt, ...props }: EditableImageProps) {
  return <Image src={withBasePath(fallback)} alt={alt} {...props} {...stableRegionProps(id, "image")} />;
}

const issueCards = [
  {
    title: "Education",
    summary:
      "Investing in students, educators, and modern public school infrastructure across every community.",
    icon: "school",
    featured: true,
  },
  {
    title: "Public Safety",
    summary:
      "Strengthening prevention, response times, and trust between neighborhoods and local responders.",
    icon: "shield",
  },
  {
    title: "Taxes & Economy",
    summary:
      "Relieving pressure on working families while keeping local business corridors competitive.",
    icon: "payments",
  },
  {
    title: "Healthcare Access",
    summary:
      "Expanding affordable care, lowering prescription costs, and protecting essential services.",
    icon: "health",
    dark: true,
  },
  {
    title: "Transportation",
    summary:
      "Repairing aging roads, improving transit reliability, and connecting residents to opportunity.",
    icon: "train",
  },
  {
    title: "Small Business",
    summary:
      "Cutting unnecessary red tape and expanding grants, storefront support, and innovation hubs.",
    icon: "store",
  },
  {
    title: "Housing",
    summary:
      "Addressing affordability with practical zoning reforms, tenant stability, and sustainable development.",
    icon: "home",
  },
];

const eventCards = [
  {
    type: "Town Hall",
    date: "Oct 24",
    title: "Economic Future of the Central District",
    location: "Central Library Atrium",
    action: "RSVP",
  },
  {
    type: "Meet & Greet",
    date: "Oct 26",
    title: "Coffee with the Candidate",
    location: "Brew & Bake",
    action: "RSVP Now",
  },
  {
    type: "Fundraiser",
    date: "Nov 02",
    title: "Founders Circle Dinner",
    location: "The Newark Room",
    action: "Get Tickets",
  },
];

const donationAmounts = ["25", "50", "100", "250"];

function imageFocusStyle(image: CampaignImage): CSSProperties {
  return {
    objectPosition: image.focus ?? "50% 50%",
  };
}

export function CampaignPageView({
  page: sourcePage,
  variant = "standard",
}: CampaignPageViewProps) {
  const { language, t } = useI18n();
  const page = translateCampaignPage(sourcePage, language);
  const isHome = variant === "home";

  return (
    <main className={`page-shell page-${page.slug}`}>
      {isHome ? (
        <HomeHero page={page} />
      ) : (
        <InteriorHero page={page} />
      )}

      {isHome ? <HomeSections page={page} /> : <InteriorSections page={page} />}

      {page.slug === "issues" ? <IssuesPanel page={page} /> : null}
      {page.slug === "events" ? <EventsPanel page={page} /> : null}
      {page.slug === "endorsements" ? <EndorsementsPanel page={page} /> : null}
      {page.slug === "news" ? <NewsPanel page={page} /> : null}
      {page.slug === "contact" ? <ContactPanel /> : null}
      {page.slug === "volunteer" ? <VolunteerPanel /> : null}
      {page.slug === "donate" ? <DonatePanel /> : null}

      <MovementSignup
        regionPrefix={page.slug}
        title={page.slug === "events" ? t("Join us on the trail.") : t("Join the Movement")}
        body={
          page.slug === "events"
            ? t("Sign up for event updates and volunteer opportunities in your neighborhood.")
            : t("Sign up to receive campaign updates, volunteer opportunities, and news from the trail.")
        }
      />
    </main>
  );
}

function regionValue(content: PageContent | undefined, regionId: string): EditableValue | undefined {
  return content?.regions[regionId];
}

function imageForRegion(content: PageContent | undefined, regionId: string, fallback: CampaignImage): CampaignImage {
  const value = regionValue(content, regionId);
  if (value?.type !== "image") return fallback;

  return {
    ...fallback,
    src: value.src || fallback.src,
    alt: value.alt || fallback.alt,
  };
}

function stableRegionProps(regionId: string, kind: EditableValue["type"]) {
  return {
    "data-builder-region": regionId,
    "data-builder-kind": kind,
  };
}

function HomeHero({
  page,
}: {
  page: CampaignPage;
}) {
  const heroImage = page.images[0];
  return (
    <section className="stitch-hero home-hero">
      <div className="hero-bg-frame">
        <EditableImage
          id="home.hero.image"
          className="hero-bg"
          fallback={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          style={imageFocusStyle(heroImage)}
        />
      </div>
      <div className="hero-scrim" />
      <div className="hero-grid stitch-container">
        <div className="hero-copy light">
          <EditableText
            id="home.hero.kicker"
            className="section-kicker light"
            fallback={`${siteConfig.campaignName} ${siteConfig.year}`}
            as="p"
          />
          <EditableText id="home.hero.title" fallback="A Voice for Our Future" as="h1" />
          <EditableText
            id="home.hero.summary"
            fallback="Committed to transparent leadership, economic vitality, and bringing genuine progress to our communities. Join the movement for a stronger district."
            as="p"
          />
          <div className="hero-actions">
            <Link className="button button-action" href="/donate" {...stableRegionProps("home.hero.donateCta", "link")}>
              Contribute Now <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-ghost-light" href="/volunteer" {...stableRegionProps("home.hero.volunteerCta", "link")}>
              Volunteer <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <CountdownCard />
      </div>
    </section>
  );
}

function InteriorHero({
  page,
}: {
  page: CampaignPage;
}) {
  const darkHero = page.slug === "events" || page.slug === "endorsements" || page.slug === "news";
  const titleRegion = `${page.slug}.hero.title`;
  const summaryRegion = `${page.slug}.hero.summary`;
  const imageRegion = `${page.slug}.hero.image`;
  const ctaRegion = `${page.slug}.hero.primaryCta`;
  const heroImage = page.images[0];

  if (darkHero) {
    return (
      <section className="stitch-hero interior-dark-hero">
        <div className="hero-bg-frame">
          <EditableImage
            id={imageRegion}
            className="hero-bg"
            fallback={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            style={imageFocusStyle(heroImage)}
          />
        </div>
        <div className="hero-scrim" />
        <div className="stitch-container hero-copy light">
          <EditableText
            id={`${page.slug}.hero.kicker`}
            className="section-kicker light"
            fallback={page.slug === "events" ? "On the Trail" : page.navLabel}
            as="p"
          />
          <EditableText id={titleRegion} fallback={page.slug === "events" ? "Join Us on the Trail" : page.title} as="h1" />
          <EditableText id={summaryRegion} fallback={page.summary} as="p" />
          {page.ctaHref ? (
            <EditableLink className="button button-action" id={ctaRegion} fallbackHref={page.ctaHref} fallbackLabel={page.ctaLabel ?? "Learn More"} />
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={`stitch-container split-hero split-hero-${page.slug}`}>
      <div className="hero-copy">
        <EditableText
          id={`${page.slug}.hero.kicker`}
          className="section-kicker"
          fallback={page.slug === "issues" ? "Our Priorities" : page.eyebrow ?? page.navLabel}
          as="p"
        />
        <EditableText id={titleRegion} fallback={heroTitle(page)} as="h1" />
        <EditableText id={summaryRegion} fallback={page.summary} as="p" />
        {page.ctaHref ? (
          <EditableLink className="button button-primary" id={ctaRegion} fallbackHref={page.ctaHref} fallbackLabel={page.ctaLabel ?? "Learn More"} />
        ) : null}
      </div>
      <figure className="portrait-frame">
        <EditableImage
          id={imageRegion}
          fallback={heroImage.src}
          alt={heroImage.alt}
          width={1200}
          height={900}
          priority
          loading="eager"
          sizes="(max-width: 900px) 100vw, 48vw"
          style={imageFocusStyle(heroImage)}
        />
        {page.slug === "issues" ? (
          <EditableText
            id="issues.hero.caption"
            fallback={'"Progress through practical, proven solutions."'}
            as="figcaption"
          />
        ) : null}
      </figure>
    </section>
  );
}

function heroTitle(page: CampaignPage) {
  if (page.slug === "about") return "A Life Dedicated to Public Service.";
  if (page.slug === "issues") return "A Vision for Modern Statesmanship.";
  return page.title;
}

function CountdownCard() {
  return (
    <aside className="countdown-card" aria-label="Countdown to Election">
      <p>Countdown to Election</p>
      <div className="countdown-grid">
        {[
          ["117", "Days"],
          ["08", "Hours"],
          ["38", "Mins"],
          ["33", "Secs"],
        ].map(([value, label]) => (
          <span key={label}>
            <strong>{value}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
      <div className="countdown-progress">
        <span />
      </div>
      <small>November 3rd</small>
    </aside>
  );
}

function HomeSections({ page }: { page: CampaignPage }) {
  return (
    <>
      <section className="mission-section stitch-container">
        <div className="section-intro centered">
          <EditableText id="home.mission.kicker" className="section-pill" fallback="The Mission" as="p" />
          <EditableText id="home.mission.title" fallback="Restoring Trust, Delivering Results" as="h2" />
          <EditableText
            id="home.mission.summary"
            fallback="We are at a crossroads. It is time for leadership that prioritizes community over politics. Carmen brings public-service experience with a fresh, modern approach to solving the district's toughest challenges."
            as="p"
          />
        </div>
        <div className="mission-grid">
          <figure className="leader-card">
            <EditableImage
              id="home.mission.leaderImage"
              fallback={page.images[1].src}
              alt={page.images[1].alt}
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
              style={imageFocusStyle(page.images[1])}
            />
            <figcaption>
              <EditableText id="home.mission.leaderTitle" fallback="A Leader Who Listens" as="h3" />
              <EditableText
                id="home.mission.leaderSummary"
                fallback="From local meetings to the State House, Carmen keeps an open door and a clear connection to the people she serves."
                as="p"
              />
              <EditableLink id="home.mission.leaderLink" fallbackHref="/about" fallbackLabel="Read Full Bio" />
            </figcaption>
          </figure>
          <div className="mission-stack">
            <MiniPriority id="home.mission.integrity" title="Integrity First" icon="verified" />
            <MiniPriority id="home.mission.economy" title="Economic Vitality" icon="trending_up" dark />
          </div>
        </div>
      </section>

      <section className="issue-preview">
        <div className="stitch-container">
          <div className="section-row">
            <div>
              <EditableText id="home.issues.kicker" className="section-pill" fallback="Key Priorities" as="p" />
              <EditableText id="home.issues.title" fallback="Issues That Matter" as="h2" />
            </div>
            <Link className="text-link" href="/issues" {...stableRegionProps("home.issues.viewAllLink", "link")}>
              View All Issues <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="issue-preview-grid">
            <article className="issue-feature-card">
              <EditableImage
                id="home.issues.featuredImage"
                fallback={page.images[2].src}
                alt={page.images[2].alt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                style={imageFocusStyle(page.images[2])}
              />
              <div>
                <EditableText id="home.issues.featuredKicker" className="section-pill" fallback="Education" as="p" />
                <EditableText id="home.issues.featuredTitle" fallback="Investing in Our Future Generations" as="h3" />
                <EditableText
                  id="home.issues.featuredSummary"
                  fallback="We must ensure every child has access to world-class public education, modern classrooms, and stable support systems."
                  as="p"
                />
                <Link href="/issues">Read Plan <span aria-hidden="true">→</span></Link>
              </div>
            </article>
            <div className="issue-side-list">
              <SmallIssue id="home.issues.accessibleCare" image={page.images[1]} title="Accessible & Affordable Care" />
              <SmallIssue id="home.issues.tomorrow" image={page.images[0]} title="Building for Tomorrow" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InteriorSections({ page }: { page: CampaignPage }) {
  if (page.slug === "issues" || page.slug === "events") return null;

  if (page.slug === "about") {
    return (
      <>
        <section className="bento-section">
          <div className="stitch-container">
            <div className="section-intro centered">
              <EditableText id="about.bento.title" fallback="Why I'm Running" as="h2" />
              <EditableText
                id="about.bento.summary"
                fallback="The challenges we face require steady, principled leadership. It is time to build a future that works for everyone."
                as="p"
              />
            </div>
            <div className="about-bento">
              <article className="bento-large">
                <span className="material-chip">school</span>
                <EditableText id="about.bento.education.title" fallback="Protecting Public Education" as="h3" />
                <EditableText id="about.bento.education.summary" fallback={page.sections[0]?.body ?? ""} as="p" />
                <ImageCard id="about.bento.education.image" image={page.images[1]} />
              </article>
              <article>
                <span className="material-chip">shield</span>
                <EditableText id="about.bento.healthcare.title" fallback="Accessible Healthcare" as="h3" />
                <EditableText
                  id="about.bento.healthcare.summary"
                  fallback="Healthcare is a basic human right. No family should face financial ruin because of care."
                  as="p"
                />
              </article>
              <article className="dark-card">
                <span className="material-chip">trending_up</span>
                <EditableText id="about.bento.economy.title" fallback="A Sustainable Economy" as="h3" />
                <EditableText
                  id="about.bento.economy.summary"
                  fallback="Creating pathways for good-paying union jobs and resilient infrastructure."
                  as="p"
                />
              </article>
            </div>
          </div>
        </section>
        <section className="roots-section stitch-container">
          <div>
            <EditableText id="about.roots.title" fallback="Roots in the Community." as="h2" />
            <EditableText id="about.roots.kicker" className="section-kicker" fallback="Early Life & Education" as="p" />
          </div>
          <article>
            <EditableText
              id="about.roots.quote"
              fallback={'"I learned the value of hard work from the families who keep our communities moving every single day."'}
              as="blockquote"
            />
            <EditableText id="about.roots.summary" fallback={page.sections[1]?.body ?? ""} as="p" />
            <ImageCard id="about.roots.image" image={page.images[2]} />
          </article>
        </section>
      </>
    );
  }

  return (
    <section className="content-band">
      <div className="stitch-container content-grid">
        {page.sections.map((section, index) => (
          <article key={section.title} className={index === 0 ? "content-card wide" : "content-card"}>
            <EditableText id={`${page.slug}.section.${index}.kicker`} className="section-kicker" fallback={section.kicker ?? ""} as="p" />
            <EditableText id={`${page.slug}.section.${index}.title`} fallback={section.title} as="h3" />
            <EditableText id={`${page.slug}.section.${index}.body`} fallback={section.body} as="p" />
            {page.images[index + 1] ? <ImageCard id={`${page.slug}.section.${index}.image`} image={page.images[index + 1]} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function IssuesPanel({ page }: { page: CampaignPage }) {
  return (
    <section className="issues-bento stitch-container">
      <article className="issue-bento-card issue-bento-image">
        <EditableImage
          id="issues.featured.image"
          fallback={page.images[1].src}
          alt={page.images[1].alt}
          fill
          loading="eager"
          sizes="(max-width: 900px) 100vw, 62vw"
          style={imageFocusStyle(page.images[1])}
        />
        <div>
          <span className="material-chip">school</span>
          <EditableText id="issues.featured.kicker" className="section-pill" fallback="Priority" as="p" />
          <EditableText id="issues.featured.title" fallback="Education" as="h2" />
          <EditableText
            id="issues.featured.summary"
            fallback="Investing heavily in early childhood education and modernizing public school infrastructure."
            as="p"
          />
          <Link href="/contact">Learn More <span aria-hidden="true">→</span></Link>
        </div>
      </article>
      {issueCards.slice(1).map((issue, index) => (
        <article key={issue.title} className={issue.dark ? "issue-bento-card dark-card" : "issue-bento-card"}>
          <span className="material-chip">{issue.icon}</span>
          <EditableText id={`issues.card.${index}.title`} fallback={issue.title} as="h3" />
          <EditableText id={`issues.card.${index}.summary`} fallback={issue.summary} as="p" />
          <Link href="/contact">Learn More <span aria-hidden="true">→</span></Link>
        </article>
      ))}
    </section>
  );
}

function EventsPanel({ page }: { page: CampaignPage }) {
  return (
    <>
      <section className="events-section stitch-container">
        <div className="section-row">
          <div>
            <EditableText id="events.upcoming.title" fallback="Upcoming Events" as="h2" />
            <EditableText id="events.upcoming.summary" fallback="Featured campaign stops and public gatherings." as="p" />
          </div>
          <div className="circle-controls" aria-hidden="true">
            <span>chevron_left</span>
            <span>chevron_right</span>
          </div>
        </div>
        <div className="events-grid">
          <ImageCard id="events.featured.image" image={page.images[2]} />
          {eventCards.map((event, index) => (
            <article key={event.title} className={index === 0 ? "event-card wide" : "event-card"}>
              <EditableText id={`events.card.${index}.type`} className="section-pill" fallback={event.type} as="p" />
              <EditableText id={`events.card.${index}.date`} fallback={event.date} as="time" />
              <EditableText id={`events.card.${index}.title`} fallback={event.title} as="h3" />
              <EditableText id={`events.card.${index}.location`} fallback={event.location} as="p" />
              <button type="button" {...stableRegionProps(`events.card.${index}.action`, "link")}>{event.action}</button>
            </article>
          ))}
          <article className="event-card parade-card">
            <EditableText id="events.parade.kicker" className="section-pill" fallback="Community" as="p" />
            <EditableText id="events.parade.title" fallback="Fall Harvest Festival Parade" as="h3" />
            <EditableText
              id="events.parade.summary"
              fallback="Carmen and the team will be marching in the annual parade. Join our volunteer wave."
              as="p"
            />
            <Link className="button button-light" href="/volunteer" {...stableRegionProps("events.parade.link", "link")}>
              Join Volunteers
            </Link>
          </article>
        </div>
      </section>
      <section className="calendar-band">
        <div className="stitch-container calendar-grid">
          <div>
            <EditableText id="events.calendar.title" fallback="Full Calendar" as="h2" />
            <EditableText
              id="events.calendar.summary"
              fallback="We are across the district every day. View upcoming canvasses, community stops, and meetings."
              as="p"
            />
          </div>
          <div className="calendar-card">
            <EditableText id="events.calendar.month" fallback={`November ${siteConfig.year}`} as="h3" />
            <div className="calendar-days">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <strong key={day}>{day}</strong>
              ))}
              {Array.from({ length: 14 }, (_, index) => (
                <span key={index} className={index === 6 ? "busy" : index === 10 ? "selected" : ""}>
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EndorsementsPanel({ page }: { page: CampaignPage }) {
  return (
    <section className="endorsement-section stitch-container">
      {page.sections.map((section, index) => (
        <article key={section.title} className="endorsement-card">
          <ImageCard id={`endorsements.card.${index}.image`} image={page.images[index + 1] ?? page.images[0]} />
          <EditableText id={`endorsements.card.${index}.kicker`} className="section-pill" fallback={section.kicker ?? ""} as="p" />
          <EditableText id={`endorsements.card.${index}.title`} fallback={section.title} as="h3" />
          <EditableText id={`endorsements.card.${index}.body`} fallback={section.body} as="p" />
        </article>
      ))}
    </section>
  );
}

function NewsPanel({ page }: { page: CampaignPage }) {
  return (
    <section className="news-section stitch-container">
      {page.sections.map((section, index) => (
        <article key={section.title} className="news-card">
          <ImageCard id={`news.card.${index}.image`} image={page.images[index + 1] ?? page.images[0]} />
          <div>
            <EditableText id={`news.card.${index}.kicker`} className="section-pill" fallback={section.kicker ?? ""} as="p" />
            <EditableText id={`news.card.${index}.title`} fallback={section.title} as="h3" />
            <EditableText id={`news.card.${index}.body`} fallback={section.body} as="p" />
          <Link href="/contact">Read Update <span aria-hidden="true">→</span></Link>
          </div>
        </article>
      ))}
    </section>
  );
}

function ContactPanel() {
  return (
    <section className="form-section stitch-container">
      <div>
        <EditableText id="contact.form.kicker" className="section-kicker" fallback="Contact" as="p" />
        <EditableText id="contact.form.title" fallback="Send a note to the campaign." as="h2" />
        <EditableText
          id="contact.form.summary"
          fallback="This public preview keeps the form static. The markup is ready for a future database insert or email workflow when the final backend is approved."
          as="p"
        />
      </div>
      <CampaignForm buttonLabel="Send Message" />
    </section>
  );
}

function VolunteerPanel() {
  return (
    <section className="form-section stitch-container">
      <div>
        <EditableText id="volunteer.form.kicker" className="section-kicker" fallback="Volunteer Signup" as="p" />
        <EditableText id="volunteer.form.title" fallback="Tell the team how you want to help." as="h2" />
        <EditableText
          id="volunteer.form.summary"
          fallback="Choose a field role, event role, or hosting opportunity and the campaign can connect this form to the final backend later."
          as="p"
        />
      </div>
      <CampaignForm buttonLabel="Sign Up" includeInterest />
    </section>
  );
}

function DonatePanel() {
  return (
    <section className="donate-panel stitch-container">
      <div>
        <EditableText id="donate.panel.kicker" className="section-kicker" fallback="Secure Contribution" as="p" />
        <EditableText id="donate.panel.title" fallback="Choose an amount." as="h2" />
      </div>
      <div className="amount-grid">
        {donationAmounts.map((amount) => (
          <button type="button" key={amount} {...stableRegionProps(`donate.amount.${amount}`, "text")}>
            ${amount}
          </button>
        ))}
      </div>
      <EditableText
        id="donate.panel.summary"
        fallback="Final donation processing should connect to the campaign's compliance-approved donation provider after domains and payment setup are confirmed."
        as="p"
      />
    </section>
  );
}

function CampaignForm({
  buttonLabel,
  includeInterest = false,
}: {
  buttonLabel: string;
  includeInterest?: boolean;
}) {
  return (
    <form>
      <label>
        Name
        <input type="text" name="name" autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" />
      </label>
      {includeInterest ? (
        <label>
          Interest
          <select name="interest" defaultValue="canvassing">
            <option value="canvassing">Canvassing</option>
            <option value="phonebank">Phone bank</option>
            <option value="events">Events</option>
            <option value="hosting">Host a conversation</option>
          </select>
        </label>
      ) : (
        <label>
          Message
          <textarea name="message" rows={5} />
        </label>
      )}
      <button className="button button-action" type="button" {...stableRegionProps(`form.${buttonLabel.replace(/\s+/g, "-").toLowerCase()}.button`, "link")}>
        {buttonLabel}
      </button>
    </form>
  );
}

function MovementSignup({ title, body, regionPrefix }: { title: string; body: string; regionPrefix: string }) {
  return (
    <section className="movement-section">
      <div className="stitch-container">
        <span className="material-chip inverted">campaign</span>
        <EditableText id={`${regionPrefix}.signup.title`} fallback={title} as="h2" />
        <EditableText id={`${regionPrefix}.signup.body`} fallback={body} as="p" />
        <form className="inline-form">
          <label className="sr-only" htmlFor="signup-email">
            Email Address
          </label>
          <input id="signup-email" type="email" placeholder="Email Address" autoComplete="email" />
          <button type="button" {...stableRegionProps(`${regionPrefix}.signup.button`, "link")}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

function MiniPriority({
  title,
  icon,
  id,
  dark = false,
}: {
  title: string;
  icon: string;
  id: string;
  dark?: boolean;
}) {
  return (
    <article className={dark ? "mini-priority dark-card" : "mini-priority"}>
      <span className="material-chip">{icon}</span>
      <EditableText id={`${id}.title`} fallback={title} as="h3" />
      <EditableText
        id={`${id}.summary`}
        fallback="Transparent, accountable, district-first leadership in every decision."
        as="p"
      />
    </article>
  );
}

function SmallIssue({ id, image, title }: { id: string; image: CampaignImage; title: string }) {
  return (
    <article className="small-issue">
      <EditableImage
        id={`${id}.image`}
        fallback={image.src}
        alt={image.alt}
        width={160}
        height={120}
        sizes="92px"
        style={imageFocusStyle(image)}
      />
      <div>
        <EditableText id={`${id}.kicker`} className="section-pill" fallback="Priority" as="p" />
        <EditableText id={`${id}.title`} fallback={title} as="h3" />
        <EditableText
          id={`${id}.summary`}
          fallback="Practical plans for working families and seniors across the district."
          as="p"
        />
      </div>
    </article>
  );
}

function ImageCard({ id, image }: { id: string; image: CampaignImage }) {
  return (
    <figure className="image-card">
      <EditableImage
        id={id}
        fallback={image.src}
        alt={image.alt}
        width={1200}
        height={900}
        sizes="(max-width: 900px) 100vw, 42vw"
        style={imageFocusStyle(image)}
      />
    </figure>
  );
}
