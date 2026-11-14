import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// One family for the whole product — the public site and the content studio.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-next",
  weight: ["300", "400", "500", "600", "700", "800"],
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
      className={jakarta.variable}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://sbrcekbvqlcgsgmhzgfk.supabase.co" />
        <link rel="dns-prefetch" href="https://sbrcekbvqlcgsgmhzgfk.supabase.co" />
        <link rel="author" href="/humans.txt" />
      </head>
      <body className="bg-[#f5f0e6] text-[#121211] antialiased">{children}</body>
    </html>
  );
}
