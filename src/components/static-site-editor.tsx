"use client";

import { type ChangeEvent, FormEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";

type EditableKind = "text" | "image" | "link";

type StoredEdit =
  | { kind: "text"; text: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "link"; text: string; href: string };

type MenuState = {
  key: string;
  kind: EditableKind;
  x: number;
  y: number;
  text: string;
  href: string;
  src: string;
  alt: string;
};

type ImageTargetState = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  label: string;
  mimeType: string;
  source: "seed" | "upload";
};

const editStoragePrefix = "campaign-v1-static-editor";
const editorSessionKey = "campaign-v1-static-editor-active";
const editSelector =
  "main h1, main h2, main h3, main p, main blockquote, main a, main button, main time, main strong, main small, main span, footer p, footer a, header a, header nav a, img";

const staticGalleryAssets: MediaAsset[] = [
  {
    id: "seed:carmen-statehouse-leaders",
    src: "/images/campaign/carmen-statehouse-leaders.jpg",
    alt: "Carmen Morales standing with state leaders in an official State House setting.",
    label: "State House leaders",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:student-champions-assembly",
    src: "/images/campaign/student-champions-assembly.jpg",
    alt: "Students and community leaders recognized inside the Assembly chamber.",
    label: "Student champions",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:community-table-outreach",
    src: "/images/campaign/community-table-outreach.jpg",
    alt: "Campaign supporters greeting neighbors at an outdoor community table.",
    label: "Community outreach",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-with-community-leaders",
    src: "/images/campaign/carmen-with-community-leaders.jpg",
    alt: "Carmen Morales standing with community leaders at a local gathering.",
    label: "Community leaders",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-family-community",
    src: "/images/campaign/carmen-family-community.jpg",
    alt: "Carmen Morales connecting with a family at a community event.",
    label: "Family community event",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:education-graduation-continued",
    src: "/images/campaign/education-graduation-continued.jpg",
    alt: "A graduate facing a full stadium with a decorated cap about continuing forward.",
    label: "Education graduation",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:roundtable-listening-session",
    src: "/images/campaign/roundtable-listening-session.jpg",
    alt: "Residents and organizers gathered for a roundtable listening session.",
    label: "Listening session",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:bloomfield-community-visit",
    src: "/images/campaign/bloomfield-community-visit.jpg",
    alt: "Carmen Morales visiting with Bloomfield community members outdoors.",
    label: "Bloomfield visit",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:coffee-shop-event",
    src: "/images/campaign/coffee-shop-event.jpg",
    alt: "Community members gathered inside a coffee shop for a campaign event.",
    label: "Coffee shop event",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:podium-events-venue",
    src: "/images/campaign/podium-events-venue.jpg",
    alt: "A campaign event podium set up inside an event venue.",
    label: "Event podium",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:campaign-office-briefing",
    src: "/images/campaign/campaign-office-briefing.jpg",
    alt: "Campaign supporters attending a briefing inside a campaign office.",
    label: "Office briefing",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:local-endorsement-team",
    src: "/images/campaign/local-endorsement-team.jpg",
    alt: "Local supporters standing together with campaign signs.",
    label: "Endorsement team",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:community-supporters-venue",
    src: "/images/campaign/community-supporters-venue.jpg",
    alt: "Community supporters gathered together at a local venue.",
    label: "Supporters venue",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-neighborhood-conversation",
    src: "/images/campaign/carmen-neighborhood-conversation.jpg",
    alt: "Carmen Morales speaking with neighbors during a community conversation.",
    label: "Neighborhood talk",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:volunteer-team-morales",
    src: "/images/campaign/volunteer-team-morales.jpg",
    alt: "A Morales campaign volunteer recruitment graphic with team photos.",
    label: "Volunteer team",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-officials-chamber",
    src: "/images/campaign/carmen-officials-chamber.jpg",
    alt: "Carmen Morales with public officials inside a formal chamber.",
    label: "Officials chamber",
    mimeType: "image/jpeg",
    source: "seed",
  },
];

