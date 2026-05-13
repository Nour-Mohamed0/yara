/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  experimental: {
    esmExternals: true,
  },
  // Cloudflare Pages compatible build
  output: process.env.BUILD_TARGET === 'cloudflare' ? 'export' : undefined,
  reactCompiler: false,
}

export default nextConfig
