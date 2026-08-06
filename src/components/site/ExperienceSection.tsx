"use client";

import type { ExperienceItem } from "@/lib/types";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { EASE, Rise } from "./motion/primitives";
import { formatRange, Pill, RatioImage, SectionShell } from "./shared";

/** A gold period on the rail that pops (with one soft ring) as the rail reaches it. */
function TimelineNode() {
  return (
    <span aria-hidden className="absolute top-9 -left-[36px] flex h-2 w-2">
      <motion.span
        className="absolute inset-0 rounded-full bg-accent"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -30% 0px" }}
        transition={{ duration: 0.35, ease: EASE }}
      />
      <motion.span
        className="absolute -inset-1.5 rounded-full border border-accent"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1.8, opacity: [0, 0.5, 0] }}
        viewport={{ once: true, margin: "0px 0px -30% 0px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      />
    </span>
  );
}

function TimelineCard({ item }: { item: ExperienceItem }) {
  return (
    <div className="relative">
      <TimelineNode />
      <Rise>
        <article className="card group p-6 transition-colors duration-200 hover:border-ink/15 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 items-center gap-4">
              <RatioImage
                image={item.logo}
                alt=""
                fallbackText={item.company}
                className="h-12 w-12 shrink-0 rounded-xl border border-line"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight break-words">{item.role}</h3>
                <p className="text-sm font-medium text-muted break-words">{item.company}</p>
              </div>
            </div>
            <motion.span
              className="utility rounded-full bg-bg px-3 py-1.5 whitespace-nowrap"
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            >
              {formatRange(item.startDate, item.endDate)}
            </motion.span>
          </div>

          {/* Outcome leads; bullets are the evidence. The gold rule draws first. */}
          {item.highlight && (
            <div className="relative mt-6 overflow-hidden rounded-2xl bg-accent-soft/60 px-5 py-4">
              <motion.span
                aria-hidden
                className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-accent"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <p className="utility !text-accent-ink/80">Key outcome</p>
                <p className="mt-1.5 text-[15px] leading-relaxed font-medium text-accent-ink break-words">
                  {item.highlight}
                </p>
              </motion.div>
            </div>
          )}

          {item.bullets.length > 0 && (
            <motion.ul
              className="mt-6 space-y-3"
              initial="hide"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
            >
              {item.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3 text-[15px] leading-relaxed text-ink-soft/90"
                  variants={{
                    hide: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                >
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="min-w-0 break-words">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((t, i) => (
                <Pill key={i}>{t}</Pill>
              ))}
            </div>
          )}
        </article>
      </Rise>
    </div>
  );
}

/**
 * The timeline draws itself: a gold rail fills top-to-bottom with scroll, and
 * each role's node pops as the drawn edge passes it. History rests lit.
 */
export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.72", "end 0.72"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.6 });

  return (
    <SectionShell id="experience" eyebrow="Experience" heading="Where I've worked">
      <div ref={railRef} className="relative pl-10">
        <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
        <motion.span
          aria-hidden
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent"
          style={{ scaleY }}
        />
        <div className="space-y-6">
          {items.map((item) => (
            <TimelineCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
