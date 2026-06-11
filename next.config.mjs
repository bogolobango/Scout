/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/download": ["./private/**/*"],
    },
  },
};

export default nextConfig;
