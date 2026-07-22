import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.eyce.com" },
      { protocol: "https", hostname: "medusa.dynamicdreamz.com" },
    ],
  },
};

export default nextConfig;
