import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "3456-iiv793nb1mps0mn8hii7t.e2b.app",
    "*.e2b.app",
    "localhost",
  ],
};

export default nextConfig;
