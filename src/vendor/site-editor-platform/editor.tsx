"use client";

import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Monitor,
  RotateCw,
  Save,
  LogOut,
  Smartphone,
  Tablet,
  Upload,
} from "lucide-react";
import { isBuilderPreviewMessage, type AuditEvent, type BuilderPage, type EditableValue, type MediaAsset } from "./core";
import { ContentNavigation } from "./content/ContentNavigation";
import type { ContentWorkspace } from "./content/content-types";
import { computeContextMenuPosition, PostContextMenu } from "./content/PostContextMenu";

export interface SelectedRegion {
  id: string;
  kind: "text" | "richText" | "image" | "link" | "sections" | "icon";
  label?: string;
  value?: string;
  alt?: string;
  href?: string;
}

export interface EditorShellProps {
  siteId: string;
  currentPath: string;
  pages: BuilderPage[];
  previewBaseUrl: string;
  viewportPresets?: EditorViewportPreset[];
  defaultViewport?: string;
  defaultZoom?: number;
  userViewUrl?: string;
  logoutUrl?: string;
  demoMode?: boolean;
  onViewportChange?: (viewport: EditorViewportState) => void;
  selectedRegion?: SelectedRegion;
  auditLog?: AuditEvent[];
  mediaAssets?: MediaAsset[];
  children?: ReactNode;
  postCollectionMode?: "manual" | "query";
  onEditPost?: (entryId: string) => void;
  onChooseAnotherPost?: (entryId: string, regionId: string) => void;
  onOpenPostDetail?: (entryId: string) => void;
  onViewPostHistory?: (entryId: string) => void;
  onRemovePostFromCollection?: (entryId: string, regionId: string) => void;
  initialWorkspace?: ContentWorkspace;
  postsWorkspace?: ReactNode;
}

export interface EditorViewportPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface EditorViewportState extends EditorViewportPreset {
  zoom: number;
  orientation: "portrait" | "landscape";
}

export const defaultViewportPresets: EditorViewportPreset[] = [
  { id: "desktop", label: "Desktop", width: 1280, height: 860 },
  { id: "tablet", label: "Tablet", width: 820, height: 1080 },
  { id: "mobile", label: "Mobile", width: 390, height: 844 },
];

export function buildPreviewUrl(baseUrl: string, path: string, siteId?: string) {
  const base = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  const url = new URL(path.replace(/^\/+/, ""), base);
  url.searchParams.set("builderPreview", "1");
  if (siteId) url.searchParams.set("builderSiteId", siteId);
  return url.toString();
}

export function resizeViewportWidth(width: number, deltaX: number, edge: "left" | "right") {
  const direction = edge === "right" ? 1 : -1;
  return Math.min(1920, Math.max(280, Math.round(width + deltaX * direction * 2)));
}

function clampZoom(zoom: number) {
  return Math.min(1.25, Math.max(0.35, Number.isFinite(zoom) ? zoom : 0.72));
}

function resolveViewport(presets: EditorViewportPreset[], id: string | undefined) {
  return presets.find((preset) => preset.id === id) ?? presets[0] ?? defaultViewportPresets[0];
}

function orientViewport(viewport: EditorViewportPreset, orientation: EditorViewportState["orientation"]) {
  if (orientation === "portrait") return viewport;
  return { ...viewport, width: viewport.height, height: viewport.width };
}

