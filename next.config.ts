import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const security = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];
    if (process.env.NODE_ENV === 'production') {
      security.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      });
    }
    return [{ source: '/:path*', headers: security }];
  },
  async redirects() {
    return [
      {
        source: '/curso/:slug/modulo/:moduleId/certificado',
        destination: '/course/:slug/module/:moduleId/certificate',
        permanent: true,
      },
      {
        source: '/curso/:slug/modulo/:moduleId',
        destination: '/course/:slug/module/:moduleId',
        permanent: true,
      },
      { source: '/curso/:slug', destination: '/course/:slug', permanent: true },
      { source: '/curso', destination: '/course', permanent: true },
      {
        source: '/engenharia-trabalho/:slug',
        destination: '/engineering-work/:slug',
        permanent: true,
      },
      { source: '/engenharia-trabalho', destination: '/engineering-work', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'key-rush.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
