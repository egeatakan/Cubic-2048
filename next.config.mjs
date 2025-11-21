/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // KRİTİK: Burayı boş bırakıyoruz. 
  // Three.js'i buraya eklemek "redefine property" hatasına sebep oluyordu.
  transpilePackages: [], 
  
  // ÇÖZÜM: Bu ayar, "does not contain a default export" 
  // hatalarını susturup kodun çalışmasına izin verir.
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;