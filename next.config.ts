import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["images.encrypted-tbn0.gstatic.com, images.asset.kompas.com", "images.w7.pngwing.com"],
  }
};

export default nextConfig;
