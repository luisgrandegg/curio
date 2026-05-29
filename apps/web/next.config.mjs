/** @type {import('next').NextConfig} */
const nextConfig = {
  // The web app resolves the shared @curio/types workspace package.
  transpilePackages: ["@curio/types"],
  reactStrictMode: true,
};

export default nextConfig;
