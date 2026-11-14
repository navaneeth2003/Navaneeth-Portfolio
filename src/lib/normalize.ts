import { SEED_CONTENT } from "./seed";
import {
  CHATTER_AVATARS,
  PROFICIENCY_LEVELS,
  type AspectRatio,
  type ChatterAvatar,
  type ChatterVoice,
  type CustomSectionItem,
  type CustomSectionTemplate,
  type ImageRef,
  type Section,
  type SiteChatter,
  type SiteContent,
  type SiteSettings,
} from "./types";

/**
 * The content safety net. Whatever comes out of the database (or the studio's
 * draft) — an older document saved before a field existed, a partial save, a
 * null where a list should be, an unknown section type — is repaired into a
 * well-formed SiteContent before anything renders it: strings stay strings,
 * lists stay lists, every item has a unique id, unknown section types and
 * templates are dropped or reset, and settings keep only valid shapes.
 * Nothing the owner typed is rewritten; only missing or broken parts are
 * filled with empty values (the components then hide or fall back). A
 * completely empty document falls back to the built-in content.
 */

type Obj = Record<string, unknown>;

const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" && Number.isFinite(v) ? String(v) : "");
const optStr = (v: unknown): string | undefined => {
  const s = str(v);
  return s ? s : undefined;
};
const strings = (v: unknown): string[] => list(v).map(str).filter((s) => s.length > 0);
const optStrings = (v: unknown): string[] | undefined => (Array.isArray(v) ? strings(v) : undefined);
const bool = (v: unknown, fallback: boolean): boolean => (typeof v === "boolean" ? v : fallback);
const num = (v: unknown, fallback: number): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

const RATIOS: AspectRatio[] = ["1:1", "16:9", "4:3"];
function image(v: unknown, ratio: AspectRatio): ImageRef {
  const o = obj(v);
  const r = o.aspectRatio as AspectRatio;
  return { url: str(o.url), aspectRatio: RATIOS.includes(r) ? r : ratio };
}
function optImage(v: unknown, ratio: AspectRatio): ImageRef | undefined {
  return v && typeof v === "object" ? image(v, ratio) : undefined;
}

/** Ids the owner never sees but React keys depend on: present and unique within their list. */
function uniqueIds<T extends { id: string }>(items: T[], prefix: string): T[] {
  const seen = new Set<string>();
  return items.map((item, k) => {
    let id = item.id || `${prefix}-${k + 1}`;
    while (seen.has(id)) id = `${id}-${k + 1}`;
    seen.add(id);
    return id === item.id ? item : { ...item, id };
  });
}

const TEMPLATES: CustomSectionTemplate[] = ["story", "media-text", "grid", "metrics", "quote", "cta"];

