import dotenv from 'dotenv'

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

dotenv.config({ path: envFile })

const INTERNAL_PACKAGES = ['@links-base/ui']

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This exports the app to a static site, needed for GitHub Pages
  transpilePackages: INTERNAL_PACKAGES,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'date-fns',
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-select',
      ...INTERNAL_PACKAGES
    ]
  },
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: config => {
    config.resolve.alias.canvas = false

    return config
  }
}

export default nextConfig
