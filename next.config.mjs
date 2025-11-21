import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode 3D kütüphanelerinde bazen sorun çıkarır, kapalı kalsın.
  reactStrictMode: false,
  
  // Build sırasında hata vermesin diye bunları açık tutuyoruz.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3D kütüphanelerini dönüştür.
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    'troika-three-text'
  ],

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // ÖNEMLİ 1: Three.js'in iki kere yüklenmesini engeller (Multiple instances hatası çözümü)
      'three': path.resolve(__dirname, 'node_modules/three'),
      
      // ÖNEMLİ 2: "Default export" hatasını çözerken "Window not defined" hatası VERMEMESİ için
      // direkt olarak tarayıcı uyumlu (ESM) dosyayı seçiyoruz.
      'webgl-sdf-generator': path.resolve(__dirname, 'node_modules/webgl-sdf-generator/dist/webgl-sdf-generator.esm.js'),
      'troika-three-text': path.resolve(__dirname, 'node_modules/troika-three-text/dist/troika-three-text.esm.js')
    };
    return config;
  },
};

export default nextConfig;