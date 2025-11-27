import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@google/model-viewer'],
    turbo: {
      resolveAlias: {
        // Aliases para Turbopack
      },
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
  },
};

export default nextConfig;
