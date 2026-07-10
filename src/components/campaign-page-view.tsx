import Image from "next/image";
import Link from "next/link";
import type { CampaignPage } from "@/content/site";
import { siteConfig } from "@/content/site";
import { withBasePath } from "@/lib/paths";

type CampaignPageViewProps = {
  page: CampaignPage;
  variant?: "home" | "standard";
};

const issueLabels = [
  "Public Education",
  "Affordability",
  "Healthcare Access",
  "Safe Neighborhoods",
  "Small Business",
  "Transportation",
];

const donationAmounts = ["25", "50", "100", "250"];

export function CampaignPageView({
  page,
  variant = "standard",
}: CampaignPageViewProps) {
  const isHome = variant === "home";

  return (
    <main>
      <section className={isHome ? "hero hero-home" : "hero hero-standard"}>
        <div className="hero-copy">
          {page.eyebrow ? <p className="section-kicker">{page.eyebrow}</p> : null}
          <h1>{page.title}</h1>
          <p className="hero-summary">{page.summary}</p>
          <div className="hero-actions">
            {page.ctaLabel && page.ctaHref ? (
              <Link className="button button-primary" href={page.ctaHref}>
                {page.ctaLabel}
              </Link>
            ) : null}
            <Link className="button button-action" href="/donate">
              Donate
            </Link>
          </div>
        </div>
        <div className="hero-media" aria-label={`${page.navLabel} campaign photography`}>
          <Image
            src={withBasePath(page.images[0].src)}
            alt={page.images[0].alt}
            width={1400}
            height={1100}
            priority={isHome}
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
      </section>

      {isHome ? <HomeHighlights page={page} /> : <InteriorSections page={page} />}

      {page.slug === "issues" ? <IssuesPanel /> : null}
      {page.slug === "events" ? <EventsPanel /> : null}
      {page.slug === "contact" ? <ContactPanel /> : null}
      {page.slug === "volunteer" ? <VolunteerPanel /> : null}
      {page.slug === "donate" ? <DonatePanel /> : null}

      <section className="closing-band">
        <div>
          <p className="section-kicker">Stay Connected</p>
          <h2>Help build the next chapter of {siteConfig.district}.</h2>
        </div>
        <div className="closing-actions">
          <Link className="button button-light" href="/volunteer">
            Volunteer
          </Link>
          <Link className="button button-action" href="/donate">
            Donate
          </Link>
        </div>
      </section>
    </main>
  );
}

function HomeHighlights({ page }: { page: CampaignPage }) {
  return (
    <>
      <section className="split-section">
        <div>
          <p className="section-kicker">{page.sections[0].kicker}</p>
          <h2>{page.sections[0].title}</h2>
          <p>{page.sections[0].body}</p>
        </div>
        <ImageCard image={page.images[1]} />
      </section>
      <section className="issue-strip">
        <div className="strip-heading">
          <p className="section-kicker">Priorities</p>
          <h2>Focused on everyday quality of life.</h2>
        </div>
        <div className="strip-grid">
          {issueLabels.slice(0, 4).map((label) => (
            <article key={label}>
              <span />
              <h3>{label}</h3>
              <p>Clear, local priorities that can be explained at the door and defended in Trenton.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="split-section reverse">
        <ImageCard image={page.images[2]} />
        <div>
          <p className="section-kicker">{page.sections[1].kicker}</p>
          <h2>{page.sections[1].title}</h2>
          <p>{page.sections[1].body}</p>
        </div>
      </section>
    </>
  );
}

function InteriorSections({ page }: { page: CampaignPage }) {
  return (
    <section className="content-band">
      <div className="section-intro">
        <p className="section-kicker">{page.navLabel}</p>
        <h2>{page.summary}</h2>
      </div>
      <div className="content-grid">
        {page.sections.map((section, index) => (
          <article key={section.title} className="content-card">
            {section.kicker ? <p className="section-kicker">{section.kicker}</p> : null}
            <h3>{section.title}</h3>
            <p>{section.body}</p>
            {page.images[index + 1] ? <ImageCard image={page.images[index + 1]} compact /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ImageCard({
  image,
  compact = false,
}: {
  image: CampaignPage["images"][number];
  compact?: boolean;
}) {
  return (
    <figure className={compact ? "image-card compact-image" : "image-card"}>
      <Image
        src={withBasePath(image.src)}
        alt={image.alt}
        width={1200}
        height={900}
        sizes="(max-width: 900px) 100vw, 42vw"
      />
    </figure>
  );
}

function IssuesPanel() {
  return (
    <section className="issue-strip expanded">
      <div className="strip-heading">
        <p className="section-kicker">Platform</p>
        <h2>Six priorities, one district-first standard.</h2>
      </div>
      <div className="strip-grid">
        {issueLabels.map((label) => (
          <article key={label}>
            <span />
            <h3>{label}</h3>
            <p>
              A practical policy lane for public updates, detailed proposals, and voter-facing campaign language.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventsPanel() {
  const events = [
    ["Community Conversation", "Bloomfield", "Saturday, 10:00 AM"],
    ["Volunteer Briefing", "Campaign Office", "Wednesday, 6:30 PM"],
    ["Neighborhood Canvass", "District-wide", "Sunday, 12:00 PM"],
  ];

  return (
    <section className="schedule-section">
      <div>
        <p className="section-kicker">Calendar</p>
        <h2>Ready for upcoming campaign dates.</h2>
      </div>
      <div className="schedule-list">
        {events.map(([name, location, time]) => (
          <article key={name}>
            <strong>{name}</strong>
            <span>{location}</span>
            <time>{time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPanel() {
  return (
    <section className="form-section">
      <div>
        <p className="section-kicker">Contact</p>
        <h2>Send a note to the campaign.</h2>
        <p>
          For now, this demo form is static for GitHub Pages. It is structured for a future Supabase insert or email
          workflow.
        </p>
      </div>
      <form>
        <label>
          Name
          <input type="text" name="name" autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" />
        </label>
        <label>
          Message
          <textarea name="message" rows={5} />
        </label>
        <button className="button button-primary" type="button">
          Send Message
        </button>
      </form>
    </section>
  );
}

function VolunteerPanel() {
  return (
    <section className="form-section">
      <div>
        <p className="section-kicker">Volunteer Signup</p>
        <h2>Tell the team how you want to help.</h2>
      </div>
      <form>
        <label>
          Full Name
          <input type="text" name="name" autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" />
        </label>
        <label>
          Interest
          <select name="interest" defaultValue="canvassing">
            <option value="canvassing">Canvassing</option>
            <option value="phonebank">Phone bank</option>
            <option value="events">Events</option>
            <option value="hosting">Host a conversation</option>
          </select>
        </label>
        <button className="button button-primary" type="button">
          Sign Up
        </button>
      </form>
    </section>
  );
}

function DonatePanel() {
  return (
    <section className="donate-panel">
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
        Final donation processing should connect to the campaign's compliance-approved donation provider after the
        owner confirms domains and payment setup.
      </p>
    </section>
  );
}
