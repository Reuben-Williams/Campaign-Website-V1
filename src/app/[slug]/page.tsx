import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignPageView } from "@/components/campaign-page-view";
import { getPageBySlug, pages, siteConfig } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return pages
    .filter((page) => page.slug !== "home")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

export default async function CampaignRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page || page.slug === "home") {
    notFound();
  }

  return <CampaignPageView page={page} />;
}
