import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Navaneeth C L — Associate Product Manager",
    template: "%s · Navaneeth C L",
  },
  description:
    "Portfolio of Navaneeth C L — Associate Product Manager, Ex-Founder, CS Engineer. Building products people enjoy that deliver real results.",
  openGraph: {
    title: "Navaneeth C L — Associate Product Manager",
    description:
      "Product manager portfolio: growth outcomes, shipped products, and case studies across product creation, design, and strategy.",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Navaneeth C L — Associate Product Manager",
    description:
      "Product manager portfolio: growth outcomes, shipped products, and case studies.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
