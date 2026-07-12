import type { NextConfig } from "next";

const publishBasePath = process.env.PUBLISH_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(publishBasePath
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: publishBasePath,
        assetPrefix: `${publishBasePath}/`,
        env: {
          NEXT_PUBLIC_BASE_PATH: publishBasePath,
        },
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
