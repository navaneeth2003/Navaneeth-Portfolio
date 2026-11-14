import type { ContactInfo, SiteSettings } from "@/lib/types";
import { DEFAULT_DEVELOPER } from "@/lib/seo";
import { ChevronRight } from "lucide-react";

export function Footer({
  name,
  contact,
  settings,
}: {
  name: string;
  contact: ContactInfo;
  settings?: SiteSettings;
}) {
  // The same ContactInfo the hero, nav and contact section read — the phone
  // number is deliberately never one of these links.
  const links = [
    { label: "Email", href: `mailto:${contact.email.trim()}` },
    contact.linkedinUrl ? { label: "LinkedIn", href: contact.linkedinUrl, external: true } : null,
    contact.resumeUrl ? { label: "Resume", href: contact.resumeUrl, external: true } : null,
  ].filter((l): l is { label: string; href: string; external?: boolean } => Boolean(l));

  const dev = settings?.seo?.developerCredit ?? DEFAULT_DEVELOPER;

  return (
    <footer className="relative overflow-hidden bg-transparent pb-6 pt-8 md:pb-8 md:pt-10">
      {/* Editorial segmented links ribbon (Image 2 aesthetic, elevated with micro-interactions) */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 md:px-12">
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-1 border-y border-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-white/[0.08]"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className="group relative flex min-h-[56px] items-center justify-between px-6 py-4 font-heading transition-colors duration-300 hover:bg-white/[0.03] active:bg-white/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-8 sm:py-5"
            >
              {/* Subtle top hairline accent on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <span className="text-[14px] font-normal tracking-wide text-white/70 transition-colors duration-300 group-hover:text-white sm:text-[15px]">
                {l.label}
              </span>

              <ChevronRight
                size={17}
                strokeWidth={1.8}
                className="text-white/35 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-white"
                aria-hidden
              />
            </a>
          ))}
        </nav>
      </div>

      <p
        aria-hidden
        className="pointer-events-none mx-auto mt-6 max-w-full select-none overflow-hidden whitespace-nowrap text-center font-heading text-[15vw] font-bold leading-[0.9] tracking-tight text-white/[0.09] sm:mt-8 sm:text-[16vw] md:mt-10 md:text-[13vw] lg:text-[11vw]"
      >
        {name}
      </p>
      <div className="mt-4 flex flex-col items-center justify-center gap-2 px-5 text-center font-heading text-[12px] leading-relaxed text-white/35 sm:flex-row sm:gap-3">
        <span>{settings?.copyrightText?.trim() || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</span>
        {dev.enabled && (
          <>
            <span className="hidden text-white/20 sm:inline" aria-hidden>
              •
            </span>
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span>{dev.role || "Developed by"}</span>
              <a
                href={dev.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {dev.name}
              </a>
              {(dev.linkedinUrl || dev.githubUrl) && (
                <span className="inline-flex items-center gap-1 text-white/45">
                  (
                  {dev.linkedinUrl && (
                    <a
                      href={dev.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      LinkedIn
                    </a>
                  )}
                  {dev.linkedinUrl && dev.githubUrl && <span aria-hidden>·</span>}
                  {dev.githubUrl && (
                    <a
                      href={dev.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      GitHub
                    </a>
                  )}
                  )
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </footer>
  );
}

