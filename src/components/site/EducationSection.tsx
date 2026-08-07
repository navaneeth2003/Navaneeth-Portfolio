"use client";

import type { EducationItem } from "@/lib/types";
import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { EASE } from "./motion/primitives";
import { SectionShell } from "./shared";

/** The quiet record: dividers draw left to right, rows settle in sequence. */
export function EducationSection({ items }: { items: EducationItem[] }) {
  return (
    <SectionShell id="education" eyebrow="Education" heading="Where I studied">
      <div className="card !p-0">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="relative"
            initial="hide"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          >
            {i > 0 && (
              <motion.span
                aria-hidden
                className="absolute top-0 right-6 left-6 h-px origin-left bg-line"
                variants={{
                  hide: { scaleX: 0 },
                  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: i * 0.12 } },
                }}
              />
            )}
            <motion.div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-6 transition-colors duration-200 hover:bg-accent-soft/25 md:px-8"
              variants={{
                hide: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: i * 0.12 } },
              }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                <GraduationCap className="h-5 w-5 text-accent-ink" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 basis-56">
                <h3 className="font-semibold tracking-tight break-words">{item.degree}</h3>
                {item.institution && (
                  <p className="mt-0.5 text-sm text-muted break-words">{item.institution}</p>
                )}
              </div>
              <motion.span
                className="utility whitespace-nowrap"
                variants={{
                  hide: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.4, delay: i * 0.12 + 0.25 } },
                }}
              >
                {item.startYear} — {item.endYear}
              </motion.span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
