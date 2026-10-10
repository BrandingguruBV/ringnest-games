import type { NextConfig } from "next";

const noStore = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
];

const nextConfig: NextConfig = {
  // nexovix-perf-v7
  compress: true,
  poweredByHeader: false,
  compiler: { removeConsole: process.env.NODE_ENV === "production" },



  // Serve /public images directly. Avoids broken _next/image placeholders
  // on some browsers, ad blockers, and protected preview hosts.
  images: { formats: ["image/avif", "image/webp"], 
    unoptimized: true,
  },
  async headers() {
    return [
      { source: "/", headers: noStore },
      { source: "/games/:path*", headers: noStore },
      { source: "/catalog", headers: noStore },
      { source: "/about", headers: noStore },
      { source: "/discord", headers: noStore },
      { source: "/favicon.ico", headers: noStore },
      { source: "/icon.png", headers: noStore },
      { source: "/apple-icon.png", headers: noStore },
      { source: "/apple-touch-icon.png", headers: noStore },
      { source: "/manifest.webmanifest", headers: noStore },
      { source: "/icons/:path*", headers: noStore },
      { source: "/brand/:path*", headers: noStore },
    ];
  },
};

export default nextConfig;


