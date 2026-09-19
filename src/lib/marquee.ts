import type { CustomCompany, ImageRef, SiteContent } from "./types";
import { renderableSections } from "./types";

/** Companies from the visible Experience section, first occurrence wins. */
export function experienceCompanies(content: SiteContent): string[] {
  const experience = renderableSections(content).find((s) => s.type === "experience");
  if (!experience || experience.type !== "experience") return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const e of experience.items) {
    const name = e.company.trim();
    const key = name.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

/** Experience logo for a company name, if present in Experience items. */
export function experienceLogo(content: SiteContent, name: string): string | undefined {
  const key = name.trim().toLowerCase();
  for (const s of content.sections) {
    if (s.type !== "experience") continue;
    const match = s.items.find((e) => e.company.trim().toLowerCase() === key && e.logo?.url);
    if (match?.logo?.url) return match.logo.url;
  }
  return undefined;
}

/**
 * Resolved item for the Hero company banner (LogoStrip).
 * Supports automatic Experience synchronization, custom companies,
 * and independent logo visibility/custom logo overrides.
 */
export type BannerCompanyItem = {
  id: string;
  name: string;
  originalName?: string;
  isCustom: boolean;
  hasExperienceLogo: boolean;
  showLogo: boolean;
  logoSrc?: string;
  customLogo?: ImageRef;
};

/** Get the complete resolved banner companies for Studio editing. */
export function getBannerCompanies(content: SiteContent): BannerCompanyItem[] {
  const expNames = experienceCompanies(content);
  const overrides = content.settings?.companyOverrides ?? {};
  const customCompanies = content.settings?.customCompanies ?? [];

  const seen = new Set<string>();
  const result: BannerCompanyItem[] = [];

  // 1. Automatically sourced Experience companies
  for (const name of expNames) {
    const key = name.toLowerCase();
    seen.add(key);
    const expLogoSrc = experienceLogo(content, name);
    const override = overrides[key];
    const displayName = override?.displayName?.trim() || name;
    const showLogo = override?.showLogo !== false;
    const customLogo = override?.customLogo;
    const logoSrc = !showLogo ? undefined : (customLogo?.url || expLogoSrc);

    result.push({
      id: `exp-${key}`,
      name: displayName,
      originalName: name,
      isCustom: false,
      hasExperienceLogo: Boolean(expLogoSrc),
      showLogo,
      logoSrc,
      customLogo,
    });
  }

  // 2. Custom companies added in Studio (excluding duplicates of Experience companies)
  for (const c of customCompanies) {
    const name = c.name.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const showLogo = c.showLogo !== false;
    const logoSrc = showLogo ? c.logo?.url : undefined;

    result.push({
      id: c.id,
      name,
      isCustom: true,
      hasExperienceLogo: false,
      showLogo,
      logoSrc,
      customLogo: c.logo,
    });
  }

  return result;
}

/**
 * Resolved strip items for public site and preview.
 * Combines Experience companies and custom companies with their independent logo settings.
 */
export function getBannerStripItems(content: SiteContent): { label: string; src?: string }[] {
  // If legacy settings.marquee exists AND no customCompanies or companyOverrides have been configured,
  // preserve backward compatibility for sites that used the legacy string array.
  const hasV4Config =
    (content.settings?.customCompanies && content.settings.customCompanies.length > 0) ||
    (content.settings?.companyOverrides && Object.keys(content.settings.companyOverrides).length > 0);

  if (!hasV4Config && Array.isArray(content.settings?.marquee)) {
    return content.settings.marquee
      .map((n) => n.trim())
      .filter(Boolean)
      .map((name) => ({
        label: name,
        src: experienceLogo(content, name),
      }));
  }

  const items = getBannerCompanies(content);
  return items.map((item) => ({
    label: item.name,
    src: item.logoSrc,
  }));
}

/** Legacy helpers kept for backward compatibility */
export function marqueeIsCustom(content: SiteContent): boolean {
  return (
    Array.isArray(content.settings?.marquee) ||
    Boolean(content.settings?.customCompanies?.length) ||
    Boolean(content.settings?.companyOverrides && Object.keys(content.settings.companyOverrides).length > 0)
  );
}

export function marqueeNames(content: SiteContent): string[] {
  return getBannerStripItems(content).map((i) => i.label);
}

export function marqueeLogo(content: SiteContent, name: string): string | undefined {
  const items = getBannerStripItems(content);
  const match = items.find((i) => i.label.toLowerCase() === name.trim().toLowerCase());
  return match?.src;
}
