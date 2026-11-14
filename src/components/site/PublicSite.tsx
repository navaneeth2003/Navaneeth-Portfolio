import type { Section, SectionType, SiteContent } from "@/lib/types";
import { renderableSections, SECTION_LABELS } from "@/lib/types";
import { getBannerStripItems } from "@/lib/marquee";
import { CAST, OWNER_WAVE, contactVoices, heroVoices } from "@/lib/chatter";
import { getTheme, themeStyle } from "@/lib/palettes";
import { sanitizeContent } from "@/lib/urls";
import { normalizeContent } from "@/lib/normalize";
import { Navbar, type NavLink } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Preloader, type SplashMember } from "@/components/Preloader";
import type { StripItem } from "@/components/LogoStrip";
import { StatsSection } from "./StatsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ToolsSection } from "./ToolsSection";
import { SkillsSection } from "./SkillsSection";
import { CertificationsSection } from "./CertificationsSection";
import { EducationSection } from "./EducationSection";
import { SiteProviders } from "./SiteProviders";
import { CustomSection } from "./CustomSection";

function renderSection(section: Section, ownerName: string, ownerPhoto: string, categories?: string[]) {
  const title = section.label?.trim() || SECTION_LABELS[section.type];
  switch (section.type) {
    case "about":
      return <AboutIntro key="about" data={section.data} photo={ownerPhoto} name={ownerName} />;
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
      // no placeholder title: only the label the owner set, if any
      return <CustomSection key={section.id} title={section.label?.trim() || ""} data={section.data} />;
  }
}

// The nav holds five links (Home · three sections · Contact). Which three:
// the first present in this priority, shown in page order.
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
  // …after the content is repaired into a well-formed shape, whatever was stored.
  const content = sanitizeContent(normalizeContent(raw));
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

  // Contact (and every "Let's talk") only appears when there is a way to reach him.
  const reachable = Boolean(content.contact.email.trim() || content.contact.linkedinUrl?.trim() || content.contact.resumeUrl?.trim());

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
    ...(reachable ? [{ id: "contact", href: "#contact", label: "Contact" }] : []),
  ];

  // Data the hero derives instead of hard-coding: where he works now (an
  // Experience entry that runs to "present") and whether there is work to show.
  const experience = sections.find((s) => s.type === "experience");
  const nowAt =
    experience?.type === "experience"
      ? experience.items.find((e) => e.endDate === "present")?.company?.trim() || null
      : null;
  const workHref = present.has("projects") ? "#projects" : null;

  const strip: StripItem[] = getBannerStripItems(content);
  const resumeUrl = contact.resumeUrl?.trim() || null;
  // The little portrait beside the name (nav, footer): the avatar, else the photo, else the illustration.
  const avatar = hero.avatar?.url || hero.photo.url || undefined;

  const theme = getTheme(content.settings?.palette);

  // The hero's cast, gathering on the splash screen (him in the middle).
  const voices = heroVoices(content);
  const splash: SplashMember[] = voices.slice(0, 5).map((v) => {
    const cast = CAST[v.avatar] ?? CAST.gus;
    return { src: v.avatar === "owner" ? hero.photo.url || OWNER_WAVE : cast.src, tone: cast.tone };
  });

  return (
    <SiteProviders>
      {/* the browser canvas behind the page (overscroll, safe areas) follows the theme */}
      <style>{`html,body{background:${theme.colors.canvas};color-scheme:${theme.mode}}`}</style>
      <div
        data-palette={theme.id}
        data-theme-mode={theme.mode}
        style={themeStyle(theme.id)}
        className="site relative min-h-screen overflow-x-clip transition-colors duration-500"
      >
        {preloader && <Preloader name={hero.name} cast={splash} />}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-onyx focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-onyx"
        >
          Skip to content
        </a>
        <Navbar links={links} name={hero.name} avatar={avatar} resumeUrl={resumeUrl} talk={reachable} />
        <main id="main" className="relative">
          <Hero
            hero={hero}
            contact={contact}
            strip={strip}
            nowAt={nowAt}
            workHref={workHref}
            voices={voices}
            talk={reachable}
            intro={preloader ? 1.75 : 0}
          />
          {sections.map((s) => renderSection(s, hero.name, hero.photo.url, content.settings?.projectCategories))}
          {reachable && <Contact contact={contact} name={hero.name} photo={hero.photo.url || undefined} voices={contactVoices(content)} />}
        </main>
        <Footer
          name={hero.name}
          avatar={avatar}
          tagline={hero.tagline.trim()}
          contact={contact}
          settings={content.settings}
          links={links}
        />
      </div>
    </SiteProviders>
  );
}
