import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("issues");

export default function IssuesPage() {
  return <CampaignStaticRoute slug="issues" />;
}
