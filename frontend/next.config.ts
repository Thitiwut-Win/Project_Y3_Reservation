import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn("API_URL is not defined. API rewrites may fail.");
}

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*", // Next.js
      },
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`, // Express backend
      },
    ];
  },
};

export default nextConfig;
