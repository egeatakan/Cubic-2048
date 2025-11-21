/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'troika-three-text'],
};

// HATA BURADAYDI: "module.exports" yerine "export default" yazıyoruz:
export default nextConfig;