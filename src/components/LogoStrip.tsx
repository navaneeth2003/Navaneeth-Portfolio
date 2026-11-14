"use client";

/**
 * Simple running banner, as per the recording: plain marks floating directly
 * over the hero image's lower fade — no box, no border, no band, not a
 * separate section. Rendered pinned to the hero bottom (see Hero.tsx) with
 * clearance above the CTAs, so the marquee can never cover the buttons.
 * Fed from lib/marquee (the studio's company list, or the Experience
 * companies until one is set; optional 1:1 logo); short lists are repeated
 * so the track always fills the viewport.
 */
export type StripItem = { label: string; src?: string };

function RowHalf({ hidden, items }: { hidden?: boolean; items: StripItem[] }) {
  return (
    <div
      aria-hidden={hidden}
      className="animate-marquee-fast flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 md:gap-20 md:pr-20"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-3">
          {item.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt=""
              loading="lazy"
              className="h-7 w-7 rounded-md object-cover opacity-90 sm:h-8 sm:w-8 md:h-10 md:w-10"
            />
          )}
          <span className="whitespace-nowrap font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-[15px]">
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function LogoStrip({ items }: { items: StripItem[] }) {
  if (items.length === 0) return null;
  // Repeat short lists so both halves of the marquee are wider than the viewport.
  let track = items;
  while (track.length < 8) track = track.concat(items);

  return (
    <div className="relative z-10 bg-transparent">
      <div className="marquee-paused relative flex overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:py-6">
        <RowHalf items={track} />
        <RowHalf hidden items={track} />
      </div>
    </div>
  );
}
