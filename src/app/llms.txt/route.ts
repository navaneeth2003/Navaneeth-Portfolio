import { getPublishedSite } from "@/lib/published";
import { getEffectiveSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const { content } = await getPublishedSite();
  const seo = getEffectiveSeo(content);
  const hero = content.hero;
  const canonical = seo.canonicalUrl.replace(/\/+$/, "");

  // Collect projects
  const projSection = content.sections.find((s) => s.type === "projects" && s.visible);
  const projects = projSection && projSection.type === "projects" ? projSection.items : [];

  // Collect experience
  const expSection = content.sections.find((s) => s.type === "experience" && s.visible);
  const experience = expSection && expSection.type === "experience" ? expSection.items : [];

  // Collect skills
  const skillSection = content.sections.find((s) => s.type === "skills" && s.visible);
  const skillGroups = skillSection && skillSection.type === "skills" ? skillSection.items : [];

  // Collect tools
  const toolSection = content.sections.find((s) => s.type === "tools" && s.visible);
  const tools = toolSection && toolSection.type === "tools" ? toolSection.items : [];

  const markdown = `# ${hero.name}
> ${hero.tagline}
> Canonical URL: ${canonical}

## Overview
${hero.shortBio}

## Key Work & Experience
${experience
  .map(
    (exp) => `### ${exp.role} at ${exp.company} (${exp.startDate} – ${exp.endDate})
${exp.bullets.map((b) => `- ${b}`).join("\n")}
${exp.highlight ? `*Highlight:* ${exp.highlight}` : ""}
${exp.tags && exp.tags.length > 0 ? `*Tags:* ${exp.tags.join(", ")}` : ""}`,
  )
  .join("\n\n")}

## Featured Products & Case Studies
${projects
  .map(
    (p) => `### ${p.title} (${p.vertical})
${p.overview}
${p.resultsAndImpact ? `*Results & Impact:* ${p.resultsAndImpact}` : ""}
${p.liveUrl ? `*Live URL:* ${p.liveUrl}` : ""}
${p.tags && p.tags.length > 0 ? `*Tags:* ${p.tags.join(", ")}` : ""}`,
  )
  .join("\n\n")}

## Skills & Competencies
${skillGroups.map((g) => `- **${g.category}:** ${g.skills.join(", ")}`).join("\n")}

## Tools & Platforms
${tools.map((t) => `- ${t.name} (${t.level})`).join("\n")}

## Developer & Engineering Credits
- **Creator & Lead Developer:** ${seo.developer.name}
- **Website:** ${seo.developer.siteUrl}
${seo.developer.linkedinUrl ? `- **LinkedIn:** ${seo.developer.linkedinUrl}` : ""}
${seo.developer.githubUrl ? `- **GitHub:** ${seo.developer.githubUrl}` : ""}
- **Architecture:** Next.js 16 App Router, React 19, TailwindCSS, Supabase, Schema.org Graph

## Contact & Profiles
- **Email:** ${content.contact.email}
${content.contact.linkedinUrl ? `- **LinkedIn:** ${content.contact.linkedinUrl}` : ""}
${seo.twitterHandle ? `- **X (Twitter):** https://x.com/${seo.twitterHandle.replace(/^@/, "")}` : ""}
- **Portfolio Website:** ${canonical}
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
