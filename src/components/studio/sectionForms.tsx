"use client";

import { CHAR_LIMITS, ITEM_LIMITS } from "@/lib/limits";
import type {
  About,
  CaseStudyBlock,
  CaseStudyMetric,
  CertificationItem,
  ContactInfo,
  EducationItem,
  ExperienceItem,
  Hero,
  ProjectItem,
  Section,
  SkillGroup,
  StatItem,
  ToolItem,
} from "@/lib/types";
import {
  CASE_STUDY_STAGES,
  PROFICIENCY_LEVELS,
  PROJECT_VERTICALS,
  SECTION_LABELS,
} from "@/lib/types";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { newId, SelectField, TextAreaField, TextField } from "./fields";
import { ImageField } from "./ImageField";
import { EntityList, StringListEditor } from "./lists";

export function HeroForm({ hero, onChange }: { hero: Hero; onChange: (h: Hero) => void }) {
  return (
    <div className="space-y-5">
      <TextField
        label="Name"
        value={hero.name}
        max={CHAR_LIMITS.hero.name}
        onChange={(name) => onChange({ ...hero, name })}
      />
      <TextField
        label="Tagline"
        value={hero.tagline}
        max={CHAR_LIMITS.hero.tagline}
        hint="Shown as the small chip above your name — keep it to one line."
        onChange={(tagline) => onChange({ ...hero, tagline })}
      />
      <TextAreaField
        label="Short bio"
        value={hero.shortBio}
        max={CHAR_LIMITS.hero.shortBio}
        rows={5}
        onChange={(shortBio) => onChange({ ...hero, shortBio })}
      />
      <ImageField
        label="Photo"
        image={hero.photo}
        ratio="1:1"
        pathPrefix="hero-photo"
        onChange={(photo) => onChange({ ...hero, photo: photo ?? { url: "", aspectRatio: "1:1" } })}
      />
    </div>
  );
}

export function ContactForm({
  contact,
  onChange,
}: {
  contact: ContactInfo;
  onChange: (c: ContactInfo) => void;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="Email"
        type="email"
        value={contact.email}
        onChange={(email) => onChange({ ...contact, email })}
      />
      <TextField
        label="Phone"
        value={contact.phone ?? ""}
        onChange={(phone) => onChange({ ...contact, phone: phone || undefined })}
      />
      <TextField
        label="LinkedIn URL"
        type="url"
        placeholder="https://linkedin.com/in/…"
        value={contact.linkedinUrl ?? ""}
        onChange={(linkedinUrl) => onChange({ ...contact, linkedinUrl: linkedinUrl || undefined })}
      />
      <TextField
        label="Resume URL"
        type="url"
        placeholder="https://…"
        hint="Shown as the Resume button in the header, hero, and footer."
        value={contact.resumeUrl ?? ""}
        onChange={(resumeUrl) => onChange({ ...contact, resumeUrl: resumeUrl || undefined })}
      />
    </div>
  );
}

export function AboutForm({ data, onChange }: { data: About; onChange: (a: About) => void }) {
  return (
    <div className="space-y-5">
      <TextField
        label="Heading"
        value={data.heading}
        max={CHAR_LIMITS.about.heading}
        onChange={(heading) => onChange({ ...data, heading })}
      />
      <TextAreaField
        label="Body"
        value={data.body}
        max={CHAR_LIMITS.about.body}
        rows={12}
        hint="A blank line starts a new paragraph."
        onChange={(body) => onChange({ ...data, body })}
      />
    </div>
  );
}

