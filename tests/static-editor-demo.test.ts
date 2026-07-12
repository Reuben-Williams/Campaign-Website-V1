import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("GitHub Pages editor demo", () => {
  it("keeps the demo static-export safe", () => {
    const packageJson = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const homePage = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");
    const aboutPage = readFileSync(join(process.cwd(), "src/app/about/page.tsx"), "utf8");

    expect(packageJson).not.toContain("@your-builder");
    expect(homePage).not.toContain("force-dynamic");
    expect(aboutPage).not.toContain("force-dynamic");
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
});
