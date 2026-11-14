import { ArrowUp, ArrowUpRight, FileText, Mail } from "lucide-react";
import type { ContactInfo, SiteSettings } from "@/lib/types";
import { DEFAULT_DEVELOPER } from "@/lib/seo";
import { LinkedInIcon } from "./ui";
import type { NavLink } from "./Navbar";
import { OwnerAvatar } from "./site/kit";

/**
 * The footer bookends the floating nav: one wide island at the foot of the
 * page. Inside, his avatar and name with the tagline, the page's own
 * section links, the ways to reach him (each a little coloured chip) and a
 * way back up. Underneath, quietly, the CMS's copyright and developer
 * credit. Phones stack it all, centred, clear of the tab bar.
 */
export function Footer({
  name,
  avatar,
  tagline,
  contact,
  settings,
  links,
}: {
  name: string;
  /** The studio's avatar (or photo); missing = the illustrated one. */
  avatar?: string;
  tagline?: string;
  contact: ContactInfo;
  settings?: SiteSettings;
  links: NavLink[];
}) {
  const dev = settings?.seo?.developerCredit ?? DEFAULT_DEVELOPER;
  const who = name.trim();
  const email = contact.email.trim();
  const linkedin = contact.linkedinUrl?.trim();
  const resume = contact.resumeUrl?.trim();

  const chip =
    "group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-card px-3 pr-4 text-[14px] font-semibold text-onyx shadow-pill transition-transform hover:-translate-y-0.5 3xl:min-h-[52px] 3xl:text-[16px]";
  const tile = "grid size-6 shrink-0 place-items-center rounded-[8px] 3xl:size-7";

  return (
    <footer className="relative px-3 pb-28 pt-8 md:px-5 md:pt-12 lg:pb-6 3xl:pb-10">
      <div className="mx-auto max-w-[1360px] 3xl:max-w-[1760px]">
        <div className="rounded-[32px] border border-hairline bg-card/75 px-6 py-8 shadow-card backdrop-blur md:rounded-[40px] md:px-9 md:py-9 lg:px-10 3xl:px-14 3xl:py-12">
          <div className="flex flex-col items-center gap-7 text-center md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-x-10 md:gap-y-7 md:text-left lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-12">
            {/* who */}
            <a href="#hero" aria-label={who ? `${who} — back to top` : "Back to top"} className="group flex flex-col items-center gap-3 md:flex-row md:gap-4">
              <OwnerAvatar src={avatar} className="size-14 3xl:size-16" />
              <span className="min-w-0">
                {who && <span className="block break-words text-[19px] font-extrabold tracking-[-0.035em] text-onyx 3xl:text-[23px]">{who}</span>}
                {tagline && (
                  <span className="mt-0.5 block max-w-[40ch] text-balance text-[14px] font-medium leading-snug text-ash 3xl:text-[16px]">
                    {tagline}
                  </span>
                )}
              </span>
            </a>

            {/* the page */}
            <nav aria-label="Footer" className="md:order-3 md:col-span-2 lg:order-none lg:col-span-1">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-[15px] font-semibold text-ash md:justify-start lg:justify-center 3xl:gap-x-8 3xl:text-[17px]">
                {links.map((l) => (
                  <li key={l.id}>
                    <a href={l.href} className="transition-colors hover:text-onyx">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* the ways in, and back up */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-end">
              {email && (
                <a href={`mailto:${email}`} className={chip}>
                  <span className={`${tile} bg-pop text-on-pop`}>
                    <Mail size={14} strokeWidth={2.2} aria-hidden />
                  </span>
                  Email
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className={chip}>
                  <span className={`${tile} bg-[#0a66c2] text-white`}>
                    <LinkedInIcon size={13} />
                  </span>
                  LinkedIn
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {resume && (
                <a href={resume} target="_blank" rel="noreferrer" className={chip}>
                  <span className={`${tile} bg-onyx text-on-onyx`}>
                    <FileText size={13} strokeWidth={2.2} aria-hidden />
                  </span>
                  Resume
                  <ArrowUpRight size={14} strokeWidth={2.3} className="-ml-0.5 text-ash" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              <a
                href="#hero"
                aria-label="Back to top"
                className="group grid size-11 place-items-center rounded-full bg-onyx text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5 3xl:size-[52px]"
              >
                <ArrowUp size={18} strokeWidth={2.4} className="transition-transform group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-1.5 px-2 text-center text-[13px] text-ash md:flex-row md:justify-between md:px-6 md:text-left 3xl:text-[15px]">
          <span>{settings?.copyrightText?.trim() || `© ${new Date().getFullYear()}${who ? ` ${who}` : ""}. All rights reserved.`}</span>
          {dev.enabled && (
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span>{dev.role || "Developed by"}</span>
              <a
                href={dev.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-onyx underline decoration-onyx/25 underline-offset-4 hover:decoration-onyx"
              >
                {dev.name}
              </a>
              {(dev.linkedinUrl || dev.githubUrl) && (
                <span className="inline-flex items-center gap-1">
                  (
                  {dev.linkedinUrl && (
                    <a href={dev.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-onyx">
                      LinkedIn
                    </a>
                  )}
                  {dev.linkedinUrl && dev.githubUrl && <span aria-hidden>·</span>}
                  {dev.githubUrl && (
                    <a href={dev.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-onyx">
                      GitHub
                    </a>
                  )}
                  )
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
