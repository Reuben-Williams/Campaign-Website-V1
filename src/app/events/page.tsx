import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("events");

export default function EventsPage() {
  return <CampaignStaticRoute slug="events" />;
}
