import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración para optimizar chunks y compatibilidad con Turbopack
  experimental: {
    // Optimización de chunks para librerías grandes
    optimizePackageImports: ['@google/model-viewer'],
  },
  // Configuración de webpack (fallback cuando no se usa Turbopack)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configurar externals para model-viewer en el cliente
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
