/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/drei', 'troika-three-text', 'webgl-sdf-generator', 'bidi-js'],
};

export default nextConfig;
