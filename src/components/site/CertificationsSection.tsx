import type { CertificationItem } from "@/lib/types";
import { ArrowUpRight, Award } from "lucide-react";
import { formatMonth, RatioImage, SectionShell } from "./shared";

function CertificationCard({ item }: { item: CertificationItem }) {
  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start gap-4">
        {item.badge?.url ? (
          <RatioImage
            image={item.badge}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl border border-line"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
            <Award className="h-6 w-6 text-accent-ink" strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="leading-snug font-semibold tracking-tight break-words">{item.title}</h3>
          <p className="mt-1 text-sm text-muted break-words">
            {item.issuer}
            {item.date ? ` · ${formatMonth(item.date)}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
        {item.credentialId ? (
          <p className="utility truncate">ID · {item.credentialId}</p>
        ) : (
          <span />
        )}
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
  );
}

export function CertificationsSection({ items }: { items: CertificationItem[] }) {
  return (
    <SectionShell id="certifications" eyebrow="Certifications" heading="Credentials">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <CertificationCard key={item.id} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}
