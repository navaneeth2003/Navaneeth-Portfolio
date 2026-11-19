"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, Check, Copy, FileText, Mail, Send } from "lucide-react";
import type { ChatterVoice, ContactInfo } from "@/lib/types";
import { firstName } from "@/lib/format";
import { LinkedInIcon, ScrollReveal } from "./ui";
import { Eyebrow, Voice, WRAP, useTurns, type BubbleSide } from "./site/kit";

/** Conversation starters — tap one to drop it into the composer. */
const STARTERS = [
  { emoji: "💼", text: "I have a role you might like" },
  { emoji: "🤝", text: "Let's build something together" },
  { emoji: "👋", text: "Just saying hi!" },
];

/** Where the crowd stands along the composer's top edge (as % of its width). */
const SLOTS: Record<number, number[]> = {
  1: [50],
  2: [30, 70],
  3: [16, 50, 84],
  4: [12, 37, 63, 88],
};
const side = (x: number): BubbleSide => (x < 22 ? "start" : x > 78 ? "end" : "center");
/** Each speaker's lane from tablets up (as % of the composer's width), so bubbles never meet. */
const LANE: Record<number, number> = { 1: 60, 2: 40, 3: 34, 4: 25.5 };
const TILTS = [-6, 7, -4, 6];

/**
 * Contact always closes the page, as a split: on the left the invitation
 * set huge and the direct lines (copy the email, LinkedIn, the resume); on
 * the right a "new message" composer with the crowd perched along its top
 * edge, saying what people come to talk about (Studio → Team chatter). The
 * composer hands the note to the visitor's email app as a ready mailto.
 * Phones stack the two, keep three of the crowd, and keep every control.
 */
