/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Hata veren paketleri dönüştürmeye devam ediyoruz
  transpilePackages: [
    'troika-three-text',
    'troika-three-utils',
    'troika-worker-utils',
    'webgl-sdf-generator',
    'bidi-js'
  ],
  // SİHİRLİ AYAR BURASI:
  // Bu ayar, "default export" ve "import" uyumsuzluklarını görmezden gelir.
  experimental: {
    esmExternals: 'loose' 
  },
  // Webpack ayarlarını sildik (Alias yok, risk yok)
};

export default nextConfig;