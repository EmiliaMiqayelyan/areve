import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  webpack: (config, { dev }) => {
    // Avoid corrupted PackFileCacheStrategy errors on Windows/slow disks.
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  allowedDevOrigins: [
    "3456-iiv793nb1mps0mn8hii7t.e2b.app",
    "*.e2b.app",
    "localhost",
  ],
};

export default nextConfig;