export function Contact({
  contact,
  name,
  photo,
  voices,
}: {
  contact: ContactInfo;
  name: string;
  photo?: string;
  voices: ChatterVoice[];
}) {
  const first = firstName(name);
  const email = contact.email.trim();
  const linkedin = contact.linkedinUrl?.trim() || null;
  const resume = contact.resumeUrl?.trim() || null;
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [msg, setMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address so I can get back to you.");
      return;
    }
    if (!msg.trim()) {
      setStatus("error");
      setErrorMessage("Please write a message before sending.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.trim(),
          email: emailInput.trim(),
          message: msg.trim(),
          honeypot: honeypot.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data?.error || "Failed to deliver message. Please try again or email directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again or email directly.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const crowd = voices.slice(0, 4);
  const mdSlots = SLOTS[crowd.length] ?? [];
  const phoneCount = Math.min(3, crowd.length);
  const phoneSlots = SLOTS[phoneCount] ?? [];
  // Phones: one bubble at a time, passed around the crowd.
  const turn = useTurns(phoneCount, 3000);
  const lane = { "--bubble-lane": `min(320px, calc(${LANE[crowd.length] ?? 25}cqw - 12px))` } as CSSProperties;

  const row =
    "group flex min-h-[60px] w-full items-center gap-3 rounded-[20px] border border-hairline bg-card/70 px-3 py-2.5 text-left shadow-pill backdrop-blur transition-transform hover:-translate-y-0.5 3xl:min-h-[72px] 3xl:rounded-[24px]";

  return (
    <section id="contact" className="relative scroll-mt-24 pb-10 pt-16 md:pb-14 md:pt-24 xl:pt-28 3xl:pt-36">
      {/* soft light behind the composer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 -z-10"
        style={{ background: "radial-gradient(60% 60% at 75% 60%, rgba(var(--glow), 0.7), rgba(var(--glow), 0) 70%)" }}
      />
      <div className={WRAP}>
        <div
          className={`grid grid-cols-1 gap-12 ${email ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16 xl:gap-24" : ""}`}
        >
          {/* the invitation */}
          <ScrollReveal className="min-w-0">
            <Eyebrow>Get in touch</Eyebrow>
            {/* One line everywhere, sized to fill the column it sits in. */}
            <h2 className="display mt-5 whitespace-nowrap text-[clamp(44px,13vw,64px)] leading-[0.9] md:mt-6 md:text-[96px] lg:text-[86px] xl:text-[100px] 2xl:text-[108px] 3xl:text-[136px]">
              Let&apos;s talk<span className="text-pop">.</span>
            </h2>
            <p className="mt-6 max-w-[420px] text-pretty text-[16px] leading-relaxed text-ash md:text-[18px] 3xl:max-w-[560px] 3xl:text-[22px]">
              Got a role, a product idea, or just a quick question?{" "}
              {email ? "Email is the best way to reach me." : linkedin ? "LinkedIn is the best way to reach me." : "Here's how to reach me."}
            </p>
            <ul className="mt-8 grid max-w-[460px] gap-2.5 3xl:max-w-[600px]">
              {email && (
              <li>
                <button type="button" onClick={copy} aria-label={copied ? "Email copied" : `Copy ${email}`} className={row}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-[30%] bg-pop text-on-pop 3xl:size-12">
                    <Mail size={18} strokeWidth={2.1} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-ash 3xl:text-[14px]">Email</span>
                    <span className="block truncate text-[15px] font-semibold text-onyx 3xl:text-[18px]">
                      {copied ? "Copied to clipboard!" : email}
                    </span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-well text-onyx">
                    {copied ? <Check size={16} className="text-[#2fb36b]" aria-hidden /> : <Copy size={15} aria-hidden />}
                  </span>
                </button>
              </li>
              )}
              {linkedin && (
                <li>
                  <a href={linkedin} target="_blank" rel="noreferrer" className={row}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-[30%] bg-[#0a66c2] text-white 3xl:size-12">
                      <LinkedInIcon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-ash 3xl:text-[14px]">LinkedIn</span>
                      <span className="block truncate text-[15px] font-semibold text-onyx 3xl:text-[18px]">Connect with me</span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-well text-onyx transition-transform group-hover:rotate-45">
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {resume && (
                <li>
                  <a href={resume} target="_blank" rel="noreferrer" className={row}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-[30%] bg-onyx text-on-onyx 3xl:size-12">
                      <FileText size={17} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-ash 3xl:text-[14px]">Resume</span>
                      <span className="block truncate text-[15px] font-semibold text-onyx 3xl:text-[18px]">Open the PDF</span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-well text-onyx transition-transform group-hover:rotate-45">
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
            <p aria-live="polite" className="sr-only">
              {copied ? "Email copied" : ""}
            </p>
          </ScrollReveal>

          {/* the composer, with the crowd perched on top (only when there is an email to send to) */}
          {email && (
          <ScrollReveal delay={0.1} className="min-w-0">
            <div className={`relative ${crowd.length ? "pt-[118px] sm:pt-[132px] md:pt-[150px] xl:pt-[164px] 3xl:pt-[200px]" : ""}`}>
              <div className="@container relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-[14px] z-10 h-0 md:top-[16px] md:[--bubble-max:var(--bubble-lane)]"
                  style={lane}
                >
                  {crowd.map((v, k) => {
                    const xm = mdSlots[k] ?? 50;
                    const xb = k < phoneCount ? phoneSlots[k] : null;
                    const style = { "--x": `${xb ?? 50}%`, "--x-md": `${xm}%` } as CSSProperties;
                    return (
                      <span
                        key={`${v.id}-${v.avatar}-${v.lines.join("|")}`}
                        className={`absolute bottom-0 left-[var(--x)] md:left-[var(--x-md)] ${k < phoneCount ? "block" : "hidden md:block"}`}
                        style={style}
                      >
                        <Voice
                          voice={v}
                          ownerPhoto={photo}
                          tilt={TILTS[k % TILTS.length]}
                          offset={300 + k * 1100}
                          phoneQuiet={k !== turn}
                          align={{ base: side(xb ?? 50), md: "center" }}
                          className="bottom-0 left-0 -translate-x-1/2"
                          size="size-[62px] sm:size-[72px] md:size-[84px] xl:size-[96px] 3xl:size-[120px]"
                        />
                      </span>
                    );
                  })}
                </div>

                {status === "success" ? (
                  <div className="surface relative rounded-[30px] p-6 text-center sm:p-8 md:rounded-[36px] md:p-10 3xl:p-12">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#2fb36b]/15 text-[#2fb36b] 3xl:size-16">
                      <Check size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="mt-4 text-[20px] font-bold text-onyx 3xl:text-[24px]">Message sent!</h3>
                    <p className="mx-auto mt-2 max-w-[360px] text-[15px] leading-relaxed text-ash 3xl:max-w-[420px] 3xl:text-[17px]">
                      Thanks for reaching out! Your message was delivered to {first || "Navaneeth"}&apos;s inbox. You&apos;ll receive a reply at{" "}
                      <span className="font-semibold text-onyx">{emailInput}</span> soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setMsg("");
                        setErrorMessage("");
                      }}
                      className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full border border-hairline bg-well px-6 text-[14px] font-semibold text-onyx transition-transform hover:-translate-y-0.5 3xl:min-h-[52px] 3xl:px-7 3xl:text-[16px]"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={send} className="surface relative rounded-[30px] p-4 sm:p-6 md:rounded-[36px] md:p-7 3xl:p-10">
                    <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
                      <p className="text-[15px] font-bold text-onyx md:text-[16px] 3xl:text-[19px]">New message</p>
                      <span className="truncate rounded-full bg-well px-3 py-1 text-[13px] font-semibold text-ash 3xl:text-[15px]">
                        To: {first || "me"}
                      </span>
                    </div>

                    {/* Honeypot field for bot suppression */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="contact-website-honeypot">Leave empty</label>
                      <input
                        id="contact-website-honeypot"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 md:mt-5">
                      {STARTERS.map((s) => (
                        <button
                          key={s.text}
                          type="button"
                          onClick={() => {
                            setMsg((prev) => (prev ? `${prev}\n${s.text}` : s.text));
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-well px-3.5 py-2 text-[13.5px] font-semibold text-onyx/80 transition-transform hover:-translate-y-0.5 hover:text-onyx 3xl:text-[16px]"
                        >
                          <span aria-hidden className="text-[15px] leading-none">
                            {s.emoji}
                          </span>
                          {s.text}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="sr-only">Your name</label>
                        <input
                          id="contact-name"
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Your name"
                          disabled={status === "sending"}
                          maxLength={100}
                          className="w-full rounded-[16px] border border-hairline bg-well px-4 py-3 text-[15px] font-medium text-onyx placeholder:text-dust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onyx/60 disabled:opacity-60 3xl:py-3.5 3xl:text-[17px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="sr-only">Your email</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Your email (so I can reply)"
                          disabled={status === "sending"}
                          maxLength={120}
                          className="w-full rounded-[16px] border border-hairline bg-well px-4 py-3 text-[15px] font-medium text-onyx placeholder:text-dust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onyx/60 disabled:opacity-60 3xl:py-3.5 3xl:text-[17px]"
                        />
                      </div>
                    </div>

                    <label htmlFor="contact-message" className="sr-only">
                      Your message{first ? ` to ${first}` : ""}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e);
                      }}
                      disabled={status === "sending"}
                      placeholder={first ? `Write ${first} a quick hello…` : "Write a quick hello…"}
                      className="mt-3 min-h-[120px] w-full resize-none rounded-[20px] border border-hairline bg-well px-4 py-3.5 text-[15px] leading-relaxed text-onyx placeholder:text-dust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onyx/60 disabled:opacity-60 md:min-h-[140px] 3xl:min-h-[170px] 3xl:text-[18px]"
                    />

                    {status === "error" && (
                      <div className="mt-3 flex items-start gap-2.5 rounded-[16px] border border-red-500/25 bg-red-500/10 p-3 text-[13.5px] text-red-700 dark:text-red-300">
                        <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-500" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{errorMessage || "Failed to send message."}</p>
                          {email && (
                            <p className="mt-1 text-[12.5px] opacity-90">
                              You can also email directly:{" "}
                              <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">
                                {email}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[13px] font-medium text-ash 3xl:text-[15px]">Sends directly to {first || "my"} inbox.</p>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-onyx px-6 text-[15px] font-semibold text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 3xl:min-h-[60px] 3xl:px-8 3xl:text-[18px]"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-on-onyx border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send
                            <Send size={16} strokeWidth={2.3} className="text-pop" aria-hidden />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
