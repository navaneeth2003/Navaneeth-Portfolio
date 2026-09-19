"use client";

import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Sparkles, Quote as QuoteIcon } from "lucide-react";
import type { CustomSectionData, CustomSectionTemplate } from "@/lib/types";
import { ButtonIcon, GridLines, MagneticButton, ScrollReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

const PRIMARY_BUTTON =
  "min-h-[50px] items-center justify-center gap-2.5 bg-[#f2eee7] px-6 py-3.5 text-[15px] font-semibold text-black transition-colors duration-300 group-hover:bg-white group-active:bg-[#e7e1d6] sm:px-7 md:text-[16px]";

export function CustomSection({
  title,
  data,
}: {
  title: string;
  data: CustomSectionData;
}) {
  const { template, heading, subheading, body, image, ctaText, ctaUrl, items = [] } = data;

  return (
    <section id={`sec-${data.id}`} className="relative scroll-mt-24 overflow-hidden bg-transparent py-16 sm:py-20 md:py-24">
      <GridLines />

      {/* Ghost title & Semantic H2 heading */}
      <h2 className="sr-only">{title}</h2>
      <GhostTitle>{title}</GhostTitle>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6 md:px-12">
        <ScrollReveal>
          {/* Template 1: Story / Editorial narrative */}
          {template === "story" && (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-7 backdrop-blur-xl sm:p-10 md:p-14">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/80 to-transparent"
              />
              <div className="max-w-3xl">
                {subheading && (
                  <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent,#ff4a1a)]">
                    {subheading}
                  </p>
                )}
                {heading && (
                  <h3 className="mt-3 font-heading text-[clamp(26px,5vw,38px)] font-bold leading-tight tracking-tight text-white">
                    {heading}
                  </h3>
                )}
                {body && (
                  <div className="mt-6 space-y-4 font-heading text-[15px] font-light leading-relaxed text-white/80 sm:text-[17px]">
                    {body.split("\n\n").map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                )}
                {ctaText && ctaUrl && (
                  <div className="mt-8">
                    <MagneticButton href={ctaUrl} className={PRIMARY_BUTTON}>
                      {ctaText}
                      <ButtonIcon hover={{ x: 2, y: -2 }}>
                        <ArrowUpRight size={17} strokeWidth={2.2} />
                      </ButtonIcon>
                    </MagneticButton>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Template 2: Media + Text visual narrative */}
          {template === "media-text" && (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/80 to-transparent"
              />
              <div className="grid grid-cols-1 items-center gap-8 p-7 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
                <div>
                  {subheading && (
                    <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent,#ff4a1a)]">
                      {subheading}
                    </p>
                  )}
                  {heading && (
                    <h3 className="mt-3 font-heading text-[clamp(26px,5vw,38px)] font-bold leading-tight tracking-tight text-white">
                      {heading}
                    </h3>
                  )}
                  {body && (
                    <div className="mt-5 space-y-3.5 font-heading text-[15px] font-light leading-relaxed text-white/80 sm:text-[16px]">
                      {body.split("\n\n").map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  )}
                  {ctaText && ctaUrl && (
                    <div className="mt-7">
                      <MagneticButton href={ctaUrl} className={PRIMARY_BUTTON}>
                        {ctaText}
                        <ButtonIcon hover={{ x: 2, y: -2 }}>
                          <ArrowUpRight size={17} strokeWidth={2.2} />
                        </ButtonIcon>
                      </MagneticButton>
                    </div>
                  )}
                </div>

                {image?.url && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <Image
                      src={image.url}
                      alt={heading || title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Template 3: Cards / Grid */}
          {template === "grid" && (
            <div className="space-y-8">
              {(heading || subheading || body) && (
                <div className="max-w-2xl">
                  {subheading && (
                    <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent,#ff4a1a)]">
                      {subheading}
                    </p>
                  )}
                  {heading && (
                    <h3 className="mt-2 font-heading text-[clamp(24px,4vw,34px)] font-bold leading-tight tracking-tight text-white">
                      {heading}
                    </h3>
                  )}
                  {body && (
                    <p className="mt-3 font-heading text-[15px] font-light leading-relaxed text-white/75 sm:text-[16px]">
                      {body}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-black/40"
                  >
                    <div>
                      {item.image?.url && (
                        <div className="mb-4 relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
                          <Image
                            src={item.image.url}
                            alt={item.title || "Item image"}
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      {item.subtitle && (
                        <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-[var(--color-accent,#ff4a1a)]">
                          {item.subtitle}
                        </p>
                      )}
                      {item.title && (
                        <h4 className="mt-1 font-heading text-[18px] font-semibold tracking-tight text-white">
                          {item.title}
                        </h4>
                      )}
                      {item.body && (
                        <p className="mt-2.5 font-heading text-[14px] font-light leading-relaxed text-white/70">
                          {item.body}
                        </p>
                      )}
                    </div>

                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 font-heading text-[13px] font-medium text-[var(--color-accent,#ff4a1a)] transition-colors hover:underline"
                      >
                        {item.linkText || "Learn more"}
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template 4: Metrics / Highlights */}
          {template === "metrics" && (
            <div className="space-y-8">
              {(heading || subheading || body) && (
                <div className="max-w-2xl">
                  {subheading && (
                    <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent,#ff4a1a)]">
                      {subheading}
                    </p>
                  )}
                  {heading && (
                    <h3 className="mt-2 font-heading text-[clamp(24px,4vw,34px)] font-bold leading-tight tracking-tight text-white">
                      {heading}
                    </h3>
                  )}
                  {body && (
                    <p className="mt-3 font-heading text-[15px] font-light leading-relaxed text-white/75 sm:text-[16px]">
                      {body}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/60 to-transparent"
                    />
                    <p className="font-heading text-[clamp(32px,4vw,48px)] font-bold leading-none tracking-tight text-white">
                      {item.highlight || item.title || "—"}
                    </p>
                    {item.subtitle && (
                      <p className="mt-2 font-heading text-[13px] font-medium text-[var(--color-accent,#ff4a1a)]">
                        {item.subtitle}
                      </p>
                    )}
                    {item.body && (
                      <p className="mt-2 font-heading text-[13px] font-light leading-snug text-white/70">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template 5: Quote / Testimonial */}
          {template === "quote" && (
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-8 text-center backdrop-blur-xl sm:p-12 md:p-16">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/80 to-transparent"
              />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent,#ff4a1a)]/10 text-[var(--color-accent,#ff4a1a)]">
                <QuoteIcon size={24} />
              </div>
              {body && (
                <blockquote className="mt-6 font-heading text-[clamp(20px,3.5vw,28px)] font-normal italic leading-relaxed text-white">
                  &ldquo;{body}&rdquo;
                </blockquote>
              )}
              {heading && (
                <p className="mt-6 font-heading text-[16px] font-semibold text-white">
                  {heading}
                </p>
              )}
              {subheading && (
                <p className="mt-1 font-heading text-[13px] font-light text-white/60">
                  {subheading}
                </p>
              )}
            </div>
          )}

          {/* Template 6: CTA / Callout */}
          {template === "cta" && (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-[var(--color-accent,#ff4a1a)]/15 p-8 backdrop-blur-xl sm:p-12 md:p-16 text-center">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/80 to-transparent"
              />
              <div className="mx-auto max-w-2xl">
                {subheading && (
                  <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent,#ff4a1a)]">
                    {subheading}
                  </p>
                )}
                {heading && (
                  <h3 className="mt-3 font-heading text-[clamp(28px,5vw,44px)] font-bold leading-tight tracking-tight text-white">
                    {heading}
                  </h3>
                )}
                {body && (
                  <p className="mt-4 font-heading text-[15px] font-light leading-relaxed text-white/80 sm:text-[17px]">
                    {body}
                  </p>
                )}
                {ctaText && ctaUrl && (
                  <div className="mt-8 flex justify-center">
                    <MagneticButton href={ctaUrl} className={PRIMARY_BUTTON}>
                      {ctaText}
                      <ButtonIcon hover={{ x: 2, y: -2 }}>
                        <ArrowUpRight size={17} strokeWidth={2.2} />
                      </ButtonIcon>
                    </MagneticButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
