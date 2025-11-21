import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hataları görmezden gelme ayarları
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Paketleri işlemeye al
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    'troika-three-text'
  ],

  // Webpack ayarları (Sihirli dokunuş burası)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Tarayıcıya 'exports' hatası verdiren dosyalar yerine
      // zorla .esm.js (Modern JS) dosyalarını kullanmasını söylüyoruz:
      'troika-three-text': require.resolve('troika-three-text/dist/troika-three-text.esm.js'),
      'webgl-sdf-generator': require.resolve('webgl-sdf-generator/dist/webgl-sdf-generator.esm.js'),
    };
    return config;
  },
};

export default nextConfig;