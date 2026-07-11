import type { NextConfig } from "next";

const publishBasePath = process.env.PUBLISH_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: publishBasePath || undefined,
  assetPrefix: publishBasePath ? `${publishBasePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: publishBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
