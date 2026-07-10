import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { navItems, siteConfig } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.campaignName} | ${siteConfig.district}`,
    template: `%s | ${siteConfig.campaignName}`,
  },
  description:
    "A modern campaign website demo for Carmen Morales and Morales for Assembly.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://reuben-williams.github.io/Campaign-Website-V1",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label={`${siteConfig.campaignName} home`}>
            <span className="brand-mark">M</span>
            <span>
              <strong>Morales</strong>
              <small>for Assembly</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.slice(1, -2).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="button button-secondary compact" href="/volunteer">
              Volunteer
            </Link>
            <Link className="button button-action compact" href="/donate">
              Donate
            </Link>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <p className="footer-brand">{siteConfig.campaignName}</p>
            <p>{siteConfig.footerLegal}</p>
          </div>
          <nav aria-label="Footer navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
