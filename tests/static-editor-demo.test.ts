import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("GitHub Pages editor demo", () => {
  it("keeps the demo static-export safe", () => {
    const packageJson = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const homePage = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");
    const aboutPage = readFileSync(join(process.cwd(), "src/app/about/page.tsx"), "utf8");

    expect(packageJson).not.toContain("@your-builder/editor");
    expect(homePage).not.toContain("force-dynamic");
    expect(aboutPage).not.toContain("force-dynamic");
  });

  it("vendors the platform editor so GitHub Pages can build the repo by itself", () => {
    const packageJson = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const shell = readFileSync(join(process.cwd(), "src/components/platform-editor-shell.tsx"), "utf8");
    const editorVendor = readFileSync(join(process.cwd(), "src/vendor/site-editor-platform/editor.tsx"), "utf8");
    const coreVendor = readFileSync(join(process.cwd(), "src/vendor/site-editor-platform/core.ts"), "utf8");

    expect(packageJson).not.toContain("../site-editor-platform");
    expect(shell).toContain("@/vendor/site-editor-platform/editor");
    expect(shell).toContain("@/vendor/site-editor-platform/core");
    expect(editorVendor).toContain("export function EditorShell");
    expect(editorVendor).toContain("data-builder-viewport-width");
    expect(coreVendor).toContain("export interface BuilderPage");
    expect(coreVendor).toContain("isBuilderPreviewMessage");
  });

  it("uses the shared platform editor route and iframe preview mode", () => {
    const route = readFileSync(join(process.cwd(), "src/app/admin/editor/page.tsx"), "utf8");
    const shell = readFileSync(join(process.cwd(), "src/components/platform-editor-shell.tsx"), "utf8");
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const nextConfig = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

    expect(route).toContain("PlatformEditorShell");
    expect(shell).toContain("@/vendor/site-editor-platform/editor");
    expect(shell).toContain("campaign-website-v1");
    expect(shell).toContain("userViewUrl");
    expect(shell).toContain("demoMode");
    expect(editor).toContain('searchParams.get("builderPreview") === "1"');
    expect(editor).toContain('document.body.classList.add("builder-preview-frame")');
    expect(editor).toContain('window.location.assign(`${siteBasePath()}/admin/editor/`)');
    expect(nextConfig).not.toContain('path.resolve(configDirectory, "..")');
  });

  it("supports typed zoom, full viewport dimensions, and demo history refresh", () => {
    const editorVendor = readFileSync(join(process.cwd(), "src/vendor/site-editor-platform/editor.tsx"), "utf8");
    const staticEditor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");

    expect(editorVendor).toContain("readDemoAuditLog");
    expect(editorVendor).toContain("campaign-v1-static-editor:history");
    expect(editorVendor).toContain("campaign-v1-static-editor:history-updated");
    expect(editorVendor).toContain("campaign-v1-static-editor:history-request");
    expect(editorVendor).toContain("isDemoHistoryMessage");
    expect(editorVendor).toContain("mapDemoAuditEvents(event.data.events)");
    expect(editorVendor).toContain("previewFrameRef.current?.contentWindow?.postMessage");
    expect(editorVendor).toContain("setDisplayedAuditLog(readDemoAuditLog())");
    expect(editorVendor).toContain("onClick={refreshDisplayedAuditLog}");
    expect(editorVendor).toContain("Custom zoom percent");
    expect(editorVendor).toContain("chooseZoomPercent");
    expect(editorVendor).toContain("{activeViewport.width}x{activeViewport.height}");
    expect(editorVendor).toContain("convertDemoEditToEditableValue");
    expect(staticEditor).toContain("historyMessageType");
    expect(staticEditor).toContain("historyRequestMessageType");
    expect(staticEditor).toContain("notifyParentOfAuditEvents(events)");
    expect(staticEditor).toContain("respondWithAuditLog");
    expect(staticEditor).toContain("saveMenuEditFromPointer");
    expect(staticEditor).toContain("onPointerDown={saveMenuEditFromPointer}");
    expect(staticEditor).toContain("window.parent.postMessage");
  });

  it("uses a generated media manifest for project image folders", () => {
    const shell = readFileSync(join(process.cwd(), "src/components/platform-editor-shell.tsx"), "utf8");
    const mediaManifest = readFileSync(join(process.cwd(), "src/generated/editor-media-assets.ts"), "utf8");
    const syncScript = readFileSync(join(process.cwd(), "scripts/sync-editor-assets.mjs"), "utf8");

    expect(shell).toContain("editorMediaAssets");
    expect(shell).toContain("mediaAssets={resolvedMediaAssets}");
    expect(mediaManifest).toContain("/builder-media/asw_carmenmorales/asw_carmenmorales_DZm65gWEY3Z_001.jpg");
    expect(mediaManifest).toContain("/builder-media/morales4assembly/morales4assembly_DVytjhIjQV7_001.jpg");
    expect(mediaManifest).toContain("/images/campaign/carmen-statehouse-leaders.jpg");
    expect(mediaManifest.match(/siteId: "campaign-website-v1"/g)?.length).toBeGreaterThanOrEqual(200);
    expect(syncScript).toContain("asw_carmenmorales");
    expect(syncScript).toContain("public/builder-media");
  });

  it("provides clickable editable placeholder posts in the hosted posts workspace", () => {
    const shell = readFileSync(join(process.cwd(), "src/components/platform-editor-shell.tsx"), "utf8");
    const postsWorkspace = readFileSync(join(process.cwd(), "src/components/editor-posts-workspace.tsx"), "utf8");
    const postManifest = readFileSync(join(process.cwd(), "src/generated/editor-posts.ts"), "utf8");

    expect(shell).toContain("EditorPostsWorkspace");
    expect(shell).toContain("postsWorkspace={<EditorPostsWorkspace");
    expect(postsWorkspace).toContain("onClick={() => selectPost(post.id)}");
    expect(postsWorkspace).toContain("Save post");
    expect(postsWorkspace).toContain("Create post");
    expect(postsWorkspace).toContain("Featured image");
    expect(postsWorkspace).toContain("Choose from media library");
    expect(postsWorkspace).toContain("Show full path");
    expect(postsWorkspace).toContain("outline: \"none\"");
    expect(postsWorkspace).toContain("Linked regions");
    expect(postsWorkspace).toContain("selectedPostId");
    expect(postManifest).toContain("source: \"site-scan\"");
    expect(postManifest).toContain("linkedRegionIds");
    expect(postManifest).toContain("news.hero.title");
  });

  it("renders non-empty workspace screens for posts, media, and history", () => {
    const editorVendor = readFileSync(join(process.cwd(), "src/vendor/site-editor-platform/editor.tsx"), "utf8");

    expect(editorVendor).toContain("renderWorkspaceContent");
    expect(editorVendor).toContain('data-builder-content-workspace="posts"');
    expect(editorVendor).toContain('data-builder-content-workspace="media"');
    expect(editorVendor).toContain('data-builder-content-workspace="history"');
    expect(editorVendor).toContain("Campaign updates");
    expect(editorVendor).toContain("Media library");
    expect(editorVendor).toContain("Change history");
    expect(editorVendor).not.toContain('activeWorkspace === "posts" && postsWorkspace');
  });

  it("exposes a footer editor button and a demo-aware credential modal", () => {
    const chrome = readFileSync(join(process.cwd(), "src/components/site-chrome.tsx"), "utf8");
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");

    expect(chrome).toContain("campaign-editor:open-login");
    expect(chrome).toContain("Edit site");
    expect(editor).toContain("GitHub Pages demo");
    expect(editor).toContain("Back to user view");
    expect(editor).toContain("Click text or images");
    expect(editor).toContain("pageOptions");
    expect(editor).toContain("sessionStorage");
    expect(editor).toContain('element.removeAttribute("srcset")');
    expect(editor).toContain("closeLoginFromBackdrop");
    expect(editor).toContain("event.target === event.currentTarget");
  });

  it("allows single-click editing and distinct image targets", () => {
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(editor).not.toContain("event.detail >= 2");
    expect(editor).toContain("openMenuForElement");
    expect(editor).toContain("demo-editable-image-target");
    expect(editor).toContain("demo-image-target-layer");
    expect(editor).toContain("demo-image-target-chip");
    expect(styles).toContain(".demo-editable-image-target");
    expect(styles).toContain(".demo-editable-text-target");
    expect(styles).toContain(".demo-image-target-layer");
    expect(styles).toContain(".demo-image-target-chip");
  });

  it("clips image target frames to the visible editor viewport", () => {
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");

    expect(editor).toContain("editorViewportTop");
    expect(editor).toContain("visibleBottom <= visibleTop");
    expect(editor).not.toContain("y: Math.max(96, rect.top)");
  });

  it("provides a demo media gallery and upload path for image swaps", () => {
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(editor).toContain("type MediaAsset");
    expect(editor).toContain("staticGalleryAssets");
    expect(editor).toContain("uploadedGalleryAssets");
    expect(editor).toContain('accept="image/*"');
    expect(editor).toContain("Open gallery");
    expect(editor).toContain("galleryOpen");
    expect(editor).toContain("demo-gallery-modal");
    expect(editor).toContain("demo-gallery-backdrop");
    expect(editor).toContain("aria-labelledby=\"demo-gallery-title\"");
    expect(editor).toContain("Choose from gallery");
    expect(editor).toContain("Upload image");
    expect(editor).toContain("FileReader");
    expect(editor).toContain("readAsDataURL");
    expect(styles).toContain(".demo-gallery-backdrop");
    expect(styles).toContain(".demo-gallery-modal");
    expect(styles).toContain(".demo-gallery-grid");
    expect(styles).toContain(".demo-gallery-card");
    expect(styles).toContain(".demo-upload-control");
  });

  it("logs editor changes and exposes rollback from change history", () => {
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(editor).toContain("type AuditEvent");
    expect(editor).toContain("historyStorageKey");
    expect(editor).toContain("appendAuditEvent");
    expect(editor).toContain("rollbackAuditEvent");
    expect(editor).toContain("Change history");
    expect(editor).toContain("Rollback");
    expect(editor).toContain("changedAt");
    expect(editor).toContain("oldValue");
    expect(editor).toContain("newValue");
    expect(editor).toContain("toLocaleString");
    expect(styles).toContain(".demo-history-modal");
    expect(styles).toContain(".demo-history-event");
    expect(styles).toContain(".demo-history-values");
  });

  it("shows image previews in history and allows rollback records to be undone", () => {
    const editor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(editor).toContain("renderHistoryValue");
    expect(editor).toContain("demo-history-image-preview");
    expect(editor).toContain("Undo rollback");
    expect(editor).toContain("Rollback recorded");
    expect(editor).toContain('event.action === "rollback"');
    expect(editor).toContain("withSiteBasePath(edit.src)");
    expect(styles).toContain(".demo-history-image-preview");
    expect(styles).toContain(".demo-history-rollback-actions");
    expect(styles).toContain(".demo-history-undo-button");
  });

  it("keeps history rollback actions the same width", () => {
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(styles).toContain("--demo-history-action-width");
    expect(styles).toContain("grid-template-columns: minmax(0, 1fr) minmax(240px, 0.85fr) var(--demo-history-action-width)");
    expect(styles).toContain("width: var(--demo-history-action-width)");
    expect(styles).toContain("box-sizing: border-box");
  });

  it("adds the requested editor UX polish for linking, media, history, and sidebar pages", () => {
    const editorVendor = readFileSync(join(process.cwd(), "src/vendor/site-editor-platform/editor.tsx"), "utf8");
    const staticEditor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");
    const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(editorVendor).toContain("pagesExpanded");
    expect(editorVendor).toContain("aria-label=\"Toggle pages list\"");
    expect(editorVendor).toContain("MediaAssetCard");
    expect(editorVendor).toContain("fullscreenAsset");
    expect(editorVendor).toContain("favoriteMediaStorageKey");
    expect(editorVendor).toContain("objectFit: \"contain\"");
    expect(editorVendor).toContain("formatAuditEventTitle");
    expect(editorVendor).toContain("Restore previous version");
    expect(editorVendor).toContain("requestDemoRollback");
    expect(editorVendor).toContain("campaign-v1-static-editor:rollback-request");

    expect(staticEditor).toContain("editorMediaAssets");
    expect(staticEditor).toContain("selectedRegions");
    expect(staticEditor).toContain("event.shiftKey");
    expect(staticEditor).toContain("linkSelectionToTarget");
    expect(staticEditor).toContain("Create post");
    expect(staticEditor).toContain("Link to URL");
    expect(staticEditor).toContain("Project page");
    expect(staticEditor).toContain("Existing post");
    expect(staticEditor).toContain("favoriteMediaStorageKey");
    expect(staticEditor).toContain("Selected image");
    expect(staticEditor).toContain("Show technical details");

    expect(styles).toContain(".demo-multi-select-panel");
    expect(styles).toContain(".demo-selected-link-region");
    expect(styles).toContain(".demo-selected-image-preview");
    expect(styles).toContain(".demo-favorite-button");
  });

  it("closes editor menus when clicking outside and prevents single and multi-select menus from overlapping", () => {
    const staticEditor = readFileSync(join(process.cwd(), "src/components/static-site-editor.tsx"), "utf8");

    expect(staticEditor).toContain("clearOpenEditorMenus");
    expect(staticEditor).toContain("clearSelectedRegionOutlines");
    expect(staticEditor).toContain("clickedInsideEditorUi");
    expect(staticEditor).toContain("if (!target) {");
    expect(staticEditor).toContain("clearOpenEditorMenus();");
    expect(staticEditor).toContain("selectedRegionsRef");
    expect(staticEditor).toContain("clearSelectedRegionOutlines(selectedRegionsRef.current);");
    expect(staticEditor).toContain("setLinkPanel(null);");
    expect(staticEditor).toContain("setMenu(null);");
  });
});
