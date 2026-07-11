import { describe, expect, it } from "vitest";
import { navItems, pages, siteConfig } from "@/content/site";
import {
  getMissingSpanishTranslations,
  translateCampaignPage,
  translateText,
} from "@/lib/i18n";

describe("site translations", () => {
  it("translates core campaign interface text into Spanish", () => {
    expect(translateText("Home", "es")).toBe("Inicio");
    expect(translateText("Donate", "es")).toBe("Donar");
    expect(translateText("A Voice for Our Future", "es")).toBe("Una Voz para Nuestro Futuro");
  });

  it("translates every public content string from the campaign content model", () => {
    const publicStrings = [
      siteConfig.campaignName,
      siteConfig.office,
      siteConfig.district,
      siteConfig.footerLegal,
      ...navItems.flatMap((item) => [item.label]),
      ...pages.flatMap((page) => [
        page.navLabel,
        page.title,
        page.eyebrow,
        page.summary,
        page.ctaLabel,
        ...page.images.flatMap((image) => [image.alt]),
        ...page.sections.flatMap((section) => [
          section.kicker,
          section.title,
          section.body,
        ]),
      ]),
    ].filter((value): value is string => Boolean(value));

    expect(getMissingSpanishTranslations(publicStrings)).toEqual([]);
  });

  it("returns a fully translated campaign page without mutating the original page", () => {
    const home = pages.find((page) => page.slug === "home");

    expect(home).toBeDefined();

    const translatedHome = translateCampaignPage(home!, "es");

    expect(translatedHome.title).toBe("Liderazgo arraigado en la comunidad. Resultados para el futuro.");
    expect(translatedHome.sections[0]?.title).toBe("Una campaña centrada primero en escuchar.");
    expect(home!.title).toBe("Leadership rooted in community. Results built for the future.");
  });
});
