import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navItems, pages, siteConfig } from "@/content/site";

describe("campaign site content", () => {
  it("uses Carmen Morales branding across the campaign shell", () => {
    expect(siteConfig.candidateName).toBe("Carmen Morales");
    expect(siteConfig.campaignName).toBe("Morales for Assembly");
    expect(siteConfig.footerLegal).toContain("Morales");
    expect(JSON.stringify(pages)).not.toMatch(/Eldridge|Sarah/i);
  });

  it("defines every public route in navigation", () => {
    const hrefs = navItems.map((item) => item.href);

    expect(hrefs).toEqual([
      "/",
      "/about",
      "/issues",
      "/events",
      "/endorsements",
      "/news",
      "/contact",
      "/volunteer",
      "/donate",
    ]);
  });

  it("uses only bundled local images for page media", () => {
    for (const page of pages) {
      for (const image of page.images) {
        expect(image.src).toMatch(/^\/images\/campaign\//);
        expect(image.src).not.toMatch(/placeholder|lh3\.googleusercontent|mainplaceholder/i);
        expect(image.alt.length).toBeGreaterThan(12);
      }
    }
  });

  it("defines focal points for cropped campaign photography", () => {
    for (const page of pages) {
      for (const image of page.images) {
        expect(image.focus, `${page.slug}: ${image.src}`).toMatch(/^\d{1,3}% \d{1,3}%$/);
      }
    }
  });

  it("keeps featured content image frames tall enough for focal-point crops", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(css).toMatch(/\.content-card\.wide \.image-card\s*{[^}]*--image-card-height:\s*clamp\(340px,\s*32vw,\s*460px\)/s);
  });

  it("keeps public-facing source copy free of implementation and preview labels", () => {
    const publicFacingFiles = [
      "src/content/site.ts",
      "src/components/campaign-page-view.tsx",
      "src/app/layout.tsx",
      "src/app/not-found.tsx",
    ];
    const forbiddenTerms = [
      ["de", "mo"],
      ["git", "hub"],
      ["ver", "cel"],
      ["supa", "base"],
    ].map((parts) => parts.join(""));
    const forbiddenPattern = new RegExp(`\\b(${forbiddenTerms.join("|")})\\b`, "i");

    for (const file of publicFacingFiles) {
      const source = readFileSync(join(process.cwd(), file), "utf8");

      expect(source, file).not.toMatch(forbiddenPattern);
    }
  });
});
