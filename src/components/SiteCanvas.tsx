"use client";

const PALETTE_GLOWS: Record<
  string,
  {
    gradient: string;
    wash1: string;
    wash2: string;
    wash3: string;
    wash4: string;
    wash5: string;
  }
> = {
  default: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #0b0404 4%, #ff6a1f 7.5%, #e8490d 9.5%, #7a1e05 11.5%, #3a0f06 13%, #160706 15%, #0a0a0c 17%, #0a0a0c 52%, #2a1216 56%, #c0808a 60%, #5c222a 64%, #0b0b0e 68%, #4a1508 71%, #8a2a10 74%, #2a0d08 77%, #141014 79%, #8e2434 82%, #9c2a3a 83.5%, #431318 86%, #0a0507 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#ff7a2a]/25",
    wash2: "bg-[#e8490d]/20",
    wash3: "bg-[#ff5a1a]/15",
    wash4: "bg-[#c26a76]/25",
    wash5: "bg-[#a8323e]/20",
  },
  graphite: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #090a0c 4%, #475569 7.5%, #334155 9.5%, #1e293b 11.5%, #141b27 13%, #0d1117 15%, #0a0b0d 17%, #0a0b0d 52%, #161c26 56%, #283548 60%, #1a2230 64%, #0a0b0d 68%, #1e293b 71%, #334155 74%, #181e28 77%, #0f141d 79%, #334155 82%, #475569 83.5%, #1e293b 86%, #0a0b0d 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#94a3b8]/20",
    wash2: "bg-[#64748b]/15",
    wash3: "bg-[#475569]/15",
    wash4: "bg-[#94a3b8]/15",
    wash5: "bg-[#334155]/20",
  },
  midnight: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #030712 4%, #0284c7 7.5%, #0369a1 9.5%, #075985 11.5%, #082f4d 13%, #051829 15%, #040711 17%, #040711 52%, #08213d 56%, #0e3a64 60%, #092642 64%, #040711 68%, #0369a1 71%, #0c4a6e 74%, #082844 77%, #06182c 79%, #0284c7 82%, #38bdf8 83.5%, #0c355c 86%, #040711 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#38bdf8]/25",
    wash2: "bg-[#0284c7]/16",
    wash3: "bg-[#38bdf8]/16",
    wash4: "bg-[#38bdf8]/15",
    wash5: "bg-[#0284c7]/20",
  },
  emerald: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #021a0f 4%, #059669 7.5%, #047857 9.5%, #065f46 11.5%, #064e3b 13%, #032616 15%, #040d08 17%, #040d08 52%, #082e1d 56%, #0d5236 60%, #063b25 64%, #040d08 68%, #047857 71%, #059669 74%, #063b25 77%, #041f13 79%, #059669 82%, #10b981 83.5%, #064e3b 86%, #040d08 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#34d399]/25",
    wash2: "bg-[#047857]/16",
    wash3: "bg-[#059669]/18",
    wash4: "bg-[#34d399]/15",
    wash5: "bg-[#064e3b]/22",
  },
  "warm-clay": {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #170d05 4%, #d97706 7.5%, #b45309 9.5%, #92400e 11.5%, #78350f 13%, #3b1a08 15%, #0d0a08 17%, #0d0a08 52%, #2a170c 56%, #6c300a 60%, #3d1a08 64%, #0d0a08 68%, #92400e 71%, #b45309 74%, #3d1a08 77%, #1e0d04 79%, #b45309 82%, #d97706 83.5%, #78350f 86%, #0d0a08 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#fbbf24]/22",
    wash2: "bg-[#b45309]/16",
    wash3: "bg-[#d97706]/16",
    wash4: "bg-[#f59e0b]/18",
    wash5: "bg-[#78350f]/20",
  },
  "editorial-crimson": {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #160408 4%, #e11d48 7.5%, #be123c 9.5%, #9f1239 11.5%, #881337 13%, #3f0917 15%, #0a0607 17%, #0a0607 52%, #2d0a14 56%, #700f28 60%, #400917 64%, #0a0607 68%, #9f1239 71%, #be123c 74%, #400917 77%, #22050c 79%, #be123c 82%, #e11d48 83.5%, #881337 86%, #0a0607 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#fda4af]/22",
    wash2: "bg-[#be123c]/16",
    wash3: "bg-[#e11d48]/16",
    wash4: "bg-[#be123c]/20",
    wash5: "bg-[#881337]/22",
  },
};

/**
 * Atmospheric background canvas for the whole page.
 * Respects the selected color palette token washes.
 */
export function SiteCanvas({ palette = "default" }: { palette?: string }) {
  const glows = PALETTE_GLOWS[palette] ?? PALETTE_GLOWS.default;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0" style={{ background: glows.gradient }} />
      {/* soft washes — all feathered, never hard-edged */}
      <div
        className={`absolute left-1/2 top-[7%] h-[30vh] w-[90vw] -translate-x-1/2 rounded-full ${glows.wash1} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[12.5%] h-[24vh] w-[90vw] -translate-x-1/2 rounded-full ${glows.wash2} blur-[80px] md:blur-[120px]`}
      />
      <div
        className={`absolute left-[62%] top-[72%] h-[34vh] w-[60vw] -translate-x-1/2 rounded-full ${glows.wash3} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[59%] h-[30vh] w-[85vw] -translate-x-1/2 rounded-full ${glows.wash4} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[83%] h-[26vh] w-[80vw] -translate-x-1/2 rounded-full ${glows.wash5} blur-[80px] md:blur-[130px]`}
      />
    </div>
  );
}
