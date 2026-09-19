import type { Section, SectionType, SiteContent } from "@/lib/types";
import { renderableSections, SECTION_LABELS } from "@/lib/types";
import { getBannerStripItems, marqueeLogo, marqueeNames } from "@/lib/marquee";
import { sanitizeContent } from "@/lib/urls";
import { Navbar, type NavCta, type NavLink } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { Preloader } from "@/components/Preloader";
import type { StripItem } from "@/components/LogoStrip";
import { StatsSection } from "./StatsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ToolsSection } from "./ToolsSection";
import { SkillsSection } from "./SkillsSection";
import { CertificationsSection } from "./CertificationsSection";
import { EducationSection } from "./EducationSection";
import { JourneyFlow } from "./JourneyFlow";
import { SiteProviders } from "./SiteProviders";
import { CustomSection } from "./CustomSection";

function renderSection(section: Section, categories?: string[]) {
  const title = section.label?.trim() || SECTION_LABELS[section.type];
  switch (section.type) {
    case "about":
      return <AboutIntro key="about" data={section.data} />;
    case "stats":
      return <StatsSection key="stats" items={section.items} />;
    case "experience":
      return <ExperienceSection key="experience" title={title} items={section.items} />;
    case "projects":
      return <Projects key="projects" title={title} items={section.items} categories={categories} />;
    case "tools":
      return <ToolsSection key="tools" title={title} items={section.items} />;
    case "skills":
      return <SkillsSection key="skills" title={title} items={section.items} />;
    case "certifications":
      return <CertificationsSection key="certifications" title={title} items={section.items} />;
    case "education":
      return <EducationSection key="education" title={title} items={section.items} />;
    case "custom":
      return <CustomSection key={section.id} title={title} data={section.data} />;
  }
}

// The pill nav holds five links like the reference (Home · three sections ·
// Contact). Which three: the first present in this priority, shown in page order.
const NAV_PRIORITY: SectionType[] = [
  "projects",
  "experience",
  "skills",
  "about",
  "tools",
  "certifications",
  "education",
  "stats",
];

/**
 * The one and only render path for the site. The public page feeds it
 * `published` content; the studio's live preview feeds it `draft`.
 * There is no second implementation that could drift.
 */
export function PublicSite({
  content: raw,
  preloader = true,
}: {
  content: SiteContent;
  preloader?: boolean;
}) {
  // Every owner-typed URL passes one gate before it can become an href or src.
  const content = sanitizeContent(raw);
  const { hero } = content;
  // Only the channels the site actually shows reach the client components —
  // a legacy phone number stays in the stored document but never in the page.
  const contact = {
    email: content.contact.email,
    linkedinUrl: content.contact.linkedinUrl,
    resumeUrl: content.contact.resumeUrl,
  };
  const sections = renderableSections(content);
  const present = new Set(sections.map((s) => s.type));

  const middle = NAV_PRIORITY.filter((t) => present.has(t)).slice(0, 3);
  const links: NavLink[] = [
    { id: "hero", href: "#hero", label: "Home" },
    ...sections
      .filter((s) => middle.includes(s.type))
      .map((s) => ({
        id: s.type === "custom" ? `sec-${s.id}` : s.type,
        href: s.type === "custom" ? `#sec-${s.id}` : `#${s.type}`,
        label: s.label?.trim() || (s.type === "projects" ? "Work" : SECTION_LABELS[s.type]),
      })),
    { id: "contact", href: "#contact", label: "Contact" },
  ];
  // The nav's one CTA is the resume. No resume URL in the studio → no CTA,
  // never a placeholder link.
  const resumeUrl = contact.resumeUrl?.trim();
  const cta: NavCta | null = resumeUrl ? { href: resumeUrl, label: "Resume", external: true } : null;
  const brand = hero.name.trim().split(/\s+/)[0] || hero.name;

  // The hero's running banner: the studio's company list, or — until the
  const strip: StripItem[] = getBannerStripItems(content);

  return (
    <SiteProviders>
      {preloader && <Preloader name={hero.name} subtitle={hero.tagline} />}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-[#f2eee7] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <div
        data-palette={content.settings?.palette || "default"}
        className="relative min-h-screen bg-[var(--color-bg,#070708)] text-white transition-colors duration-500"
      >
        {/* single continuous background canvas — all sections sit transparent over it */}
        <SiteCanvas palette={content.settings?.palette} />
        <div className="relative">
          <Navbar links={links} brand={brand} cta={cta} />
          <main id="main" className="relative">
            {/* the journey line: Experience → Projects → Tools, behind the sections' content */}
            <JourneyFlow />
            <Hero hero={hero} contact={contact} strip={strip} />
            {sections.map((s) => renderSection(s, content.settings?.projectCategories))}
            <Contact contact={contact} />
          </main>
          <Footer name={hero.name} contact={contact} settings={content.settings} />
        </div>
      </div>
    </SiteProviders>
  );
}
