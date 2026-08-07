"use client";

import type { CertificationItem } from "@/lib/types";
import { ArrowUpRight, Award } from "lucide-react";
import { motion } from "motion/react";
import { EASE, Rise } from "./motion/primitives";
import { formatMonth, RatioImage, SectionShell } from "./shared";

function CertificationCard({ item, index }: { item: CertificationItem; index: number }) {
  const delay = index * 0.09;
  return (
    <Rise delay={delay}>
      <article className="card group flex h-full flex-col p-6 transition-colors duration-200 hover:border-ink/15">
        <div className="flex items-start gap-4">
          {/* The seal stamps in: scale settles from above-size, like a press. */}
          <motion.div
            initial={{ scale: 1.25, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.35, ease: EASE, delay: delay + 0.15 }}
            className="shrink-0 rounded-xl transition-shadow duration-300 group-hover:shadow-[0_0_0_2px_rgba(185,133,76,0.35)]"
          >
            {item.badge?.url ? (
              <RatioImage image={item.badge} alt="" className="h-12 w-12 rounded-xl border border-line" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
                <Award className="h-6 w-6 text-accent-ink" strokeWidth={2} />
              </span>
            )}
          </motion.div>
          <div className="min-w-0">
            <h3 className="leading-snug font-semibold tracking-tight break-words">{item.title}</h3>
            <p className="mt-1 text-sm text-muted break-words">
              {item.issuer}
              {item.date ? ` · ${formatMonth(item.date)}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
          {item.credentialId ? <p className="utility truncate">ID · {item.credentialId}</p> : <span />}
          {item.credentialUrl && (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent-ink"
            >
              Verify
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          )}
        </div>
      </article>
    </Rise>
  );
}

export function CertificationsSection({ items }: { items: CertificationItem[] }) {
  return (
    <SectionShell id="certifications" eyebrow="Certifications" heading="Credentials">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <CertificationCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
