import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
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
