import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve /public images directly. Avoids broken _next/image placeholders
  // on some browsers, ad blockers, and protected preview hosts.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
