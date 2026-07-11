import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { CampaignImage, CampaignPage } from "@/content/site";
import { siteConfig } from "@/content/site";
import { withBasePath } from "@/lib/paths";

type CampaignPageViewProps = {
  page: CampaignPage;
  variant?: "home" | "standard";
};

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
  page,
  variant = "standard",
}: CampaignPageViewProps) {
  const isHome = variant === "home";

  return (
    <main className={`page-shell page-${page.slug}`}>
      {isHome ? <HomeHero page={page} /> : <InteriorHero page={page} />}

      {isHome ? <HomeSections page={page} /> : <InteriorSections page={page} />}

      {page.slug === "issues" ? <IssuesPanel page={page} /> : null}
      {page.slug === "events" ? <EventsPanel page={page} /> : null}
      {page.slug === "endorsements" ? <EndorsementsPanel page={page} /> : null}
      {page.slug === "news" ? <NewsPanel page={page} /> : null}
      {page.slug === "contact" ? <ContactPanel /> : null}
      {page.slug === "volunteer" ? <VolunteerPanel /> : null}
      {page.slug === "donate" ? <DonatePanel /> : null}

      <MovementSignup
        title={page.slug === "events" ? "Join us on the trail." : "Join the Movement"}
        body={
          page.slug === "events"
            ? "Sign up for event updates and volunteer opportunities in your neighborhood."
            : "Sign up to receive campaign updates, volunteer opportunities, and news from the trail."
        }
      />
    </main>
  );
}

function HomeHero({ page }: { page: CampaignPage }) {
  return (
    <section className="stitch-hero home-hero">
      <Image
        className="hero-bg"
        src={withBasePath(page.images[0].src)}
        alt={page.images[0].alt}
        fill
        priority
        sizes="100vw"
        style={imageFocusStyle(page.images[0])}
      />
      <div className="hero-scrim" />
      <div className="hero-grid stitch-container">
        <div className="hero-copy light">
          <p className="section-kicker light">{siteConfig.campaignName} {siteConfig.year}</p>
          <h1>A Voice for Our Future</h1>
          <p>
            Committed to transparent leadership, economic vitality, and bringing genuine progress to our
            communities. Join the movement for a stronger district.
          </p>
          <div className="hero-actions">
            <Link className="button button-action" href="/donate">
              Contribute Now <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-ghost-light" href="/volunteer">
              Volunteer <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <CountdownCard />
      </div>
    </section>
  );
}

