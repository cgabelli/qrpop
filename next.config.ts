import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve uploaded files from public/uploads
  images: {
    remotePatterns: [],
  },
  // Increase body size limit for file uploads (50MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
