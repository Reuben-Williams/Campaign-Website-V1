import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("volunteer");

export default function VolunteerPage() {
  return <CampaignStaticRoute slug="volunteer" />;
}