export function StatsForm({ items, onChange }: { items: StatItem[]; onChange: (i: StatItem[]) => void }) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.stats}
      addLabel="Add stat"
      emptyLabel="Nothing here yet — add your first stat."
      create={(): StatItem => ({ id: newId("stat"), value: "", label: "" })}
      itemTitle={(s) => (s.value ? `${s.value} ${s.label}` : s.label)}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Value"
              value={item.value}
              max={CHAR_LIMITS.stat.value}
              hint="e.g. 12+ — can be empty when the icon says it."
              onChange={(value) => update({ value })}
            />
            <TextField
              label="Label"
              value={item.label}
              max={CHAR_LIMITS.stat.label}
              onChange={(label) => update({ label })}
            />
          </div>
          <ImageField
            label="Icon (optional)"
            image={item.icon}
            ratio="1:1"
            pathPrefix={`stat-${item.id}`}
            onChange={(icon) => update({ icon })}
          />
        </div>
      )}
    />
  );
}

export function ExperienceForm({
  items,
  onChange,
}: {
  items: ExperienceItem[];
  onChange: (i: ExperienceItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.experience}
      addLabel="Add experience"
      emptyLabel="Nothing here yet — add your first role."
      create={(): ExperienceItem => ({
        id: newId("exp"),
        company: "",
        role: "",
        startDate: "",
        endDate: "present",
        bullets: [],
      })}
      itemTitle={(e) => [e.role, e.company].filter(Boolean).join(" · ")}
      renderFields={(item, update) => {
        const isPresent = item.endDate === "present";
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Role"
                value={item.role}
                max={CHAR_LIMITS.experience.role}
                onChange={(role) => update({ role })}
              />
              <TextField
                label="Company"
                value={item.company}
                max={CHAR_LIMITS.experience.company}
                onChange={(company) => update({ company })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Start"
                type="month"
                value={item.startDate}
                onChange={(startDate) => update({ startDate })}
              />
              <div>
                <TextField
                  label="End"
                  type="month"
                  value={isPresent ? "" : item.endDate}
                  onChange={(endDate) => update({ endDate })}
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) => update({ endDate: e.target.checked ? "present" : "" })}
                    className="h-4 w-4 accent-[#0b0d10]"
                  />
                  I currently work here
                </label>
              </div>
            </div>
            <StringListEditor
              label="Bullets"
              values={item.bullets}
              maxItems={ITEM_LIMITS.experienceBullets}
              maxChars={CHAR_LIMITS.experience.bullet}
              addLabel="Add bullet"
              multiline
              onChange={(bullets) => update({ bullets })}
            />
            <TextField
              label="Highlight"
              value={item.highlight ?? ""}
              max={CHAR_LIMITS.experience.highlight}
              hint="The one standout outcome — shown as a gold callout."
              onChange={(highlight) => update({ highlight: highlight || undefined })}
            />
            <StringListEditor
              label="Tags"
              values={item.tags ?? []}
              maxItems={ITEM_LIMITS.experienceTags}
              maxChars={CHAR_LIMITS.experience.tag}
              addLabel="Add tag"
              onChange={(tags) => update({ tags: tags.length ? tags : undefined })}
            />
            <ImageField
              label="Company logo (optional)"
              image={item.logo}
              ratio="1:1"
              pathPrefix={`logo-${item.id}`}
              onChange={(logo) => update({ logo })}
            />
          </div>
        );
      }}
    />
  );
}

