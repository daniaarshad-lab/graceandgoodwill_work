/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  output: 'standalone', // Enables minimal container output
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Consolidate duplicate companionship pages
        source: '/live-in-companionship',
        destination: '/live-in-companionship-care',
        permanent: true, // 301 redirect for SEO
      },
      {
        // Consolidate duplicate hospital discharge pages
        source: '/live-in-care-after-hospital-discharge',
        destination: '/hospital-discharge-live-in-care',
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
