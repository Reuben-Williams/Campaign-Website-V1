import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("donate");

export default function DonatePage() {
  return <CampaignStaticRoute slug="donate" />;
}
