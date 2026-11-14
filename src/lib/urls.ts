import type { ImageRef, Section, SiteContent } from "./types";

/**
 * Every URL the site renders comes from the studio's free-text fields, and
 * anything the owner (or a compromised owner session) types ends up in an
 * href or src. These helpers are the one place that decides what is allowed
 * to reach the page: web URLs and same-origin paths only — never javascript:,
 * data:, vbscript: or anything else a browser might execute or misinterpret.
 * A value that fails simply disappears, exactly as if the field were empty,
 * so the components keep their "no value → no link" behaviour unchanged.
 */

const ABSOLUTE = /^https?:\/\//i;
const ROOT_RELATIVE = /^\/(?!\/)/;
const UNSAFE_CHARS = /[\s\p{Cc}]/u;

/** A link the site may render as an href (http, https or a root-relative path); undefined otherwise. */
export function safeLinkUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v || UNSAFE_CHARS.test(v)) return undefined;
  if (ROOT_RELATIVE.test(v)) return v;
  if (!ABSOLUTE.test(v)) return undefined;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? v : undefined;
  } catch {
    return undefined;
  }
}

/** An image source the site may render (uploads are https Supabase URLs); same rule as links. */
export const safeImageUrl = safeLinkUrl;

function img(ref: ImageRef): ImageRef {
  return { ...ref, url: safeImageUrl(ref.url) ?? "" };
}

function optionalImg(ref: ImageRef | undefined): ImageRef | undefined {
  return ref ? img(ref) : undefined;
}

/**
 * The content with every user-configurable URL passed through the rules
 * above. Applied once, in the single render path, so the public page and the
 * studio preview are protected the same way; nothing else about the content
 * is touched and nothing is written back.
 */
export function sanitizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    hero: { ...content.hero, photo: img(content.hero.photo) },
    contact: {
      ...content.contact,
      linkedinUrl: safeLinkUrl(content.contact.linkedinUrl),
      resumeUrl: safeLinkUrl(content.contact.resumeUrl),
    },
    settings: content.settings
      ? {
          ...content.settings,
          favicon: optionalImg(content.settings.favicon),
          customCompanies: content.settings.customCompanies?.map((c) => ({
            ...c,
            logo: optionalImg(c.logo),
          })),
          companyOverrides: content.settings.companyOverrides
            ? Object.fromEntries(
                Object.entries(content.settings.companyOverrides).map(([k, v]) => [
                  k,
                  { ...v, customLogo: optionalImg(v.customLogo) },
                ]),
              )
            : undefined,
          seo: content.settings.seo
            ? {
                ...content.settings.seo,
                canonicalUrl: safeLinkUrl(content.settings.seo.canonicalUrl),
                ogImage: optionalImg(content.settings.seo.ogImage),
                developerCredit: content.settings.seo.developerCredit
                  ? {
                      ...content.settings.seo.developerCredit,
                      siteUrl: safeLinkUrl(content.settings.seo.developerCredit.siteUrl) ?? "https://amith.site/",
                      linkedinUrl: safeLinkUrl(content.settings.seo.developerCredit.linkedinUrl),
                      githubUrl: safeLinkUrl(content.settings.seo.developerCredit.githubUrl),
                    }
                  : undefined,
              }
            : undefined,
        }
      : content.settings,
    sections: content.sections.map((s): Section => {
      switch (s.type) {
        case "stats":
          return { ...s, items: s.items.map((i) => ({ ...i, icon: optionalImg(i.icon) })) };
        case "experience":
          return { ...s, items: s.items.map((i) => ({ ...i, logo: optionalImg(i.logo) })) };
        case "projects":
          return {
            ...s,
            items: s.items.map((i) => ({
              ...i,
              coverImage: img(i.coverImage),
              liveUrl: safeLinkUrl(i.liveUrl),
              caseStudyUrl: safeLinkUrl(i.caseStudyUrl),
            })),
          };
        case "tools":
          return { ...s, items: s.items.map((i) => ({ ...i, icon: img(i.icon) })) };
        case "certifications":
          return {
            ...s,
            items: s.items.map((i) => ({
              ...i,
              credentialUrl: safeLinkUrl(i.credentialUrl),
              badge: optionalImg(i.badge),
            })),
          };
        case "custom":
          return {
            ...s,
            data: {
              ...s.data,
              image: optionalImg(s.data.image),
              ctaUrl: safeLinkUrl(s.data.ctaUrl),
              items: s.data.items?.map((item) => ({
                ...item,
                image: optionalImg(item.image),
                linkUrl: safeLinkUrl(item.linkUrl),
              })),
            },
          };
        default:
          return s;
      }
    }),
  };
}
