import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set this higher than your 5MB client check
    },
  },
};

export default nextConfig;