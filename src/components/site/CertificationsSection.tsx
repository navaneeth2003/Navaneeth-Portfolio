"use client";

import { ArrowUpRight, Award } from "lucide-react";
import type { CertificationItem } from "@/lib/types";
import { formatMonth, pad2 } from "@/lib/format";
import { GridLines, ScrollReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

/**
 * Certifications in the reference's frosted list container (the FAQ glass):
 * numbered rows with the credential on the left and the badge or link on
 * the right. Rows only become links when a credential URL exists.
 */
export function CertificationsSection({ items, title }: { items: CertificationItem[]; title?: string }) {
  return (
    <section
      id="certifications"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-4 pb-16 pt-6 sm:px-6 md:px-10 md:pb-20 md:pt-10"
    >
      <GridLines />
      <GhostTitle>{title || "Certifications"}</GhostTitle>
      <div className="relative z-[2] mx-auto mt-2 max-w-[1100px] overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl md:mt-6">
        {items.map((c, i) => {
          const meta = [
            c.issuer,
            c.date ? formatMonth(c.date) : "",
            c.credentialId ? `Credential ID ${c.credentialId}` : "",
          ].filter(Boolean);
          const inner = (
            <>
              <span className="font-heading text-[14px] tabular-nums text-white/40 md:text-[16px]">{pad2(i + 1)}</span>
              <span className="min-w-0">
                <span className="block text-balance break-words font-heading text-[15px] font-medium leading-snug text-white sm:text-[16px] md:text-[20px]">
                  {c.title}
                </span>
                <span className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 font-heading text-[13px] text-white/55 sm:text-[14px]">
                  {meta.map((m, mi) => (
                    <span key={mi} className="break-words border-l border-white/20 pl-2 first:border-l-0 first:pl-0">
                      {m}
                    </span>
                  ))}
                </span>
              </span>
              <span className="justify-self-end">
                {c.badge?.url ? (
                  <span className="block size-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] sm:size-11">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.badge.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </span>
                ) : c.credentialUrl ? (
                  <span className="grid size-9 place-items-center rounded-full bg-white/[0.06] text-white transition-transform duration-300 group-hover:rotate-45 sm:size-8 sm:bg-transparent">
                    <ArrowUpRight size={20} aria-hidden />
                  </span>
                ) : (
                  <span className="grid size-9 place-items-center rounded-full text-white/35 sm:size-8">
                    <Award size={20} aria-hidden />
                  </span>
                )}
              </span>
            </>
          );
          const rowClass =
            "grid min-h-[64px] w-full grid-cols-[32px_1fr_44px] items-center gap-2 px-4 py-5 text-left sm:grid-cols-[48px_1fr_48px] md:px-6 md:py-6";
          return (
            <ScrollReveal key={c.id} delay={Math.min(i * 0.04, 0.2)}>
              <div className="border-b border-white/20 last:border-b-0">
                {c.credentialUrl ? (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${c.title} — view credential`}
                    className={`group ${rowClass} transition-colors hover:bg-white/[0.04] active:bg-white/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={rowClass}>{inner}</div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
