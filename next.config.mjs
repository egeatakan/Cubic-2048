import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Sadece ana paketi dönüştürmeye devam et
  transpilePackages: ['troika-three-text'],

  webpack: (config) => {
    // Projenin ana klasörünü alıyoruz
    const projectRoot = process.cwd();

    // Alias ayarlarını projectRoot üzerinden yapıyoruz
    config.resolve.alias = {
      ...config.resolve.alias,
      'bidi-js': path.join(projectRoot, 'node_modules/bidi-js/dist/bidi.mjs'),
      'webgl-sdf-generator': path.join(projectRoot, 'node_modules/webgl-sdf-generator/dist/webgl-sdf-generator.esm.js'),
    };
    
    return config;
  },
};

export default nextConfig;