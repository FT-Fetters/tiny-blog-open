/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/post/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
    ];
  },
  // Docker 部署时启用 standalone，开发环境禁用以避免错误
  output: process.env.NODE_ENV === 'production' && process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  // 优化构建
  swcMinify: true,
  // 压缩配置
  compress: true,
};

module.exports = nextConfig;