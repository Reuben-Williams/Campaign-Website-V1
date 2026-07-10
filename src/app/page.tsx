import { CampaignPageView } from "@/components/campaign-page-view";
import { getPageBySlug } from "@/content/site";

export default function Home() {
  const page = getPageBySlug("home");

  if (!page) {
    return null;
  }

  return <CampaignPageView page={page} variant="home" />;
}
