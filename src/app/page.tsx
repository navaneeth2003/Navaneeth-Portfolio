import { PublicSite } from "@/components/site/PublicSite";
import { getPublishedSite } from "@/lib/published";

// Rendered on every request so a publish shows up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { content } = await getPublishedSite();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    jobTitle: content.hero.tagline,
    description: content.hero.shortBio,
    email: `mailto:${content.contact.email}`,
    ...(content.contact.linkedinUrl ? { sameAs: [content.contact.linkedinUrl] } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <PublicSite content={content} />
    </>
  );
}
