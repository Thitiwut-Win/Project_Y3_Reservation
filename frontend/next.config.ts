import type { NextConfig } from "next";

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
        destination: "http://localhost:5000/:path*", // Express backend
      },
    ];
  },
};

export default nextConfig;
