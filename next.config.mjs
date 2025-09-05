import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.parandx.com', 'localhost', 'parandx.com'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // برای تصاویر خارجی
  },
  // غیرفعال کردن کامل کش
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-leaflet'],
  },
  // تنظیمات برای غیرفعال کردن کش
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  // تنظیم timeout برای API calls
  serverRuntimeConfig: {
    maxDuration: 120, // کاهش به 15 ثانیه برای سرعت بیشتر
  },
  // غیرفعال کردن کش در webpack
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
