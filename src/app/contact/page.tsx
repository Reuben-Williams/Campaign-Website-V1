import { CampaignStaticRoute, generatePageMetadata } from "@/components/static-campaign-route";

export const metadata = generatePageMetadata("contact");

export default function ContactPage() {
  return <CampaignStaticRoute slug="contact" />;
}
