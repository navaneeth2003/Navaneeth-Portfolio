"use client";

import { useEffect } from "react";
import { ErrorScene } from "@/components/ErrorScene";

/** Any page (the site, the studio) that fails while rendering lands here instead of a blank screen. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorScene reset={reset} digest={error.digest} />;
}