const pageOptions = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Issues", path: "/issues" },
  { label: "Events", path: "/events" },
  { label: "Endorsements", path: "/endorsements" },
  { label: "News", path: "/news" },
  { label: "Contact", path: "/contact" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Donate", path: "/donate" },
];

function siteBasePath() {
  return window.location.pathname.startsWith("/Campaign-Website-V1") ? "/Campaign-Website-V1" : "";
}

function withSiteBasePath(src: string) {
  if (!src || /^(https?:|data:|blob:)/.test(src)) return src;
  const base = siteBasePath();
  if (!base || !src.startsWith("/") || src.startsWith(`${base}/`)) return src;
  return `${base}${src}`;
}

function normalizedPath() {
  const base = siteBasePath();
  const fullPath = window.location.pathname.replace(/\/$/, "") || "/";
  const path = base && fullPath.startsWith(base) ? fullPath.slice(base.length) || "/" : fullPath;
  return path.endsWith("/admin/editor") ? "/" : path;
}

function navigateToPage(path: string) {
  const base = siteBasePath();
  window.location.href = `${base}${path === "/" ? "/" : `${path}/`}`;
}

function storageKey() {
  return `${editStoragePrefix}:${normalizedPath()}`;
}

function readEdits(): Record<string, StoredEdit> {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey()) ?? "{}") as Record<string, StoredEdit>;
  } catch {
    return {};
  }
}

function writeEdit(key: string, edit: StoredEdit) {
  const edits = readEdits();
  edits[key] = edit;
  window.localStorage.setItem(storageKey(), JSON.stringify(edits));
}

function elementKind(element: Element): EditableKind {
  if (element.tagName === "IMG") return "image";
  if (element.tagName === "A" || element.tagName === "BUTTON") return "link";
  return "text";
}

function editableElements() {
  return Array.from(document.querySelectorAll<HTMLElement>(editSelector)).filter((element) => {
    if (element.closest(".demo-editor-ui")) return false;
    if (element.closest(".mobile-bottom-nav")) return false;
    if (element.matches("script, style, noscript")) return false;
    if (element.tagName !== "IMG" && !element.textContent?.trim()) return false;
    return true;
  });
}

function assignEditableKeys() {
  const counts = new Map<string, number>();

  editableElements().forEach((element) => {
    const kind = elementKind(element);
    const base = `${normalizedPath()}:${kind}:${element.tagName.toLowerCase()}`;
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    element.dataset.demoEditableKey = `${base}:${count}`;
    element.dataset.demoEditableKind = kind;
  });
}

function applyStoredEdits() {
  const edits = readEdits();
  assignEditableKeys();

  editableElements().forEach((element) => {
    const key = element.dataset.demoEditableKey;
    if (!key) return;
    const edit = edits[key];
    if (!edit) return;

    if (edit.kind === "text") {
      element.textContent = edit.text;
    }

    if (edit.kind === "link") {
      element.textContent = edit.text;
      if (element instanceof HTMLAnchorElement) {
        element.href = edit.href;
      }
    }

    if (edit.kind === "image" && element instanceof HTMLImageElement) {
      element.removeAttribute("srcset");
      element.src = withSiteBasePath(edit.src);
      element.alt = edit.alt;
    }
  });
}

