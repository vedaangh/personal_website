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
    },
    // Masked URL forwarding with rewrites
    async rewrites() {
      return [
        {
          source: '/x',
          destination: 'https://x.com/vedaangh',
        },
        {
          source: '/linkedin',
          destination: 'https://linkedin.com/in/vedaangh',
        },
        {
          source: '/60min',
          destination: 'https://cal.com/vedaangh/ytxis',
        },
        {
          source: '/30min',
          destination: 'https://cal.com/vedaangh/vedaanghrungta30min',
        },
        {
          source: '/15min',
          destination: 'https://cal.com/15minvedaanghrungta',
        },
      ];
    }
  }
  
module.exports = nextConfig