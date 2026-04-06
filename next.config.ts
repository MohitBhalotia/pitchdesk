import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // pptxgenjs uses node: scheme modules — strip the prefix so the
      // resolve.fallback map can handle them as empty modules
      config.plugins = [
        ...(config.plugins || []),
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      ];
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        net: false,
        tls: false,
        child_process: false,
        zlib: false,
        stream: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blocks.mvp-subha.me",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  },
};

export default nextConfig;
