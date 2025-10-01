/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds in development, not production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // Only ignore build errors in development, not production
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  webpack: (config, { isServer, dev }) => {
    // Improve module resolution
    config.resolve.symlinks = false;
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      };
    }

    // Optimize for development
    if (dev) {
      config.cache = {
        type: 'filesystem',
      };
    }

    // Fix webpack internal errors
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
}

export default nextConfig
