"use client";

import {
  loadOrSeedSite,
  publishDraft,
  restoreVersion,
  saveDraft,
} from "@/lib/content";
import { getSupabase, isOwnerEmail, OWNER_EMAILS, supabaseEnabled } from "@/lib/supabase";
import type { HistoryEntry, Section, SectionType, SiteContent } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  BarChart3,
  Briefcase,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  History as HistoryIcon,
  Home,
  Layers,
  LogOut,
  Mail,
  Sparkles,
  User as UserIcon,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HistoryView, formatWhen } from "./HistoryView";
import { Preview } from "./Preview";
import {
  AboutForm,
  CertificationsForm,
  ContactForm,
  EducationForm,
  ExperienceForm,
  HeroForm,
  ProjectsForm,
  SectionsManager,
  SkillsForm,
  StatsForm,
  ToolsForm,
} from "./sectionForms";

type Screen = "overview" | "sections" | "history" | "hero" | "contact" | SectionType;

const NAV: { key: Screen; label: string; Icon: typeof Home }[] = [
  { key: "overview", label: "Overview", Icon: Home },
  { key: "sections", label: "Sections", Icon: Layers },
  { key: "hero", label: "Hero", Icon: UserIcon },
  { key: "about", label: "About", Icon: FileText },
  { key: "stats", label: "Stats", Icon: BarChart3 },
  { key: "experience", label: "Experience", Icon: Briefcase },
  { key: "projects", label: "Projects", Icon: FolderOpen },
  { key: "tools", label: "Tools", Icon: Wrench },
  { key: "skills", label: "Core skills", Icon: Sparkles },
  { key: "certifications", label: "Certifications", Icon: Award },
  { key: "education", label: "Education", Icon: GraduationCap },
  { key: "contact", label: "Contact", Icon: Mail },
  { key: "history", label: "History", Icon: HistoryIcon },
];

const SCREEN_TITLES: Record<Screen, string> = {
  overview: "Overview",
  sections: "Sections",
  history: "Version history",
  hero: "Hero",
  contact: "Contact",
  ...SECTION_LABELS,
};

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <div className="card w-full max-w-md p-8 text-center">{children}</div>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-base font-bold text-white">
      N<span className="text-accent">.</span>
    </span>
  );
}

