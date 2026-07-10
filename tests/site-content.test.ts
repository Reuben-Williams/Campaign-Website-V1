import { describe, expect, it, vi } from "vitest";
import { navItems, pages, siteConfig } from "@/content/site";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

describe("campaign site content", () => {
  it("uses Carmen Morales branding across the demo shell", () => {
    expect(siteConfig.candidateName).toBe("Carmen Morales");
    expect(siteConfig.campaignName).toBe("Morales for Assembly");
    expect(siteConfig.footerLegal).toContain("Morales");
    expect(JSON.stringify(pages)).not.toMatch(/Eldridge|Sarah/i);
  });

  it("defines every GitHub Pages demo route in navigation", () => {
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
});

describe("Supabase browser client", () => {
  it("stays disabled until public Supabase env vars are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(getSupabaseBrowserClient()).toBeNull();

    vi.unstubAllEnvs();
  });
});