export function StaticSiteEditor() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageTargets, setImageTargets] = useState<ImageTargetState[]>([]);
  const [uploadedGalleryAssets, setUploadedGalleryAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState("Demo edits save in this browser only.");
  const selectedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const galleryAssets = [...uploadedGalleryAssets, ...staticGalleryAssets];

  function openMenuForElement(element: HTMLElement, clientX: number, clientY: number) {
    const kind = element.dataset.demoEditableKind as EditableKind | undefined;
    const key = element.dataset.demoEditableKey;
    if (!kind || !key) return;

    selectedElement.current = element;
    setMenu({
      key,
      kind,
      x: Math.min(clientX, window.innerWidth - 340),
      y: Math.min(clientY, window.innerHeight - 260),
      text: element.textContent?.trim() ?? "",
      href: element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "",
      src: element instanceof HTMLImageElement ? element.getAttribute("src") ?? "" : "",
      alt: element instanceof HTMLImageElement ? element.alt : "",
    });
  }

  function openImageTarget(key: string, x: number, y: number) {
    const element = document.querySelector<HTMLElement>(`[data-demo-editable-key="${CSS.escape(key)}"]`);
    if (element) {
      openMenuForElement(element, x, y);
    }
  }

  useEffect(() => {
    applyStoredEdits();
    let timeout: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(applyStoredEdits, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function openLogin() {
      setLoginOpen(true);
    }

    if (window.sessionStorage.getItem(editorSessionKey) === "true") {
      setActive(true);
      setStatus("Demo editor active. Click text or images to edit.");
    }

    window.addEventListener("campaign-editor:open-login", openLogin);
    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener("campaign-editor:open-login", openLogin);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("demo-editor-active", active);
    if (!active) {
      setMenu(null);
      setGalleryOpen(false);
      setImageTargets([]);
      return;
    }

    applyStoredEdits();
    document.querySelectorAll<HTMLElement>("[data-demo-editable-key]").forEach((element) => {
      element.classList.add("demo-editable-target");
      element.classList.add(
        element.dataset.demoEditableKind === "image" ? "demo-editable-image-target" : "demo-editable-text-target",
      );
      element.tabIndex = element.tabIndex < 0 ? 0 : element.tabIndex;
      element.title =
        element.dataset.demoEditableKind === "image"
          ? "Click to edit this image"
          : "Click to edit this content";
    });

    function refreshImageTargets() {
      const toolbarBottom =
        document.querySelector<HTMLElement>(".demo-editor-toolbar")?.getBoundingClientRect().bottom ?? 88;
      const editorViewportTop = toolbarBottom + 8;
      const viewportInset = 8;

      setImageTargets(
        Array.from(document.querySelectorAll<HTMLImageElement>('[data-demo-editable-kind="image"]'))
          .map((element) => {
            const key = element.dataset.demoEditableKey;
            const rect = element.getBoundingClientRect();
            const visibleLeft = Math.max(viewportInset, rect.left);
            const visibleTop = Math.max(editorViewportTop, rect.top);
            const visibleRight = Math.min(window.innerWidth - viewportInset, rect.right);
            const visibleBottom = Math.min(window.innerHeight - viewportInset, rect.bottom);
            const visibleWidth = visibleRight - visibleLeft;
            const visibleHeight = visibleBottom - visibleTop;

            if (!key || visibleRight <= visibleLeft || visibleBottom <= visibleTop) return null;
            if (visibleWidth < 24 || visibleHeight < 24) return null;

            return {
              key,
              x: visibleLeft,
              y: visibleTop,
              width: visibleWidth,
              height: visibleHeight,
              label: element.alt || "Image",
            };
          })
          .filter((target): target is ImageTargetState => target !== null),
      );
    }

    refreshImageTargets();

    function onPointer(event: MouseEvent) {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-demo-editable-key]") : null;
      if (!target || target.closest(".demo-editor-ui")) return;

      event.preventDefault();
      event.stopPropagation();
      openMenuForElement(target, event.clientX, event.clientY);
    }

    function blockNavigation(event: MouseEvent) {
      const anchor = event.target instanceof HTMLElement ? event.target.closest("a") : null;
      if (anchor && anchor.closest("[data-demo-editable-key]")) {
        event.preventDefault();
      }
    }

    document.addEventListener("click", blockNavigation, true);
    document.addEventListener("click", onPointer, true);
    document.addEventListener("dblclick", onPointer, true);
    window.addEventListener("resize", refreshImageTargets);
    window.addEventListener("scroll", refreshImageTargets, true);

    return () => {
      document.body.classList.remove("demo-editor-active");
      document.removeEventListener("click", blockNavigation, true);
      document.removeEventListener("click", onPointer, true);
      document.removeEventListener("dblclick", onPointer, true);
      window.removeEventListener("resize", refreshImageTargets);
      window.removeEventListener("scroll", refreshImageTargets, true);
      setImageTargets([]);
      document.querySelectorAll<HTMLElement>(".demo-editable-target").forEach((element) => {
        element.classList.remove("demo-editable-target");
        element.classList.remove("demo-editable-image-target");
        element.classList.remove("demo-editable-text-target");
        element.removeAttribute("title");
      });
    };
  }, [active]);

  useEffect(() => {
    if (!menu || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const nextX = Math.max(12, Math.min(menu.x, window.innerWidth - rect.width - 12));
    const nextY = Math.max(12, Math.min(menu.y, window.innerHeight - rect.height - 12));

    if (Math.abs(nextX - menu.x) > 1 || Math.abs(nextY - menu.y) > 1) {
      setMenu({ ...menu, x: nextX, y: nextY });
    }
  }, [menu]);

  function enterEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.sessionStorage.setItem(editorSessionKey, "true");
    setLoginOpen(false);
    setActive(true);
    setStatus("Demo editor active. Click text or images to edit.");
  }

  function closeLoginFromBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setLoginOpen(false);
    }
  }

  function exitEditor() {
    window.sessionStorage.removeItem(editorSessionKey);
    setActive(false);
  }

  function saveMenuEdit() {
    if (!menu || !selectedElement.current) return;
    const element = selectedElement.current;

    if (menu.kind === "text") {
      element.textContent = menu.text;
      writeEdit(menu.key, { kind: "text", text: menu.text });
    }

    if (menu.kind === "link") {
      element.textContent = menu.text;
      if (element instanceof HTMLAnchorElement) {
        element.href = menu.href;
      }
      writeEdit(menu.key, { kind: "link", text: menu.text, href: menu.href });
    }

    if (menu.kind === "image" && element instanceof HTMLImageElement) {
      element.removeAttribute("srcset");
      element.src = withSiteBasePath(menu.src);
      element.alt = menu.alt;
      writeEdit(menu.key, { kind: "image", src: menu.src, alt: menu.alt });
    }

    setStatus("Demo edit saved locally. It will remain in this browser until cleared.");
    setGalleryOpen(false);
    setMenu(null);
  }

  function clearEdits() {
    window.localStorage.removeItem(storageKey());
    window.location.reload();
  }

  function selectGalleryAsset(asset: MediaAsset) {
    if (!menu || menu.kind !== "image") return;

    setMenu({ ...menu, src: asset.src, alt: asset.alt });
    setGalleryOpen(false);
    setStatus(
      asset.source === "upload"
        ? `Selected uploaded image: ${asset.label}. Save locally to apply.`
        : `Selected gallery image: ${asset.label}. Save locally to apply.`,
    );
  }

  function uploadGalleryAsset(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Choose an image file such as PNG, JPEG, GIF, WebP, or SVG.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        setStatus("That image could not be loaded in the demo editor.");
        return;
      }

      const asset: MediaAsset = {
        id: `upload:${file.name}:${file.lastModified}`,
        src,
        alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        label: file.name,
        mimeType: file.type || "image/*",
        source: "upload",
      };

      setUploadedGalleryAssets((assets) => [asset, ...assets.filter((item) => item.id !== asset.id)]);
      setMenu((current) => (current?.kind === "image" ? { ...current, src: asset.src, alt: asset.alt } : current));
      setStatus(`Uploaded ${file.name}. Save locally to apply this image.`);
    };
    reader.readAsDataURL(file);
  }

  function closeGalleryFromBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setGalleryOpen(false);
    }
  }

  return (
    <>
      {loginOpen ? (
        <div
          className="demo-editor-ui demo-login-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-login-title"
          onMouseDown={closeLoginFromBackdrop}
        >
          <form className="demo-login-modal" onSubmit={enterEditor}>
            <p className="demo-kicker">GitHub Pages demo</p>
            <h2 id="demo-login-title">Sign in to edit the site</h2>
            <p>This preview accepts any email and password. Real client sites will use protected owner accounts.</p>
            <label>
              Email
              <input type="email" name="email" required placeholder="owner@example.com" />
            </label>
            <label>
              Password
              <input type="password" name="password" required placeholder="Demo password" />
            </label>
            <div className="demo-login-actions">
              <button type="button" onClick={() => setLoginOpen(false)}>
                Cancel
              </button>
              <button type="submit">Enter editor</button>
            </div>
          </form>
        </div>
      ) : null}

      {active ? (
        <div className="demo-editor-ui demo-editor-toolbar" aria-live="polite">
          <div>
            <strong>Site editor demo</strong>
            <span>{status}</span>
          </div>
          <label>
            Page
            <select value={normalizedPath()} onChange={(event) => navigateToPage(event.target.value)}>
              {pageOptions.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={clearEdits}>
            Clear demo edits
          </button>
          <button type="button" onClick={exitEditor}>
            Back to user view
          </button>
        </div>
      ) : null}

      {active
        ? imageTargets.map((target) => (
            <div
              className="demo-editor-ui demo-image-target-layer"
              key={target.key}
              style={{ left: target.x, top: target.y, width: target.width, height: target.height }}
              aria-hidden="true"
            >
              <button
                className="demo-image-target-chip"
                type="button"
                title={target.label}
                onClick={() => openImageTarget(target.key, target.x + 18, target.y + 42)}
              >
                Image
              </button>
            </div>
          ))
        : null}

      {menu ? (
        <div
          ref={menuRef}
          className="demo-editor-ui demo-context-menu"
          style={{ left: menu.x, top: menu.y, maxHeight: `calc(100vh - ${menu.y + 12}px)` }}
        >
          <p className="demo-kicker">{menu.kind} tools</p>
          {(menu.kind === "text" || menu.kind === "link") && (
            <label>
              Text
              <textarea value={menu.text} onChange={(event) => setMenu({ ...menu, text: event.target.value })} />
            </label>
          )}
          {menu.kind === "link" && (
            <label>
              Link destination
              <input value={menu.href} onChange={(event) => setMenu({ ...menu, href: event.target.value })} />
            </label>
          )}
          {menu.kind === "image" && (
            <>
              <label>
                Image path
                <input value={menu.src} onChange={(event) => setMenu({ ...menu, src: event.target.value })} />
              </label>
              <label>
                Alt text
                <textarea value={menu.alt} onChange={(event) => setMenu({ ...menu, alt: event.target.value })} />
              </label>
              <div className="demo-gallery-panel">
                <div>
                  <strong>Gallery</strong>
                  <span>Browse all uploaded and demo images in a larger media window.</span>
                </div>
                <button className="demo-gallery-open-button" type="button" onClick={() => setGalleryOpen(true)}>
                  Open gallery
                </button>
                <label className="demo-upload-control">
                  Upload image
                  <input type="file" accept="image/*" onChange={uploadGalleryAsset} />
                </label>
              </div>
            </>
          )}
          <div className="demo-context-actions">
            <button
              type="button"
              onClick={() => {
                setGalleryOpen(false);
                setMenu(null);
              }}
            >
              Cancel
            </button>
            <button type="button" onClick={saveMenuEdit}>
              Save locally
            </button>
          </div>
        </div>
      ) : null}

      {galleryOpen && menu?.kind === "image" ? (
        <div
          className="demo-editor-ui demo-gallery-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-gallery-title"
          onMouseDown={closeGalleryFromBackdrop}
        >
          <section className="demo-gallery-modal">
            <div className="demo-gallery-modal-header">
              <div>
                <p className="demo-kicker">Media library</p>
                <h2 id="demo-gallery-title">Choose from gallery</h2>
                <span>Demo media now. Backend media records can replace this same asset shape later.</span>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)}>
                Close
              </button>
            </div>
            <label className="demo-upload-control demo-gallery-upload">
              Upload image
              <input type="file" accept="image/*" onChange={uploadGalleryAsset} />
            </label>
            <div className="demo-gallery-grid">
              {galleryAssets.map((asset) => (
                <button
                  className="demo-gallery-card"
                  key={asset.id}
                  type="button"
                  onClick={() => selectGalleryAsset(asset)}
                  title={`${asset.label} (${asset.mimeType})`}
                >
                  <img src={withSiteBasePath(asset.src)} alt="" />
                  <span>{asset.label}</span>
                  <small>{asset.source === "upload" ? "Uploaded image" : "Demo gallery"}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
