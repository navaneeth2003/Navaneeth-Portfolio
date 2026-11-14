import type { NextConfig } from "next";

// Baseline browser hardening for every route. No CSP yet: Next's inline
// bootstrap, Google Fonts and Supabase would each need an allowance and a
// mistake there blanks the page, so that is a documented follow-up.
// SAMEORIGIN (not DENY) keeps the studio's same-origin preview iframe working.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  // Next 16: React Compiler is stable — automatic memoization,
  // big win for this animation-heavy single-page portfolio.
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Studio uploads (Supabase Storage) — the hero portrait goes through next/image.
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
