/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "**.wp.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cdninstagram.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "bonnotparisadmin.kinsta.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
