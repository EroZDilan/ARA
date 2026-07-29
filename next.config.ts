import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["10.6.125.144"],
  experimental: {
    optimizePackageImports: ["three"],
  },
};

export default nextConfig;
