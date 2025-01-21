/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
    // Vercel-specific optimizations
    experimental: {
      optimizeCss: true,
      turbo: {
        loaders: {
          // Optimize loading of specific file types if needed
        }
      }
    }
  }