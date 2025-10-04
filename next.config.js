/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Отключаем Turbopack для стабильности
  experimental: {
    turbo: {
      rules: {}
    }
  },
  webpack: (config) => {
    config.externals.push({
      'swisseph': 'commonjs swisseph'
    });
    
    // Исправляем проблемы с загрузкой модулей в Next.js 15
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
}

module.exports = nextConfig
