"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveals. Elements tagged [data-reveal] fade up
 * as they enter the viewport. Anything already on screen is marked visible
 * before the hiding class engages, so there is never a flash; without JS or
 * with reduced motion, everything just renders visible.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    });
    document.documentElement.classList.add("has-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
