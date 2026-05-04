import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