function InteriorHero({ page }: { page: CampaignPage }) {
  const darkHero = page.slug === "events" || page.slug === "endorsements" || page.slug === "news";

  if (darkHero) {
    return (
      <section className="stitch-hero interior-dark-hero">
        <Image
          className="hero-bg"
          src={withBasePath(page.images[0].src)}
          alt={page.images[0].alt}
          fill
          priority
          sizes="100vw"
          style={imageFocusStyle(page.images[0])}
        />
        <div className="hero-scrim" />
        <div className="stitch-container hero-copy light">
          <p className="section-kicker light">
            {page.slug === "events" ? "On the Trail" : page.navLabel}
          </p>
          <h1>{page.slug === "events" ? "Join Us on the Trail" : page.title}</h1>
          <p>{page.summary}</p>
          {page.ctaHref ? (
            <Link className="button button-action" href={page.ctaHref}>
              {page.ctaLabel}
            </Link>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={`stitch-container split-hero split-hero-${page.slug}`}>
      <div className="hero-copy">
        <p className="section-kicker">{page.slug === "issues" ? "Our Priorities" : page.eyebrow ?? page.navLabel}</p>
        <h1>{heroTitle(page)}</h1>
        <p>{page.summary}</p>
        {page.ctaHref ? (
          <Link className="button button-primary" href={page.ctaHref}>
            {page.ctaLabel}
          </Link>
        ) : null}
      </div>
      <figure className="portrait-frame">
        <Image
          src={withBasePath(page.images[0].src)}
          alt={page.images[0].alt}
          width={1200}
          height={900}
          priority
          loading="eager"
          sizes="(max-width: 900px) 100vw, 48vw"
          style={imageFocusStyle(page.images[0])}
        />
        {page.slug === "issues" ? (
          <figcaption>"Progress through practical, proven solutions."</figcaption>
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
          <p className="section-pill">The Mission</p>
          <h2>Restoring Trust, Delivering Results</h2>
          <p>
            We are at a crossroads. It is time for leadership that prioritizes community over politics.
            Carmen brings public-service experience with a fresh, modern approach to solving the district's
            toughest challenges.
          </p>
        </div>
        <div className="mission-grid">
          <figure className="leader-card">
            <Image
              src={withBasePath(page.images[1].src)}
              alt={page.images[1].alt}
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
              style={imageFocusStyle(page.images[1])}
            />
            <figcaption>
              <h3>A Leader Who Listens</h3>
              <p>
                From local meetings to the State House, Carmen keeps an open door and a clear connection to
                the people she serves.
              </p>
              <Link href="/about">Read Full Bio</Link>
            </figcaption>
          </figure>
          <div className="mission-stack">
            <MiniPriority title="Integrity First" icon="verified" />
            <MiniPriority title="Economic Vitality" icon="trending_up" dark />
          </div>
        </div>
      </section>

      <section className="issue-preview">
        <div className="stitch-container">
          <div className="section-row">
            <div>
              <p className="section-pill">Key Priorities</p>
              <h2>Issues That Matter</h2>
            </div>
            <Link className="text-link" href="/issues">
              View All Issues <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="issue-preview-grid">
            <article className="issue-feature-card">
              <Image
                src={withBasePath(page.images[2].src)}
                alt={page.images[2].alt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                style={imageFocusStyle(page.images[2])}
              />
              <div>
                <p className="section-pill">Education</p>
                <h3>Investing in Our Future Generations</h3>
                <p>
                  We must ensure every child has access to world-class public education, modern classrooms,
                  and stable support systems.
                </p>
                <Link href="/issues">Read Plan <span aria-hidden="true">→</span></Link>
              </div>
            </article>
            <div className="issue-side-list">
              <SmallIssue image={page.images[1]} title="Accessible & Affordable Care" />
              <SmallIssue image={page.images[0]} title="Building for Tomorrow" />
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
              <h2>Why I'm Running</h2>
              <p>
                The challenges we face require steady, principled leadership. It is time to build a future
                that works for everyone.
              </p>
            </div>
            <div className="about-bento">
              <article className="bento-large">
                <span className="material-chip">school</span>
                <h3>Protecting Public Education</h3>
                <p>{page.sections[0]?.body}</p>
                <ImageCard image={page.images[1]} />
              </article>
              <article>
                <span className="material-chip">shield</span>
                <h3>Accessible Healthcare</h3>
                <p>Healthcare is a basic human right. No family should face financial ruin because of care.</p>
              </article>
              <article className="dark-card">
                <span className="material-chip">trending_up</span>
                <h3>A Sustainable Economy</h3>
                <p>Creating pathways for good-paying union jobs and resilient infrastructure.</p>
              </article>
            </div>
          </div>
        </section>
        <section className="roots-section stitch-container">
          <div>
            <h2>Roots in the Community.</h2>
            <p className="section-kicker">Early Life & Education</p>
          </div>
          <article>
            <blockquote>
              "I learned the value of hard work from the families who keep our communities moving every single
              day."
            </blockquote>
            <p>{page.sections[1]?.body}</p>
            <ImageCard image={page.images[2]} />
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
            <p className="section-kicker">{section.kicker}</p>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
            {page.images[index + 1] ? <ImageCard image={page.images[index + 1]} /> : null}
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
        <Image
          src={withBasePath(page.images[1].src)}
          alt={page.images[1].alt}
          fill
          loading="eager"
          sizes="(max-width: 900px) 100vw, 62vw"
          style={imageFocusStyle(page.images[1])}
        />
        <div>
          <span className="material-chip">school</span>
          <p className="section-pill">Priority</p>
          <h2>Education</h2>
          <p>
            Investing heavily in early childhood education and modernizing public school infrastructure.
          </p>
          <Link href="/contact">Learn More <span aria-hidden="true">→</span></Link>
        </div>
      </article>
      {issueCards.slice(1).map((issue) => (
        <article key={issue.title} className={issue.dark ? "issue-bento-card dark-card" : "issue-bento-card"}>
          <span className="material-chip">{issue.icon}</span>
          <h3>{issue.title}</h3>
          <p>{issue.summary}</p>
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
            <h2>Upcoming Events</h2>
            <p>Featured campaign stops and public gatherings.</p>
          </div>
          <div className="circle-controls" aria-hidden="true">
            <span>chevron_left</span>
            <span>chevron_right</span>
          </div>
        </div>
        <div className="events-grid">
          <ImageCard image={page.images[2]} />
          {eventCards.map((event, index) => (
            <article key={event.title} className={index === 0 ? "event-card wide" : "event-card"}>
              <p className="section-pill">{event.type}</p>
              <time>{event.date}</time>
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <button type="button">{event.action}</button>
            </article>
          ))}
          <article className="event-card parade-card">
            <p className="section-pill">Community</p>
            <h3>Fall Harvest Festival Parade</h3>
            <p>Carmen and the team will be marching in the annual parade. Join our volunteer wave.</p>
            <Link className="button button-light" href="/volunteer">
              Join Volunteers
            </Link>
          </article>
        </div>
      </section>
      <section className="calendar-band">
        <div className="stitch-container calendar-grid">
          <div>
            <h2>Full Calendar</h2>
            <p>We are across the district every day. View upcoming canvasses, community stops, and meetings.</p>
          </div>
          <div className="calendar-card">
            <h3>November {siteConfig.year}</h3>
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
          <ImageCard image={page.images[index + 1] ?? page.images[0]} />
          <p className="section-pill">{section.kicker}</p>
          <h3>{section.title}</h3>
          <p>{section.body}</p>
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
          <ImageCard image={page.images[index + 1] ?? page.images[0]} />
          <div>
            <p className="section-pill">{section.kicker}</p>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
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
        <p className="section-kicker">Contact</p>
        <h2>Send a note to the campaign.</h2>
        <p>
          This public preview keeps the form static. The markup is ready for a future database insert or
          email workflow when the final backend is approved.
        </p>
      </div>
      <CampaignForm buttonLabel="Send Message" />
    </section>
  );
}

function VolunteerPanel() {
  return (
    <section className="form-section stitch-container">
      <div>
        <p className="section-kicker">Volunteer Signup</p>
        <h2>Tell the team how you want to help.</h2>
        <p>Choose a field role, event role, or hosting opportunity and the campaign can connect this form to the final backend later.</p>
      </div>
      <CampaignForm buttonLabel="Sign Up" includeInterest />
    </section>
  );
}

function DonatePanel() {
  return (
    <section className="donate-panel stitch-container">
      <div>
        <p className="section-kicker">Secure Contribution</p>
        <h2>Choose an amount.</h2>
      </div>
      <div className="amount-grid">
        {donationAmounts.map((amount) => (
          <button type="button" key={amount}>
            ${amount}
          </button>
        ))}
      </div>
      <p>
        Final donation processing should connect to the campaign's compliance-approved donation provider after
        domains and payment setup are confirmed.
      </p>
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
      <button className="button button-action" type="button">
        {buttonLabel}
      </button>
    </form>
  );
}

function MovementSignup({ title, body }: { title: string; body: string }) {
  return (
    <section className="movement-section">
      <div className="stitch-container">
        <span className="material-chip inverted">campaign</span>
        <h2>{title}</h2>
        <p>{body}</p>
        <form className="inline-form">
          <label className="sr-only" htmlFor="signup-email">
            Email Address
          </label>
          <input id="signup-email" type="email" placeholder="Email Address" autoComplete="email" />
          <button type="button">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function MiniPriority({
  title,
  icon,
  dark = false,
}: {
  title: string;
  icon: string;
  dark?: boolean;
}) {
  return (
    <article className={dark ? "mini-priority dark-card" : "mini-priority"}>
      <span className="material-chip">{icon}</span>
      <h3>{title}</h3>
      <p>Transparent, accountable, district-first leadership in every decision.</p>
    </article>
  );
}

function SmallIssue({ image, title }: { image: CampaignImage; title: string }) {
  return (
    <article className="small-issue">
      <Image
        src={withBasePath(image.src)}
        alt={image.alt}
        width={160}
        height={120}
        sizes="92px"
        style={imageFocusStyle(image)}
      />
      <div>
        <p className="section-pill">Priority</p>
        <h3>{title}</h3>
        <p>Practical plans for working families and seniors across the district.</p>
      </div>
    </article>
  );
}

function ImageCard({ image }: { image: CampaignImage }) {
  return (
    <figure className="image-card">
      <Image
        src={withBasePath(image.src)}
        alt={image.alt}
        width={1200}
        height={900}
        sizes="(max-width: 900px) 100vw, 42vw"
        style={imageFocusStyle(image)}
      />
    </figure>
  );
}
