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
});
