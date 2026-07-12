import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("about");

export default function AboutPage() {
  return <CampaignStaticRoute slug="about" />;
}
