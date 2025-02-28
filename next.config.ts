import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server external packages configuration (moved from experimental)
  serverExternalPackages: ["@prisma/client"],

  // Add image domains if needed for external images
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
