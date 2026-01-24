import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/algorithms/:path*",
        destination: "http://localhost:5000/api/algorithms/:path*",
      },
    ];
  },
};

export default nextConfig;
