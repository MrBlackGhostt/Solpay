import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }


    config.resolve.alias = {
      ...config.resolve.alias,
      '@solana/wallet-adapter-base': require.resolve('@solana/wallet-adapter-base'),
      '@solana/wallet-adapter-react': require.resolve('@solana/wallet-adapter-react'),
    };
    return config;
  },

  turbopack: {},
  transpilePackages: [
    '@privy-io/react-auth',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-wallets',
    '@solana/wallet-standard-features',
    '@solana-program/token',
    '@solana-program/system',
    '@solana-program/memo',
  ],
};

export default nextConfig;
