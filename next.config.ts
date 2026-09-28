import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  ...(process.env.NODE_ENV === "production" ? {} : {
    async rewrites() {
      return [
        {
          source: "/pelajari-lebih-lanjut/",
          destination: "/pelajari-lebih-lanjut/index.html",
        },
        {
          source: "/pelajari-lebih-lanjut/:path+/",
          destination: "/pelajari-lebih-lanjut/:path+/index.html",
        },
      ];
    },
  }),
};

export default nextConfig;
