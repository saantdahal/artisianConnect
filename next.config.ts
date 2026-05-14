import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images1.novica.net',
      },
      {
        protocol: 'https',
        hostname: 'media.artmuseum.princeton.edu',
      },
      {
        protocol: 'https',
        hostname: 'americanindian.si.edu',
      },
      {
        protocol: 'https',
        hostname: 'ich.unesco.org',
      },
      {
        protocol: 'https',
        hostname: 'collectionapi.metmuseum.org',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

export default nextConfig;
