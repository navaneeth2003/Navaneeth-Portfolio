"use client";

import { MotionConfig } from "motion/react";
import { LenisProvider } from "@/components/LenisProvider";

/**
 * Client-side wrappers the public site needs and the studio must not have:
 * smooth scrolling and the motion policy. `reducedMotion="user"` makes every
 * transform animation instant for people who ask for reduced motion, while
 * opacity still resolves so nothing essential stays hidden.
 */
export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>{children}</LenisProvider>
    </MotionConfig>
  );
}
