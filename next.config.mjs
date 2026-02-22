import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    optimizePackageImports: ['@heroicons/react', 'react-leaflet'],
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
