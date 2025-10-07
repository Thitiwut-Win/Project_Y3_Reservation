import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;

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
