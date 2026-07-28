import type { NextConfig } from "next";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.eyce.com" },
      { protocol: "https", hostname: "medusa.dynamicdreamz.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/store/:path*",
        destination: `${MEDUSA_BACKEND_URL}/store/:path*`,
      },
    ];
  },
};

export default nextConfig;
