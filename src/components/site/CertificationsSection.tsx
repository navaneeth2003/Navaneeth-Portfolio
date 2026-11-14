"use client";

import { ArrowUpRight, BadgeCheck } from "lucide-react";
import type { CertificationItem } from "@/lib/types";
import { formatMonth, listJoin, plural } from "@/lib/format";
import { ScrollReveal } from "@/components/ui";
import { SafeImg, SECTION_Y, SectionHeader, WRAP, tileAt } from "./kit";

/**
 * Certifications as the reference's FAQ cards: off-white tiles in a grid —
 * one column on phones, two on tablets and laptops, three on large monitors,
 * with a short last row centred.
 * Each has its badge (or a check on a pastel squircle), the issuer, the
 * title, date and credential ID; a card with a credential URL is a link.
 */
export function CertificationsSection({ items, title }: { items: CertificationItem[]; title?: string }) {
  const issuers = Array.from(new Set(items.map((c) => c.issuer.trim()).filter(Boolean)));
  return (
    <section id="certifications" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        <ScrollReveal>
          <SectionHeader
            eyebrow={plural(items.length, "credential")}
            title={title || "Certifications"}
            sub={issuers.length ? `Earned from ${listJoin(issuers)}.` : undefined}
          />
        </ScrollReveal>
        <ul className="mt-10 flex flex-col gap-4 md:mt-14 md:flex-row md:flex-wrap md:justify-center md:gap-5 3xl:mt-16 3xl:gap-6">
          {items.map((c, i) => {
            const meta = [c.date ? formatMonth(c.date) : "", c.credentialId ? `ID ${c.credentialId}` : ""].filter(Boolean);
            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  {c.badge?.url ? (
                    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[30%] border-[3px] border-white bg-white shadow-float 3xl:size-16">
                      <SafeImg src={c.badge.url} loading="lazy" className="h-full w-full object-cover" fallback={<BadgeCheck size={24} strokeWidth={1.9} className="text-onyx" />} />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className={`grid size-14 shrink-0 -rotate-6 place-items-center rounded-[30%] border-[3px] border-white text-on-pop shadow-float 3xl:size-16 ${tileAt(i + 2)}`}
                    >
                      <BadgeCheck size={24} strokeWidth={1.9} />
                    </span>
                  )}
                  {c.credentialUrl && (
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-onyx text-on-onyx shadow-cta transition-transform duration-300 group-hover:rotate-45 3xl:size-12">
                      <ArrowUpRight size={18} strokeWidth={2.3} aria-hidden />
                    </span>
                  )}
                </div>
                <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.12em] text-ash 3xl:text-[15px]">{c.issuer}</p>
                <h3 className="mt-1.5 break-words text-[18px] font-bold leading-snug tracking-[-0.02em] text-onyx md:text-[20px] 3xl:text-[24px]">
                  {c.title}
                </h3>
                {meta.length > 0 && (
                  <p className="mt-auto flex flex-wrap gap-x-2 gap-y-1 pt-4 text-[13.5px] font-medium text-ash 3xl:text-[16px]">
                    {meta.map((m, mi) => (
                      <span key={mi} className="break-all">
                        {mi > 0 && (
                          <span aria-hidden className="mr-2 text-dust">
                            ·
                          </span>
                        )}
                        {m}
                      </span>
                    ))}
                  </p>
                )}
              </>
            );
            const card =
              "surface flex h-full flex-col rounded-[28px] p-5 md:rounded-[32px] md:p-7 3xl:rounded-[36px] 3xl:p-9";
            return (
              <li
                key={c.id}
                className={
                  items.length === 1
                    ? "md:w-full md:max-w-[620px]"
                    : `md:w-[calc(50%-10px)] ${items.length >= 3 ? "3xl:w-[calc(33.333%-16px)]" : ""}`
                }
              >
                <ScrollReveal delay={Math.min((i % 2) * 0.06, 0.12)} className="h-full">
                  {c.credentialUrl ? (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${c.title} — view credential (opens in a new tab)`}
                      className={`group ${card} rounded-[28px] transition-transform duration-500 hover:-translate-y-1`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={card}>{body}</div>
                  )}
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
