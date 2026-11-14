import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-next",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display-next",
  display: "swap",
});

// Page-level metadata (the home page derives its own from the published hero).
export const metadata: Metadata = {
  metadataBase: new URL("https://thenavaneeth.com"),
  title: "Navaneeth C L",
  description: "Portfolio of Navaneeth C L — Associate Product Manager, Ex-Founder, CS Engineer.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://sbrcekbvqlcgsgmhzgfk.supabase.co" />
        <link rel="dns-prefetch" href="https://sbrcekbvqlcgsgmhzgfk.supabase.co" />
        <link rel="author" href="/humans.txt" />
      </head>
      <body className="bg-[#09090b] text-white antialiased">{children}</body>
    </html>
  );
}