function normalizeSection(raw: unknown, i: number): Section | null {
  const o = obj(raw);
  const base = { visible: bool(o.visible, true), order: num(o.order, i + 1), label: optStr(o.label) };
  const items = list(o.items).map(obj);

  switch (o.type) {
    case "about": {
      const d = obj(o.data);
      return { type: "about", ...base, data: { heading: str(d.heading), body: str(d.body) } };
    }
    case "stats":
      return {
        type: "stats",
        ...base,
        items: uniqueIds(
          items.map((it) => ({ id: str(it.id), value: str(it.value), label: str(it.label), icon: optImage(it.icon, "1:1") })),
          "stat",
        ),
      };
    case "experience":
      return {
        type: "experience",
        ...base,
        items: uniqueIds(
          items.map((it) => ({
            id: str(it.id),
            company: str(it.company),
            role: str(it.role),
            startDate: str(it.startDate),
            endDate: str(it.endDate),
            bullets: strings(it.bullets),
            highlight: optStr(it.highlight),
            tags: optStrings(it.tags),
            logo: optImage(it.logo, "1:1"),
          })),
          "exp",
        ),
      };
    case "projects":
      return {
        type: "projects",
        ...base,
        items: uniqueIds(
          items.map((it) => ({
            id: str(it.id),
            vertical: str(it.vertical),
            title: str(it.title),
            coverImage: image(it.coverImage, "16:9"),
            overview: str(it.overview),
            resultsAndImpact: optStr(it.resultsAndImpact),
            liveUrl: optStr(it.liveUrl),
            caseStudyUrl: optStr(it.caseStudyUrl),
            tags: optStrings(it.tags),
          })),
          "proj",
        ),
      };
    case "tools":
      return {
        type: "tools",
        ...base,
        items: uniqueIds(
          items.map((it) => ({
            id: str(it.id),
            name: str(it.name),
            icon: image(it.icon, "1:1"),
            level: PROFICIENCY_LEVELS.includes(it.level as (typeof PROFICIENCY_LEVELS)[number])
              ? (it.level as (typeof PROFICIENCY_LEVELS)[number])
              : "Intermediate",
          })),
          "tool",
        ),
      };
    case "skills":
      return {
        type: "skills",
        ...base,
        items: uniqueIds(items.map((it) => ({ id: str(it.id), category: str(it.category), skills: strings(it.skills) })), "skills"),
      };
    case "certifications":
      return {
        type: "certifications",
        ...base,
        items: uniqueIds(
          items.map((it) => ({
            id: str(it.id),
            title: str(it.title),
            issuer: str(it.issuer),
            date: optStr(it.date),
            credentialId: optStr(it.credentialId),
            credentialUrl: optStr(it.credentialUrl),
            badge: optImage(it.badge, "1:1"),
          })),
          "cert",
        ),
      };
    case "education":
      return {
        type: "education",
        ...base,
        items: uniqueIds(
          items.map((it) => ({
            id: str(it.id),
            degree: str(it.degree),
            institution: optStr(it.institution),
            startYear: str(it.startYear),
            endYear: str(it.endYear),
          })),
          "edu",
        ),
      };
    case "custom": {
      const d = obj(o.data);
      const id = str(o.id) || str(d.id) || `custom-${i + 1}`;
      const t = (o.template ?? d.template) as CustomSectionTemplate;
      const template = TEMPLATES.includes(t) ? t : "story";
      const customItems: CustomSectionItem[] = uniqueIds(
        list(d.items)
          .map(obj)
          .map((it) => ({
            id: str(it.id),
            title: optStr(it.title),
            subtitle: optStr(it.subtitle),
            body: optStr(it.body),
            image: optImage(it.image, "16:9"),
            linkText: optStr(it.linkText),
            linkUrl: optStr(it.linkUrl),
            highlight: optStr(it.highlight),
          })),
        `${id}-item`,
      );
      return {
        type: "custom",
        id,
        template,
        ...base,
        data: {
          id,
          template,
          heading: str(d.heading),
          subheading: optStr(d.subheading),
          body: optStr(d.body),
          image: optImage(d.image, "16:9"),
          ctaText: optStr(d.ctaText),
          ctaUrl: optStr(d.ctaUrl),
          items: customItems,
        },
      };
    }
    default:
      return null; // a section type this site doesn't know
  }
}

function normalizeVoices(v: unknown, prefix: string): ChatterVoice[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return uniqueIds(
    v.map(obj).map((x) => ({
      id: str(x.id),
      avatar: (CHATTER_AVATARS.includes(x.avatar as ChatterAvatar) ? x.avatar : "fiona") as ChatterAvatar,
      badge: optStr(x.badge),
      lines: strings(x.lines),
    })),
    prefix,
  );
}