/** Compact value+label pair list for case study metrics. */
function MetricsEditor({
  metrics,
  onChange,
}: {
  metrics: CaseStudyMetric[];
  onChange: (metrics: CaseStudyMetric[]) => void;
}) {
  return (
    <div>
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">Metrics</span>
        <span className="text-xs text-muted tabular-nums">
          {metrics.length} of {ITEM_LIMITS.caseStudyMetrics}
        </span>
      </span>
      <div className="mt-1.5 space-y-2">
        {metrics.map((m, i) => (
          <div key={m.id} className="flex items-center gap-1.5">
            <input
              className="w-24 rounded-[12px] border border-line bg-surface px-3 py-2 text-sm transition-colors duration-200 focus:border-accent focus:outline-none"
              value={m.value}
              maxLength={CHAR_LIMITS.caseStudy.metricValue}
              placeholder="58%"
              aria-label="Metric value"
              onChange={(e) =>
                onChange(metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
              }
            />
            <input
              className="min-w-0 flex-1 rounded-[12px] border border-line bg-surface px-3 py-2 text-sm transition-colors duration-200 focus:border-accent focus:outline-none"
              value={m.label}
              maxLength={CHAR_LIMITS.caseStudy.metricLabel}
              placeholder="Higher user activation"
              aria-label="Metric label"
              onChange={(e) =>
                onChange(metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
              }
            />
            <button
              type="button"
              aria-label="Remove metric"
              onClick={() => onChange(metrics.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={metrics.length >= ITEM_LIMITS.caseStudyMetrics}
          onClick={() => onChange([...metrics, { id: newId("metric"), value: "", label: "" }])}
          className="inline-flex items-center gap-1.5 rounded-[12px] border border-dashed border-line px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add metric
        </button>
      </div>
    </div>
  );
}

function CaseStudyEditor({
  project,
  update,
}: {
  project: ProjectItem;
  update: (patch: Partial<ProjectItem>) => void;
}) {
  const blocks = project.caseStudy?.blocks ?? [];

  function setBlocks(next: CaseStudyBlock[]) {
    update({ caseStudy: next.length > 0 ? { blocks: next } : undefined });
  }

  return (
    <div className="rounded-2xl border border-line bg-bg/60 p-4">
      <p className="text-sm font-semibold">Case study</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Tell the story right on the site, from problem to impact. With at least one part,
        &ldquo;Read case study&rdquo; opens your on-site page instead of the external link.
      </p>
      <div className="mt-4">
        <EntityList
          items={blocks}
          onChange={setBlocks}
          max={ITEM_LIMITS.caseStudyBlocks}
          addLabel="Add story part"
          emptyLabel="Nothing here yet — add the first part of the story."
          create={(): CaseStudyBlock => ({
            id: newId("cs"),
            stage: CASE_STUDY_STAGES[0],
            heading: "",
            body: "",
          })}
          itemTitle={(b) => (b.heading ? `${b.stage} — ${b.heading}` : b.stage)}
          renderFields={(block, patch) => (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Stage"
                  value={block.stage}
                  options={CASE_STUDY_STAGES}
                  onChange={(stage) => patch({ stage })}
                />
                <TextField
                  label="Heading"
                  value={block.heading}
                  max={CHAR_LIMITS.caseStudy.heading}
                  onChange={(heading) => patch({ heading })}
                />
              </div>
              <TextAreaField
                label="Body"
                value={block.body}
                max={CHAR_LIMITS.caseStudy.body}
                rows={6}
                hint="A blank line starts a new paragraph."
                onChange={(body) => patch({ body })}
              />
              <MetricsEditor
                metrics={block.metrics ?? []}
                onChange={(metrics) => patch({ metrics: metrics.length ? metrics : undefined })}
              />
              <ImageField
                label="Image (optional)"
                image={block.image}
                ratio="16:9"
                pathPrefix={`cs-${block.id}`}
                onChange={(image) => patch({ image })}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function ProjectsForm({
  items,
  onChange,
}: {
  items: ProjectItem[];
  onChange: (i: ProjectItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.projects}
      addLabel="Add project"
      emptyLabel="Nothing here yet — add your first project."
      create={(): ProjectItem => ({
        id: newId("proj"),
        vertical: PROJECT_VERTICALS[0],
        title: "",
        coverImage: { url: "", aspectRatio: "16:9" },
        overview: "",
      })}
      itemTitle={(p) => p.title}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <SelectField
            label="Vertical"
            value={item.vertical}
            options={PROJECT_VERTICALS}
            onChange={(vertical) => update({ vertical })}
          />
          <TextField
            label="Title"
            value={item.title}
            max={CHAR_LIMITS.project.title}
            onChange={(title) => update({ title })}
          />
          <ImageField
            label="Cover image"
            image={item.coverImage}
            ratio="16:9"
            pathPrefix={`cover-${item.id}`}
            onChange={(coverImage) =>
              update({ coverImage: coverImage ?? { url: "", aspectRatio: "16:9" } })
            }
          />
          <TextAreaField
            label="Overview"
            value={item.overview}
            max={CHAR_LIMITS.project.overview}
            rows={5}
            onChange={(overview) => update({ overview })}
          />
          <TextAreaField
            label="Results & impact (optional)"
            value={item.resultsAndImpact ?? ""}
            max={CHAR_LIMITS.project.resultsAndImpact}
            rows={4}
            onChange={(v) => update({ resultsAndImpact: v || undefined })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Live URL (optional)"
              type="url"
              placeholder="https://…"
              value={item.liveUrl ?? ""}
              onChange={(v) => update({ liveUrl: v || undefined })}
            />
            <TextField
              label="Case study URL (optional)"
              type="url"
              placeholder="https://…"
              hint="Used only when there's no on-site case study below."
              value={item.caseStudyUrl ?? ""}
              onChange={(v) => update({ caseStudyUrl: v || undefined })}
            />
          </div>
          <StringListEditor
            label="Tags"
            values={item.tags ?? []}
            maxItems={ITEM_LIMITS.projectTags}
            maxChars={CHAR_LIMITS.project.tag}
            addLabel="Add tag"
            onChange={(tags) => update({ tags: tags.length ? tags : undefined })}
          />
          <CaseStudyEditor project={item} update={update} />
        </div>
      )}
    />
  );
}

export function ToolsForm({ items, onChange }: { items: ToolItem[]; onChange: (i: ToolItem[]) => void }) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.tools}
      addLabel="Add tool"
      emptyLabel="Nothing here yet — add your first tool."
      create={(): ToolItem => ({
        id: newId("tool"),
        name: "",
        icon: { url: "", aspectRatio: "1:1" },
        level: "Beginner",
      })}
      itemTitle={(t) => t.name}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Name"
              value={item.name}
              max={CHAR_LIMITS.tool.name}
              onChange={(name) => update({ name })}
            />
            <SelectField
              label="Level"
              value={item.level}
              options={PROFICIENCY_LEVELS}
              onChange={(level) => update({ level })}
            />
          </div>
          <ImageField
            label="Icon"
            image={item.icon}
            ratio="1:1"
            pathPrefix={`tool-${item.id}`}
            onChange={(icon) => update({ icon: icon ?? { url: "", aspectRatio: "1:1" } })}
          />
        </div>
      )}
    />
  );
}

export function SkillsForm({
  items,
  onChange,
}: {
  items: SkillGroup[];
  onChange: (i: SkillGroup[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.skillGroups}
      addLabel="Add skill group"
      emptyLabel="Nothing here yet — add your first skill group."
      create={(): SkillGroup => ({ id: newId("skill-grp"), category: "", skills: [] })}
      itemTitle={(g) => g.category}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Category"
            value={item.category}
            max={CHAR_LIMITS.skillGroup.category}
            onChange={(category) => update({ category })}
          />
          <StringListEditor
            label="Skills"
            values={item.skills}
            maxItems={ITEM_LIMITS.skillsPerGroup}
            maxChars={CHAR_LIMITS.skillGroup.skill}
            addLabel="Add skill"
            onChange={(skills) => update({ skills })}
          />
        </div>
      )}
    />
  );
}

export function CertificationsForm({
  items,
  onChange,
}: {
  items: CertificationItem[];
  onChange: (i: CertificationItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.certifications}
      addLabel="Add certification"
      emptyLabel="Nothing here yet — add your first certification."
      create={(): CertificationItem => ({ id: newId("cert"), title: "", issuer: "" })}
      itemTitle={(c) => c.title}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Title"
            value={item.title}
            max={CHAR_LIMITS.certification.title}
            hint="Title only — the issuer has its own field."
            onChange={(title) => update({ title })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Issuer"
              value={item.issuer}
              max={CHAR_LIMITS.certification.issuer}
              onChange={(issuer) => update({ issuer })}
            />
            <TextField
              label="Date (optional)"
              type="month"
              value={item.date ?? ""}
              onChange={(v) => update({ date: v || undefined })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Credential ID (optional)"
              value={item.credentialId ?? ""}
              onChange={(v) => update({ credentialId: v || undefined })}
            />
            <TextField
              label="Credential URL (optional)"
              type="url"
              placeholder="https://…"
              value={item.credentialUrl ?? ""}
              onChange={(v) => update({ credentialUrl: v || undefined })}
            />
          </div>
          <ImageField
            label="Badge (optional)"
            image={item.badge}
            ratio="1:1"
            pathPrefix={`badge-${item.id}`}
            onChange={(badge) => update({ badge })}
          />
        </div>
      )}
    />
  );
}

export function EducationForm({
  items,
  onChange,
}: {
  items: EducationItem[];
  onChange: (i: EducationItem[]) => void;
}) {
  const yearOnly = (v: string) => v.replace(/\D/g, "").slice(0, 4);
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.education}
      addLabel="Add education"
      emptyLabel="Nothing here yet — add your first degree or program."
      create={(): EducationItem => ({ id: newId("edu"), degree: "", startYear: "", endYear: "" })}
      itemTitle={(e) => e.degree}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Degree / program"
            value={item.degree}
            max={CHAR_LIMITS.education.degree}
            onChange={(degree) => update({ degree })}
          />
          <TextField
            label="Institution (optional)"
            value={item.institution ?? ""}
            max={CHAR_LIMITS.education.institution}
            onChange={(v) => update({ institution: v || undefined })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Start year"
              value={item.startYear}
              onChange={(v) => update({ startYear: yearOnly(v) })}
            />
            <TextField
              label="End year"
              value={item.endYear}
              onChange={(v) => update({ endYear: yearOnly(v) })}
            />
          </div>
        </div>
      )}
    />
  );
}

/** Sections move up/down and toggle as whole units — never rearranged internally. */
export function SectionsManager({
  sections,
  onChange,
}: {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  function commit(list: Section[]) {
    onChange(list.map((s, i) => ({ ...s, order: i + 1 })));
  }

  function move(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[to]] = [next[to], next[index]];
    commit(next);
  }

  function itemCount(s: Section): string {
    if (s.type === "about") return "";
    return `${s.items.length} ${s.items.length === 1 ? "item" : "items"}`;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Hidden sections stay editable but don&apos;t appear on the site. Your hero and contact info
        are always on the page.
      </p>
      {ordered.map((s, i) => (
        <div
          key={s.type}
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
        >
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={`Move ${SECTION_LABELS[s.type]} up`}
              disabled={i === 0}
              onClick={() => move(i, -1)}
              className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label={`Move ${SECTION_LABELS[s.type]} down`}
              disabled={i === ordered.length - 1}
              onClick={() => move(i, 1)}
              className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{SECTION_LABELS[s.type]}</p>
            <p className="text-xs text-muted">
              {[itemCount(s), s.visible ? "Shown" : "Hidden"].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            type="button"
            aria-label={s.visible ? `Hide ${SECTION_LABELS[s.type]}` : `Show ${SECTION_LABELS[s.type]}`}
            onClick={() =>
              onChange(sections.map((x) => (x.type === s.type ? { ...x, visible: !x.visible } : x)))
            }
            className={`rounded-lg p-2 transition-colors duration-200 ${
              s.visible ? "text-ink" : "text-muted/60"
            } hover:bg-bg`}
          >
            {s.visible ? (
              <Eye className="h-4.5 w-4.5" strokeWidth={2} />
            ) : (
              <EyeOff className="h-4.5 w-4.5" strokeWidth={2} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