export function EditorShell({
  siteId,
  currentPath,
  pages,
  previewBaseUrl,
  viewportPresets,
  defaultViewport = "desktop",
  defaultZoom = 0.72,
  userViewUrl,
  logoutUrl,
  demoMode = false,
  onViewportChange,
  selectedRegion,
  auditLog = [],
  mediaAssets = [],
  children,
  postCollectionMode = "query",
  onEditPost,
  onChooseAnotherPost,
  onOpenPostDetail,
  onViewPostHistory,
  onRemovePostFromCollection,
  initialWorkspace = "pages",
  postsWorkspace,
}: EditorShellProps) {
  const presets = useMemo(() => (viewportPresets?.length ? viewportPresets : defaultViewportPresets), [viewportPresets]);
  const initialViewport = resolveViewport(presets, defaultViewport);
  const [viewportId, setViewportId] = useState(initialViewport.id);
  const [customWidth, setCustomWidth] = useState(initialViewport.width);
  const [customHeight, setCustomHeight] = useState(initialViewport.height);
  const [zoom, setZoom] = useState(clampZoom(defaultZoom));
  const [orientation, setOrientation] = useState<EditorViewportState["orientation"]>("portrait");
  const [activeWorkspace, setActiveWorkspace] = useState<ContentWorkspace>(initialWorkspace);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [selectedPost, setSelectedPost] = useState<{
    entryId: string;
    regionId: string;
    anchor: { x: number; y: number };
  } | null>(null);
  const [postMenuPosition, setPostMenuPosition] = useState({ left: 16, top: 16 });
  const selectedPreset = resolveViewport(presets, viewportId);
  const activeBaseViewport =
    viewportId === "custom"
      ? { id: "custom", label: "Custom", width: customWidth, height: customHeight }
      : selectedPreset;
  const orientedViewport = orientViewport(activeBaseViewport, orientation);
  const activeViewport: EditorViewportState = {
    ...orientedViewport,
    id: activeBaseViewport.id,
    label: activeBaseViewport.label,
    zoom,
    orientation,
  };

  useEffect(() => {
    onViewportChange?.(activeViewport);
  }, [activeViewport.id, activeViewport.width, activeViewport.height, activeViewport.zoom, activeViewport.orientation]);

  function chooseViewport(preset: EditorViewportPreset) {
    setViewportId(preset.id);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
  }

  function chooseCustomWidth(width: number, height = activeViewport.height) {
    const nextWidth = Math.min(1920, Math.max(280, width || 280));
    setViewportId("custom");
    setCustomWidth(nextWidth);
    setCustomHeight(height);
  }

  function startResize(edge: "left" | "right", clientX: number) {
    dragCleanupRef.current?.();
    const startWidth = activeViewport.width;
    const startHeight = activeViewport.height;

    const move = (event: PointerEvent) => {
      chooseCustomWidth(resizeViewportWidth(startWidth, event.clientX - clientX, edge), startHeight);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      dragCleanupRef.current = null;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    dragCleanupRef.current = stop;
  }

  useEffect(() => () => dragCleanupRef.current?.(), []);

  useEffect(() => {
    const previewOrigin = new URL(previewBaseUrl).origin;
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== previewOrigin ||
        event.source !== previewFrameRef.current?.contentWindow ||
        !isBuilderPreviewMessage(event.data, siteId) ||
        event.data.type !== "builder:select-entry" ||
        event.data.pagePath !== currentPath
      ) return;

      setSelectedPost({
        entryId: event.data.entryId,
        regionId: event.data.regionId ?? "",
        anchor: event.data.anchor ?? { x: 24, y: 24 },
      });
      setActiveWorkspace("posts");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentPath, previewBaseUrl, siteId]);

  useEffect(() => {
    if (!selectedPost) return;
    const reposition = () => {
      const frameRect = previewFrameRef.current?.getBoundingClientRect();
      if (!frameRect) return;
      setPostMenuPosition(computeContextMenuPosition(
        {
          x: frameRect.left + selectedPost.anchor.x * activeViewport.zoom,
          y: frameRect.top + selectedPost.anchor.y * activeViewport.zoom,
        },
        { width: window.innerWidth, height: window.innerHeight },
      ));
    };
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [selectedPost, activeViewport.zoom, activeViewport.width, activeViewport.height]);

  function resetViewport() {
    const desktop = resolveViewport(presets, "desktop");
    setViewportId(desktop.id);
    setCustomWidth(desktop.width);
    setCustomHeight(desktop.height);
    setOrientation("portrait");
    setZoom(clampZoom(defaultZoom));
  }

  const workspaceContent =
    activeWorkspace === "pages"
      ? null
      : renderWorkspaceContent({
          activeWorkspace,
          postsWorkspace,
          mediaAssets: mediaAssets.length > 0 ? mediaAssets : defaultDemoMediaAssets(previewBaseUrl, siteId),
          auditLog,
          pages,
        });

  return (
    <main data-builder-editor-shell style={styles.shell}>
      <aside style={styles.sidebar} aria-label="Site pages">
        <div style={styles.sidebarHeader}>
          <strong>{siteId}</strong>
          <span style={styles.muted}>{demoMode ? "Demo mode" : "Site editor"}</span>
        </div>
        <ContentNavigation active={activeWorkspace} onChange={setActiveWorkspace} />
        <nav style={styles.nav}>
          {pages.map((page) => (
            <a
              key={page.path}
              href={`?path=${encodeURIComponent(page.path)}`}
              aria-current={page.path === currentPath ? "page" : undefined}
              style={{
                ...styles.navItem,
                ...(page.path === currentPath ? styles.navItemActive : {}),
              }}
            >
              {page.label}
            </a>
          ))}
        </nav>
      </aside>

      <section
        style={{ ...styles.canvasArea, display: activeWorkspace === "pages" ? "grid" : "none" }}
        aria-label="Website preview"
        data-builder-preview-visible={activeWorkspace === "pages" ? "true" : "false"}
      >
        <div style={styles.toolbar}>
          <div style={styles.toolbarStatus}>
            <span style={styles.muted}>Editing {currentPath}</span>
            <strong data-builder-active-width>
              {activeViewport.label}: {activeViewport.width}px at {Math.round(activeViewport.zoom * 100)}%
            </strong>
          </div>
          <div style={styles.toolbarActions}>
            <div style={styles.segmentedControl} aria-label="Viewport presets">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={activeBaseViewport.id === preset.id}
                  style={{
                    ...styles.segmentButton,
                    ...(activeBaseViewport.id === preset.id ? styles.segmentButtonActive : {}),
                  }}
                  onClick={() => chooseViewport(preset)}
                  aria-label={`${preset.label} view`}
                  title={`${preset.label} view`}
                >
                  {preset.id === "desktop" ? (
                    <Monitor size={18} aria-hidden="true" />
                  ) : preset.id === "tablet" ? (
                    <Tablet size={18} aria-hidden="true" />
                  ) : preset.id === "mobile" ? (
                    <Smartphone size={18} aria-hidden="true" />
                  ) : (
                    preset.label
                  )}
                </button>
              ))}
            </div>
            <label style={styles.inlineField}>
              Width
              <input
                aria-label="Custom viewport width"
                type="number"
                min={280}
                max={1920}
                value={activeViewport.width}
                onChange={(event) => chooseCustomWidth(Number(event.target.value))}
                style={styles.compactInput}
              />
            </label>
            <label style={styles.inlineField}>
              Zoom
              <input
                aria-label="Preview zoom"
                type="range"
                min={35}
                max={125}
                value={Math.round(activeViewport.zoom * 100)}
                onChange={(event) => setZoom(clampZoom(Number(event.target.value) / 100))}
              />
            </label>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => setOrientation((current) => (current === "portrait" ? "landscape" : "portrait"))}
            >
              <RotateCw size={17} aria-hidden="true" />
              <span>Rotate</span>
            </button>
            <button type="button" style={styles.secondaryButton} onClick={resetViewport}>
              Reset
            </button>
            <button type="button" style={styles.secondaryButton}>
              <Save size={17} aria-hidden="true" />
              <span>Save draft</span>
            </button>
            <button type="button" style={styles.primaryButton}>
              <Upload size={17} aria-hidden="true" />
              <span>Publish</span>
            </button>
            {userViewUrl ? (
              <a href={userViewUrl} style={styles.userViewLink}>
                <ArrowLeft size={17} aria-hidden="true" />
                <span>Back to user view</span>
              </a>
            ) : null}
            {logoutUrl ? (
              <form action={logoutUrl} method="post" style={styles.inlineForm}>
                <button type="submit" style={styles.secondaryButton}>
                  <LogOut size={17} aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </form>
            ) : null}
          </div>
        </div>
        <div style={styles.canvas}>
          <div style={{ ...styles.previewStage, transform: `scale(${activeViewport.zoom})` }}>
            <button
              type="button"
              aria-label="Resize preview from left edge"
              data-builder-resize-handle="left"
              style={{ ...styles.resizeHandle, left: "-17px" }}
              onPointerDown={(event) => startResize("left", event.clientX)}
            />
            <div
              style={{
                ...styles.previewFrame,
                width: `${activeViewport.width}px`,
                height: `${activeViewport.height}px`,
              }}
              data-builder-viewport={activeViewport.id}
              data-builder-viewport-width={activeViewport.width}
              data-builder-viewport-height={activeViewport.height}
            >
              <iframe
                ref={previewFrameRef}
                title="Editable website preview"
                src={buildPreviewUrl(previewBaseUrl, currentPath, siteId)}
                style={styles.iframe}
                data-builder-preview
                data-builder-viewport={activeViewport.id}
                data-builder-viewport-width={activeViewport.width}
              />
            </div>
            <button
              type="button"
              aria-label="Resize preview from right edge"
              data-builder-resize-handle="right"
              style={{ ...styles.resizeHandle, right: "-17px" }}
              onPointerDown={(event) => startResize("right", event.clientX)}
            />
          </div>
        </div>
      </section>

      {workspaceContent}

      <aside style={{ ...styles.panel, display: activeWorkspace === "pages" ? "block" : "none" }} aria-label="Editing panel">
        {activeWorkspace !== "pages" ? (
          <section data-builder-content-workspace={activeWorkspace} style={styles.workspaceNotice}>
            <strong>{activeWorkspace[0].toUpperCase() + activeWorkspace.slice(1)} workspace</strong>
            <span style={styles.muted}>Content tools stay open without resetting the website preview.</span>
          </section>
        ) : null}
        <h2 style={styles.panelTitle}>{selectedRegion?.label ?? "Select an editable area"}</h2>
        {selectedRegion ? (
          <RegionEditorFields selectedRegion={selectedRegion} mediaAssets={mediaAssets} />
        ) : (
          <p style={styles.muted}>Click text, images, links, or approved sections in the preview.</p>
        )}
        {children}
        <h3 style={styles.historyTitle}>Version history</h3>
        <ol style={styles.historyList}>
          {auditLog.map((event) => (
            <li key={event.id} style={styles.historyItem}>
              <strong>{event.summary}</strong>
              <span style={styles.muted}>
                {new Date(event.createdAt).toLocaleString()}
                {event.userLabel || event.userId ? ` by ${event.userLabel ?? event.userId}` : ""}
              </span>
              <span style={styles.muted}>
                {event.pagePath}
                {event.regionId ? ` | ${event.regionId}` : ""}
              </span>
              <HistoryValue label="Before" value={event.before} />
              <HistoryValue label="After" value={event.after} />
              {event.action === "version.rolled_back" ? (
                <button type="button" style={styles.secondaryButton}>
                  Undo rollback
                </button>
              ) : (
                <button type="button" style={styles.primaryButton}>
                  Rollback
                </button>
              )}
            </li>
          ))}
        </ol>
      </aside>
      {selectedPost ? (
        <PostContextMenu
          entryId={selectedPost.entryId}
          regionId={selectedPost.regionId}
          collectionMode={postCollectionMode}
          position={postMenuPosition}
          onEdit={() => onEditPost?.(selectedPost.entryId)}
          onChooseAnother={onChooseAnotherPost ? () => onChooseAnotherPost(selectedPost.entryId, selectedPost.regionId) : undefined}
          onOpenDetail={() => onOpenPostDetail?.(selectedPost.entryId)}
          onViewHistory={() => onViewPostHistory?.(selectedPost.entryId)}
          onRemove={onRemovePostFromCollection ? () => onRemovePostFromCollection(selectedPost.entryId, selectedPost.regionId) : undefined}
          onClose={() => setSelectedPost(null)}
        />
      ) : null}
    </main>
  );
}

