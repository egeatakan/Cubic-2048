/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Sadece paketleri dönüştürmesi yeterli, yol tarifine gerek yok
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    'troika-three-text',
    'webgl-sdf-generator' // Bunu buraya eklemek yeterli
  ],
};

export default nextConfig;