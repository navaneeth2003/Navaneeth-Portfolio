import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content studio",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
