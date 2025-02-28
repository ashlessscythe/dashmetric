import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure API routes to handle larger file uploads
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increase the size limit for file uploads
    },
    responseLimit: "10mb", // Increase the response size limit
  },
  // Enable experimental features if needed
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  // Add image domains if needed for external images
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