function renderWorkspaceContent({
  activeWorkspace,
  postsWorkspace,
  mediaAssets,
  auditLog,
  pages,
}: {
  activeWorkspace: Exclude<ContentWorkspace, "pages">;
  postsWorkspace?: ReactNode;
  mediaAssets: MediaAsset[];
  auditLog: AuditEvent[];
  pages: BuilderPage[];
}) {
  if (activeWorkspace === "posts") {
    return (
      <section
        style={styles.contentWorkspace}
        aria-label="Posts workspace"
        data-builder-content-workspace="posts"
        data-builder-hosted-workspace="posts"
      >
        <WorkspaceHeader
          title="Campaign updates"
          eyebrow="Posts"
          description="Draft and organize campaign news, events, and update entries before placing them on the public site."
        />
        {postsWorkspace ? (
          postsWorkspace
        ) : (
          <div style={styles.workspaceGrid}>
            {demoPosts.map((post) => (
              <article key={post.title} style={styles.workspaceCard}>
                <span style={styles.statusPill}>{post.status}</span>
                <h3 style={styles.workspaceCardTitle}>{post.title}</h3>
                <p style={styles.workspaceCardMeta}>{post.location}</p>
                <p style={styles.workspaceCardText}>{post.summary}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (activeWorkspace === "media") {
    return (
      <section style={styles.contentWorkspace} aria-label="Media workspace" data-builder-content-workspace="media">
        <WorkspaceHeader
          title="Media library"
          eyebrow="Assets"
          description="Review the campaign images available to the editor. Image replacements still happen from editable image fields in the page preview."
        />
        <div style={styles.mediaGrid}>
          {mediaAssets.map((asset) => (
            <article key={asset.id} style={styles.mediaCard}>
              <img src={asset.url} alt={asset.alt} style={styles.mediaPreview} />
              <div style={styles.mediaBody}>
                <strong>{asset.label}</strong>
                <span style={styles.workspaceCardMeta}>{asset.path}</span>
                <span style={styles.muted}>{asset.mimeType}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section style={styles.contentWorkspace} aria-label="History workspace" data-builder-content-workspace="history">
      <WorkspaceHeader
        title="Change history"
        eyebrow="Versions"
        description="Track editor changes, published revisions, and rollback options for the selected campaign site."
      />
      {auditLog.length > 0 ? (
        <ol style={styles.workspaceHistoryList}>
          {auditLog.map((event) => (
            <li key={event.id} style={styles.workspaceCard}>
              <span style={styles.statusPill}>{event.action}</span>
              <h3 style={styles.workspaceCardTitle}>{event.summary}</h3>
              <p style={styles.workspaceCardMeta}>
                {event.pagePath}
                {event.regionId ? ` | ${event.regionId}` : ""}
              </p>
              <p style={styles.muted}>
                {new Date(event.createdAt).toLocaleString()}
                {event.userLabel || event.userId ? ` by ${event.userLabel ?? event.userId}` : ""}
              </p>
              <HistoryValue label="Before" value={event.before} />
              <HistoryValue label="After" value={event.after} />
            </li>
          ))}
        </ol>
      ) : (
        <div style={styles.emptyState}>
          <h3 style={styles.workspaceCardTitle}>No changes recorded yet</h3>
          <p style={styles.workspaceCardText}>
            Edit any region on {pages[0]?.label ?? "a page"} and save it to populate this history workspace.
          </p>
        </div>
      )}
    </section>
  );
}

function WorkspaceHeader({
  title,
  eyebrow,
  description,
}: {
  title: string;
  eyebrow: string;
  description: string;
}) {
  return (
    <header style={styles.workspaceHeader}>
      <span style={styles.workspaceEyebrow}>{eyebrow}</span>
      <h2 style={styles.workspaceTitle}>{title}</h2>
      <p style={styles.workspaceDescription}>{description}</p>
    </header>
  );
}

function defaultDemoMediaAssets(previewBaseUrl: string, siteId: string): MediaAsset[] {
  const now = new Date(0).toISOString();
  return [
    {
      id: "campaign-office-briefing",
      siteId,
      path: "/images/campaign/campaign-office-briefing.jpg",
      url: new URL("images/campaign/campaign-office-briefing.jpg", previewBaseUrl).toString(),
      alt: "Campaign team reviewing materials in an office",
      label: "Campaign office briefing",
      mimeType: "image/jpeg",
      source: "seed",
      userId: "demo",
      createdAt: now,
    },
    {
      id: "community-table-outreach",
      siteId,
      path: "/images/campaign/community-table-outreach.jpg",
      url: new URL("images/campaign/community-table-outreach.jpg", previewBaseUrl).toString(),
      alt: "Community outreach table with campaign materials",
      label: "Community table outreach",
      mimeType: "image/jpeg",
      source: "seed",
      userId: "demo",
      createdAt: now,
    },
    {
      id: "volunteer-team-morales",
      siteId,
      path: "/images/campaign/volunteer-team-morales.jpg",
      url: new URL("images/campaign/volunteer-team-morales.jpg", previewBaseUrl).toString(),
      alt: "Morales campaign volunteer team",
      label: "Volunteer team",
      mimeType: "image/jpeg",
      source: "seed",
      userId: "demo",
      createdAt: now,
    },
  ];
}

const demoPosts = [
  {
    title: "District listening session recap",
    location: "News page",
    status: "Draft",
    summary: "Short-form campaign update ready to connect to a future posts collection.",
  },
  {
    title: "Weekend volunteer launch",
    location: "Events page",
    status: "Scheduled",
    summary: "Event-style post for canvassing, phone banking, or community stops.",
  },
  {
    title: "Education priorities statement",
    location: "Issues page",
    status: "Published",
    summary: "Policy update that can be reused across issue and news sections.",
  },
];

function RegionEditorFields({
  selectedRegion,
  mediaAssets,
}: {
  selectedRegion: SelectedRegion;
  mediaAssets: MediaAsset[];
}) {
  if (selectedRegion.kind === "icon") {
    return (
      <div style={styles.fieldGroup}>
        <label htmlFor="builder-region-value" style={styles.label}>
          Icon
        </label>
        <select id="builder-region-value" defaultValue={selectedRegion.value} style={styles.input}>
          <option value="">Choose an icon</option>
          {iconOptions.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <div aria-label="Choose an icon" style={styles.iconGrid}>
          {iconOptions.map((icon) => (
            <button key={icon} type="button" style={styles.iconChoice}>
              <span className="material-symbols-outlined" aria-hidden="true">
                {icon}
              </span>
              <span>{icon}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedRegion.kind === "image") {
    return (
      <div style={styles.fieldGroup}>
        <label htmlFor="builder-region-value" style={styles.label}>
          Image path
        </label>
        <input id="builder-region-value" defaultValue={selectedRegion.value} style={styles.input} />
        <label htmlFor="builder-region-alt" style={styles.label}>
          Alt text
        </label>
        <textarea id="builder-region-alt" defaultValue={selectedRegion.alt} style={styles.textarea} />
        <button type="button" style={styles.secondaryButton}>
          Open gallery
        </button>
        <label style={styles.uploadButton}>
          Upload image
          <input type="file" accept="image/*" hidden />
        </label>
        <div style={styles.galleryGrid}>
          {mediaAssets.map((asset) => (
            <button key={asset.id} type="button" style={styles.galleryCard}>
              <img src={asset.url} alt="" style={styles.galleryImage} />
              <span>{asset.label}</span>
              <small style={styles.muted}>{asset.mimeType}</small>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedRegion.kind === "link") {
    return (
      <div style={styles.fieldGroup}>
        <label htmlFor="builder-region-value" style={styles.label}>
          Link text
        </label>
        <textarea id="builder-region-value" defaultValue={selectedRegion.value} style={styles.textarea} />
        <label htmlFor="builder-region-href" style={styles.label}>
          Link destination
        </label>
        <input id="builder-region-href" defaultValue={selectedRegion.href} style={styles.input} />
      </div>
    );
  }

  return (
    <div style={styles.fieldGroup}>
      <label htmlFor="builder-region-value" style={styles.label}>
        {selectedRegion.kind}
      </label>
      <textarea id="builder-region-value" defaultValue={selectedRegion.value} style={styles.textarea} />
    </div>
  );
}

function HistoryValue({ label, value }: { label: string; value?: EditableValue | null }) {
  if (!value) return null;

  if (value.type === "image") {
    return (
      <div style={styles.historyValue}>
        <strong style={styles.historyValueLabel}>{label}</strong>
        <img src={value.src} alt={`${label} preview`} style={styles.historyImage} />
        <span style={styles.muted}>{value.alt ?? value.src}</span>
      </div>
    );
  }

  const text =
    value.type === "link"
      ? `${value.label} -> ${value.href}`
      : value.type === "sections"
        ? value.value.join(", ")
        : value.type === "icon"
          ? value.icon
          : value.type === "postCollection"
            ? `Posts from ${value.sourceScopeKey}`
            : value.value;

  return (
    <div style={styles.historyValue}>
      <strong style={styles.historyValueLabel}>{label}</strong>
      <span>{text}</span>
    </div>
  );
}

const iconOptions = [
  "home",
  "work",
  "mail",
  "phone",
  "campaign",
  "how_to_vote",
  "warning",
  "business_center",
  "volunteer_activism",
  "groups",
  "event",
  "location_on",
];

const styles = {
  shell: {
    display: "grid",
    gridTemplateColumns: "220px minmax(420px, 1fr) 320px",
    minHeight: "100vh",
    background: "#f4f6f8",
    color: "#111827",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  sidebar: {
    borderRight: "1px solid #d7dde5",
    background: "#ffffff",
    padding: "18px",
  },
  sidebarHeader: {
    display: "grid",
    gap: "4px",
    marginBottom: "20px",
  },
  muted: {
    color: "#667085",
    fontSize: "13px",
  },
  nav: {
    display: "grid",
    gap: "8px",
  },
  navItem: {
    color: "#344054",
    textDecoration: "none",
    borderRadius: "8px",
    padding: "10px 12px",
    border: "1px solid transparent",
  },
  navItemActive: {
    background: "#eef4ff",
    borderColor: "#b2ccff",
    color: "#175cd3",
  },
  canvasArea: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    minWidth: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    minHeight: "72px",
    gap: "12px 18px",
    borderBottom: "1px solid #d7dde5",
    background: "#ffffff",
    padding: "12px 18px",
  },
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "10px",
  },
  toolbarStatus: {
    display: "grid",
    gap: "3px",
    minWidth: "160px",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "0",
    borderRadius: "8px",
    background: "#175cd3",
    color: "#ffffff",
    fontWeight: 700,
    padding: "10px 14px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#344054",
    fontWeight: 700,
    padding: "10px 14px",
  },
  segmentedControl: {
    display: "flex",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    overflow: "hidden",
  },
  segmentButton: {
    display: "grid",
    placeItems: "center",
    minWidth: "42px",
    border: "0",
    borderRight: "1px solid #c9d2df",
    background: "#ffffff",
    color: "#344054",
    fontWeight: 700,
    padding: "9px 10px",
  },
  segmentButtonActive: {
    background: "#175cd3",
    color: "#ffffff",
  },
  inlineField: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#344054",
    fontSize: "13px",
    fontWeight: 700,
  },
  compactInput: {
    width: "74px",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    padding: "8px",
    font: "inherit",
  },
  canvas: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    minWidth: 0,
    overflow: "auto",
    padding: "28px",
  },
  previewFrame: {
    background: "#ffffff",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  previewStage: {
    position: "relative",
    transformOrigin: "center",
  },
  resizeHandle: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    width: "16px",
    height: "72px",
    transform: "translateY(-50%)",
    border: "1px solid #98a2b3",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 3px 10px rgba(15, 23, 42, 0.16)",
    cursor: "ew-resize",
    touchAction: "none",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "0",
  },
  panel: {
    borderLeft: "1px solid #d7dde5",
    background: "#ffffff",
    padding: "18px",
  },
  userViewLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    borderRadius: "8px",
    background: "#087f78",
    color: "#ffffff",
    fontWeight: 700,
    padding: "10px 14px",
    textDecoration: "none",
  },
  inlineForm: {
    margin: 0,
  },
  panelTitle: {
    margin: "0 0 16px",
    fontSize: "18px",
  },
  workspaceNotice: {
    display: "grid",
    gap: "4px",
    marginBottom: "18px",
    border: "1px solid #b2ccff",
    borderRadius: "8px",
    background: "#eef4ff",
    padding: "12px",
  },
  contentWorkspace: {
    gridColumn: "2 / 4",
    minWidth: 0,
    overflow: "auto",
    background: "#f8fafc",
    padding: "24px",
  },
  workspaceHeader: {
    display: "grid",
    gap: "8px",
    maxWidth: "760px",
    marginBottom: "22px",
  },
  workspaceEyebrow: {
    color: "#175cd3",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0",
    textTransform: "uppercase",
  },
  workspaceTitle: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.15,
  },
  workspaceDescription: {
    margin: 0,
    color: "#475467",
    fontSize: "15px",
    lineHeight: 1.55,
  },
  workspaceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  workspaceCard: {
    display: "grid",
    gap: "8px",
    alignContent: "start",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "16px",
  },
  statusPill: {
    justifySelf: "start",
    border: "1px solid #b2ccff",
    borderRadius: "999px",
    background: "#eef4ff",
    color: "#175cd3",
    fontSize: "12px",
    fontWeight: 800,
    padding: "4px 8px",
  },
  workspaceCardTitle: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.25,
  },
  workspaceCardMeta: {
    margin: 0,
    color: "#667085",
    fontSize: "13px",
  },
  workspaceCardText: {
    margin: 0,
    color: "#344054",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  mediaCard: {
    display: "grid",
    overflow: "hidden",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#ffffff",
  },
  mediaPreview: {
    width: "100%",
    aspectRatio: "16 / 10",
    objectFit: "cover",
    background: "#eef2f6",
  },
  mediaBody: {
    display: "grid",
    gap: "5px",
    padding: "12px",
  },
  workspaceHistoryList: {
    display: "grid",
    gap: "12px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  emptyState: {
    display: "grid",
    gap: "8px",
    maxWidth: "560px",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "18px",
  },
  fieldGroup: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#344054",
    textTransform: "capitalize",
  },
  textarea: {
    minHeight: "120px",
    resize: "vertical",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    padding: "10px",
    font: "inherit",
  },
  input: {
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    padding: "10px",
    font: "inherit",
  },
  uploadButton: {
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#344054",
    fontWeight: 700,
    padding: "10px 14px",
    textAlign: "center",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
  },
  galleryCard: {
    display: "grid",
    gap: "6px",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "8px",
    textAlign: "left",
    font: "inherit",
  },
  galleryImage: {
    width: "100%",
    aspectRatio: "4 / 3",
    objectFit: "cover",
    borderRadius: "6px",
  },
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
  },
  iconChoice: {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "10px",
    textAlign: "left",
    font: "inherit",
  },
  historyTitle: {
    margin: "28px 0 12px",
    fontSize: "15px",
  },
  historyList: {
    display: "grid",
    gap: "10px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  historyItem: {
    display: "grid",
    gap: "4px",
    border: "1px solid #e4e7ec",
    borderRadius: "8px",
    padding: "10px",
  },
  historyValue: {
    display: "grid",
    gap: "4px",
    border: "1px solid #eef2f7",
    borderRadius: "8px",
    background: "#f8fafc",
    padding: "8px",
  },
  historyValueLabel: {
    color: "#344054",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  historyImage: {
    width: "72px",
    height: "52px",
    objectFit: "cover",
    borderRadius: "6px",
  },
} satisfies Record<string, React.CSSProperties>;
