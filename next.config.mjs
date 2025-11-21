/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Worker paketlerini (utils) buradan ÇIKARDIK.
  // Sadece ana giriş paketini dönüştür, gerisine dokunma.
  transpilePackages: ['troika-three-text'],
};

export default nextConfig;