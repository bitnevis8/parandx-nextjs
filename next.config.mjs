import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiOrigin =
      process.env.API_INTERNAL_URL?.replace(/\/$/, '') ||
      (process.env.NODE_ENV === 'production'
        ? 'http://127.0.0.1:3007'
        : 'http://127.0.0.1:3000');
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
  // دسترسی از IP شبکه محلی در حالت dev (مثلاً موبایل روی همان Wi‑Fi)
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '10.168.155.250',
    '10.34.252.250',
    '*.local',
  ],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.parandx.com', pathname: '/**' },
      { protocol: 'https', hostname: 'parandx.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // برای تصاویر خارجی
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  webpack: (config, { dev, isServer }) => {
    // اضافه کردن alias برای مسیر config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@config': path.resolve(__dirname, 'app/config'),
    };
    
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};

export default nextConfig;
