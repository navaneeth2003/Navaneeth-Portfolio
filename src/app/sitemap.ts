import type { MetadataRoute } from "next";
import { getPublishedSite } from "@/lib/published";
import { getEffectiveSeo } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content } = await getPublishedSite();
  const seo = getEffectiveSeo(content);
  const baseUrl = seo.canonicalUrl.replace(/\/+$/, "");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
