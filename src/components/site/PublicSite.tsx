import type { Section, SiteContent } from "@/lib/types";
import { renderableSections } from "@/lib/types";
import { AboutSection } from "./AboutSection";
import { CertificationsSection } from "./CertificationsSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection } from "./HeroSection";
import { CustomCursor } from "./motion/CustomCursor";
import { MotionProvider } from "./motion/MotionProvider";
import { ProjectsSection } from "./ProjectsSection";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import { SkillsSection } from "./SkillsSection";
import { StatsSection } from "./StatsSection";
import { ToolsSection } from "./ToolsSection";

function renderSection(section: Section) {
  switch (section.type) {
    case "about":
      return <AboutSection key="about" data={section.data} />;
    case "stats":
      return <StatsSection key="stats" items={section.items} />;
    case "experience":
      return <ExperienceSection key="experience" items={section.items} />;
    case "projects":
      return <ProjectsSection key="projects" items={section.items} />;
    case "tools":
      return <ToolsSection key="tools" items={section.items} />;
    case "skills":
      return <SkillsSection key="skills" items={section.items} />;
    case "certifications":
      return <CertificationsSection key="certifications" items={section.items} />;
    case "education":
      return <EducationSection key="education" items={section.items} />;
  }
}

/**
 * The one and only render path for the site. The public page feeds it `published`
 * content; the studio's live preview feeds it `draft`. There is no second path.
 */
export function PublicSite({ content }: { content: SiteContent }) {
  const sections = renderableSections(content);
  const workAnchor = ["projects", "experience"]
    .map((t) => sections.find((s) => s.type === t))
    .filter(Boolean)
    .map((s) => `#${s!.type}`)[0];

  return (
    <MotionProvider>
      <div className="min-h-screen bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[95] focus:rounded-[12px] focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <CustomCursor />
        <SiteNav content={content} />
        <main id="main">
          <HeroSection hero={content.hero} contact={content.contact} workAnchor={workAnchor} />
          {sections.map(renderSection)}
        </main>
        <SiteFooter contact={content.contact} name={content.hero.name} />
        {/* Without JS, motion never hydrates — force any inline hidden states visible. */}
        <noscript>
          <style>{`[style]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </div>
    </MotionProvider>
  );
}
