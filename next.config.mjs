/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
