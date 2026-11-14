import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { AVATAR, AvatarTile, Bubble, Eyebrow, OwnerAvatar } from "@/components/site/kit";

export default function NotFound() {
  return (
    <div data-palette="default" className="site relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{ background: "radial-gradient(110% 70% at 50% -10%, rgba(var(--glow), 0.95), rgba(var(--glow), 0) 70%)" }}
      />

      <Link
        href="/"
        className="group absolute left-5 top-5 z-10 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-card/80 py-1.5 pl-1.5 pr-4 text-[16px] font-extrabold tracking-[-0.03em] text-onyx shadow-pill backdrop-blur md:left-8 md:top-8"
      >
        <OwnerAvatar className="size-9" />
        Navaneeth
      </Link>

      <main className="relative z-10 flex max-w-xl flex-col items-center">
        {/* the cast, looking around for the page */}
        <div aria-hidden className="relative flex items-end">
          <AvatarTile src={AVATAR.gus} tone="bg-tile-periwinkle" tilt={-9} border="border-4" className="size-20 md:size-24" />
          <AvatarTile src={AVATAR.owner} tone="bg-tile-lemon" tilt={3} className="z-10 -mx-3 size-28 md:size-32">
            <Bubble className="-top-6 left-1/2 -translate-x-1/2">Hmm… 🤔</Bubble>
          </AvatarTile>
          <AvatarTile src={AVATAR.rosa} tone="bg-tile-bubblegum" tilt={9} border="border-4" className="size-20 md:size-24" />
        </div>

        <div className="mt-10">
          <Eyebrow>Error 404</Eyebrow>
        </div>
        <h1 className="display mt-5 text-[clamp(40px,11vw,64px)]">
          This page wandered off<span className="text-pop">.</span>
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ash md:text-[18px]">
          The page you&apos;re looking for doesn&apos;t exist, has moved, or the link may be broken.
        </p>

        <div className="mt-9 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-7">
          <Link
            href="/"
            className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full bg-onyx px-7 text-[16px] font-semibold text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            <Home size={18} aria-hidden /> Back to the portfolio
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-onyx underline decoration-onyx/30 decoration-2 underline-offset-[6px] hover:decoration-onyx"
          >
            Say hi instead <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 z-10 text-[13px] text-ash">© {new Date().getFullYear()} Navaneeth. All rights reserved.</footer>
    </div>
  );
}