export function StudioApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authStep, setAuthStep] = useState<"email" | "code">("email");
  const [authBusy, setAuthBusy] = useState(false);

  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [published, setPublished] = useState<SiteContent | null>(null);
  const [meta, setMeta] = useState<{ version: number; publishedAt: string } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [screen, setScreen] = useState<Screen>("overview");
  const [showPreview, setShowPreview] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const skipNextSave = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const enabled = supabaseEnabled();
  const authorized = OWNER_EMAILS.length > 0 && isOwnerEmail(user?.email);

  function showToast(msg: string) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => {
    if (!enabled) return;
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, [enabled]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    (async () => {
      try {
        const site = await loadOrSeedSite();
        if (cancelled) return;
        skipNextSave.current = true;
        setDraft(site.draft);
        setPublished(site.published);
        setMeta({ version: site.version, publishedAt: site.publishedAt });
        setHistory(site.history);
      } catch {
        if (!cancelled) setLoadError("Couldn't load your content. Refresh to try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authorized]);

  // Autosave — every edit lands in `draft` shortly after typing stops.
  useEffect(() => {
    if (!draft) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await saveDraft(draft);
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draft]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const email = authEmail.trim().toLowerCase();
    if (OWNER_EMAILS.length === 0 || !isOwnerEmail(email)) {
      setAuthError("This studio is private — that email doesn't have access.");
      return;
    }
    setAuthBusy(true);
    try {
      const { error } = await getSupabase().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setAuthStep("code");
    } catch {
      setAuthError("Couldn't send the code. Wait a minute and try again.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      const { error } = await getSupabase().auth.verifyOtp({
        email: authEmail.trim().toLowerCase(),
        token: authCode.trim(),
        type: "email",
      });
      if (error) throw error;
    } catch {
      setAuthError("That code didn't work — check it and try again.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handlePublish() {
    if (!draft || !meta || busy) return;
    setBusy(true);
    try {
      const prev = meta;
      const prevPublished = published;
      const res = await publishDraft(draft);
      if (prevPublished) {
        setHistory((h) =>
          [{ version: prev.version, publishedAt: prev.publishedAt, content: prevPublished }, ...h].slice(0, 20),
        );
      }
      setPublished(draft);
      setMeta(res);
      showToast("Published.");
    } catch {
      showToast("Publish didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore(entry: HistoryEntry) {
    if (busy) return;
    setBusy(true);
    try {
      const next = await restoreVersion(entry);
      skipNextSave.current = true;
      setDraft(next.draft);
      setPublished(next.published);
      setMeta({ version: next.version, publishedAt: next.publishedAt });
      setHistory(next.history);
      showToast(`Restored version ${entry.version}.`);
    } catch {
      showToast("Restore didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function section<T extends SectionType>(type: T): Extract<Section, { type: T }> | undefined {
    return draft?.sections.find((s): s is Extract<Section, { type: T }> => s.type === type);
  }

  function patchSection(type: SectionType, patch: Partial<Section>) {
    setDraft((d) =>
      d
        ? { ...d, sections: d.sections.map((s) => (s.type === type ? ({ ...s, ...patch } as Section) : s)) }
        : d,
    );
  }

  // ---- Render branches ----

  if (!enabled) {
    return (
      <Splash>
        <BrandMark />
        <h1 className="mt-4 text-xl font-semibold">Connect Supabase to open the studio</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Fill in <code className="rounded bg-bg px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-bg px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-bg px-1.5 py-0.5">.env.local</code>, run{" "}
          <code className="rounded bg-bg px-1.5 py-0.5">supabase/setup.sql</code> in the SQL editor,
          then restart the app. The public site keeps working from the built-in content in the
          meantime.
        </p>
      </Splash>
    );
  }

  if (user === undefined) {
    return (
      <Splash>
        <p className="text-sm text-muted">Opening the studio…</p>
      </Splash>
    );
  }

  if (user && !authorized) {
    return (
      <Splash>
        <div className="flex justify-center">
          <BrandMark />
        </div>
        <h1 className="mt-4 text-xl font-semibold">This studio is private</h1>
        <p className="mt-2 text-sm text-muted">
          {user.email ?? "That account"} doesn&apos;t have access.
        </p>
        <button
          type="button"
          onClick={() => getSupabase().auth.signOut()}
          className="mt-6 w-full rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
        >
          Sign out
        </button>
      </Splash>
    );
  }

  if (!user) {
    return (
      <Splash>
        <div className="flex justify-center">
          <BrandMark />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Content studio</h1>
        {authStep === "email" ? (
          <form onSubmit={handleSendCode}>
            <p className="mt-2 text-sm text-muted">
              Enter your email and we&apos;ll send you a sign-in code.
            </p>
            <input
              type="email"
              required
              autoFocus
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-6 w-full rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-sm transition-colors duration-200 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={authBusy}
              className="mt-3 w-full rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
            >
              {authBusy ? "Sending…" : "Email me a code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <p className="mt-2 text-sm text-muted">
              Enter the 6-digit code sent to {authEmail.trim()}.
            </p>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              autoFocus
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="123456"
              className="mt-6 w-full rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-center text-lg tracking-[0.3em] transition-colors duration-200 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={authBusy}
              className="mt-3 w-full rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
            >
              {authBusy ? "Checking…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthStep("email");
                setAuthCode("");
                setAuthError(null);
              }}
              className="mt-3 w-full text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              Use a different email
            </button>
          </form>
        )}
        {authError && <p className="mt-4 text-sm text-danger">{authError}</p>}
      </Splash>
    );
  }

  if (loadError) {
    return (
      <Splash>
        <p className="text-sm text-danger">{loadError}</p>
      </Splash>
    );
  }

  if (!draft || !meta) {
    return (
      <Splash>
        <p className="text-sm text-muted">Loading your content…</p>
      </Splash>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(published);
  const firstName = draft.hero.name.trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "error"
        ? "Couldn't save — check your connection"
        : saveState === "saved"
          ? "Saved"
          : "";

  function renderScreen() {
    switch (screen) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {greeting}, {firstName} 👋
              </h2>
              <p className="mt-1 text-sm text-muted">
                Manage your portfolio content and publish updates.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card !rounded-2xl p-5">
                <p className="utility">Live version</p>
                <p className="mt-2 text-2xl font-bold">v{meta!.version}</p>
              </div>
              <div className="card !rounded-2xl p-5">
                <p className="utility">Last published</p>
                <p className="mt-2 text-sm font-semibold">{formatWhen(meta!.publishedAt)}</p>
              </div>
              <div className="card !rounded-2xl p-5">
                <p className="utility">Draft status</p>
                <p className={`mt-2 text-sm font-semibold ${dirty ? "text-warning" : "text-success"}`}>
                  {dirty ? "Unpublished changes" : "Everything is published"}
                </p>
              </div>
              <div className="card !rounded-2xl p-5">
                <p className="utility">Earlier versions</p>
                <p className="mt-2 text-sm font-semibold">{history.length} in history</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Pick a section from the menu to edit it. Everything you type saves to your draft
              automatically — the live site only changes when you press{" "}
              <span className="font-semibold text-ink">Publish</span>.
            </p>
          </div>
        );
      case "sections":
        return (
          <SectionsManager
            sections={draft!.sections}
            onChange={(sections) => setDraft((d) => (d ? { ...d, sections } : d))}
          />
        );
      case "history":
        return (
          <HistoryView
            history={history}
            currentVersion={meta!.version}
            currentPublishedAt={meta!.publishedAt}
            onRestore={handleRestore}
            busy={busy}
          />
        );
      case "hero":
        return <HeroForm hero={draft!.hero} onChange={(hero) => setDraft((d) => (d ? { ...d, hero } : d))} />;
      case "contact":
        return (
          <ContactForm
            contact={draft!.contact}
            onChange={(contact) => setDraft((d) => (d ? { ...d, contact } : d))}
          />
        );
      case "about": {
        const s = section("about");
        return s ? <AboutForm data={s.data} onChange={(data) => patchSection("about", { data })} /> : null;
      }
      case "stats": {
        const s = section("stats");
        return s ? <StatsForm items={s.items} onChange={(items) => patchSection("stats", { items })} /> : null;
      }
      case "experience": {
        const s = section("experience");
        return s ? (
          <ExperienceForm items={s.items} onChange={(items) => patchSection("experience", { items })} />
        ) : null;
      }
      case "projects": {
        const s = section("projects");
        return s ? (
          <ProjectsForm items={s.items} onChange={(items) => patchSection("projects", { items })} />
        ) : null;
      }
      case "tools": {
        const s = section("tools");
        return s ? <ToolsForm items={s.items} onChange={(items) => patchSection("tools", { items })} /> : null;
      }
      case "skills": {
        const s = section("skills");
        return s ? <SkillsForm items={s.items} onChange={(items) => patchSection("skills", { items })} /> : null;
      }
      case "certifications": {
        const s = section("certifications");
        return s ? (
          <CertificationsForm items={s.items} onChange={(items) => patchSection("certifications", { items })} />
        ) : null;
      }
      case "education": {
        const s = section("education");
        return s ? (
          <EducationForm items={s.items} onChange={(items) => patchSection("education", { items })} />
        ) : null;
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-line bg-surface px-3 py-5 md:flex">
        <div className="flex items-center gap-2.5 px-2">
          <BrandMark />
          <span className="text-sm font-semibold">Content studio</span>
        </div>
        <nav className="mt-6 flex-1 space-y-0.5" aria-label="Studio">
          {NAV.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setScreen(key)}
              aria-current={screen === key ? "page" : undefined}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                screen === key ? "bg-ink text-white" : "text-muted hover:bg-bg hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-line px-2 pt-4">
          <p className="truncate text-xs text-muted">{user.email}</p>
          <button
            type="button"
            onClick={() => getSupabase().auth.signOut()}
            className="mt-2 flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {/* Mobile nav */}
              <select
                aria-label="Studio screen"
                className="rounded-[12px] border border-line bg-surface px-2.5 py-2 text-sm font-medium md:hidden"
                value={screen}
                onChange={(e) => setScreen(e.target.value as Screen)}
              >
                {NAV.map((n) => (
                  <option key={n.key} value={n.key}>
                    {n.label}
                  </option>
                ))}
              </select>
              <h1 className="hidden truncate text-base font-semibold md:block">
                {SCREEN_TITLES[screen]}
              </h1>
              <span
                className={`hidden text-xs sm:block ${saveState === "error" ? "text-danger" : "text-muted"}`}
              >
                {saveLabel}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {dirty && (
                <span className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Unpublished changes
                </span>
              )}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the live site"
                className="rounded-xl border border-line bg-surface p-2.5 text-muted transition-colors duration-200 hover:text-ink"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>
              <button
                type="button"
                aria-label={showPreview ? "Hide preview" : "Show preview"}
                onClick={() => setShowPreview((v) => !v)}
                className="hidden rounded-xl border border-line bg-surface p-2.5 text-muted transition-colors duration-200 hover:text-ink lg:block"
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={handlePublish}
                title={dirty ? "Make the draft live" : "No changes to publish"}
                className="rounded-[14px] bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85 disabled:opacity-40"
              >
                {busy ? "Working…" : "Publish"}
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-2xl pb-24">{renderScreen()}</div>
          </main>
          {showPreview && (
            <aside className="hidden w-[46%] shrink-0 border-l border-line p-4 lg:block xl:w-[42%]">
              <div className="sticky top-20 h-[calc(100vh-6.5rem)]">
                <Preview draft={draft} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white shadow-pop"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
