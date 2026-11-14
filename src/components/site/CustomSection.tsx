"use client";

import Image from "next/image";
import { optimizableImage } from "@/lib/urls";
import { ArrowRight, ArrowUpRight, Layers, Lightbulb, Quote as QuoteIcon, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import type { CustomSectionData } from "@/lib/types";
import { paragraphs } from "@/lib/format";
import { BTN_BLACK, ButtonIcon, MagneticButton, ScrollReveal } from "@/components/ui";
import { AVATAR, AvatarTile, Eyebrow, IconTile, SECTION_Y, SectionHeader, WRAP, tileAt, tintAt } from "./kit";

const GRID_ICONS: LucideIcon[] = [Lightbulb, Rocket, Layers, Sparkles];

function Cta({ text, url }: { text?: string; url?: string }) {
  if (!text || !url) return null;
  const external = /^https?:\/\//i.test(url);
  return (
    <MagneticButton href={url} target={external ? "_blank" : undefined} className={BTN_BLACK}>
      {text}
      <ButtonIcon hover={{ x: 2, y: external ? -2 : 0 }}>
        {external ? (
          <ArrowUpRight size={18} strokeWidth={2.4} className="text-pop" />
        ) : (
          <ArrowRight size={18} strokeWidth={2.4} className="text-pop" />
        )}
      </ButtonIcon>
    </MagneticButton>
  );
}

/**
 * Owner-built sections, one of six CMS templates, each mapped onto a piece
 * of the reference: a centred story card, media + text, a feature-card grid,
 * pastel metric cards, a blush quote card and a glowing call to action. The
 * section's label becomes the eyebrow; its heading leads.
 */
export function CustomSection({ title, data }: { title: string; data: CustomSectionData }) {
  const { template, heading, subheading, body, image, ctaText, ctaUrl } = data;
  // Only items with something to show; no placeholder labels or headings.
  const items = (data.items ?? []).filter(
    (i) => i.title?.trim() || i.subtitle?.trim() || i.body?.trim() || i.highlight?.trim() || i.image?.url,
  );
  const eyebrow = subheading?.trim() || title.trim();
  const lead = heading?.trim() || title.trim();
  const paras = body ? paragraphs(body) : [];

  return (
    <section id={`sec-${data.id}`} className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        {/* 1 · story: the reference's big centred card */}
        {template === "story" && (
          <ScrollReveal>
            <div className="surface mx-auto flex max-w-[1080px] flex-col items-center rounded-[32px] px-5 py-12 text-center md:rounded-[44px] md:px-12 md:py-20 3xl:max-w-[1300px] 3xl:py-28">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {lead && (
                <h2 className="display mt-5 max-w-[20ch] text-[clamp(34px,9vw,46px)] md:mt-6 md:text-[60px] lg:text-[68px] 3xl:text-[92px]">{lead}</h2>
              )}
              {paras.length > 0 && (
                <div className="mt-6 max-w-[64ch] space-y-4 text-pretty text-[16px] leading-[1.7] text-ash md:mt-8 md:text-[18px] 3xl:text-[21px]">
                  {paras.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
              {ctaText && ctaUrl && (
                <div className="mt-9">
                  <Cta text={ctaText} url={ctaUrl} />
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* 2 · media + text */}
        {template === "media-text" && (
          <ScrollReveal>
            <div className="surface grid grid-cols-1 items-center gap-8 rounded-[32px] p-5 md:rounded-[44px] md:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14 3xl:p-20">
              <div>
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                {lead && <h2 className="display mt-5 text-[clamp(32px,8.6vw,42px)] md:text-[54px] lg:text-[56px] 3xl:text-[76px]">{lead}</h2>}
                {paras.length > 0 && (
                  <div className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-ash md:text-[17px] 3xl:text-[20px]">
                    {paras.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {ctaText && ctaUrl && (
                  <div className="mt-8">
                    <Cta text={ctaText} url={ctaUrl} />
                  </div>
                )}
              </div>
              {image?.url ? (
                <div className="relative aspect-[4/3] w-full rotate-[1.5deg] overflow-hidden rounded-[28px] border-[6px] border-white bg-well shadow-float">
                  <Image src={image.url} alt={lead} fill sizes="(min-width: 1024px) 50vw, 100vw" unoptimized={!optimizableImage(image.url)} className="object-cover" />
                </div>
              ) : (
                <div aria-hidden className={`relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[28px] ${tintAt(2)}`}>
                  <AvatarTile src={AVATAR.iris} tone="bg-tile-lemon" tilt={-6} float className="size-36 md:size-44" />
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* 3 · grid: the reference's white feature cards */}
        {template === "grid" && (
          <>
            <ScrollReveal>
              <SectionHeader eyebrow={eyebrow} title={lead} sub={body || undefined} size="md" />
            </ScrollReveal>
            <ul className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:mt-14 md:gap-5 3xl:gap-6">
              {items.map((item, idx) => (
                <li key={item.id} className="sm:w-[calc(50%-8px)] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.34px)] 3xl:w-[calc(33.333%-16px)]">
                  <ScrollReveal delay={Math.min((idx % 3) * 0.06, 0.12)} className="h-full">
                    <div className="surface flex h-full flex-col rounded-[28px] p-5 md:rounded-[32px] md:p-7 3xl:p-9">
                      {item.image?.url ? (
                        <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-well">
                          <Image src={item.image.url} alt={item.title || ""} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized={!optimizableImage(item.image.url)} className="object-cover" />
                        </div>
                      ) : (
                        <IconTile icon={GRID_ICONS[idx % GRID_ICONS.length]} className="mb-6 size-14" size={22} />
                      )}
                      {item.subtitle && <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-ash">{item.subtitle}</p>}
                      {item.title && (
                        <h3 className="mt-1.5 text-[19px] font-bold leading-snug tracking-[-0.02em] text-onyx md:text-[21px] 3xl:text-[25px]">{item.title}</h3>
                      )}
                      {item.body && <p className="mt-2.5 text-[15px] leading-relaxed text-ash md:text-[16px] 3xl:text-[19px]">{item.body}</p>}
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-onyx underline decoration-onyx/30 decoration-2 underline-offset-[5px] hover:decoration-onyx"
                        >
                          {item.linkText || "Learn more"}
                          <ArrowUpRight size={15} aria-hidden />
                        </a>
                      )}
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* 4 · metrics: pastel number cards */}
        {template === "metrics" && (
          <>
            <ScrollReveal>
              <SectionHeader eyebrow={eyebrow} title={lead} sub={body || undefined} size="md" />
            </ScrollReveal>
            <ul className="mt-10 flex flex-wrap justify-center gap-3 md:mt-14 md:gap-4 3xl:gap-6">
              {items.map((item, idx) => (
                <li key={item.id} className="w-[calc(50%-6px)] md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] 3xl:w-[calc(25%-18px)]">
                  <ScrollReveal delay={Math.min(idx * 0.06, 0.2)} className="h-full">
                    <div className={`flex h-full min-h-[160px] flex-col justify-end rounded-[26px] p-5 md:min-h-[200px] md:rounded-[32px] md:p-7 3xl:p-9 ${tintAt(idx)}`}>
                      <p className="display break-words text-[40px] md:text-[54px] 3xl:text-[76px]">{item.highlight || item.title || "—"}</p>
                      {item.subtitle && <p className="mt-2 text-[14px] font-bold text-onyx/75 md:text-[15px]">{item.subtitle}</p>}
                      {item.body && <p className="mt-1.5 text-[13.5px] leading-snug text-onyx/65 md:text-[14.5px]">{item.body}</p>}
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* 5 · quote: the blush "stories" card */}
        {template === "quote" && (
          <ScrollReveal>
            <figure className="relative mx-auto flex max-w-[1080px] flex-col items-center rounded-[32px] bg-blush px-5 py-12 text-center md:rounded-[44px] md:px-14 md:py-20 3xl:max-w-[1300px]">
              <div aria-hidden className="flex items-center">
                <AvatarTile src={AVATAR.rosa} tone="bg-tile-lemon" tilt={-6} border="border-4" className="size-16 md:size-20" />
                <AvatarTile src={AVATAR.ezra} tone="bg-tile-periwinkle" tilt={5} border="border-4" className="-ml-3 size-16 md:size-20" />
              </div>
              {title.trim() && (
                <>
                  <div className="mt-6">
                    <Eyebrow>{title}</Eyebrow>
                  </div>
                  <h2 className="sr-only">{title}</h2>
                </>
              )}
              {body && (
                <blockquote className="display mt-6 max-w-[26ch] text-[clamp(26px,7vw,34px)] leading-[1.15] tracking-[-0.035em] md:text-[44px] 3xl:text-[60px]">
                  <QuoteIcon aria-hidden className="mb-2 inline size-[0.8em] -translate-y-1 text-onyx/25" />
                  {body}
                </blockquote>
              )}
              {(heading || subheading) && (
                <figcaption className="mt-7">
                  {heading && <span className="block text-[16px] font-bold text-onyx md:text-[18px]">{heading}</span>}
                  {subheading && <span className="mt-1 block text-[14px] font-medium text-onyx/65 md:text-[15px]">{subheading}</span>}
                </figcaption>
              )}
              {ctaText && ctaUrl && (
                <div className="mt-8">
                  <Cta text={ctaText} url={ctaUrl} />
                </div>
              )}
            </figure>
          </ScrollReveal>
        )}

        {/* 6 · cta: the glowing final-call card */}
        {template === "cta" && (
          <ScrollReveal>
            <div
              className="relative isolate mx-auto flex max-w-[1180px] flex-col items-center overflow-hidden rounded-[32px] border border-hairline px-5 py-14 text-center shadow-card md:rounded-[44px] md:px-12 md:py-20 3xl:max-w-[1480px] 3xl:py-28"
              style={{ background: "linear-gradient(180deg, rgba(var(--glow), 0.95), var(--color-card) 100%)" }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
                <div className="absolute left-[6%] top-[16%]">
                  <AvatarTile src={AVATAR.maya} tone={tileAt(0)} tilt={-8} float className="size-24 lg:size-28" />
                </div>
                <div className="absolute right-[6%] top-[14%]">
                  <AvatarTile src={AVATAR.hazel} tone={tileAt(2)} tilt={7} float delay={1.2} className="size-24 lg:size-28" />
                </div>
                <div className="absolute bottom-[12%] left-[10%]">
                  <AvatarTile src={AVATAR.fiona} tone={tileAt(3)} tilt={6} float delay={2} className="size-20 lg:size-24" />
                </div>
                <div className="absolute bottom-[12%] right-[10%]">
                  <AvatarTile src={AVATAR.iris} tone={tileAt(1)} tilt={-6} float delay={0.6} className="size-20 lg:size-24" />
                </div>
              </div>
              {subheading && <Eyebrow>{subheading}</Eyebrow>}
              {lead && (
                <h2 className="display mt-5 max-w-[16ch] text-[clamp(36px,10vw,50px)] md:text-[68px] lg:text-[80px] 3xl:text-[108px]">{lead}</h2>
              )}
              {body && <p className="mt-5 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-ash md:text-[18px] 3xl:text-[21px]">{body}</p>}
              {ctaText && ctaUrl && (
                <div className="mt-9">
                  <Cta text={ctaText} url={ctaUrl} />
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
