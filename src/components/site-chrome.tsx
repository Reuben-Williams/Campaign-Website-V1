"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  LanguageProvider,
  LanguageToggle,
  translateDocumentSurface,
  useI18n,
} from "@/components/language-provider";
import { navItems, siteConfig } from "@/content/site";

const primaryNavLabels = ["Home", "About", "Issues", "Events", "News", "Contact"];

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SiteFrame>{children}</SiteFrame>
    </LanguageProvider>
  );
}

function SiteFrame({ children }: { children: ReactNode }) {
  const { language, t } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    translateDocumentSurface(language);
  }, [language, pathname]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label={`${t(siteConfig.campaignName)} ${t("Home")}`}>
          <span className="brand-mark">M</span>
          <span>Morales {siteConfig.year}</span>
        </Link>
        <nav className="desktop-nav" aria-label={t("Main navigation")}>
          {navItems
            .filter((item) => primaryNavLabels.includes(item.label))
            .map((item) => (
              <Link key={item.href} href={item.href}>
                {t(item.label)}
              </Link>
            ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          <Link className="button button-secondary compact" href="/volunteer">
            {t("Volunteer")}
          </Link>
          <Link className="button button-action compact" href="/donate">
            {t("Donate")}
          </Link>
        </div>
        <LanguageToggle className="mobile-language-toggle" />
      </header>
      {children}
      <footer className="site-footer">
        <div>
          <p className="footer-brand">Morales {siteConfig.year}</p>
          <p>{t(siteConfig.footerLegal)}</p>
        </div>
        <nav aria-label={t("Footer navigation")}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {t(item.label)}
            </Link>
          ))}
          <button
            className="footer-editor-button"
            type="button"
            onClick={() => window.dispatchEvent(new Event("campaign-editor:open-login"))}
          >
            Edit site
          </button>
        </nav>
      </footer>
      <Link className="floating-donate" href="/donate" aria-label={t("Donate Now")}>
        ♥
      </Link>
      <nav className="mobile-bottom-nav" aria-label={t("Mobile navigation")}>
        {navItems
          .filter((item) => primaryNavLabels.includes(item.label))
          .map((item) => (
            <Link key={item.href} href={item.href}>
              <span aria-hidden="true" />
              {t(item.label)}
            </Link>
          ))}
      </nav>
    </>
  );
}
