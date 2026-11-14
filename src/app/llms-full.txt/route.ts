import { getPublishedSite } from "@/lib/published";
import { getEffectiveSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const { content } = await getPublishedSite();
  const seo = getEffectiveSeo(content);
  const hero = content.hero;
  const canonical = seo.canonicalUrl.replace(/\/+$/, "");

  // About
  const aboutSection = content.sections.find((s) => s.type === "about" && s.visible);
  const about = aboutSection && aboutSection.type === "about" ? aboutSection.data : null;

  // Stats
  const statSection = content.sections.find((s) => s.type === "stats" && s.visible);
  const stats = statSection && statSection.type === "stats" ? statSection.items : [];

  // Projects
  const projSection = content.sections.find((s) => s.type === "projects" && s.visible);
  const projects = projSection && projSection.type === "projects" ? projSection.items : [];

  // Experience
  const expSection = content.sections.find((s) => s.type === "experience" && s.visible);
  const experience = expSection && expSection.type === "experience" ? expSection.items : [];

  // Skills
  const skillSection = content.sections.find((s) => s.type === "skills" && s.visible);
  const skillGroups = skillSection && skillSection.type === "skills" ? skillSection.items : [];

  // Tools
  const toolSection = content.sections.find((s) => s.type === "tools" && s.visible);
  const tools = toolSection && toolSection.type === "tools" ? toolSection.items : [];

  // Certifications
  const certSection = content.sections.find((s) => s.type === "certifications" && s.visible);
  const certs = certSection && certSection.type === "certifications" ? certSection.items : [];

  // Education
  const eduSection = content.sections.find((s) => s.type === "education" && s.visible);
  const education = eduSection && eduSection.type === "education" ? eduSection.items : [];

  const markdown = `# Complete Dossier: ${hero.name}
Role: ${hero.tagline}
Website: ${canonical}

## About
${about?.heading ? `### ${about.heading}` : ""}
${about?.body ?? hero.shortBio}

${stats.length > 0 ? `## Key Metrics\n${stats.map((s) => `- **${s.value || "•"}** ${s.label}`).join("\n")}\n` : ""}

## Professional Experience
${experience
  .map(
    (exp) => `### ${exp.role} — ${exp.company}
Period: ${exp.startDate} – ${exp.endDate}
${exp.bullets.map((b) => `- ${b}`).join("\n")}
${exp.highlight ? `**Key Highlight:** ${exp.highlight}` : ""}
${exp.tags && exp.tags.length > 0 ? `**Focus:** ${exp.tags.join(", ")}` : ""}`,
  )
  .join("\n\n")}

## Projects & Case Studies
${projects
  .map(
    (p) => `### ${p.title}
Vertical: ${p.vertical}
${p.overview}
${p.resultsAndImpact ? `**Results & Business Impact:** ${p.resultsAndImpact}` : ""}
${p.liveUrl ? `**Live Project URL:** ${p.liveUrl}` : ""}
${p.caseStudyUrl ? `**Case Study URL:** ${p.caseStudyUrl}` : ""}
${p.tags && p.tags.length > 0 ? `**Tech / Competencies:** ${p.tags.join(", ")}` : ""}`,
  )
  .join("\n\n")}

## Skills & Capabilities
${skillGroups.map((g) => `### ${g.category}\n${g.skills.map((s) => `- ${s}`).join("\n")}`).join("\n\n")}

## Tools & Proficiencies
${tools.map((t) => `- **${t.name}**: ${t.level}`).join("\n")}

${certs.length > 0 ? `## Certifications\n${certs.map((c) => `- **${c.title}** (${c.issuer})${c.credentialId ? ` · ID: ${c.credentialId}` : ""}${c.credentialUrl ? ` · ${c.credentialUrl}` : ""}`).join("\n")}\n` : ""}

${education.length > 0 ? `## Education\n${education.map((e) => `- **${e.degree}** · ${e.institution ?? "University"} (${e.startYear} – ${e.endYear})`).join("\n")}\n` : ""}

## Technical Architecture & Credits
This high-performance portfolio and custom headless CMS were designed and developed by **${seo.developer.name}**.
- Website: ${seo.developer.siteUrl}
${seo.developer.linkedinUrl ? `- LinkedIn: ${seo.developer.linkedinUrl}` : ""}
${seo.developer.githubUrl ? `- GitHub: ${seo.developer.githubUrl}` : ""}
- Core Tech: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Supabase Backend, Schema.org Multi-Entity Graph.
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
