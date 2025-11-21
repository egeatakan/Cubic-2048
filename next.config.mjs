import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Sorunlu paketleri dönüştürmeye zorla
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    'troika-three-text',
    'troika-three-utils',
    'webgl-sdf-generator'
  ],
  
  // Webpack ayarına müdahale ediyoruz
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Bu satır, 'does not contain a default export' hatasını çözer:
      'webgl-sdf-generator': require.resolve('webgl-sdf-generator'),
      'troika-three-text': require.resolve('troika-three-text'),
    };
    return config;
  },
};

export default nextConfig;