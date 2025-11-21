import path from 'path';
import { fileURLToPath } from 'url';

// .mjs dosyalarında __dirname tanımlı değildir, biz oluşturuyoruz:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['troika-three-text'],

  webpack: (config) => {
    // Alias ayarlarını TAM YOL (Absolute Path) ile yapıyoruz:
    config.resolve.alias = {
      ...config.resolve.alias,
      'bidi-js': path.join(__dirname, 'node_modules/bidi-js/dist/bidi.mjs'),
      'webgl-sdf-generator': path.join(__dirname, 'node_modules/webgl-sdf-generator/dist/webgl-sdf-generator.esm.js'),
    };
    return config;
  },
};

export default nextConfig;