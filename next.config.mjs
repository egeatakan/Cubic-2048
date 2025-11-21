/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tüm sorunlu 3D ve yazı paketlerini buraya ekliyoruz.
  // Next.js bunları otomatik olarak tarayıcı uyumlu hale getirecek.
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
  
  // Webpack aliaslarını SİLDİK çünkü dosya yolu hatası veriyor.
  // Bunun yerine Webpack'e "module" (ESM) dosyalarını öncelikli kullanmasını söylüyoruz.
  webpack: (config) => {
    config.resolve.mainFields = ['module', 'main'];
    return config;
  },
};

export default nextConfig;