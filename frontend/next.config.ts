import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,            // recomendado
  eslint: {
    ignoreDuringBuilds: true,       // ignora erros de lint durante build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',             // permite imagens externas
      },
    ],
  },
};

export default nextConfig;