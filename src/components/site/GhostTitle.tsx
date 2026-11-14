/**
 * The site's section label: a giant ghost word (like "Projects" / "Contact"
 * in the reference) plus a screen-reader heading. From md the two fixed
 * sizes match the reference's 1440 column ("Certifications" sizes down the
 * way "Contact" doesn't need to). Below md the size is derived from the
 * word's length, so "Education" fits a 375px phone as cleanly as "Skills"
 * instead of clipping at the edges.
 */
export function GhostTitle({ children }: { children: string }) {
  const long = children.length > 9;
  const n = Math.max(children.length, 1);
  const style = {
    "--ghost-m": `${Math.min(22, 170 / n).toFixed(1)}vw`,
    "--ghost-s": `${Math.min(24, 185 / n).toFixed(1)}vw`,
  } as React.CSSProperties;
  return (
    <>
      <h2 className="sr-only">{children}</h2>
      <p
        aria-hidden
        style={style}
        className={`ghost-huge relative overflow-hidden px-4 text-center text-[length:var(--ghost-m)] sm:text-[length:var(--ghost-s)] ${
          long ? "md:text-[9.6vw]" : "md:text-[13vw]"
        }`}
      >
        {children}
      </p>
    </>
  );
}
