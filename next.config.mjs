/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // DİKKAT: 'three' ve '@react-three/...' paketlerini buradan SİLDİM.
  // Hatanın sebebi onları zorla dönüştürmeye çalışmamızdı.
  // Sadece bu üçlü kalacak:
  transpilePackages: [
    'troika-three-text',
    'troika-three-utils',
    'troika-worker-utils'
  ],
};

export default nextConfig;