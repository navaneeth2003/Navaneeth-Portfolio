import type { ContactInfo } from "@/lib/types";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { GoldDot } from "./shared";

export function SiteFooter({ contact, name }: { contact: ContactInfo; name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="mt-16 scroll-mt-24 border-t border-line bg-surface px-5 sm:px-6 lg:px-8 md:mt-24">
      <div className="mx-auto max-w-6xl py-16 md:py-24" data-reveal>
        <p className="utility flex items-center gap-2 !text-accent-ink">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          Contact
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          <GoldDot text="Let's talk" />
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
          >
            <Mail className="h-4 w-4" strokeWidth={2} />
            {contact.email}
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-[14px] border border-line bg-bg px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink/30"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              {contact.phone}
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[14px] border border-line bg-bg px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink/30"
            >
              LinkedIn
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          )}
          {contact.resumeUrl && (
            <a
              href={contact.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[14px] border border-line bg-bg px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink/30"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          )}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="text-sm text-muted">
            © {year} {name}
          </p>
          <a href="#top" className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
