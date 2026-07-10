import type { NextConfig } from "next";

const repoName = "Campaign-Website-V1";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