function normalizeSettings(raw: unknown): SiteSettings | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const s = raw as Obj;
  const chatterRaw = obj(s.chatter);
  const chatter: SiteChatter | undefined =
    s.chatter && typeof s.chatter === "object"
      ? { hero: normalizeVoices(chatterRaw.hero, "hero-voice"), contact: normalizeVoices(chatterRaw.contact, "contact-voice") }
      : undefined;
  const seoRaw = s.seo && typeof s.seo === "object" ? obj(s.seo) : null;
  const devRaw = seoRaw && seoRaw.developerCredit && typeof seoRaw.developerCredit === "object" ? obj(seoRaw.developerCredit) : null;
  const overridesRaw = obj(s.companyOverrides);

  return {
    ...(s as SiteSettings),
    favicon: optImage(s.favicon, "1:1"),
    marquee: optStrings(s.marquee),
    customCompanies: Array.isArray(s.customCompanies)
      ? uniqueIds(
          s.customCompanies.map(obj).map((c) => ({
            id: str(c.id),
            name: str(c.name),
            logo: optImage(c.logo, "1:1"),
            showLogo: typeof c.showLogo === "boolean" ? c.showLogo : undefined,
          })),
          "company",
        )
      : undefined,
    companyOverrides: s.companyOverrides
      ? Object.fromEntries(
          Object.entries(overridesRaw).map(([k, v]) => {
            const o = obj(v);
            return [
              k,
              {
                displayName: optStr(o.displayName),
                showLogo: typeof o.showLogo === "boolean" ? o.showLogo : undefined,
                customLogo: optImage(o.customLogo, "1:1"),
              },
            ];
          }),
        )
      : undefined,
    copyrightText: optStr(s.copyrightText),
    projectCategories: optStrings(s.projectCategories),
    palette: optStr(s.palette),
    chatter,
    seo: seoRaw
      ? {
          metaTitle: optStr(seoRaw.metaTitle),
          metaDescription: optStr(seoRaw.metaDescription),
          canonicalUrl: optStr(seoRaw.canonicalUrl),
          ogImage: optImage(seoRaw.ogImage, "16:9"),
          twitterHandle: optStr(seoRaw.twitterHandle),
          keywords: optStrings(seoRaw.keywords),
          googleVerification: optStr(seoRaw.googleVerification),
          bingVerification: optStr(seoRaw.bingVerification),
          gaMeasurementId: optStr(seoRaw.gaMeasurementId),
          clarityProjectId: optStr(seoRaw.clarityProjectId),
          geoRegion: optStr(seoRaw.geoRegion),
          geoPlacename: optStr(seoRaw.geoPlacename),
          developerCredit: devRaw
            ? {
                enabled: bool(devRaw.enabled, true),
                name: str(devRaw.name),
                siteUrl: str(devRaw.siteUrl),
                role: optStr(devRaw.role),
                linkedinUrl: optStr(devRaw.linkedinUrl),
                githubUrl: optStr(devRaw.githubUrl),
              }
            : undefined,
        }
      : undefined,
  };
}

export function normalizeContent(raw: unknown): SiteContent {
  const c = obj(raw);
  // Nothing usable at all (null, a string, an empty object): the built-in content.
  if (!c.hero && !c.sections && !c.contact) return SEED_CONTENT;

  const h = obj(c.hero);
  const contact = obj(c.contact);
  const anchors = new Set<string>();
  const builtIns = new Set<string>();
  const sections = list(c.sections)
    .map((s, i) => normalizeSection(s, i))
    .filter((s): s is Section => s !== null)
    // each built-in section exists once (its id is its page anchor); custom ones may repeat
    .filter((s) => {
      if (s.type === "custom") return true;
      if (builtIns.has(s.type)) return false;
      builtIns.add(s.type);
      return true;
    })
    .map((s, i) => {
      // custom sections are linked by id (#sec-<id>): keep them unique on the page
      if (s.type !== "custom") return s;
      let id = s.id;
      while (anchors.has(id)) id = `${id}-${i + 1}`;
      anchors.add(id);
      return id === s.id ? s : { ...s, id, data: { ...s.data, id } };
    });

  return {
    hero: {
      name: str(h.name),
      tagline: str(h.tagline),
      shortBio: str(h.shortBio),
      photo: image(h.photo, "1:1"),
      avatar: optImage(h.avatar, "1:1"),
    },
    contact: {
      email: str(contact.email),
      phone: optStr(contact.phone),
      linkedinUrl: optStr(contact.linkedinUrl),
      resumeUrl: optStr(contact.resumeUrl),
    },
    sections,
    settings: normalizeSettings(c.settings),
  };
}
