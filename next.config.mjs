/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ÇÖZÜM BURADA:
  // Hata veren tüm paketleri buraya ekledik ki Next.js bunları
  // tarayıcı için düzgünce paketlesin.
  transpilePackages: [
    'troika-three-text',
    'webgl-sdf-generator',
    'bidi-js'
  ],
};

export default nextConfig;