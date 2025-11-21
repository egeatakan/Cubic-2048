/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Sadece ana paketi dönüştür, yan paketleri listeden ÇIKARDIK.
  transpilePackages: ['troika-three-text'],

  webpack: (config) => {
    // Webpack'e paketlerin yerini elle gösteriyoruz (Alias)
    config.resolve.alias = {
      ...config.resolve.alias,
      'bidi-js': 'bidi-js/dist/bidi.mjs',
      'webgl-sdf-generator': 'webgl-sdf-generator/dist/webgl-sdf-generator.esm.js',
    };
    return config;
  },
};

export default nextConfig;