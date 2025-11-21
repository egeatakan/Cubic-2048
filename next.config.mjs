/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Sadece paketleri dönüştürmeye devam etsin, gerisine karışmasın
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    'troika-three-text',
    'troika-three-utils',
    'troika-worker-utils',
    'webgl-sdf-generator',
    'bidi-js'
  ],
};

export default nextConfig;