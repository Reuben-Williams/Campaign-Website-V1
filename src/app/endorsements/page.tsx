import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("endorsements");

export default function EndorsementsPage() {
  return <CampaignStaticRoute slug="endorsements" />;
}
