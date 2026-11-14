"use client";

import { SafeImg, tileAt } from "./site/kit";

/**
 * "Worked with" — the companies the studio lists (or, until it lists any,
 * the Experience companies), as small chips with a logo or initial on a
 * pastel squircle. The chips wrap and centre on every screen, so none is
 * ever cut off at the edge. An empty list renders nothing.
 */
export type StripItem = { label: string; src?: string };

export function LogoStrip({ items, label = "Worked with" }: { items: StripItem[]; label?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="w-full">
      <p className="text-center text-[12px] font-bold uppercase tracking-[0.16em] text-ash/80 3xl:text-[14px]">{label}</p>
      <ul className="mx-auto mt-3 flex max-w-[880px] flex-wrap justify-center gap-2 3xl:max-w-[1100px] 3xl:gap-3">
        {items.map((item, i) => (
          <li
            key={`${item.label}-${i}`}
            className="flex max-w-full items-center gap-2 rounded-full border border-hairline bg-card/80 py-1.5 pl-1.5 pr-4 shadow-pill backdrop-blur 3xl:py-2 3xl:pl-2 3xl:pr-5"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center overflow-hidden rounded-[30%] text-[11px] font-extrabold text-on-pop 3xl:size-9 3xl:text-[13px] ${
                item.src ? "bg-white" : tileAt(i)
              }`}
            >
              {item.src ? (
                <SafeImg src={item.src} loading="lazy" className="h-full w-full object-cover" fallback={item.label.charAt(0).toUpperCase()} />
              ) : (
                item.label.charAt(0).toUpperCase()
              )}
            </span>
            <span className="min-w-0 truncate text-[13.5px] font-semibold text-onyx/80 3xl:text-[16px]">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
