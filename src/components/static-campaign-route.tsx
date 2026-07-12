import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignPageView } from "@/components/campaign-page-view";
import { getPageBySlug, siteConfig } from "@/content/site";

export function generatePageMetadata(slug: string): Metadata {
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.navLabel,
    description: page.summary,
    openGraph: {
      title: `${page.title} | ${siteConfig.campaignName}`,
      description: page.summary,
      images: [page.images[0]?.src].filter(Boolean) as string[],
    },
  };
}

export function CampaignStaticRoute({ slug }: { slug: string }) {
  const page = getPageBySlug(slug);

  if (!page || page.slug === "home") {
    notFound();
  }

  return <CampaignPageView page={page} />;
}
