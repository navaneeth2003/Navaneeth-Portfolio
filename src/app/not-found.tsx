import Link from "next/link";
import { ArrowLeft, Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0b] px-6 text-[#f4f4f5] selection:bg-[#ff5a1a]/30 selection:text-white">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--color-accent, #ff5a1a) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top Brand Link */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white/80 transition-colors hover:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 font-bold text-white transition-transform group-hover:scale-105">
            N<span className="text-[var(--color-accent,#ff5a1a)]">.</span>
          </span>
          <span>Navaneeth</span>
        </Link>
      </div>

      <main className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        {/* Subtle large 404 watermark */}
        <div
          className="select-none text-[8rem] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[11rem]"
          aria-hidden="true"
        >
          404
        </div>

        <div className="-mt-16 sm:-mt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-accent,#ff5a1a)]">
            Error 404
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa] sm:text-base">
            The page you are looking for doesn't exist, has been removed, or the link may be broken.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Return to Portfolio
            </Link>

            <Link
              href="/#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </Link>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 text-center text-xs text-[#71717a]">
        © {new Date().getFullYear()} Navaneeth. All rights reserved.
      </footer>
    </div>
  );
}
