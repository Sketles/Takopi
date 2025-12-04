import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'gxy4jvwvb9jmk81j.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@google/model-viewer'],
    turbo: {
      resolveAlias: {
        // Aliases para Turbopack
      },
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
