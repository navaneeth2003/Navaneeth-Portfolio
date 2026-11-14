"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Intuitive + accessible: no smooth-scroll hijack for users who
    // prefer reduced motion — native scrolling stays instant.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      // Lenis 1.3+ drives its own rAF loop — no manual
      // requestAnimationFrame bookkeeping needed.
      autoRaf: true,
    });

    // anchor scrolling via lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    // Programmatic scrolls (the mascot) and scroll locks (project sheets)
    // come in as window events so components never need the instance.
    const onScrollRequest = (e: Event) => {
      const top = (e as CustomEvent<{ top: number }>).detail?.top;
      if (typeof top !== "number") return;
      e.preventDefault();
      lenis.scrollTo(top);
    };
    const onLock = () => lenis.stop();
    const onUnlock = () => lenis.start();
    window.addEventListener("site:scroll", onScrollRequest);
    window.addEventListener("site:lock", onLock);
    window.addEventListener("site:unlock", onUnlock);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("site:scroll", onScrollRequest);
      window.removeEventListener("site:lock", onLock);
      window.removeEventListener("site:unlock", onUnlock);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
