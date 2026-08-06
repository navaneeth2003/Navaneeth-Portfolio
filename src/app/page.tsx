import { PublicSite } from "@/components/site/PublicSite";
import { getPublishedSite } from "@/lib/published";

// Rendered on every request so a publish shows up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { content } = await getPublishedSite();
  return <PublicSite content={content} />;
}
