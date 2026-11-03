/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // WalletConnect / wagmi pull optional node-only deps; silence them in the browser bundle.
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
export default nextConfig;
