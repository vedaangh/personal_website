/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
    // Vercel-specific optimizations
    experimental: {
      // Removing optimizeCss because it requires critters package
      turbo: {
        loaders: {
          // Optimize loading of specific file types if needed
        }
      }
    }
  }
  
module.exports = nextConfig