/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // BU KISIM YENİ EKLENDİ:
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'troika-three-text'],
}

module.exports = nextConfig