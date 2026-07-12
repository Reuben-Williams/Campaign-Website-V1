import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("news");

export default function NewsPage() {
  return <CampaignStaticRoute slug="news" />;
}
