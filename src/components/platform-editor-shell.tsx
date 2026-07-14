"use client";

import { useEffect, useState } from "react";
import { EditorPostsWorkspace } from "@/components/editor-posts-workspace";
import { editorMediaAssets } from "@/generated/editor-media-assets";
import { EditorShell } from "@/vendor/site-editor-platform/editor";
import type { BuilderPage, MediaAsset } from "@/vendor/site-editor-platform/core";
import builderConfig from "../../builder.config";

const editorPages: BuilderPage[] = builderConfig.pages.map((page) => ({
  path: page.path,
  label: page.label,
  regions: [...page.regions],
}));

function resolveBasePath() {
  const configured = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (configured) return configured.replace(/\/$/, "");
  return window.location.pathname.startsWith("/Campaign-Website-V1") ? "/Campaign-Website-V1" : "";
}

export function PlatformEditorShell() {
  const [location, setLocation] = useState<{ baseUrl: string; currentPath: string } | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const basePath = resolveBasePath();
    setLocation({
      baseUrl: `${window.location.origin}${basePath}/`,
      currentPath: url.searchParams.get("path") || "/",
    });
  }, []);

  if (!location) return <main aria-label="Loading site editor" style={{ minHeight: "100vh", background: "#eef2f6" }} />;

  const resolvedMediaAssets: MediaAsset[] = editorMediaAssets.map((asset) => ({
    ...asset,
    url: new URL(asset.path.replace(/^\/+/, ""), location.baseUrl).toString(),
  }));

  return (
    <EditorShell
      siteId="campaign-website-v1"
      currentPath={location.currentPath}
      pages={editorPages}
      previewBaseUrl={location.baseUrl}
      userViewUrl={`${location.baseUrl}?builderExit=1`}
      defaultViewport="desktop"
      mediaAssets={resolvedMediaAssets}
      postsWorkspace={<EditorPostsWorkspace />}
      demoMode
    />
  );
}
