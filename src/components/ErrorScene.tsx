"use client";

import { useState } from "react";
import { Home, RotateCw } from "lucide-react";
import { AVATAR, AvatarTile, Bubble, Eyebrow, OwnerAvatar } from "@/components/site/kit";

/**
 * The friendly fallback when something fails while a page renders: the crew
 * looking a little sheepish, a plain-language apology and two ways out —
 * try again (re-renders the failed part, then reloads if that isn't enough)
 * or go back to the portfolio. Self-contained: it needs no CMS content, so
 * it still works when the content itself was the problem.
 */
export function ErrorScene({ reset, digest }: { reset?: () => void; digest?: string }) {
  const [trying, setTrying] = useState(false);

  const retry = () => {
    setTrying(true);
    if (reset) {
      reset();
      // If the same error comes straight back, a full reload is the next best thing.
      window.setTimeout(() => window.location.reload(), 900);
    } else {
      window.location.reload();
    }
  };

  return (
    <div data-palette="default" className="site relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-canvas px-6 py-24 text-center text-onyx">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(110% 70% at 50% -10%, rgba(var(--glow), 0.95), rgba(var(--glow), 0) 70%)" }}
      />

      {/* a full page load on purpose: it clears whatever state broke */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="group absolute left-5 top-5 z-10 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-card/80 py-1.5 pl-1.5 pr-4 text-[16px] font-extrabold tracking-[-0.03em] text-onyx shadow-pill backdrop-blur md:left-8 md:top-8"
      >
        <OwnerAvatar className="size-9" />
        Navaneeth
      </a>

      <main className="relative z-10 flex max-w-xl flex-col items-center">
        {/* the crew, a little sheepish */}
        <div aria-hidden className="relative flex items-end pt-10">
          <AvatarTile src={AVATAR.iris} tone="bg-tile-bubblegum" tilt={-10} border="border-4" className="size-20 md:size-24">
            <Bubble className="-top-6 left-1/2 -translate-x-1/2">Uh-oh</Bubble>
          </AvatarTile>
          <AvatarTile src={AVATAR.owner} tone="bg-tile-lemon" tilt={3} className="z-10 -mx-3 size-28 md:size-32">
            <Bubble className="-top-7 left-1/2 -translate-x-1/2">On it! 🛠️</Bubble>
          </AvatarTile>
          <AvatarTile src={AVATAR.gus} tone="bg-tile-periwinkle" tilt={9} border="border-4" className="size-20 md:size-24" />
        </div>

        <div className="mt-10">
          <Eyebrow>Something went wrong</Eyebrow>
        </div>
        <h1 className="display mt-5 text-[clamp(40px,11vw,64px)]">
          We dropped the ball<span className="text-pop">.</span>
        </h1>
        <p className="mt-4 max-w-md text-pretty text-[16px] leading-relaxed text-ash md:text-[18px]">
          This page hit a snag while loading. It&apos;s not you — trying again usually sorts it out.
        </p>

        <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={retry}
            disabled={trying}
            className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-onyx px-7 text-[16px] font-semibold text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5 disabled:opacity-80"
          >
            <RotateCw size={18} aria-hidden className={`text-pop ${trying ? "animate-spin" : ""}`} />
            {trying ? "Trying again…" : "Try again"}
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full border border-hairline bg-card px-7 text-[16px] font-semibold text-onyx shadow-pill transition-transform hover:-translate-y-0.5"
          >
            <Home size={18} aria-hidden /> Back to the portfolio
          </a>
        </div>

        {digest && <p className="mt-8 text-[12px] font-medium text-dust">Reference: {digest}</p>}
      </main>
    </div>
  );
}
