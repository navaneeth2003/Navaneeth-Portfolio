"use client";

import { useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ErrorScene } from "@/components/ErrorScene";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta-next", weight: ["500", "600", "700", "800"], display: "swap" });

/** The last line of defence: if even the root layout fails, the same friendly page still shows. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#f5f0e6] text-[#121211]">
        <ErrorScene reset={reset} digest={error.digest} />
      </body>
    </html>
  );
}
