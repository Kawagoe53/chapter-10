import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" }, // これを追加
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
